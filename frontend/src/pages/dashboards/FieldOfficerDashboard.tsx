import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KPICard } from '../../components/KPICard';
import { tasksApi } from '../../api/tasks';
import { formatThaiDateShort } from '../../utils/dateFormatter';
import toast from 'react-hot-toast';
import type { Task } from '../../types';
import './FieldOfficerDashboard.css';

export function FieldOfficerDashboard() {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'COMPLETED' | 'IN_PROGRESS'>('PENDING');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const myTasks = await tasksApi.getMyTasks();
      setTasks(myTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      toast.error('ไม่สามารถโหลดงานได้');
    } finally {
      setLoading(false);
    }
  };

  const newTasks = tasks.filter(t => t.status === 'PENDING');
  const surveyCompleteTasks = tasks.filter(t => t.status === 'COMPLETED');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');

  const handleViewTask = (taskId: string) => {
    // Navigate to TaskDetailPageNew to view and accept task
    navigate(`/tasks/${taskId}`);
  };

  const handleCreateReport = (taskId: string) => {
    navigate(`/detailed-assessment/${taskId}`);
  };

  const getTasksByStatus = () => {
    switch (activeTab) {
      case 'PENDING': return newTasks;
      case 'COMPLETED': return surveyCompleteTasks;
      case 'IN_PROGRESS': return inProgressTasks;
    }
  };

  const getActionButton = (task: Task) => {
    switch (task.status) {
      case 'PENDING':
        return (
          <button className="btn btn-primary btn-block" onClick={() => handleViewTask(task.id)}>
            🔍 รับทราบและเริ่มสำรวจ
          </button>
        );
      case 'COMPLETED':
        return (
          <button className="btn btn-primary btn-block" onClick={() => handleCreateReport(task.id)}>
            📝 สร้างรายงาน
          </button>
        );
      case 'IN_PROGRESS':
        return (
          <button className="btn btn-success btn-block" onClick={() => handleViewTask(task.id)}>
            📋 ดูรายละเอียด
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
          title="กำลังดำเนินการ"
          value={inProgressTasks.length}
          icon="⚙️"
          color="orange"
        />
        <KPICard
          title="เสร็จสิ้น"
          value={surveyCompleteTasks.length}
          icon="✅"
          color="green"
        />
        <KPICard
          title="งานทั้งหมด"
          value={tasks.length}
          icon="📊"
          color="purple"
        />
      </div>

      {/* Tab Navigation */}
      <div className="task-tabs">
        <button
          className={`tab-button ${activeTab === 'PENDING' ? 'active' : ''}`}
          onClick={() => setActiveTab('PENDING')}
        >
          📋 งานใหม่ ({newTasks.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'IN_PROGRESS' ? 'active' : ''}`}
          onClick={() => setActiveTab('IN_PROGRESS')}
        >
          ⚙️ กำลังดำเนินการ ({inProgressTasks.length})
        </button>
        <button
          className={`tab-button ${activeTab === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => setActiveTab('COMPLETED')}
        >
          ✅ เสร็จสิ้น ({surveyCompleteTasks.length})
        </button>
      </div>

      {/* Task List */}
      <div className="content-section">
        {loading ? (
          <div className="loading-state">กำลังโหลดงาน...</div>
        ) : (
          <div className="tasks-grid">
            {currentTasks.map((task) => (
              <div key={task.id} className="task-card-new">
                <div className="task-card-header-new">
                  <span className={`priority priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className="task-date">📅 {task.dueDate ? formatThaiDateShort(task.dueDate) : 'ไม่ระบุ'}</span>
                </div>

                <h3 className="task-title-new">{task.title}</h3>
                <p className="task-description-new">{task.description || 'ไม่มีรายละเอียด'}</p>

                <div className="task-location">
                  📍 {task.village?.name || task.incident?.address || 'ไม่ระบุ'}
                </div>

                {task.completedAt && (
                  <div className="task-survey-date">
                    ✅ สำรวจเมื่อ: {formatThaiDateShort(task.completedAt)}
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
        )}
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
