import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { AxiosError } from 'axios';
import type { ApiLogEntry } from '../context/ApiLogContext';
import { useApiLog } from '../context/ApiLogContext';

// Use a global variable to store the log context functions, as interceptors are outside React's lifecycle
let addLogRef: ((log: Omit<ApiLogEntry, 'id' | 'timestamp'>) => string) | null = null;
let updateLogRef: ((id: string, updates: Partial<ApiLogEntry>) => void) | null = null;

/**
 * Hook to set the log context functions for the interceptor.
 * This should be called once at the application root (e.g., in App.tsx).
 */
export const useApiLogInterceptor = () => {
  const { addLog, updateLog } = useApiLog();
  addLogRef = addLog;
  updateLogRef = updateLog;
};

// Map to store the start time of each request
// const requestStartTime = new Map<string, number>(); // Removed as it was unused and causing an error

/**
 * Function to initialize the API logging interceptors on the Axios instance.
 * @param apiInstance The Axios instance to intercept (e.g., apiClient from client.ts).
 */
export const setupApiLoggingInterceptor = (apiInstance: AxiosInstance) => {
  // 1. Request Interceptor
  apiInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Only log requests that are not for the refresh token endpoint
      // We use a custom property to track the start time and log ID
      (config as any)._startTime = Date.now();

      if (config.url && !config.url.includes('/auth/refresh')) {
        const logId = addLogRef?.({
          method: config.method?.toUpperCase() || 'GET',
          url: config.url,
          requestData: config.data || config.params,
          status: 'PENDING',
          duration: null,
          error: null,
          responseData: null,
        });

        if (logId) {
          // Store the log ID in the config for later use
          (config as any)._logId = logId;
        }
      }
      return config;
    },
    (error: AxiosError) => {
      // Handle request error (e.g., network error before sending)
      const logId = (error.config as any)?._logId;
      const startTime = (error.config as any)?._startTime;

      if (logId && startTime) {
        const duration = Date.now() - startTime;
        updateLogRef?.(logId, {
          status: 0, // 0 for network/request error
          duration,
          error: error.message,
        });
      }
      return Promise.reject(error);
    },
  );

  // 2. Response Interceptor
  apiInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      const logId = (response.config as any)?._logId;
      const startTime = (response.config as any)?._startTime;

      if (logId && startTime) {
        const duration = Date.now() - startTime;
        updateLogRef?.(logId, {
          status: response.status,
          duration,
          responseData: response.data,
        });
      }
      return response;
    },
    (error: AxiosError) => {
      const logId = (error.config as any)?._logId;
      const startTime = (error.config as any)?._startTime;

      if (logId && startTime) {
        const duration = Date.now() - startTime;
        updateLogRef?.(logId, {
          status: error.response?.status || 0,
          duration,
          error: error.message,
          responseData: error.response?.data,
        });
      }
      return Promise.reject(error);
    },
  );
};
