/**
 * Team Overview Page - Supervisor
 * ภาพรวมทีมงาน
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { usersApi } from '../../api/users';
import { tasksApi } from '../../api/tasks';
import toast from 'react-hot-toast';
import { type User, TaskStatus } from '../../types';
import { Users, Activity, UserCheck, UserX, Phone, Mail, Briefcase, Clock, TrendingUp } from 'lucide-react';


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

      // Calculate stats based on isActive status and active tasks
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">กำลังโหลดข้อมูลทีม...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-8">
        <div className="w-full space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 flex items-center gap-3 mb-2">
                  <Users className="text-blue-600" size={32} />
                  ภาพรวมทีม
                </h1>
                <p className="text-gray-600 font-medium">สถานะและงานของเจ้าหน้าที่ภาคสนามทั้งหมด</p>
              </div>
              <button
                onClick={loadTeamData}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md text-sm"
              >
                <Activity size={18} />
                รีเฟรช
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Available */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <UserCheck className="text-white" size={24} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-1 rounded-md">Ready</span>
                </div>
                <div className="mt-auto">
                  <p className="text-4xl font-bold text-white mb-1">{stats.available}</p>
                  <p className="text-sm font-medium text-white/90 uppercase tracking-wide">พร้อมปฏิบัติงาน</p>
                </div>
              </div>
            </div>

            {/* On Task */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Activity className="text-white" size={24} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-1 rounded-md">Active</span>
                </div>
                <div className="mt-auto">
                  <p className="text-4xl font-bold text-white mb-1">{stats.onTask}</p>
                  <p className="text-sm font-medium text-white/90 uppercase tracking-wide">กำลังทำงาน</p>
                </div>
              </div>
            </div>

            {/* Offline */}
            <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <UserX className="text-white" size={24} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-1 rounded-md">Offline</span>
                </div>
                <div className="mt-auto">
                  <p className="text-4xl font-bold text-white mb-1">{stats.offline}</p>
                  <p className="text-sm font-medium text-white/90 uppercase tracking-wide">ออฟไลน์</p>
                </div>
              </div>
            </div>

            {/* Total */}
            <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <span className="text-xs font-semibold text-white/80 bg-white/10 px-2 py-1 rounded-md">Total</span>
                </div>
                <div className="mt-auto">
                  <p className="text-4xl font-bold text-white mb-1">{stats.total}</p>
                  <p className="text-sm font-medium text-white/90 uppercase tracking-wide">ทั้งหมด</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <Users size={24} />
                </span>
                รายชื่อเจ้าหน้าที่
              </h2>
              <div className="text-sm text-gray-600 font-medium">
                {teamMembers.length} คน
              </div>
            </div>

            {teamMembers.length === 0 ? (
              <div className="py-16 text-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-slate-400" size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-400 mb-2">ไม่มีข้อมูลเจ้าหน้าที่</h3>
                <p className="text-slate-400">ยังไม่มีเจ้าหน้าที่ภาคสนามในระบบ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map(member => (
                  <div
                    key={member.id}
                    className="group bg-white rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                        {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {member.firstName} {member.lastName}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                            member.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {member.isActive ? (
                              <><UserCheck size={12} className="mr-1" /> Active</>
                            ) : (
                              <><UserX size={12} className="mr-1" /> Offline</>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone size={14} className="text-gray-400 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase size={14} className="text-gray-400 flex-shrink-0" />
                        <span className="font-medium">{member.role}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full mt-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                      <TrendingUp size={14} />
                      ดูประสิทธิภาพ
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
