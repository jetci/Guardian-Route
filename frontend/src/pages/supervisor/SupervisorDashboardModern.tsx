/**
 * Modern Supervisor Dashboard
 * Standardized with DashboardLayout
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import './SupervisorDashboardModern.css';

export default function SupervisorDashboardModern() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'urgent' | 'normal'>('urgent');

  // Enhanced mock data
  const urgentReports = [
    { 
      id: 1, 
      title: "น้ำท่วม - บ้านหนองบัว", 
      officer: "นายสมชาย ใจดี", 
      date: "2025-11-12 14:30",
      status: "กำลังดำเนินการ",
      priority: "สูง",
      village: "หมู่ 3",
      type: "น้ำท่วม"
    },
    { 
      id: 2, 
      title: "ดินถล่ม - หมู่ 5", 
      officer: "นางสาวสมหญิง รักดี", 
      date: "2025-11-12 10:15",
      status: "รอตรวจสอบ",
      priority: "สูงมาก",
      village: "หมู่ 5",
      type: "ดินถล่ม"
    },
    { 
      id: 5, 
      title: "ไฟไหม้บ้าน - ป่าบง", 
      officer: "นายวิชัย สุขสันต์", 
      date: "2025-11-12 08:00",
      status: "รอมอบหมาย",
      priority: "สูง",
      village: "หมู่ 2",
      type: "ไฟไหม้"
    }
  ];

  const normalReports = [
    { 
      id: 3, 
      title: "ไฟไหม้ป่า - เขาใหญ่", 
      officer: "นายประสิทธิ์ มั่นคง", 
      date: "2025-11-11 16:45",
      status: "เสร็จสิ้น",
      priority: "ปานกลาง",
      village: "หมู่ 8",
      type: "ไฟไหม้"
    },
    { 
      id: 4, 
      title: "แผ่นดินไหว - ตำบลเวียง", 
      officer: "นางสาววิภา สุขใจ", 
      date: "2025-11-11 09:20",
      status: "กำลังดำเนินการ",
      priority: "ปานกลาง",
      village: "หมู่ 12",
      type: "แผ่นดินไหว"
    },
    { 
      id: 6, 
      title: "ถนนชำรุด - สันทรายคองน้อย", 
      officer: "นายสมศักดิ์ ใจกล้า", 
      date: "2025-11-10 14:20",
      status: "เสร็จสิ้น",
      priority: "ต่ำ",
      village: "หมู่ 6",
      type: "โครงสร้าง"
    }
  ];

  // Statistics
  const stats = {
    totalIncidents: 24,
    urgentIncidents: 3,
    inProgress: 8,
    completed: 13,
    activeOfficers: 12,
    totalOfficers: 15,
    avgResponseTime: "2.5 ชม.",
    todayIncidents: 5
  };

  const reports = activeTab === 'urgent' ? urgentReports : normalReports;

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'สูงมาก': return 'priority-critical';
      case 'สูง': return 'priority-high';
      case 'ปานกลาง': return 'priority-medium';
      case 'ต่ำ': return 'priority-low';
      default: return '';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'รอมอบหมาย': return 'status-pending';
      case 'รอตรวจสอบ': return 'status-review';
      case 'กำลังดำเนินการ': return 'status-progress';
      case 'เสร็จสิ้น': return 'status-completed';
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

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card kpi-purple">
            <div className="kpi-icon">📊</div>
            <div className="kpi-content">
              <div className="kpi-value">{stats.totalIncidents}</div>
              <div className="kpi-label">เหตุการณ์ทั้งหมด</div>
              <div className="kpi-trend positive">+5 จากเมื่อวาน</div>
            </div>
          </div>

          <div className="kpi-card kpi-red">
            <div className="kpi-icon">🚨</div>
            <div className="kpi-content">
              <div className="kpi-value">{stats.urgentIncidents}</div>
              <div className="kpi-label">เหตุการณ์ด่วน</div>
              <div className="kpi-trend negative">ต้องดำเนินการ</div>
            </div>
          </div>

          <div className="kpi-card kpi-blue">
            <div className="kpi-icon">⏱️</div>
            <div className="kpi-content">
              <div className="kpi-value">{stats.avgResponseTime}</div>
              <div className="kpi-label">เวลาตอบสนองเฉลี่ย</div>
              <div className="kpi-trend positive">ดีขึ้น 0.3 ชม.</div>
            </div>
          </div>

          <div className="kpi-card kpi-green">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <div className="kpi-value">{stats.activeOfficers}/{stats.totalOfficers}</div>
              <div className="kpi-label">เจ้าหน้าที่ปฏิบัติงาน</div>
              <div className="kpi-trend positive">{Math.round((stats.activeOfficers/stats.totalOfficers)*100)}% พร้อมใช้งาน</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="btn-primary" onClick={() => toast.success('✅ Feature coming soon!')}>
            ➕ มอบหมายงานใหม่
          </button>
          <button className="btn-secondary" onClick={() => toast.success('✅ Feature coming soon!')}>
            👥 ดูภาพรวมทีม
          </button>
          <button className="btn-secondary" onClick={() => toast.success('✅ Feature coming soon!')}>
            📊 สร้างรายงาน
          </button>
        </div>

        {/* Reports Section */}
        <div className="reports-section">
          <div className="section-header">
            <h2 className="section-title">📝 รายงานรอตรวจสอบ</h2>
            <div className="section-actions">
              <button className="btn-filter">🔍 ค้นหา</button>
              <button className="btn-filter">⚙️ ตัวกรอง</button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              onClick={() => setActiveTab('urgent')}
              className={`tab ${activeTab === 'urgent' ? 'active' : ''}`}
            >
              🔴 เหตุการณ์ด่วน ({urgentReports.length})
            </button>
            <button
              onClick={() => setActiveTab('normal')}
              className={`tab ${activeTab === 'normal' ? 'active' : ''}`}
            >
              🟡 เหตุการณ์ปกติ ({normalReports.length})
            </button>
          </div>

          {/* Report Cards */}
          <div className="reports-list">
            {reports.map(report => (
              <div key={report.id} className="report-card">
                <div className="report-header">
                  <div className="report-title-section">
                    <h3 className="report-title">{report.title}</h3>
                    <div className="report-meta">
                      <span className="report-village">📍 {report.village}</span>
                      <span className="report-type">🏷️ {report.type}</span>
                    </div>
                  </div>
                  <div className="report-badges">
                    <span className={`badge ${getPriorityClass(report.priority)}`}>
                      {report.priority}
                    </span>
                    <span className={`badge ${getStatusClass(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                </div>

                <div className="report-body">
                  <div className="report-info">
                    <div className="info-item">
                      <span className="info-icon">👤</span>
                      <span className="info-text">{report.officer}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">🕐</span>
                      <span className="info-text">{report.date}</span>
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
                    onClick={() => toast.success('📄 View details')}
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
                  
                  <button 
                    onClick={() => toast.success('✅ Approved!')}
                    title="อนุมัติรายงาน"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ✅ อนุมัติ
                  </button>
                  
                  <button 
                    onClick={() => toast.error('❌ Rejected')}
                    title="ปฏิเสธรายงาน"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    ❌ ปฏิเสธ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
