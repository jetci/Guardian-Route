import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import usersApi, { type User } from '../../services/userService';
import statisticsService from '../../services/statisticsService';
import { useAuthStore } from '../../stores/authStore';
import { ActivityLogsTable } from '../../components/admin/dashboard/ActivityLogsTable';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

interface AdminStatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: 'purple' | 'blue' | 'orange' | 'green' | 'red';
  loading?: boolean;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ title, value, icon, color, loading }) => (
  <div className={`kpi-card ${color}`}>
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-content">
      <h3>{loading ? '...' : value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  // State
  const [users, setUsers] = useState<User[]>([]);

  // Loading & Error states
  const [statsLoading, setStatsLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeIncidents: 0,
    pendingReports: 0,
    systemHealth: 0
  });

  const [activityLogs, setActivityLogs] = useState<any[]>([]);

  // Fetch data on mount
  useEffect(() => {
    fetchUsers();
    fetchStatistics();
    fetchActivityLogs();
  }, []);

  // Fetch users (needed for role counts)
  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setStatsLoading(true);
      const usersData = await usersApi.getAll();

      let activeIncidents = 0;
      let pendingReports = 0;
      let systemHealth = 0;

      try {
        const incidentStats = await statisticsService.getIncidentStatistics();
        activeIncidents = (incidentStats.byStatus?.IN_PROGRESS || 0) + (incidentStats.byStatus?.PENDING || 0);
      } catch (err) {
        console.error('Failed to fetch incident statistics:', err);
      }

      try {
        const reportStats = await statisticsService.getReportStatistics();
        pendingReports = reportStats.pending || 0;
      } catch (err) {
        console.error('Failed to fetch report statistics:', err);
      }

      try {
        const healthData = await statisticsService.getSystemHealth();
        systemHealth = healthData.healthPercentage || 0;
      } catch (err) {
        console.error('Failed to fetch system health:', err);
      }

      setStats({
        totalUsers: usersData.length,
        activeIncidents,
        pendingReports,
        systemHealth
      });
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch activity logs
  const fetchActivityLogs = async () => {
    try {
      setLogsLoading(true);
      const response = await statisticsService.getActivityLogs({ limit: 10 });
      setActivityLogs(response.data);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  // Role counts
  const roleCounts = {
    ADMIN: users.filter(u => u.role === 'ADMIN').length,
    EXECUTIVE: users.filter(u => u.role === 'EXECUTIVE').length,
    SUPERVISOR: users.filter(u => u.role === 'SUPERVISOR').length,
    FIELD_OFFICER: users.filter(u => u.role === 'FIELD_OFFICER').length
  };

  return (
    <DashboardLayout>
      <div className="admin-dashboard">
        <div className="page-header">
          <div className="header-content">
            <h1>🛡️ Admin Dashboard</h1>
            <p className="subtitle">ภาพรวมระบบและการจัดการ</p>
          </div>
          <div className="header-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/manage-users')}
            >
              👥 จัดการผู้ใช้งาน
            </button>
          </div>
        </div>

        {/* Weather Widget Section */}
        <div className="mb-6 min-h-[250px] h-auto">
          <WeatherWidget />
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <AdminStatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="purple"
            loading={statsLoading}
          />
          <AdminStatCard
            title="Active Incidents"
            value={stats.activeIncidents}
            icon="🚨"
            color="blue"
            loading={statsLoading}
          />
          <AdminStatCard
            title="Pending Reports"
            value={stats.pendingReports}
            icon="📋"
            color="orange"
            loading={statsLoading}
          />
          <AdminStatCard
            title="System Health"
            value={`${stats.systemHealth || 0}%`}
            icon="💚"
            color="green"
            loading={statsLoading}
          />
        </div>

        {/* Role Statistics */}
        <div className="role-stats">
          <h3>📊 Users by Role</h3>
          <div className="role-cards">
            <div className="role-card">
              <span className="role-name">👑 ADMIN</span>
              <span className="role-count">{roleCounts.ADMIN}</span>
            </div>
            <div className="role-card">
              <span className="role-name">💼 EXECUTIVE</span>
              <span className="role-count">{roleCounts.EXECUTIVE}</span>
            </div>
            <div className="role-card">
              <span className="role-name">👨‍💼 SUPERVISOR</span>
              <span className="role-count">{roleCounts.SUPERVISOR}</span>
            </div>
            <div className="role-card">
              <span className="role-name">🎯 FIELD OFFICER</span>
              <span className="role-count">{roleCounts.FIELD_OFFICER}</span>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <ActivityLogsTable logs={activityLogs} loading={logsLoading} />

      </div>
    </DashboardLayout>
  );
}
