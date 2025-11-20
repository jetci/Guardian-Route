import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KPICard } from '../../components/KPICard';
import { mockKPIs, mockTasks } from '../../mocks/dashboardData';
import { formatThaiDateShort } from '../../utils/dateFormatter';
import './FieldOfficerDashboard.css';

export function FieldOfficerDashboard() {
  const navigate = useNavigate();
  const kpis = mockKPIs.officer;
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'NEW_ASSIGNMENT' | 'SURVEY_COMPLETE' | 'REVISION_REQUIRED'>('NEW_ASSIGNMENT');
  
  const newTasks = mockTasks.filter(t => t.status === 'NEW_ASSIGNMENT');
  const surveyCompleteTasks = mockTasks.filter(t => t.status === 'SURVEY_COMPLETE');
  const revisionTasks = mockTasks.filter(t => t.status === 'REVISION_REQUIRED');

  const handleStartSurvey = (taskId: number) => {
    navigate(`/field-survey/${taskId}`);
  };

  const handleCreateReport = (taskId: number) => {
    navigate(`/detailed-assessment/${taskId}`);
  };

  const handleViewRevision = (taskId: number) => {
    navigate(`/detailed-assessment/${taskId}`);
  };

  const getTasksByStatus = () => {
    switch(activeTab) {
      case 'NEW_ASSIGNMENT': return newTasks;
      case 'SURVEY_COMPLETE': return surveyCompleteTasks;
      case 'REVISION_REQUIRED': return revisionTasks;
    }
  };

  const getActionButton = (task: any) => {
    switch(task.status) {
      case 'NEW_ASSIGNMENT':
        return (
          <button className="btn btn-primary btn-block" onClick={() => handleStartSurvey(task.id)}>
            🔍 รับทราบและเริ่มสำรวจ
          </button>
        );
      case 'SURVEY_COMPLETE':
        return (
          <button className="btn btn-primary btn-block" onClick={() => handleCreateReport(task.id)}>
            📝 สร้างรายงาน
          </button>
        );
      case 'REVISION_REQUIRED':
        return (
          <button className="btn btn-primary btn-block" onClick={() => handleViewRevision(task.id)}>
            💬 ดูความคิดเห็นและแก้ไข
          </button>
        );
    }
  };

  const currentTasks = getTasksByStatus();

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>งานของฉัน (My Tasks)</h1>
      </div>

      <div className="kpi-grid">
        <KPICard
          title="งานใหม่"
          value={newTasks.length}
          icon="📋"
          color="blue"
        />
        <KPICard
          title="สำรวจเสร็จ"
          value={surveyCompleteTasks.length}
          icon="✅"
          color="green"
        />
        <KPICard
          title="ต้องแก้ไข"
          value={revisionTasks.length}
          icon="⚠️"
          color="orange"
        />
        <KPICard
          title="งานทั้งหมด"
          value={mockTasks.length}
          icon="📊"
          color="purple"
        />
      </div>

      {/* Tab Navigation */}
      <div className="task-tabs">
        <button 
          className={`tab-button ${activeTab === 'NEW_ASSIGNMENT' ? 'active' : ''}`}
          onClick={() => setActiveTab('NEW_ASSIGNMENT')}
        >
          📋 งานใหม่ ({newTasks.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'SURVEY_COMPLETE' ? 'active' : ''}`}
          onClick={() => setActiveTab('SURVEY_COMPLETE')}
        >
          ✅ สำรวจเสร็จ ({surveyCompleteTasks.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'REVISION_REQUIRED' ? 'active' : ''}`}
          onClick={() => setActiveTab('REVISION_REQUIRED')}
        >
          ⚠️ ต้องแก้ไข ({revisionTasks.length})
        </button>
      </div>

      {/* Task List */}
      <div className="content-section">
        <div className="tasks-grid">
          {currentTasks.map((task) => (
            <div key={task.id} className="task-card-new">
              <div className="task-card-header-new">
                <span className={`priority priority-${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <span className="task-date">📅 {formatThaiDateShort(task.dueDate)}</span>
              </div>
              
              <h3 className="task-title-new">{task.title}</h3>
              <p className="task-description-new">{task.description}</p>
              
              <div className="task-location">
                📍 {task.location}
              </div>

              {task.surveyDate && (
                <div className="task-survey-date">
                  ✅ สำรวจเมื่อ: {formatThaiDateShort(task.surveyDate)}
                </div>
              )}

              {task.revisionNote && (
                <div className="revision-note">
                  <strong>💬 ความคิดเห็น Supervisor:</strong>
                  <p>{task.supervisorComment}</p>
                  <strong>📝 ต้องแก้ไข:</strong>
                  <p>{task.revisionNote}</p>
                </div>
              )}

              <div className="task-card-footer">
                {getActionButton(task)}
              </div>
            </div>
          ))}

          {currentTasks.length === 0 && (
            <div className="empty-state">
              <p>ไม่มีงานในหมวดนี้</p>
            </div>
          )}
        </div>
      </div>

      {/* Revision Modal */}
      {selectedTask && selectedTask.status === 'REVISION_REQUIRED' && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>💬 ความคิดเห็นและการแก้ไข</h2>
              <button className="modal-close" onClick={() => setSelectedTask(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="task-detail-section">
                <h3>📋 {selectedTask.title}</h3>
                <p><strong>สถานที่:</strong> {selectedTask.location}</p>
                <p><strong>กำหนดส่ง:</strong> {formatThaiDateShort(selectedTask.dueDate)}</p>
              </div>

              <div className="task-detail-section">
                <h3>💬 ความคิดเห็นจาก Supervisor</h3>
                <div className="supervisor-comment">
                  {selectedTask.supervisorComment}
                </div>
              </div>

              <div className="task-detail-section">
                <h3>📝 สิ่งที่ต้องแก้ไข</h3>
                <div className="revision-requirements">
                  {selectedTask.revisionNote}
                </div>
              </div>

              <div className="task-detail-section">
                <h3>📷 อัปโหลดรูปเพิ่มเติม</h3>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="form-input"
                />
              </div>

              <div className="task-detail-section">
                <h3>📝 หมายเหตุเพิ่มเติม</h3>
                <textarea 
                  className="form-input" 
                  rows={4} 
                  placeholder="เพิ่มข้อมูลที่ Supervisor ขอ..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedTask(null)}>ยกเลิก</button>
              <button className="btn btn-primary" onClick={() => {
                alert('บันทึกการแก้ไขแล้ว!');
                setSelectedTask(null);
              }}>
                ส่งการแก้ไข
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
