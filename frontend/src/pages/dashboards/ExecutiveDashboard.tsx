import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KPICard } from '../../components/KPICard';
import { LoadingSpinner } from '../../components/common';
import { analyticsApi } from '../../api/analytics';
import { incidentsApi } from '../../api/incidents';
import { usersApi } from '../../api/users';
import { tasksApi } from '../../api/tasks';
import toast from 'react-hot-toast';
import './ExecutiveDashboard.css';

interface ExecutiveStats {
  totalIncidents: number;
  resolutionRate: number;
  avgResponseTime: string;
  activeUsers: number;
  taskCompletionRate: number;
  activeFieldOfficers: number;
}

interface RecentReport {
  id: string;
  title: string;
  type: string;
  createdBy: string;
  createdAt: string;
  status: string;
  approvedBy?: string;
}

export function ExecutiveDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ExecutiveStats>({
    totalIncidents: 0,
    resolutionRate: 0,
    avgResponseTime: 'N/A',
    activeUsers: 0,
    taskCompletionRate: 0,
    activeFieldOfficers: 0
  });
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [incidents, users, tasks] = await Promise.all([
        incidentsApi.getAll(),
        usersApi.getAll(),
        tasksApi.getAll()
      ]);

      // Calculate statistics
      const totalIncidents = incidents.length;
      const resolvedIncidents = incidents.filter((i: any) =>
        i.status === 'RESOLVED' || i.status === 'CLOSED'
      ).length;
      const resolutionRate = totalIncidents > 0
        ? Math.round((resolvedIncidents / totalIncidents) * 100)
        : 0;

      const activeUsers = users.filter((u: any) => u.isActive).length;
      const fieldOfficers = users.filter((u: any) =>
        u.role === 'FIELD_OFFICER' && u.isActive
      );

      const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;
      const taskCompletionRate = tasks.length > 0
        ? Math.round((completedTasks / tasks.length) * 100)
        : 0;

      // Calculate average response time (mock for now - would need timestamps)
      const avgResponseTime = '2.3h';

      setStats({
        totalIncidents,
        resolutionRate,
        avgResponseTime,
        activeUsers,
        taskCompletionRate,
        activeFieldOfficers: fieldOfficers.length
      });

      // Get recent incidents as "reports" (simplified)
      const recentIncidents = incidents
        .sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5)
        .map((incident: any) => ({
          id: incident.id,
          title: incident.title || `${incident.disasterType} - ${incident.village?.name}`,
          type: incident.disasterType,
          createdBy: `${incident.createdBy?.firstName || ''} ${incident.createdBy?.lastName || ''}`.trim() || 'Unknown',
          createdAt: new Date(incident.createdAt).toLocaleDateString('th-TH'),
          status: incident.status,
          approvedBy: incident.assignedTo ?
            `${incident.assignedTo?.firstName || ''} ${incident.assignedTo?.lastName || ''}`.trim() :
            undefined
        }));

      setRecentReports(recentIncidents);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      toast.error('ไม่สามารถโหลดข้อมูล Dashboard ได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <LoadingSpinner size="lg" centered />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Executive Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn btn-secondary">Export Report</button>
          <button className="btn btn-primary">Analytics</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Total Incidents"
          value={stats.totalIncidents}
          icon="🚨"
          color="red"
        />
        <KPICard
          title="Resolution Rate"
          value={`${stats.resolutionRate}%`}
          icon="✅"
          color="green"
          trend={stats.resolutionRate > 70 ? "up" : undefined}
        />
        <KPICard
          title="Avg Response Time"
          value={stats.avgResponseTime}
          icon="⏱️"
          color="blue"
        />
        <KPICard
          title="Active Users"
          value={stats.activeUsers}
          icon="👥"
          color="purple"
        />
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Performance Overview</h2>
            <select className="period-selector">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <div className="chart-icon">📊</div>
            <p>Performance Chart</p>
            <small>(Chart.js integration pending)</small>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Recent Incidents</h2>
            <button className="btn-link">View All</button>
          </div>
          <div className="reports-list">
            {recentReports.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                ไม่มีข้อมูลเหตุการณ์
              </p>
            ) : (
              recentReports.map((report) => (
                <div key={report.id} className="report-item">
                  <div className="report-header">
                    <div className="report-info">
                      <h3>{report.title}</h3>
                      <p className="report-meta">
                        <span>📝 {report.type}</span>
                        <span>👤 {report.createdBy}</span>
                        <span>📅 {report.createdAt}</span>
                      </p>
                    </div>
                    <span className={`report-status status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </div>
                  {report.approvedBy && (
                    <p className="report-approval">
                      ✅ Assigned to {report.approvedBy}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Key Metrics</h2>
          </div>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">{stats.taskCompletionRate}%</div>
              <div className="metric-label">Task Completion Rate</div>
              <div className={`metric-trend ${stats.taskCompletionRate > 80 ? 'trend-up' : 'trend-down'}`}>
                {stats.taskCompletionRate > 80 ? '+' : '-'}
                {Math.abs(stats.taskCompletionRate - 80).toFixed(1)}% from target
              </div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{stats.avgResponseTime}</div>
              <div className="metric-label">Avg Response Time</div>
              <div className="metric-trend trend-down">Estimated</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">{stats.activeFieldOfficers}</div>
              <div className="metric-label">Active Field Officers</div>
              <div className="metric-trend trend-up">Currently active</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
