/**
 * Operational Reports Page - Supervisor
 * รายงานการปฏิบัติงาน
 */

import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import './SupervisorDashboard.css';

export default function OperationalReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [startDate, setStartDate] = useState<Date | null>(new Date(2025, 10, 1)); // Nov 1, 2025
  const [endDate, setEndDate] = useState<Date | null>(new Date(2025, 10, 19)); // Nov 19, 2025

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
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
                สรุปรายงาน
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>เหตุการณ์ทั้งหมด</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>24</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>เหตุการณ์ด่วน</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444' }}>3</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>เสร็จสิ้น</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>18</div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>กำลังดำเนินการ</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>6</div>
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
                onClick={() => alert('กำลังสร้างรายงาน PDF...')}
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
                onClick={() => alert('กำลังสร้างรายงาน Excel...')}
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
                onClick={() => alert('กำลังพิมพ์รายงาน...')}
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
