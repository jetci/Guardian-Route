/**
 * Incident Service - API calls for incident management
 * Guardian Route Project
 * Phase 2 - Compressed Integration
 */

import { apiClient as api } from './client';

export interface IncidentPayload {
  title: string;
  description: string;
  disasterType: string; // FLOOD, LANDSLIDE, FIRE, STORM, EARTHQUAKE, OTHER
  severity: number; // 1-5
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address?: string;
  affectedArea?: any;
  // photos field removed - backend doesn't expect it
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

  /**
   * Get my incidents
   */
  getMyIncidents: async () => {
    try {
      const response = await api.get('/incidents/my');
      const incidents = Array.isArray(response.data) ? response.data : (response.data?.data || []);

      if (!Array.isArray(incidents)) {
        console.warn('⚠️ /incidents/my response is not an array:', response.data);
        return [];
      }
      return incidents;
    } catch (error) {
      console.error('❌ Failed to load my incidents:', error);
      return [];
    }
  },

  /**
   * Get incident statistics
   */
  getStatistics: async () => {
    const response = await api.get('/incidents/statistics');
    return response.data;
  },
};
