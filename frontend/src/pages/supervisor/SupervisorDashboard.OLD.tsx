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
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 flex items-center gap-3 mb-2">
                  <AlertTriangle className="text-blue-600" size={32} />
                  Supervisor Dashboard
                </h1>
                <p className="text-gray-600 font-medium">ภาพรวมประสิทธิภาพและการจัดการเหตุการณ์</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md text-sm"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">Broadcast</span>
                </button>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md text-sm"
                >
                  <Plus size={18} />
                  <span className="hidden sm:inline">เหตุการณ์ใหม่</span>
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Incidents */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full min-h-[120px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="text-white" size={20} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-0.5 rounded-md">Active</span>
                </div>
                <div className="mt-auto">
                  <p className="text-3xl font-bold text-white mb-1">{stats.totalIncidents}</p>
                  <p className="text-xs font-medium text-white/90 uppercase tracking-wide">เหตุการณ์ทั้งหมด</p>
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full min-h-[120px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white" size={20} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-0.5 rounded-md">Pending</span>
                </div>
                <div className="mt-auto">
                  <p className="text-3xl font-bold text-white mb-1">{stats.pendingIncidents}</p>
                  <p className="text-xs font-medium text-white/90 uppercase tracking-wide">รอดำเนินการ</p>
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full min-h-[120px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="text-white" size={20} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-0.5 rounded-md">Progress</span>
                </div>
                <div className="mt-auto">
                  <p className="text-3xl font-bold text-white mb-1">{stats.inProgressIncidents}</p>
                  <p className="text-xs font-medium text-white/90 uppercase tracking-wide">กำลังดำเนินการ</p>
                </div>
              </div>
            </div>

            {/* Total Tasks */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full min-h-[120px]">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-white" size={20} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-0.5 rounded-md">Tasks</span>
                </div>
                <div className="mt-auto">
                  <p className="text-3xl font-bold text-white mb-1">{stats.totalTasks}</p>
                  <p className="text-xs font-medium text-white/90 uppercase tracking-wide">งานทั้งหมด</p>
                </div>
              </div>
            </div>
          </div>

          {/* Incidents List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <AlertTriangle size={20} />
                </span>
                รายการเหตุการณ์
              </h2>
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all font-semibold"
              >
                <RefreshCw size={16} />
                รีเฟรช
              </button>
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
