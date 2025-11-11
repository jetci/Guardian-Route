import React, { useState, useEffect, useCallback } from 'react';
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'; // Removed unused BarChart, TrendingUp
import { getMonitoringStatus, getExportHistory, getExportStats } from '../api/monitoring';
import type { MonitoringResponse, ExportHistory, ExportStats } from '../api/monitoring';
// import { exportMonitoringToCSV } from '../utils/monitoringExport'; // Removed as it is not exported
import toast from 'react-hot-toast';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ExportJobStatusTable from '../components/ExportJobStatusTable';
import { useExportJobsPolling } from '../hooks/useExportJobsPolling';

// Interfaces are now imported from '../api/monitoring'
type ApiStatus = MonitoringResponse['apiStatuses'][number];
type MonitoringMetrics = MonitoringResponse['metrics'];

const initialApiStatuses: ApiStatus[] = [];
const initialMetrics: MonitoringMetrics = {
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageLatency: 0,
  timestamp: new Date().toISOString(),
};

const initialExportStats: ExportStats = {
  totalExports: 0,
  avgLatency: 0,
  successRate: 0,
  failRate: 0,
  recentLatencies: [],
};

const MonitoringPage: React.FC = () => {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>(initialApiStatuses);
  const [metrics, setMetrics] = useState<MonitoringMetrics>(initialMetrics);
  const [history, setHistory] = useState<ExportHistory[]>([]);
  const [exportStats, setExportStats] = useState<ExportStats>(initialExportStats);
  const [historyLoading, setHistoryLoading] = useState<boolean>(true);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(10000); // Default to 10 seconds

  // New hook for Export Jobs
  const { jobs, isLoading: isJobsLoading } = useExportJobsPolling();

  const fetchExportStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await getExportStats();
      setExportStats(data);
    } catch (error) {
      console.error('Failed to fetch export stats:', error);
      toast.error('Failed to fetch export stats.');
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const data = await getExportHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch export history:', error);
      toast.error('Failed to fetch export history.');
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const fetchMonitoringData = useCallback(async () => {
    try {
      const data = await getMonitoringStatus();
      setApiStatuses(data.apiStatuses);
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
      toast.error('Failed to fetch monitoring data from API.');
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount
    fetchMonitoringData();
    fetchHistory();
    fetchExportStats();

    // Set up interval for refresh
    const interval = setInterval(() => {
      fetchMonitoringData();
      fetchHistory();
      fetchExportStats();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchMonitoringData, fetchHistory, fetchExportStats]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'offline':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Activity className="w-5 h-5 text-gray-600" />;
    }
  };

  const successRate = metrics.totalRequests > 0 ? (
    (metrics.successfulRequests / metrics.totalRequests) *
    100
  ).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            API Monitoring Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time monitoring of Guardian Route API services
          </p>
        </div>

	        {/* Key Metrics */}
	        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
	          <div className="bg-white rounded-lg shadow p-6">
	            <div className="flex items-center justify-between">
	              <div>
	                <p className="text-gray-600 text-sm font-medium">Total Requests</p>
	                <p className="text-3xl font-bold text-gray-900 mt-2">
	                  {metrics.totalRequests.toLocaleString()}
	                </p>
	              </div>
	              <Activity className="w-12 h-12 text-blue-500 opacity-20" />
	            </div>
	          </div>
	
	          <div className="bg-white rounded-lg shadow p-6">
	            <div className="flex items-center justify-between">
	              <div>
	                <p className="text-gray-600 text-sm font-medium">Success Rate</p>
	                <p className="text-3xl font-bold text-green-600 mt-2">
	                  {successRate}%
	                </p>
	              </div>
	              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
	            </div>
	          </div>
	
	          <div className="bg-white rounded-lg shadow p-6">
	            <div className="flex items-center justify-between">
	              <div>
	                <p className="text-gray-600 text-sm font-medium">Failed Requests</p>
	                <p className="text-3xl font-bold text-red-600 mt-2">
	                  {metrics.failedRequests}
	                </p>
	              </div>
	              <AlertCircle className="w-12 h-12 text-red-500 opacity-20" />
	            </div>
	          </div>
	
	          <div className="bg-white rounded-lg shadow p-6">
	            <div className="flex items-center justify-between">
	              <div>
	                <p className="text-gray-600 text-sm font-medium">Avg Latency</p>
	                <p className="text-3xl font-bold text-purple-600 mt-2">
	                  {Math.round(metrics.averageLatency)}ms
	                </p>
	              </div>
	              <Clock className="w-12 h-12 text-purple-500 opacity-20" />
	            </div>
	          </div>
	        </div>

		        {/* Export Job Status Section (New) */}
		        <div className="mb-8">
		          <ExportJobStatusTable jobs={jobs} isLoading={isJobsLoading} />
		        </div>

		        {/* Export Metrics Section */}
		        <div className="mb-8">
		          <h2 className="text-2xl font-bold text-gray-900 mb-4">Export Performance Metrics</h2>
	          {statsLoading ? (
	            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
	              <div className="flex items-center justify-center space-x-2">
	                <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
	                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
	                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	                </svg>
	                <span>กำลังโหลดสถิติการ Export...</span>
	              </div>
	            </div>
	          ) : (
	            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
	              {/* Stat Cards */}
	              <div className="bg-white rounded-lg shadow p-6">
	                <p className="text-gray-600 text-sm font-medium">Total Exports</p>
	                <p className="text-3xl font-bold text-gray-900 mt-2">
	                  {exportStats.totalExports.toLocaleString()}
	                </p>
	              </div>
	              <div className="bg-white rounded-lg shadow p-6">
	                <p className="text-gray-600 text-sm font-medium">Average Latency</p>
	                <p className="text-3xl font-bold text-purple-600 mt-2">
	                  {exportStats.avgLatency.toFixed(2)}ms
	                </p>
	              </div>
	              <div className="bg-white rounded-lg shadow p-6">
	                <p className="text-gray-600 text-sm font-medium">Success Rate</p>
	                <p className="text-3xl font-bold text-green-600 mt-2">
	                  {exportStats.successRate.toFixed(2)}%
	                </p>
	              </div>

	              {/* Success/Fail Bar Chart */}
	              <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
	                <h3 className="text-lg font-semibold text-gray-900 mb-4">Success vs Failure Rate</h3>
	                <ResponsiveContainer width="100%" height={300}>
	                  <RechartsBarChart
	                    data={[
	                      { name: 'Success', value: exportStats.successRate, fill: '#10B981' },
	                      { name: 'Failure', value: exportStats.failRate, fill: '#EF4444' },
	                    ]}
	                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
	                  >
	                    <CartesianGrid strokeDasharray="3 3" />
	                    <XAxis dataKey="name" />
	                    <YAxis domain={[0, 100]} unit="%" />
	                    <Tooltip formatter={(value) => [`${value}%`, 'Rate']} />
	                    <Bar dataKey="value" />
	                  </RechartsBarChart>
	                </ResponsiveContainer>
	              </div>

	              {/* Recent Latency Line Chart */}
	              <div className="bg-white rounded-lg shadow p-6">
	                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Latency (ms)</h3>
	                <ResponsiveContainer width="100%" height={300}>
	                  <LineChart
	                    data={exportStats.recentLatencies.map((latency, index) => ({
	                      name: `Export ${index + 1}`,
	                      latency: latency,
	                    }))}
	                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
	                  >
	                    <CartesianGrid strokeDasharray="3 3" />
	                    <XAxis dataKey="name" />
	                    <YAxis unit="ms" />
	                    <Tooltip />
	                    <Legend />
	                    <Line type="monotone" dataKey="latency" stroke="#8B5CF6" activeDot={{ r: 8 }} />
	                  </LineChart>
	                </ResponsiveContainer>
	              </div>
	            </div>
	          )}
	        </div>
	
	        {/* API Status Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">API Services Status</h2>
            <button
              onClick={() => toast.error('Export function is temporarily disabled.')}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg text-sm font-medium cursor-not-allowed"
              disabled
            >
              Export to CSV (Disabled)
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Uptime
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Latency
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Last Checked
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {apiStatuses.map((api, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {api.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(api.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            api.status
                          )}`}
                        >
                          {api.status.charAt(0).toUpperCase() + api.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {api.uptime.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {Math.round(api.latency)}ms
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(api.lastChecked).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

	        {/* Refresh Control */}
	        <div className="mt-8 flex justify-between items-center">
	          <p className="text-sm text-gray-600">
	            Last updated: {new Date(metrics.timestamp).toLocaleString()}
	          </p>
	          <div className="flex gap-4">
	            <select
	              value={refreshInterval}
	              onChange={(e) => setRefreshInterval(Number(e.target.value))}
	              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50"
	            >
	              <option value={10000}>Refresh every 10s</option>
	              <option value={30000}>Refresh every 30s</option>
	              <option value={60000}>Refresh every 1m</option>
	              <option value={300000}>Refresh every 5m</option>
	            </select>
	          </div>
	        </div>

	        {/* Export History Table */}
	        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
	          <div className="px-6 py-4 border-b border-gray-200">
	            <h2 className="text-xl font-bold text-gray-900">Export History (Last 10)</h2>
	          </div>
	          <div className="overflow-x-auto">
	            <table className="w-full">
	              <thead className="bg-gray-50 border-b border-gray-200">
	                <tr>
	                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
	                    วันที่/เวลา
	                  </th>
	                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
	                    ชื่อไฟล์
	                  </th>
	                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
	                    Latency (ms)
	                  </th>
	                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
	                    สถานะ
	                  </th>
	                </tr>
	              </thead>
	              <tbody className="divide-y divide-gray-200">
	                {historyLoading ? (
	                  <tr>
	                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
	                      <div className="flex items-center justify-center space-x-2">
	                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
	                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
	                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
	                        </svg>
	                        <span>กำลังโหลดประวัติการ Export...</span>
	                      </div>
	                    </td>
	                  </tr>
	                ) : history.length === 0 ? (
	                  <tr>
	                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
	                      ไม่พบประวัติการ Export
	                    </td>
	                  </tr>
	                ) : (
	                  history.map((item) => (
	                    <tr key={item.id} className="hover:bg-gray-50">
	                      <td className="px-6 py-4 text-sm text-gray-900">
	                        {new Date(item.timestamp).toLocaleString()}
	                      </td>
	                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
	                        {item.fileName}
	                      </td>
	                      <td className="px-6 py-4 text-sm text-gray-900">
	                        {item.latencyAvg}ms
	                      </td>
	                      <td className="px-6 py-4 text-sm">
	                        <span
	                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
	                            item.status === 'SUCCESS'
	                              ? 'bg-green-100 text-green-800'
	                              : 'bg-red-100 text-red-800'
	                          }`}
	                        >
	                          {item.status}
	                        </span>
	                      </td>
	                    </tr>
	                  ))
	                )}
	              </tbody>
	            </table>
	          </div>
	        </div>
      </div>
    </div>
  );
};

export default MonitoringPage;
