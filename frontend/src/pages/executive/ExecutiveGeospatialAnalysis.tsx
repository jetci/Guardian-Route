import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function ExecutiveGeospatialAnalysis() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('geospatial');
  const [dateFilter, setDateFilter] = useState('2025-11-01');
  const [selectedSurveys, setSelectedSurveys] = useState<number[]>([1, 2]);

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
    if (item.path === '/executive/geospatial-analysis') {
      return;
    }
    if (item.path === '/dashboard/executive') {
      navigate('/dashboard/executive');
      return;
    }
    if (item.path === '/executive/analytics') {
      navigate('/executive/analytics');
      return;
    }
    if (item.path === '/executive/budget-resources') {
      navigate('/executive/budget-resources');
      return;
    }
    toast.success(`🚀 ${item.label} - Coming soon!`);
  };

  // Mock survey data
  const surveys = [
    { 
      id: 1, 
      title: 'น้ำท่วม - บ้านหนองบัว', 
      date: '2025-11-12', 
      type: 'อุทกภัย',
      color: '#3b82f6',
      area: '2.5 ตร.กม.',
      households: 45
    },
    { 
      id: 2, 
      title: 'ดินถล่ม - เขาใหญ่', 
      date: '2025-11-10', 
      type: 'ดินถล่ม',
      color: '#ef4444',
      area: '0.8 ตร.กม.',
      households: 12
    },
    { 
      id: 3, 
      title: 'พายุ - บ้านป่าไม้', 
      date: '2025-11-08', 
      type: 'วาตภัย',
      color: '#f59e0b',
      area: '1.2 ตร.กม.',
      households: 28
    },
    { 
      id: 4, 
      title: 'ไฟป่า - บ้านแม่ริม', 
      date: '2025-11-05', 
      type: 'ไฟป่า',
      color: '#dc2626',
      area: '3.5 ตร.กม.',
      households: 8
    },
  ];

  const toggleSurvey = (id: number) => {
    if (selectedSurveys.includes(id)) {
      setSelectedSurveys(selectedSurveys.filter(s => s !== id));
    } else {
      setSelectedSurveys([...selectedSurveys, id]);
    }
  };

  const selectedSurveyData = surveys.filter(s => selectedSurveys.includes(s.id));

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
              onMouseEnter={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
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

      {/* Main Content - Two Panel Layout */}
      <div style={{
        marginLeft: '260px',
        flex: 1,
        display: 'flex',
        minHeight: '100vh'
      }}>
        {/* Left Panel - Control Panel */}
        <div style={{
          width: '380px',
          minWidth: '380px',
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

          {/* Date Filter */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#1a202c' 
            }}>
              📅 ช่วงเวลา
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Survey List */}
          <div>
            <h3 style={{ 
              margin: '0 0 16px 0', 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1a202c' 
            }}>
              📋 รายการผลสำรวจ ({surveys.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {surveys.map(survey => (
                <div
                  key={survey.id}
                  onClick={() => toggleSurvey(survey.id)}
                  style={{
                    padding: '16px',
                    background: selectedSurveys.includes(survey.id) ? '#f0f9ff' : '#f7fafc',
                    border: `2px solid ${selectedSurveys.includes(survey.id) ? survey.color : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: `2px solid ${survey.color}`,
                      borderRadius: '4px',
                      background: selectedSurveys.includes(survey.id) ? survey.color : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      {selectedSurveys.includes(survey.id) && (
                        <span style={{ color: 'white', fontSize: '14px' }}>✓</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#1a202c', 
                        fontSize: '14px',
                        marginBottom: '6px'
                      }}>
                        {survey.title}
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#718096',
                        marginBottom: '8px'
                      }}>
                        📅 {survey.date} • {survey.type}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#4a5568' }}>
                        <span>📏 {survey.area}</span>
                        <span>🏠 {survey.households} ครัวเรือน</span>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    height: '4px',
                    background: survey.color,
                    borderRadius: '2px',
                    opacity: selectedSurveys.includes(survey.id) ? 1 : 0.3
                  }} />
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {selectedSurveys.length > 0 && (
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              color: 'white'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
                เลือกแล้ว
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '4px' }}>
                {selectedSurveys.length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                ผลสำรวจ
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Map */}
        <div style={{
          flex: 1,
          padding: '40px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#1a202c' }}>
              🗺️ แผนที่ซ้อนทับพื้นที่ประสบภัย
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
              เลือกผลสำรวจจากแผงควบคุมด้านซ้ายเพื่อแสดงขอบเขตบนแผนที่
            </p>
          </div>

          {/* Map Container */}
          <div style={{
            flex: 1,
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Map Placeholder */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '20px',
              minHeight: '500px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Base Map */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '80%',
                border: '3px dashed #6366f1',
                borderRadius: '12px',
                opacity: 0.3
              }} />

              {/* Selected Survey Overlays */}
              {selectedSurveyData.map((survey, idx) => (
                <div
                  key={survey.id}
                  style={{
                    position: 'absolute',
                    top: `${20 + idx * 15}%`,
                    left: `${15 + idx * 10}%`,
                    width: `${30 + idx * 5}%`,
                    height: `${25 + idx * 5}%`,
                    background: survey.color,
                    opacity: 0.3,
                    borderRadius: '50%',
                    border: `3px solid ${survey.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: survey.color,
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  {survey.title.split(' - ')[1]}
                </div>
              ))}

              {/* Center Text */}
              <div style={{ 
                textAlign: 'center', 
                color: '#4f46e5',
                zIndex: 10,
                background: 'rgba(255,255,255,0.9)',
                padding: '20px 30px',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗺️</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  Interactive Map Visualization
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>
                  Integration with Leaflet/Mapbox
                </div>
                {selectedSurveys.length > 0 && (
                  <div style={{ 
                    marginTop: '16px', 
                    padding: '8px 16px',
                    background: '#4f46e5',
                    color: 'white',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}>
                    แสดง {selectedSurveys.length} เลเยอร์
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            {selectedSurveys.length > 0 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                  📌 คำอธิบายสัญลักษณ์
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                  {selectedSurveyData.map(survey => (
                    <div key={survey.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: survey.color,
                        borderRadius: '4px',
                        opacity: 0.6
                      }} />
                      <span style={{ fontSize: '13px', color: '#4a5568' }}>
                        {survey.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
