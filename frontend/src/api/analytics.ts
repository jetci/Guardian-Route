import { api } from './client';

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

export const analyticsApi = {
  getKpiSummary: async (): Promise<KpiSummary> => {
    const response = await api.get('/analytics/kpi-summary');
    return response.data;
  },

  getIncidentsByStatus: async (): Promise<IncidentsByStatus[]> => {
    const response = await api.get('/analytics/by-status');
    return response.data;
  },

  getTrendData: async (): Promise<TrendData[]> => {
    const response = await api.get('/analytics/trend');
    return response.data;
  },

  getIncidentsByType: async (): Promise<IncidentsByType[]> => {
    const response = await api.get('/analytics/by-type');
    return response.data;
  },

  getCriticalIncidents: async (): Promise<CriticalIncident[]> => {
    const response = await api.get('/analytics/critical-incidents');
    return response.data;
  },

  getRiskAreas: async (): Promise<RiskArea[]> => {
    const response = await api.get('/analytics/risk-areas');
    return response.data;
  },
};
