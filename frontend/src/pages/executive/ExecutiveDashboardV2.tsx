import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import './ExecutiveDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for charts
const incidentsTrendData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Incidents',
      data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Resolved',
      data: [10, 17, 14, 23, 20, 28, 26, 33, 30, 38, 36, 43],
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
};

const incidentsByTypeData = {
  labels: ['Flood', 'Fire', 'Earthquake', 'Landslide', 'Storm', 'Other'],
  datasets: [
    {
      data: [35, 20, 15, 12, 10, 8],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(156, 163, 175, 0.8)'
      ],
      borderColor: [
        'rgb(59, 130, 246)',
        'rgb(239, 68, 68)',
        'rgb(234, 179, 8)',
        'rgb(168, 85, 247)',
        'rgb(34, 197, 94)',
        'rgb(156, 163, 175)'
      ],
      borderWidth: 2
    }
  ]
};

const incidentsBySeverityData = {
  labels: ['Critical', 'High', 'Medium', 'Low'],
  datasets: [
    {
      label: 'Number of Incidents',
      data: [15, 28, 42, 35],
      backgroundColor: [
        'rgba(239, 68, 68, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: [
        'rgb(239, 68, 68)',
        'rgb(249, 115, 22)',
        'rgb(234, 179, 8)',
        'rgb(34, 197, 94)'
      ],
      borderWidth: 2
    }
  ]
};

// Mock recent reports
const mockRecentReports = [
  {
    id: 1,
    title: 'Flood Assessment - District 5',
    officer: 'Somchai Supervisor',
    date: '2025-11-12',
    status: 'APPROVED',
    priority: 'HIGH'
  },
  {
    id: 2,
    title: 'Fire Incident - Village 12',
    officer: 'Somsri Field',
    date: '2025-11-12',
    status: 'UNDER_REVIEW',
    priority: 'CRITICAL'
  },
  {
    id: 3,
    title: 'Earthquake Damage Report',
    officer: 'Prasit Officer',
    date: '2025-11-11',
    status: 'APPROVED',
    priority: 'HIGH'
  },
  {
    id: 4,
    title: 'Landslide Risk Assessment',
    officer: 'Wipa Analyst',
    date: '2025-11-11',
    status: 'DRAFT',
    priority: 'MEDIUM'
  },
  {
    id: 5,
    title: 'Storm Damage Survey',
    officer: 'Surachai Team',
    date: '2025-11-10',
    status: 'APPROVED',
    priority: 'MEDIUM'
  }
];

// Mock top performers
const mockTopPerformers = [
  { name: 'Somsri Field', reports: 24, rating: 4.8 },
  { name: 'Somchai Supervisor', reports: 22, rating: 4.7 },
  { name: 'Prasit Officer', reports: 20, rating: 4.6 },
  { name: 'Wipa Analyst', reports: 18, rating: 4.5 },
  { name: 'Surachai Team', reports: 16, rating: 4.4 }
];

export default function ExecutiveDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  // Stats
  const stats = {
    totalIncidents: 456,
    resolutionRate: 94.5,
    activeUsers: 48,
    systemHealth: 99.2
  };

  // Performance metrics
  const metrics = {
    uptime: 99.9,
    avgResponseTime: 2.3,
    satisfaction: 4.5,
    tasksCompleted: 1248
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const handleExport = (type: string) => {
    alert(`Exporting ${type} report...`);
  };

  return (
    <DashboardLayout>
      <div className="executive-dashboard">
        <header>
          <div className="header-content">
            <div>
              <h2>📊 Executive Dashboard</h2>
              <p>ภาพรวมระบบและผลการดำเนินงาน</p>
            </div>
            <div className="time-range-selector">
              <button 
                className={timeRange === 'week' ? 'active' : ''}
                onClick={() => setTimeRange('week')}
              >
                Week
              </button>
              <button 
                className={timeRange === 'month' ? 'active' : ''}
                onClick={() => setTimeRange('month')}
              >
                Month
              </button>
              <button 
                className={timeRange === 'year' ? 'active' : ''}
                onClick={() => setTimeRange('year')}
              >
                Year
              </button>
            </div>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card blue">
            <div className="kpi-icon">🚨</div>
            <div className="kpi-content">
              <h3>{stats.totalIncidents}</h3>
              <p>Total Incidents</p>
              <span className="kpi-trend up">+12% from last month</span>
            </div>
          </div>
          
          <div className="kpi-card green">
            <div className="kpi-icon">✅</div>
            <div className="kpi-content">
              <h3>{stats.resolutionRate}%</h3>
              <p>Resolution Rate</p>
              <span className="kpi-trend up">+2.3% from last month</span>
            </div>
          </div>
          
          <div className="kpi-card purple">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <h3>{stats.activeUsers}</h3>
              <p>Active Users</p>
              <span className="kpi-trend up">+5 new this month</span>
            </div>
          </div>
          
          <div className="kpi-card orange">
            <div className="kpi-icon">💚</div>
            <div className="kpi-content">
              <h3>{stats.systemHealth}%</h3>
              <p>System Health</p>
              <span className="kpi-trend stable">Excellent</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container large">
            <div className="chart-header">
              <h3>📈 Incidents Trend</h3>
              <button className="btn-export" onClick={() => handleExport('trend')}>
                📥 Export
              </button>
            </div>
            <div className="chart-wrapper">
              <Line data={incidentsTrendData} options={chartOptions} />
            </div>
          </div>

          <div className="chart-row">
            <div className="chart-container">
              <div className="chart-header">
                <h3>🥧 By Type</h3>
                <button className="btn-export" onClick={() => handleExport('type')}>
                  📥
                </button>
              </div>
              <div className="chart-wrapper">
                <Pie data={incidentsByTypeData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-container">
              <div className="chart-header">
                <h3>📊 By Severity</h3>
                <button className="btn-export" onClick={() => handleExport('severity')}>
                  📥
                </button>
              </div>
              <div className="chart-wrapper">
                <Bar data={incidentsBySeverityData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Reports and Performance Section */}
        <div className="content-grid">
          {/* Recent Reports */}
          <div className="section-card">
            <div className="section-header">
              <h3>📝 Recent Reports</h3>
              <button className="btn-view-all">View All →</button>
            </div>
            <div className="reports-list">
              {mockRecentReports.map(report => (
                <div key={report.id} className="report-item">
                  <div className="report-main">
                    <h4>{report.title}</h4>
                    <p>👤 {report.officer} • 📅 {report.date}</p>
                  </div>
                  <div className="report-badges">
                    <span className={`priority-badge ${report.priority.toLowerCase()}`}>
                      {report.priority}
                    </span>
                    <span className={`status-badge ${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="section-card">
            <div className="section-header">
              <h3>🏆 Top Performers</h3>
              <button className="btn-view-all">View All →</button>
            </div>
            <div className="performers-list">
              {mockTopPerformers.map((performer, index) => (
                <div key={index} className="performer-item">
                  <div className="performer-rank">#{index + 1}</div>
                  <div className="performer-info">
                    <strong>{performer.name}</strong>
                    <span>{performer.reports} reports</span>
                  </div>
                  <div className="performer-rating">
                    ⭐ {performer.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="metrics-section">
          <h3>📊 System Performance Metrics</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🟢</div>
              <div className="metric-content">
                <h4>{metrics.uptime}%</h4>
                <p>System Uptime</p>
                <span className="metric-detail">Last 30 days</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-content">
                <h4>{metrics.avgResponseTime}h</h4>
                <p>Avg Response Time</p>
                <span className="metric-detail">Incident to action</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">😊</div>
              <div className="metric-content">
                <h4>{metrics.satisfaction}/5</h4>
                <p>User Satisfaction</p>
                <span className="metric-detail">Based on 156 reviews</span>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <h4>{metrics.tasksCompleted}</h4>
                <p>Tasks Completed</p>
                <span className="metric-detail">This month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h3>⚡ Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-btn blue">
              <span className="action-icon">📊</span>
              <span className="action-text">Generate Report</span>
            </button>
            <button className="action-btn green">
              <span className="action-icon">📥</span>
              <span className="action-text">Export Data</span>
            </button>
            <button className="action-btn purple">
              <span className="action-icon">👥</span>
              <span className="action-text">Manage Users</span>
            </button>
            <button className="action-btn orange">
              <span className="action-icon">⚙️</span>
              <span className="action-text">System Settings</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
