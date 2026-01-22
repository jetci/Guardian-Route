import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KPICard } from '../../components/KPICard';
import { incidentsApi } from '../../api/incidents';
import { usersApi } from '../../api/users';
import { tasksApi } from '../../api/tasks';
import { LoadingSpinner } from '../../components/common';
import './AdminDashboard.css';

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeIncidents: 0,
    pendingTasks: 0,
    totalReports: 0
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [activeIncidents, setActiveIncidents] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [users, incidents, tasks] = await Promise.all([
        usersApi.getAll(),
        incidentsApi.getAll(),
        tasksApi.getAll()
      ]);

      setStats({
        totalUsers: users.length,
        activeIncidents: incidents.filter((i: any) => i.status === 'IN_PROGRESS' || i.status === 'PENDING').length,
        pendingTasks: tasks.filter((t: any) => t.status === 'PENDING').length,
        totalReports: incidents.length // Assuming reports map to incidents for now
      });

      setRecentUsers(users.slice(0, 5));
      setActiveIncidents(incidents.filter((i: any) => i.status === 'IN_PROGRESS').slice(0, 6));

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
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
        <h1>Admin Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Add User</button>
          <button className="btn btn-secondary">Settings</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="blue"
        />
        <KPICard
          title="Active Incidents"
          value={stats.activeIncidents}
          icon="🚨"
          color="red"
        />
        <KPICard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="📋"
          color="orange"
        />
        <KPICard
          title="Total Reports"
          value={stats.totalReports}
          icon="📄"
          color="green"
        />
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Users</h2>
            <button className="btn-link">View All</button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status status-${user.isActive ? 'active' : 'inactive'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Active Incidents</h2>
            <button className="btn-link">View All</button>
          </div>
          <div className="incidents-grid">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="incident-card">
                <div className="incident-header">
                  <span className={`severity severity-${incident.priority.toLowerCase()}`}>
                    {incident.priority}
                  </span>
                  <span className={`status status-${incident.status.toLowerCase()}`}>
                    {incident.status}
                  </span>
                </div>
                <h3>{incident.title}</h3>
                <p className="incident-location">📍 {incident.village?.name || 'Unknown'}</p>
                <div className="incident-footer">
                  <span>👤 {incident.createdBy?.firstName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
