/**
 * Supervisor Dashboard V3 - Improved UI/UX
 * 
 * ✅ ปรับปรุง:
 * - ใช้ reusable components (KPICard, ChartCard)
 * - Text truncation ทุกที่
 * - Responsive design ดีขึ้น
 * - Consistent spacing
 * - Better modal design
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import { getReports, reviewReport } from '../../api/reports';
import { usersApi } from '../../api/users';
import { tasksApi } from '../../api/tasks';
import { incidentsApi } from '../../api/incidents';
import { type Report, type User, type CreateTaskDto, TaskPriority, type Incident, ReportStatus } from '../../types';
import { KPICard } from '../../components/dashboard/KPICard';
import {
  Users,
  ClipboardList,
  Clock,
  CheckCircle,
  Plus,
  MapPin,
  AlertTriangle,
  FileText,
  UserPlus,
  X,
  Bell
} from 'lucide-react';

export default function SupervisorDashboardV3() {
  const [activeTab, setActiveTab] = useState<'urgent' | 'normal' | 'reviewed'>('urgent');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Form States
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    assignedToId: '',
    priority: 'MEDIUM' as TaskPriority,
    dueDate: new Date(),
    incidentId: ''
  });
  const [revisionComments, setRevisionComments] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Data States
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teamSize: 0,
    activeTasks: 0,
    pendingReview: 0,
    completedToday: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const results = await Promise.allSettled([
        getReports({ status: ReportStatus.SUBMITTED }),
        usersApi.getFieldOfficers(),
        tasksApi.getStatistics(),
        incidentsApi.getAll(),
      ]);

      const reportsData = results[0].status === 'fulfilled' 
        ? results[0].value 
        : { data: [], meta: { total: 0 } };
      
      const team = results[1].status === 'fulfilled' 
        ? results[1].value 
        : [];
      
      const taskStats = results[2].status === 'fulfilled' 
        ? results[2].value 
        : { byStatus: {} };
      
      const incidentsData = results[3].status === 'fulfilled' 
        ? results[3].value 
        : [];

      setPendingReports(reportsData.data || []);
      setTeamMembers(team);
      setIncidents(incidentsData);

      setStats({
        teamSize: team.length,
        activeTasks: (taskStats.byStatus as Record<string, number>)?.IN_PROGRESS || 0,
        pendingReview: reportsData.meta?.total || 0,
        completedToday: (taskStats.byStatus as Record<string, number>)?.COMPLETED || 0
      });

      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        console.warn('⚠️ Some data failed to load:', failures);
        toast.error(`โหลดข้อมูลบางส่วนไม่สำเร็จ (${failures.length}/${results.length})`);
      }
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = pendingReports.filter(report => true);
  const urgentCount = 0;
  const normalCount = pendingReports.length;

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const taskData: CreateTaskDto = {
        ...taskFormData,
        dueDate: taskFormData.dueDate.toISOString().split('T')[0]
      };
      await tasksApi.create(taskData);
      toast.success('✅ มอบหมายงานสำเร็จ!');
      setShowAssignModal(false);
      setTaskFormData({
        title: '',
        description: '',
        assignedToId: '',
        priority: TaskPriority.MEDIUM,
        dueDate: new Date(),
        incidentId: ''
      });
      loadDashboardData();
    } catch (error) {
      console.error('❌ Error assigning task:', error);
      toast.error('ไม่สามารถสร้างงานได้');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (reportId: string) => {
    try {
      await reviewReport(reportId, {
        status: ReportStatus.APPROVED,
        comments: 'Approved by supervisor'
      });
      toast.success(`✅ อนุมัติรายงานเรียบร้อย!`);
      loadDashboardData();
    } catch (error) {
      console.error('❌ Error approving report:', error);
      toast.error('ไม่สามารถอนุมัติรายงานได้');
    }
  };

  const handleRequestRevision = (report: any) => {
    setSelectedReport(report);
    setRevisionComments('');
    setShowReviewModal(true);
  };

  const handleSubmitRevision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await reviewReport(selectedReport.id, {
        status: ReportStatus.REVISION_REQUESTED,
        comments: revisionComments
      });
      toast.success('📤 ส่งคำขอแก้ไขเรียบร้อย!');
      setShowReviewModal(false);
      setRevisionComments('');
      loadDashboardData();
    } catch (error) {
      console.error('❌ Error requesting revision:', error);
      toast.error('ไม่สามารถส่งคำขอแก้ไขได้');
    } finally {
      setSubmitting(false);
    }
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
      {/* Container with max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ✅ Header Section - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent truncate">
              Supervisor Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              ภาพรวมประสิทธิภาพทีมและการจัดการเหตุการณ์
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button className="p-2 sm:p-2.5 rounded-xl bg-white border border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 hover:shadow-md transition-all relative">
              <Bell size={18} className="sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <button
              onClick={() => setShowAssignModal(true)}
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden sm:inline">มอบหมายงานใหม่</span>
              <span className="sm:hidden">มอบหมาย</span>
            </button>
          </div>
        </div>

        {/* ✅ KPI Cards - Using KPICard component */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <KPICard
            title="สมาชิกในทีม"
            value={stats.teamSize}
            icon="👥"
            color="blue"
            subtitle="Active Now"
          />
          <KPICard
            title="งานที่กำลังดำเนินการ"
            value={stats.activeTasks}
            icon="📋"
            color="orange"
            subtitle="On Track"
          />
          <KPICard
            title="รอตรวจสอบ"
            value={stats.pendingReview}
            icon="⏰"
            color="purple"
            trend={stats.pendingReview > 0 ? 'up' : 'stable'}
            trendValue={stats.pendingReview > 0 ? 'Action Needed' : 'All Clear'}
          />
          <KPICard
            title="เสร็จสิ้นวันนี้"
            value={stats.completedToday}
            icon="✅"
            color="green"
            trend="up"
            trendValue="+12% vs yesterday"
          />
        </div>

        {/* ✅ Main Content - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ✅ Pending Reviews Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600 flex-shrink-0">
                    <FileText size={18} className="sm:w-5 sm:h-5" />
                  </span>
                  <span className="truncate">รายงานที่รอตรวจสอบ</span>
                </h2>

                {/* Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-lg flex-shrink-0">
                  <button
                    onClick={() => setActiveTab('urgent')}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'urgent'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    เร่งด่วน ({urgentCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('normal')}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'normal'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ทั่วไป ({normalCount})
                  </button>
                </div>
              </div>

              {/* Reports List */}
              <div className="space-y-4">
                {filteredReports.length === 0 ? (
                  <div className="py-12 sm:py-16 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-400 mb-2">
                      ไม่มีรายงานค้างตรวจสอบ
                    </h3>
                    <p className="text-sm text-gray-400">
                      ยอดเยี่ยม! คุณจัดการทุกอย่างเรียบร้อยแล้ว
                    </p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all"
                    >
                      {/* Report Header */}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="px-2 sm:px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100 whitespace-nowrap">
                              รอตรวจสอบ
                            </span>
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock size={12} />
                              <span className="truncate">
                                {new Date(report.createdAt).toLocaleDateString('th-TH')}
                              </span>
                            </span>
                          </div>
                          <h3 
                            className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors"
                            title={report.title}
                          >
                            {report.title}
                          </h3>
                        </div>
                      </div>

                      {/* Report Info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg min-w-0">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm flex-shrink-0">
                            <Users size={14} />
                          </div>
                          <span className="text-sm font-medium truncate" title={`${report.author?.firstName} ${report.author?.lastName}`}>
                            {report.author?.firstName} {report.author?.lastName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-lg min-w-0">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-rose-500 shadow-sm flex-shrink-0">
                            <MapPin size={14} />
                          </div>
                          <span className="text-sm font-medium truncate">
                            {report.affectedHouseholds || 0} ครัวเรือน
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row items-stretch gap-2 pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleApprove(report.id)}
                          className="flex-1 py-2 sm:py-2.5 bg-emerald-50 text-emerald-600 rounded-lg text-sm font-semibold hover:bg-emerald-100 hover:shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <CheckCircle size={14} />
                          อนุมัติ
                        </button>
                        <button
                          onClick={() => handleRequestRevision(report)}
                          className="flex-1 py-2 sm:py-2.5 bg-amber-50 text-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-100 hover:shadow-sm transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                          <AlertTriangle size={14} />
                          ขอแก้ไข
                        </button>
                        <button className="flex-1 sm:flex-none px-4 py-2 sm:py-2.5 bg-gray-50 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                          ดูรายละเอียด
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ✅ Team Section */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600 flex-shrink-0">
                    <Users size={18} />
                  </span>
                  <span className="truncate">ทีมของฉัน</span>
                </h2>
                <button className="text-xs sm:text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors whitespace-nowrap">
                  ดูทั้งหมด →
                </button>
              </div>

              {/* Team Members */}
              <div className="space-y-3">
                {teamMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">ไม่มีสมาชิกในทีม</p>
                  </div>
                ) : (
                  teamMembers.map((member) => (
                    <div 
                      key={member.id} 
                      className="p-3 sm:p-4 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex items-center gap-3 sm:gap-4"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md flex-shrink-0">
                        {member.firstName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 
                          className="text-sm font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors"
                          title={`${member.firstName} ${member.lastName}`}
                        >
                          {member.firstName} {member.lastName}
                        </h4>
                        <p className="text-xs text-gray-500 truncate" title={member.email}>
                          {member.email}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${
                          member.isActive
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Member Button */}
              <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-sm">
                <UserPlus size={18} />
                เพิ่มสมาชิกทีม
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ✅ Modals - Improved Design */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-violet-50 sticky top-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-white p-2 rounded-lg shadow-sm text-indigo-600">
                  <Plus size={20} />
                </span>
                <span className="truncate">มอบหมายงานใหม่</span>
              </h3>
              <button
                onClick={() => setShowAssignModal(false)}
                className="p-2 rounded-lg hover:bg-white text-gray-400 hover:text-gray-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAssignTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  หัวข้อภารกิจ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                  placeholder="ระบุชื่อภารกิจ"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    เหตุการณ์ <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    value={taskFormData.incidentId}
                    onChange={(e) => setTaskFormData({ ...taskFormData, incidentId: e.target.value })}
                  >
                    <option value="">เลือก...</option>
                    {incidents.map(inc => (
                      <option key={inc.id} value={inc.id}>{inc.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ความสำคัญ <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as any })}
                  >
                    <option value="HIGH">🔴 สูง</option>
                    <option value="MEDIUM">🟡 ปานกลาง</option>
                    <option value="LOW">🟢 ต่ำ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ผู้รับผิดชอบ <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
                    value={taskFormData.assignedToId}
                    onChange={(e) => setTaskFormData({ ...taskFormData, assignedToId: e.target.value })}
                  >
                    <option value="">เลือก...</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    กำหนดส่ง <span className="text-red-500">*</span>
                  </label>
                  <ThaiDatePicker
                    id="task-due-date"
                    value={taskFormData.dueDate}
                    onChange={(date) => setTaskFormData({ ...taskFormData, dueDate: date || new Date() })}
                    placeholder="เลือกวันที่"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  รายละเอียด
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-sm"
                  placeholder="รายละเอียดเพิ่มเติม..."
                  value={taskFormData.description}
                  onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                >
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกงาน'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-amber-50 to-orange-50">
              <h3 className="text-lg sm:text-xl font-bold text-amber-800 flex items-center gap-2">
                <span className="bg-white p-2 rounded-lg shadow-sm text-amber-600">
                  <AlertTriangle size={20} />
                </span>
                <span className="truncate">ขอแก้ไขรายงาน</span>
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-2 rounded-lg hover:bg-white text-amber-600/60 hover:text-amber-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitRevision} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 border border-gray-100">
                <p className="mb-2">
                  <strong className="text-gray-800">รายงาน:</strong>{' '}
                  <span className="line-clamp-2" title={selectedReport.title}>
                    {selectedReport.title}
                  </span>
                </p>
                <p>
                  <strong className="text-gray-800">ผู้ส่ง:</strong>{' '}
                  {selectedReport.author?.firstName} {selectedReport.author?.lastName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ระบุสิ่งที่ต้องแก้ไข <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all resize-none text-sm"
                  placeholder="อธิบายสิ่งที่ต้องการให้แก้ไข..."
                  value={revisionComments}
                  onChange={(e) => setRevisionComments(e.target.value)}
                ></textarea>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition-colors text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                >
                  {submitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
