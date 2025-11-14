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
   */
  getMyReports: async () => {
    const response = await api.get('/reports/me');
    return response.data;
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
