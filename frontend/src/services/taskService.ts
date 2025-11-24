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
   * ✅ Connected to real API
   */
  getMyTasks: async () => {
    try {
      // Get current user's tasks
      const response = await api.get('/tasks');
      console.log('✅ Loaded my tasks from API:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to load my tasks:', error);
      throw error;
    }
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
