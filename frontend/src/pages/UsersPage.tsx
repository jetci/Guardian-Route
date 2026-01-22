import { DashboardLayout } from '../components/layout/DashboardLayout';

import '../pages/dashboards/AdminDashboard.css';

interface MockUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

const mockUsers: MockUser[] = [
  { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', status: 'Active', lastLogin: '2023-10-01' },
  { id: 2, name: 'Supervisor User', email: 'supervisor@example.com', role: 'SUPERVISOR', status: 'Active', lastLogin: '2023-10-02' },
];


export function UsersPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>User Management</h1>
        <button className="btn btn-primary">+ Add User</button>
      </div>

      <div className="content-section">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
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
                  <td>
                    <button className="btn-link">Edit</button>
                    <button className="btn-link" style={{ color: '#f56565' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
