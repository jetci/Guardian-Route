import { apiClient } from './client';

export interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  totalUsers: number;
  activeUsers: number;
  totalReports: number;
}

export interface IncidentByType {
  type: string;
  count: number;
}

export interface IncidentBySeverity {
  severity: string;
  count: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    // Fetch data from multiple endpoints
    const [incidents, tasks, users, reports] = await Promise.all([
      apiClient.get('/incidents'),
      apiClient.get('/tasks'),
      apiClient.get('/users'),
      apiClient.get('/reports'),
    ]);

    const incidentsData = incidents.data;
    const tasksData = tasks.data;
    const usersData = users.data;
    const reportsData = reports.data;

    return {
      totalIncidents: incidentsData.length,
      activeIncidents: incidentsData.filter((i: any) => i.status !== 'RESOLVED').length,
      resolvedIncidents: incidentsData.filter((i: any) => i.status === 'RESOLVED').length,
      totalTasks: tasksData.length,
      completedTasks: tasksData.filter((t: any) => t.status === 'COMPLETED').length,
      pendingTasks: tasksData.filter((t: any) => t.status === 'PENDING').length,
      totalUsers: usersData.length,
      activeUsers: usersData.filter((u: any) => u.isActive).length,
      totalReports: reportsData.length,
    };
  },

  getIncidentsByType: async (): Promise<IncidentByType[]> => {
    const response = await apiClient.get('/incidents');
    const incidents = response.data;
    
    const typeCount: Record<string, number> = {};
    incidents.forEach((incident: any) => {
      const type = incident.disasterType || 'อื่นๆ';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return Object.entries(typeCount).map(([type, count]) => ({
      type,
      count,
    }));
  },

  getIncidentsBySeverity: async (): Promise<IncidentBySeverity[]> => {
    const response = await apiClient.get('/incidents');
    const incidents = response.data;
    
    const severityCount: Record<string, number> = {};
    incidents.forEach((incident: any) => {
      const severity = incident.priority || 'MEDIUM';
      severityCount[severity] = (severityCount[severity] || 0) + 1;
    });

    return Object.entries(severityCount).map(([severity, count]) => ({
      severity,
      count,
    }));
  },

  getRecentIncidents: async (limit = 5) => {
    const response = await apiClient.get('/incidents', {
      params: { limit, sort: 'createdAt:desc' },
    });
    return response.data;
  },

  getMyTasks: async (limit = 5) => {
    const response = await apiClient.get('/tasks/my', {
      params: { limit },
    });
    return response.data;
  },
};

export default dashboardService;
