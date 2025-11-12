import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KPICard } from '../../components/KPICard';
import { mockKPIs, mockReports } from '../../mocks/dashboardData';
import './ExecutiveDashboard.css';

export function ExecutiveDashboard() {
  const kpis = mockKPIs.executive;

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
          value={kpis.totalIncidents}
          icon="🚨"
          color="red"
        />
        <KPICard
          title="Resolution Rate"
          value={`${kpis.resolutionRate}%`}
          icon="✅"
          color="green"
          trend="up"
        />
        <KPICard
          title="Avg Response Time"
          value={kpis.avgResponseTime}
          icon="⏱️"
          color="blue"
        />
        <KPICard
          title="Active Users"
          value={kpis.activeUsers}
          icon="👥"
          color="purple"
          trend="up"
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
            <h2>Recent Reports</h2>
            <button className="btn-link">View All</button>
          </div>
          <div className="reports-list">
            {mockReports.map((report) => (
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
                    ✅ Approved by {report.approvedBy}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Key Metrics</h2>
          </div>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-value">87.5%</div>
              <div className="metric-label">Task Completion Rate</div>
              <div className="metric-trend trend-up">+5.2% from last month</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">2.3h</div>
              <div className="metric-label">Avg Response Time</div>
              <div className="metric-trend trend-down">-0.5h from last month</div>
            </div>
            <div className="metric-card">
              <div className="metric-value">234</div>
              <div className="metric-label">Active Field Officers</div>
              <div className="metric-trend trend-up">+12 from last month</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
