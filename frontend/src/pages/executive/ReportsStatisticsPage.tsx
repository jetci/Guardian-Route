/**
 * Reports & Statistics Page - Executive
 * รายงานและสถิติ
 */

import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function ReportsStatisticsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  return (
    <DashboardLayout>
      <div className="executive-dashboard">
      <div className="dashboard-header">
        <h1>📊 รายงานและสถิติ (Reports & Statistics)</h1>
        <p className="subtitle">ข้อมูลเหตุการณ์ย้อนหลังในรูปแบบตารางและกราฟเชิงลึก</p>
      </div>

      <div className="dashboard-content">
        {/* Date Range Selector */}
        <div className="content-card">
          <h2>ช่วงเวลา</h2>
          <div className="date-range-selector">
            <button 
              className={`range-btn ${dateRange === 'week' ? 'active' : ''}`}
              onClick={() => setDateRange('week')}
            >
              7 วันที่ผ่านมา
            </button>
            <button 
              className={`range-btn ${dateRange === 'month' ? 'active' : ''}`}
              onClick={() => setDateRange('month')}
            >
              30 วันที่ผ่านมา
            </button>
            <button 
              className={`range-btn ${dateRange === 'quarter' ? 'active' : ''}`}
              onClick={() => setDateRange('quarter')}
            >
              3 เดือนที่ผ่านมา
            </button>
            <button 
              className={`range-btn ${dateRange === 'year' ? 'active' : ''}`}
              onClick={() => setDateRange('year')}
            >
              1 ปีที่ผ่านมา
            </button>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">24</div>
            <div className="stat-label">เหตุการณ์ทั้งหมด</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">2.5 ชม.</div>
            <div className="stat-label">เวลาตอบสนองเฉลี่ย</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">92%</div>
            <div className="stat-label">อัตราความสำเร็จ</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">156</div>
            <div className="stat-label">ผู้ได้รับผลกระทบ</div>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="content-card">
          <h2>กราฟและแนวโน้ม</h2>
          <div className="placeholder-content">
            <div className="placeholder-icon">📊</div>
            <h3>กราฟสถิติ</h3>
            <p>หน้านี้อยู่ระหว่างการพัฒนา</p>
            <ul className="feature-list">
              <li>✅ กราฟแนวโน้มเหตุการณ์</li>
              <li>✅ กราฟประเภทภัย</li>
              <li>✅ กราฟพื้นที่เสี่ยง</li>
              <li>✅ กราฟเวลาตอบสนอง</li>
              <li>✅ Export ข้อมูล (CSV, Excel, PDF)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
