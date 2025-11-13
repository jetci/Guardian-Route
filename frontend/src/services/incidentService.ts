/**
 * Incident Service - API calls for incident management
 * Guardian Route Project
 * Phase 2 - Compressed Integration
 */

import api from './api';

export interface IncidentPayload {
  title: string;
  description: string;
  type: string;
  severity: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  affectedArea?: any;
  photos?: string[];
}

export const incidentService = {
  /**
   * Create a new incident
   */
  create: async (data: IncidentPayload) => {
    const response = await api.post('/incidents', data);
    return response.data;
  },

  /**
   * Get all incidents
   */
  getAll: async () => {
    const response = await api.get('/incidents');
    return response.data;
  },

  /**
   * Get incident by ID
   */
  getById: async (id: string) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  /**
   * Update incident
   */
  update: async (id: string, data: Partial<IncidentPayload>) => {
    const response = await api.put(`/incidents/${id}`, data);
    return response.data;
  },

  /**
   * Delete incident
   */
  delete: async (id: string) => {
    const response = await api.delete(`/incidents/${id}`);
    return response.data;
  },
};
