/**
 * Field Officer Dashboard - Mobile First "ActionOS"
 * Optimized for Touch, Sunlight Readability, and Speed
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { WeatherWidget } from '../../components/dashboard/WeatherWidget';
import toast from 'react-hot-toast';
import { TAMBON_INFO } from '../../data/villages';
import { tasksApi } from '../../api/tasks';
import { useAuthStore } from '../../stores/authStore';
import type { Task as ApiTask } from '../../types';
import {
  MapPin,
  Calendar,
  ChevronRight,
  AlertCircle,
  ClipboardList,
  CheckCircle2,
  Clock,
  Flame,
  Navigation
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FieldOfficerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refreshKey, setRefreshKey] = useState(0);
  const [stats, setStats] = useState({
    myTasks: 0,
    acceptedTasks: 0,
    completedTasks: 0,
    reportsSubmitted: 0
  });
  const [tasks, setTasks] = useState<ApiTask[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    loadDashboardData();
  }, [refreshKey]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const myTasks = await tasksApi.getMyTasks();

      // Active tasks logic
      const activeTasks = myTasks.filter(t =>
        t.status === 'PENDING' ||
        t.status === 'IN_PROGRESS' ||
        t.status === 'SURVEYED'
      );

      const sortedTasks = activeTasks
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 10); // Show more on mobile stream

      setTasks(sortedTasks);

      setStats({
        myTasks: myTasks.length,
        acceptedTasks: myTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'SURVEYED').length,
        completedTasks: myTasks.filter(t => t.status === 'COMPLETED').length,
        reportsSubmitted: myTasks.filter(t => t.completedAt).length
      });

    } catch (error) {
      console.error('Failed', error);
      toast.error('โหลดข้อมูลไม่สำเร็จ');
    } finally {
      setLoading(false);
    }
  };

  // --- MOBILE COMPONENT: ACTION BUTTON ---
  const ActionButton = ({ icon: Icon, label, subLabel, colorStart, colorEnd, onClick }: any) => (
    <motion.div
      whileTap={{ scale: 0.96 }}
      style={{ flex: 1 }}
    >
      <button
        onClick={onClick}
        style={{
          width: '100%',
          cursor: 'pointer',
          background: `linear-gradient(135deg, ${colorStart} 0%, ${colorEnd} 100%)`,
          borderRadius: '20px',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 10px 20px -5px ${colorStart}60`,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '140px',
          border: 'none', // Reset button style
          outline: 'none', // Reset focus style preference
          fontFamily: 'inherit'
        }}
      >
        <div style={{
          position: 'absolute', top: -20, right: -20, width: 80, height: 80,
          background: 'rgba(255,255,255,0.1)', borderRadius: '50%'
        }} />
        <Icon size={36} style={{ marginBottom: '12px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
        <span style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1.2, marginBottom: '4px', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: '500', opacity: 0.9 }}>{subLabel}</span>
      </button>
    </motion.div>
  );

  // --- MOBILE COMPONENT: TASK CARD (REFINED) ---
  const TaskCard = ({ task }: { task: ApiTask }) => {
    const getStatusTheme = (status: string) => {
      switch (status) {
        case 'PENDING': return { color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d', label: 'รอดำเนินการ', icon: Clock };
        case 'IN_PROGRESS': return { color: '#2563eb', bg: '#eff6ff', border: '#93c5fd', label: 'กำลังดำเนินการ', icon: Navigation };
        case 'SURVEYED': return { color: '#059669', bg: '#ecfdf5', border: '#6ee7b7', label: 'สำรวจแล้ว', icon: CheckCircle2 };
        default: return { color: '#64748b', bg: '#f8fafc', border: '#cbd5e1', label: 'อื่นๆ', icon: AlertCircle };
      }
    };

    const theme = getStatusTheme(task.status);
    const StatusIcon = theme.icon;

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'white',
          borderRadius: '24px', // More rounded for modern feel
          boxShadow: '0 8px 24px rgba(0,0,0,0.04)', // Softer, deeper shadow
          marginBottom: '20px',
          border: '1px solid #f1f5f9',
          overflow: 'hidden',
          position: 'relative',
          transition: 'transform 0.2s',
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Status Strip & Header Background */}
        <div style={{
          background: `linear-gradient(to right, ${theme.bg}, white)`,
          padding: '16px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StatusIcon size={16} color={theme.color} />
            <span style={{ fontSize: '13px', fontWeight: '800', color: theme.color, letterSpacing: '0.02em' }}>
              {theme.label}
            </span>
          </div>
          {task.priority === 'URGENT' || task.priority === 'HIGH' ? (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca',
              padding: '4px 10px', borderRadius: '100px',
              display: 'flex', alignItems: 'center', gap: '4px'
            }}>
              <Flame size={12} fill="#ef4444" color="#ef4444" />
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#b91c1c' }}>ด่วนมาก</span>
            </div>
          ) : (
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>
              #{task.id.slice(0, 6)}
            </div>
          )}
        </div>

        <div style={{ padding: '20px' }}>
          <h3 style={{
            fontSize: '18px', fontWeight: '800', color: '#1e293b',
            marginBottom: '12px', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
          }}>
            {task.title}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <div style={{ minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '6px' }}>
                <MapPin size={12} color="#64748b" />
              </div>
              <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                {task.village?.name || 'ไม่ระบุพิกัด'}
              </span>
            </div>

            {task.dueDate && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', borderRadius: '6px' }}>
                  <Calendar size={12} color="#64748b" />
                </div>
                <span style={{ fontSize: '14px', color: '#475569', fontWeight: '500' }}>
                  กำหนด: {new Date(task.dueDate).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/tasks/${task.id}`)}
            style={{
              width: '100%',
              padding: '16px',
              background: '#1e293b', // Dark button for contrast
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)'
            }}
          >
            ไปที่ภารกิจ <ChevronRight size={18} />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Sarabun', sans-serif",
        paddingBottom: '80px' // Space for bottom nav if any
      }}>
        {/* --- ZONE 1: FIELD IDENTITY HEADER --- */}
        <div style={{
          background: 'white',
          padding: '20px 24px 32px',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <MapPin size={16} color="#2563eb" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  พื้นที่รับผิดชอบ
                </span>
              </div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1e293b', margin: 0, lineHeight: 1.2 }}>
                {TAMBON_INFO.fullName}
              </h1>
            </div>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #fff', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)'
            }}>
              <span style={{ fontSize: '16px' }}>👮</span>
            </div>
          </div>

          {/* Integrated Weather Compact */}
          <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', border: '1px solid #f1f5f9' }}>
            <WeatherWidget />
          </div>
        </div>

        <div style={{ padding: '0 20px', marginTop: '-20px', position: 'relative', zIndex: 20 }}>
          {/* --- ZONE 2: RAPID ACTION GRID (THUMB ZONE) --- */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <ActionButton
              icon={AlertCircle}
              label="แจ้งเหตุ"
              subLabel="ฉุกเฉิน / ใหม่"
              colorStart="#ef4444"
              colorEnd="#dc2626"
              onClick={() => navigate('/create-incident')}
            />
            <ActionButton
              icon={ClipboardList}
              label="งานของฉัน"
              subLabel={`${stats.myTasks} งานคงค้าง`}
              colorStart="#2563eb"
              colorEnd="#1d4ed8"
              onClick={() => navigate('/tasks/my-tasks')}
            />
          </div>

          {/* --- ZONE 3: MISSION STATUS (KPIs) --- */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '32px'
          }}>
            {[
              { label: 'รอดำเนินการ', value: stats.myTasks - stats.acceptedTasks, color: '#f59e0b' },
              { label: 'กำลังทำ', value: stats.acceptedTasks, color: '#3b82f6' },
              { label: 'เสร็จสิ้น', value: stats.completedTasks, color: '#10b981' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                background: 'white', padding: '16px 12px', borderRadius: '16px',
                textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9'
              }}>
                <div style={{ fontSize: '24px', fontWeight: '800', color: stat.color, marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* --- ZONE 4: ACTIVE TASK STREAM --- */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: 0 }}>
              ภารกิจล่าสุด
            </h2>
            <button
              onClick={() => navigate('/tasks/my-tasks')}
              style={{
                background: 'none', border: 'none', color: '#64748b',
                fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              ดูทั้งหมด <ChevronRight size={14} />
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%' }}></div>
            </div>
          ) : tasks.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '24px',
              border: '2px dashed #e2e8f0'
            }}>
              <div style={{
                width: '64px', height: '64px', background: '#f8fafc', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
              }}>
                <CheckCircle2 size={32} color="#94a3b8" />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>ไม่มีภารกิจค้าง</h3>
              <p style={{ fontSize: '13px', color: '#94a3b8' }}>คุณจัดการงานทั้งหมดเรียบร้อยแล้ว</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <AnimatePresence>
                {tasks.map(task => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
