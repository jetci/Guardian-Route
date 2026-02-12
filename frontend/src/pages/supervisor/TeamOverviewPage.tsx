/**
 * Team Overview Page - Supervisor (Premium Edition)
 * Optimized for Visual Excellence based on codified design standards.
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { usersApi } from '../../api/users';
import { tasksApi } from '../../api/tasks';
import toast from 'react-hot-toast';
import { type User, TaskStatus } from '../../types';
import { Users, Activity, UserCheck, UserX, Phone, Mail, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamOverviewPage() {
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    available: 0,
    onTask: 0,
    offline: 0,
    total: 0
  });

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      const [team, activeTasks] = await Promise.all([
        usersApi.getFieldOfficers(),
        tasksApi.getAll({ status: TaskStatus.IN_PROGRESS })
      ]);

      setTeamMembers(team);

      const activeUserIds = new Set(activeTasks.map(t => t.assignedToId));
      const onTaskCount = team.filter(m => activeUserIds.has(m.id)).length;
      const available = team.filter(m => m.isActive && !activeUserIds.has(m.id)).length;
      const offline = team.filter(m => !m.isActive).length;

      setStats({
        available,
        onTask: onTaskCount,
        offline,
        total: team.length
      });
    } catch (error) {
      console.error('❌ Error loading team data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลทีมได้');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{
          minHeight: '100vh',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #f1f5f9',
              borderTopColor: '#2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <p style={{ color: '#64748b', fontWeight: '700', fontSize: '14px' }}>กำลังเข้าถึงระบบฐานข้อมูลกำลังพล...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- PREMIUM DESIGN SYSTEM CONSTANTS ---
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
  const paddingX = isMobile ? '20px' : '48px';

  return (
    <DashboardLayout>
      <div style={{
        minHeight: '100vh',
        background: '#f8fafc',
        fontFamily: "'Sarabun', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '32px'
      }}>

        {/* --- ZONE 1: PREMIUM IDENTITY HEADER --- */}
        <div style={{ padding: `0 ${paddingX} 32px` }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)',
            padding: isMobile ? '24px 20px' : '32px 48px',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)',
            color: 'white',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '24px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px', borderRadius: '14px' }}>
                  <Users size={isMobile ? 24 : 32} color="white" />
                </div>
                <h1 style={{
                  fontSize: isMobile ? '28px' : '36px',
                  fontWeight: '900',
                  letterSpacing: '-0.02em',
                  margin: 0
                }}>
                  ศูนย์บัญชาการกำลังพล
                </h1>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '15px', fontWeight: '600' }}>
                เฝ้าติดตามและบริหารจัดการบุคลากรภาคสนามแบบล่วงเวลา (Real-time Personnel Monitoring)
              </p>
            </div>

            <button
              onClick={loadTeamData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,1)',
                color: '#1e40af',
                borderRadius: '14px',
                fontWeight: '800',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <Activity size={18} /> รีเฟรชข้อมูล
            </button>
          </div>
        </div>

        {/* --- ZONE 2: TACTICAL INFO PULSE (STATS) --- */}
        <div style={{
          padding: `0 ${paddingX} 32px`,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {/* Available Stat */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '24px',
            borderRadius: '24px',
            color: 'white',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '140px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                <UserCheck size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', opacity: 0.8 }}>Ready</span>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900' }}>{stats.available}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.9 }}>พร้อมปฏิบัติงาน</div>
            </div>
          </div>

          {/* Active Stat */}
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '24px',
            borderRadius: '24px',
            color: 'white',
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '140px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                <Activity size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', opacity: 0.8 }}>In Mission</span>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900' }}>{stats.onTask}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.9 }}>กำลังปฏิบัติภารกิจ</div>
            </div>
          </div>

          {/* Offline Stat */}
          <div style={{
            background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
            padding: '24px',
            borderRadius: '24px',
            color: 'white',
            boxShadow: '0 8px 20px rgba(100, 116, 139, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '140px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                <UserX size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', opacity: 0.8 }}>Away</span>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900' }}>{stats.offline}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.9 }}>ออฟไลน์</div>
            </div>
          </div>

          {/* Total Stat */}
          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            padding: '24px',
            borderRadius: '24px',
            color: 'white',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.15)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '140px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px', borderRadius: '10px' }}>
                <Users size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', opacity: 0.8 }}>Forces</span>
            </div>
            <div>
              <div style={{ fontSize: '32px', fontWeight: '900' }}>{stats.total}</div>
              <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.9 }}>กำลังพลรวม</div>
            </div>
          </div>
        </div>

        {/* --- ZONE 3: TEAM INTELLIGENCE GRID --- */}
        <div style={{ padding: `0 ${paddingX} 80px`, flex: 1 }}>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1e293b' }}>รายชื่อเจ้าหน้าที่ปฏิบัติการ</h2>
            <div style={{ background: '#e2e8f0', color: '#475569', padding: '2px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: '900' }}>
              {teamMembers.length} นาย
            </div>
          </div>

          {teamMembers.length === 0 ? (
            <div style={{
              padding: '80px 20px',
              textAlign: 'center',
              background: 'white',
              borderRadius: '32px',
              border: '2px dashed #f1f5f9'
            }}>
              <div style={{ width: '64px', height: '64px', background: '#f8fafc', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Users size={32} color="#cbd5e1" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#94a3b8' }}>ยังไม่มีข้อมูลเจ้าหน้าที่ในระบบ</h3>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '20px'
            }}>
              <AnimatePresence>
                {teamMembers.map(member => (
                  <motion.div
                    key={member.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                    style={{
                      background: 'white',
                      borderRadius: '24px',
                      padding: '24px',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px'
                    }}
                  >
                    {/* Card Header Info */}
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '18px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: '900',
                        boxShadow: '0 8px 16px rgba(37, 99, 235, 0.15)'
                      }}>
                        {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '17px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.firstName} {member.lastName}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            padding: '4px 10px',
                            borderRadius: '100px',
                            background: member.isActive ? '#f0fdf4' : '#f8fafc',
                            color: member.isActive ? '#10b981' : '#94a3b8',
                            fontSize: '10px',
                            fontWeight: '900',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            {member.isActive ? <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} /> : null}
                            {member.isActive ? 'Active' : 'Offline'}
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b' }}>#{member.role}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Contact Info */}
                    <div style={{
                      padding: '16px',
                      background: '#f8fafc',
                      borderRadius: '18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Mail size={14} color="#94a3b8" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.email}
                        </span>
                      </div>
                      {member.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Phone size={14} color="#94a3b8" />
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>{member.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Primary Command */}
                    <button style={{
                      width: '100%',
                      padding: '12px',
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #dbeafe',
                      borderRadius: '14px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#2563eb';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = '#eff6ff';
                        e.currentTarget.style.color = '#2563eb';
                      }}
                    >
                      <TrendingUp size={16} /> ดูประสิทธิภาพการทำงาน
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
