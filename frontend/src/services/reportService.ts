/**
 * Report Service - API calls for report management
 * Guardian Route Project
 * Phase 2 - Compressed Integration
 */

import { apiClient as api } from './client';

export interface ReportPayload {
  title: string;
  content: string;
  incidentId?: string;
  priority?: string;
  status?: string;
}

export const reportService = {
  /**
   * Get my reports (for field officers)
   * ✅ Connected to real API - using tasks as reports
   */
  getMyReports: async () => {
    try {
      // Get all my tasks (completed tasks are reports)
      const response = await api.get('/tasks');
      console.log('✅ Loaded my reports from API:', response.data.length);
      
      // Transform tasks to report format
      return response.data.map((task: any) => ({
        id: task.id,
        title: task.title,
        content: task.description || '',
        status: task.status,
        priority: task.priority,
        incidentId: task.incidentId,
        location: task.village?.name || 'ไม่ระบุ',
        submittedDate: task.completedAt || task.createdAt,
        dueDate: task.dueDate,
        supervisorComment: task.description,
        createdAt: task.createdAt,
        author: task.createdBy
      }));
    } catch (error) {
      console.error('❌ Failed to load my reports:', error);
      throw error;
    }
  },

  /**
   * Get all reports (for supervisors/admins)
   */
  getAll: async (params?: any) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  /**
   * Get report by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  /**
   * Create a new report
   */
  create: async (data: ReportPayload) => {
    const response = await api.post('/reports', data);
    return response.data;
  },

  /**
   * Update report status (approve/reject)
   */
  updateStatus: async (id: string, status: string, comment?: string) => {
    const response = await api.put(`/reports/${id}/status`, { status, comment });
    return response.data;
  },

  /**
   * Update report
   */
  update: async (id: string, data: Partial<ReportPayload>) => {
    const response = await api.put(`/reports/${id}`, data);
    return response.data;
  },

  /**
   * Delete report
   */
  delete: async (id: string) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};
