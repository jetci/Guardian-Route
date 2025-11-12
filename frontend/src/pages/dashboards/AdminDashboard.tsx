import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KPICard } from '../../components/KPICard';
import { mockKPIs, mockUsers, mockIncidents } from '../../mocks/dashboardData';
import './AdminDashboard.css';

export function AdminDashboard() {
  const kpis = mockKPIs.admin;

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
          value={kpis.totalUsers}
          icon="👥"
          color="blue"
          trend="up"
        />
        <KPICard
          title="Active Incidents"
          value={kpis.activeIncidents}
          icon="🚨"
          color="red"
        />
        <KPICard
          title="Pending Tasks"
          value={kpis.pendingTasks}
          icon="📋"
          color="orange"
        />
        <KPICard
          title="Total Reports"
          value={kpis.totalReports}
          icon="📄"
          color="green"
          trend="up"
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
                  <th>Last Login</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.role.toLowerCase()}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status status-${user.status.toLowerCase()}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
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
            {mockIncidents.map((incident) => (
              <div key={incident.id} className="incident-card">
                <div className="incident-header">
                  <span className={`severity severity-${incident.severity.toLowerCase()}`}>
                    {incident.severity}
                  </span>
                  <span className={`status status-${incident.status.toLowerCase()}`}>
                    {incident.status}
                  </span>
                </div>
                <h3>{incident.title}</h3>
                <p className="incident-location">📍 {incident.location}</p>
                <div className="incident-footer">
                  <span>👤 {incident.reportedBy}</span>
                  <span>👥 {incident.affectedPeople} คน</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
