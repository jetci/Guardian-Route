/**
 * API Service - Axios Instance with Interceptors
 * Guardian Route Project
 * Phase 2 - Compressed Integration
 */

import axios from 'axios';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
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
