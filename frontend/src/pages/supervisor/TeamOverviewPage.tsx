/**
 * Team Overview Page - Supervisor
 * ภาพรวมทีมงาน
 */

import { DashboardLayout } from '../../components/layout/DashboardLayout';
import './SupervisorDashboard.css';

export default function TeamOverviewPage() {
  const teamMembers = [
    { id: 1, name: 'สมชาย ใจดี', status: 'available', currentTask: null },
    { id: 2, name: 'สมหญิง รักงาน', status: 'on-task', currentTask: 'สำรวจพื้นที่น้ำท่วม หมู่ 5' },
    { id: 3, name: 'วิชัย ขยัน', status: 'on-task', currentTask: 'ประเมินความเสียหาย หมู่ 12' },
    { id: 4, name: 'สุดา เก่งงาน', status: 'offline', currentTask: null },
  ];

  return (
    <DashboardLayout>
      <div className="supervisor-dashboard">
      <div className="dashboard-header">
        <h1>👥 ภาพรวมทีม (Team Overview)</h1>
        <p className="subtitle">สถานะและงานของเจ้าหน้าที่ภาคสนามทั้งหมด</p>
      </div>

      <div className="dashboard-content">
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">1</div>
            <div className="stat-label">พร้อมปฏิบัติงาน</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏃</div>
            <div className="stat-value">2</div>
            <div className="stat-label">กำลังทำงาน</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚫</div>
            <div className="stat-value">1</div>
            <div className="stat-label">ออฟไลน์</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">4</div>
            <div className="stat-label">ทั้งหมด</div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="content-card">
          <h2>รายชื่อสมาชิกทีม</h2>
          <div className="team-list">
            {teamMembers.map(member => (
              <div key={member.id} className="team-member-card">
                <div className="member-avatar">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <div className={`status-badge ${member.status}`}>
                    {member.status === 'available' && '✅ พร้อมปฏิบัติงาน'}
                    {member.status === 'on-task' && '🏃 กำลังทำงาน'}
                    {member.status === 'offline' && '⚫ ออฟไลน์'}
                  </div>
                  {member.currentTask && (
                    <p className="current-task">📋 {member.currentTask}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="content-card">
          <h2>📊 ประสิทธิภาพทีม</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div style={{
              padding: '16px',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #86efac'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a', marginBottom: '4px' }}>
                95%
              </div>
              <div style={{ fontSize: '14px', color: '#15803d' }}>
                อัตราการตอบสนอง
              </div>
            </div>
            <div style={{
              padding: '16px',
              background: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #93c5fd'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#2563eb', marginBottom: '4px' }}>
                2.5 ชม.
              </div>
              <div style={{ fontSize: '14px', color: '#1e40af' }}>
                เวลาเฉลี่ยต่องาน
              </div>
            </div>
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '8px',
              border: '1px solid #fcd34d'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#d97706', marginBottom: '4px' }}>
                12
              </div>
              <div style={{ fontSize: '14px', color: '#b45309' }}>
                งานที่เสร็จวันนี้
              </div>
            </div>
            <div style={{
              padding: '16px',
              background: '#fce7f3',
              borderRadius: '8px',
              border: '1px solid #f9a8d4'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#db2777', marginBottom: '4px' }}>
                3
              </div>
              <div style={{ fontSize: '14px', color: '#be185d' }}>
                งานที่กำลังทำ
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
