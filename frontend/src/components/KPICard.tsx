import './KPICard.css';

interface KPICardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: 'up' | 'down';
  color?: 'blue' | 'green' | 'orange' | 'purple' | 'red';
}

export function KPICard({ title, value, icon, trend, color = 'blue' }: KPICardProps) {
  return (
    <div className={`kpi-card kpi-card-${color}`}>
      <div className="kpi-header">
        <div className="kpi-title">{title}</div>
        {icon && <div className="kpi-icon">{icon}</div>}
      </div>
      <div className="kpi-value">{value}</div>
      {trend && (
        <div className={`kpi-trend kpi-trend-${trend}`}>
          {trend === 'up' ? '↑' : '↓'} 
          {trend === 'up' ? 'เพิ่มขึ้น' : 'ลดลง'}
        </div>
      )}
    </div>
  );
}
