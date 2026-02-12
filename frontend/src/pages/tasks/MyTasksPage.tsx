import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { tasksApi } from '../../api/tasks';
import { formatThaiDateShort } from '../../utils/dateFormatter';
import toast from 'react-hot-toast';
import type { Task } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Clock, Navigation, CheckCircle2, AlertCircle,
  Calendar, MapPin, ChevronRight, Flame, Filter
} from 'lucide-react';

export const MyTasksPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'IN_PROGRESS' | 'SURVEYED' | 'COMPLETED'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMyTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, activeTab, searchTerm]);

  const fetchMyTasks = async () => {
    try {
      setIsLoading(true);
      const response = await tasksApi.getMyTasks();
      setTasks(response);
    } catch (error: any) {
      console.error('Failed to load tasks:', error);
      toast.error(error.message || 'ไม่สามารถโหลดข้อมูลงานได้');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks.filter(t => t.status === activeTab);

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(lowerTerm) ||
        t.village?.name.toLowerCase().includes(lowerTerm) ||
        t.id.includes(lowerTerm)
      );
    }
    setFilteredTasks(filtered);
  };

  const handleAcceptTask = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await tasksApi.acceptTask(taskId);
      toast.success('รับงานสำเร็จ');
      fetchMyTasks();
    } catch (error: any) {
      toast.error(error.message || 'ไม่สามารถรับงานได้');
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { color: '#f59e0b', bg: '#fffbeb', icon: Clock, label: 'รอดำเนินการ' };
      case 'IN_PROGRESS': return { color: '#2563eb', bg: '#eff6ff', icon: Navigation, label: 'กำลังดำเนินการ' };
      case 'SURVEYED': return { color: '#059669', bg: '#ecfdf5', icon: CheckCircle2, label: 'สำรวจแล้ว' };
      case 'COMPLETED': return { color: '#10b981', bg: '#ecfdf5', icon: CheckCircle2, label: 'เสร็จสิ้น' };
      default: return { color: '#64748b', bg: '#f1f5f9', icon: AlertCircle, label: status };
    }
  };

  const currentTheme = getStatusConfig(activeTab);

  if (isLoading) {
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
          padding: '24px 24px 20px',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#1e293b', margin: 0, letterSpacing: '-0.5px' }}>งานของฉัน</h1>
              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '4px' }}>จัดการภารกิจและรายงานผล</p>
            </div>

            <div style={{
              width: '48px', height: '48px',
              background: '#f1f5f9', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#334155' }}>{tasks.length}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '24px' }}>
            <Search size={22} color="#94a3b8" style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="ค้นหางาน, หมู่บ้าน, หมายเลข..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '16px 20px 16px 52px', borderRadius: '20px', border: '1px solid #e2e8f0',
                fontSize: '16px', outline: 'none', background: '#f8fafc', color: '#1e293b',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none', marginLeft: '-4px', paddingLeft: '4px' }}>
            {['PENDING', 'IN_PROGRESS', 'SURVEYED', 'COMPLETED'].map((status) => {
              const isActive = activeTab === status;
              const config = getStatusConfig(status);
              const Icon = config.icon;
              return (
                <button
                  key={status}
                  onClick={() => setActiveTab(status as any)}
                  style={{
                    padding: '10px 18px', borderRadius: '100px',
                    background: isActive ? config.color : 'white',
                    color: isActive ? 'white' : '#64748b',
                    boxShadow: isActive ? `0 8px 16px -4px ${config.color}80` : '0 2px 8px rgba(0,0,0,0.04)',
                    fontWeight: isActive ? '700' : '600', fontSize: '14px', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isActive ? 'none' : '1px solid #f1f5f9'
                  }}
                >
                  <Icon size={16} strokeWidth={2.5} /> {config.label}
                  {isActive && <span style={{ background: 'rgba(255,255,255,0.25)', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>
                    {tasks.filter(t => t.status === status).length}
                  </span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* --- TASK LIST --- */}
        <div style={{ padding: '24px 20px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + searchTerm}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {filteredTasks.length === 0 ? (
                <div style={{ marginTop: '60px', opacity: 0.8 }}>
                  <EmptyState
                    icon="clipboard"
                    title={`ไม่มีงาน${currentTheme.label}`}
                    description={searchTerm ? 'ไม่พบงานที่ค้นหา ลองใช้คำค้นอื่น' : 'ขณะนี้ไม่มีรายการงานในสถานะนี้'}
                  />
                </div>
              ) : (
                filteredTasks.map(task => {
                  const theme = getStatusConfig(task.status);
                  return (
                    <div
                      key={task.id}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      style={{
                        background: 'white',
                        borderRadius: '24px',
                        // padding: '24px', 
                        marginBottom: '20px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
                        border: '1px solid #f1f5f9',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer'
                      }}
                    >
                      {/* Status Strip & Header */}
                      <div style={{
                        background: `linear-gradient(to right, ${theme.bg}, white)`,
                        padding: '16px 24px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <theme.icon size={16} color={theme.color} />
                          <span style={{ fontSize: '13px', fontWeight: '800', color: theme.color, letterSpacing: '0.02em' }}>
                            {theme.label}
                          </span>
                        </div>
                        {(task.priority === 'HIGH' || task.priority === 'URGENT') ? (
                          <div style={{
                            background: '#fef2f2', border: '1px solid #fecaca',
                            padding: '4px 12px', borderRadius: '100px',
                            display: 'flex', alignItems: 'center', gap: '6px'
                          }}>
                            <Flame size={12} fill="#ef4444" color="#ef4444" />
                            <span style={{ fontSize: '11px', fontWeight: '800', color: '#b91c1c' }}>ด่วนมาก</span>
                          </div>
                        ) : (
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8' }}>#{task.id.slice(0, 6)}</span>
                        )}
                      </div>

                      <div style={{ padding: '24px' }}>
                        <h3 style={{
                          fontSize: '18px', fontWeight: '800', color: '#1e293b',
                          marginBottom: '16px', lineHeight: 1.5,
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                        }}>
                          {task.title}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                            <div style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px' }}>
                              <MapPin size={14} color="#64748b" />
                            </div>
                            <span style={{ fontSize: '15px', color: '#475569', fontWeight: '500', lineHeight: 1.4 }}>
                              {task.village?.name || 'ไม่ระบุพื้นที่'}
                            </span>
                          </div>
                          {task.dueDate && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                              <div style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px' }}>
                                <Calendar size={14} color="#64748b" />
                              </div>
                              <span style={{ fontSize: '15px', color: '#475569', fontWeight: '500', lineHeight: 1.4 }}>
                                {formatThaiDateShort(task.dueDate)}
                              </span>
                            </div>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                          {task.status === 'PENDING' && (
                            <button
                              onClick={(e: React.MouseEvent) => handleAcceptTask(task.id, e)}
                              style={{
                                flex: 2, padding: '16px', borderRadius: '16px', border: 'none',
                                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                                color: 'white', fontWeight: '700', fontSize: '15px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                              }}
                            >
                              <CheckCircle2 size={18} /> รับงานนี้
                            </button>
                          )}
                          <button
                            style={{
                              flex: 1, padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0',
                              background: 'white', color: '#1e293b', fontWeight: '700', fontSize: '15px',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer'
                            }}
                          >
                            รายละเอียด <ChevronRight size={18} />
                          </button>
                        </div>
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
};
