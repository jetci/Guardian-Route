import { client } from './client';

interface ApiStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime: number;
  latency: number;
  lastChecked: string;
}

interface MonitoringMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  timestamp: string;
}

export interface MonitoringResponse {
  apiStatuses: ApiStatus[];
  metrics: MonitoringMetrics;
}

export const getMonitoringStatus = async (): Promise<MonitoringResponse> => {
  const response = await client.get<MonitoringResponse>('/monitoring/status');
  return response.data;
};

export interface ExportHistory {
  id: number;
  timestamp: string;
  fileName: string;
  latencyAvg: number;
  status: 'SUCCESS' | 'FAILED';
}

export const getExportHistory = async (): Promise<ExportHistory[]> => {
  const response = await client.get<ExportHistory[]>('/export/history');
  return response.data;
};

export interface ExportStats {
  totalExports: number;
  avgLatency: number;
  successRate: number;
  failRate: number;
  recentLatencies: number[];
}

export const getExportStats = async (): Promise<ExportStats> => {
  const response = await client.get<ExportStats>('/export/stats');
  return response.data;
};
