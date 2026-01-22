import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { tasksApi } from '../../api/tasks';
import { formatThaiDateShort } from '../../utils/dateFormatter';
import toast from 'react-hot-toast';
import type { Task } from '../../types';
import './MyTasksPage.css';

export const MyTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'inProgress' | 'surveyed' | 'completed'>('pending');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setIsLoading(true);
      const response = await tasksApi.getMyTasks();
      setTasks(response);
      toast.success('โหลดข้อมูลสำเร็จ');
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      toast.error(error.message || 'ไม่สามารถโหลดข้อมูลงานได้');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      await tasksApi.acceptTask(taskId);
      toast.success('รับงานสำเร็จ');
      fetchMyTasks();
    } catch (error: any) {
      toast.error(error.message || 'ไม่สามารถรับงานได้');
    }
  };

  const handleViewDetails = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const surveyedTasks = tasks.filter((t) => t.status === 'SURVEYED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  const getActiveTabTasks = () => {
    switch (activeTab) {
      case 'pending':
        return pendingTasks;
      case 'inProgress':
        return inProgressTasks;
      case 'surveyed':
        return surveyedTasks;
      case 'completed':
        return completedTasks;
      default:
        return pendingTasks;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
      case 'HIGH':
        return 'red';
      case 'MEDIUM':
        return 'orange';
      case 'LOW':
        return 'green';
      default:
        return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'gray';
      case 'IN_PROGRESS':
        return 'orange';
      case 'SURVEYED':
        return 'blue';
      case 'COMPLETED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'รอดำเนินการ',
      IN_PROGRESS: 'กำลังดำเนินการ',
      SURVEYED: 'สำรวจแล้ว',
      COMPLETED: 'เสร็จสิ้น',
      CANCELLED: 'ยกเลิก',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      LOW: 'ต่ำ',
      MEDIUM: 'ปานกลาง',
      HIGH: 'สูง',
      URGENT: 'เร่งด่วน',
    };
    return labels[priority] || priority;
  };

  const getDisasterTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FLOOD: '🌊 น้ำท่วม',
      LANDSLIDE: '⛰️ ดินถล่ม',
      FIRE: '🔥 ไฟไหม้',
      WILDFIRE: '🔥 ไฟป่า',
      STORM: '🌪️ พายุ',
      EARTHQUAKE: '🏚️ แผ่นดินไหว',
      DROUGHT: '☀️ ภัยแล้ง',
      OTHER: '📋 อื่นๆ',
    };
    return labels[type] || type;
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="my-tasks-page">
          <LoadingSpinner size="lg" message="กำลังโหลดข้อมูล..." centered />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="my-tasks-page">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>📋 งานของฉัน</h1>
            <p className="subtitle">งานที่ได้รับมอบหมายทั้งหมด</p>
          </div>
          <button className="btn-refresh" onClick={fetchMyTasks}>
            🔄 รีเฟรช
          </button>
        </div>

        {/* Stats Summary */}
        <div className="stats-grid">
          <div className="stat-card yellow">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <h3>{pendingTasks.length}</h3>
              <p>รอดำเนินการ</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>{inProgressTasks.length}</h3>
              <p>กำลังดำเนินการ</p>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{surveyedTasks.length}</h3>
              <p>สำรวจแล้ว</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">🎉</div>
            <div className="stat-content">
              <h3>{completedTasks.length}</h3>
              <p>เสร็จสิ้น</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="task-tabs">
          <button
            className={`task-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <span className="tab-icon">⏳</span>
            <span className="tab-label">รอดำเนินการ</span>
            <span className="tab-count">{pendingTasks.length}</span>
          </button>
          <button
            className={`task-tab ${activeTab === 'inProgress' ? 'active' : ''}`}
            onClick={() => setActiveTab('inProgress')}
          >
            <span className="tab-icon">🔄</span>
            <span className="tab-label">กำลังดำเนินการ</span>
            <span className="tab-count">{inProgressTasks.length}</span>
          </button>
          <button
            className={`task-tab ${activeTab === 'surveyed' ? 'active' : ''}`}
            onClick={() => setActiveTab('surveyed')}
          >
            <span className="tab-icon">✅</span>
            <span className="tab-label">สำรวจแล้ว</span>
            <span className="tab-count">{surveyedTasks.length}</span>
          </button>
          <button
            className={`task-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            <span className="tab-icon">🎉</span>
            <span className="tab-label">เสร็จสิ้น</span>
            <span className="tab-count">{completedTasks.length}</span>
          </button>
        </div>

        {/* Tasks Grid */}
        <div className="tasks-grid">
          {getActiveTabTasks().length === 0 ? (
            <EmptyState
              icon="clipboard"
              title={`ไม่มีงาน${getStatusLabel(activeTab.toUpperCase().replace('INPROGRESS', 'IN_PROGRESS'))}`}
              description="คุณไม่มีงานในสถานะนี้ในขณะนี้"
            />
          ) : (
            getActiveTabTasks().map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-card-header">
                  <div className="task-id">#{task.id.substring(0, 8)}</div>
                  <div className="task-badges">
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                    <span className={`status-badge ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>

                <h3 className="task-title">{task.title}</h3>

                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}

                {task.incident && (
                  <div className="task-incident">
                    <span className="incident-type">
                      {getDisasterTypeLabel(task.incident.disasterType)}
                    </span>
                    <span className="incident-title">{task.incident.title}</span>
                  </div>
                )}

                <div className="task-meta">
                  {task.village && (
                    <span className="meta-item">
                      📍 {task.village.name}
                    </span>
                  )}
                  {task.dueDate && (
                    <span className="meta-item">
                      📅 ครบกำหนด: {formatThaiDateShort(task.dueDate)}
                    </span>
                  )}
                  <span className="meta-item">
                    🕐 สร้างเมื่อ: {formatThaiDateShort(task.createdAt)}
                  </span>
                </div>

                <div className="task-actions">
                  {task.status === 'PENDING' && (
                    <button
                      className="btn-accept"
                      onClick={() => handleAcceptTask(task.id)}
                    >
                      ✅ รับงาน
                    </button>
                  )}
                  <button
                    className="btn-view-details"
                    onClick={() => handleViewDetails(task.id)}
                  >
                    👁️ ดูรายละเอียด
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
