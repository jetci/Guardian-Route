import { apiClient } from './client';
import type { LoginResponse } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await apiClient.post('/auth/verify', { token });
    return response.data;
  },
};
