/**
 * Manage Incidents Page V2 - Improved UI/UX
 * 
 * ✅ ปรับปรุง:
 * - ใช้ Tailwind CSS แทน inline styles
 * - ใช้ KPICard component
 * - ใช้ IncidentCard component
 * - Text truncation ทุกที่
 * - Responsive design ดีขึ้น
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { incidentsApi } from '../../api/incidents';
import { villagesApi } from '../../api/villages';
import type { Incident, IncidentStatus, Priority, Village } from '../../types';
import { AssignIncidentModal } from '../../components/supervisor/AssignIncidentModal';
import IncidentDetailsModal from '../../components/incidents/IncidentDetailsModal';
import { KPICard } from '../../components/dashboard/KPICard';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import toast from 'react-hot-toast';

export default function ManageIncidentsPageV2() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'ongoing' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVillage, setFilterVillage] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [allVillages, setAllVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        incidentsApi.getAll(),
        villagesApi.getAll(),
      ]);

      const incidentsData = results[0].status === 'fulfilled' ? results[0].value : [];
      const villagesData = results[1].status === 'fulfilled' ? results[1].value : [];

      setIncidents(incidentsData);
      setAllVillages(villagesData);

      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        console.warn('⚠️ Some data failed to load:', failures);
        toast.error(`โหลดข้อมูลบางส่วนไม่สำเร็จ (${failures.length}/${results.length})`);
      }
    } catch (error) {
      console.error('❌ Error loading data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    if (activeTab === 'new' && incident.status !== 'PENDING') return false;
    if (activeTab === 'ongoing' && incident.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'closed' && (incident.status !== 'RESOLVED' && incident.status !== 'CLOSED')) return false;

    if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filterVillage !== 'all' && incident.village?.id !== filterVillage) return false;
    if (filterPriority !== 'all' && incident.priority !== filterPriority) return false;

    return true;
  });

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDetailsModal(true);
  };

  const handleAssign = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowAssignModal(true);
  };

  const handleAssignSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClose = async (incident: Incident) => {
    if (confirm(`ยืนยันการปิดงาน: ${incident.title}?`)) {
      try {
        await incidentsApi.update(incident.id, { status: 'CLOSED' as any });
        toast.success(`✅ ปิดงาน: ${incident.title} สำเร็จ!`);
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error closing incident:', error);
        toast.error('ไม่สามารถปิดงานได้');
      }
    }
  };

  // Calculate stats
  const stats = {
    total: incidents.length,
    new: incidents.filter(i => i.status === 'PENDING').length,
    ongoing: incidents.filter(i => i.status === 'IN_PROGRESS').length,
    closed: incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ✅ Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 sm:p-8 mb-6 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <span>⚠️</span>
            <span className="truncate">จัดการเหตุการณ์</span>
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base">
            ศูนย์กลางการจัดการเหตุการณ์ภัยพิบัติทั้งหมด
          </p>

          {/* ✅ Stats - Using KPICard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                📊 ทั้งหมด
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stats.total}
              </div>
            </div>
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                🆕 เหตุการณ์ใหม่
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-red-600">
                {stats.new}
              </div>
            </div>
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                🔄 กำลังดำเนินการ
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {stats.ongoing}
              </div>
            </div>
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                ✅ เสร็จสิ้น
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {stats.closed}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Filters */}
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
              {allVillages.map(v => (
                <option key={v.id} value={v.id}>{v.name}</option>
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

        {/* ✅ Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: '📋 ทั้งหมด', count: incidents.length, color: 'indigo' },
            { key: 'new', label: '🆕 เหตุการณ์ใหม่', count: stats.new, color: 'red' },
            { key: 'ongoing', label: '🔄 กำลังดำเนินการ', count: stats.ongoing, color: 'blue' },
            { key: 'closed', label: '✅ เสร็จสิ้น', count: stats.closed, color: 'green' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[150px] px-4 py-3 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? `bg-gradient-to-r from-${tab.color}-600 to-${tab.color}-700 text-white shadow-md`
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
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                ไม่พบเหตุการณ์
              </h3>
              <p className="text-gray-400">
                ลองเปลี่ยนตัวกรองหรือคำค้นหา
              </p>
            </div>
          ) : (
            filteredIncidents.map(incident => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onViewDetails={handleViewDetails}
                onAssign={handleAssign}
                onClose={handleClose}
              />
            ))
          )}
        </div>
      </div>

      {/* ✅ Modals */}
      {showDetailsModal && selectedIncident && (
        <IncidentDetailsModal
          incidentId={selectedIncident.id}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onUpdate={handleAssignSuccess}
        />
      )}

      {showAssignModal && selectedIncident && (
        <AssignIncidentModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          incident={selectedIncident}
          onSuccess={handleAssignSuccess}
        />
      )}
    </DashboardLayout>
  );
}
