/**
 * Supervisor Dashboard Premium - Ultra-Modern Command Center
 * Optimized for Visual Excellence, Spacing, and Component Robustness
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Search,
    RefreshCw,
    Bell,
    Activity,
    Plus,
    MapPin,
    Calendar,
    Zap,
    ChevronDown
} from 'lucide-react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { incidentsApi } from '../../api/incidents';
import { tasksApi } from '../../api/tasks';
import { villagesApi } from '../../api/villages';
import { BroadcastModal } from '../../components/notifications/BroadcastModal';
import IncidentDetailsModal from '../../components/incidents/IncidentDetailsModal';
import { AssignIncidentModal } from '../../components/supervisor/AssignIncidentModal';
import { ReviewIncidentModal } from '../../components/supervisor/ReviewIncidentModal';
import type { Incident, Village } from '../../types';
import toast from 'react-hot-toast';

interface DashboardStats {
    totalIncidents: number;
    pendingIncidents: number;
    inProgressIncidents: number;
    totalTasks: number;
}

// PREMIUM SUB-COMPONENTS
// PREMIUM SUB-COMPONENTS
const PremiumIncidentCard = ({ incident, onViewDetails, onAssign, onClose }: any) => {
    // Standardized Configs using Inline Styles
    const priorityConfig: any = {
        'CRITICAL': { label: 'วิกฤต', color: '#f43f5e', bg: '#fff1f2', text: '#9f1239' },
        'HIGH': { label: 'สูง', color: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
        'MEDIUM': { label: 'ปกติ', color: '#3b82f6', bg: '#eff6ff', text: '#1e40af' },
        'LOW': { label: 'ต่ำ', color: '#10b981', bg: '#f0fdf4', text: '#166534' },
    };

    const statusConfig: any = {
        'PENDING': { label: 'รอมอบหมาย', color: '#d97706', dot: '#f59e0b', bg: '#fffbeb' },
        'IN_PROGRESS': { label: 'ดำเนินการอยู่', color: '#2563eb', dot: '#3b82f6', bg: '#eff6ff' },
        'RESOLVED': { label: 'รอตรวจสอบ', color: '#059669', dot: '#10b981', bg: '#f0fdf4' },
        'CLOSED': { label: 'เสร็จสิ้น', color: '#64748b', dot: '#94a3b8', bg: '#f8fafc' },
    };

    const p = priorityConfig[incident.priority] || priorityConfig.LOW;
    const s = statusConfig[incident.status] || statusConfig.PENDING;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
            style={{
                background: 'white',
                borderRadius: '24px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                position: 'relative'
            }}
        >
            {/* Visual Priority Accent */}
            <div style={{ height: '6px', width: '100%', background: p.color }} />

            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '100px',
                        background: s.bg,
                        flexShrink: 0
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: s.dot,
                            boxShadow: `0 0 10px ${s.dot}40`
                        }} />
                        <span style={{ fontSize: '11px', fontWeight: '800', color: s.color, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                            {s.label}
                        </span>
                    </div>

                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            background: p.bg,
                            color: p.text,
                            letterSpacing: '0.05em'
                        }}>
                            {p.label}
                        </span>
                    </div>
                </div>

                {/* Title Section */}
                <h3
                    onClick={onViewDetails}
                    style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        color: '#1e293b',
                        marginBottom: '16px',
                        lineHeight: '1.4',
                        cursor: 'pointer',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '50px', // Consistent height for grid alignment
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
                    onMouseOut={(e) => e.currentTarget.style.color = '#1e293b'}
                >
                    {incident.title}
                </h3>

                {/* Info Pulse */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <MapPin size={14} color="#94a3b8" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{incident.village?.name || 'ไม่ระบุพื้นที่'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#64748b' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Calendar size={14} color="#94a3b8" />
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: '700' }}>{new Date(incident.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                    </div>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', gap: '10px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
                    <button
                        onClick={onViewDetails}
                        style={{
                            flex: 1,
                            padding: '12px',
                            background: '#f8fafc',
                            color: '#475569',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textTransform: 'uppercase'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#f1f5f9'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#f8fafc'}
                    >
                        รายละเอียด
                    </button>
                    {incident.status === 'PENDING' ? (
                        <button
                            onClick={onAssign}
                            style={{
                                flex: 1.2,
                                padding: '12px',
                                background: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#1d4ed8'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#2563eb'}
                        >
                            <Zap size={14} /> มอบหมาย
                        </button>
                    ) : (incident.status === 'IN_PROGRESS' || incident.status === 'RESOLVED') ? (
                        <button
                            onClick={onClose}
                            style={{
                                flex: 1.2,
                                padding: '12px',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                textTransform: 'uppercase',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                            onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                        >
                            ตรวจสอบ/ปิด
                        </button>
                    ) : null}
                </div>
            </div>
        </motion.div>
    );
};

const SupervisorDashboardPremium = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'ongoing' | 'resolved'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVillage, setFilterVillage] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [villages, setVillages] = useState<Village[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalIncidents: 0,
        pendingIncidents: 0,
        inProgressIncidents: 0,
        totalTasks: 0,
    });

    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, [refreshKey]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const results = await Promise.allSettled([
                incidentsApi.getAll(),
                tasksApi.getStatistics(),
                villagesApi.getAll(),
            ]);

            if (results[0].status === 'fulfilled') {
                const incidentsData = results[0].value;
                setIncidents(incidentsData);
                setStats(prev => ({
                    ...prev,
                    totalIncidents: incidentsData.length,
                    pendingIncidents: incidentsData.filter((i: Incident) => i.status === 'PENDING').length,
                    inProgressIncidents: incidentsData.filter((i: Incident) => i.status === 'IN_PROGRESS').length,
                }));
            }

            if (results[1].status === 'fulfilled') {
                const taskStats = results[1].value;
                setStats(prev => ({
                    ...prev,
                    totalTasks: (taskStats.byStatus?.IN_PROGRESS || 0) + (taskStats.byStatus?.PENDING || 0),
                }));
            }

            if (results[2].status === 'fulfilled') {
                setVillages(results[2].value);
            }
        } catch (error) {
            toast.error('ไม่สามารถโหลดข้อมูลได้');
        } finally {
            setLoading(false);
        }
    };

    const filteredIncidents = incidents.filter(incident => {
        if (activeTab === 'pending' && incident.status !== 'PENDING') return false;
        if (activeTab === 'ongoing' && incident.status !== 'IN_PROGRESS') return false;
        if (activeTab === 'resolved' && !['RESOLVED', 'CLOSED'].includes(incident.status)) return false;
        if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterVillage !== 'all' && incident.villageId !== filterVillage) return false;
        if (filterPriority !== 'all' && incident.priority !== filterPriority) return false;
        return true;
    });

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'สวัสดีตอนเช้า';
        if (hour < 17) return 'สวัสดีตอนบ่าย';
        return 'สวัสดีตอนเย็น';
    };

    return (
        <DashboardLayout>
            <div className="w-full max-w-[1400px] mx-auto min-h-screen font-sarabun flex flex-col pt-4">

                {/* --- STANDARDIZED COMPACT PREMIUM HEADER --- */}
                <div style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
                    padding: window.innerWidth < 768 ? '24px 20px' : '32px 48px',
                    borderRadius: '20px',
                    marginBottom: '24px',
                    boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
                    color: 'white',
                    position: 'relative',
                    overflow: 'visible',
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: window.innerWidth < 1200 ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: window.innerWidth < 1200 ? 'flex-start' : 'flex-end',
                        gap: '24px'
                    }}>
                        <div style={{ flex: 1, minWidth: '0', width: '100%' }}>
                            {/* Branding Identity - Compact */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{
                                    padding: '10px',
                                    background: 'rgba(255,255,255,0.15)',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.2)'
                                }}>
                                    <Activity size={20} color="white" />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '0.2em', textTransform: 'uppercase', lineHeight: 1 }}>Guardian Route</div>
                                    <div style={{ height: '1.5px', width: '30px', background: '#34d399', margin: '4px 0', borderRadius: '1px' }} />
                                    <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>V6 • COMMAND CENTER PREMIUM</div>
                                </div>
                            </div>

                            {/* Core Typography - Scaled Down */}
                            <div style={{ marginBottom: '4px' }}>
                                <span style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(255,255,255,0.7)' }}>{getGreeting()},</span>
                            </div>
                            <h1 style={{
                                fontSize: window.innerWidth < 768 ? '32px' : '48px',
                                fontWeight: '900',
                                letterSpacing: '-0.01em',
                                margin: 0,
                                lineHeight: 1.1
                            }}>
                                ศูนย์บัญชาการ
                            </h1>

                            {/* Shortened Description */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '16px' }}>
                                <div style={{ width: '3px', height: '32px', background: '#34d399', borderRadius: '2px' }} />
                                <p style={{ fontSize: window.innerWidth < 768 ? '15px' : '18px', fontWeight: '500', color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.4 }}>
                                    ติดตามสถานการณ์และตอบโต้เหตุ <span style={{ color: '#34d399', fontWeight: '800' }}>แบบเรียลไทม์</span>
                                </p>
                            </div>
                        </div>

                        {/* Executive Control Group - Mobile Friendly */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                            <button
                                onClick={() => setShowBroadcastModal(true)}
                                style={{
                                    flex: window.innerWidth < 768 ? 1 : 'none',
                                    padding: '10px 16px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                <Bell size={16} /> Broadcast
                            </button>
                            <button
                                onClick={() => setRefreshKey(k => k + 1)}
                                style={{
                                    padding: '10px',
                                    background: 'rgba(255,255,255,0.1)',
                                    color: 'white',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '12px',
                                    cursor: 'pointer'
                                }}
                            >
                                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                            </button>
                            <button
                                onClick={() => navigate('/manage-incidents')}
                                style={{
                                    width: window.innerWidth < 768 ? '100%' : 'auto',
                                    padding: '12px 24px',
                                    background: 'white',
                                    color: '#2563EB',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            >
                                <Plus size={18} /> สร้างเหตุการณ์
                            </button>
                        </div>
                    </div>

                    {/* Integrated Metrics - Grid Adjusted */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 480 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: window.innerWidth < 768 ? '16px' : '24px',
                        marginTop: '24px',
                        paddingTop: '24px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {[
                            { label: 'Total', value: stats.totalIncidents, icon: BarChart3, color: 'white' },
                            { label: 'Waiting', value: stats.pendingIncidents, icon: AlertTriangle, color: '#fbbf24' },
                            { label: 'Ongoing', value: stats.inProgressIncidents, icon: Clock, color: '#fb923c' },
                            { label: 'Tasks', value: stats.totalTasks, icon: CheckCircle2, color: '#34d399' },
                        ].map((kpi, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <kpi.icon size={12} style={{ opacity: 0.5 }} />
                                    <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}>
                                        {kpi.label}
                                    </span>
                                </div>
                                <div style={{ fontSize: window.innerWidth < 768 ? '24px' : '32px', fontWeight: '900', color: kpi.color, lineHeight: 1 }}>
                                    {kpi.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- MAIN CONTENT AREA - Spaced for Excellence --- */}
                <main style={{
                    flex: 1,
                    width: '100%',
                    padding: window.innerWidth < 768 ? '0 20px 80px' : '0 48px 120px',
                    boxSizing: 'border-box'
                }}>

                    {/* --- STANDARDIZED COMMAND ACTION BAR --- */}
                    <div style={{
                        background: 'white',
                        padding: window.innerWidth < 768 ? '16px' : '24px',
                        borderRadius: '20px',
                        marginBottom: '24px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                        border: '1px solid #f1f5f9',
                        display: 'flex',
                        flexDirection: window.innerWidth < 1200 ? 'column' : 'row',
                        alignItems: 'center',
                        gap: '16px'
                    }}>
                        {/* Search Interface */}
                        <div style={{ position: 'relative', flex: 1, width: '100%' }}>
                            <Search
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '18px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8'
                                }}
                            />
                            <input
                                type="text"
                                placeholder="ค้นหาชื่อเหตุการณ์, สถานที่..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '14px 14px 14px 50px',
                                    background: '#f8fafc',
                                    border: '2px solid #f1f5f9',
                                    borderRadius: '14px',
                                    fontSize: '15px',
                                    fontWeight: '600',
                                    color: '#334155',
                                    outline: 'none',
                                    transition: 'all 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#f1f5f9'}
                            />
                        </div>

                        {/* Filter Interface */}
                        <div style={{
                            display: 'flex',
                            gap: '12px',
                            width: window.innerWidth < 1200 ? '100%' : 'auto',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                                <select
                                    value={filterVillage}
                                    onChange={(e) => setFilterVillage(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 40px 14px 18px',
                                        background: '#f8fafc',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: '14px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: '#64748b',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">📍 ทุกพื้นที่</option>
                                    {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                            </div>

                            <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                                <select
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '14px 40px 14px 18px',
                                        background: '#f8fafc',
                                        border: '2px solid #f1f5f9',
                                        borderRadius: '14px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        color: '#64748b',
                                        appearance: 'none',
                                        cursor: 'pointer',
                                        outline: 'none'
                                    }}
                                >
                                    <option value="all">⚡ ทุกความสำคัญ</option>
                                    <option value="CRITICAL">⚡ วิกฤต</option>
                                    <option value="HIGH">🔴 สูง</option>
                                    <option value="MEDIUM">🔵 ปกติ</option>
                                    <option value="LOW">🟢 ต่ำ</option>
                                </select>
                                <ChevronDown size={14} style={{ position: 'absolute', right: '18px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                            </div>
                        </div>
                    </div>

                    {/* --- STANDARDIZED NAVIGATION TABS --- */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: '#f1f5f9',
                        padding: '6px',
                        borderRadius: '16px',
                        marginBottom: '32px',
                        width: 'fit-content',
                        maxWidth: '100%',
                        overflowX: 'auto'
                    }}>
                        {[
                            { id: 'all', label: 'ทั้งหมด' },
                            { id: 'pending', label: 'รอมอบหมาย' },
                            { id: 'ongoing', label: 'กำลังคืบหน้า' },
                            { id: 'resolved', label: 'รอตรวจรับ' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    padding: '10px 24px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    whiteSpace: 'nowrap',
                                    background: activeTab === tab.id ? 'white' : 'transparent',
                                    color: activeTab === tab.id ? '#2563eb' : '#94a3b8',
                                    boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* --- PART 3: INFORMATION PULSE (SECTOR INSIGHTS) --- */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '16px',
                        marginBottom: '40px'
                    }}>
                        {/* Regional Hotspot Indicator */}
                        <div style={{
                            background: '#f8fafc',
                            padding: '20px 24px',
                            borderRadius: '24px',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '18px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)'
                            }}>
                                <MapPin size={24} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                    ประเมินสถานการณ์พื้นที่
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#1e293b' }}>
                                    {villages.length} พื้นที่รับผิดชอบ
                                </div>
                            </div>
                        </div>

                        {/* Tactical Alert Feed (Mocked Context) */}
                        <div style={{
                            background: '#fef2f2',
                            padding: '20px 24px',
                            borderRadius: '24px',
                            border: '1px solid #fee2e2',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '18px',
                                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)'
                            }}>
                                <AlertTriangle size={24} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#ef4444', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                    ระดับความเร่งด่วน
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#991b1b' }}>
                                    {incidents.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length} เหตุการณ์วิกฤต/สูง
                                </div>
                            </div>
                        </div>

                        {/* Completion Pulse */}
                        <div style={{
                            background: '#f0fdf4',
                            padding: '20px 24px',
                            borderRadius: '24px',
                            border: '1px solid #dcfce7',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '18px',
                                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 16px rgba(34, 197, 94, 0.2)'
                            }}>
                                <CheckCircle2 size={24} color="white" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.1em', marginBottom: '4px' }}>
                                    ประสิทธิผลการปฏิบัติงาน
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: '900', color: '#166534' }}>
                                    {incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length} ภารกิจสำเร็จ
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 min-w-0">
                            <AnimatePresence mode="popLayout">
                                {filteredIncidents.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        style={{
                                            gridColumn: '1 / -1',
                                            padding: '80px 20px',
                                            textAlign: 'center',
                                            background: 'white',
                                            borderRadius: '32px',
                                            border: '2px dashed #f1f5f9'
                                        }}
                                    >
                                        <Search style={{ margin: '0 auto 16px', color: '#f1f5f9' }} size={48} />
                                        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#94a3b8' }}>ไม่พบข้อมูลที่ค้นหา</h3>
                                    </motion.div>
                                ) : (
                                    filteredIncidents.map((incident) => (
                                        <PremiumIncidentCard
                                            key={incident.id}
                                            incident={incident}
                                            onViewDetails={() => setSelectedIncidentId(incident.id)}
                                            onAssign={() => {
                                                setSelectedIncident(incident);
                                                setAssignModalOpen(true);
                                            }}
                                            onClose={() => {
                                                setSelectedIncident(incident);
                                                setReviewModalOpen(true);
                                            }}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </main>

                {/* --- MODALS --- */}
                <BroadcastModal isOpen={showBroadcastModal} onClose={() => setShowBroadcastModal(false)} />

                {
                    selectedIncidentId && (
                        <IncidentDetailsModal
                            incidentId={selectedIncidentId}
                            isOpen={!!selectedIncidentId}
                            onClose={() => setSelectedIncidentId(null)}
                            onUpdate={loadDashboardData}
                        />
                    )
                }

                {
                    assignModalOpen && selectedIncident && (
                        <AssignIncidentModal
                            isOpen={assignModalOpen}
                            onClose={() => setAssignModalOpen(false)}
                            incident={selectedIncident}
                            onSuccess={loadDashboardData}
                        />
                    )
                }

                {
                    reviewModalOpen && selectedIncident && (
                        <ReviewIncidentModal
                            isOpen={reviewModalOpen}
                            onClose={() => setReviewModalOpen(false)}
                            incident={selectedIncident}
                            onSuccess={loadDashboardData}
                        />
                    )
                }

            </div>
        </DashboardLayout>
    );
};

export default SupervisorDashboardPremium;
