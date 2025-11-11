import { apiClient } from './client';
import type { Village, VillageStatistics } from '../types';

export const villagesApi = {
  getAll: async (): Promise<Village[]> => {
    const response = await apiClient.get<Village[]>('/villages');
    return response.data;
  },

  getById: async (id: string): Promise<Village> => {
    const response = await apiClient.get<Village>(`/villages/${id}`);
    return response.data;
  },

  getByVillageNo: async (villageNo: number): Promise<Village> => {
    const response = await apiClient.get<Village>(`/villages/no/${villageNo}`);
    return response.data;
  },

  getStatistics: async (): Promise<VillageStatistics> => {
    const response = await apiClient.get<VillageStatistics>('/villages/statistics');
    return response.data;
  },
};
