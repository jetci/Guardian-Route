/**
 * Team Overview Page - Supervisor
 * ภาพรวมทีมงาน
 */

import './SupervisorDashboard.css';

export default function TeamOverviewPage() {
  const teamMembers = [
    { id: 1, name: 'สมชาย ใจดี', status: 'available', currentTask: null },
    { id: 2, name: 'สมหญิง รักงาน', status: 'on-task', currentTask: 'สำรวจพื้นที่น้ำท่วม หมู่ 5' },
    { id: 3, name: 'วิชัย ขยัน', status: 'on-task', currentTask: 'ประเมินความเสียหาย หมู่ 12' },
    { id: 4, name: 'สุดา เก่งงาน', status: 'offline', currentTask: null },
  ];

  return (
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

        <div className="content-card">
          <div className="placeholder-content">
            <p>💡 หน้านี้จะแสดงข้อมูล Real-time ของทีมงานทั้งหมด</p>
          </div>
        </div>
      </div>
    </div>
  );
}
