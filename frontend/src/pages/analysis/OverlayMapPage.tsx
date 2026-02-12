import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { incidentsApi, type Incident } from '../../api/incidents';
import { analysisApi, type OverlayAnalysisResult } from '../../api/analysis';
import { ExportAnalysisButton } from '../../components/analysis/ExportAnalysisButton';
import toast from 'react-hot-toast';
import { Layers, MapPin, AlertTriangle, TrendingUp, Download, RotateCcw, Play, CheckSquare, Square, Activity, ShieldAlert, BarChart3, Info, Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const riskColors = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

export const OverlayMapPage = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<OverlayAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentsApi.getAll();
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('ไม่สามารถโหลดข้อมูลเหตุการณ์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedIds.length < 2) {
      toast.error('ต้องเลือกอย่างน้อย 2 เหตุการณ์เพื่อวิเคราะห์');
      return;
    }

    try {
      setAnalyzing(true);
      const result = await analysisApi.analyzeOverlay({ incidentIds: selectedIds });
      setAnalysisResult(result);
      toast.success(`วิเคราะห์สำเร็จ! พบพื้นที่ซ้ำซาก ${result.overlappingAreas.length} พื้นที่`);
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error('ไม่สามารถวิเคราะห์ข้อมูลได้');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setAnalysisResult(null);
  };

  const center: LatLngExpression = [19.9167, 99.2333]; // ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่

  // --- PREMIUM DESIGN SYSTEM CONSTANTS ---
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  const paddingX = window.innerWidth < 768 ? '20px' : '48px';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="animate-spin" style={{ width: '64px', height: '64px', border: '4px solid #f1f5f9', borderTopColor: '#2563eb', borderRadius: '50%', margin: '0 auto 24px' }}></div>
          <p style={{ color: '#64748b', fontWeight: '700', fontSize: '18px' }}>กำลังโหลดศูนย์บริหารข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Sarabun', sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* --- ZONE 1: PREMIUM IDENTITY HEADER --- */}
      <div style={{ padding: `32px ${paddingX} 0` }}>
        <div style={{
          background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
          padding: window.innerWidth < 768 ? '24px 20px' : '32px 48px',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
          color: 'white',
          display: 'flex',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '14px' }}>
                <Layers size={window.innerWidth < 768 ? 24 : 32} color="white" />
              </div>
              <h1 style={{
                fontSize: window.innerWidth < 768 ? '24px' : '32px',
                fontWeight: '900',
                letterSpacing: '-0.02em',
                margin: 0
              }}>
                ศูนย์วิเคราะห์เชิงพื้นที่และภัยซ้ำซาก
              </h1>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: '600' }}>
              ตรวจสอบความทับซ้อนของเหตุการณ์ภัยพิบัติเพื่อวางแผนป้องกันเชิงรุก
            </p>
          </div>

          <button
            onClick={fetchIncidents}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: 'rgba(255,255,255,1)',
              color: '#1e40af',
              borderRadius: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <RotateCcw size={18} /> รีเฟรชข้อมูล
          </button>
        </div>
      </div>

      {/* --- ZONE 2: TACTICAL INFO PULSE (STATS) --- */}
      <div style={{
        padding: `24px ${paddingX}`,
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768 ? 'repeat(auto-fit, minmax(140px, 1fr))' : 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          borderLeft: '5px solid #2563eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>เหตุการณ์พร้อมใช้</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b' }}>{incidents.length}</div>
          </div>
          <Activity size={24} color="#2563eb" />
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          borderLeft: '5px solid #f59e0b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>พบจุดทับซ้อน</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#1e293b' }}>{analysisResult?.overlappingAreas.length || 0}</div>
          </div>
          <AlertTriangle size={24} color="#f59e0b" />
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          borderLeft: analysisResult ? '5px solid #ef4444' : '5px solid #94a3b8',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>ระดับความเสี่ยง (Risk Score)</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: analysisResult ? '#ef4444' : '#1e293b' }}>
              {analysisResult ? `${analysisResult.riskScore}/100` : '--'}
            </div>
          </div>
          <ShieldAlert size={24} color={analysisResult ? "#ef4444" : "#94a3b8"} />
        </div>
      </div>

      {/* --- MAIN INTERFACE (ZONE 3 & 4) --- */}
      <div style={{
        flex: 1,
        padding: `0 ${paddingX} 32px`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '24px'
      }}>

        {/* --- ZONE 3: STRATEGIC SIDE CONTROL --- */}
        <div style={{
          width: isMobile ? '100%' : '380px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          flexShrink: 0
        }}>
          {/* Incident Selector */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            border: '1px solid #f1f5f9',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: isMobile ? '400px' : '500px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <MapPin size={18} color="#2563eb" />
              <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>เลือกเหตุการณ์วิเคราะห์</h3>
            </div>

            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '900',
                color: '#64748b',
                background: '#f8fafc',
                padding: '4px 12px',
                borderRadius: '100px',
                display: 'inline-block'
              }}>
                เลือกแล้ว {selectedIds.length} รายการ
              </div>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => {
                    if (selectedIds.includes(incident.id)) {
                      setSelectedIds(selectedIds.filter(id => id !== incident.id));
                    } else {
                      setSelectedIds([...selectedIds, incident.id]);
                    }
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '14px',
                    background: selectedIds.includes(incident.id) ? '#eff6ff' : '#f8fafc',
                    border: '1px solid',
                    borderColor: selectedIds.includes(incident.id) ? '#2563eb' : '#f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: '2px solid',
                    borderColor: selectedIds.includes(incident.id) ? '#2563eb' : '#cbd5e1',
                    background: selectedIds.includes(incident.id) ? '#2563eb' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '2px'
                  }}>
                    {selectedIds.includes(incident.id) && <Search size={12} color="white" strokeWidth={4} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{incident.title}</div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '800',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: incident.priority === 'CRITICAL' ? '#fee2e2' : '#fef3c7',
                        color: incident.priority === 'CRITICAL' ? '#ef4444' : '#d97706'
                      }}>
                        {incident.priority}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '600' }}>
                        {new Date(incident.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Group */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleAnalyze}
              disabled={analyzing || selectedIds.length < 2}
              style={{
                width: '100%',
                padding: '16px',
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '18px',
                fontWeight: '900',
                fontSize: '15px',
                cursor: (analyzing || selectedIds.length < 2) ? 'not-allowed' : 'pointer',
                opacity: (analyzing || selectedIds.length < 2) ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.2)',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => !analyzing && selectedIds.length >= 2 && (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseOut={(e) => !analyzing && selectedIds.length >= 2 && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {analyzing ? (
                <>
                  <div className="animate-spin" style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%' }}></div>
                  กำลังวิมเคราะห์ทางยุทธวิธี...
                </>
              ) : (
                <>
                  <Activity size={20} /> เริ่มการวิเคราะห์ความทับซ้อน
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '14px',
                background: 'white',
                color: '#64748b',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RotateCcw size={16} /> รีเซ็ตค่าการวิเคราะห์
            </button>

            {analysisResult && (
              <ExportAnalysisButton analysisResult={analysisResult} />
            )}
          </div>

          {/* Results Summary */}
          {analysisResult && (
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              border: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <TrendingUp size={18} color="#8b5cf6" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b' }}>รายงานสรุปผลลัพธ์</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>คะแนนความเสี่ยง</span>
                  <span style={{
                    fontSize: '18px',
                    fontWeight: '900',
                    color: analysisResult.riskScore > 70 ? '#ef4444' : '#10b981'
                  }}>
                    {analysisResult.riskScore}
                  </span>
                </div>

                <div style={{ padding: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={14} /> คำแนะนำทางยุทธวิธี
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysisResult.recommendations.map((rec, idx) => (
                      <div key={idx} style={{
                        fontSize: '11px',
                        lineHeight: 1.5,
                        color: '#475569',
                        padding: '10px',
                        background: '#f0f9ff',
                        borderRadius: '10px',
                        borderLeft: '4px solid #0ea5e9',
                        fontWeight: '600'
                      }}>
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* --- ZONE 4: INTELLIGENCE VISUALIZER (MAP) --- */}
        <div style={{
          flex: 1,
          background: 'white',
          borderRadius: '32px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
          border: '4px solid white',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '600px'
        }}>
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 1 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {analysisResult?.overlappingAreas.map((area, index) => (
              <Polygon
                key={index}
                positions={area.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngExpression)}
                pathOptions={{
                  color: riskColors[area.riskLevel],
                  fillColor: riskColors[area.riskLevel],
                  fillOpacity: 0.4,
                  weight: 3,
                  dashArray: '5, 10'
                }}
              >
                <Popup>
                  <div style={{
                    padding: '8px',
                    fontFamily: "'Sarabun', sans-serif",
                    minWidth: '200px'
                  }}>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '900',
                      color: riskColors[area.riskLevel],
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <ShieldAlert size={12} /> พื้นที่ความทับซ้อนทางยุทธวิธี
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      color: '#1e293b',
                      marginBottom: '12px',
                      lineHeight: 1.2
                    }}>
                      ตรวจพบระดับความเสี่ยง <span style={{ color: riskColors[area.riskLevel] }}>{area.riskLevel}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#64748b' }}>จำนวนเหตุการณ์พ่วง:</span>
                        <span style={{ fontWeight: '800', color: '#1e293b' }}>{area.incidentCount}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#64748b' }}>ขนาดพื้นที่:</span>
                        <span style={{ fontWeight: '800', color: '#1e293b' }}>{area.area.toFixed(2)} ตร.กม.</span>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#475569',
                      border: '1px solid #f1f5f9'
                    }}>
                      ระบบแนะนำให้ขยายแผนการระวังภัยในพื้นที่นี้เป็นพิเศษ
                    </div>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>

          {/* Map Overlay Badge */}
          <div style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(12px)',
            padding: '12px 16px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 1000,
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></div>
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#1e293b' }}>Geospatial Engine Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
