import { DashboardLayout } from '../components/layout/DashboardLayout';
import '../pages/dashboards/AdminDashboard.css';

export function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Settings</h1>
      </div>

      <div className="content-section">
        <h2>System Settings</h2>
        <div className="quick-report-form">
          <div className="form-group">
            <label>System Name</label>
            <input type="text" className="form-input" defaultValue="Guardian Route" />
          </div>
          <div className="form-group">
            <label>Email Notifications</label>
            <select className="form-input">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </div>
          <div className="form-group">
            <label>Default Language</label>
            <select className="form-input">
              <option>ไทย (Thai)</option>
              <option>English</option>
            </select>
          </div>
          <button className="btn btn-primary">Save Settings</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
