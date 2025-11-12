import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
// import { authApi } from '../api/auth';
import { mockAuthApi as authApi } from '../api/mockAuth'; // Use mock API temporarily
import toast from 'react-hot-toast';
import './LoginPage.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.login(email, password);
      setAuth(response.user, response.accessToken, response.refreshToken);
      toast.success(`ยินดีต้อนรับ ${response.user.firstName} ${response.user.lastName}!`);
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (role: string) => {
    const credentials = {
      ADMIN: { email: 'admin@obtwiang.go.th', password: 'password123' },
      SUPERVISOR: { email: 'supervisor@obtwiang.go.th', password: 'password123' },
      EXECUTIVE: { email: 'executive@obtwiang.go.th', password: 'password123' },
      FIELD_OFFICER: { email: 'field@obtwiang.go.th', password: 'password123' },
    };
    const cred = credentials[role as keyof typeof credentials];
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="login-title">Guardian Route</h1>
          <p className="login-subtitle">ระบบจัดการและติดตามสถานการณ์ภัยพิบัติ</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="your.email@obtwiang.go.th"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">รหัสผ่าน</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            {loading && <span className="spinner"></span>}
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>หรือ</span>
        </div>

        {/* Quick Login */}
        <div className="quick-login">
          <p className="quick-login-title">เข้าสู่ระบบด่วน (Quick Login)</p>
          <div className="quick-login-buttons">
            <button
              onClick={() => quickLogin('ADMIN')}
              className="quick-login-button admin"
              type="button"
            >
              <span className="quick-login-icon">👤</span>
              <span>Admin</span>
            </button>
            <button
              onClick={() => quickLogin('SUPERVISOR')}
              className="quick-login-button supervisor"
              type="button"
            >
              <span className="quick-login-icon">👨‍💼</span>
              <span>Supervisor</span>
            </button>
            <button
              onClick={() => quickLogin('EXECUTIVE')}
              className="quick-login-button executive"
              type="button"
            >
              <span className="quick-login-icon">👔</span>
              <span>Executive</span>
            </button>
            <button
              onClick={() => quickLogin('FIELD_OFFICER')}
              className="quick-login-button field"
              type="button"
            >
              <span className="quick-login-icon">🚨</span>
              <span>Field Officer</span>
            </button>
          </div>
          <p className="password-hint">
            💡 รหัสผ่านทดสอบ: <strong>password123</strong>
          </p>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>© 2568 องค์การบริหารส่วนตำบลเวียง</p>
          <p>อำเภอฝาง จังหวัดเชียงใหม่</p>
        </div>
      </div>
    </div>
  );
}
