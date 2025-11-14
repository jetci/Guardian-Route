import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function SupervisorDashboardSimple() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'urgent' | 'normal'>('urgent');
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', icon: '🖥️', label: 'แดชบอร์ดบัญชาการ', path: '/dashboard/supervisor' },
    { id: 'incidents', icon: '⚠️', label: 'จัดการเหตุการณ์', path: '/manage-incidents' },
    { id: 'team', icon: '👥', label: 'ภาพรวมทีม', path: '/team-overview' },
    { id: 'reports', icon: '📄', label: 'รายงานการปฏิบัติงาน', path: '/operational-reports' },
    { id: 'survey', icon: '📊', label: 'วิเคราะห์ข้อมูลสำรวจ', path: '/survey-analysis' },
  ];

  const handleMenuClick = (item: any) => {
    setActiveMenu(item.id);
    if (item.path === '/dashboard/supervisor') {
      // Stay on current page
      return;
    }
    toast.success(`🚀 ${item.label} - Coming soon!`);
    // navigate(item.path); // Uncomment when pages are ready
  };

  // Mock data
  const urgentReports = [
    { id: 1, title: "น้ำท่วม - บ้านหนองบัว", officer: "นายสมชาย ใจดี", date: "2025-11-12 14:30" },
    { id: 2, title: "ดินถล่ม - หมู่ 5", officer: "นางสาวสมหญิง รักดี", date: "2025-11-12 10:15" }
  ];

  const normalReports = [
    { id: 3, title: "ไฟไหม้ป่า - เขาใหญ่", officer: "นายประสิทธิ์ มั่นคง", date: "2025-11-11 16:45" },
    { id: 4, title: "แผ่นดินไหว - ตำบลเวียง", officer: "นางสาววิภา สุขใจ", date: "2025-11-11 09:20" }
  ];

  const reports = activeTab === 'urgent' ? urgentReports : normalReports;

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        minWidth: '260px',
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
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
            {user?.role}
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
        background: '#f7fafc',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#1a202c' }}>
            📊 Supervisor Dashboard
          </h1>
          <p style={{ margin: 0, color: '#718096', fontSize: '16px' }}>
            จัดการทีมและตรวจสอบรายงาน
          </p>
        </div>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>8</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Team Members</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>27</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Active Tasks</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fad961 0%, #f76b1c 100%)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>4</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Pending Review</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '24px',
            borderRadius: '16px',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>12</div>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Done Today</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
          <button onClick={() => toast.success('✅ Feature coming soon!')} style={{
            padding: '12px 24px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
          }}>
            ➕ Assign New Task
          </button>
          <button onClick={() => toast.success('✅ Feature coming soon!')} style={{
            padding: '12px 24px',
            background: 'white',
            color: '#667eea',
            border: '2px solid #667eea',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}>
            👥 View Team
          </button>
        </div>

        {/* Pending Reviews */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '24px', color: '#1a202c' }}>
            📝 Pending Reviews
          </h2>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('urgent')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'urgent' ? '#667eea' : 'transparent',
                color: activeTab === 'urgent' ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🔴 Urgent ({urgentReports.length})
            </button>
            <button
              onClick={() => setActiveTab('normal')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'normal' ? '#667eea' : 'transparent',
                color: activeTab === 'normal' ? 'white' : '#4a5568',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              🟡 Normal ({normalReports.length})
            </button>
          </div>

          {/* Report Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map(report => (
              <div key={report.id} style={{
                padding: '20px',
                background: '#f7fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#1a202c' }}>{report.title}</h3>
                  <span style={{
                    padding: '4px 12px',
                    background: activeTab === 'urgent' ? '#fee2e2' : '#fef3c7',
                    color: activeTab === 'urgent' ? '#dc2626' : '#d97706',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    {activeTab === 'urgent' ? '🔴 Urgent' : '🟡 Normal'}
                  </span>
                </div>
                <div style={{ color: '#718096', fontSize: '14px', marginBottom: '16px' }}>
                  <div>👤 {report.officer}</div>
                  <div>📅 {report.date}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => toast.success('✅ Feature coming soon!')} style={{
                    padding: '8px 16px',
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}>
                    👁️ View
                  </button>
                  <button onClick={() => toast.success(`✅ Report #${report.id} approved!`)} style={{
                    padding: '8px 16px',
                    background: '#dcfce7',
                    border: '1px solid #86efac',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#16a34a',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    ✅ Approve
                  </button>
                  <button onClick={() => toast.success('📤 Revision request sent!')} style={{
                    padding: '8px 16px',
                    background: '#fef3c7',
                    border: '1px solid #fde047',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#d97706',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    ✏️ Request Revision
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
