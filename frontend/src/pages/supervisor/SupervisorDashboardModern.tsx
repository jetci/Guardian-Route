/**
 * Modern Supervisor Dashboard
 * Standardized with DashboardLayout
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCard } from '../../components/common/StatCard';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { incidentService } from '../../services/incidentService';
import usersApi from '../../services/userService';
import './SupervisorDashboardModern.css';

export default function SupervisorDashboardModern() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'urgent' | 'normal'>('urgent');
  const [loading, setLoading] = useState(true);

  // Data states
  const [incidents, setIncidents] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalIncidents: 0,
    urgentIncidents: 0,
    activeOfficers: 0,
    totalOfficers: 0,
    avgResponseTime: "2.5 ชม." // Mock for now as backend doesn't support this yet
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch incidents and users in parallel
      const [incidentsData, usersData] = await Promise.all([
        incidentService.getAll(),
        usersApi.getAll()
      ]);

      setIncidents(incidentsData);

      // Calculate stats
      const urgentCount = incidentsData.filter((i: any) =>
        i.priority === 'HIGH' || i.priority === 'CRITICAL'
      ).length;

      const fieldOfficers = usersData.filter((u: any) => u.role === 'FIELD_OFFICER');
      const activeOfficers = fieldOfficers.filter((u: any) => u.isActive).length;

      setStats({
        totalIncidents: incidentsData.length,
        urgentIncidents: urgentCount,
        activeOfficers,
        totalOfficers: fieldOfficers.length,
        avgResponseTime: "2.5 ชม."
      });

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลได้');
    } finally {
      setLoading(false);
    }
  };

  // Filter incidents based on tab
  const filteredIncidents = incidents.filter(incident => {
    const isUrgent = incident.priority === 'HIGH' || incident.priority === 'CRITICAL';
    return activeTab === 'urgent' ? isUrgent : !isUrgent;
  });

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'priority-critical';
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'IN_PROGRESS': return 'status-progress';
      case 'RESOLVED': return 'status-completed';
      case 'CLOSED': return 'status-completed';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="supervisor-dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">📊 Supervisor Dashboard</h1>
            <p className="page-subtitle">จัดการทีมและตรวจสอบรายงาน</p>
          </div>
          <div className="header-actions">
            <button className="btn-icon" onClick={() => toast.success('🔔 Notifications')}>
              🔔
            </button>
            <button className="btn-icon" onClick={() => navigate('/profile')}>
              👤
            </button>
          </div>
        </header>

        {/* Weather Widget */}
        <div className="mb-6 min-h-[250px] h-auto">
          <WeatherWidget />
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <StatCard
            title="เหตุการณ์ทั้งหมด"
            value={stats.totalIncidents}
            icon="📊"
            color="purple"
            loading={loading}
            trend="+5 จากเมื่อวาน"
            trendDirection="positive"
          />
          <StatCard
            title="เหตุการณ์ด่วน"
            value={stats.urgentIncidents}
            icon="🚨"
            color="red"
            loading={loading}
            trend="ต้องดำเนินการ"
            trendDirection="negative"
          />
          <StatCard
            title="เวลาตอบสนองเฉลี่ย"
            value={stats.avgResponseTime}
            icon="⏱️"
            color="blue"
            loading={loading}
            trend="ดีขึ้น 0.3 ชม."
            trendDirection="positive"
          />
          <StatCard
            title="เจ้าหน้าที่ปฏิบัติงาน"
            value={`${stats.activeOfficers}/${stats.totalOfficers}`}
            icon="👥"
            color="green"
            loading={loading}
            trend={`${stats.totalOfficers > 0 ? Math.round((stats.activeOfficers / stats.totalOfficers) * 100) : 0}% พร้อมใช้งาน`}
            trendDirection="positive"
          />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="btn-primary" onClick={() => navigate('/tasks/create')}>
            ➕ มอบหมายงานใหม่
          </button>
          <button className="btn-secondary" onClick={() => navigate('/manage-users')}>
            👥 ดูภาพรวมทีม
          </button>
          <button className="btn-secondary" onClick={() => navigate('/reports')}>
            📊 ดูรายงานทั้งหมด
          </button>
        </div>

        {/* Reports Section */}
        <div className="reports-section">
          <div className="section-header">
            <h2 className="section-title">📝 รายงานและเหตุการณ์</h2>
            <div className="section-actions">
              <button className="btn-filter" onClick={fetchDashboardData}>🔄 รีเฟรช</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              onClick={() => setActiveTab('urgent')}
              className={`tab ${activeTab === 'urgent' ? 'active' : ''}`}
            >
              🔴 เหตุการณ์ด่วน ({incidents.filter(i => i.priority === 'HIGH' || i.priority === 'CRITICAL').length})
            </button>
            <button
              onClick={() => setActiveTab('normal')}
              className={`tab ${activeTab === 'normal' ? 'active' : ''}`}
            >
              🟡 เหตุการณ์ปกติ ({incidents.filter(i => !(i.priority === 'HIGH' || i.priority === 'CRITICAL')).length})
            </button>
          </div>

          {/* Report Cards */}
          <div className="reports-list">
            {loading ? (
              <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูล...</div>
            ) : filteredIncidents.length === 0 ? (
              <div className="p-8 text-center text-gray-500">ไม่พบข้อมูลเหตุการณ์</div>
            ) : (
              filteredIncidents.map(incident => (
                <div key={incident.id} className="report-card">
                  <div className="report-header">
                    <div className="report-title-section">
                      <h3 className="report-title">{incident.title}</h3>
                      <div className="report-meta">
                        <span className="report-village">📍 {incident.location?.address || 'ไม่ระบุพิกัด'}</span>
                        <span className="report-type">🏷️ {incident.type}</span>
                      </div>
                    </div>
                    <div className="report-badges">
                      <span className={`badge ${getPriorityClass(incident.priority)}`}>
                        {incident.priority}
                      </span>
                      <span className={`badge ${getStatusClass(incident.status)}`}>
                        {incident.status}
                      </span>
                    </div>
                  </div>

                  <div className="report-body">
                    <p className="text-gray-600 mb-4 line-clamp-2">{incident.description}</p>
                    <div className="report-info">
                      <div className="info-item">
                        <span className="info-icon">🕐</span>
                        <span className="info-text">{new Date(incident.createdAt).toLocaleString('th-TH')}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={() => navigate(`/incidents/${incident.id}`)}
                      title="ดูรายละเอียด"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      👁️ ดูรายละเอียด
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

