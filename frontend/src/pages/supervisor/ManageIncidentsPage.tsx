/**
 * Manage Incidents Page - Supervisor
 * จัดการเหตุการณ์ทั้งหมด
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { incidentsApi } from '../../api/incidents';
import { usersApi } from '../../api/users';
import { villagesApi } from '../../api/villages';
import type { Incident, User, IncidentStatus, Priority, Village } from '../../types';
import { AssignIncidentModal } from '../../components/supervisor/AssignIncidentModal';
import IncidentDetailsModal from '../../components/incidents/IncidentDetailsModal';
import toast from 'react-hot-toast';


export default function ManageIncidentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'ongoing' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVillage, setFilterVillage] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [allVillages, setAllVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadIncidents();
    loadVillages();
  }, [refreshKey]);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentsApi.getAll();
      setIncidents(data);
    } catch (error) {
      console.error('❌ Error loading incidents:', error);
      toast.error('ไม่สามารถโหลดข้อมูลเหตุการณ์ได้');
    } finally {
      setLoading(false);
    }
  };

  const loadVillages = async () => {
    try {
      const data = await villagesApi.getAll();
      setAllVillages(data);
    } catch (error) {
      console.error('Error loading villages:', error);
      // Don't show error toast for villages as it's not critical
    }
  };

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    // Tab filter
    if (activeTab === 'new' && incident.status !== 'PENDING') return false;
    if (activeTab === 'ongoing' && incident.status !== 'IN_PROGRESS') return false;
    if (activeTab === 'closed' && (incident.status !== 'RESOLVED' && incident.status !== 'CLOSED')) return false;

    // Search filter
    if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Village filter
    if (filterVillage !== 'all' && incident.village?.id !== filterVillage) return false;

    // Priority filter
    if (filterPriority !== 'all' && incident.priority !== filterPriority) return false;

    return true;
  });

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'CRITICAL': return '#dc2626';
      case 'HIGH': return '#f59e0b';
      case 'MEDIUM': return '#3b82f6';
      case 'LOW': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'PENDING': return '#ef4444';
      case 'IN_PROGRESS': return '#3b82f6';
      case 'RESOLVED': return '#10b981';
      case 'CLOSED': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: IncidentStatus) => {
    const labels: Record<IncidentStatus, string> = {
      PENDING: 'ใหม่',
      IN_PROGRESS: 'กำลังดำเนินการ',
      RESOLVED: 'แก้ไขแล้ว',
      CLOSED: 'เสร็จสิ้น',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: Priority) => {
    const labels: Record<Priority, string> = {
      CRITICAL: 'สูงมาก',
      HIGH: 'สูง',
      MEDIUM: 'ปานกลาง',
      LOW: 'ต่ำ',
    };
    return labels[priority] || priority;
  };

  const getDisasterTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FLOOD: 'น้ำท่วม',
      LANDSLIDE: 'ดินถล่ม',
      FIRE: 'ไฟไหม้',
      STORM: 'พายุ',
      EARTHQUAKE: 'แผ่นดินไหว',
      OTHER: 'อื่นๆ',
    };
    return labels[type] || type;
  };

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDetailsModal(true);
  };

  const handleAssign = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowAssignModal(true);
  };

  const handleAssignSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleClose = async (incident: Incident) => {
    if (confirm(`ยืนยันการปิดงาน: ${incident.title}?`)) {
      try {
        await incidentsApi.update(incident.id, { status: 'CLOSED' as any });
        toast.success(`✅ ปิดงาน: ${incident.title} สำเร็จ!`);
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        console.error('Error closing incident:', error);
        toast.error('ไม่สามารถปิดงานได้');
      }
    }
  };

  // Calculate stats
  const stats = {
    total: incidents.length,
    new: incidents.filter(i => i.status === 'PENDING').length,
    ongoing: incidents.filter(i => i.status === 'IN_PROGRESS').length,
    closed: incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length,
  };

  // Calculate incident counts per village
  const incidentCounts = incidents.reduce((acc, inc) => {
    // Handle both object and string village data
    const villageId = inc.village?.id || inc.villageId || 'unknown';
    acc[villageId] = (acc[villageId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ fontSize: '48px' }}>⏳</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            color: 'white',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            ⚠️ จัดการเหตุการณ์
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', marginBottom: '24px' }}>
            ศูนย์กลางการจัดการเหตุการณ์ภัยพิบัติทั้งหมด
          </p>

          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768
              ? 'repeat(2, 1fr)'
              : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: window.innerWidth < 768 ? '12px' : '16px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: window.innerWidth < 768 ? '16px' : '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                📊 ทั้งหมด
              </div>
              <div style={{
                fontSize: window.innerWidth < 768 ? '28px' : '36px',
                fontWeight: '800',
                color: '#1f2937'
              }}>
                {stats.total}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: window.innerWidth < 768 ? '16px' : '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                🆕 เหตุการณ์ใหม่
              </div>
              <div style={{
                fontSize: window.innerWidth < 768 ? '28px' : '36px',
                fontWeight: '800',
                color: '#ef4444'
              }}>
                {stats.new}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: window.innerWidth < 768 ? '16px' : '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                🔄 กำลังดำเนินการ
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#3b82f6' }}>
                {stats.ongoing}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                ✅ เสร็จสิ้น
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#10b981' }}>
                {stats.closed}
              </div>
            </div>
          </div>
        </div>

        <div>
          {/* Search and Filters */}
          <div style={{
            background: 'white',
            padding: window.innerWidth < 768 ? '16px' : '24px',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {/* Search */}
              <input
                type="text"
                placeholder="🔍 ค้นหาเหตุการณ์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: window.innerWidth < 768 ? 'none' : '1',
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                  minWidth: window.innerWidth < 768 ? 'auto' : '250px',
                  padding: '12px 18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />

              {/* Village Filter */}
              <select
                value={filterVillage}
                onChange={(e) => setFilterVillage(e.target.value)}
                style={{
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                  padding: '12px 18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  background: 'white',
                  outline: 'none'
                }}
              >
                <option value="all">📍 ทุกหมู่บ้าน ({incidents.length})</option>
                {allVillages.map((village) => (
                  <option key={village.id} value={village.id}>
                    {village.name} ({incidentCounts[village.id] || 0})
                  </option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{
                  width: window.innerWidth < 768 ? '100%' : 'auto',
                  padding: '12px 18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  background: 'white',
                  outline: 'none'
                }}
              >
                <option value="all">⚡ ทุกระดับ</option>
                <option value="CRITICAL">สูงมาก</option>
                <option value="HIGH">สูง</option>
                <option value="MEDIUM">ปานกลาง</option>
                <option value="LOW">ต่ำ</option>
              </select>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterVillage('all');
                  setFilterPriority('all');
                }}
                style={{
                  padding: '12px 24px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: '#374151'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#e5e7eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#f3f4f6'}
              >
                🔄 รีเซ็ต
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            background: 'white',
            padding: '8px',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                flex: '1',
                minWidth: '150px',
                padding: '12px 20px',
                background: activeTab === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
                color: activeTab === 'all' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'all' ? '0 4px 6px rgba(102, 126, 234, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'all') e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'all') e.currentTarget.style.background = '#f3f4f6';
              }}
            >
              📋 ทั้งหมด ({incidents.length})
            </button>
            <button
              onClick={() => setActiveTab('new')}
              style={{
                flex: '1',
                minWidth: '150px',
                padding: '12px 20px',
                background: activeTab === 'new' ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)' : '#f3f4f6',
                color: activeTab === 'new' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'new' ? '0 4px 6px rgba(244, 63, 94, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'new') e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'new') e.currentTarget.style.background = '#f3f4f6';
              }}
            >
              🆕 เหตุการณ์ใหม่ ({incidents.filter(i => i.status === 'PENDING').length})
            </button>
            <button
              onClick={() => setActiveTab('ongoing')}
              style={{
                flex: '1',
                minWidth: '150px',
                padding: '12px 20px',
                background: activeTab === 'ongoing' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f3f4f6',
                color: activeTab === 'ongoing' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'ongoing' ? '0 4px 6px rgba(59, 130, 246, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'ongoing') e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'ongoing') e.currentTarget.style.background = '#f3f4f6';
              }}
            >
              🔄 กำลังดำเนินการ ({incidents.filter(i => i.status === 'IN_PROGRESS').length})
            </button>
            <button
              onClick={() => setActiveTab('closed')}
              style={{
                flex: '1',
                minWidth: '150px',
                padding: '12px 20px',
                background: activeTab === 'closed' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#f3f4f6',
                color: activeTab === 'closed' ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'closed' ? '0 4px 6px rgba(16, 185, 129, 0.3)' : 'none'
              }}
              onMouseOver={(e) => {
                if (activeTab !== 'closed') e.currentTarget.style.background = '#e5e7eb';
              }}
              onMouseOut={(e) => {
                if (activeTab !== 'closed') e.currentTarget.style.background = '#f3f4f6';
              }}
            >
              ✅ เสร็จสิ้น ({incidents.filter(i => i.status === 'RESOLVED' || i.status === 'CLOSED').length})
            </button>
          </div>

          {/* Incidents List */}
          <div style={{ display: 'grid', gap: '20px', marginTop: '20px' }}>
            {filteredIncidents.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '80px 20px',
                borderRadius: '16px',
                textAlign: 'center',
                color: '#6b7280',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '2px dashed #e5e7eb'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#374151' }}>ไม่พบเหตุการณ์</h3>
                <p style={{ fontSize: '15px' }}>ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
              </div>
            ) : (
              filteredIncidents.map(incident => (
                <div key={incident.id} style={{
                  background: 'white',
                  padding: window.innerWidth < 768 ? '16px' : '24px',
                  borderRadius: '16px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
                  borderLeft: `5px solid ${getPriorityColor(incident.priority)}`,
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.12)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.07)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px', color: '#111827', lineHeight: '1.4' }}>
                        {incident.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', color: '#6b7280' }}>
                        {incident.village && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ fontSize: '16px' }}>📍</span> {incident.village.name}
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '16px' }}>🏷️</span> {getDisasterTypeLabel(incident.disasterType)}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '16px' }}>👤</span> {incident.createdBy.firstName} {incident.createdBy.lastName}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '16px' }}>🕐</span> {new Date(incident.createdAt).toLocaleString('th-TH')}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: 'white',
                        background: getPriorityColor(incident.priority),
                        boxShadow: `0 2px 4px ${getPriorityColor(incident.priority)}40`,
                        whiteSpace: 'nowrap'
                      }}>
                        ⚡ {getPriorityLabel(incident.priority)}
                      </span>
                      <span style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '700',
                        color: 'white',
                        background: getStatusColor(incident.status),
                        boxShadow: `0 2px 4px ${getStatusColor(incident.status)}40`,
                        whiteSpace: 'nowrap'
                      }}>
                        {incident.status === 'PENDING' && '🆕'}
                        {incident.status === 'IN_PROGRESS' && '🔄'}
                        {(incident.status === 'RESOLVED' || incident.status === 'CLOSED') && '✅'}
                        {' '}{getStatusLabel(incident.status)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {incident.description && (
                    <div style={{
                      padding: '16px',
                      background: '#f9fafb',
                      borderRadius: '10px',
                      marginBottom: '16px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6', margin: 0 }}>
                        💬 {incident.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid #e5e7eb',
                    flexWrap: 'wrap',
                    width: '100%'
                  }}>
                    <button
                      onClick={() => handleViewDetails(incident)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                      onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
                    >
                      👁️ ดูรายละเอียด
                    </button>

                    {incident.status === 'PENDING' && (
                      <button
                        onClick={() => handleAssign(incident)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
                      >
                        🎯 มอบหมายงาน
                      </button>
                    )}

                    {incident.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleClose(incident)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = '#4b5563'}
                        onMouseOut={(e) => e.currentTarget.style.background = '#6b7280'}
                      >
                        ✅ ปิดงาน
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modals */}
        {selectedIncident && (
          <>
            <IncidentDetailsModal
              incidentId={selectedIncident.id}
              isOpen={showDetailsModal}
              onClose={() => {
                setShowDetailsModal(false);
                setSelectedIncident(null);
              }}
              onUpdate={() => setRefreshKey(prev => prev + 1)}
            />
            <AssignIncidentModal
              isOpen={showAssignModal}
              onClose={() => {
                setShowAssignModal(false);
                setSelectedIncident(null);
              }}
              incident={selectedIncident}
              onSuccess={handleAssignSuccess}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
