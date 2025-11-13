/**
 * Manage Incidents Page - Supervisor
 * จัดการเหตุการณ์ทั้งหมด
 */

import { useState } from 'react';
import './SupervisorDashboard.css';

export default function ManageIncidentsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'ongoing' | 'closed'>('all');

  return (
    <div className="supervisor-dashboard">
      <div className="dashboard-header">
        <h1>⚠️ จัดการเหตุการณ์ (Manage Incidents)</h1>
        <p className="subtitle">ศูนย์กลางการจัดการเหตุการณ์ภัยพิบัติทั้งหมด</p>
      </div>

      <div className="dashboard-content">
        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            ทั้งหมด
          </button>
          <button 
            className={`tab ${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            เหตุการณ์ใหม่
          </button>
          <button 
            className={`tab ${activeTab === 'ongoing' ? 'active' : ''}`}
            onClick={() => setActiveTab('ongoing')}
          >
            กำลังดำเนินการ
          </button>
          <button 
            className={`tab ${activeTab === 'closed' ? 'active' : ''}`}
            onClick={() => setActiveTab('closed')}
          >
            เสร็จสิ้น
          </button>
        </div>

        {/* Content */}
        <div className="content-card">
          <div className="placeholder-content">
            <div className="placeholder-icon">⚠️</div>
            <h2>จัดการเหตุการณ์</h2>
            <p>หน้านี้อยู่ระหว่างการพัฒนา</p>
            <ul className="feature-list">
              <li>✅ สร้างเหตุการณ์ใหม่</li>
              <li>✅ มอบหมายงานให้เจ้าหน้าที่</li>
              <li>✅ ตรวจสอบรายงานที่ส่งเข้ามา</li>
              <li>✅ อนุมัติหรือส่งกลับเพื่อแก้ไข</li>
              <li>✅ ปิดเหตุการณ์</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
