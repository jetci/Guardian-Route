/**
 * Modern Supervisor Dashboard
 * Standardized with DashboardLayout
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { AssignIncidentModal } from '../../components/supervisor/AssignIncidentModal';
import { ReviewIncidentModal } from '../../components/supervisor/ReviewIncidentModal';
import { incidentService } from '../../services/incidentService';
import { incidentsApi } from '../../api/incidents';
import usersApi from '../../services/userService';


export default function SupervisorDashboardModern() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'urgent' | 'normal'>('urgent');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);

  // Data states
  const [incidents, setIncidents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    urgentIncidents: 0,
    activeOfficers: 0,
    totalOfficers: 0,
    avgResponseTime: "N/A"
  });


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch incidents, users, and stats in parallel
      const [incidentsData, usersData, statsData] = await Promise.all([
        incidentService.getAll(),
        usersApi.getAll(),
        incidentService.getStatistics()
      ]);

      setIncidents(incidentsData);

      // Calculate stats
      const urgentCount = incidentsData.filter((i: any) =>
        i.priority === 'HIGH' || i.priority === 'CRITICAL'
      ).length;

      const fieldOfficers = usersData.filter((u: any) => u.role === 'FIELD_OFFICER');
      const activeOfficers = fieldOfficers.filter((u: any) => u.isActive).length;

      setStats({
        totalIncidents: incidentsData.length,
        urgentIncidents: urgentCount,
        activeOfficers,
        totalOfficers: fieldOfficers.length,
        avgResponseTime: statsData.avgResponseTime ? `${statsData.avgResponseTime} ชม.` : 'N/A'
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // Filter incidents based on tab
  const filteredIncidents = incidents.filter(incident => {
    const isUrgent = incident.priority === 'HIGH' || incident.priority === 'CRITICAL';
    return activeTab === 'urgent' ? isUrgent : !isUrgent;
  });

  return (
    <DashboardLayout>
      <div className="p-6 font-sans max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 mb-2">
              Supervisor Dashboard
            </h1>
            <p className="text-slate-500 font-medium text-lg">
              Overview of team performance and incident management
            </p>
          </div>

          <div className="flex gap-3">
            <button
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-xl group"
              onClick={() => toast.success('🔔 Notifications')}
            >
              <span className="group-hover:scale-110 block transition-transform">🔔</span>
            </button>
            <button
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-xl group"
              onClick={() => navigate('/profile')}
            >
              <span className="group-hover:scale-110 block transition-transform">👤</span>
            </button>
          </div>
        </header>

        {/* Weather Widget */}
        <div className="mb-8">
          <WeatherWidget />
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div>
            <StatCard
              title="Total Incidents"
              value={stats.totalIncidents}
              icon="📊"
              color="purple"
              loading={loading}
            />
          </div>
          <div>
            <StatCard
              title="Urgent Incidents"
              value={stats.urgentIncidents}
              icon="🚨"
              color="red"
              loading={loading}
            />
          </div>
          <div>
            <StatCard
              title="Avg Response Time"
              value={stats.avgResponseTime}
              icon="⏱️"
              color="blue"
              loading={loading}
            />
          </div>
          <div>
            <StatCard
              title="Active Officers"
              value={`${stats.activeOfficers}/${stats.totalOfficers}`}
              icon="👥"
              color="green"
              loading={loading}
              trend={`${stats.totalOfficers > 0 ? Math.round((stats.activeOfficers / stats.totalOfficers) * 100) : 0}% Active`}
              trendDirection="positive"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-10">
          <button
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300 hover:-translate-y-1 transition-all duration-300 group"
            onClick={() => navigate('/tasks/create')}
          >
            <span className="text-xl group-hover:rotate-90 transition-transform duration-300">➕</span>
            Assign New Task
          </button>
          <button
            className="flex items-center gap-3 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            onClick={() => navigate('/manage-users')}
          >
            <span className="text-xl">👥</span> Team Overview
          </button>
          <button
            className="flex items-center gap-3 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            onClick={() => navigate('/reports')}
          >
            <span className="text-xl">📊</span> All Reports
          </button>
        </div>

        {/* Reports Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/60 shadow-xl shadow-slate-200/60">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-100 pb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600">📝</span>
              Recent Incidents
            </h2>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-lg font-medium hover:bg-slate-100 hover:text-indigo-600 transition-colors"
              onClick={fetchDashboardData}
            >
              <span className={`transition-transform duration-700 ${loading ? 'animate-spin' : ''}`}>🔄</span>
              Refresh Data
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-slate-100/80 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('urgent')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'urgent'
                ? 'bg-white text-indigo-600 shadow-md scale-105'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
              🔥 Urgent ({incidents.filter(i => i.priority === 'HIGH' || i.priority === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setActiveTab('normal')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === 'normal'
                ? 'bg-white text-indigo-600 shadow-md scale-105'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
            >
              📋 Normal ({incidents.filter(i => !(i.priority === 'HIGH' || i.priority === 'CRITICAL')).length})
            </button>
          </div>

          {/* Report Cards */}
          <div className="space-y-4">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-6 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))
            ) : filteredIncidents.length === 0 ? (
              <div className="py-16 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="text-6xl mb-4 opacity-20">📭</div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">No incidents found</h3>
                <p className="text-slate-400">Great job! Everything seems to be under control.</p>
              </div>
            ) : (
              <>
                {filteredIncidents.map(incident => (
                  <div
                    key={incident.id}
                    className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                          {incident.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            📍 {incident.location?.address || 'No Location'}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            🏷️ {incident.type}
                          </span>
                          <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                            🕐 {new Date(incident.createdAt).toLocaleString('th-TH')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${incident.priority === 'CRITICAL' ? 'bg-red-50 text-red-600 border border-red-100' :
                          incident.priority === 'HIGH' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                            incident.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                              'bg-green-50 text-green-600 border border-green-100'
                          }`}>
                          {incident.priority}
                        </span>
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide shadow-sm ${incident.status === 'PENDING' ? 'bg-slate-50 text-slate-600 border border-slate-200' :
                          incident.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                            'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          }`}>
                          {incident.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 mb-6 line-clamp-2 leading-relaxed pl-1 border-l-4 border-slate-100 group-hover:border-indigo-200 transition-colors">
                      {incident.description}
                    </p>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-50">
                      <button
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
                        onClick={() => navigate(`/incidents/${incident.id}`)}
                      >
                        👁️ View Details
                      </button>

                      {/* Assign Button - Show for PENDING incidents */}
                      {incident.status === 'PENDING' && (
                        <button
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-100 transition-all duration-200"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setShowAssignModal(true);
                          }}
                        >
                          ➕ Assign
                        </button>
                      )}

                      {/* Review Button - Show for PENDING incidents */}
                      {incident.status === 'PENDING' && (
                        <button
                          className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 text-amber-600 rounded-xl text-sm font-bold hover:bg-amber-100 hover:shadow-md hover:shadow-amber-100 transition-all duration-200"
                          onClick={() => {
                            setSelectedIncident(incident);
                            setShowReviewModal(true);
                          }}
                        >
                          ✅ Review
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Assign Incident Modal */}
      <AssignIncidentModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedIncident(null);
        }}
        incident={selectedIncident}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />

      {/* Review Incident Modal */}
      <ReviewIncidentModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedIncident(null);
        }}
        incident={selectedIncident}
        onSuccess={() => {
          fetchDashboardData();
        }}
      />
    </DashboardLayout>
  );
}
