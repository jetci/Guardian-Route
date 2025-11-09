import { apiClient } from './client';
import type { 
  Incident, 
  CreateIncidentDto, 
  UpdateIncidentDto,
  IncidentStatus,
  Priority,
  DisasterType
} from '../types';

export type { Incident };

export const incidentsApi = {
  getAll: async (filters?: {
    status?: IncidentStatus;
    priority?: Priority;
    disasterType?: DisasterType;
    villageId?: string;
  }): Promise<Incident[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.disasterType) params.append('disasterType', filters.disasterType);
    if (filters?.villageId) params.append('villageId', filters.villageId);

    const response = await apiClient.get<Incident[]>(
      `/incidents?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string): Promise<Incident> => {
    const response = await apiClient.get<Incident>(`/incidents/${id}`);
    return response.data;
  },

  getMy: async (): Promise<Incident[]> => {
    const response = await apiClient.get<Incident[]>('/incidents/my');
    return response.data;
  },

  create: async (data: CreateIncidentDto): Promise<Incident> => {
    const response = await apiClient.post<Incident>('/incidents', data);
    return response.data;
  },

  update: async (id: string, data: UpdateIncidentDto): Promise<Incident> => {
    const response = await apiClient.patch<Incident>(`/incidents/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/incidents/${id}`);
  },

  getStatistics: async (): Promise<any> => {
    const response = await apiClient.get('/incidents/statistics');
    return response.data;
  },

  // Supervisor methods
  getUnassigned: async (): Promise<Incident[]> => {
    const response = await apiClient.get<Incident[]>('/incidents/unassigned');
    return response.data;
  },

  assign: async (id: string, data: { fieldOfficerId: string; notes?: string }): Promise<Incident> => {
    const response = await apiClient.patch<Incident>(`/incidents/${id}/assign`, data);
    return response.data;
  },

  review: async (id: string, data: { status: IncidentStatus; reviewNotes: string; additionalNotes?: string }): Promise<Incident> => {
    const response = await apiClient.patch<Incident>(`/incidents/${id}/review`, data);
    return response.data;
  },
};
