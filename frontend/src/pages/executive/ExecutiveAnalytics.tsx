import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import ThaiDatePicker from '../../components/ThaiDatePicker';

export default function ExecutiveAnalytics() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('analytics');
  
  // Filter states
  const [dateFrom, setDateFrom] = useState<Date | null>(new Date(2025, 9, 1));
  const [dateTo, setDateTo] = useState<Date | null>(new Date());
  const [incidentType, setIncidentType] = useState('all');
  const [area, setArea] = useState('all');

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
    if (item.path === '/executive/analytics') {
      return;
    }
    if (item.path === '/dashboard/executive') {
      navigate('/dashboard/executive');
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

  const handleExport = () => {
    toast.success('📥 กำลังส่งออกข้อมูล... (CSV/Excel)');
  };

  // Mock data (ใช้ 20 หมู่บ้านจริงจาก ตำบลเวียง อำเภอฝาง)
  const detailedData = [
    { id: 'INC-001', type: 'อุทกภัย', date: '2025-11-12', severity: 'สูง', area: 'หนองตุ้ม', responseTime: '2.5 ชม.' },
    { id: 'INC-002', type: 'ดินถล่ม', date: '2025-11-11', severity: 'สูง', area: 'ป่าบง', responseTime: '3.2 ชม.' },
    { id: 'INC-003', type: 'วาตภัย', date: '2025-11-10', severity: 'ปานกลาง', area: 'ริมฝาง (สันป่าไหน่)', responseTime: '1.8 ชม.' },
    { id: 'INC-004', type: 'อุทกภัย', date: '2025-11-09', severity: 'สูง', area: 'โป่งถืบ', responseTime: '2.1 ชม.' },
    { id: 'INC-005', type: 'วาตภัย', date: '2025-11-08', severity: 'ปานกลาง', area: 'แม่ใจใต้', responseTime: '2.8 ชม.' },
  ];

  const dailyComparison = [
    { date: '08 พ.ย.', count: 3 },
    { date: '09 พ.ย.', count: 5 },
    { date: '10 พ.ย.', count: 4 },
    { date: '11 พ.ย.', count: 7 },
    { date: '12 พ.ย.', count: 6 },
    { date: '13 พ.ย.', count: 4 },
    { date: '14 พ.ย.', count: 5 },
  ];

  // เวลาตอบสนองเฉลี่ยตามพื้นที่ (20 หมู่บ้านจริงจาก ตำบลเวียง อำเภอฝาง)
  const areaComparison = [
    { area: 'หนองตุ้ม', avgTime: 2.5, incidents: 8 },
    { area: 'ป่าบง', avgTime: 3.2, incidents: 7 },
    { area: 'ริมฝาง (สันป่าไหน่)', avgTime: 1.8, incidents: 6 },
    { area: 'โป่งถืบ', avgTime: 2.1, incidents: 5 },
    { area: 'แม่ใจใต้', avgTime: 2.8, incidents: 5 },
  ];

  const maxCount = Math.max(...dailyComparison.map(d => d.count));
  const maxTime = Math.max(...areaComparison.map(a => a.avgTime));

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
              📊 รายงานและสถิติ
            </h1>
            <p style={{ margin: 0, color: '#718096', fontSize: '16px' }}>
              วิเคราะห์ข้อมูลเชิงลึกและสร้างรายงานตามเงื่อนไข
            </p>
          </div>
          <button 
            onClick={handleExport}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
            }}
          >
            📥 Export Full Report
          </button>
        </div>

        {/* Filter Panel */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#1a202c' }}>
            🔍 ตัวกรองข้อมูล
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>
                วันที่เริ่มต้น
              </label>
              <ThaiDatePicker
                id="analytics-date-from"
                value={dateFrom}
                onChange={setDateFrom}
                placeholder="เลือกวันเริ่มต้น"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>
                วันที่สิ้นสุด
              </label>
              <ThaiDatePicker
                id="analytics-date-to"
                value={dateTo}
                onChange={setDateTo}
                placeholder="เลือกวันสิ้นสุด"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>
                ประเภทภัย
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="all">ทั้งหมด</option>
                <option value="flood">อุทกภัย</option>
                <option value="storm">วาตภัย</option>
                <option value="landslide">ดินถล่ม</option>
                <option value="fire">ไฟป่า</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>
                พื้นที่
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="all">ทั้งหมด</option>
                <option value="nongbua">บ้านหนองบัว</option>
                <option value="khaoyai">บ้านเขาใหญ่</option>
                <option value="pamai">บ้านป่าไม้</option>
                <option value="doisung">บ้านดอยสูง</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Daily Comparison Chart */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1a202c' }}>
              📈 จำนวนเหตุการณ์รายวัน
            </h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px' }}>
              {dailyComparison.map((item, idx) => (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#10b981' }}>
                    {item.count}
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${(item.count / maxCount) * 150}px`,
                    background: 'linear-gradient(180deg, #10b981 0%, #34d399 100%)',
                    borderRadius: '8px 8px 0 0'
                  }} />
                  <div style={{ fontSize: '11px', color: '#718096', fontWeight: '500' }}>
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Area Response Time Chart */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '18px', color: '#1a202c' }}>
              ⏱️ เวลาตอบสนองเฉลี่ยตามพื้นที่
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {areaComparison.map((item, idx) => (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#1a202c' }}>{item.area}</span>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#3b82f6' }}>
                      {item.avgTime} ชม. ({item.incidents} ครั้ง)
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
                      width: `${(item.avgTime / maxTime) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Data Table */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#1a202c' }}>
            📋 ตารางข้อมูลเชิงลึก
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>ประเภท</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>วันที่</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>ความรุนแรง</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>พื้นที่</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>เวลาตอบสนอง</th>
                </tr>
              </thead>
              <tbody>
                {detailedData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{row.id}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{row.type}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#718096' }}>{row.date}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 12px',
                        background: row.severity === 'สูง' ? '#fee2e2' : row.severity === 'ปานกลาง' ? '#fef3c7' : '#dcfce7',
                        color: row.severity === 'สูง' ? '#dc2626' : row.severity === 'ปานกลาง' ? '#d97706' : '#16a34a',
                        borderRadius: '12px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        {row.severity}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1a202c' }}>{row.area}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#3b82f6', fontWeight: '600' }}>{row.responseTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
