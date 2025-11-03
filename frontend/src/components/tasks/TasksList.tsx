import { useEffect, useState } from 'react';
import { tasksApi } from '../../api/tasks';
import type { Task, TaskStatus, TaskPriority } from '../../types';

interface TasksListProps {
  refreshKey?: number;
}

const getStatusLabel = (status: TaskStatus) => {
  const labels = {
    PENDING: 'รอดำเนินการ',
    IN_PROGRESS: 'กำลังดำเนินการ',
    COMPLETED: 'เสร็จสิ้น',
    CANCELLED: 'ยกเลิก',
  };
  return labels[status];
};

const getStatusColor = (status: TaskStatus) => {
  const colors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
  };
  return colors[status];
};

const getPriorityLabel = (priority: TaskPriority) => {
  const labels = {
    LOW: 'ต่ำ',
    MEDIUM: 'ปานกลาง',
    HIGH: 'สูง',
    URGENT: 'เร่งด่วน',
  };
  return labels[priority];
};

const getPriorityColor = (priority: TaskPriority) => {
  const colors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };
  return colors[priority];
};

const getDisasterTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    FLOOD: 'น้ำท่วม',
    LANDSLIDE: 'ดินถล่ม',
    FIRE: 'ไฟไหม้',
    STORM: 'พายุ',
    EARTHQUAKE: 'แผ่นดินไหว',
    OTHER: 'อื่นๆ',
  };
  return labels[type] || type;
};

export const TasksList = ({ refreshKey = 0 }: TasksListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');

  useEffect(() => {
    loadTasks();
  }, [refreshKey, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;

      const data = await tasksApi.getAll(filters);
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">กรองตามสถานะ</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | '')}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">ทั้งหมด</option>
              <option value="PENDING">รอดำเนินการ</option>
              <option value="IN_PROGRESS">กำลังดำเนินการ</option>
              <option value="COMPLETED">เสร็จสิ้น</option>
              <option value="CANCELLED">ยกเลิก</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">กรองตามความสำคัญ</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | '')}
              className="w-full px-4 py-2 border rounded-lg"
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

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          ไม่พบงานที่มอบหมาย
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {getStatusLabel(task.status)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {getPriorityLabel(task.priority)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {task.incident && (
                  <div>
                    <span className="font-medium text-gray-700">เหตุการณ์:</span>{' '}
                    <span className="text-gray-600">
                      {task.incident.title} ({getDisasterTypeLabel(task.incident.disasterType)})
                    </span>
                  </div>
                )}

                {task.assignedTo && (
                  <div>
                    <span className="font-medium text-gray-700">มอบหมายให้:</span>{' '}
                    <span className="text-gray-600">
                      {task.assignedTo.firstName} {task.assignedTo.lastName}
                    </span>
                  </div>
                )}

                {task.createdBy && (
                  <div>
                    <span className="font-medium text-gray-700">มอบหมายโดย:</span>{' '}
                    <span className="text-gray-600">
                      {task.createdBy.firstName} {task.createdBy.lastName}
                    </span>
                  </div>
                )}

                {task.dueDate && (
                  <div>
                    <span className="font-medium text-gray-700">กำหนดเสร็จ:</span>{' '}
                    <span className="text-gray-600">
                      {new Date(task.dueDate).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                สร้างเมื่อ: {new Date(task.createdAt).toLocaleString('th-TH')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
