/**
 * Auth Service - Authentication API calls
 * Guardian Route Project
 * Phase 2 - Compressed Integration
 */

import api from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  access_token: string;
  refresh_token: string;
}

export const authService = {
  /**
   * Login user
   */
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  /**
   * Get current user profile
   */
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
};
