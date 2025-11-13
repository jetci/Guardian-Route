/**
 * Survey Analysis Page - Shared (Supervisor & Executive)
 * วิเคราะห์ข้อมูลสำรวจ
 */

export default function SurveyAnalysisPage() {
  return (
    <div className="analysis-dashboard">
      <div className="dashboard-header">
        <h1>📊 วิเคราะห์ข้อมูลสำรวจ (Survey Analysis)</h1>
        <p className="subtitle">แสดงข้อมูลผลการสำรวจเชิงพื้นที่ทั้งหมด</p>
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <h2>แผนที่ซ้อนทับพื้นที่สำรวจ</h2>
          <div className="map-container" style={{ height: '500px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="placeholder-content">
              <div className="placeholder-icon">🗺️</div>
              <h3>แผนที่วิเคราะห์</h3>
              <p>แสดงขอบเขตพื้นที่ซ้อนทับกัน</p>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-value">45</div>
            <div className="stat-label">พื้นที่สำรวจทั้งหมด</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📏</div>
            <div className="stat-value">12.5 ตร.กม.</div>
            <div className="stat-label">พื้นที่รวม</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-value">8</div>
            <div className="stat-label">พื้นที่เสี่ยงสูง</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-value">1,234</div>
            <div className="stat-label">ประชากรได้รับผลกระทบ</div>
          </div>
        </div>

        <div className="content-card">
          <h2>รายการพื้นที่สำรวจ</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>หมู่บ้าน</th>
                <th>ประเภทภัย</th>
                <th>พื้นที่ (ตร.กม.)</th>
                <th>ความรุนแรง</th>
                <th>ผู้สำรวจ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>13 พ.ย. 67</td>
                <td>หมู่ 5</td>
                <td>น้ำท่วม</td>
                <td>0.8</td>
                <td><span className="severity-badge high">รุนแรง</span></td>
                <td>สมชาย ใจดี</td>
              </tr>
              <tr>
                <td>12 พ.ย. 67</td>
                <td>หมู่ 12</td>
                <td>ดินถล่ม</td>
                <td>0.3</td>
                <td><span className="severity-badge medium">ปานกลาง</span></td>
                <td>วิชัย ขยัน</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="content-card">
          <div className="placeholder-content">
            <p>💡 หน้านี้จะแสดงการวิเคราะห์เชิงลึกด้วย Charts และ Heatmaps</p>
          </div>
        </div>
      </div>
    </div>
  );
}
