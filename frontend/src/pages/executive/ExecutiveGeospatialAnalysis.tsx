import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VILLAGES as VILLAGE_DATA, TAMBON_INFO } from '../../data/villages';
import './ExecutiveGeospatialAnalysis.css';

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

// สร้างข้อมูลความเสี่ยงจากข้อมูลหมู่บ้านจริง
const VILLAGES: Village[] = VILLAGE_DATA.map((v, i) => ({
  id: v.id,
  name: v.name,
  lat: v.lat,
  lng: v.lng,
  riskLevel: i < 3 ? 'สูง' : i < 10 ? 'กลาง' : 'ต่ำ',
  incidents: Math.max(2, 10 - i),
  population: v.population || 300,
  lastIncident: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
}));

export default function ExecutiveGeospatialAnalysis() {
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<string[]>(['สูง', 'กลาง', 'ต่ำ']);
  const [selectedVillages, setSelectedVillages] = useState<number[]>([]);
  const [timeRange, setTimeRange] = useState('3months');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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

    // Initialize map centered on Fang District
    const map = L.map(mapRef.current).setView([TAMBON_INFO.centerLat, TAMBON_INFO.centerLng], 12);

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
    <DashboardLayout>
      <div style={{
        display: 'flex',
        gap: '24px',
        height: 'calc(100vh - 100px)'
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
    </DashboardLayout>
  );
}
