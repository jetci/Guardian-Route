import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import './SimpleDashboard.css';

export function SimpleDashboard() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, { name: string; icon: string; color: string }> = {
      FIELD_OFFICER: { name: 'Field Officer', icon: '🚨', color: '#48bb78' },
      SUPERVISOR: { name: 'Supervisor', icon: '👨‍💼', color: '#4299e1' },
      EXECUTIVE: { name: 'Executive', icon: '👔', color: '#ed8936' },
      ADMIN: { name: 'Administrator', icon: '👤', color: '#9f7aea' },
    };
    return roleMap[role] || { name: role, icon: '👤', color: '#718096' };
  };

  const roleInfo = user ? getRoleDisplay(user.role) : null;

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-logo">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="dashboard-title">Guardian Route</h1>
          <p className="dashboard-subtitle">ระบบจัดการและติดตามสถานการณ์ภัยพิบัติ</p>
        </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <div className="welcome-icon" style={{ backgroundColor: roleInfo?.color + '20', color: roleInfo?.color }}>
            <span className="role-icon">{roleInfo?.icon}</span>
          </div>
          <h2 className="welcome-title">ยินดีต้อนรับ!</h2>
          <p className="welcome-name">{user?.firstName} {user?.lastName}</p>
          <div className="role-badge" style={{ backgroundColor: roleInfo?.color }}>
            {roleInfo?.name}
          </div>
        </div>

        {/* Info Section */}
        <div className="info-section">
          <div className="info-card">
            <div className="info-icon">📧</div>
            <div className="info-content">
              <p className="info-label">อีเมล</p>
              <p className="info-value">{user?.email}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">🆔</div>
            <div className="info-content">
              <p className="info-label">User ID</p>
              <p className="info-value">{user?.id}</p>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="status-section">
          <div className="status-item">
            <span className="status-dot"></span>
            <span>ระบบทำงานปกติ</span>
          </div>
          <div className="status-item">
            <span className="status-icon">✅</span>
            <span>เข้าสู่ระบบสำเร็จ</span>
          </div>
        </div>

        {/* Notice */}
        <div className="notice-box">
          <div className="notice-icon">ℹ️</div>
          <div className="notice-content">
            <p className="notice-title">หมายเหตุ</p>
            <p className="notice-text">
              ขณะนี้ระบบอยู่ในระหว่างการพัฒนา หน้า Dashboard เต็มรูปแบบจะพร้อมใช้งานเร็วๆ นี้
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="dashboard-actions">
          <button onClick={handleLogout} className="logout-button">
            <span>🚪</span>
            <span>ออกจากระบบ</span>
          </button>
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <p>© 2568 องค์การบริหารส่วนตำบลเวียง</p>
          <p>อำเภอฝาง จังหวัดเชียงใหม่</p>
        </div>
      </div>
    </div>
  );
}
