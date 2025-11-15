/**
 * Operational Reports Page - Supervisor
 * รายงานการปฏิบัติงาน
 */

import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import './SupervisorDashboard.css';

export default function OperationalReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');

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
          <h2>ตัวอย่างรายงาน</h2>
          <div className="placeholder-content">
            <div className="placeholder-icon">📄</div>
            <h3>รายงาน{reportType === 'daily' ? 'ประจำวัน' : reportType === 'weekly' ? 'ประจำสัปดาห์' : reportType === 'monthly' ? 'ประจำเดือน' : 'กำหนดเอง'}</h3>
            <p>หน้านี้อยู่ระหว่างการพัฒนา</p>
            <ul className="feature-list">
              <li>✅ รายงานสรุปเหตุการณ์</li>
              <li>✅ รายงานประสิทธิภาพทีม</li>
              <li>✅ รายงานเวลาตอบสนอง</li>
              <li>✅ รายงานความเสียหาย</li>
              <li>✅ Export เป็น PDF/Excel</li>
            </ul>
            <button className="btn-primary" style={{ marginTop: '20px' }}>
              📥 ดาวน์โหลดรายงาน
            </button>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
