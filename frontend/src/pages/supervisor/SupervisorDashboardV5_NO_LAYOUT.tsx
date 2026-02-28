/**
 * Supervisor Dashboard V5 - NO LAYOUT (For Testing)
 * ไม่ใช้ DashboardLayout เพื่อทดสอบว่า V5 ทำงาน
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentsApi } from '../../api/incidents';
import { tasksApi } from '../../api/tasks';
import { villagesApi } from '../../api/villages';
import { IncidentCard } from '../../components/incidents/IncidentCard';
import type { Incident, Village } from '../../types';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalIncidents: number;
  pendingIncidents: number;
  inProgressIncidents: number;
  totalTasks: number;
}

export default function SupervisorDashboardV5NoLayout() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    pendingIncidents: 0,
    inProgressIncidents: 0,
    totalTasks: 0,
  });
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const results = await Promise.allSettled([
        incidentsApi.getAll(),
        tasksApi.getStatistics(),
      ]);

      if (results[0].status === 'fulfilled') {
        const incidentsData = results[0].value;
        setIncidents(incidentsData);
        setStats((prev) => ({
          ...prev,
          totalIncidents: incidentsData.length,
          pendingIncidents: incidentsData.filter((i: Incident) => i.status === 'PENDING').length,
          inProgressIncidents: incidentsData.filter((i: Incident) => i.status === 'IN_PROGRESS').length,
        }));
      }

      if (results[1].status === 'fulfilled') {
        const taskStats = results[1].value;
        const totalTasks = (taskStats.byStatus?.IN_PROGRESS || 0) + (taskStats.byStatus?.PENDING || 0);
        setStats((prev) => ({ ...prev, totalTasks }));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TEST BANNER */}
      <div className="bg-red-600 text-white text-center py-4 text-2xl font-bold">
        🔴 THIS IS V5 - NO LAYOUT TEST 🔴
      </div>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ✅ Header with Stats Inside */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-6 sm:p-8 mb-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <span>🎛️</span>
                <span>แดชบอร์ดบัญชาการ V5</span>
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base">
                ภาพรวมประสิทธิภาพและการจัดการเหตุการณ์
              </p>
            </div>
          </div>

          {/* ✅ Stats Cards Inside Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                📊 ทั้งหมด
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stats.totalIncidents}
              </div>
            </div>
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                ⏰ รอดำเนินการ
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">
                {stats.pendingIncidents}
              </div>
            </div>
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                ⚡ กำลังดำเนินการ
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {stats.inProgressIncidents}
              </div>
            </div>
            <div className="bg-white/95 rounded-xl p-4 shadow-sm">
              <div className="text-xs sm:text-sm font-semibold text-gray-600 mb-2">
                ✅ งานทั้งหมด
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {stats.totalTasks}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Incidents List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">รายการเหตุการณ์</h2>
          {incidents.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">ไม่พบเหตุการณ์</h3>
            </div>
          ) : (
            incidents.slice(0, 5).map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                onViewDetails={() => {}}
                onAssign={() => {}}
                onClose={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
