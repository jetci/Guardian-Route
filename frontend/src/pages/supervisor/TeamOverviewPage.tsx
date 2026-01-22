/**
 * Team Overview Page - Supervisor
 * ภาพรวมทีมงาน
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { usersApi } from '../../api/users';
import { tasksApi } from '../../api/tasks';
import toast from 'react-hot-toast';
import { type User, TaskStatus } from '../../types';


export default function TeamOverviewPage() {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    available: 0,
    onTask: 0,
    offline: 0,
    total: 0
  });

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [team, activeTasks] = await Promise.all([
        usersApi.getFieldOfficers(),
        tasksApi.getAll({ status: TaskStatus.IN_PROGRESS })
      ]);

      setTeamMembers(team);

      // Calculate stats based on isActive status and active tasks
      const activeUserIds = new Set(activeTasks.map(t => t.assignedToId));

      const onTaskCount = team.filter(m => activeUserIds.has(m.id)).length;
      const available = team.filter(m => m.isActive && !activeUserIds.has(m.id)).length;
      const offline = team.filter(m => !m.isActive).length;

      setStats({
        available,
        onTask: onTaskCount,
        offline,
        total: team.length
      });
    } catch (error) {
      console.error('❌ Error loading team data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลทีมได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="supervisor-dashboard">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '48px' }}>⏳</div>
            <p>กำลังโหลดข้อมูลทีม...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
              <div className="stat-value">{stats.available}</div>
              <div className="stat-label">พร้อมปฏิบัติงาน</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏃</div>
              <div className="stat-value">{stats.onTask}</div>
              <div className="stat-label">กำลังทำงาน</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⚫</div>
              <div className="stat-value">{stats.offline}</div>
              <div className="stat-label">ออฟไลน์</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">ทั้งหมด</div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="team-list">
            <h2>รายชื่อเจ้าหน้าที่</h2>
            {teamMembers.length === 0 ? (
              <div className="empty-state">
                <p>ไม่มีข้อมูลเจ้าหน้าที่ภาคสนาม</p>
              </div>
            ) : (
              <div className="members-grid">
                {teamMembers.map(member => (
                  <div key={member.id} className="member-card">
                    <div className="member-header">
                      <div className="member-avatar">
                        {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                      </div>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <p className="member-email">{member.email}</p>
                      </div>
                      <div className={`status-badge ${member.isActive ? 'active' : 'offline'}`}>
                        {member.isActive ? '✅ Active' : '⚫ Offline'}
                      </div>
                    </div>
                    <div className="member-details">
                      <div className="detail-item">
                        <span className="label">Role:</span>
                        <span className="value">{member.role}</span>
                      </div>
                      {member.phone && (
                        <div className="detail-item">
                          <span className="label">Phone:</span>
                          <span className="value">{member.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
