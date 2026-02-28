import { api } from './client';

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
  responseTime: string;
  version: string;
  environment: string;
  services: {
    database: string;
    api: string;
  };
}

export interface SystemStats {
  system: {
    platform: string;
    arch: string;
    cpus: number;
    loadAverage: number[];
    uptime: number;
  };
  memory: {
    total: string;
    used: string;
    free: string;
    usagePercent: number;
  };
  process: {
    uptime: number;
    memory: {
      heapUsed: string;
      heapTotal: string;
      external: string;
      rss: string;
    };
    pid: number;
  };
  database: {
    status: string;
    activeConnections: number;
  };
  statistics: {
    activeUsers: number;
    totalIncidents: number;
    totalTasks: number;
    totalVillages: number;
  };
}

export interface DatabaseHealth {
  status: string;
  connected: boolean;
  activeConnections: number;
  timestamp: string;
}

export const healthApi = {
  getHealth: async (): Promise<HealthStatus> => {
    const response = await api.get('/health');
    return response.data;
  },

  getSystemStats: async (): Promise<SystemStats> => {
    const response = await api.get('/health/system-stats');
    return response.data;
  },

  getDatabaseHealth: async (): Promise<DatabaseHealth> => {
    const response = await api.get('/health/database');
    return response.data;
  },
};
