/**
 * API Service - Axios Instance with Interceptors
 * Guardian Route Project
 * Phase 2 - Compressed Integration
 */

import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          useAuthStore.getState().updateTokens(response.data.access_token, refreshToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          return api(originalRequest);
        } catch {
          useAuthStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }

    // Only handle 401 if we have a valid response (not network error)
    // This prevents logout when backend is not running
    if (error.response?.status === 401) {
      const token = useAuthStore.getState().accessToken;
      // Only logout if we actually have a token (real auth failure)
      // Don't logout on network errors or when backend is down
      if (token && token.startsWith('mock-')) {
        // Using mock auth - don't logout on API errors
        console.warn('API call failed but using mock auth, not logging out');
      } else if (token) {
        // Real token expired
        useAuthStore.getState().logout();
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      }
    }
    
    // Handle 403 Forbidden - No permission
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    // Handle 500 Server Error
    if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    }
    
    // Handle network errors - Don't show toast, just log
    if (!error.response) {
      console.warn('Network error - backend may not be running:', error.message);
      // Don't show toast for network errors when using mock auth
    }
    
    return Promise.reject(error);
  }
);

export default api;
