import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { incidentsApi } from '../../api/incidents';
import { tasksApi } from '../../api/tasks';
import { villagesApi } from '../../api/villages';
import { BroadcastModal } from '../../components/notifications/BroadcastModal';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import { KPICard } from '../../components/dashboard/KPICard';
import IncidentDetailsModal from '../../components/incidents/IncidentDetailsModal';
import { AssignIncidentModal } from '../../components/supervisor/AssignIncidentModal';
import { ReviewIncidentModal } from '../../components/supervisor/ReviewIncidentModal';
import type { Incident, IncidentStatus, Priority, DisasterType, Village } from '../../types';
import toast from 'react-hot-toast';
import {
  AlertTriangle,
  Clock,
  Zap,
  CheckCircle,
  Plus,
  RefreshCw,
  Filter,
  X,
  Radio,
  TrendingUp,
  Users,
} from 'lucide-react';

interface DashboardStats {
  totalIncidents: number;
  pendingIncidents: number;
  inProgressIncidents: number;
  totalTasks: number;
}

export const SupervisorDashboardV4 = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    pendingIncidents: 0,
    inProgressIncidents: 0,
    totalTasks: 0,
  });
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);
  const [filters, setFilters] = useState({
    status: '' as IncidentStatus | '',
    priority: '' as Priority | '',
    disasterType: '' as DisasterType | '',
    village: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey, filters]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        incidentsApi.getAll({
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          disasterType: filters.disasterType || undefined,
        }),
        tasksApi.getStatistics(),
        villagesApi.getAll(),
      ]);

      // Handle incidents
      if (results[0].status === 'fulfilled') {
        const incidentsData = results[0].value;
        setIncidents(incidentsData);

        const pending = incidentsData.filter((i: Incident) => i.status === 'PENDING').length;
        const inProgress = incidentsData.filter((i: Incident) => i.status === 'IN_PROGRESS').length;

        setStats((prev) => ({
          ...prev,
          totalIncidents: incidentsData.length,
          pendingIncidents: pending,
          inProgressIncidents: inProgress,
        }));
      } else {
        console.error('Failed to load incidents:', results[0].reason);
        toast.error('ไม่สามารถโหลดข้อมูลเหตุการณ์ได้');
      }

      // Handle tasks
      if (results[1].status === 'fulfilled') {
        const taskStats = results[1].value;
        const totalTasks = (taskStats.byStatus?.IN_PROGRESS || 0) + (taskStats.byStatus?.PENDING || 0);
        setStats((prev) => ({ ...prev, totalTasks }));
      } else {
        console.warn('Could not load task stats:', results[1].reason);
      }

      // Handle villages
      if (results[2].status === 'fulfilled') {
        setVillages(results[2].value);
      } else {
        console.warn('Could not load villages:', results[2].reason);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      disasterType: '',
      village: '',
    });
  };

  const handleAssignClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setAssignModalOpen(true);
  };

  const handleReviewClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setReviewModalOpen(true);
  };

  const handleModalSuccess = () => {
    setAssignModalOpen(false);
    setReviewModalOpen(false);
    setSelectedIncidentId(null);
    handleRefresh();
  };

  const filteredIncidents = incidents.filter((incident) => {
    if (filters.village && incident.villageId !== filters.village) return false;
    return true;
  });

  const hasActiveFilters = filters.status || filters.priority || filters.disasterType || filters.village;

  if (loading && incidents.length === 0) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-8">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-8">
        <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 flex items-center gap-3 mb-2">
                  <AlertTriangle className="text-blue-600 flex-shrink-0" size={32} />
                  <span className="truncate">แดชบอร์ดบัญชาการ</span>
                </h1>
                <p className="text-gray-600 font-medium text-sm sm:text-base">
                  ภาพรวมประสิทธิภาพและการจัดการเหตุการณ์
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <button
                  onClick={() => navigate('/manage-incidents')}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold shadow-md text-xs sm:text-sm"
                >
                  <Users size={16} />
                  <span className="hidden sm:inline">จัดการเหตุการณ์</span>
                  <span className="sm:hidden">จัดการ</span>
                </button>
                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold shadow-md text-xs sm:text-sm"
                >
                  <Radio size={16} />
                  <span className="hidden sm:inline">Broadcast</span>
                </button>
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold shadow-md text-xs sm:text-sm"
                >
                  <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                  <span className="hidden sm:inline">รีเฟรช</span>
                </button>
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <KPICard
              title="เหตุการณ์ทั้งหมด"
              value={stats.totalIncidents}
              icon="📊"
              color="blue"
              trend="stable"
            />
            <KPICard
              title="รอดำเนินการ"
              value={stats.pendingIncidents}
              icon="⏰"
              color="orange"
              trend="stable"
            />
            <KPICard
              title="กำลังดำเนินการ"
              value={stats.inProgressIncidents}
              icon="⚡"
              color="purple"
              trend="stable"
            />
            <KPICard
              title="งานทั้งหมด"
              value={stats.totalTasks}
              icon="✅"
              color="green"
              trend="stable"
            />
          </div>

          {/* Filters Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Filter size={20} />
                </span>
                <span className="truncate">ตัวกรอง</span>
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-all font-semibold"
              >
                <Filter size={16} />
                {showFilters ? 'ซ่อนตัวกรอง' : 'แสดงตัวกรอง'}
              </button>
            </div>

            {showFilters && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">สถานะ</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value as IncidentStatus | '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="PENDING">รอดำเนินการ</option>
                      <option value="IN_PROGRESS">กำลังดำเนินการ</option>
                      <option value="RESOLVED">แก้ไขแล้ว</option>
                      <option value="CLOSED">ปิดงาน</option>
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ความสำคัญ</label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value as Priority | '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="LOW">ต่ำ</option>
                      <option value="MEDIUM">ปานกลาง</option>
                      <option value="HIGH">สูง</option>
                      <option value="CRITICAL">วิกฤต</option>
                    </select>
                  </div>

                  {/* Disaster Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ประเภทภัย</label>
                    <select
                      value={filters.disasterType}
                      onChange={(e) => setFilters({ ...filters, disasterType: e.target.value as DisasterType | '' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">ทั้งหมด</option>
                      <option value="FLOOD">น้ำท่วม</option>
                      <option value="LANDSLIDE">ดินถล่ม</option>
                      <option value="FIRE">ไฟไหม้</option>
                      <option value="STORM">พายุ</option>
                      <option value="EARTHQUAKE">แผ่นดินไหว</option>
                      <option value="DROUGHT">ภัยแล้ง</option>
                      <option value="OTHER">อื่นๆ</option>
                    </select>
                  </div>

                  {/* Village Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">หมู่บ้าน</label>
                    <select
                      value={filters.village}
                      onChange={(e) => setFilters({ ...filters, village: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="">ทั้งหมด</option>
                      {villages.map((village) => (
                        <option key={village.id} value={village.id}>
                          {village.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all font-medium"
                    >
                      <X size={16} />
                      ล้างตัวกรอง
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Incidents List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <AlertTriangle size={20} />
                </span>
                <span className="truncate">รายการเหตุการณ์</span>
                <span className="text-sm font-normal text-gray-500">({filteredIncidents.length})</span>
              </h2>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 font-medium text-sm">กำลังโหลด...</p>
                </div>
              </div>
            ) : filteredIncidents.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-600 font-medium mb-2">ไม่พบเหตุการณ์</p>
                <p className="text-gray-500 text-sm">
                  {hasActiveFilters ? 'ลองปรับเปลี่ยนตัวกรองหรือล้างตัวกรอง' : 'ยังไม่มีเหตุการณ์ในระบบ'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredIncidents.map((incident) => (
                  <IncidentCard
                    key={incident.id}
                    incident={incident}
                    onViewDetails={() => setSelectedIncidentId(incident.id)}
                    onAssign={() => handleAssignClick(incident)}
                    onClose={() => handleReviewClick(incident)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <BroadcastModal isOpen={showBroadcastModal} onClose={() => setShowBroadcastModal(false)} />

      {selectedIncidentId && (
        <IncidentDetailsModal
          incidentId={selectedIncidentId}
          isOpen={!!selectedIncidentId}
          onClose={() => setSelectedIncidentId(null)}
          onUpdate={handleModalSuccess}
        />
      )}

      {assignModalOpen && selectedIncident && (
        <AssignIncidentModal
          isOpen={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          incident={selectedIncident}
          onSuccess={handleModalSuccess}
        />
      )}

      {reviewModalOpen && selectedIncident && (
        <ReviewIncidentModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          incident={selectedIncident}
          onSuccess={handleModalSuccess}
        />
      )}
    </DashboardLayout>
  );
};
