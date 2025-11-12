import { DashboardLayout } from '../components/layout/DashboardLayout';
import { mockUsers } from '../mocks/dashboardData';
import '../pages/dashboards/AdminDashboard.css';

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
