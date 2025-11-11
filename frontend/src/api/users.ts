import { apiClient } from './client';
import type { User, Role } from '../types';

export const usersApi = {
  async getAll(filters?: { role?: Role }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);

    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  },

  async getById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async getFieldOfficers(): Promise<User[]> {
    return this.getAll({ role: 'FIELD_OFFICER' });
  },
};
