/**
 * Statistics Service - API calls for dashboard statistics
 * Guardian Route Project
 * Phase A - Admin Dashboard Integration
 */

import api from './api';

export interface IncidentStatistics {
  total: number;
  byStatus: {
    PENDING: number;
    IN_PROGRESS: number;
    RESOLVED: number;
    CLOSED: number;
  };
  byType: {
    [key: string]: number;
  };
  bySeverity: {
    [key: number]: number;
  };
}

export interface ReportStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byMonth: {
    month: string;
    count: number;
  }[];
}

export interface SystemHealth {
  status: 'ok' | 'warning' | 'error';
  uptime: number;
  database: 'connected' | 'disconnected';
  apiResponseTime: number;
  healthPercentage: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  user: {
    email: string;
    fullName: string;
  };
  action: string;
  target?: string;
  targetType?: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
  metadata?: any;
}

// Get incident statistics
export const getIncidentStatistics = async (): Promise<IncidentStatistics> => {
  const response = await api.get('/api/incidents/statistics');
  return response.data;
};

// Get report statistics
export const getReportStatistics = async (): Promise<ReportStatistics> => {
  const response = await api.get('/api/reports/statistics');
  return response.data;
};

// Get system health
export const getSystemHealth = async (): Promise<SystemHealth> => {
  const response = await api.get('/api/health');
  return response.data;
};

// Get activity logs
export const getActivityLogs = async (params?: {
  limit?: number;
  page?: number;
  action?: string;
  userId?: string;
}): Promise<{ data: ActivityLog[]; total: number }> => {
  const response = await api.get('/api/activity-logs', { params });
  return response.data;
};

export default {
  getIncidentStatistics,
  getReportStatistics,
  getSystemHealth,
  getActivityLogs,
};
