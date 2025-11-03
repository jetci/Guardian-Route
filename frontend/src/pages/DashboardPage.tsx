import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Guardian Route Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ยินดีต้อนรับ, {user?.firstName}!
            </h2>
            <p className="text-gray-600 mb-4">
              คุณเข้าสู่ระบบด้วยบทบาท: <strong>{user?.role}</strong>
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">เหตุการณ์ทั้งหมด</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">งานที่มอบหมาย</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">0</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-900">รายงานรอตรวจ</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">0</p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-indigo-900 mb-2">🎉 Phase 1 Complete!</h3>
              <p className="text-indigo-700">
                ระบบ Authentication และ Protected Routes ทำงานได้แล้ว!
              </p>
              <ul className="mt-2 text-sm text-indigo-600 space-y-1">
                <li>✅ Backend API (NestJS + Prisma + PostgreSQL)</li>
                <li>✅ JWT Authentication</li>
                <li>✅ Role-Based Access Control</li>
                <li>✅ Frontend (React + Vite + Tailwind + Zustand)</li>
                <li>✅ Login & Protected Routes</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
