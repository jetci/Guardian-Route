/**
 * Manage Data Page - Admin
 * จัดการข้อมูล
 */

import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function ManageDataPage() {
  return (
    <DashboardLayout>
      <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>💾 จัดการข้อมูล (Manage Data)</h1>
        <p className="subtitle">อัปโหลดและอัปเดตข้อมูลหลักของระบบ</p>
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <h2>อัปโหลดข้อมูล GeoJSON</h2>
          <div className="upload-section">
            <div className="upload-box">
              <div className="upload-icon">📁</div>
              <p>ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <p className="upload-hint">รองรับ: .geojson, .json</p>
              <button className="btn-primary">เลือกไฟล์</button>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>ข้อมูลที่มีอยู่</h2>
          <div className="data-list">
            <div className="data-item">
              <span className="data-icon">🗺️</span>
              <div className="data-info">
                <h3>ขอบเขตหมู่บ้าน (20 หมู่บ้าน)</h3>
                <p>อัปเดตล่าสุด: 13 พ.ย. 2567</p>
              </div>
              <button className="btn-secondary">ดาวน์โหลด</button>
            </div>
            <div className="data-item">
              <span className="data-icon">⚠️</span>
              <div className="data-info">
                <h3>พื้นที่เสี่ยงภัย</h3>
                <p>อัปเดตล่าสุด: 10 พ.ย. 2567</p>
              </div>
              <button className="btn-secondary">ดาวน์โหลด</button>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="placeholder-content">
            <div className="placeholder-icon">💾</div>
            <h3>จัดการข้อมูล</h3>
            <p>หน้านี้อยู่ระหว่างการพัฒนา</p>
            <ul className="feature-list">
              <li>✅ อัปโหลด GeoJSON</li>
              <li>✅ จัดการข้อมูลหมู่บ้าน</li>
              <li>✅ จัดการพื้นที่เสี่ยงภัย</li>
              <li>✅ Import/Export ข้อมูล</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
