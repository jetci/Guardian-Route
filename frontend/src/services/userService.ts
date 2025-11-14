import { apiClient } from './client';

export type Role = 'ADMIN' | 'EXECUTIVE' | 'SUPERVISOR' | 'FIELD_OFFICER' | 'DEVELOPER';

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: Role;
  isActive?: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDto): Promise<User> => {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDto): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },

  toggleStatus: async (id: string): Promise<User> => {
    const response = await apiClient.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await apiClient.patch(`/users/${id}/reset-password`, {
      newPassword,
    });
  },
};

export default usersApi;
