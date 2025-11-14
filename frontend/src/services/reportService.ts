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
   * TODO: Backend endpoint /reports/my not ready yet - using mock data
   */
  getMyReports: async () => {
    // Mock data until backend endpoint is ready
    return [
      {
        id: '1',
        title: 'รายงานสถานการณ์น้ำท่วม หมู่ 3',
        content: 'พื้นที่น้ำท่วมสูง 50 ซม. ประชาชนได้รับความเดือดร้อน',
        status: 'PENDING',
        priority: 'HIGH',
        incidentId: 'INC-001',
        createdAt: new Date().toISOString(),
        author: {
          firstName: 'Field',
          lastName: 'Officer'
        }
      },
      {
        id: '2',
        title: 'รายงานการตรวจสอบพื้นที่เสี่ยง',
        content: 'ตรวจสอบพื้นที่เสี่ยงดินถล่มเรียบร้อยแล้ว',
        status: 'APPROVED',
        priority: 'MEDIUM',
        incidentId: 'INC-002',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        author: {
          firstName: 'Field',
          lastName: 'Officer'
        }
      }
    ];
    
    // Real API call (commented out until backend ready)
    // const response = await api.get('/reports/my');
    // return response.data;
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
