/**
 * Statistics Service - API calls for dashboard statistics
 * Guardian Route Project
 * Phase A - Admin Dashboard Integration
 */

import { apiClient as api } from './client';

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
  const response = await api.get('/incidents/statistics');
  return response.data;
};

// Get report statistics
export const getReportStatistics = async (): Promise<ReportStatistics> => {
  const response = await api.get('/reports/statistics');
  return response.data;
};

// Get system health
export const getSystemHealth = async (): Promise<SystemHealth> => {
  try {
    const response = await api.get('/health');
    const data = response.data;
    // Map backend status to percentage
    return {
      ...data,
      healthPercentage: data.status === 'healthy' ? 100 : 50,
      status: data.status === 'healthy' ? 'ok' : 'error'
    };
  } catch (error) {
    return {
      status: 'error',
      uptime: 0,
      database: 'disconnected',
      apiResponseTime: 0,
      healthPercentage: 0
    };
  }
};

// Get activity logs
export const getActivityLogs = async (params?: {
  limit?: number;
  page?: number;
  action?: string;
  userId?: string;
}): Promise<{ data: ActivityLog[]; total: number }> => {
  // Mock data until backend endpoint is ready
  const mockLogs: ActivityLog[] = [
    {
      id: '1',
      action: 'LOGIN',
      userId: 'user-1',
      user: {
        email: 'admin@obtwiang.go.th',
        fullName: 'Admin User',
      },
      timestamp: new Date().toISOString(),
      status: 'SUCCESS',
      metadata: { details: 'User logged in successfully' },
    },
    {
      id: '2',
      action: 'CREATE_USER',
      userId: 'user-1',
      user: {
        email: 'admin@obtwiang.go.th',
        fullName: 'Admin User',
      },
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'SUCCESS',
      target: 'Field Officer',
      targetType: 'USER',
    },
    {
      id: '3',
      action: 'UPDATE_INCIDENT',
      userId: 'user-2',
      user: {
        email: 'supervisor@obtwiang.go.th',
        fullName: 'Supervisor User',
      },
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'SUCCESS',
      targetType: 'INCIDENT',
      metadata: { status: 'IN_PROGRESS' },
    },
  ];

  const limit = params?.limit || 20;
  return {
    data: mockLogs.slice(0, limit),
    total: mockLogs.length,
  };

  // Real API call (commented out until backend ready)
  // const response = await api.get('/activity-logs', { params });
  // return response.data;
};

export default {
  getIncidentStatistics,
  getReportStatistics,
  getSystemHealth,
  getActivityLogs,
};
