/**
 * Supervisor Dashboard V5 - Mobile-First Design
 * 
 * ✅ ปรับปรุงตาม pattern จาก ManageIncidentsPageV2:
 * - Header แบบ gradient พร้อม stats ด้านใน
 * - Filters แยกชัดเจน พร้อม emoji
 * - Tabs แบบ horizontal scroll
 * - Text ขนาดใหญ่ อ่านง่ายบนมือถือ
 * - Spacing กว้างขึ้น สะดวกแตะบนมือถือ
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { incidentsApi } from '../../api/incidents';
import { tasksApi } from '../../api/tasks';
import { villagesApi } from '../../api/villages';
import { BroadcastModal } from '../../components/notifications/BroadcastModal';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import IncidentDetailsModal from '../../components/incidents/IncidentDetailsModal';
import { AssignIncidentModal } from '../../components/supervisor/AssignIncidentModal';
import { ReviewIncidentModal } from '../../components/supervisor/ReviewIncidentModal';
import type { Incident, IncidentStatus, Priority, DisasterType, Village } from '../../types';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalIncidents: number;
  pendingIncidents: number;
  inProgressIncidents: number;
  totalTasks: number;
}

const SupervisorDashboardV5 = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'ongoing' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVillage, setFilterVillage] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
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
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        incidentsApi.getAll(),
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

  // Filter incidents
  const filteredIncidents = incidents.filter((incident) => {
    // Tab filter
    if (activeTab === 'pending' && incident.status !== 'PENDING') return false;
    if (activeTab === 'ongoing' && incident.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'resolved' && (incident.status !== 'RESOLVED' && incident.status !== 'CLOSED')) return false;

    // Search filter
    if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Village filter
    if (filterVillage !== 'all' && incident.villageId !== filterVillage) return false;

    // Priority filter
    if (filterPriority !== 'all' && incident.priority !== filterPriority) return false;

    return true;
  });

  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ✅ Header with Stats Inside */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 sm:p-8 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <span>🎛️</span>
                <span>แดชบอร์ดบัญชาการ</span>
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base">
                ภาพรวมประสิทธิภาพและการจัดการเหตุการณ์
              </p>
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
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all font-semibold text-sm backdrop-blur-sm"
              >
                <span className={loading ? 'animate-spin' : ''}>🔄</span>
                <span className="hidden sm:inline">รีเฟรช</span>
              </button>
            </div>
          </div>

          {/* ✅ Stats Cards Inside Header */}
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

        {/* ✅ Filters Section */}
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="🔍 ค้นหาเหตุการณ์..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
            />

            {/* Village Filter */}
            <select
              value={filterVillage}
              onChange={(e) => setFilterVillage(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
            >
              <option value="all">📍 ทุกหมู่บ้าน</option>
              {villages.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
            >
              <option value="all">⚡ ทุกระดับ</option>
              <option value="CRITICAL">🔴 สูงมาก</option>
              <option value="HIGH">🟠 สูง</option>
              <option value="MEDIUM">🟡 ปานกลาง</option>
              <option value="LOW">🟢 ต่ำ</option>
            </select>

            {/* Results Count */}
            <div className="flex items-center justify-center sm:justify-start px-4 py-2.5 bg-gray-50 rounded-lg text-sm font-semibold text-gray-700">
              พบ {filteredIncidents.length} รายการ
            </div>
          </div>
        </div>

        {/* ✅ Tabs - Horizontal Scroll */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: '📋 ทั้งหมด', count: incidents.length, color: 'indigo' },
            { key: 'pending', label: '⏰ รอดำเนินการ', count: stats.pendingIncidents, color: 'orange' },
            { key: 'ongoing', label: '⚡ กำลังดำเนินการ', count: stats.inProgressIncidents, color: 'blue' },
            { key: 'resolved', label: '✅ เสร็จสิ้น', count: resolvedCount, color: 'green' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[150px] px-4 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* ✅ Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.length === 0 ? (
            <div className="bg-white rounded-xl p-12 sm:p-16 text-center border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">ไม่พบเหตุการณ์</h3>
              <p className="text-gray-400">ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onViewDetails={() => setSelectedIncidentId(incident.id)}
                onAssign={() => handleAssignClick(incident)}
                onClose={() => handleReviewClick(incident)}
              />
            ))
          )}
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

export default SupervisorDashboardV5;
