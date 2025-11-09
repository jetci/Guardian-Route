import api from './client';

export interface KpiSummary {
  total: number;
  pending: number;
  investigating: number;
  resolved: number;
  avgResolutionTime: string;
}

export interface IncidentsByStatus {
  status: string;
  count: number;
}

export const analyticsApi = {
  getKpiSummary: async (): Promise<KpiSummary> => {
    const response = await api.get('/analytics/kpi-summary');
    return response.data;
  },

  getIncidentsByStatus: async (): Promise<IncidentsByStatus[]> => {
    const response = await api.get('/analytics/by-status');
    return response.data;
  },
};
