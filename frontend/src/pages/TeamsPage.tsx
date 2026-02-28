import { DashboardLayout } from '../components/layout/DashboardLayout';
import { mockUsers } from '../mocks/dashboardData';
import '../pages/dashboards/AdminDashboard.css';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export function TeamsPage() {
  const fieldOfficers = mockUsers.filter((u: User) => u.role === 'FIELD_OFFICER');

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Team Management</h1>
        <button className="btn btn-primary">+ Add Member</button>
      </div>

      <div className="content-section">
        <h2>Field Officers</h2>
        <div className="incidents-grid">
          {fieldOfficers.map((officer: User) => (
            <div key={officer.id} className="incident-card">
              <h3>{officer.name}</h3>
              <p className="incident-location">📧 {officer.email}</p>
              <div className="incident-footer">
                <span className={`status status-${officer.status.toLowerCase()}`}>
                  {officer.status}
                </span>
                <span>Last: {officer.lastLogin}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
