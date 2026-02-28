import { useState, Suspense, lazy } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Clock,
    Users,
    CheckCircle,
    AlertTriangle,
    Map,
    BarChart3,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Download,
    Calendar,
    ChevronRight
} from 'lucide-react';

// Lazy load HeatmapVisualization to avoid blocking initial render
const HeatmapVisualization = lazy(() => import('../../components/HeatmapVisualization'));

export default function ExecutiveDashboard() {
    const [showMap, setShowMap] = useState(false);

    // Mock data with comparisons
    const kpiData = {
        monthlyIncidents: 24,
        monthlyChange: '5%',
        monthlyChangePositive: false, // More incidents is negative
        avgResponseTime: '2.5 ชม.',
        responseTimeChange: '0.3 ชม.',
        responseTimePositive: true, // Faster is positive
        activeOfficers: 12,
        totalOfficers: 15,
        officerUtilization: '80%',
        utilizationPositive: true,
        completionRate: '85%',
        completionChange: '3%',
        completionPositive: true
    };

    const incidentsByType = [
        { type: 'น้ำท่วม', count: 8, percentage: 33, color: '#3b82f6' },
        { type: 'ดินถล่ม', count: 6, percentage: 25, color: '#d97706' },
        { type: 'ไฟไหม้ป่า', count: 5, percentage: 21, color: '#ef4444' },
        { type: 'แผ่นดินไหว', count: 3, percentage: 13, color: '#f97316' },
        { type: 'อื่นๆ', count: 2, percentage: 8, color: '#94a3b8' }
    ];

    const villageStats = [
        { village: 'หมู่ 3 - บ้านหนองบัว', incidents: 5, status: 'HIGH' },
        { village: 'หมู่ 5 - ดินถล่ม', incidents: 4, status: 'HIGH' },
        { village: 'หมู่ 8 - เขาใหญ่', incidents: 3, status: 'MEDIUM' },
        { village: 'หมู่ 12 - ตำบลเวียง', incidents: 3, status: 'MEDIUM' },
        { village: 'หมู่ 2 - ป่าบง', incidents: 2, status: 'LOW' }
    ];

    // --- PREMIUM DESIGN SYSTEM CONSTANTS ---
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
    const paddingX = window.innerWidth < 768 ? '20px' : '48px';

    return (
        <DashboardLayout>
            <div style={{
                minHeight: '100vh',
                background: '#f8fafc',
                fontFamily: "'Sarabun', sans-serif",
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '32px'
            }}>
                {/* --- ZONE 1: EXECUTIVE IDENTITY HEADER --- */}
                <div style={{ padding: `32px ${paddingX} 0` }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', // Deep Indigo for Executive
                        padding: window.innerWidth < 768 ? '24px 20px' : '36px 48px',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px rgba(49, 46, 129, 0.25)',
                        color: 'white',
                        display: 'flex',
                        flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
                        justifyContent: 'space-between',
                        alignItems: window.innerWidth < 1024 ? 'flex-start' : 'center',
                        gap: '24px',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative Background Element */}
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-10%',
                            width: '400px',
                            height: '400px',
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)',
                            borderRadius: '50%',
                            pointerEvents: 'none'
                        }} />

                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: '16px', backdropFilter: 'blur(8px)' }}>
                                    <Activity size={window.innerWidth < 768 ? 24 : 32} color="white" />
                                </div>
                                <div>
                                    <h1 style={{
                                        fontSize: window.innerWidth < 768 ? '24px' : '36px',
                                        fontWeight: '800',
                                        letterSpacing: '-0.02em',
                                        margin: 0,
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        Executive Command Center
                                    </h1>
                                </div>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={14} />
                                {new Date().toLocaleDateString('th-TH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                <span style={{ width: '4px', height: '4px', background: 'white', borderRadius: '50%', opacity: 0.5 }}></span>
                                ศูนย์บัญชาการวิเคราะห์สถานการณ์และนโยบาย
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 20px',
                                background: 'rgba(255,255,255,0.1)',
                                color: 'white',
                                borderRadius: '14px',
                                fontWeight: '600',
                                border: '1px solid rgba(255,255,255,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '14px',
                                backdropFilter: 'blur(4px)'
                            }}>
                                <Filter size={18} /> ตัวกรองขั้นสูง
                            </button>
                            <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '12px 24px',
                                background: 'white',
                                color: '#312e81',
                                borderRadius: '14px',
                                fontWeight: '800',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '14px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                <Download size={18} /> Export Brief
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- ZONE 2: STRATEGIC KPI PULSE --- */}
                <div style={{
                    padding: `32px ${paddingX}`,
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth < 1024 ? (window.innerWidth < 640 ? '1fr' : '1fr 1fr') : 'repeat(4, 1fr)',
                    gap: '24px'
                }}>
                    {/* KPI 1: Monthly Incidents */}
                    <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid #e0e7ff',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '14px', color: '#4338ca' }}>
                                <BarChart3 size={24} />
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: !kpiData.monthlyChangePositive ? '#16a34a' : '#dc2626',
                                fontWeight: '700', fontSize: '13px',
                                background: !kpiData.monthlyChangePositive ? '#dcfce7' : '#fee2e2',
                                padding: '4px 8px', borderRadius: '8px'
                            }}>
                                {!kpiData.monthlyChangePositive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                {kpiData.monthlyChange}
                            </div>
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#1e1b4b', lineHeight: 1 }}>{kpiData.monthlyIncidents}</div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>เหตุการณ์สะสม (เดือนนี้)</div>
                    </div>

                    {/* KPI 2: Response Time */}
                    <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid #dbeafe',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ background: '#dbeafe', padding: '12px', borderRadius: '14px', color: '#2563eb' }}>
                                <Clock size={24} />
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: kpiData.responseTimePositive ? '#16a34a' : '#dc2626',
                                fontWeight: '700', fontSize: '13px',
                                background: kpiData.responseTimePositive ? '#dcfce7' : '#fee2e2',
                                padding: '4px 8px', borderRadius: '8px'
                            }}>
                                {kpiData.responseTimePositive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                                {kpiData.responseTimeChange}
                            </div>
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#1e1b4b', lineHeight: 1 }}>{kpiData.avgResponseTime}</div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>เวลาตอบสนองเฉลี่ย</div>
                    </div>

                    {/* KPI 3: Active Officers */}
                    <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid #d1fae5',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ background: '#d1fae5', padding: '12px', borderRadius: '14px', color: '#059669' }}>
                                <Users size={24} />
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: '#059669',
                                fontWeight: '700', fontSize: '13px',
                                background: '#d1fae5',
                                padding: '4px 8px', borderRadius: '8px'
                            }}>
                                <TrendingUp size={14} />
                                {kpiData.officerUtilization} Util.
                            </div>
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#1e1b4b', lineHeight: 1 }}>
                            {kpiData.activeOfficers}<span style={{ fontSize: '20px', color: '#94a3b8', fontWeight: '600' }}>/{kpiData.totalOfficers}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>กำลังพลที่ปฏิบัติงาน</div>
                    </div>

                    {/* KPI 4: Completion Rate */}
                    <div style={{
                        background: 'white',
                        padding: '24px',
                        borderRadius: '24px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid #ffedd5',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div style={{ background: '#ffedd5', padding: '12px', borderRadius: '14px', color: '#d97706' }}>
                                <CheckCircle size={24} />
                            </div>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '4px',
                                color: kpiData.completionPositive ? '#16a34a' : '#dc2626',
                                fontWeight: '700', fontSize: '13px',
                                background: kpiData.completionPositive ? '#dcfce7' : '#fee2e2',
                                padding: '4px 8px', borderRadius: '8px'
                            }}>
                                {kpiData.completionPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {kpiData.completionChange}
                            </div>
                        </div>
                        <div style={{ fontSize: '36px', fontWeight: '800', color: '#1e1b4b', lineHeight: 1 }}>{kpiData.completionRate}</div>
                        <div style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>อัตราความสำเร็จ</div>
                    </div>
                </div>

                {/* --- ZONE 3 & 4: TACTICAL INSIGHTS & RISK INTELLIGENCE --- */}
                <div style={{
                    padding: `0 ${paddingX}`,
                    display: 'grid',
                    gridTemplateColumns: window.innerWidth < 1024 ? '1fr' : '1fr 2fr',
                    gap: '24px'
                }}>
                    {/* CHART SECTION */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Incident Types */}
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <BarChart3 size={20} color="#4f46e5" /> สถิติแยกตามประเภท
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {incidentsByType.map((item, index) => (
                                    <div key={index}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>{item.type}</span>
                                            <span style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>{item.count} <span style={{ color: '#94a3b8', fontWeight: '500', fontSize: '12px' }}>({item.percentage}%)</span></span>
                                        </div>
                                        <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '100px', overflow: 'hidden' }}>
                                            <div style={{ width: `${item.percentage}%`, height: '100%', background: item.color, borderRadius: '100px', transition: 'width 1s ease' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Village Watchlist */}
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            border: '1px solid #f1f5f9',
                            flex: 1
                        }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <AlertTriangle size={20} color="#dc2626" /> พื้นที่เฝ้าระวัง (Top 5)
                            </h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                                            <th style={{ textAlign: 'left', padding: '12px 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>หมู่บ้าน</th>
                                            <th style={{ textAlign: 'center', padding: '12px 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>เหตุการณ์</th>
                                            <th style={{ textAlign: 'right', padding: '12px 8px', fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>สถานะ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {villageStats.map((village, idx) => (
                                            <tr key={idx} style={{ borderBottom: idx !== villageStats.length - 1 ? '1px solid #f8fafc' : 'none' }}>
                                                <td style={{ padding: '16px 8px', fontSize: '14px', fontWeight: '600', color: '#334155' }}>{village.village}</td>
                                                <td style={{ padding: '16px 8px', textAlign: 'center', fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>{village.incidents}</td>
                                                <td style={{ padding: '16px 8px', textAlign: 'right' }}>
                                                    <span style={{
                                                        fontSize: '11px',
                                                        fontWeight: '800',
                                                        padding: '4px 10px',
                                                        borderRadius: '100px',
                                                        display: 'inline-block',
                                                        background: village.status === 'HIGH' ? '#fee2e2' : (village.status === 'MEDIUM' ? '#ffedd5' : '#dcfce7'),
                                                        color: village.status === 'HIGH' ? '#ef4444' : (village.status === 'MEDIUM' ? '#d97706' : '#16a34a'),
                                                        minWidth: '60px',
                                                        textAlign: 'center'
                                                    }}>
                                                        {village.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <button style={{
                                width: '100%',
                                marginTop: '16px',
                                padding: '12px',
                                background: '#f8fafc',
                                color: '#4f46e5',
                                borderRadius: '12px',
                                border: 'none',
                                fontSize: '13px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}>
                                ดูข้อมูลทั้งหมด <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    {/* MAP SECTION */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '24px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                            border: '1px solid #f1f5f9',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Map size={20} color="#4f46e5" /> แผนที่ความเสี่ยงเชิงยุทธศาสตร์
                                </h3>
                                <button
                                    onClick={() => setShowMap(!showMap)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: '700',
                                        background: showMap ? '#fee2e2' : '#e0e7ff',
                                        color: showMap ? '#dc2626' : '#4338ca',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {showMap ? 'ซ่อนแผนที่' : 'เรียกดูแผนที่'}
                                </button>
                            </div>

                            <div style={{
                                flex: 1,
                                background: '#f8fafc',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                position: 'relative',
                                minHeight: '400px'
                            }}>
                                <AnimatePresence mode="wait">
                                    {showMap ? (
                                        <motion.div
                                            key="map"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                            <Suspense fallback={
                                                <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                                                    <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%' }}></div>
                                                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: '600' }}>กำลังโหลดข้อมูลพิกัด...</span>
                                                </div>
                                            }>
                                                <HeatmapVisualization height="100%" />
                                            </Suspense>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}
                                        >
                                            <div style={{ background: 'white', padding: '24px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                                <Map size={48} color="#cbd5e1" />
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '16px', color: '#475569', fontWeight: '700', marginBottom: '4px' }}>แผนที่อยู่ในโหมดสแตนด์บาย</p>
                                                <p style={{ fontSize: '13px', color: '#94a3b8' }}>คลิกปุ่ม "เรียกดูแผนที่" เพื่อโหลดข้อมูลเลเยอร์ความเสี่ยง</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Risk Analysis Engine:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '700', color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '6px' }}>
                                    <span style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.2)' }}></span>
                                    Online
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
