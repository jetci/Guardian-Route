import { useAuthStore } from '../stores/authStore';

export function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          ยินดีต้อนรับ, {user?.firstName}!
        </h2>
        <p className="text-gray-600 mb-4">
          คุณเข้าสู่ระบบด้วยบทบาท: <strong>{user?.role}</strong>
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm">
            <h3 className="font-semibold text-blue-900">เหตุการณ์ทั้งหมด</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-green-50 p-5 rounded-xl border border-green-100 shadow-sm">
            <h3 className="font-semibold text-green-900">งานที่มอบหมาย</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div className="bg-yellow-50 p-5 rounded-xl border border-yellow-100 shadow-sm">
            <h3 className="font-semibold text-yellow-900">รายงานรอตรวจ</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">0</p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-100 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">สถานะการพัฒนา (Phase 1)</h3>
          <p className="text-gray-600">
            ระบบ Authentication และ Protected Routes ทำงานได้แล้ว!
          </p>
          <ul className="mt-2 text-sm text-gray-600 space-y-1">
            <li>✅ Backend API (NestJS + Prisma + PostgreSQL)</li>
            <li>✅ JWT Authentication</li>
            <li>✅ Role-Based Access Control</li>
            <li>✅ Frontend (React + Vite + Tailwind + Zustand)</li>
            <li>✅ Login & Protected Routes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
