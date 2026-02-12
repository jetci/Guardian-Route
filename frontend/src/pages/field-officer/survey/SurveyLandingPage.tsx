import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState } from '../../../components/common';
import { tasksApi } from '../../../api/tasks';
import { formatThaiDateShort } from '../../../utils/dateFormatter';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, MapPin, Calendar, ClipboardList,
    AlertCircle, CheckCircle2, Navigation, ChevronRight,
    Flame, Clock, BarChart3
} from 'lucide-react';

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
            case 'pending': return tasks.filter(t => t.status === 'PENDING');
            case 'inProgress': return tasks.filter(t => t.status === 'IN_PROGRESS');
            case 'revision': return tasks.filter(t => t.status === 'REVISION_REQUIRED');
            default: return tasks;
        }
    };

    const filteredTasks = getFilteredTasks();
    const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
    const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const revisionCount = tasks.filter(t => t.status === 'REVISION_REQUIRED').length;

    const getDisasterIcon = (type: string) => {
        const icons: Record<string, string> = {
            FLOOD: '🌊', LANDSLIDE: '⛰️', FIRE: '🔥', WILDFIRE: '🔥',
            STORM: '🌪️', EARTHQUAKE: '🏚️', DROUGHT: '☀️', OTHER: '📋',
        };
        return icons[type] || '📋';
    };

    const getDisasterLabel = (type: string) => {
        const labels: Record<string, string> = {
            FLOOD: 'น้ำท่วม', LANDSLIDE: 'ดินถล่ม', FIRE: 'ไฟไหม้',
            WILDFIRE: 'ไฟป่า', STORM: 'พายุ', EARTHQUAKE: 'แผ่นดินไหว',
            DROUGHT: 'ภัยแล้ง', OTHER: 'อื่นๆ',
        };
        return labels[type] || type;
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING': return { color: '#f59e0b', bg: '#fffbeb', icon: Clock, label: 'รอดำเนินการ' };
            case 'IN_PROGRESS': return { color: '#2563eb', bg: '#eff6ff', icon: Navigation, label: 'กำลังดำเนินการ' };
            case 'REVISION_REQUIRED': return { color: '#ef4444', bg: '#fef2f2', icon: AlertCircle, label: 'ต้องแก้ไข' };
            default: return { color: '#64748b', bg: '#f1f5f9', icon: ClipboardList, label: status };
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner size="lg" message="กำลังโหลดข้อมูล..." centered />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div style={{ minHeight: '100vh', background: '#f8fafc', paddingBottom: '90px', fontFamily: "'Sarabun', sans-serif" }}>

                {/* --- HEADER --- */}
                <div style={{
                    background: 'white',
                    padding: '24px 24px 32px',
                    borderBottomLeftRadius: '32px',
                    borderBottomRightRadius: '32px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                        <div>
                            <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                                พื้นที่สำรวจ <span style={{ fontSize: '28px' }}>🔍</span>
                            </h1>
                            <p style={{ fontSize: '14px', color: '#64748b', marginTop: '6px' }}>เลือกภารกิจเพื่อเริ่มเก็บข้อมูล</p>
                        </div>
                        <button
                            onClick={fetchTasks}
                            style={{
                                background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                color: '#64748b'
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
                        </button>
                    </div>

                    {/* Stats Grid - ActionOS Style */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div style={{ background: '#fffbeb', borderRadius: '16px', padding: '16px 12px', textAlign: 'center', border: '1px solid #fef3c7' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#d97706', marginBottom: '4px' }}>{pendingCount}</div>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#b45309' }}>รอดำเนินการ</div>
                        </div>
                        <div style={{ background: '#eff6ff', borderRadius: '16px', padding: '16px 12px', textAlign: 'center', border: '1px solid #dbeafe' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563eb', marginBottom: '4px' }}>{inProgressCount}</div>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#1d4ed8' }}>กำลังทำ</div>
                        </div>
                        <div style={{ background: '#fef2f2', borderRadius: '16px', padding: '16px 12px', textAlign: 'center', border: '1px solid #fee2e2' }}>
                            <div style={{ fontSize: '24px', fontWeight: '800', color: '#ef4444', marginBottom: '4px' }}>{revisionCount}</div>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#b91c1c' }}>แก้ไข</div>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ padding: '0 20px', marginTop: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                        {[
                            { key: 'all', label: 'ทั้งหมด', count: tasks.length },
                            { key: 'pending', label: 'รอทำ', count: pendingCount },
                            { key: 'inProgress', label: 'กำลังทำ', count: inProgressCount },
                            { key: 'revision', label: 'แก้', count: revisionCount }
                        ].map((tab) => {
                            const isActive = filter === tab.key;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setFilter(tab.key as any)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '100px', border: 'none',
                                        background: isActive ? '#1e293b' : 'white',
                                        color: isActive ? 'white' : '#64748b',
                                        boxShadow: isActive ? '0 4px 12px rgba(30, 41, 59, 0.3)' : '0 2px 4px rgba(0,0,0,0.05)',
                                        fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    {tab.label}
                                    <span style={{
                                        background: isActive ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                                        padding: '0 6px', borderRadius: '10px', fontSize: '10px',
                                        minWidth: '18px', textAlign: 'center'
                                    }}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tasks List */}
                <div style={{ padding: '20px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={filter}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {filteredTasks.length === 0 ? (
                                <div style={{ marginTop: '40px' }}>
                                    <EmptyState
                                        icon="clipboard"
                                        title="ไม่มีงานในรายการ"
                                        description="เยี่ยมมาก! คุณไม่มีงานที่ต้องจัดการในขณะนี้"
                                    />
                                </div>
                            ) : (
                                filteredTasks.map(task => {
                                    const theme = getStatusConfig(task.status);
                                    return (
                                        <div
                                            key={task.id}
                                            onClick={() => handleSelectTask(task.id)}
                                            style={{
                                                background: 'white',
                                                borderRadius: '24px',
                                                marginBottom: '16px',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                                                border: '1px solid #f1f5f9',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                position: 'relative'
                                            }}
                                        >
                                            {/* Header Strip */}
                                            <div style={{
                                                background: `linear-gradient(to right, ${theme.bg}, white)`,
                                                padding: '16px 20px',
                                                borderBottom: '1px solid #f1f5f9',
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <theme.icon size={16} color={theme.color} />
                                                    <span style={{ fontSize: '13px', fontWeight: '800', color: theme.color }}>{theme.label}</span>
                                                </div>
                                                <span style={{ fontSize: '12px', fontWeight: '500', color: '#94a3b8' }}>
                                                    {formatThaiDateShort(task.createdAt)}
                                                </span>
                                            </div>

                                            <div style={{ padding: '20px' }}>
                                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '12px', lineHeight: 1.4 }}>
                                                    {task.title}
                                                </h3>

                                                {task.description && (
                                                    <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                        {task.description}
                                                    </p>
                                                )}

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '24px', height: '24px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <MapPin size={14} color="#64748b" />
                                                        </div>
                                                        <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                                                            {task.village?.name || 'ไม่ระบุพื้นที่'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '24px', height: '24px', background: '#fff7ed', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <span style={{ fontSize: '14px' }}>{getDisasterIcon(task.incident?.disasterType)}</span>
                                                        </div>
                                                        <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                                                            {getDisasterLabel(task.incident?.disasterType)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {task.status === 'REVISION_REQUIRED' && task.supervisorComment && (
                                                    <div style={{ background: '#fef2f2', border: '1px dashed #fecaca', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
                                                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#b91c1c', marginBottom: '4px' }}>💬 ข้อเสนอแนะ:</div>
                                                        <p style={{ fontSize: '13px', color: '#7f1d1d', margin: 0 }}>{task.supervisorComment}</p>
                                                    </div>
                                                )}

                                                <button style={{
                                                    width: '100%', padding: '14px', borderRadius: '14px',
                                                    border: 'none',
                                                    background: task.status === 'REVISION_REQUIRED' ? '#ef4444' : '#2563eb',
                                                    color: 'white', fontWeight: '700', fontSize: '14px',
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                    boxShadow: task.status === 'REVISION_REQUIRED' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : '0 4px 12px rgba(37, 99, 235, 0.3)'
                                                }}>
                                                    {task.status === 'REVISION_REQUIRED' ? 'แก้ไขงานนี้' : (task.status === 'IN_PROGRESS' ? 'ดำเนินการต่อ' : 'เริ่มสำรวจ')}
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
}
