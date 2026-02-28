import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../../api/health';
import './SystemStatsCard.css';

export const SystemStatsCard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['system-stats'],
    queryFn: healthApi.getSystemStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="system-stats-card loading">
        <div className="spinner"></div>
        <p>กำลังโหลดข้อมูลระบบ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="system-stats-card error">
        <div className="error-icon">⚠️</div>
        <h3>ไม่สามารถโหลดข้อมูลได้</h3>
        <p className="error-message">{(error as Error).message}</p>
      </div>
    );
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="system-stats-card">
      {/* Header */}
      <div className="card-header">
        <h3>📊 ข้อมูลระบบ</h3>
        <span className="refresh-indicator">🔄 อัปเดตทุก 30 วินาที</span>
      </div>

      {/* System Info */}
      <div className="stats-section">
        <h4>💻 ระบบปฏิบัติการ</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Platform:</span>
            <span className="value">{data?.system.platform}</span>
          </div>
          <div className="stat-item">
            <span className="label">Architecture:</span>
            <span className="value">{data?.system.arch}</span>
          </div>
          <div className="stat-item">
            <span className="label">CPUs:</span>
            <span className="value">{data?.system.cpus} cores</span>
          </div>
          <div className="stat-item">
            <span className="label">Uptime:</span>
            <span className="value">{formatUptime(data?.system.uptime || 0)}</span>
          </div>
        </div>
      </div>

      {/* Memory Usage */}
      <div className="stats-section">
        <h4>💾 การใช้หน่วยความจำ</h4>
        <div className="memory-bar-container">
          <div 
            className="memory-bar" 
            style={{ width: `${data?.memory.usagePercent}%` }}
          >
            {data?.memory.usagePercent}%
          </div>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Total:</span>
            <span className="value">{data?.memory.total}</span>
          </div>
          <div className="stat-item">
            <span className="label">Used:</span>
            <span className="value">{data?.memory.used}</span>
          </div>
          <div className="stat-item">
            <span className="label">Free:</span>
            <span className="value">{data?.memory.free}</span>
          </div>
        </div>
      </div>

      {/* Database */}
      <div className="stats-section">
        <h4>🗄️ ฐานข้อมูล</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">Status:</span>
            <span className={`value status-${data?.database.status}`}>
              {data?.database.status === 'connected' ? '🟢 เชื่อมต่อ' : '🔴 ขาดการเชื่อมต่อ'}
            </span>
          </div>
          <div className="stat-item">
            <span className="label">Connections:</span>
            <span className="value">{data?.database.activeConnections}</span>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-section">
        <h4>📈 สถิติระบบ</h4>
        <div className="stats-grid large">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-value">{data?.statistics.activeUsers || 0}</div>
              <div className="stat-label">ผู้ใช้งานทั้งหมด</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div className="stat-content">
              <div className="stat-value">{data?.statistics.totalIncidents || 0}</div>
              <div className="stat-label">เหตุการณ์ทั้งหมด</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <div className="stat-value">{data?.statistics.totalTasks || 0}</div>
              <div className="stat-label">งานทั้งหมด</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏘️</div>
            <div className="stat-content">
              <div className="stat-value">{data?.statistics.totalVillages || 0}</div>
              <div className="stat-label">หมู่บ้านทั้งหมด</div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Info */}
      <div className="stats-section">
        <h4>⚙️ Process</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="label">PID:</span>
            <span className="value">{data?.process.pid}</span>
          </div>
          <div className="stat-item">
            <span className="label">Uptime:</span>
            <span className="value">{formatUptime(data?.process.uptime || 0)}</span>
          </div>
          <div className="stat-item">
            <span className="label">Heap Used:</span>
            <span className="value">{data?.process.memory.heapUsed}</span>
          </div>
          <div className="stat-item">
            <span className="label">RSS:</span>
            <span className="value">{data?.process.memory.rss}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
