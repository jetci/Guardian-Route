import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { NotificationBell } from '../notifications/NotificationBell';
import './Sidebar.css';

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  // Force re-render when auth state is loaded from localStorage
  useEffect(() => {
    // Small delay to ensure zustand persist has loaded
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    // Convert role to string for comparison (handles both string and enum)
    const userRole = user?.role ? String(user.role) : '';

    // console.log('🔍 Sidebar - Current user role:', userRole);
    // console.log('👤 Sidebar - User data:', user);

    switch (userRole) {
      case 'DEVELOPER':
        return [
          { icon: '🛠️', label: 'Developer Dashboard', path: '/dashboard/developer' },
          { icon: '🔌', label: 'API Documentation', path: '/developer/api-docs' },
          { icon: '📘', label: 'Developer Handbook', path: '/developer-handbook' },
        ];
      case 'ADMIN':
        return [
          { icon: '🗄️', label: 'แดชบอร์ดระบบ', path: '/dashboard/admin' },
          { icon: '👤', label: 'จัดการผู้ใช้', path: '/manage-users' },
          { icon: '💾', label: 'จัดการข้อมูล', path: '/manage-data' },
          { icon: '🏘️', label: 'จัดการข้อมูลหมู่บ้าน', path: '/manage-villages' },
          { icon: '🗺️', label: 'กำหนดขอบเขตหมู่บ้าน', path: '/village-boundaries' },
          { icon: '🌏', label: 'แผนที่ภาพรวม', path: '/supervisor/map' },
          { icon: '⚙️', label: 'ตั้งค่า', path: '/settings' },
          { icon: '📋', label: 'Audit Log', path: '/audit-log' },
        ];
      case 'SUPERVISOR':
        return [
          { icon: '🖥️', label: 'แดชบอร์ดบัญชาการ (Command Dashboard)', path: '/dashboard/supervisor' },
          { icon: '⚠️', label: 'จัดการเหตุการณ์ (Manage Incidents)', path: '/manage-incidents' },
          { icon: '👥', label: 'ภาพรวมทีม (Team Overview)', path: '/team-overview' },
          { icon: '📄', label: 'รายงานการปฏิบัติงาน (Operational Reports)', path: '/operational-reports' },
          { icon: '📊', label: 'วิเคราะห์ข้อมูลสำรวจ (Survey Analysis)', path: '/survey-analysis' },
        ];
      case 'EXECUTIVE':
        return [
          { icon: '📈', label: 'แดชบอร์ดสรุป (Summary Dashboard)', path: '/dashboard/executive' },
          { icon: '📊', label: 'รายงานและสถิติ (Reports & Statistics)', path: '/executive/analytics' },
          { icon: '💰', label: 'งบประมาณและทรัพยากร (Budget & Resources)', path: '/executive/budget-resources' },
          { icon: '🗺️', label: 'วิเคราะห์เชิงพื้นที่ (Geospatial Analysis)', path: '/executive/geospatial-analysis' },
        ];
      case 'FIELD_OFFICER':
        return [
          { icon: '👨‍🚒', label: 'แดชบอร์ดเจ้าหน้าที่', path: '/field-officer/dashboard' },
          { icon: '🗺️', label: 'แผนที่เหตุการณ์', path: '/map-incidents' },
          { icon: '📋', label: 'งานของฉัน', path: '/tasks/my-tasks' },
          { icon: '📝', label: 'รายงานเหตุการณ์ใหม่', path: '/create-incident' },
          { icon: '🔍', label: 'สำรวจพื้นที่', path: '/survey-area' },
          { icon: '📜', label: 'ประวัติการรายงาน', path: '/report-history' },
          { icon: '🌊', label: 'คู่มือการทำงาน', path: '/workflow-guide' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="sidebar-title">Guardian Route</h2>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        <div className="user-info">
          <div className="user-name">{user?.firstName} {user?.lastName}</div>
          <div className="user-role">{user?.role}</div>
        </div>
      </div>

      <div className="sidebar-notifications">
        <NotificationBell />
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="nav-item"
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={() => navigate('/profile')} className="nav-item profile-button">
          <span className="nav-icon">👤</span>
          <span className="nav-label">โปรไฟล์</span>
        </button>
        <button onClick={handleLogout} className="logout-button">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
}
