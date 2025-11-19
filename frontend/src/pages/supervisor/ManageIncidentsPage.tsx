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
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState('');

  // Mock data - 6 incidents (ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่)
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
      description: 'น้ำท่วมสูง 1.5 เมตร บ้านเรือนได้รับความเสียหาย บริเวณบ้านหนองบัว หมู่ 3 ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่'
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
      description: 'ดินถล่มขวางถนน ต้องการเครื่องจักรกล บริเวณเขาใหญ่ หมู่ 5 ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่'
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
      description: 'ไฟไหม้ป่าลุกลามเร็ว พื้นที่ประมาณ 10 ไร่ บริเวณป่าดงยาง หมู่ 8 ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่'
    },
    {
      id: 4,
      title: 'แผ่นดินไหว - ศูนย์กลางตำบล',
      type: 'แผ่นดินไหว',
      priority: 'ปานกลาง',
      status: 'เสร็จสิ้น',
      village: 'หมู่ 1',
      officer: 'นางสาววิภา สุขใจ',
      reportedBy: 'นายสมบูรณ์ ดีงาม',
      date: '2025-11-17 09:20',
      description: 'แผ่นดินไหว 3.5 ริกเตอร์ ไม่มีผู้บาดเจ็บ ศูนย์กลางตำบลเวียง หมู่ 1 อำเภอฝาง จังหวัดเชียงใหม่'
    },
    {
      id: 5,
      title: 'ถนนชำรุด - บ้านสันทราย',
      type: 'โครงสร้าง',
      priority: 'ต่ำ',
      status: 'เสร็จสิ้น',
      village: 'หมู่ 6',
      officer: 'นายสมศักดิ์ ใจกล้า',
      reportedBy: 'นายวิทยา รักษ์ดี',
      date: '2025-11-16 14:20',
      description: 'ถนนชำรุดหลุมบ่อ ต้องการซ่อมแซม บริเวณบ้านสันทราย หมู่ 6 ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่'
    },
    {
      id: 6,
      title: 'อุทกภัย - บ้านริมน้ำ',
      type: 'น้ำท่วม',
      priority: 'สูง',
      status: 'ใหม่',
      village: 'หมู่ 10',
      officer: null,
      reportedBy: 'นางสาวสุดา เก่งงาน',
      date: '2025-11-19 10:00',
      description: 'น้ำท่วมบ้านเรือน ประชาชนต้องการความช่วยเหลือ บริเวณบ้านริมน้ำ หมู่ 10 ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่'
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

  // Mock officers list
  const officers = [
    'นางสาวสมหญิง รักดี',
    'นายประสิทธิ์ มั่นคง',
    'นางสาววิภา สุขใจ',
    'นายสมศักดิ์ ใจกล้า',
    'นายวิชัย ขยัน',
    'นางสาวสุดา เก่งงาน'
  ];

  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowDetailsModal(true);
  };

  const handleAssign = (incident: Incident) => {
    setSelectedIncident(incident);
    setShowAssignModal(true);
    setSelectedOfficer('');
  };

  const handleConfirmAssign = () => {
    if (!selectedOfficer) {
      toast.error('กรุณาเลือกเจ้าหน้าที่');
      return;
    }
    toast.success(`✅ มอบหมายงานให้ ${selectedOfficer} สำเร็จ!`);
    setShowAssignModal(false);
    setSelectedIncident(null);
    setSelectedOfficer('');
  };

  const handleClose = (incident: Incident) => {
    if (confirm(`ยืนยันการปิดงาน: ${incident.title}?`)) {
      toast.success(`✅ ปิดงาน: ${incident.title} สำเร็จ!`);
    }
  };

  // Calculate stats
  const stats = {
    total: allIncidents.length,
    new: allIncidents.filter(i => i.status === 'ใหม่').length,
    ongoing: allIncidents.filter(i => i.status === 'กำลังดำเนินการ').length,
    closed: allIncidents.filter(i => i.status === 'เสร็จสิ้น').length,
  };

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
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                📊 ทั้งหมด
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#1f2937' }}>
                {stats.total}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', fontWeight: '600' }}>
                🆕 เหตุการณ์ใหม่
              </div>
              <div style={{ fontSize: '36px', fontWeight: '800', color: '#ef4444' }}>
                {stats.new}
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '20px',
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
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb'
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
                  minWidth: '250px',
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
                  padding: '12px 18px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  background: 'white',
                  outline: 'none'
                }}
              >
                <option value="all">📍 ทุกหมู่บ้าน</option>
                <option value="หมู่ 1">หมู่ 1</option>
                <option value="หมู่ 3">หมู่ 3</option>
                <option value="หมู่ 5">หมู่ 5</option>
                <option value="หมู่ 6">หมู่ 6</option>
                <option value="หมู่ 8">หมู่ 8</option>
                <option value="หมู่ 10">หมู่ 10</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                style={{
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
              📋 ทั้งหมด ({allIncidents.length})
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
              🆕 เหตุการณ์ใหม่ ({allIncidents.filter(i => i.status === 'ใหม่').length})
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
              🔄 กำลังดำเนินการ ({allIncidents.filter(i => i.status === 'กำลังดำเนินการ').length})
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
              ✅ เสร็จสิ้น ({allIncidents.filter(i => i.status === 'เสร็จสิ้น').length})
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
                  padding: '24px',
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
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '16px' }}>📍</span> {incident.village}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '16px' }}>🏷️</span> {incident.type}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '16px' }}>👤</span> {incident.reportedBy}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '16px' }}>🕐</span> {incident.date}
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
                        ⚡ {incident.priority}
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
                        {incident.status === 'ใหม่' && '🆕'}
                        {incident.status === 'กำลังดำเนินการ' && '🔄'}
                        {incident.status === 'เสร็จสิ้น' && '✅'}
                        {' '}{incident.status}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
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

                  {/* Officer */}
                  {incident.officer && (
                    <div style={{
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                      borderRadius: '10px',
                      fontSize: '14px',
                      marginBottom: '16px',
                      border: '1px solid #bfdbfe',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '18px' }}>👮</span>
                      <span style={{ color: '#1e40af' }}>
                        เจ้าหน้าที่: <strong style={{ fontWeight: '700' }}>{incident.officer}</strong>
                      </span>
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

                    {incident.status !== 'เสร็จสิ้น' && !incident.officer && (
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

                    {incident.status === 'กำลังดำเนินการ' && (
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

        {/* Details Modal */}
        {showDetailsModal && selectedIncident && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowDetailsModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '24px',
                borderRadius: '20px 20px 0 0',
                color: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
                      📋 รายละเอียดเหตุการณ์
                    </h2>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                      รหัส: #{selectedIncident.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      fontSize: '20px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {/* Title */}
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                    {selectedIncident.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'white',
                      background: getPriorityColor(selectedIncident.priority),
                      boxShadow: `0 2px 4px ${getPriorityColor(selectedIncident.priority)}40`
                    }}>
                      ⚡ {selectedIncident.priority}
                    </span>
                    <span style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: 'white',
                      background: getStatusColor(selectedIncident.status),
                      boxShadow: `0 2px 4px ${getStatusColor(selectedIncident.status)}40`
                    }}>
                      {selectedIncident.status === 'ใหม่' && '🆕'}
                      {selectedIncident.status === 'กำลังดำเนินการ' && '🔄'}
                      {selectedIncident.status === 'เสร็จสิ้น' && '✅'}
                      {' '}{selectedIncident.status}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>📍 หมู่บ้าน</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedIncident.village}</div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>🏷️ ประเภท</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedIncident.type}</div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>👤 รายงานโดย</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedIncident.reportedBy}</div>
                  </div>
                  <div style={{
                    padding: '16px',
                    background: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>🕐 วันที่</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>{selectedIncident.date}</div>
                  </div>
                </div>

                {/* Description */}
                <div style={{
                  padding: '20px',
                  background: '#f9fafb',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    💬 รายละเอียด
                  </div>
                  <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: 0 }}>
                    {selectedIncident.description}
                  </p>
                </div>

                {/* Officer */}
                {selectedIncident.officer && (
                  <div style={{
                    padding: '16px',
                    background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)',
                    borderRadius: '12px',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <span style={{ fontSize: '24px' }}>👮</span>
                    <div>
                      <div style={{ fontSize: '12px', color: '#1e40af', marginBottom: '2px' }}>เจ้าหน้าที่ผู้รับผิดชอบ</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e40af' }}>
                        {selectedIncident.officer}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  style={{
                    padding: '10px 24px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#374151'
                  }}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && selectedIncident && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowAssignModal(false)}>
            <div style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
            onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '24px',
                borderRadius: '20px 20px 0 0',
                color: 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px' }}>
                      🎯 มอบหมายงาน
                    </h2>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>
                      {selectedIncident.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAssignModal(false)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      fontSize: '20px',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  👮 เลือกเจ้าหน้าที่
                </label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    background: 'white',
                    outline: 'none'
                  }}
                >
                  <option value="">-- เลือกเจ้าหน้าที่ --</option>
                  {officers.map((officer, index) => (
                    <option key={index} value={officer}>{officer}</option>
                  ))}
                </select>

                {selectedOfficer && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: '#f0fdf4',
                    borderRadius: '10px',
                    border: '1px solid #86efac'
                  }}>
                    <div style={{ fontSize: '14px', color: '#15803d' }}>
                      ✅ จะมอบหมายงานให้: <strong>{selectedOfficer}</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  onClick={() => setShowAssignModal(false)}
                  style={{
                    padding: '10px 24px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: '#374151'
                  }}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleConfirmAssign}
                  style={{
                    padding: '10px 24px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    color: 'white',
                    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  ✅ ยืนยันมอบหมาย
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
