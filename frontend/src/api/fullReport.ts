import { api } from './client';

export interface FullReportData {
  taskId: string;
  title: string;
  summary: string;
  incidentDescription: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedHouseholds: number;
  affectedPopulation: number;
  affectedAreaDescription: string;
  infrastructureDamage?: string;
  casualties?: number;
  injuries?: number;
  resourcesNeeded?: string;
  currentResponse?: string;
  recommendations: string;
  photoUrls?: string[];
  aiAnalysis?: string;
  aiAnalysisEdited?: string;
}

export interface AIAnalysisRequest {
  title: string;
  description: string;
  severity: string;
  affectedHouseholds: number;
  affectedPopulation: number;
  infrastructureDamage?: string;
  casualties?: number;
  injuries?: number;
}

export const fullReportApi = {
  create: async (data: FullReportData) => {
    const response = await api.post('/reports/full', data);
    return response.data;
  },

  submit: async (reportId: string) => {
    const response = await api.post(`/reports/${reportId}/submit`);
    return response.data;
  },

  requestAIAnalysis: async (data: AIAnalysisRequest): Promise<string> => {
    const response = await api.post('/reports/ai-analysis', data);
    return response.data;
  },
};
