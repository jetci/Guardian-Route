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

        {/* Stats - Modern Design */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768
            ? '1fr'
            : window.innerWidth < 1024
              ? 'repeat(2, 1fr)'
              : 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {/* Total Activities */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(102, 126, 234, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.25)';
            }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.15 }}>📋</div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>กิจกรรมทั้งหมด</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px' }}>
              {loading ? '...' : stats.total}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>รายการ</div>
          </div>

          {/* Today */}
          <div style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(240, 147, 251, 0.25)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(240, 147, 251, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(240, 147, 251, 0.25)';
            }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.15 }}>📅</div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>วันนี้</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px' }}>
              {loading ? '...' : stats.today}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>รายการ</div>
          </div>

          {/* Success */}
          <div style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(67, 233, 123, 0.25)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(67, 233, 123, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(67, 233, 123, 0.25)';
            }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.15 }}>✅</div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>สำเร็จ</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px' }}>
              {loading ? '...' : stats.success}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>รายการ</div>
          </div>

          {/* Failed */}
          <div style={{
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 8px 24px rgba(250, 112, 154, 0.25)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(250, 112, 154, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(250, 112, 154, 0.25)';
            }}>
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.15 }}>❌</div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', opacity: 0.9 }}>ล้มเหลว</div>
            <div style={{ fontSize: '36px', fontWeight: '800', marginBottom: '4px' }}>
              {loading ? '...' : stats.failed}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>รายการ</div>
          </div>
        </div>

        {/* Real Audit Log Table Component */}
        <div className="logs-card">
          <AuditLogTable />
        </div>
      </div>
    </DashboardLayout>
  );
}

