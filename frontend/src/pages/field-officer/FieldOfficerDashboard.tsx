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

      // Sort by due date and take latest 10
      const sortedTasks = myTasks
        .sort((a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime())
        .slice(0, 10);

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
    tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'SURVEYED'),
    [tasks]
  );

  const completedTasks = useMemo(() =>
    tasks.filter(t => t.status === 'COMPLETED'),
    [tasks]
  );

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
        {/* Header */}
        <div className="dashboard-header">
          <h1>🎯 Field Officer Dashboard</h1>
          <p className="subtitle">แดชบอร์ดเจ้าหน้าที่ภาคสนาม - ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่</p>
        </div>

        {/* Weather Widget */}
        <div className="mb-6 min-h-[250px] h-auto">
          <WeatherWidget />
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

        {/* Quick Actions */}
        <div className="quick-actions-section">
          <h2>⚡ Quick Actions</h2>
          <div className="quick-actions-grid">
            <button
              className="action-btn primary"
              onClick={() => navigate('/tasks/my-tasks')}
            >
              <span className="action-icon">📥</span>
              <span className="action-text">รับงานใหม่</span>
            </button>

            <button
              className="action-btn success"
              onClick={() => navigate('/survey-area')}
            >
              <span className="action-icon">🔍</span>
              <span className="action-text">สำรวจพื้นที่</span>
            </button>

            <button
              className="action-btn info"
              onClick={() => navigate('/survey-history')}
            >
              <span className="action-icon">📋</span>
              <span className="action-text">ประวัติการสำรวจ</span>
            </button>

            <button
              className="action-btn warning"
              onClick={() => navigate('/field-officer/map')}
            >
              <span className="action-icon">🗺️</span>
              <span className="action-text">แผนที่เหตุการณ์</span>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* My Tasks List */}
          <div className="content-card tasks-card">
            <div className="card-header">
              <h2>📋 งานของฉัน (My Tasks)</h2>
              <button
                className="btn-view-all"
                onClick={() => navigate('/tasks/my-tasks')}
              >
                ดูทั้งหมด →
              </button>
            </div>

            <div className="tasks-list">
              {tasks.length === 0 ? (
                <EmptyState
                  icon="clipboard"
                  title="ไม่มีงานในขณะนี้"
                  description="คุณไม่มีงานที่ต้องทำในขณะนี้ พักผ่อนหรือเตรียมพร้อมสำหรับงานถัดไป"
                />
              ) : (
                tasks.map(task => (
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

          {/* Completed Tasks */}
          <div className="content-card reports-card">
            <div className="card-header">
              <h2>✅ งานที่เสร็จแล้ว (Completed Tasks)</h2>
              <button
                className="btn-view-all"
                onClick={() => navigate('/tasks/my-tasks')}
              >
                ดูทั้งหมด →
              </button>
            </div>

            <div className="reports-list">
              {tasks.filter(t => t.status === 'COMPLETED').length === 0 ? (
                <EmptyState
                  icon="inbox"
                  title="ยังไม่มีงานที่เสร็จ"
                  description="เมื่อคุณทำงานเสร็จ งานที่เสร็จจะปรากฎที่นี่"
                />
              ) : (
                tasks.filter(t => t.status === 'COMPLETED').slice(0, 5).map(task => (
                  <div key={task.id} className="report-item">
                    <div className="report-header">
                      <span className="report-id">{task.id.substring(0, 8)}</span>
                      <span className={`status-badge green`}>
                        เสร็จสิ้น
                      </span>
                    </div>

                    <h3 className="report-title">{task.title}</h3>

                    <div className="report-meta">
                      <span className="meta-item">
                        📍 {task.village?.name || 'ไม่ระบุ'}
                      </span>
                      {task.completedAt && (
                        <span className="meta-item">
                          📅 {formatThaiDateShort(task.completedAt)}
                        </span>
                      )}
                    </div>

                    <button
                      className="btn-view-report"
                      onClick={() => navigate(`/tasks/${task.id}`)}
                    >
                      ดูรายละเอียด →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Location Info */}
        <div className="location-info">
          <h3>📍 พื้นที่รับผิดชอบ</h3>
          <p>{TAMBON_INFO.fullName}</p>
          <p>พิกัด: {TAMBON_INFO.centerLat}°N, {TAMBON_INFO.centerLng}°E</p>
          <p>จำนวนหมู่บ้าน: {TAMBON_INFO.totalVillages} หมู่บ้าน</p>
          <p>ประชากรรวม: {TAMBON_INFO.totalPopulation.toLocaleString()} คน</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
