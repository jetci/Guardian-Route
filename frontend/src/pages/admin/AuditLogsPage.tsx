import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import AuditLogTable from '../../components/admin/AuditLogTable';
import { StatCard } from '../../components/common/StatCard';
import statisticsService from '../../services/statisticsService';
import './AuditLogsPage.css';

export default function AuditLogsPage() {
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    today: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // In a real app, we might have a specific endpoint for log stats
      // For now, we'll fetch recent logs and calculate
      const { data } = await statisticsService.getActivityLogs({ limit: 100 });

      const total = data.length;
      const success = data.filter(l => l.status === 'SUCCESS').length;
      const failed = data.filter(l => l.status === 'FAILED').length;

      // Count today's logs
      const today = new Date().toDateString();
      const todayCount = data.filter(l => new Date(l.timestamp).toDateString() === today).length;

      setStats({ total, success, failed, today: todayCount });
    } catch (error) {
      console.error('Failed to fetch log stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="audit-logs-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>📊 Activity Logs (Audit Trail)</h1>
            <p className="subtitle">ติดตามและตรวจสอบกิจกรรมทั้งหมดในระบบ</p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <StatCard
            title="กิจกรรมทั้งหมด"
            value={stats.total}
            icon="📋"
            color="blue"
            loading={loading}
          />
          <StatCard
            title="วันนี้"
            value={stats.today}
            icon="📅"
            color="purple"
            loading={loading}
          />
          <StatCard
            title="สำเร็จ"
            value={stats.success}
            icon="✅"
            color="green"
            loading={loading}
          />
          <StatCard
            title="ล้มเหลว"
            value={stats.failed}
            icon="❌"
            color="red"
            loading={loading}
          />
        </div>

        {/* Real Audit Log Table Component */}
        <div className="logs-card">
          <AuditLogTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

