import { DashboardLayout } from '../components/layout/DashboardLayout';
import { KPICard } from '../components/KPICard';
import '../pages/dashboards/ExecutiveDashboard.css';

export function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Analytics</h1>
        <select className="period-selector">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
      </div>

      <div className="kpi-grid">
        <KPICard title="Total Incidents" value={145} icon="🚨" color="red" trend="up" />
        <KPICard title="Resolved" value={126} icon="✅" color="green" trend="up" />
        <KPICard title="In Progress" value={12} icon="⏳" color="orange" />
        <KPICard title="Pending" value={7} icon="📋" color="blue" />
      </div>

      <div className="content-section">
        <h2>Performance Trends</h2>
        <div className="chart-placeholder">
          <div className="chart-icon">📈</div>
          <p>Analytics Chart</p>
          <small>(Chart.js integration pending)</small>
        </div>
      </div>

      <div className="content-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">92%</div>
            <div className="metric-label">Resolution Rate</div>
            <div className="metric-trend trend-up">+7% this month</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">1.8h</div>
            <div className="metric-label">Avg Response Time</div>
            <div className="metric-trend trend-down">-0.3h improvement</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">248</div>
            <div className="metric-label">Active Users</div>
            <div className="metric-trend trend-up">+15 this week</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
