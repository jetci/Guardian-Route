import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/auth';
import toast from 'react-hot-toast';

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
      FIELD_OFFICER: { email: 'field@obtwiang.go.th', password: 'password123' },
    };
    const cred = credentials[role as keyof typeof credentials];
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      
      
      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">
                  Guardian Route
                </h1>
                <p className="text-gray-500 font-medium">ระบบจัดการและติดตามสถานการณ์ภัยพิบัติ</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-gray-600 border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-bold text-gray-800">
              ยินดีต้อนรับสู่ระบบ Guardian Route
            </h2>
            <p className="text-lg leading-relaxed">
              ระบบจัดการและติดตามสถานการณ์ภัยพิบัติ สำหรับองค์การบริหารส่วนตำบลเวียง 
              อำเภอฝาง จังหวัดเชียงใหม่
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-800">20 หมู่บ้าน</p>
                  <p className="text-xs text-gray-600">ครอบคลุมพื้นที่</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-gray-800">8,895 คน</p>
                  <p className="text-xs text-gray-600">ประชากรทั้งหมด</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-200 w-full">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">เข้าสู่ระบบ</h2>
            <p className="text-gray-500">กรุณากรอกข้อมูลเพื่อเข้าใช้งานระบบ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                อีเมล
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="your.email@obtwiang.go.th"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                รหัสผ่าน
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-600 mb-3 text-center">
              บัญชีทดสอบ (Quick Login)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => quickLogin('ADMIN')}
                className="px-3 py-2 text-xs font-medium text-purple-800 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors"
              >
                👤 Admin
              </button>
              <button
                onClick={() => quickLogin('SUPERVISOR')}
                className="px-3 py-2 text-xs font-medium text-blue-800 bg-blue-100 hover:bg-blue-200 rounded-md transition-colors"
              >
                👨‍💼 Supervisor
              </button>
              <button
                onClick={() => quickLogin('FIELD_OFFICER')}
                className="px-3 py-2 text-xs font-medium text-green-800 bg-green-100 hover:bg-green-200 rounded-md transition-colors"
              >
                🚨 Field
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              รหัสผ่านทั้งหมด: password123
            </p>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400">
            <p>© 2568 องค์การบริหารส่วนตำบลเวียง</p>
            <p>อำเภอฝาง จังหวัดเชียงใหม่</p>
          </div>
        </div>
      </div>
    </div>
  );
}
