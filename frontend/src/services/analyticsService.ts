/**
 * Analytics Service
 * API client for analytics endpoints
 */

import apiClient from './api';
import type {
  AnalyticsQueryParams,
  TaskStatusOverview,
  TaskTrendData,
} from '../types/analytics';

export const analyticsService = {
  /**
   * Get task status overview
   */
  async getTaskStatusOverview(params?: AnalyticsQueryParams): Promise<TaskStatusOverview> {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v != null) as [string, string][]
    ).toString();
    
    const url = `/analytics/tasks/status${queryString ? `?${queryString}` : ''}`;
    const response = await apiClient.get(url);
    
    return {
      metrics: response.data.metrics,
      total: response.data.total,
      lastUpdated: new Date(response.data.generatedAt),
    };
  },

  /**
   * Get task trend over time
   */
  async getTaskTrend(params?: AnalyticsQueryParams): Promise<TaskTrendData> {
    const queryString = new URLSearchParams(
      Object.entries(params || {}).filter(([_, v]) => v != null) as [string, string][]
    ).toString();
    
    const url = `/analytics/tasks/trend${queryString ? `?${queryString}` : ''}`;
    const response = await apiClient.get(url);
    
    return {
      dataPoints: response.data.dataPoints,
      granularity: response.data.granularity,
      summary: response.data.summary,
    };
  },
};

export default analyticsService;
