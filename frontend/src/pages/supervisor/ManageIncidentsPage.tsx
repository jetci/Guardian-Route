/**
 * Manage Incidents Page - Supervisor
 * จัดการเหตุการณ์ทั้งหมด
 */

import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import toast from 'react-hot-toast';
import './SupervisorDashboard.css';

interface Incident {
  id: number;
  title: string;
  type: string;
  priority: 'สูงมาก' | 'สูง' | 'ปานกลาง' | 'ต่ำ';
  status: 'ใหม่' | 'กำลังดำเนินการ' | 'เสร็จสิ้น';
  village: string;
  officer: string | null;
  reportedBy: string;
  date: string;
  description: string;
}

export default function ManageIncidentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'ongoing' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVillage, setFilterVillage] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Mock data - 6 incidents
  const allIncidents: Incident[] = [
    {
      id: 1,
      title: 'น้ำท่วมฉับพลัน - บ้านหนองบัว',
      type: 'น้ำท่วม',
      priority: 'สูงมาก',
      status: 'ใหม่',
      village: 'หมู่ 3',
      officer: null,
      reportedBy: 'นายสมชาย ใจดี',
      date: '2025-11-19 08:30',
      description: 'น้ำท่วมสูง 1.5 เมตร บ้านเรือนได้รับความเสียหาย'
    },
    {
      id: 2,
      title: 'ดินถล่ม - เขาใหญ่',
      type: 'ดินถล่ม',
      priority: 'สูง',
      status: 'กำลังดำเนินการ',
      village: 'หมู่ 5',
      officer: 'นางสาวสมหญิง รักดี',
      reportedBy: 'นายวิชัย สุขสันต์',
      date: '2025-11-19 07:15',
      description: 'ดินถล่มขวางถนน ต้องการเครื่องจักรกล'
    },
    {
      id: 3,
      title: 'ไฟไหม้ป่า - ป่าดงยาง',
      type: 'ไฟไหม้',
      priority: 'สูง',
      status: 'กำลังดำเนินการ',
      village: 'หมู่ 8',
      officer: 'นายประสิทธิ์ มั่นคง',
      reportedBy: 'นายสมศักดิ์ ใจกล้า',
      date: '2025-11-18 16:45',
      description: 'ไฟไหม้ป่าลุกลามเร็ว พื้นที่ประมาณ 10 ไร่'
    },
    {
      id: 4,
      title: 'แผ่นดินไหว - ตำบลเวียง',
      type: 'แผ่นดินไหว',
      priority: 'ปานกลาง',
      status: 'เสร็จสิ้น',
      village: 'หมู่ 12',
      officer: 'นางสาววิภา สุขใจ',
      reportedBy: 'นายสมบูรณ์ ดีงาม',
      date: '2025-11-17 09:20',
      description: 'แผ่นดินไหว 3.5 ริกเตอร์ ไม่มีผู้บาดเจ็บ'
    },
    {
      id: 5,
      title: 'ถนนชำรุด - สันทรายคองน้อย',
      type: 'โครงสร้าง',
      priority: 'ต่ำ',
      status: 'เสร็จสิ้น',
      village: 'หมู่ 6',
      officer: 'นายสมศักดิ์ ใจกล้า',
      reportedBy: 'นายวิทยา รักษ์ดี',
      date: '2025-11-16 14:20',
      description: 'ถนนชำรุดหลุมบ่อ ต้องการซ่อมแซม'
    },
    {
      id: 6,
      title: 'อุทกภัย - หมู่บ้านริมน้ำ',
      type: 'น้ำท่วม',
      priority: 'สูง',
      status: 'ใหม่',
      village: 'หมู่ 10',
      officer: null,
      reportedBy: 'นางสาวสุดา เก่งงาน',
      date: '2025-11-19 10:00',
      description: 'น้ำท่วมบ้านเรือน ประชาชนต้องการความช่วยเหลือ'
    }
  ];

  // Filter incidents
  const filteredIncidents = allIncidents.filter(incident => {
    // Tab filter
    if (activeTab === 'new' && incident.status !== 'ใหม่') return false;
    if (activeTab === 'ongoing' && incident.status !== 'กำลังดำเนินการ') return false;
    if (activeTab === 'closed' && incident.status !== 'เสร็จสิ้น') return false;

    // Search filter
    if (searchQuery && !incident.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Village filter
    if (filterVillage !== 'all' && incident.village !== filterVillage) return false;

    // Priority filter
    if (filterPriority !== 'all' && incident.priority !== filterPriority) return false;

    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'สูงมาก': return '#dc2626';
      case 'สูง': return '#f59e0b';
      case 'ปานกลาง': return '#3b82f6';
      case 'ต่ำ': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ใหม่': return '#ef4444';
      case 'กำลังดำเนินการ': return '#3b82f6';
      case 'เสร็จสิ้น': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleAssign = (incident: Incident) => {
    toast.success(`🎯 มอบหมายงาน: ${incident.title}`);
  };

  const handleViewDetails = (incident: Incident) => {
    toast.success(`👁️ ดูรายละเอียด: ${incident.title}`);
  };

  const handleClose = (incident: Incident) => {
    toast.success(`✅ ปิดงาน: ${incident.title}`);
  };

  return (
    <DashboardLayout>
      <div className="supervisor-dashboard">
        <div className="dashboard-header">
          <h1>⚠️ จัดการเหตุการณ์ (Manage Incidents)</h1>
          <p className="subtitle">ศูนย์กลางการจัดการเหตุการณ์ภัยพิบัติทั้งหมด</p>
        </div>

        <div className="dashboard-content">
          {/* Search and Filters */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {/* Search */}
              <input
                type="text"
                placeholder="🔍 ค้นหาเหตุการณ์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: '1',
                  minWidth: '200px',
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />

              {/* Village Filter */}
              <select
                value={filterVillage}
                onChange={(e) => setFilterVillage(e.target.value)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="all">📍 ทุกหมู่บ้าน</option>
                <option value="หมู่ 3">หมู่ 3</option>
                <option value="หมู่ 5">หมู่ 5</option>
                <option value="หมู่ 6">หมู่ 6</option>
                <option value="หมู่ 8">หมู่ 8</option>
                <option value="หมู่ 10">หมู่ 10</option>
                <option value="หมู่ 12">หมู่ 12</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                <option value="all">⚡ ทุกระดับ</option>
                <option value="สูงมาก">สูงมาก</option>
                <option value="สูง">สูง</option>
                <option value="ปานกลาง">ปานกลาง</option>
                <option value="ต่ำ">ต่ำ</option>
              </select>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterVillage('all');
                  setFilterPriority('all');
                }}
                style={{
                  padding: '10px 20px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                🔄 รีเซ็ต
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              📋 ทั้งหมด ({allIncidents.length})
            </button>
            <button 
              className={`tab ${activeTab === 'new' ? 'active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              🆕 เหตุการณ์ใหม่ ({allIncidents.filter(i => i.status === 'ใหม่').length})
            </button>
            <button 
              className={`tab ${activeTab === 'ongoing' ? 'active' : ''}`}
              onClick={() => setActiveTab('ongoing')}
            >
              🔄 กำลังดำเนินการ ({allIncidents.filter(i => i.status === 'กำลังดำเนินการ').length})
            </button>
            <button 
              className={`tab ${activeTab === 'closed' ? 'active' : ''}`}
              onClick={() => setActiveTab('closed')}
            >
              ✅ เสร็จสิ้น ({allIncidents.filter(i => i.status === 'เสร็จสิ้น').length})
            </button>
          </div>

          {/* Incidents List */}
          <div style={{ display: 'grid', gap: '16px', marginTop: '20px' }}>
            {filteredIncidents.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '60px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>ไม่พบเหตุการณ์</h3>
                <p>ลองเปลี่ยนตัวกรองหรือคำค้นหา</p>
              </div>
            ) : (
              filteredIncidents.map(incident => (
                <div key={incident.id} style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  borderLeft: `4px solid ${getPriorityColor(incident.priority)}`
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
                        {incident.title}
                      </h3>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '14px', color: '#6b7280' }}>
                        <span>📍 {incident.village}</span>
                        <span>🏷️ {incident.type}</span>
                        <span>👤 รายงานโดย: {incident.reportedBy}</span>
                        <span>🕐 {incident.date}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        background: getPriorityColor(incident.priority)
                      }}>
                        {incident.priority}
                      </span>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'white',
                        background: getStatusColor(incident.status)
                      }}>
                        {incident.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>
                    {incident.description}
                  </p>

                  {/* Officer */}
                  {incident.officer && (
                    <div style={{
                      padding: '8px 12px',
                      background: '#f3f4f6',
                      borderRadius: '6px',
                      fontSize: '14px',
                      marginBottom: '12px'
                    }}>
                      👮 เจ้าหน้าที่: <strong>{incident.officer}</strong>
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    paddingTop: '12px',
                    borderTop: '1px solid #e5e7eb'
                  }}>
                    <button
                      onClick={() => handleViewDetails(incident)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      👁️ ดูรายละเอียด
                    </button>

                    {incident.status !== 'เสร็จสิ้น' && !incident.officer && (
                      <button
                        onClick={() => handleAssign(incident)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        🎯 มอบหมายงาน
                      </button>
                    )}

                    {incident.status === 'กำลังดำเนินการ' && (
                      <button
                        onClick={() => handleClose(incident)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
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
      </div>
    </DashboardLayout>
  );
}
