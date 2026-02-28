/**
 * Executive Dashboard V3 - Improved UI/UX
 * 
 * ✅ แก้ไขปัญหา:
 * - Layout กระจัดกระจาย → ใช้ Tailwind Grid System
 * - ตัวหนังสือล้นเฟรม → ใช้ truncate, line-clamp
 * - Responsive Design → Mobile-first approach
 * - Spacing ไม่สม่ำเสมอ → ใช้ consistent spacing (4, 6, 8)
 */

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
import { KPICard } from '../../components/dashboard/KPICard';
import { ChartCard } from '../../components/dashboard/ChartCard';
import { PerformerCard } from '../../components/dashboard/PerformerCard';
import { MetricCard } from '../../components/dashboard/MetricCard';
import toast from 'react-hot-toast';

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

export default function ExecutiveDashboardV3() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [loading, setLoading] = useState(true);

  // Stats State
  const [stats, setStats] = useState({
    totalIncidents: 0,
    resolutionRate: 0,
    activeUsers: 0,
    systemHealth: 98.5
  });

  // Charts State
  const [trendData, setTrendData] = useState<any>(null);
  const [typeData, setTypeData] = useState<any>(null);
  const [severityData, setSeverityData] = useState<any>(null);
  const [topPerformers, setTopPerformers] = useState<any[]>([]);

  // Performance metrics
  const metrics = {
    uptime: 99.9,
    avgResponseTime: 2.3,
    satisfaction: 4.5,
    tasksCompleted: 1248
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ Use Promise.allSettled to handle partial failures
      const results = await Promise.allSettled([
        analyticsApi.getKpiSummary(),
        analyticsApi.getTrendData(),
        analyticsApi.getIncidentsByType(),
        analyticsApi.getIncidentsBySeverity(),
        analyticsApi.getTopPerformers()
      ]);

      // Extract results with fallbacks
      const overview = results[0].status === 'fulfilled' 
        ? results[0].value 
        : { total: 0, resolved: 0, pending: 0, inProgress: 0 };
      
      const trend = results[1].status === 'fulfilled' 
        ? results[1].value 
        : null;
      
      const byType = results[2].status === 'fulfilled' 
        ? results[2].value 
        : null;
      
      const bySeverity = results[3].status === 'fulfilled' 
        ? results[3].value 
        : null;
      
      const performers = results[4].status === 'fulfilled' 
        ? results[4].value 
        : [];

      setStats({
        totalIncidents: overview.total,
        resolutionRate: overview.total > 0 ? Math.round((overview.resolved / overview.total) * 100) : 0,
        activeUsers: 0,
        systemHealth: 98.5
      });
      setTrendData(trend);
      setTypeData(byType);
      setSeverityData(bySeverity);
      setTopPerformers(performers);

      // Show warnings for failed requests
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length > 0) {
        console.warn('⚠️ Some data failed to load:', failures);
        toast.error(`โหลดข้อมูลบางส่วนไม่สำเร็จ (${failures.length}/${results.length})`);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('ไม่สามารถโหลดข้อมูล Dashboard ได้');
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
        labels: {
          boxWidth: 12,
          padding: 10,
          font: {
            size: 11
          }
        }
      },
    },
  };

  const handleExport = (type: string) => {
    toast.success(`กำลัง export ${type} report...`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Container with max-width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ✅ Header Section - Responsive */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
              📊 Executive Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              ภาพรวมระบบและผลการดำเนินงาน • อัพเดทล่าสุด: {new Date().toLocaleTimeString('th-TH')}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 flex-shrink-0">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {range === 'week' ? 'สัปดาห์' : range === 'month' ? 'เดือน' : 'ปี'}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ KPI Cards - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <KPICard
            title="Total Incidents"
            value={stats.totalIncidents}
            icon="🚨"
            color="red"
            trend="up"
            trendValue="+12% from last month"
          />
          <KPICard
            title="Resolution Rate"
            value={`${stats.resolutionRate}%`}
            icon="✅"
            color="green"
            trend={stats.resolutionRate > 70 ? 'up' : 'down'}
            trendValue={`${stats.resolutionRate > 70 ? '+' : ''}${stats.resolutionRate - 70}% from target`}
          />
          <KPICard
            title="Active Users"
            value={stats.activeUsers}
            icon="👥"
            color="purple"
            subtitle="Currently online"
          />
          <KPICard
            title="System Health"
            value={`${stats.systemHealth}%`}
            icon="💚"
            color="blue"
            trend="stable"
            trendValue="Excellent"
          />
        </div>

        {/* ✅ Charts Section - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
          {/* Trend Chart - Full width on mobile */}
          <ChartCard
            title="📈 Incidents Trend"
            subtitle="แนวโน้มเหตุการณ์ 6 เดือนย้อนหลัง"
            height="lg"
            fullWidth
            action={
              <button
                onClick={() => handleExport('trend')}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                📥 Export
              </button>
            }
          >
            {trendData ? (
              <Line data={trendData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>ไม่มีข้อมูล</p>
              </div>
            )}
          </ChartCard>

          {/* Type Chart */}
          <ChartCard
            title="🥧 Incidents by Type"
            subtitle="แบ่งตามประเภทภัย"
            height="md"
            action={
              <button
                onClick={() => handleExport('type')}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                📥
              </button>
            }
          >
            {typeData ? (
              <Pie data={typeData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>ไม่มีข้อมูล</p>
              </div>
            )}
          </ChartCard>

          {/* Severity Chart */}
          <ChartCard
            title="📊 Incidents by Severity"
            subtitle="แบ่งตามความรุนแรง"
            height="md"
            action={
              <button
                onClick={() => handleExport('severity')}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                📥
              </button>
            }
          >
            {severityData ? (
              <Bar data={severityData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>ไม่มีข้อมูล</p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* ✅ Bottom Section - Performers & Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Performers */}
          <div className="lg:col-span-1">
            <PerformerCard
              performers={topPerformers}
              onViewAll={() => toast.success('View all performers...')}
            />
          </div>

          {/* System Metrics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                📊 System Performance Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  icon="🟢"
                  value={`${metrics.uptime}%`}
                  label="System Uptime"
                  description="Last 30 days"
                  color="green"
                />
                <MetricCard
                  icon="⚡"
                  value={`${metrics.avgResponseTime}h`}
                  label="Avg Response Time"
                  description="Incident resolution"
                  color="blue"
                />
                <MetricCard
                  icon="😊"
                  value={`${metrics.satisfaction}/5`}
                  label="User Satisfaction"
                  description="Based on feedback"
                  color="orange"
                />
                <MetricCard
                  icon="✅"
                  value={metrics.tasksCompleted}
                  label="Tasks Completed"
                  description="This month"
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Quick Actions */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            ⚡ Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <button className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200 group">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">📊</span>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Generate Report</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200 group">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">📥</span>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Export Data</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200 group">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">👥</span>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Manage Users</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-3 sm:p-4 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200 group">
              <span className="text-2xl sm:text-3xl group-hover:scale-110 transition-transform">⚙️</span>
              <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Settings</span>
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
