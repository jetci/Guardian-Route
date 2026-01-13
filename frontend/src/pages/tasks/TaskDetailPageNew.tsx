import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { tasksApi } from '../../api/tasks';
import toast from 'react-hot-toast';
import { formatThaiDateShort } from '../../utils/dateFormatter';
import type { Task } from '../../types';
import './TaskDetailPageNew.css';

export function TaskDetailPageNew() {
    const { id: taskId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        if (taskId) {
            loadTask(taskId);
        }
    }, [taskId]);

    const loadTask = async (id: string) => {
        try {
            setLoading(true);
            const taskData = await tasksApi.getById(id);
            setTask(taskData);
        } catch (error) {
            console.error('Failed to load task:', error);
            toast.error('ไม่สามารถโหลดข้อมูลงานได้');
            navigate('/tasks/my-tasks');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptTask = async () => {
        if (!taskId) return;

        try {
            setAccepting(true);
            await tasksApi.acceptTask(taskId);
            toast.success('รับงานสำเร็จ! คุณสามารถเริ่มสำรวจได้แล้ว');
            // Reload task to update status
            loadTask(taskId);
        } catch (error) {
            console.error('Failed to accept task:', error);
            toast.error('ไม่สามารถรับงานได้');
        } finally {
            setAccepting(false);
        }
    };

    const handleStartSurvey = () => {
        if (!taskId) return;
        // Navigate to Survey Area Page with taskId
        navigate(`/survey-area/${taskId}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'gray';
            case 'IN_PROGRESS': return 'orange';
            case 'COMPLETED': return 'green';
            case 'CANCELLED': return 'red';
            default: return 'gray';
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            'PENDING': 'รอดำเนินการ',
            'IN_PROGRESS': 'กำลังดำเนินการ',
            'COMPLETED': 'เสร็จสิ้น',
            'CANCELLED': 'ยกเลิก'
        };
        return labels[status] || status;
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'red';
            case 'HIGH': return 'red';
            case 'MEDIUM': return 'orange';
            case 'LOW': return 'green';
            default: return 'gray';
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="task-detail-page">
                    <LoadingSpinner size="lg" message="กำลังโหลดข้อมูลงาน..." centered />
                </div>
            </DashboardLayout>
        );
    }

    if (!task) {
        return (
            <DashboardLayout>
                <div className="task-detail-page">
                    <EmptyState
                        icon="clipboard"
                        title="ไม่พบข้อมูลงาน"
                        description="งานนี้อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง"
                    />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="task-detail-page">
                {/* Back Button */}
                <button
                    className="btn-back"
                    onClick={() => navigate('/tasks/my-tasks')}
                >
                    ← กลับไปยังงานของฉัน
                </button>

                {/* Task Header */}
                <div className="task-detail-header">
                    <div className="header-left">
                        <h1 className="task-title">{task.title}</h1>
                        <p className="task-id">รหัสงาน: {task.id.substring(0, 8)}</p>
                    </div>
                    <div className="header-right">
                        <span className={`status-badge ${getStatusColor(task.status)}`}>
                            {getStatusLabel(task.status)}
                        </span>
                        <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                        </span>
                    </div>
                </div>

                {/* Task Content */}
                <div className="task-detail-content">
                    {/* Task Description */}
                    {task.description && (
                        <div className="detail-section">
                            <h3> คำอธิบายงาน</h3>
                            <p>{task.description}</p>
                        </div>
                    )}

                    {/* Incident Information */}
                    {task.incident && (
                        <div className="detail-section">
                            <h3>📋 รายละเอียดเหตุการณ์</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <span className="info-label">ประเภทภัย:</span>
                                    <span className="info-value">{task.incident.disasterType}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">ระดับความสำคัญ:</span>
                                    <span className="info-value badge">{task.incident.priority}</span>
                                </div>
                                {task.incident.address && (
                                    <div className="info-item">
                                        <span className="info-label">ที่อยู่:</span>
                                        <span className="info-value">{task.incident.address}</span>
                                    </div>
                                )}
                                {task.incident.description && (
                                    <div className="info-item full-width">
                                        <span className="info-label">รายละเอียด:</span>
                                        <p className="info-value">{task.incident.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Village Information */}
                    {task.village && (
                        <div className="detail-section">
                            <h3>📍 หมู่บ้าน</h3>
                            <p>หมู่ {task.village.villageNo} - {task.village.name}</p>
                        </div>
                    )}

                    {/* Due Date */}
                    {task.dueDate && (
                        <div className="detail-section">
                            <h3>📅 กำหนดเสร็จ</h3>
                            <p>{formatThaiDateShort(task.dueDate)}</p>
                        </div>
                    )}

                    {/* Assigned To */}
                    {task.assignedTo && (
                        <div className="detail-section">
                            <h3>👤 ผู้รับผิดชอบ</h3>
                            <p>{task.assignedTo.firstName} {task.assignedTo.lastName}</p>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="task-actions">
                    {task.status === 'PENDING' && (
                        <button
                            className="btn-primary btn-lg"
                            onClick={handleAcceptTask}
                            disabled={accepting}
                        >
                            {accepting ? '🔄 กำลังรับงาน...' : '✅ รับทราบและเริ่มสำรวจ'}
                        </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                        <button
                            className="btn-success btn-lg"
                            onClick={handleStartSurvey}
                        >
                            🔍 เริ่มสำรวจพื้นที่
                        </button>
                    )}

                    {task.status === 'COMPLETED' && (
                        <div className="alert alert-success">
                            ✅ งานนี้เสร็จสิ้นแล้ว
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
