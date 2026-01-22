import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState } from '../../../components/common';
import { tasksApi } from '../../../api/tasks';
import { formatThaiDateShort } from '../../../utils/dateFormatter';
import toast from 'react-hot-toast';
import './SurveyLandingPage.css';

export default function SurveyLandingPage() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'inProgress' | 'revision'>('all');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const myTasks = await tasksApi.getMyTasks();
            // Filter for tasks that need survey
            const activeTasks = myTasks.filter((t: any) =>
                t.status === 'PENDING' ||
                t.status === 'IN_PROGRESS' ||
                t.status === 'REVISION_REQUIRED'
            );
            setTasks(activeTasks);
            toast.success('โหลดข้อมูลสำเร็จ');
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            toast.error('ไม่สามารถโหลดข้อมูลงานได้');
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTask = (taskId: string) => {
        navigate(`/survey-area/${taskId}`);
    };

    const getFilteredTasks = () => {
        switch (filter) {
            case 'pending':
                return tasks.filter(t => t.status === 'PENDING');
            case 'inProgress':
                return tasks.filter(t => t.status === 'IN_PROGRESS');
            case 'revision':
                return tasks.filter(t => t.status === 'REVISION_REQUIRED');
            default:
                return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();
    const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
    const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const revisionCount = tasks.filter(t => t.status === 'REVISION_REQUIRED').length;

    const getDisasterIcon = (type: string) => {
        const icons: Record<string, string> = {
            FLOOD: '🌊',
            LANDSLIDE: '⛰️',
            FIRE: '🔥',
            WILDFIRE: '🔥',
            STORM: '🌪️',
            EARTHQUAKE: '🏚️',
            DROUGHT: '☀️',
            OTHER: '📋',
        };
        return icons[type] || '📋';
    };

    const getDisasterLabel = (type: string) => {
        const labels: Record<string, string> = {
            FLOOD: 'น้ำท่วม',
            LANDSLIDE: 'ดินถล่ม',
            FIRE: 'ไฟไหม้',
            WILDFIRE: 'ไฟป่า',
            STORM: 'พายุ',
            EARTHQUAKE: 'แผ่นดินไหว',
            DROUGHT: 'ภัยแล้ง',
            OTHER: 'อื่นๆ',
        };
        return labels[type] || type;
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="survey-landing-page">
                    <LoadingSpinner size="lg" message="กำลังโหลดข้อมูล..." centered />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="survey-landing-page">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <h1>🔍 เลือกงานสำรวจ</h1>
                        <p className="subtitle">กรุณาเลือกงานที่ได้รับมอบหมายเพื่อเริ่มการสำรวจ</p>
                    </div>
                    <button className="btn-refresh" onClick={fetchTasks}>
                        🔄 รีเฟรช
                    </button>
                </div>

                {/* Stats Summary */}
                <div className="stats-grid">
                    <div className="stat-card gray">
                        <div className="stat-icon">📋</div>
                        <div className="stat-content">
                            <h3>{tasks.length}</h3>
                            <p>งานทั้งหมด</p>
                        </div>
                    </div>
                    <div className="stat-card yellow">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-content">
                            <h3>{pendingCount}</h3>
                            <p>รอดำเนินการ</p>
                        </div>
                    </div>
                    <div className="stat-card blue">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-content">
                            <h3>{inProgressCount}</h3>
                            <p>กำลังดำเนินการ</p>
                        </div>
                    </div>
                    <div className="stat-card orange">
                        <div className="stat-icon">⚠️</div>
                        <div className="stat-content">
                            <h3>{revisionCount}</h3>
                            <p>ต้องแก้ไข</p>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        <span className="tab-label">ทั้งหมด</span>
                        <span className="tab-count">{tasks.length}</span>
                    </button>
                    <button
                        className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        <span className="tab-label">รอดำเนินการ</span>
                        <span className="tab-count">{pendingCount}</span>
                    </button>
                    <button
                        className={`filter-tab ${filter === 'inProgress' ? 'active' : ''}`}
                        onClick={() => setFilter('inProgress')}
                    >
                        <span className="tab-label">กำลังดำเนินการ</span>
                        <span className="tab-count">{inProgressCount}</span>
                    </button>
                    <button
                        className={`filter-tab ${filter === 'revision' ? 'active' : ''}`}
                        onClick={() => setFilter('revision')}
                    >
                        <span className="tab-label">ต้องแก้ไข</span>
                        <span className="tab-count">{revisionCount}</span>
                    </button>
                </div>

                {/* Tasks Grid */}
                {filteredTasks.length === 0 ? (
                    <EmptyState
                        icon="clipboard"
                        title="ไม่มีงานที่ต้องสำรวจ"
                        description="คุณไม่มีงานที่ได้รับมอบหมายในขณะนี้"
                    />
                ) : (
                    <div className="tasks-grid">
                        {filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className="survey-task-card"
                                onClick={() => handleSelectTask(task.id)}
                            >
                                <div className="task-header">
                                    <span className={`status-badge ${task.status === 'REVISION_REQUIRED' ? 'orange' :
                                            task.status === 'IN_PROGRESS' ? 'blue' : 'gray'
                                        }`}>
                                        {task.status === 'REVISION_REQUIRED' ? '⚠️ ต้องแก้ไข' :
                                            task.status === 'IN_PROGRESS' ? '🔄 กำลังดำเนินการ' : '⏳ รอดำเนินการ'}
                                    </span>
                                    <span className="task-date">
                                        {formatThaiDateShort(task.createdAt)}
                                    </span>
                                </div>

                                <h3 className="task-title">{task.title}</h3>

                                {task.description && (
                                    <p className="task-description">{task.description}</p>
                                )}

                                <div className="task-info">
                                    <div className="info-item">
                                        <span className="info-icon">📍</span>
                                        <span className="info-text">{task.village?.name || 'ไม่ระบุหมู่บ้าน'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-icon">{getDisasterIcon(task.incident?.disasterType)}</span>
                                        <span className="info-text">{getDisasterLabel(task.incident?.disasterType)}</span>
                                    </div>
                                </div>

                                {task.status === 'REVISION_REQUIRED' && task.supervisorComment && (
                                    <div className="revision-note">
                                        <strong>💬 ข้อเสนอแนะ:</strong>
                                        <p>{task.supervisorComment}</p>
                                    </div>
                                )}

                                <div className="task-action">
                                    <button className="btn-start-survey">
                                        {task.status === 'REVISION_REQUIRED' ? '✏️ แก้ไขงาน' :
                                            task.status === 'IN_PROGRESS' ? '📝 ดำเนินการต่อ' : '🚀 เริ่มสำรวจ'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
