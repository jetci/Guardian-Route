/**
 * Supervisor Dashboard V6 - Premium Command Center
 * Modernized with robust layout and high-end aesthetics
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
  Calendar
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

export const SupervisorDashboard = () => {
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
  const [stats, setStats] = useState({
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

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Supervisor Dashboard</h1>
        <p>หน้านี้กำลังปรับปรุงเป็นเวอร์ชัน Premium โปรดไปที่ /dashboard/supervisor</p>
        <button onClick={() => navigate('/dashboard/supervisor')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg">
          เข้าสู่แดชบอร์ดพรีเมียม
        </button>
      </div>
    </DashboardLayout>
  );
};
