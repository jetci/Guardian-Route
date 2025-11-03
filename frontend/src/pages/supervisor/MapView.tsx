import { useState } from 'react';
import { IncidentsMap } from '../../components/maps/IncidentsMap';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import type { Incident } from '../../types';
import toast from 'react-hot-toast';

export const MapView = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    toast.success(`เลือก: ${incident.title}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                แผนที่เหตุการณ์ - Guardian Route
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {user?.firstName} {user?.lastName} ({user?.role})
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/supervisor')}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                รายการเหตุการณ์
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">แผนที่แสดงเหตุการณ์ทั้งหมด</h2>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-500"></div>
                <span>ต่ำ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                <span>ปานกลาง</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span>สูง</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span>วิกฤต</span>
              </div>
            </div>
          </div>
        </div>

        <IncidentsMap 
          className="h-[calc(100vh-250px)] w-full rounded-lg shadow"
          onIncidentClick={handleIncidentClick}
        />

        {selectedIncident && (
          <div className="mt-4 bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">เหตุการณ์ที่เลือก:</h3>
            <p className="text-lg">{selectedIncident.title}</p>
            <button
              onClick={() => toast('Detail page coming soon!', { icon: 'ℹ️' })}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              ดูรายละเอียดเพิ่มเติม →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
