/**
 * Operational Reports Page - Supervisor
 * รายงานการปฏิบัติงาน
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import { analyticsApi } from '../../api/analytics';
import toast from 'react-hot-toast';


export default function OperationalReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [stats, setStats] = useState({
    totalIncidents: 0,
    urgentIncidents: 0, // Note: Backend currently returns resolutionRate instead of urgent count in overview
    resolvedIncidents: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default dates based on report type
    const now = new Date();
    if (reportType === 'daily') {
      setStartDate(now);
      setEndDate(now);
    } else if (reportType === 'weekly') {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      setStartDate(start);
      setEndDate(now);
    } else if (reportType === 'monthly') {
      const start = new Date(now);
      start.setMonth(now.getMonth() - 1);
      setStartDate(start);
      setEndDate(now);
    }
  }, [reportType]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await analyticsApi.getIncidentOverview({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      });

      // Calculate derived stats or use what's available
      // Note: Backend returns totalIncidents, resolutionRate, activeUsers
      // We might need to fetch more detailed stats if we want urgent count

      setStats({
        totalIncidents: response.totalIncidents,
        urgentIncidents: 0, // TODO: Add endpoint for urgent count by date range
        resolvedIncidents: Math.round(response.totalIncidents * (response.resolutionRate / 100)),
        activeUsers: response.activeUsers
      });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลรายงานได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="supervisor-dashboard">
        <div className="dashboard-header">
          <h1>📄 รายงานการปฏิบัติงาน (Operational Reports)</h1>
          <p className="subtitle">สร้างและดาวน์โหลดรายงานสรุปการปฏิบัติงาน</p>
        </div>

        <div className="dashboard-content">
          {/* Report Type Selection */}
          <div className="content-card">
            <h2>เลือกประเภทรายงาน</h2>
            <div className="report-types">
              <button
                className={`report-type-btn ${reportType === 'daily' ? 'active' : ''}`}
                onClick={() => setReportType('daily')}
              >
                📅 รายงานประจำวัน
              </button>
              <button
                className={`report-type-btn ${reportType === 'weekly' ? 'active' : ''}`}
                onClick={() => setReportType('weekly')}
              >
                📊 รายงานประจำสัปดาห์
              </button>
              <button
                className={`report-type-btn ${reportType === 'monthly' ? 'active' : ''}`}
                onClick={() => setReportType('monthly')}
              >
                📈 รายงานประจำเดือน
              </button>
              <button
                className={`report-type-btn ${reportType === 'custom' ? 'active' : ''}`}
                onClick={() => setReportType('custom')}
              >
                🎯 กำหนดเอง
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div className="content-card">
            <h2>📊 รายงาน{reportType === 'daily' ? 'ประจำวัน' : reportType === 'weekly' ? 'ประจำสัปดาห์' : reportType === 'monthly' ? 'ประจำเดือน' : 'กำหนดเอง'}</h2>

            {/* Date Range Selector */}
            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '16px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                  วันที่เริ่มต้น
                </label>
                <ThaiDatePicker
                  id="report-start-date"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="เลือกวันที่เริ่มต้น"
                />
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: '#374151' }}>
                  วันที่สิ้นสุด
                </label>
                <ThaiDatePicker
                  id="report-end-date"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="เลือกวันที่สิ้นสุด"
                />
              </div>
            </div>

            {/* Report Summary */}
            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              position: 'relative'
            }}>
              {loading && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}>
                  <div className="spinner"></div>
                </div>
              )}

              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                สรุปรายงาน
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>เหตุการณ์ทั้งหมด</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>{stats.totalIncidents}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>เสร็จสิ้น</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{stats.resolvedIncidents}</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>เจ้าหน้าที่ปฏิบัติงาน</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{stats.activeUsers}</div>
                </div>
              </div>
            </div>

            {/* Report Sections */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                📋 รายการในรายงาน
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  ✅ รายงานสรุปเหตุการณ์ทั้งหมด
                </li>
                <li style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  ✅ รายงานประสิทธิภาพทีมงาน
                </li>
                <li style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  ✅ รายงานเวลาตอบสนองเฉลี่ย
                </li>
                <li style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  ✅ รายงานความเสียหายและค่าใช้จ่าย
                </li>
                <li style={{ padding: '10px', background: '#f9fafb', borderRadius: '6px', marginBottom: '8px', fontSize: '14px' }}>
                  ✅ กราฟและแผนภูมิสถิติ
                </li>
              </ul>
            </div>

            {/* Export Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => toast.success('กำลังสร้างรายงาน PDF... (Coming Soon)')}
                style={{
                  padding: '10px 20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📄 ดาวน์โหลด PDF
              </button>
              <button
                onClick={() => toast.success('กำลังสร้างรายงาน Excel... (Coming Soon)')}
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                📊 ดาวน์โหลด Excel
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '10px 20px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                🖨️ พิมพ์รายงาน
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
