import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Settings {
  id: string;
  // General (4)
  systemName: string;
  timezone: string;
  maintenanceMode: boolean;
  maintenanceMessage: string | null;
  // Security (4)
  enforce2FA: boolean;
  minPasswordLength: number;
  sessionTimeout: number;
  ipAllowlist: string | null;
  // Map & GIS (6)
  defaultLat: number;
  defaultLng: number;
  defaultZoom: number;
  defaultBaseLayer: string;
  customTileServer: string | null;
  enableWeatherRadar: boolean;
  // Notifications (5)
  emailOnNewIncident: boolean;
  smsOnHighSeverity: boolean;
  dailyEmailSummary: boolean;
  enableLineNotify: boolean;
  lineNotifyToken: string | null;
  // API (4)
  weatherApiKey: string | null;
  smsGatewayApiKey: string | null;
  maxRequestsPerMinute: number;
  blockDuration: number;
  // Data (2)
  dataRetentionDays: number;
  backupFrequency: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsDto {
  // General
  systemName?: string;
  timezone?: string;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
  // Security
  enforce2FA?: boolean;
  minPasswordLength?: number;
  sessionTimeout?: number;
  ipAllowlist?: string;
  // Map & GIS
  defaultLat?: number;
  defaultLng?: number;
  defaultZoom?: number;
  defaultBaseLayer?: string;
  customTileServer?: string;
  enableWeatherRadar?: boolean;
  // Notifications
  emailOnNewIncident?: boolean;
  smsOnHighSeverity?: boolean;
  dailyEmailSummary?: boolean;
  enableLineNotify?: boolean;
  lineNotifyToken?: string;
  // API
  weatherApiKey?: string;
  smsGatewayApiKey?: string;
  maxRequestsPerMinute?: number;
  blockDuration?: number;
  // Data
  dataRetentionDays?: number;
  backupFrequency?: string;
}

/**
 * Fetch current system settings
 */
export const fetchSettings = async (): Promise<Settings> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${API_URL}/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Update system settings
 */
export const updateSettings = async (data: UpdateSettingsDto): Promise<Settings> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.put(`${API_URL}/settings`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Trigger manual backup
 */
export const triggerBackup = async (): Promise<{ message: string; filename: string }> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.post(`${API_URL}/settings/backup`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Purge old data
 */
export const purgeOldData = async (): Promise<{ message: string; deletedFiles: number }> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.delete(`${API_URL}/settings/purge`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Factory reset - restore all settings to default
 */
export const factoryReset = async (): Promise<{ message: string; settings: Settings }> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.post(`${API_URL}/settings/reset`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Get list of backups
 */
export const getBackups = async (): Promise<Array<{ filename: string; size: number; createdAt: string }>> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${API_URL}/settings/backups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

/**
 * Download a backup file
 */
export const downloadBackup = async (filename: string): Promise<void> => {
  const token = localStorage.getItem('access_token');
  const response = await axios.get(`${API_URL}/settings/backups/${filename}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  });

  // Create download link
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
