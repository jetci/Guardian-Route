import { apiClient } from './client';
import type { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../types';

export const tasksApi = {
  async create(data: CreateTaskDto): Promise<Task> {
    const response = await apiClient.post('/tasks', data);
    return response.data;
  },

  async getAll(filters?: {
    status?: TaskStatus;
    priority?: TaskPriority;
    incidentId?: string;
    assignedToId?: string;
  }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.incidentId) params.append('incidentId', filters.incidentId);
    if (filters?.assignedToId) params.append('assignedToId', filters.assignedToId);

    const response = await apiClient.get(`/tasks?${params.toString()}`);
    // Backend returns paginated response: { data: [], meta: {} }
    return response.data?.data || response.data || [];
  },

  async getById(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  async update(id: string, data: UpdateTaskDto): Promise<Task> {
    const response = await apiClient.patch(`/tasks/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  async getStatistics(): Promise<{
    total: number;
    byStatus: Record<string, number>;
  }> {
    const response = await apiClient.get('/tasks/statistics');
    return response.data;
  },

  async getMyTasks(status?: TaskStatus): Promise<Task[]> {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get(`/tasks/my-tasks${params}`);
    // Backend returns paginated response: { data: [], meta: {} }
    // Extract data array for backward compatibility
    return response.data?.data || response.data || [];
  },

  async acceptTask(id: string): Promise<Task> {
    const response = await apiClient.post(`/tasks/${id}/accept`);
    return response.data;
  },

  async submitSurveyData(
    id: string,
    data: {
      surveyLocation?: { type: 'Point'; coordinates: [number, number] };
      surveyArea?: { type: 'Polygon'; coordinates: number[][][] };
      surveyNotes: string;
      surveyPhotos?: string[];
    },
  ): Promise<Task> {
    const response = await apiClient.post(`/tasks/${id}/survey`, data);
    return response.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },
};
