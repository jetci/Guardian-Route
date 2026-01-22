/**
 * Field Officer Dashboard
 * แดชบอร์ดสำหรับเจ้าหน้าที่ภาคสนาม
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import { LoadingSpinner, EmptyState } from '../../components/common';
import toast from 'react-hot-toast';
import { formatThaiDateShort } from '../../utils/dateFormatter';
import { TAMBON_INFO } from '../../data/villages';
import { tasksApi } from '../../api/tasks';
import { useAuthStore } from '../../stores/authStore';
import { TASK_STATUS, TASK_STATUS_LABELS, TASK_STATUS_COLORS } from '../../constants/taskStatus';
import type { Task as ApiTask } from '../../types';
import './FieldOfficerDashboard.css';

// Using types from API

export default function FieldOfficerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myTasks: 0,
    acceptedTasks: 0,
    completedTasks: 0,
    reportsSubmitted: 0
  });
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);


      // Fetch my tasks from API
      const myTasks = await tasksApi.getMyTasks();
      console.log('✅ Loaded tasks from API:', myTasks.length);

      // Filter only active tasks (exclude completed)
      const activeTasks = myTasks.filter(t =>
        t.status === 'PENDING' ||
        t.status === 'IN_PROGRESS' ||
        t.status === 'SURVEYED'
      );

      // Sort by created date (newest first) and take latest 6
      const sortedTasks = activeTasks
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 6);

      setTasks(sortedTasks);

      // Calculate stats from real data
      // Note: acceptedTasks = IN_PROGRESS + SURVEYED (tasks that are being worked on)
      setStats({
        myTasks: myTasks.length,
        acceptedTasks: myTasks.filter(t =>
          t.status === 'IN_PROGRESS' || t.status === 'SURVEYED'
        ).length,
        completedTasks: myTasks.filter(t => t.status === 'COMPLETED').length,
        reportsSubmitted: myTasks.filter(t => t.completedAt).length
      });

      toast.success('โหลดข้อมูลสำเร็จ');
    } catch (error: any) {
      console.error('❌ Failed to load dashboard data:', error);

      // Better error handling with retry option
      const errorMessage = error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้';

      toast.error(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span>{errorMessage}</span>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                loadDashboardData();
              }}
              style={{
                padding: '6px 12px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              🔄 ลองใหม่
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Memoize helper functions to prevent recreating on every render
  const getPriorityColor = useCallback((priority: string) => {
    switch (priority) {
      case 'URGENT': return 'red';
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'green';
      default: return 'gray';
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'PENDING': return 'gray';
      case 'IN_PROGRESS': return 'orange';
      case 'SURVEYED': return 'blue';
      case 'COMPLETED': return 'green';
      case 'CANCELLED': return 'red';
      // Legacy statuses
      case 'ACCEPTED': return 'blue';
      case 'SUBMITTED': return 'blue';
      case 'APPROVED': return 'green';
      case 'REJECTED': return 'red';
      case 'DRAFT': return 'gray';
      default: return 'gray';
    }
  }, []);

  const getStatusLabel = useCallback((status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'รอดำเนินการ',
      'IN_PROGRESS': 'กำลังดำเนินการ',
      'SURVEYED': 'สำรวจเสร็จแล้ว',
      'COMPLETED': 'เสร็จสิ้น',
      'CANCELLED': 'ยกเลิก',
      // Legacy statuses (for backward compatibility)
      'ACCEPTED': 'รับงานแล้ว',
      'SUBMITTED': 'ส่งแล้ว',
      'APPROVED': 'อนุมัติแล้ว',
      'REJECTED': 'ปฏิเสธ',
      'DRAFT': 'แบบร่าง'
    };
    return labels[status] || status;
  }, []);

  // ✅ Memoize filtered tasks to avoid recalculating on every render
  const pendingTasks = useMemo(() =>
    tasks.filter(t => t.status === 'PENDING'),
    [tasks]
  );

  const inProgressTasks = useMemo(() =>
    tasks.filter(t => t.status === 'IN_PROGRESS'),
    [tasks]
  );

  const surveyedTasks = useMemo(() =>
    tasks.filter(t => t.status === 'SURVEYED'),
    [tasks]
  );

  const completedTasks = useMemo(() =>
    tasks.filter(t => t.status === 'COMPLETED'),
    [tasks]
  );

  // Active tab state
  const [activeTab, setActiveTab] = useState<'pending' | 'inProgress' | 'surveyed'>('pending');

  // Get tasks for active tab
  const getActiveTabTasks = () => {
    switch (activeTab) {
      case 'pending':
        return pendingTasks;
      case 'inProgress':
        return inProgressTasks;
      case 'surveyed':
        return surveyedTasks;
      default:
        return pendingTasks;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="field-officer-dashboard">
          <LoadingSpinner
            size="lg"
            message="กำลังโหลดข้อมูล..."
            centered
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="field-officer-dashboard">
        {/* Header with Location Info */}
        <div className="dashboard-header-wrapper">
          <div className="dashboard-header">
            <h1>👨‍🚒 แดชบอร์ดเจ้าหน้าที่ภาคสนาม</h1>
            <p className="subtitle">ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่</p>
          </div>

          {/* Location Info - Top Right */}
          <div className="location-info">
            <h3>📍 พื้นที่รับผิดชอบ</h3>
            <p>{TAMBON_INFO.fullName}</p>
            <p>พิกัด: {TAMBON_INFO.centerLat}°N, {TAMBON_INFO.centerLng}°E</p>
            <p>จำนวนหมู่บ้าน: {TAMBON_INFO.totalVillages} หมู่บ้าน</p>
            <p>ประชากรรวม: {TAMBON_INFO.totalPopulation.toLocaleString()} คน</p>
          </div>
        </div>

        {/* Weather Widget */}
        <div className="mb-6 min-h-[250px] h-auto">
          <WeatherWidget />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions mb-6">
          <button
            className="btn-quick-action"
            onClick={() => navigate('/create-incident')}
          >
            🚨 แจ้งเหตุใหม่
          </button>
          <button
            className="btn-quick-action"
            onClick={() => navigate('/report-history')}
          >
            📋 ประวัติรายงาน
          </button>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card blue">
            <div className="kpi-icon">📋</div>
            <div className="kpi-content">
              <h3>{stats.myTasks}</h3>
              <p>งานของฉัน</p>
              <span className="kpi-subtitle">My Tasks</span>
            </div>
          </div>

          <div className="kpi-card orange">
            <div className="kpi-icon">✅</div>
            <div className="kpi-content">
              <h3>{stats.acceptedTasks}</h3>
              <p>งานที่รับแล้ว</p>
              <span className="kpi-subtitle">Accepted</span>
            </div>
          </div>

          <div className="kpi-card green">
            <div className="kpi-icon">🎉</div>
            <div className="kpi-content">
              <h3>{stats.completedTasks}</h3>
              <p>งานเสร็จแล้ว</p>
              <span className="kpi-subtitle">Completed</span>
            </div>
          </div>

          <div className="kpi-card purple">
            <div className="kpi-icon">📄</div>
            <div className="kpi-content">
              <h3>{stats.reportsSubmitted}</h3>
              <p>รายงานส่งแล้ว</p>
              <span className="kpi-subtitle">Reports Submitted</span>
            </div>
          </div>
        </div>



        {/* Main Content Grid */}
        <div className="content-grid">
          {/* My Tasks List - Full Width with Tabs */}
          <div className="content-card tasks-card full-width">
            <div className="card-header">
              <h2>📋 งานของฉัน</h2>
              <button
                className="btn-view-all"
                onClick={() => navigate('/tasks/my-tasks')}
              >
                ดูทั้งหมด ({stats.myTasks})
              </button>
            </div>

            {/* Task Status Tabs */}
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
            </div>

            <div className="tasks-grid">
              {getActiveTabTasks().length === 0 ? (
                <EmptyState
                  icon="clipboard"
                  title={`ไม่มีงาน${activeTab === 'pending' ? 'รอดำเนินการ' : activeTab === 'inProgress' ? 'กำลังดำเนินการ' : 'สำรวจแล้ว'}`}
                  description="คุณไม่มีงานในสถานะนี้ในขณะนี้"
                />
              ) : (
                getActiveTabTasks().slice(0, 6).map(task => (
                  <div key={task.id} className="task-item">
                    <div className="task-header">
                      <span className="task-id">{task.id.substring(0, 8)}</span>
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    <h3 className="task-title">{task.title}</h3>
                    <p className="task-description">{task.description || 'ไม่มีรายละเอียด'}</p>

                    <div className="task-meta">
                      <span className="meta-item">
                        📍 {task.village?.name || 'ไม่ระบุ'}
                      </span>
                      {task.dueDate && (
                        <span className="meta-item">
                          📅 ครบกำหนด: {formatThaiDateShort(task.dueDate)}
                        </span>
                      )}
                    </div>

                    <div className="task-footer">
                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                      </span>
                      <button
                        className="btn-view-task"
                        onClick={() => navigate(`/tasks/${task.id}`)}
                      >
                        ดูรายละเอียด
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>


        </div>
      </div>
    </DashboardLayout>
  );
}
