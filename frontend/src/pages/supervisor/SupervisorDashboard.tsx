import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { IncidentsList } from '../../components/incidents/IncidentsList';
import { IncidentForm } from '../../components/incidents/IncidentForm';
import { useAuthStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { incidentsApi } from '../../api/incidents';
import { tasksApi } from '../../api/tasks';
import { BroadcastModal } from '../../components/notifications/BroadcastModal';
import { AlertTriangle, Clock, Zap, CheckCircle, Plus, RefreshCw } from 'lucide-react';

export const SupervisorDashboard = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    pendingIncidents: 0,
    inProgressIncidents: 0,
    totalTasks: 0,
  });
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const incidentsData = await incidentsApi.getAll();
      
      // Count incidents by status
      const pending = incidentsData.filter((i: any) => i.status === 'PENDING').length;
      const inProgress = incidentsData.filter((i: any) => i.status === 'IN_PROGRESS').length;
      
      // Try to get task stats, fallback to 0 if API fails
      let totalTasks = 0;
      try {
        const taskStats = await tasksApi.getStatistics();
        totalTasks = (taskStats.byStatus?.IN_PROGRESS || 0) + (taskStats.byStatus?.PENDING || 0);
      } catch (taskError) {
        console.warn('Could not load task stats:', taskError);
      }
      
      setStats({
        totalIncidents: incidentsData.length,
        pendingIncidents: pending,
        inProgressIncidents: inProgress,
        totalTasks: totalTasks,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Set default values on error
      setStats({
        totalIncidents: 0,
        pendingIncidents: 0,
        inProgressIncidents: 0,
        totalTasks: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-8">
        <div className="w-full space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 sm:p-8 mb-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <span>🎛️</span>
                  <span>แดชบอร์ดบัญชาการ</span>
                </h1>
                <p className="text-indigo-100 text-sm sm:text-base">ภาพรวมประสิทธิภาพและการจัดการเหตุการณ์</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/manage-incidents')}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold text-sm backdrop-blur-sm"
                >
                  <span>👥</span>
                  <span className="hidden sm:inline">จัดการเหตุการณ์</span>
                  <span className="sm:hidden">จัดการ</span>
                </button>
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold text-sm backdrop-blur-sm"
                >
                  <span>📢</span>
                  <span className="hidden sm:inline">Broadcast</span>
                </button>
                <button
                  onClick={() => setRefreshKey(prev => prev + 1)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold text-sm backdrop-blur-sm"
                >
                  <span className={loading ? 'animate-spin' : ''}>🔄</span>
                  <span className="hidden sm:inline">รีเฟรช</span>
                </button>
              </div>
            </div>

            {/* Stats Cards Inside Header */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/95 rounded-xl p-4 shadow-sm">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                  📊 ทั้งหมด
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {stats.totalIncidents}
                </div>
              </div>
              <div className="bg-white/95 rounded-xl p-4 shadow-sm">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                  ⏰ รอดำเนินการ
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                  {stats.pendingIncidents}
                </div>
              </div>
              <div className="bg-white/95 rounded-xl p-4 shadow-sm">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                  ⚡ กำลังดำเนินการ
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {stats.inProgressIncidents}
                </div>
              </div>
              <div className="bg-white/95 rounded-xl p-4 shadow-sm">
                <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                  ✅ งานทั้งหมด
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {stats.totalTasks}
                </div>
              </div>
            </div>
          </div>


          {/* Incidents List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📋</span>
                รายการเหตุการณ์
              </h2>
            </div>
            <IncidentsList key={refreshKey} refreshKey={refreshKey} />
          </div>
        </div>
      </div>

      {/* Modal สำหรับ Broadcast */}
      <BroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
      />

      {/* Modal สำหรับสร้าง Incident */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 animate-fade-in-up">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
                สร้างเหตุการณ์ใหม่
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <IncidentForm onSuccess={handleFormSuccess} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
