import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import './SupervisorDashboard.css';
import './SupervisorDashboardStandalone.css';

// Mock data - จะเปลี่ยนเป็น real API ทีหลัง
const mockPendingReports = [
  {
    id: 1,
    title: "น้ำท่วม - บ้านหนองบัว",
    officer: "นายสมชาย ใจดี",
    submittedDate: "2025-11-12 14:30",
    priority: "urgent",
    incidentType: "FLOOD",
    affectedHouseholds: 45
  },
  {
    id: 2,
    title: "ดินถล่ม - หมู่ 5",
    officer: "นางสาวสมหญิง รักดี",
    submittedDate: "2025-11-12 10:15",
    priority: "urgent",
    incidentType: "LANDSLIDE",
    affectedHouseholds: 12
  },
  {
    id: 3,
    title: "ไฟไหม้ป่า - เขาใหญ่",
    officer: "นายประสิทธิ์ มั่นคง",
    submittedDate: "2025-11-11 16:45",
    priority: "normal",
    incidentType: "WILDFIRE",
    affectedHouseholds: 8
  },
  {
    id: 4,
    title: "แผ่นดินไหว - ตำบลเวียง",
    officer: "นางสาววิภา สุขใจ",
    submittedDate: "2025-11-11 09:20",
    priority: "normal",
    incidentType: "EARTHQUAKE",
    affectedHouseholds: 23
  }
];

const mockTeamMembers = [
  {
    id: 1,
    name: "นายสมชาย ใจดี",
    email: "somchai@obtwiang.go.th",
    activeTasks: 5,
    completedTasks: 12,
    completionRate: 71
  },
  {
    id: 2,
    name: "นางสาวสมหญิง รักดี",
    email: "somying@obtwiang.go.th",
    activeTasks: 3,
    completedTasks: 15,
    completionRate: 83
  },
  {
    id: 3,
    name: "นายประสิทธิ์ มั่นคง",
    email: "prasit@obtwiang.go.th",
    activeTasks: 4,
    completedTasks: 10,
    completionRate: 71
  },
  {
    id: 4,
    name: "นางสาววิภา สุขใจ",
    email: "wipa@obtwiang.go.th",
    activeTasks: 2,
    completedTasks: 18,
    completionRate: 90
  },
  {
    id: 5,
    name: "นายสุรชัย ดีงาม",
    email: "surachai@obtwiang.go.th",
    activeTasks: 6,
    completedTasks: 8,
    completionRate: 57
  },
  {
    id: 6,
    name: "นางสาวนิภา แสงสว่าง",
    email: "nipa@obtwiang.go.th",
    activeTasks: 3,
    completedTasks: 14,
    completionRate: 82
  },
  {
    id: 7,
    name: "นายวิชัย กล้าหาญ",
    email: "wichai@obtwiang.go.th",
    activeTasks: 4,
    completedTasks: 11,
    completionRate: 73
  },
  {
    id: 8,
    name: "นางสาวอรุณี สดใส",
    email: "arunee@obtwiang.go.th",
    activeTasks: 5,
    completedTasks: 13,
    completionRate: 72
  }
];

export default function SupervisorDashboardStandalone() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'urgent' | 'normal' | 'reviewed'>('urgent');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  // Stats
  const stats = {
    teamSize: mockTeamMembers.length,
    activeTasks: mockTeamMembers.reduce((sum, m) => sum + m.activeTasks, 0),
    pendingReview: mockPendingReports.filter(r => r.priority === 'urgent' || r.priority === 'normal').length,
    completedToday: 12
  };

  // Filter reports by tab
  const filteredReports = mockPendingReports.filter(report => {
    if (activeTab === 'urgent') return report.priority === 'urgent';
    if (activeTab === 'normal') return report.priority === 'normal';
    return false; // reviewed
  });

  const urgentCount = mockPendingReports.filter(r => r.priority === 'urgent').length;
  const normalCount = mockPendingReports.filter(r => r.priority === 'normal').length;

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('✅ Task assigned successfully!');
    setShowAssignModal(false);
  };

  const handleApprove = (reportId: number) => {
    toast.success(`✅ Report #${reportId} approved successfully!`);
  };

  const handleRequestRevision = (report: any) => {
    setSelectedReport(report);
    setShowReviewModal(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="standalone-container">
      {/* Sidebar */}
      <div className="standalone-sidebar">
        <h2>🛡️ Guardian Route</h2>
        <div className="standalone-user-info">
          <div>{user?.firstName} {user?.lastName}</div>
          <div>{user?.role}</div>
        </div>
        <button onClick={handleLogout} className="standalone-logout">
          🚪 Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="standalone-main">
        <div className="supervisor-dashboard">
          <header>
            <h2>📊 Supervisor Dashboard</h2>
            <p>จัดการทีมและตรวจสอบรายงาน</p>
          </header>

          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card blue">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <h3>{stats.teamSize}</h3>
                <p>Team Members</p>
              </div>
            </div>
            
            <div className="kpi-card orange">
              <div className="kpi-icon">📋</div>
              <div className="kpi-content">
                <h3>{stats.activeTasks}</h3>
                <p>Active Tasks</p>
              </div>
            </div>
            
            <div className="kpi-card yellow">
              <div className="kpi-icon">⏳</div>
              <div className="kpi-content">
                <h3>{stats.pendingReview}</h3>
                <p>Pending Review</p>
              </div>
            </div>
            
            <div className="kpi-card green">
              <div className="kpi-icon">✅</div>
              <div className="kpi-content">
                <h3>{stats.completedToday}</h3>
                <p>Done Today</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="btn-primary" onClick={() => setShowAssignModal(true)}>
              ➕ Assign New Task
            </button>
            <button className="btn-secondary">
              👥 View Team
            </button>
          </div>

          {/* Pending Reviews */}
          <div className="pending-reviews">
            <h3>📝 Pending Reviews</h3>
            
            <div className="tabs">
              <button 
                className={activeTab === 'urgent' ? 'active' : ''}
                onClick={() => setActiveTab('urgent')}
              >
                🔴 Urgent ({urgentCount})
              </button>
              <button 
                className={activeTab === 'normal' ? 'active' : ''}
                onClick={() => setActiveTab('normal')}
              >
                🟡 Normal ({normalCount})
              </button>
              <button 
                className={activeTab === 'reviewed' ? 'active' : ''}
                onClick={() => setActiveTab('reviewed')}
              >
                ✅ Reviewed (0)
              </button>
            </div>

            {/* Report Cards */}
            <div className="report-cards">
              {filteredReports.length === 0 ? (
                <div className="empty-state">
                  <p>ไม่มีรายงานที่ต้องตรวจสอบ</p>
                </div>
              ) : (
                filteredReports.map(report => (
                  <div key={report.id} className="report-card">
                    <div className="report-header">
                      <h4>{report.title}</h4>
                      <span className={`badge ${report.priority}`}>
                        {report.priority === 'urgent' ? '🔴 Urgent' : '🟡 Normal'}
                      </span>
                    </div>
                    
                    <div className="report-meta">
                      <p>👤 {report.officer}</p>
                      <p>📅 {report.submittedDate}</p>
                      <p>🏠 {report.affectedHouseholds} ครัวเรือน</p>
                    </div>

                    <div className="report-actions">
                      <button className="btn-view">
                        👁️ View Details
                      </button>
                      <button className="btn-approve" onClick={() => handleApprove(report.id)}>
                        ✅ Approve
                      </button>
                      <button className="btn-revision" onClick={() => handleRequestRevision(report)}>
                        ✏️ Request Revision
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Team Performance */}
          <div className="team-performance">
            <h3>👥 My Team Performance</h3>
            
            <table className="team-table">
              <thead>
                <tr>
                  <th>Officer Name</th>
                  <th>Active Tasks</th>
                  <th>Completed</th>
                  <th>Completion Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockTeamMembers.map(member => (
                  <tr key={member.id}>
                    <td>
                      <div className="officer-info">
                        <strong>{member.name}</strong>
                        <small>{member.email}</small>
                      </div>
                    </td>
                    <td>{member.activeTasks}</td>
                    <td>{member.completedTasks}</td>
                    <td>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{width: `${member.completionRate}%`}}
                          />
                        </div>
                        <span className="progress-text">{member.completionRate}%</span>
                      </div>
                    </td>
                    <td>
                      <button className="btn-small">
                        📋 View Tasks
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modals remain the same... */}
          {showAssignModal && (
            <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>➕ Assign New Task</h3>
                  <button onClick={() => setShowAssignModal(false)}>✕</button>
                </div>
                
                <form onSubmit={handleAssignTask}>
                  <div className="form-group">
                    <label>Task Title *</label>
                    <input type="text" required placeholder="Enter task title" />
                  </div>
                  
                  <div className="form-group">
                    <label>Assign to *</label>
                    <select required>
                      <option value="">Select Officer...</option>
                      {mockTeamMembers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Priority *</label>
                    <select required>
                      <option value="HIGH">🔴 High</option>
                      <option value="MEDIUM">🟡 Medium</option>
                      <option value="LOW">🟢 Low</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Due Date *</label>
                    <ThaiDatePicker
                      id="task-due-date-standalone"
                      value={taskDueDate}
                      onChange={setTaskDueDate}
                      placeholder="เลือกวันครบกำหนด"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows={4} placeholder="Task description..."></textarea>
                  </div>
                  
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowAssignModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      ✅ Assign Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showReviewModal && selectedReport && (
            <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>✏️ Request Revision</h3>
                  <button onClick={() => setShowReviewModal(false)}>✕</button>
                </div>
                
                <div className="review-details">
                  <h4>{selectedReport.title}</h4>
                  <p><strong>Officer:</strong> {selectedReport.officer}</p>
                  <p><strong>Submitted:</strong> {selectedReport.submittedDate}</p>
                </div>

                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  toast.success('📤 Revision request sent successfully!');
                  setShowReviewModal(false); 
                }}>
                  <div className="form-group">
                    <label>Revision Comments *</label>
                    <textarea 
                      rows={6} 
                      required 
                      placeholder="Please provide specific feedback for revision..."
                    ></textarea>
                  </div>
                  
                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowReviewModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary">
                      📤 Send Revision Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
