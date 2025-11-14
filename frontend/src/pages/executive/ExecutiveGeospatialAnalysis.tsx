import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Village data from ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
interface Village {
  id: number;
  name: string;
  lat: number;
  lng: number;
  riskLevel: 'สูง' | 'กลาง' | 'ต่ำ';
  incidents: number;
  population: number;
  lastIncident: string;
}

const VILLAGES: Village[] = [
  { id: 1, name: 'หนองตุ้ม', lat: 20.02, lng: 99.25, riskLevel: 'สูง', incidents: 8, population: 450, lastIncident: '2025-11-12' },
  { id: 2, name: 'ป่าบง', lat: 19.95, lng: 99.28, riskLevel: 'สูง', incidents: 7, population: 520, lastIncident: '2025-11-11' },
  { id: 3, name: 'ริมฝาง (สันป่าไหน่)', lat: 19.96, lng: 99.12, riskLevel: 'สูง', incidents: 6, population: 380, lastIncident: '2025-11-10' },
  { id: 4, name: 'โป่งถืบ', lat: 19.94, lng: 99.25, riskLevel: 'กลาง', incidents: 5, population: 410, lastIncident: '2025-11-08' },
  { id: 5, name: 'แม่ใจใต้', lat: 19.93, lng: 99.20, riskLevel: 'กลาง', incidents: 5, population: 390, lastIncident: '2025-11-07' },
  { id: 6, name: 'เต๋าดิน (เวียงสุทโธ)', lat: 19.92, lng: 99.30, riskLevel: 'กลาง', incidents: 4, population: 360, lastIncident: '2025-11-05' },
  { id: 7, name: 'ท่าสะแล', lat: 19.82, lng: 99.22, riskLevel: 'กลาง', incidents: 4, population: 340, lastIncident: '2025-11-04' },
  { id: 8, name: 'แม่ใจเหนือ', lat: 19.98, lng: 99.18, riskLevel: 'ต่ำ', incidents: 3, population: 320, lastIncident: '2025-11-02' },
  { id: 9, name: 'สวนดอก', lat: 19.88, lng: 99.32, riskLevel: 'ต่ำ', incidents: 3, population: 300, lastIncident: '2025-10-30' },
  { id: 10, name: 'ต้นหนุน', lat: 19.90, lng: 99.35, riskLevel: 'ต่ำ', incidents: 3, population: 280, lastIncident: '2025-10-28' },
  { id: 11, name: 'สันทรายคองน้อย', lat: 19.85, lng: 99.28, riskLevel: 'ต่ำ', incidents: 2, population: 260, lastIncident: '2025-10-25' },
  { id: 12, name: 'ห้วยเฮี่ยน (สันป่ายางยาง)', lat: 19.87, lng: 99.15, riskLevel: 'ต่ำ', incidents: 2, population: 240, lastIncident: '2025-10-22' },
  { id: 13, name: 'ห้วยบอน', lat: 19.86, lng: 99.25, riskLevel: 'ต่ำ', incidents: 2, population: 220, lastIncident: '2025-10-20' },
  { id: 14, name: 'เสาหิน', lat: 19.80, lng: 99.30, riskLevel: 'ต่ำ', incidents: 2, population: 200, lastIncident: '2025-10-18' },
  { id: 15, name: 'โป่งถืบใน', lat: 19.91, lng: 99.23, riskLevel: 'ต่ำ', incidents: 2, population: 180, lastIncident: '2025-10-15' },
  { id: 16, name: 'ปางผึ้ง', lat: 19.89, lng: 99.36, riskLevel: 'ต่ำ', incidents: 1, population: 160, lastIncident: '2025-10-12' },
  { id: 17, name: 'ใหม่คองน้อย', lat: 19.84, lng: 99.26, riskLevel: 'ต่ำ', incidents: 1, population: 140, lastIncident: '2025-10-10' },
  { id: 18, name: 'ศรีดอนชัย', lat: 19.81, lng: 99.28, riskLevel: 'ต่ำ', incidents: 1, population: 120, lastIncident: '2025-10-08' },
  { id: 19, name: 'ใหม่ชยาราม', lat: 19.88, lng: 99.24, riskLevel: 'ต่ำ', incidents: 1, population: 100, lastIncident: '2025-10-05' },
  { id: 20, name: 'สระนิคม', lat: 19.79, lng: 99.25, riskLevel: 'ต่ำ', incidents: 1, population: 80, lastIncident: '2025-10-02' },
];

export default function ExecutiveGeospatialAnalysis() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('geospatial');
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(['สูง', 'กลาง', 'ต่ำ']);
  const [selectedVillages, setSelectedVillages] = useState<number[]>([]);
  const [timeRange, setTimeRange] = useState('3months');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '📈', label: 'แดชบอร์ดสรุป', path: '/dashboard/executive' },
    { id: 'analytics', icon: '📊', label: 'รายงานและสถิติ', path: '/executive/analytics' },
    { id: 'budget', icon: '💰', label: 'งบประมาณและทรัพยากร', path: '/executive/budget-resources' },
    { id: 'geospatial', icon: '🗺️', label: 'วิเคราะห์เชิงพื้นที่', path: '/executive/geospatial-analysis' },
  ];

  const handleMenuClick = (item: any) => {
    setActiveMenu(item.id);
    if (item.path === '/executive/geospatial-analysis') return;
    navigate(item.path);
  };

  const toggleRiskLevel = (level: string) => {
    setSelectedRiskLevels(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const toggleVillage = (id: number) => {
    setSelectedVillages(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'สูง': return '#ef4444';
      case 'กลาง': return '#f59e0b';
      case 'ต่ำ': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([19.9167, 99.2333], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers based on filters
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter villages
    const filteredVillages = VILLAGES.filter(village =>
      selectedRiskLevels.includes(village.riskLevel) &&
      (selectedVillages.length === 0 || selectedVillages.includes(village.id))
    );

    // Add markers
    filteredVillages.forEach(village => {
      const color = getRiskColor(village.riskLevel);
      
      const marker = L.marker([village.lat, village.lng], {
        icon: L.divIcon({
          className: 'custom-risk-marker',
          html: `
            <div style="
              background: ${color};
              color: white;
              border: 3px solid white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${village.incidents}
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        })
      }).addTo(mapInstanceRef.current!);

      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 200px;">
          <strong style="font-size: 16px; color: #1a202c;">${village.name}</strong><br/>
          <div style="margin-top: 8px; font-size: 13px;">
            <div style="margin: 4px 0;">
              <span style="color: #718096;">ระดับความเสี่ยง:</span>
              <strong style="color: ${color};">${village.riskLevel}</strong>
            </div>
            <div style="margin: 4px 0;">
              <span style="color: #718096;">จำนวนเหตุการณ์:</span>
              <strong>${village.incidents}</strong>
            </div>
            <div style="margin: 4px 0;">
              <span style="color: #718096;">ประชากร:</span>
              <strong>${village.population}</strong> คน
            </div>
            <div style="margin: 4px 0;">
              <span style="color: #718096;">เหตุการณ์ล่าสุด:</span>
              <strong>${village.lastIncident}</strong>
            </div>
          </div>
        </div>
      `);

      markersRef.current.push(marker);
    });
  }, [selectedRiskLevels, selectedVillages]);

  const filteredVillages = VILLAGES.filter(v => selectedRiskLevels.includes(v.riskLevel));
  const totalIncidents = filteredVillages.reduce((sum, v) => sum + v.incidents, 0);
  const totalPopulation = filteredVillages.reduce((sum, v) => sum + v.population, 0);
  const highRiskCount = filteredVillages.filter(v => v.riskLevel === 'สูง').length;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#f7fafc'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        minWidth: '260px',
        background: 'linear-gradient(180deg, #1e3a8a 0%, #3b82f6 100%)',
        color: 'white',
        padding: '20px',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 30px 0', fontSize: '20px' }}>🛡️ Guardian Route</h2>
        
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '15px',
          borderRadius: '12px',
          marginBottom: '30px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            ผู้บริหาร (Executive)
          </div>
        </div>

        <nav style={{ marginBottom: '30px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: activeMenu === item.id ? 'rgba(255,255,255,0.25)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeMenu === item.id ? '600' : '500',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} style={{
          width: '100%',
          padding: '12px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: '260px',
        flex: 1,
        display: 'flex',
        minHeight: '100vh'
      }}>
        {/* Left Panel - Controls & Statistics */}
        <div style={{
          width: '400px',
          minWidth: '400px',
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          padding: '40px 30px',
          overflowY: 'auto'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#1a202c' }}>
            🗺️ วิเคราะห์เชิงพื้นที่
          </h1>
          <p style={{ margin: '0 0 30px 0', color: '#718096', fontSize: '14px' }}>
            ภาพรวมพื้นที่เสี่ยงซ้ำซ้อนและการวางแผนระยะยาว
          </p>

          {/* Summary Stats */}
          <div style={{
            background: '#f7fafc',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1a202c' }}>
              📊 สรุปข้อมูล
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>หมู่บ้านที่แสดง:</span>
                <strong style={{ color: '#1a202c', fontSize: '14px' }}>{filteredVillages.length}/20</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>เหตุการณ์ทั้งหมด:</span>
                <strong style={{ color: '#1a202c', fontSize: '14px' }}>{totalIncidents}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>ประชากรรวม:</span>
                <strong style={{ color: '#1a202c', fontSize: '14px' }}>{totalPopulation.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096', fontSize: '14px' }}>พื้นที่เสี่ยงสูง:</span>
                <strong style={{ color: '#ef4444', fontSize: '14px' }}>{highRiskCount}</strong>
              </div>
            </div>
          </div>

          {/* Risk Level Filter */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1a202c' }}>
              🎯 กรองตามระดับความเสี่ยง
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['สูง', 'กลาง', 'ต่ำ'].map(level => (
                <label
                  key={level}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: selectedRiskLevels.includes(level) ? '#f0f9ff' : '#f7fafc',
                    border: `2px solid ${selectedRiskLevels.includes(level) ? getRiskColor(level) : '#e2e8f0'}`,
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedRiskLevels.includes(level)}
                    onChange={() => toggleRiskLevel(level)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <div style={{
                    width: '16px',
                    height: '16px',
                    background: getRiskColor(level),
                    borderRadius: '50%'
                  }} />
                  <span style={{ flex: 1, fontWeight: '500', color: '#1a202c' }}>
                    ความเสี่ยง{level}
                  </span>
                  <span style={{ color: '#718096', fontSize: '13px' }}>
                    {VILLAGES.filter(v => v.riskLevel === level).length} หมู่
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Range Filter */}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1a202c' }}>
              📅 ช่วงเวลา
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="1month">1 เดือนล่าสุด</option>
              <option value="3months">3 เดือนล่าสุด</option>
              <option value="6months">6 เดือนล่าสุด</option>
              <option value="1year">1 ปีล่าสุด</option>
            </select>
          </div>

          {/* Village List */}
          <div>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#1a202c' }}>
              📍 รายการหมู่บ้าน ({filteredVillages.length})
            </h3>
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {filteredVillages
                .sort((a, b) => b.incidents - a.incidents)
                .map(village => (
                  <div
                    key={village.id}
                    onClick={() => toggleVillage(village.id)}
                    style={{
                      padding: '12px',
                      background: selectedVillages.includes(village.id) ? '#f0f9ff' : 'white',
                      border: `2px solid ${selectedVillages.includes(village.id) ? '#3b82f6' : '#e2e8f0'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        background: getRiskColor(village.riskLevel),
                        borderRadius: '50%'
                      }} />
                      <strong style={{ flex: 1, fontSize: '14px', color: '#1a202c' }}>
                        {village.name}
                      </strong>
                      <span style={{
                        padding: '2px 8px',
                        background: getRiskColor(village.riskLevel),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '600'
                      }}>
                        {village.incidents}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096', paddingLeft: '22px' }}>
                      ประชากร: {village.population} • {village.lastIncident}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={() => toast.success('📥 กำลังสร้างรายงาน...')}
            style={{
              width: '100%',
              padding: '14px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '30px',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}
          >
            📄 ส่งออกรายงาน PDF
          </button>
        </div>

        {/* Right Panel - Map */}
        <div style={{
          flex: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1a202c' }}>
                🗺️ แผนที่พื้นที่เสี่ยง
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>
                ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่ • คลิกที่หมู่บ้านเพื่อดูรายละเอียด
              </p>
            </div>
            <div
              ref={mapRef}
              style={{
                flex: 1,
                minHeight: '600px'
              }}
            />
            {/* Legend */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              background: '#f7fafc'
            }}>
              <strong style={{ fontSize: '14px', color: '#1a202c' }}>คำอธิบาย:</strong>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#ef4444', borderRadius: '50%' }} />
                  <span style={{ fontSize: '13px', color: '#718096' }}>ความเสี่ยงสูง</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#f59e0b', borderRadius: '50%' }} />
                  <span style={{ fontSize: '13px', color: '#718096' }}>ความเสี่ยงกลาง</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '20px', height: '20px', background: '#10b981', borderRadius: '50%' }} />
                  <span style={{ fontSize: '13px', color: '#718096' }}>ความเสี่ยงต่ำ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
