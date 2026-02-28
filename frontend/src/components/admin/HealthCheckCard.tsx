import { useQuery } from '@tanstack/react-query';
import { healthApi } from '../../api/health';
import './HealthCheckCard.css';

export const HealthCheckCard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: healthApi.getHealth,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="health-card loading">
        <div className="spinner"></div>
        <p>กำลังตรวจสอบสถานะระบบ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="health-card error">
        <div className="status-icon">❌</div>
        <h3>ไม่สามารถเชื่อมต่อระบบได้</h3>
        <p className="error-message">{(error as Error).message}</p>
      </div>
    );
  }

  const isHealthy = data?.status === 'healthy';
  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className={`health-card ${isHealthy ? 'healthy' : 'unhealthy'}`}>
      <div className="card-header">
        <div className="status-icon">{isHealthy ? '✅' : '⚠️'}</div>
        <h3>สถานะระบบ</h3>
      </div>
      
      <div className="card-body">
        <div className="status-row">
          <span className="label">สถานะ:</span>
          <span className={`value status-${data?.status}`}>
            {isHealthy ? 'ปกติ' : 'มีปัญหา'}
          </span>
        </div>
        
        <div className="status-row">
          <span className="label">เวลาทำงาน:</span>
          <span className="value">{formatUptime(data?.uptime || 0)}</span>
        </div>
        
        <div className="status-row">
          <span className="label">เวลาตอบสนอง:</span>
          <span className="value">{data?.responseTime}</span>
        </div>
        
        <div className="status-row">
          <span className="label">เวอร์ชัน:</span>
          <span className="value">{data?.version}</span>
        </div>
        
        <div className="status-row">
          <span className="label">สภาพแวดล้อม:</span>
          <span className="value environment">{data?.environment}</span>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="service-status">
          <span className="service-label">Database:</span>
          <span className={`service-value ${data?.services.database}`}>
            {data?.services.database === 'up' ? '🟢 เชื่อมต่อ' : '🔴 ขาดการเชื่อมต่อ'}
          </span>
        </div>
        <div className="service-status">
          <span className="service-label">API:</span>
          <span className={`service-value ${data?.services.api}`}>
            {data?.services.api === 'up' ? '🟢 พร้อมใช้งาน' : '🔴 ไม่พร้อม'}
          </span>
        </div>
      </div>
      
      <div className="last-updated">
        อัปเดตล่าสุด: {new Date(data?.timestamp || '').toLocaleString('th-TH')}
      </div>
    </div>
  );
};
