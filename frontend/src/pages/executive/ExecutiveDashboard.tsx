import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import HeatmapVisualization from '../../components/HeatmapVisualization';

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('dashboard');

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
    if (item.path === '/dashboard/executive') {
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
    if (item.path === '/executive/geospatial-analysis') {
      navigate('/executive/geospatial-analysis');
      return;
    }
    toast.success(`🚀 ${item.label} - Coming soon!`);
  };

  // Mock data with comparisons
  const kpiData = {
    monthlyIncidents: 24,
    monthlyChange: '-5%',
    monthlyChangePositive: false,
    avgResponseTime: '2.5 ชม.',
    responseTimeChange: 'ดีขึ้น 0.3 ชม.',
    responseTimePositive: true,
    topArea: 'บ้านหนองบัว',
    topAreaIncidents: 8,
    trend: '+12%',
    trendPositive: true
  };

  const monthlyTrend = [
    { month: 'พ.ค.', count: 18 },
    { month: 'มิ.ย.', count: 22 },
    { month: 'ก.ค.', count: 15 },
    { month: 'ส.ค.', count: 28 },
    { month: 'ก.ย.', count: 21 },
    { month: 'ต.ค.', count: 24 }
  ];

  const incidentTypes = [
    { type: 'อุทกภัย', percent: 55, color: '#3b82f6' },
    { type: 'วาตภัย', percent: 25, color: '#f59e0b' },
    { type: 'ดินถล่ม', percent: 15, color: '#ef4444' },
    { type: 'อื่นๆ', percent: 5, color: '#6b7280' }
  ];

  const recentIncidents = [
    { id: 1, title: 'น้ำท่วมฉับพลัน - หมู่ 5', severity: 'สูง', date: '2025-11-12', area: 'บ้านหนองบัว' },
    { id: 2, title: 'ดินถล่ม - เขาใหญ่', severity: 'สูง', date: '2025-11-11', area: 'บ้านเขาใหญ่' },
    { id: 3, title: 'พายุฝนฟ้าคะนอง', severity: 'สูง', date: '2025-11-10', area: 'บ้านป่าไม้' }
  ];

  const maxCount = Math.max(...monthlyTrend.map(m => m.count));

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

        {/* Menu Items */}
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

      {/* Main Content */}
      <div style={{
        marginLeft: '260px',
        flex: 1,
        padding: '40px',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '40px' 
        }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#1a202c' }}>
              📈 แดชบอร์ดสรุป
            </h1>
            <p style={{ margin: 0, color: '#718096', fontSize: '16px' }}>
              ภาพรวมเชิงกลยุทธ์สำหรับผู้บริหาร
            </p>
          </div>
          <button 
            onClick={() => toast.success('📄 กำลังสร้างรายงาน PDF...')}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
            }}
          >
            📥 ดาวน์โหลดรายงาน PDF
          </button>
        </div>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
              {kpiData.monthlyIncidents}
            </div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>เหตุการณ์เดือนนี้</div>
            <div style={{ 
              fontSize: '13px', 
              color: kpiData.monthlyChangePositive ? '#10b981' : '#ef4444',
              fontWeight: '600'
            }}>
              {kpiData.monthlyChange} จากเดือนที่แล้ว
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏱️</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
              {kpiData.avgResponseTime}
            </div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>เวลาตอบสนองเฉลี่ย</div>
            <div style={{ 
              fontSize: '13px', 
              color: '#10b981',
              fontWeight: '600'
            }}>
              {kpiData.responseTimeChange}
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📍</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
              {kpiData.topArea}
            </div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>พื้นที่เกิดเหตุบ่อยสุด</div>
            <div style={{ 
              fontSize: '13px', 
              color: '#3b82f6',
              fontWeight: '600'
            }}>
              {kpiData.topAreaIncidents} เหตุการณ์
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📈</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {kpiData.trend}
            </div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>แนวโน้มเทียบเดือนก่อน</div>
            <div style={{ 
              fontSize: '13px', 
              color: '#10b981',
              fontWeight: '600'
            }}>
              เพิ่มขึ้นจากปีที่แล้ว
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Bar Chart */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a202c' }}>
              📊 แนวโน้มเหตุการณ์ (6 เดือนล่าสุด)
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
              {monthlyTrend.map((item, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: '#3b82f6'
                  }}>
                    {item.count}
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${(item.count / maxCount) * 150}px`,
                    background: 'linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)',
                    borderRadius: '8px 8px 0 0',
                    transition: 'all 0.3s'
                  }} />
                  <div style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a202c' }}>
              🥧 สัดส่วนประเภทเหตุการณ์
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {incidentTypes.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        background: item.color,
                        borderRadius: '4px'
                      }} />
                      <span style={{ fontSize: '14px', color: '#1a202c' }}>{item.type}</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                      {item.percent}%
                    </span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.percent}%`,
                      height: '100%',
                      background: item.color,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Incidents & Map Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {/* Recent Incidents Table */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#1a202c' }}>
              🚨 เหตุการณ์รุนแรงล่าสุด
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentIncidents.map(incident => (
                <div key={incident.id} style={{
                  padding: '16px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>
                      {incident.title}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      background: '#dc2626',
                      color: 'white',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {incident.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#718096' }}>
                    📍 {incident.area} • 📅 {incident.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Heatmap */}
          <HeatmapVisualization height="400px" />
        </div>
      </div>
    </div>
  );
}
