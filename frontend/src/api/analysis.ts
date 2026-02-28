import { api } from './client';

export interface OverlayAnalysisRequest {
  incidentIds: string[];
}

export interface OverlappingArea {
  coordinates: number[][][];
  incidentCount: number;
  incidentIds: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  area: number;
}

export interface OverlayAnalysisResult {
  totalIncidents: number;
  overlappingAreas: OverlappingArea[];
  riskScore: number;
  recommendations: string[];
}

export const analysisApi = {
  analyzeOverlay: async (data: OverlayAnalysisRequest): Promise<OverlayAnalysisResult> => {
    const response = await api.post('/analysis/overlay', data);
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/analysis/history');
    return response.data;
  },
};
