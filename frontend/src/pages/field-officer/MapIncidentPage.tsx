import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/common';
import { incidentsApi, type Incident } from '../../api/incidents';
import toast from 'react-hot-toast';
import './MapIncidentPage.css';


interface IncidentWithLocation extends Incident {
  lat?: number;
  lng?: number;
  severity: number; // Mapped from priority
}

export function MapIncidentPage() {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [allIncidents, setAllIncidents] = useState<IncidentWithLocation[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentWithLocation[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load incidents from API
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await incidentsApi.getAll();

      // Map incidents with location data and severity from priority
      const incidentsWithLocation: IncidentWithLocation[] = data.map(incident => {
        // Extract coordinates from GeoJSON Point [lng, lat]
        const lat = incident.location?.coordinates?.[1]; // latitude is second
        const lng = incident.location?.coordinates?.[0]; // longitude is first

        // Map priority to severity (1-5 scale)
        let severity = 3; // default medium
        switch (incident.priority) {
          case 'CRITICAL':
            severity = 5;
            break;
          case 'HIGH':
            severity = 4;
            break;
          case 'MEDIUM':
            severity = 3;
            break;
          case 'LOW':
            severity = 2;
            break;
        }

        return {
          ...incident,
          lat,
          lng,
          severity,
        };
      }).filter(inc => inc.lat != null && inc.lng != null); // Only show incidents with valid coordinates

      setAllIncidents(incidentsWithLocation);
      setFilteredIncidents(incidentsWithLocation);
      console.log('✅ Loaded incidents:', incidentsWithLocation.length);
    } catch (err: any) {
      console.error('❌ Failed to load incidents:', err);
      setError(err.message || 'ไม่สามารถโหลดข้อมูลเหตุการณ์ได้');
      toast.error('ไม่สามารถโหลดข้อมูลเหตุการณ์ได้');
    } finally {
      setLoading(false);
    }
  };

  // Initialize map
  useEffect(() => {
    // Don't initialize map if still loading or if there's an error
    if (loading || error) return;

    // Check if element exists before initializing
    const mapElement = document.getElementById('incident-map');
    if (!mapElement) return;

    if (!mapRef.current) {
      const mapInstance = L.map('incident-map').setView([19.9422, 99.2195], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstance);

      mapRef.current = mapInstance;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loading, error]); // Add dependencies

  // Add markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    filteredIncidents.forEach(incident => {
      const iconColor = getSeverityColor(incident.severity);

      const marker = L.marker([incident.lat!, incident.lng!], {
        icon: L.divIcon({
          className: 'custom-marker',
          html: `<div style="background: ${iconColor}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${incident.severity}</div>`,
          iconSize: [30, 30]
        })
      }).addTo(mapRef.current!);

      // Popup
      const popupContent = `
        <div class="incident-popup">
          <h4>${incident.title}</h4>
          <p><strong>📍</strong> ${incident.address || 'ไม่ระบุที่อยู่'}</p>
          <p><strong>📅</strong> ${new Date(incident.reportedAt).toLocaleDateString('th-TH')}</p>
          <p><strong>⚠️</strong> ระดับ ${incident.severity}</p>
          <p><strong>สถานะ:</strong> ${incident.status === 'IN_PROGRESS' ? '🔴 ดำเนินการอยู่' : incident.status === 'RESOLVED' ? '🟢 แก้ไขแล้ว' : '⚪ รอดำเนินการ'}</p>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Click to fly
      marker.on('click', () => {
        mapRef.current?.flyTo([incident.lat!, incident.lng!], 15);
      });

      markersRef.current.push(marker);
    });
  }, [filteredIncidents]);

  const getSeverityColor = (severity: number) => {
    if (severity >= 5) return '#dc2626'; // Red
    if (severity >= 4) return '#f97316'; // Orange
    if (severity >= 3) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  const handleFilterChange = (type: string) => {
    setFilterType(type);
    if (type === 'ALL') {
      setFilteredIncidents(allIncidents);
    } else {
      setFilteredIncidents(allIncidents.filter(inc => inc.disasterType === type));
    }
  };

  const handleIncidentClick = (incident: IncidentWithLocation) => {
    if (mapRef.current && incident.lat && incident.lng) {
      mapRef.current.flyTo([incident.lat, incident.lng], 15);
    }
  };


  // Show loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="map-incident-page">
          <LoadingSpinner size="lg" message="กำลังโหลดข้อมูลเหตุการณ์..." centered />
        </div>
      </DashboardLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="map-incident-page">
          <ErrorMessage
            title="ไม่สามารถโหลดข้อมูลได้"
            message={error}
            onRetry={loadIncidents}
            centered
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="map-incident-page">

        {/* Sidebar */}
        <aside className={`map-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h3>🗺️ แผนที่เหตุการณ์</h3>
            <button
              className="toggle-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>

          {sidebarOpen && (
            <>
              {/* Legend */}
              <div className="legend">
                <h4>สัญลักษณ์</h4>
                <div className="legend-item">
                  <span className="legend-icon" style={{ background: '#dc2626' }}>5</span>
                  <span>วิกฤต</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon" style={{ background: '#f97316' }}>4</span>
                  <span>รุนแรงมาก</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon" style={{ background: '#eab308' }}>3</span>
                  <span>ปานกลาง</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon" style={{ background: '#22c55e' }}>1-2</span>
                  <span>เล็กน้อย</span>
                </div>
              </div>

              {/* Filters */}
              <div className="filters">
                <h4>กรองตามประเภท</h4>
                <select value={filterType} onChange={(e) => handleFilterChange(e.target.value)}>
                  <option value="ALL">ทั้งหมด ({allIncidents.length})</option>
                  <option value="FLOOD">น้ำท่วม</option>
                  <option value="LANDSLIDE">ดินถลม</option>
                  <option value="STORM">วาตภัย</option>
                  <option value="FIRE">อัคคีภัย</option>
                </select>
              </div>

              {/* Incident List */}
              <div className="incident-list">
                <h4>รายการเหตุการณ์ ({filteredIncidents.length})</h4>
                {filteredIncidents.map(incident => (
                  <div
                    key={incident.id}
                    className="incident-item"
                    onClick={() => handleIncidentClick(incident)}
                  >
                    <div className="incident-header">
                      <span className="severity-badge" style={{ background: getSeverityColor(incident.severity) }}>
                        {incident.severity}
                      </span>
                      <h5>{incident.title}</h5>
                    </div>
                    <p className="incident-location">📍 {incident.address || 'ไม่ระบุที่อยู่'}</p>
                    <p className="incident-date">📅 {new Date(incident.reportedAt).toLocaleDateString('th-TH')}</p>
                    <span className={`status-badge ${incident.status.toLowerCase()}`}>
                      {incident.status === 'IN_PROGRESS' ? '🔴 ดำเนินการอยู่' : incident.status === 'RESOLVED' ? '🟢 แก้ไขแล้ว' : '⚪ รอดำเนินการ'}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Map Container */}
        <div className="map-container">
          <div id="incident-map"></div>

          {/* Floating Action Button */}
          <button
            className="fab"
            onClick={() => navigate('/field-survey/new')}
            title="สร้างรายงานใหม่"
          >
            ➕
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
