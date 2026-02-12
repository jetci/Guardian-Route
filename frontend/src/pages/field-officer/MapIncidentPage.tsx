import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../../components/common';
import { incidentsApi, type Incident } from '../../api/incidents';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Layers, Navigation, Plus, Map as MapIcon, ChevronUp, ChevronDown, Flame, Search } from 'lucide-react';

// Custom Marker Styles (Inline)
const MARKER_STYLES = `
  .custom-marker-pin {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 3px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 800;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .custom-marker-pin:active {
    transform: scale(0.9);
  }
  .incident-popup .leaflet-popup-content-wrapper {
    border-radius: 16px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }
  .incident-popup .leaflet-popup-content {
    margin: 0;
    width: 260px !important;
  }
`;

interface IncidentWithLocation extends Incident {
  lat?: number;
  lng?: number;
  severity: number;
}

export function MapIncidentPage() {
  const navigate = useNavigate();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const [allIncidents, setAllIncidents] = useState<IncidentWithLocation[]>([]);
  const [filteredIncidents, setFilteredIncidents] = useState<IncidentWithLocation[]>([]);
  const [filterType, setFilterType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false); // Bottom sheet state

  // Load incidents
  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentsApi.getAll();
      const incidentsWithLocation: IncidentWithLocation[] = data.map(incident => {
        const lat = incident.location?.coordinates?.[1];
        const lng = incident.location?.coordinates?.[0];
        let severity = 3;
        switch (incident.priority) {
          case 'CRITICAL': severity = 5; break; // Keep CRITICAL mapping from API
          case 'HIGH': severity = 4; break;
          case 'MEDIUM': severity = 3; break;
          case 'LOW': severity = 2; break;
          // Default handled by initialization
        }
        return { ...incident, lat, lng, severity };
      }).filter(inc => inc.lat != null && inc.lng != null);

      setAllIncidents(incidentsWithLocation);
      setFilteredIncidents(incidentsWithLocation);
    } catch (err: any) {
      setError(err.message);
      toast.error('โหลดข้อมูลผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (loading || error) return;
    const mapElement = document.getElementById('mobile-incident-map');
    if (!mapElement || mapRef.current) return;

    // Inject styles
    const styleSheet = document.createElement("style");
    styleSheet.innerText = MARKER_STYLES;
    document.head.appendChild(styleSheet);

    const mapInstance = L.map('mobile-incident-map', {
      zoomControl: false // Disable default zoom control for custom mobile UI
    }).setView([19.9422, 99.2195], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(mapInstance);

    mapRef.current = mapInstance;

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [loading, error]);

  // Update Markers
  useEffect(() => {
    if (!mapRef.current) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    filteredIncidents.forEach(incident => {
      const color = getSeverityColor(incident.severity);
      const markerHtml = `<div class="custom-marker-pin" style="background: ${color};">${incident.severity}</div>`;

      const marker = L.marker([incident.lat!, incident.lng!], {
        icon: L.divIcon({ className: 'custom-marker', html: markerHtml, iconSize: [36, 36], iconAnchor: [18, 18] })
      }).addTo(mapRef.current!);

      const popupContent = `
        <div style="font-family: 'Sarabun', sans-serif;">
            <div style="background: ${color}; padding: 12px; color: white;">
                <h4 style="margin: 0; font-size: 16px; font-weight: 700;">${incident.title}</h4>
            </div>
            <div style="padding: 12px;">
                <p style="margin: 0 0 8px; color: #64748b; font-size: 13px; display: flex; align-items: center; gap: 4px;">
                    📍 ${incident.address || 'ไม่ระบุพิกัด'}
                </p>
                <div style="display: flex; gap: 8px;">
                    <span style="font-size: 11px; padding: 2px 8px; background: #f1f5f9; border-radius: 10px; color: #475569; font-weight: 600;">
                        ระดับ ${incident.severity}
                    </span>
                    <span style="font-size: 11px; padding: 2px 8px; background: #f1f5f9; border-radius: 10px; color: #475569; font-weight: 600;">
                        ${new Date(incident.reportedAt).toLocaleDateString('th-TH')}
                    </span>
                </div>
            </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        mapRef.current?.flyTo([incident.lat!, incident.lng!], 16);
        setSheetOpen(false); // Close sheet to see map
      });

      markersRef.current.push(marker);
    });
  }, [filteredIncidents]);

  const getSeverityColor = (severity: number) => {
    if (severity >= 5) return '#ef4444';
    if (severity >= 4) return '#f97316';
    if (severity >= 3) return '#eab308';
    return '#22c55e';
  };

  const handleFilter = (type: string) => {
    setFilterType(type);
    if (type === 'ALL') setFilteredIncidents(allIncidents);
    else setFilteredIncidents(allIncidents.filter(i => i.disasterType === type));
  };

  if (loading) return <DashboardLayout><div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><LoadingSpinner size="lg" /></div></DashboardLayout>;
  if (error) return <DashboardLayout><ErrorMessage message={error} onRetry={loadIncidents} centered /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ position: 'relative', height: 'calc(100vh - 64px)', overflow: 'hidden', background: '#e2e8f0' }}>

        {/* --- MAP LAYER --- */}
        <div id="mobile-incident-map" style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* --- TOP CONTROLS (Floating) --- */}
        <div style={{ position: 'absolute', top: 16, left: 16, right: 16, zIndex: 10, display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['ALL', 'FLOOD', 'FIRE', 'STORM', 'LANDSLIDE'].map(type => (
            <button
              key={type}
              onClick={() => handleFilter(type)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none',
                background: filterType === type ? '#2563eb' : 'white',
                color: filterType === type ? 'white' : '#64748b',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {type === 'ALL' ? 'ทั้งหมด' : type}
            </button>
          ))}
        </div>

        {/* --- RIGHT CONTROLS --- */}
        <div style={{ position: 'absolute', top: 80, right: 16, zIndex: 10, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <motion.div role="button" tabIndex={0} whileTap={{ scale: 0.9 }} onClick={() => mapRef.current?.zoomIn()} style={fabStyle}><Plus size={24} /></motion.div>
          <motion.div role="button" tabIndex={0} whileTap={{ scale: 0.9 }} onClick={() => mapRef.current?.locate({ setView: true })} style={fabStyle}><Navigation size={24} /></motion.div>
          <motion.div role="button" tabIndex={0} whileTap={{ scale: 0.9 }} onClick={() => setSheetOpen(true)} style={{ ...fabStyle, background: '#2563eb', color: 'white' }}><Layers size={24} /></motion.div>
        </div>

        {/* --- FLOATING ACTION BUTTON (ADD) --- */}
        <motion.div
          role="button"
          tabIndex={0}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/create-incident')}
          style={{
            position: 'absolute', bottom: sheetOpen ? 340 : 100, right: 16, zIndex: 20,
            width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            border: 'none', color: 'white', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 16px rgba(220, 38, 38, 0.4)', transition: 'bottom 0.3s ease', cursor: 'pointer'
          }}
        >
          <Plus size={32} strokeWidth={3} />
        </motion.div>

        {/* --- BOTTOM SHEET (Incident List) --- */}
        <motion.div
          initial={{ y: '85%' }}
          animate={{ y: sheetOpen ? '10%' : '85%' }}
          transition={{ type: 'spring', damping: 20 }}
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: '80%',
            background: 'white', borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
            zIndex: 30, boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
          }}
        >
          {/* Handle Bar */}
          <div
            onClick={() => setSheetOpen(!sheetOpen)}
            style={{ width: '100%', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab' }}
          >
            <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '2px' }} />
          </div>

          {/* Header */}
          <div style={{ padding: '0 24px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b' }}>รายการเหตุการณ์</h3>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', background: '#f1f5f9', padding: '4px 10px', borderRadius: '20px' }}>
              {filteredIncidents.length} รายการ
            </span>
          </div>

          {/* List */}
          <div style={{ height: 'calc(100% - 90px)', overflowY: 'auto', padding: '16px 20px 80px' }}>
            {filteredIncidents.length === 0 ? (
              <EmptyState icon="map" title="ไม่พบเหตุการณ์" description="ลองเปลี่ยนตัวกรองดูนะครับ" />
            ) : (
              filteredIncidents.map(inc => (
                <div key={inc.id} onClick={() => { mapRef.current?.flyTo([inc.lat!, inc.lng!], 16); setSheetOpen(false); }} style={{
                  padding: '16px', marginBottom: '12px', background: '#fff', border: '1px solid #f1f5f9',
                  borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', display: 'flex', gap: '16px', cursor: 'pointer'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', background: getSeverityColor(inc.severity) + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: getSeverityColor(inc.severity) }}>{inc.severity}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{inc.title}</h4>
                      {inc.priority === 'CRITICAL' && <Flame size={16} fill="#ef4444" color="#ef4444" />}
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapIcon size={12} /> {inc.address || 'ไม่ระบุพิกัด'}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}

const fabStyle = {
  width: '48px', height: '48px', borderRadius: '50%', background: 'white',
  // border: 'none', // motion.div doesn't have border prop by default in styles usually but CSS handles it
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', color: '#475569', cursor: 'pointer'
};
