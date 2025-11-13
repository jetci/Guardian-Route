import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import './Sidebar.css';

export function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getMenuItems = () => {
    // Convert role to string for comparison (handles both string and enum)
    const userRole = user?.role ? String(user.role) : '';
    
    switch (userRole) {
      case 'DEVELOPER':
        return [
          { icon: '🛠️', label: 'Developer Dashboard', path: '/dashboard/developer' },
          { icon: '📘', label: 'Developer Handbook', path: '/developer-handbook' },
        ];
      case 'ADMIN':
        return [
          { icon: '📊', label: 'Dashboard', path: '/dashboard/admin' },
          { icon: '👥', label: 'Users', path: '/users' },
          { icon: '⚙️', label: 'Settings', path: '/settings' },
        ];
      case 'SUPERVISOR':
        return [
          { icon: '📊', label: 'Dashboard', path: '/dashboard/supervisor' },
          { icon: '📋', label: 'Tasks', path: '/tasks' },
          { icon: '👨‍👩‍👧‍👦', label: 'Teams', path: '/teams' },
          { icon: '📄', label: 'Reports', path: '/reports' },
        ];
      case 'EXECUTIVE':
        return [
          { icon: '📊', label: 'Dashboard', path: '/dashboard/executive' },
          { icon: '📈', label: 'Analytics', path: '/analytics' },
          { icon: '📄', label: 'Reports', path: '/reports' },
        ];
      case 'FIELD_OFFICER':
        return [
          { icon: '📊', label: 'My Tasks', path: '/dashboard/officer' },
          { icon: '➕', label: 'รายงานเหตุการณ์ใหม่', path: '/create-incident' },
          { icon: '🗺️', label: 'แผนที่เหตุการณ์', path: '/map-incidents' },
          { icon: '📋', label: 'ประวัติรายงาน', path: '/report-history' },
          { icon: '📖', label: 'คู่มือการทำงาน', path: '/workflow-guide' },
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
        <button onClick={handleLogout} className="logout-button">
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </div>
    </div>
  );
}
