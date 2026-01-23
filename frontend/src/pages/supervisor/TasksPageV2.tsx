/**
 * Tasks Page V2 - Improved UI/UX
 * 
 * ✅ ปรับปรุง:
 * - ลบ inline styles ทั้งหมด
 * - ใช้ Tailwind CSS
 * - ใช้ KPICard component
 * - Text truncation ทุกที่
 * - Responsive design ดีขึ้น
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { tasksApi } from '../../api/tasks';
import { TaskForm } from '../../components/tasks/TaskForm';
import { KPICard } from '../../components/dashboard/KPICard';
import type { Task, TaskStatus, TaskPriority } from '../../types';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

export const TasksPageV2 = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadTasks();
  }, [refreshKey, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const data = await tasksApi.getAll(filters);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('ไม่สามารถโหลดข้อมูลงานได้');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowCreateForm(false);
    setRefreshKey(prev => prev + 1);
    toast.success('✅ สร้างงานสำเร็จ!');
  };

  // Calculate stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
  };

  const getStatusConfig = (status: TaskStatus) => {
    const configs = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'รอดำเนินการ' },
      IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'กำลังดำเนินการ' },
      SURVEYED: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'สำรวจแล้ว' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'เสร็จสิ้น' },
      CANCELLED: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'ยกเลิก' },
      REVISION_REQUIRED: { bg: 'bg-red-100', text: 'text-red-800', label: 'ต้องแก้ไข' },
    };
    return configs[status] || configs.PENDING;
  };

  const getPriorityConfig = (priority: TaskPriority) => {
    const configs = {
      LOW: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'ต่ำ' },
      MEDIUM: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'ปานกลาง' },
      HIGH: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'สูง' },
      URGENT: { bg: 'bg-red-100', text: 'text-red-800', label: 'เร่งด่วน' },
    };
    return configs[priority];
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate flex items-center gap-2">
              <span>📋</span>
              <span>การมอบหมายงาน</span>
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              จัดการและติดตามงานของเจ้าหน้าที่ภาคสนาม
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus size={18} />
            <span>มอบหมายงานใหม่</span>
          </button>
        </div>

        {/* ✅ Stats - Using KPICard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="งานทั้งหมด"
            value={stats.total}
            icon="📋"
            color="blue"
          />
          <KPICard
            title="รอดำเนินการ"
            value={stats.pending}
            icon="⏳"
            color="orange"
          />
          <KPICard
            title="กำลังดำเนินการ"
            value={stats.inProgress}
            icon="🔄"
            color="purple"
          />
          <KPICard
            title="เสร็จสิ้น"
            value={stats.completed}
            icon="✅"
            color="green"
          />
        </div>

        {/* ✅ Filters */}
        <div className="bg-white rounded-xl p-4 sm:p-6 mb-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                กรองตามสถานะ
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
              >
                <option value="">ทั้งหมด</option>
                <option value="PENDING">รอดำเนินการ</option>
                <option value="IN_PROGRESS">กำลังดำเนินการ</option>
                <option value="COMPLETED">เสร็จสิ้น</option>
                <option value="CANCELLED">ยกเลิก</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                กรองตามความสำคัญ
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-white"
              >
                <option value="">ทั้งหมด</option>
                <option value="LOW">ต่ำ</option>
                <option value="MEDIUM">ปานกลาง</option>
                <option value="HIGH">สูง</option>
                <option value="URGENT">เร่งด่วน</option>
              </select>
            </div>
          </div>
        </div>

        {/* ✅ Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-xl p-12 sm:p-16 text-center border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                ไม่พบงานที่มอบหมาย
              </h3>
              <p className="text-gray-400">
                ลองเปลี่ยนตัวกรองหรือสร้างงานใหม่
              </p>
            </div>
          ) : (
            tasks.map((task) => {
              const statusConfig = getStatusConfig(task.status);
              const priorityConfig = getPriorityConfig(task.priority);

              return (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 
                        className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2"
                        title={task.title}
                      >
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                          {statusConfig.label}
                        </span>
                        {/* Priority Badge */}
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityConfig.bg} ${priorityConfig.text}`}>
                          {priorityConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2" title={task.description}>
                      {task.description}
                    </p>
                  )}

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Assigned To */}
                    {task.assignedTo && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg min-w-0">
                        <span className="text-base flex-shrink-0">👤</span>
                        <span className="truncate" title={`${task.assignedTo.firstName} ${task.assignedTo.lastName}`}>
                          {task.assignedTo.firstName} {task.assignedTo.lastName}
                        </span>
                      </div>
                    )}

                    {/* Due Date */}
                    {task.dueDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg min-w-0">
                        <span className="text-base flex-shrink-0">📅</span>
                        <span className="truncate">
                          {new Date(task.dueDate).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    )}

                    {/* Incident */}
                    {task.incident && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg min-w-0 sm:col-span-2">
                        <span className="text-base flex-shrink-0">⚠️</span>
                        <span className="truncate" title={task.incident.title}>
                          {task.incident.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ✅ Create Task Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-violet-50 sticky top-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                มอบหมายงานใหม่
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 rounded-lg hover:bg-white text-gray-400 hover:text-gray-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <TaskForm
                onSuccess={handleFormSuccess}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};
