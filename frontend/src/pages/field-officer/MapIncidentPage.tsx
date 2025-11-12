import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import './MapIncidentPage.css';

// Mock incidents data - 20 หมู่บ้าน ตำบลเวียง อำเภอฝาง
const mockIncidents = [
  {
    id: 1,
    title: "น้ำท่วม - บ้านหนองตุ้ม",
    location: "บ้านหนองตุ้ม หมู่ 1 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 5,
    lat: 19.9550,
    lng: 99.2250,
    date: "2025-11-10",
    status: "ACTIVE"
  },
  {
    id: 2,
    title: "ดินถลม - บ้านป่าบง",
    location: "บ้านป่าบง หมู่ 2 ต.เวียง อ.ฝาง",
    type: "LANDSLIDE",
    severity: 4,
    lat: 19.9500,
    lng: 99.2100,
    date: "2025-11-09",
    status: "ACTIVE"
  },
  {
    id: 3,
    title: "น้ำท่วม - บ้านเต๋าดิน",
    location: "บ้านเต๋าดิน (เวียงสุทโธ) หมู่ 3 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 3,
    lat: 19.9422,
    lng: 99.2195,
    date: "2025-11-11",
    status: "RESOLVED"
  },
  {
    id: 4,
    title: "วาตภัย - บ้านสวนดอก",
    location: "บ้านสวนดอก หมู่ 4 ต.เวียง อ.ฝาง",
    type: "STORM",
    severity: 2,
    lat: 19.9450,
    lng: 99.2300,
    date: "2025-11-08",
    status: "RESOLVED"
  },
  {
    id: 5,
    title: "อัคคีภัย - บ้านต้นหนุน",
    location: "บ้านต้นหนุน หมู่ 5 ต.เวียง อ.ฝาง",
    type: "FIRE",
    severity: 4,
    lat: 19.9350,
    lng: 99.2150,
    date: "2025-11-07",
    status: "ACTIVE"
  },
  {
    id: 6,
    title: "น้ำท่วม - บ้านสันทรายคองน้อย",
    location: "บ้านสันทรายคองน้อย หมู่ 6 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 3,
    lat: 19.9400,
    lng: 99.2050,
    date: "2025-11-06",
    status: "ACTIVE"
  },
  {
    id: 7,
    title: "น้ำท่วม - บ้านแม่ใจใต้",
    location: "บ้านแม่ใจใต้ หมู่ 7 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 5,
    lat: 19.9300,
    lng: 99.2200,
    date: "2025-11-05",
    status: "ACTIVE"
  },
  {
    id: 8,
    title: "น้ำท่วม - บ้านแม่ใจเหนือ",
    location: "บ้านแม่ใจเหนือ หมู่ 8 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 4,
    lat: 19.9330,
    lng: 99.2250,
    date: "2025-11-04",
    status: "RESOLVED"
  },
  {
    id: 9,
    title: "ดินถลม - บ้านริมฝาง",
    location: "บ้านริมฝาง (สันป่าไหน่) หมู่ 9 ต.เวียง อ.ฝาง",
    type: "LANDSLIDE",
    severity: 5,
    lat: 19.9600,
    lng: 99.2200,
    date: "2025-11-03",
    status: "ACTIVE"
  },
  {
    id: 10,
    title: "วาตภัย - บ้านห้วยเฮี่ยน",
    location: "บ้านห้วยเฮี่ยน (สันป่ายางยาง) หมู่ 10 ต.เวียง อ.ฝาง",
    type: "STORM",
    severity: 3,
    lat: 19.9570,
    lng: 99.2100,
    date: "2025-11-02",
    status: "RESOLVED"
  },
  {
    id: 11,
    title: "น้ำท่วม - บ้านท่าสะแล",
    location: "บ้านท่าสะแล หมู่ 11 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 2,
    lat: 19.9250,
    lng: 99.2100,
    date: "2025-11-01",
    status: "RESOLVED"
  },
  {
    id: 12,
    title: "ดินถลม - บ้านโป่งถืบ",
    location: "บ้านโป่งถืบ หมู่ 12 ต.เวียง อ.ฝาง",
    type: "LANDSLIDE",
    severity: 4,
    lat: 19.9530,
    lng: 99.2350,
    date: "2025-10-31",
    status: "ACTIVE"
  },
  {
    id: 13,
    title: "น้ำท่วม - บ้านห้วยบอน",
    location: "บ้านห้วยบอน หมู่ 13 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 3,
    lat: 19.9370,
    lng: 99.2300,
    date: "2025-10-30",
    status: "RESOLVED"
  },
  {
    id: 14,
    title: "วาตภัย - บ้านเสาหิน",
    location: "บ้านเสาหิน หมู่ 14 ต.เวียง อ.ฝาง",
    type: "STORM",
    severity: 2,
    lat: 19.9300,
    lng: 99.2350,
    date: "2025-10-29",
    status: "RESOLVED"
  },
  {
    id: 15,
    title: "อัคคีภัย - บ้านโป่งถืบใน",
    location: "บ้านโป่งถืบใน หมู่ 15 ต.เวียง อ.ฝาง",
    type: "FIRE",
    severity: 3,
    lat: 19.9630,
    lng: 99.2300,
    date: "2025-10-28",
    status: "ACTIVE"
  },
  {
    id: 16,
    title: "น้ำท่วม - บ้านปางผึ้ง",
    location: "บ้านปางผึ้ง หมู่ 16 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 4,
    lat: 19.9270,
    lng: 99.2000,
    date: "2025-10-27",
    status: "ACTIVE"
  },
  {
    id: 17,
    title: "ดินถลม - บ้านใหม่คองน้อย",
    location: "บ้านใหม่คองน้อย หมู่ 17 ต.เวียง อ.ฝาง",
    type: "LANDSLIDE",
    severity: 3,
    lat: 19.9430,
    lng: 99.2030,
    date: "2025-10-26",
    status: "RESOLVED"
  },
  {
    id: 18,
    title: "น้ำท่วม - บ้านศรีดอนชัย",
    location: "บ้านศรีดอนชัย หมู่ 18 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 5,
    lat: 19.9650,
    lng: 99.2150,
    date: "2025-10-25",
    status: "ACTIVE"
  },
  {
    id: 19,
    title: "วาตภัย - บ้านใหม่ชยาราม",
    location: "บ้านใหม่ชยาราม หมู่ 19 ต.เวียง อ.ฝาง",
    type: "STORM",
    severity: 2,
    lat: 19.9230,
    lng: 99.2250,
    date: "2025-10-24",
    status: "RESOLVED"
  },
  {
    id: 20,
    title: "น้ำท่วม - บ้านสระนิคม",
    location: "บ้านสระนิคม หมู่ 20 ต.เวียง อ.ฝาง",
    type: "FLOOD",
    severity: 4,
    lat: 19.9470,
    lng: 99.2400,
    date: "2025-10-23",
    status: "ACTIVE"
  }
];

export function MapIncidentPage() {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  
  const [filteredIncidents, setFilteredIncidents] = useState(mockIncidents);
  const [filterType, setFilterType] = useState('ALL');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize map
  useEffect(() => {
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
  }, []);

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
      
      const marker = L.marker([incident.lat, incident.lng], {
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
          <p><strong>📍</strong> ${incident.location}</p>
          <p><strong>📅</strong> ${incident.date}</p>
          <p><strong>⚠️</strong> ระดับ ${incident.severity}</p>
          <p><strong>สถานะ:</strong> ${incident.status === 'ACTIVE' ? '🔴 ดำเนินการอยู่' : '🟢 แก้ไขแล้ว'}</p>
        </div>
      `;
      
      marker.bindPopup(popupContent);

      // Click to fly
      marker.on('click', () => {
        mapRef.current?.flyTo([incident.lat, incident.lng], 15);
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
      setFilteredIncidents(mockIncidents);
    } else {
      setFilteredIncidents(mockIncidents.filter(inc => inc.type === type));
    }
  };

  const handleIncidentClick = (incident: typeof mockIncidents[0]) => {
    if (mapRef.current) {
      mapRef.current.flyTo([incident.lat, incident.lng], 15);
    }
  };

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
                  <span className="legend-icon" style={{background: '#dc2626'}}>5</span>
                  <span>วิกฤต</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon" style={{background: '#f97316'}}>4</span>
                  <span>รุนแรงมาก</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon" style={{background: '#eab308'}}>3</span>
                  <span>ปานกลาง</span>
                </div>
                <div className="legend-item">
                  <span className="legend-icon" style={{background: '#22c55e'}}>1-2</span>
                  <span>เล็กน้อย</span>
                </div>
              </div>

              {/* Filters */}
              <div className="filters">
                <h4>กรองตามประเภท</h4>
                <select value={filterType} onChange={(e) => handleFilterChange(e.target.value)}>
                  <option value="ALL">ทั้งหมด ({mockIncidents.length})</option>
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
                      <span className="severity-badge" style={{background: getSeverityColor(incident.severity)}}>
                        {incident.severity}
                      </span>
                      <h5>{incident.title}</h5>
                    </div>
                    <p className="incident-location">📍 {incident.location}</p>
                    <p className="incident-date">📅 {incident.date}</p>
                    <span className={`status-badge ${incident.status.toLowerCase()}`}>
                      {incident.status === 'ACTIVE' ? '🔴 ดำเนินการอยู่' : '🟢 แก้ไขแล้ว'}
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
