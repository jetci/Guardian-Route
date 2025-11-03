import { useState } from 'react';
import { IncidentsList } from '../../components/incidents/IncidentsList';
import { IncidentForm } from '../../components/incidents/IncidentForm';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';

export const SupervisorDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setRefreshKey(prev => prev + 1); // Force refresh incidents list
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ศูนย์บัญชาการ - Guardian Route
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {user?.firstName} {user?.lastName} ({user?.role})
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/map')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🗺️ แผนที่
              </button>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + สร้างเหตุการณ์
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
        <IncidentsList key={refreshKey} />
      </div>

      {/* Modal สำหรับสร้าง Incident */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">สร้างเหตุการณ์ใหม่</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <IncidentForm onSuccess={handleFormSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};
