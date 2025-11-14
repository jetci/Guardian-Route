/**
 * Task Service - API calls for task management
 * Guardian Route Project
 * Phase 2 - Compressed Integration
 */

import { apiClient as api } from './client';

export interface TaskPayload {
  title: string;
  description: string;
  assignedTo: string;
  priority?: string;
  dueDate?: string;
}

export const taskService = {
  /**
   * Get my assigned tasks
   * TODO: Backend endpoint /tasks/my not ready yet - using mock data
   */
  getMyTasks: async () => {
    // Mock data until backend endpoint is ready
    return [
      {
        id: '1',
        title: 'ตรวจสอบพื้นที่เสี่ยงภัย หมู่ 5',
        description: 'ตรวจสอบพื้นที่เสี่ยงน้ำท่วมบริเวณหมู่ 5',
        status: 'ASSIGNED',
        priority: 'HIGH',
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        assignedBy: 'Supervisor',
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'รายงานสถานการณ์ดินถลม่ม',
        description: 'สำรวจและรายงานพื้นที่เสี่ยงดินถล่ม',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        assignedBy: 'Supervisor',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    
    // Real API call (commented out until backend ready)
    // const response = await api.get('/tasks/my');
    // return response.data;
  },

  /**
   * Get all tasks
   */
  getAll: async (params?: any) => {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  /**
   * Get task by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  create: async (data: TaskPayload) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  /**
   * Update task status
   */
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/tasks/${id}/status`, { status });
    return response.data;
  },

  /**
   * Update task
   */
  update: async (id: string, data: Partial<TaskPayload>) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Delete task
   */
  delete: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
