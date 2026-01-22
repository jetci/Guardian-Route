import { useState, useEffect } from 'react';
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
import { analyticsApi } from '../../api/analytics';
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

export default function ExecutiveDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    totalIncidents: 0,
    resolutionRate: 0,
    activeUsers: 0,
    systemHealth: 98.5 // Mocked for now
  });

  // Charts State
  const [trendData, setTrendData] = useState<any>(null);
  const [typeData, setTypeData] = useState<any>(null);
  const [severityData, setSeverityData] = useState<any>(null);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  // Performance metrics (Mocked for now as per plan)
  const metrics = {
    uptime: 99.9,
    avgResponseTime: 2.3,
    satisfaction: 4.5,
    tasksCompleted: 1248
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [overview, trend, byType, bySeverity, performers] = await Promise.all([
        analyticsApi.getKpiSummary(),
        analyticsApi.getTrendData(),
        analyticsApi.getIncidentsByType(),
        analyticsApi.getIncidentsBySeverity(),
        analyticsApi.getTopPerformers()
      ]);

      setStats({
        totalIncidents: overview.total,
        resolutionRate: overview.total > 0 ? Math.round((overview.resolved / overview.total) * 100) : 0,
        activeUsers: 0, // Not in KpiSummary
        systemHealth: 98.5 // Mocked
      });
      setTrendData(trend);
      setTypeData(byType);
      setSeverityData(bySeverity);
      setTopPerformers(performers);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl text-gray-600">Loading Dashboard...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="executive-dashboard">
        <header>
          <div className="header-content">
            <div>
              <h2>📊 Executive Dashboard</h2>
              <p>ภาพรวมระบบและผลการดำเนินงาน (ข้อมูลจริง)</p>
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
            </div>
          </div>

          <div className="kpi-card green">
            <div className="kpi-icon">✅</div>
            <div className="kpi-content">
              <h3>{stats.resolutionRate}%</h3>
              <p>Resolution Rate</p>
            </div>
          </div>

          <div className="kpi-card purple">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <h3>{stats.activeUsers}</h3>
              <p>Active Users</p>
            </div>
          </div>

          <div className="kpi-card orange">
            <div className="kpi-icon">💚</div>
            <div className="kpi-content">
              <h3>{stats.systemHealth}%</h3>
              <p>System Health</p>
              <span className="kpi-trend stable">Simulated</span>
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
              {trendData && <Line data={trendData} options={chartOptions} />}
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
                {typeData && <Pie data={typeData} options={chartOptions} />}
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
                {severityData && <Bar data={severityData} options={chartOptions} />}
              </div>
            </div>
          </div>
        </div>

        {/* Reports and Performance Section */}
        <div className="content-grid">
          {/* Top Performers */}
          <div className="section-card">
            <div className="section-header">
              <h3>🏆 Top Performers</h3>
              <button className="btn-view-all">View All →</button>
            </div>
            <div className="performers-list">
              {topPerformers.map((performer, index) => (
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
          <h3>📊 System Performance Metrics (Simulated)</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">🟢</div>
              <div className="metric-content">
                <h4>{metrics.uptime}%</h4>
                <p>System Uptime</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">⚡</div>
              <div className="metric-content">
                <h4>{metrics.avgResponseTime}h</h4>
                <p>Avg Response Time</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">😊</div>
              <div className="metric-content">
                <h4>{metrics.satisfaction}/5</h4>
                <p>User Satisfaction</p>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <h4>{metrics.tasksCompleted}</h4>
                <p>Tasks Completed</p>
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
