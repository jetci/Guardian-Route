/**
 * Village Boundaries Page - Admin
 * กำหนดขอบเขตหมู่บ้าน
 */

export default function VillageBoundariesPage() {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>🌐 กำหนดขอบเขตหมู่บ้าน (Define Village Boundaries)</h1>
        <p className="subtitle">เครื่องมือเชิงแผนที่สำหรับวาดและแก้ไขขอบเขตหมู่บ้าน</p>
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <h2>แผนที่ตำบลเวียง</h2>
          <div className="map-container" style={{ height: '500px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="placeholder-content">
              <div className="placeholder-icon">🗺️</div>
              <h3>แผนที่แบบ Interactive</h3>
              <p>หน้านี้อยู่ระหว่างการพัฒนา</p>
              <ul className="feature-list">
                <li>✅ วาดขอบเขตหมู่บ้าน</li>
                <li>✅ แก้ไขขอบเขตที่มีอยู่</li>
                <li>✅ ลบขอบเขต</li>
                <li>✅ Import/Export GeoJSON</li>
                <li>✅ บันทึกลง Database</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>รายชื่อหมู่บ้าน (20 หมู่บ้าน)</h2>
          <div className="village-list">
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(num => (
              <div key={num} className="village-item">
                <span>หมู่ {num}</span>
                <span className="status-badge">✅ มีขอบเขต</span>
                <button className="btn-edit">✏️ แก้ไข</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
