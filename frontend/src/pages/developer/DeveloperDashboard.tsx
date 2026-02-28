import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import './DeveloperDashboard.css';

export default function DeveloperDashboard() {
  return (
    <DashboardLayout>
      <div className="developer-dashboard">
        {/* Header */}
        <header className="dev-header">
          <div className="dev-header-content">
            <h1>👨‍💻 Developer Dashboard</h1>
            <p>ภาพรวมและเครื่องมือทดสอบทั้งระบบ - Full System Access</p>
          </div>
        </header>

        {/* Quick Stats */}
        <div className="dev-stats-grid">
          <div className="dev-stat-card purple">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <h3>6</h3>
              <p>Menu Sections</p>
            </div>
          </div>
          <div className="dev-stat-card blue">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>20+</h3>
              <p>Quick Access Links</p>
            </div>
          </div>
          <div className="dev-stat-card green">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>4</h3>
              <p>Role Views</p>
            </div>
          </div>
          <div className="dev-stat-card orange">
            <div className="stat-icon">🧪</div>
            <div className="stat-content">
              <h3>2</h3>
              <p>Testing Shortcuts</p>
            </div>
          </div>
        </div>

        {/* Main Menu Sections */}
        <div className="dev-menu-sections">

          {/* 1. Testing Forms */}
          <section className="dev-menu-section testing">
            <div className="section-header">
              <h2>🧪 Testing Forms</h2>
              <span className="badge dev-only">Dev Only</span>
            </div>
            <p className="section-description">
              ทางลัดเข้าถึงฟอร์มต่างๆ โดยไม่ต้องผ่าน Workflow - สำหรับทดสอบ UI และ Validation
            </p>
            <div className="menu-grid">
              <Link to="/developer/test/create-report" className="menu-card">
                <div className="menu-icon">📝</div>
                <div className="menu-content">
                  <h3>Test: Create Report</h3>
                  <p>ทดสอบฟอร์มรายงานเหตุด่วนสาธารณภัย</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/developer/test/survey-form" className="menu-card">
                <div className="menu-icon">🗺️</div>
                <div className="menu-content">
                  <h3>Test: Survey Form</h3>
                  <p>ทดสอบแผนที่สำรวจและ Leaflet Draw</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>
            </div>
          </section>

          {/* 2. Field Officer Views */}
          <section className="dev-menu-section field-officer">
            <div className="section-header">
              <h2>🎯 Field Officer Views</h2>
              <span className="badge operational">Operational Level</span>
            </div>
            <p className="section-description">
              มุมมองและเครื่องมือสำหรับเจ้าหน้าที่ภาคสนาม
            </p>
            <div className="menu-grid">
              <Link to="/field-officer/tasks" className="menu-card">
                <div className="menu-icon">📋</div>
                <div className="menu-content">
                  <h3>งานของฉัน</h3>
                  <p>รายการงานที่ได้รับมอบหมาย</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/developer/field-officer/workflow" className="menu-card">
                <div className="menu-icon">🔄</div>
                <div className="menu-content">
                  <h3>ขั้นตอนการทำงาน</h3>
                  <p>Workflow Diagram และคำอธิบาย</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/supervisor/map" className="menu-card">
                <div className="menu-icon">🗺️</div>
                <div className="menu-content">
                  <h3>แผนที่และรายงาน</h3>
                  <p>แผนที่แสดงจุดเกิดเหตุ</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/reports" className="menu-card">
                <div className="menu-icon">📊</div>
                <div className="menu-content">
                  <h3>ประวัติการรายงาน</h3>
                  <p>ดูสถานะรายงานที่ส่งไปแล้ว</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>
            </div>
          </section>

          {/* 3. Supervisor Views */}
          <section className="dev-menu-section supervisor">
            <div className="section-header">
              <h2>👨‍💼 Supervisor Views</h2>
              <span className="badge command">Command Level</span>
            </div>
            <p className="section-description">
              เครื่องมือสั่งการและบริหารจัดการทีม
            </p>
            <div className="menu-grid">
              <Link to="/supervisor" className="menu-card">
                <div className="menu-icon">🎛️</div>
                <div className="menu-content">
                  <h3>แดชบอร์ดบัญชาการ</h3>
                  <p>หน้าจอ Map-based สำหรับดูสถานการณ์สด</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/supervisor/incidents" className="menu-card">
                <div className="menu-icon">🚨</div>
                <div className="menu-content">
                  <h3>จัดการเหตุการณ์</h3>
                  <p>ตารางรายการเหตุการณ์และการอนุมัติ</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/developer/supervisor/team" className="menu-card">
                <div className="menu-icon">👥</div>
                <div className="menu-content">
                  <h3>ภาพรวมทีม</h3>
                  <p>สถานะ Online/Offline ของลูกทีม</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/analysis/survey" className="menu-card">
                <div className="menu-icon">📈</div>
                <div className="menu-content">
                  <h3>วิเคราะห์ข้อมูลสำรวจ</h3>
                  <p>ซ้อนทับเลเยอร์ข้อมูลเพื่อวิเคราะห์</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>
            </div>
          </section>

          {/* 4. Executive Views */}
          <section className="dev-menu-section executive">
            <div className="section-header">
              <h2>💼 Executive Views</h2>
              <span className="badge strategic">Strategic Level</span>
            </div>
            <p className="section-description">
              ภาพรวมระดับผู้บริหารและรายงานสรุป
            </p>
            <div className="menu-grid">
              <Link to="/executive-dashboard" className="menu-card">
                <div className="menu-icon">📊</div>
                <div className="menu-content">
                  <h3>แดชบอร์ดสรุป</h3>
                  <p>กราฟและตัวเลขสถิติภาพรวม (KPIs)</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/developer/executive/reports" className="menu-card">
                <div className="menu-icon">📑</div>
                <div className="menu-content">
                  <h3>รายงานและสถิติ</h3>
                  <p>กราฟแนวโน้มและตารางข้อมูลละเอียด</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/developer/executive/budget" className="menu-card">
                <div className="menu-icon">💰</div>
                <div className="menu-content">
                  <h3>ภาพรวมงบประมาณ</h3>
                  <p>ติดตามค่าใช้จ่ายและทรัพยากร</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>
            </div>
          </section>

          {/* 5. Admin Views */}
          <section className="dev-menu-section admin">
            <div className="section-header">
              <h2>⚙️ Admin Views</h2>
              <span className="badge backoffice">Back-office</span>
            </div>
            <p className="section-description">
              เครื่องมือจัดการระบบและข้อมูลพื้นฐาน
            </p>
            <div className="menu-grid">
              <Link to="/admin/dashboard" className="menu-card">
                <div className="menu-icon">🖥️</div>
                <div className="menu-content">
                  <h3>แดชบอร์ดระบบ</h3>
                  <p>ดูสถานะ Server (Health Check)</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/manage-users" className="menu-card">
                <div className="menu-icon">👥</div>
                <div className="menu-content">
                  <h3>จัดการผู้ใช้</h3>
                  <p>เพิ่ม/ลบ/แก้ไข User</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/developer/admin/data" className="menu-card">
                <div className="menu-icon">📦</div>
                <div className="menu-content">
                  <h3>จัดการข้อมูล</h3>
                  <p>อัปโหลดไฟล์ GeoJSON พื้นฐาน</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/admin/villages" className="menu-card">
                <div className="menu-icon">🗺️</div>
                <div className="menu-content">
                  <h3>กำหนดขอบเขตหมู่บ้าน</h3>
                  <p>วาด/แก้ไขเส้นขอบเขตการปกครอง</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/settings" className="menu-card">
                <div className="menu-icon">⚙️</div>
                <div className="menu-content">
                  <h3>ตั้งค่า</h3>
                  <p>Config ระบบต่างๆ (6 tabs)</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/admin/audit-logs" className="menu-card">
                <div className="menu-icon">📜</div>
                <div className="menu-content">
                  <h3>Audit Log</h3>
                  <p>ดูประวัติการใช้งานระบบ</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>
            </div>
          </section>

          {/* 6. Documentation */}
          <section className="dev-menu-section documentation">
            <div className="section-header">
              <h2>📚 Documentation</h2>
              <span className="badge docs">Docs</span>
            </div>
            <p className="section-description">
              เอกสารและคู่มือสำหรับนักพัฒนา
            </p>
            <div className="menu-grid">
              <Link to="/developer-handbook" className="menu-card">
                <div className="menu-icon">📖</div>
                <div className="menu-content">
                  <h3>คู่มือนักพัฒนา</h3>
                  <p>Tech Stack, Coding Standard และ Architecture</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>

              <Link to="/developer/api-docs" className="menu-card">
                <div className="menu-icon">🔌</div>
                <div className="menu-content">
                  <h3>API Documentation</h3>
                  <p>REST API Endpoints และ Examples</p>
                </div>
                <div className="menu-arrow">→</div>
              </Link>
            </div>
          </section>

        </div>
      </div>
    </DashboardLayout>
  );
}
