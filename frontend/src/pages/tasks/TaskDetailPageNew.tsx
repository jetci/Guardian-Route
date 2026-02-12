import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { tasksApi } from '../../api/tasks';
import toast from 'react-hot-toast';
import { formatThaiDateShort } from '../../utils/dateFormatter';
import type { Task } from '../../types';
import { motion } from 'framer-motion';
import {
    ChevronLeft, Clock, CheckCircle2, AlertCircle, Calendar, MapPin,
    User, FileText, AlertTriangle, Navigation
} from 'lucide-react';

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
            toast.success('รับงานสำเร็จ! เริ่มสำรวจได้เลย');
            loadTask(taskId);
        } catch (error) {
            toast.error('ไม่สามารถรับงานได้');
        } finally {
            setAccepting(false);
        }
    };

    const handleStartSurvey = () => {
        if (!taskId) return;
        navigate(`/field-survey/${taskId}`);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING': return { color: '#f59e0b', bg: '#fffbeb', icon: Clock, label: 'รอดำเนินการ' };
            case 'IN_PROGRESS': return { color: '#2563eb', bg: '#eff6ff', icon: Navigation, label: 'กำลังดำเนินการ' };
            case 'COMPLETED': return { color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2, label: 'เสร็จสิ้น' };
            case 'CANCELLED': return { color: '#ef4444', bg: '#fef2f2', icon: AlertCircle, label: 'ยกเลิก' };
            default: return { color: '#64748b', bg: '#f1f5f9', icon: AlertCircle, label: status };
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner size="lg" message="กำลังโหลดข้อมูลงาน..." centered />
                </div>
            </DashboardLayout>
        );
    }

    if (!task) {
        return (
            <DashboardLayout>
                <div style={{ padding: '20px' }}>
                    <EmptyState icon="clipboard" title="ไม่พบข้อมูลงาน" description="งานนี้อาจถูกลบหรือคุณไม่มีสิทธิ์เข้าถึง" />
                    <button onClick={() => navigate('/tasks/my-tasks')} style={{ width: '100%', padding: '12px', marginTop: '20px', borderRadius: '12px', background: '#e2e8f0', border: 'none', fontWeight: '700' }}>กลับหน้ารวม</button>
                </div>
            </DashboardLayout>
        );
    }

    const statusConfig = getStatusConfig(task.status);
    const StatusIcon = statusConfig.icon;

    return (
        <DashboardLayout>
            <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '100px', fontFamily: "'Sarabun', sans-serif" }}>

                {/* --- HEADER --- */}
                <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 10 }}>
                    <button onClick={() => navigate('/tasks/my-tasks')} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronLeft size={24} color="#334155" />
                    </button>
                    <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {task.title}
                        </h1>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>#{task.id.substring(0, 8)}</div>
                    </div>
                    <div style={{ padding: '4px 12px', borderRadius: '20px', background: statusConfig.bg, color: statusConfig.color, fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <StatusIcon size={12} /> {statusConfig.label}
                    </div>
                </div>

                {/* --- CONTENT --- */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Priority Alert */}
                    {(task.priority === 'URGENT' || task.priority === 'HIGH') && (
                        <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '16px', padding: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ background: '#ef4444', padding: '8px', borderRadius: '50%', color: 'white' }}>
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#991b1b' }}>ภารกิจด่วน!</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: '#b91c1c' }}>ระดับความสำคัญ: {task.priority}</p>
                            </div>
                        </div>
                    )}

                    {/* Incident Card */}
                    {task.incident && (
                        <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <AlertCircle size={18} color="#2563eb" /> ข้อมูลเหตุการณ์
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>ประเภท:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{task.incident.disasterType}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '12px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '13px', color: '#64748b', whiteSpace: 'nowrap' }}>สถานที่:</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{task.incident.address || '-'}</span>
                                </div>
                                {task.incident.description && (
                                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                                        {task.incident.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Details Card */}
                    <div style={{ background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileText size={18} color="#2563eb" /> รายละเอียดงาน
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {task.village && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                                        <MapPin size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>หมู่บ้าน</div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>หมู่ {task.village.villageNo} {task.village.name}</div>
                                    </div>
                                </div>
                            )}

                            {task.dueDate && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>กำหนดส่ง</div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{formatThaiDateShort(task.dueDate)}</div>
                                    </div>
                                </div>
                            )}

                            {task.assignedTo && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>ผู้รับผิดชอบ</div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>{task.assignedTo.firstName} {task.assignedTo.lastName}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- BOTTOM ACTIONS --- */}
                <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', padding: '16px 20px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', zIndex: 100 }}>
                    {task.status === 'PENDING' && (
                        <button
                            onClick={handleAcceptTask}
                            disabled={accepting}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                background: '#2563eb', color: 'white', boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                                fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                            }}
                        >
                            {accepting ? <LoadingSpinner size="sm" /> : <><CheckCircle2 size={20} /> รับทราบและเริ่มงาน</>}
                        </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                        <button
                            onClick={handleStartSurvey}
                            style={{
                                width: '100%', padding: '16px', borderRadius: '16px', border: 'none',
                                background: '#10b981', color: 'white', boxShadow: '0 4px 12px rgba(16,185,129,0.3)',
                                fontWeight: '700', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                            }}
                        >
                            <Navigation size={20} /> เริ่มสำรวจพื้นที่
                        </button>
                    )}

                    {task.status === 'COMPLETED' && (
                        <div style={{ width: '100%', padding: '16px', borderRadius: '16px', background: '#ecfdf5', color: '#059669', textAlign: 'center', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <CheckCircle2 size={20} /> งานนี้เสร็จสิ้นแล้ว
                        </div>
                    )}
                </div>

            </div>
        </DashboardLayout>
    );
}
