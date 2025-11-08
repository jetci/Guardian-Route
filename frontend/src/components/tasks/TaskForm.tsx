import { useForm } from 'react-hook-form';
import { tasksApi } from '../../api/tasks';
import { incidentsApi } from '../../api/incidents';
import { usersApi } from '../../api/users';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import type { CreateTaskDto, TaskPriority, Incident, User, Role } from '../../types';

interface TaskFormData {
  title: string;
  description?: string;
  incidentId: string;
  assignedToId: string;
  priority: TaskPriority;
  dueDate?: string;
}

interface TaskFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TaskForm = ({ onSuccess, onCancel }: TaskFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>();
  const [loading, setLoading] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    loadIncidents();
    loadUsers();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await incidentsApi.getAll({});
      setIncidents(data);
    } catch (error) {
      console.error('Error loading incidents:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAll({ role: 'FIELD_OFFICER' as Role });
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    try {
      const createData: CreateTaskDto = {
        title: data.title,
        description: data.description,
        incidentId: data.incidentId,
        assignedToId: data.assignedToId,
        priority: data.priority,
        dueDate: data.dueDate,
      };
      
      await tasksApi.create(createData);
      toast.success('มอบหมายงานสำเร็จ!');
      onSuccess?.();
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ชื่องาน <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title', { required: 'กรุณากรอกชื่องาน' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="เช่น สำรวจพื้นที่ประสบภัย"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1 font-medium">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">รายละเอียดงาน</label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows={3}
          placeholder="รายละเอียดเพิ่มเติม..."
        />
      </div>

      {/* Incident */}
      <div>
        <label className="block text-sm font-medium mb-1">
          เหตุการณ์ <span className="text-red-500">*</span>
        </label>
        <select
          {...register('incidentId', { required: 'กรุณาเลือกเหตุการณ์' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">เลือกเหตุการณ์</option>
          {incidents.map((inc) => (
            <option key={inc.id} value={inc.id}>
              {inc.title} - {inc.village?.name || 'ไม่ระบุหมู่'}
            </option>
          ))}
        </select>
        {errors.incidentId && (
          <p className="text-red-600 text-sm mt-1 font-medium">{errors.incidentId.message}</p>
        )}
      </div>

      {/* Assign To */}
      <div>
        <label className="block text-sm font-medium mb-1">
          มอบหมายให้ <span className="text-red-500">*</span>
        </label>
        <select
          {...register('assignedToId', { required: 'กรุณาเลือกผู้รับผิดชอบ' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">เลือกเจ้าหน้าที่</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>
        {errors.assignedToId && (
          <p className="text-red-600 text-sm mt-1 font-medium">{errors.assignedToId.message}</p>
        )}
      </div>

      {/* Priority */}
      <div>
        <label className="block text-sm font-medium mb-1">
          ความสำคัญ <span className="text-red-500">*</span>
        </label>
        <select
          {...register('priority', { required: 'กรุณาเลือกความสำคัญ' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">เลือกความสำคัญ</option>
          <option value="LOW">ต่ำ</option>
          <option value="MEDIUM">ปานกลาง</option>
          <option value="HIGH">สูง</option>
          <option value="URGENT">เร่งด่วน</option>
        </select>
        {errors.priority && (
          <p className="text-red-600 text-sm mt-1 font-medium">{errors.priority.message}</p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium mb-1">กำหนดเสร็จ</label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
        >
          {loading ? 'กำลังมอบหมาย...' : 'มอบหมายงาน'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 bg-white text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition-colors font-medium border border-gray-300 shadow-sm"
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
};
