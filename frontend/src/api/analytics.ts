import { apiClient } from './client';

export interface KpiSummary {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  avgResolutionTime: string;
}

export interface CriticalIncident {
  id: string;
  title: string;
  priority: string;
  status: string;
  location: string;
  createdAt: string;
}

export interface RiskArea {
  lat: number;
  lng: number;
  count: number;
  severity: number;
}

export interface TrendData {
  month: string;
  count: number;
  avgResponseTime: number;
}

export interface IncidentsByType {
  type: string;
  count: number;
  percentage: number;
}

export const analyticsApi = {
  getKpiSummary: async (): Promise<KpiSummary> => {
    const response = await apiClient.get('/analytics/kpi/summary');
    const data = response.data || {};
    // Normalize field naming to support legacy 'investigating' and new 'inProgress'
    const inProgress = data.inProgress ?? data.in_progress ?? data.investigating ?? 0;
    return {
      total: data.total ?? 0,
      pending: data.pending ?? 0,
      inProgress,
      resolved: data.resolved ?? 0,
      avgResolutionTime: data.avgResolutionTime ?? data.avg_resolution_time ?? '-',
    };
  },

  getIncidentOverview: async (params?: any) => {
    const response = await apiClient.get('/analytics/incidents/overview', { params });
    return response.data;
  },

  getTrendData: async () => {
    const response = await apiClient.get('/analytics/incidents/trend');
    return response.data;
  },

  getCriticalIncidents: async () => {
    const response = await apiClient.get('/analytics/incidents/critical');
    return response.data;
  },

  getRiskAreas: async () => {
    const response = await apiClient.get('/analytics/risk-areas');
    return response.data;
  },

  getIncidentsByType: async () => {
    const response = await apiClient.get('/analytics/incidents/by-type');
    return response.data;
  },

  getIncidentsBySeverity: async () => {
    const response = await apiClient.get('/analytics/incidents/by-severity');
    return response.data;
  },

  getTopPerformers: async () => {
    const response = await apiClient.get('/analytics/performers/top');
    return response.data;
  },

  getTasksStatus: async (params?: any) => {
    const response = await apiClient.get('/analytics/tasks/status', { params });
    return response.data;
  },

  getTasksTrend: async (params?: any) => {
    const response = await apiClient.get('/analytics/tasks/trend', { params });
    return response.data;
  },
};
