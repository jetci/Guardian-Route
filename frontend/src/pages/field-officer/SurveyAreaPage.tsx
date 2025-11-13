/**
 * Survey Area Page - Field Officer
 * สำรวจพื้นที่
 */

export default function SurveyAreaPage() {
  return (
    <div className="field-officer-dashboard">
      <div className="dashboard-header">
        <h1>🔍 สำรวจพื้นที่ (Survey Area)</h1>
        <p className="subtitle">เครื่องมือหลักในการลงพื้นที่สำรวจและบันทึกข้อมูล</p>
      </div>

      <div className="dashboard-content">
        <div className="content-card">
          <h2>แผนที่สำรวจ</h2>
          <div className="map-container" style={{ height: '400px', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="placeholder-content">
              <div className="placeholder-icon">🗺️</div>
              <h3>แผนที่แบบ Interactive</h3>
              <p>วาดขอบเขตพื้นที่ประสบภัยบนแผนที่</p>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>บันทึกข้อมูลการสำรวจ</h2>
          <form className="survey-form">
            <div className="form-group">
              <label>ประเภทภัย</label>
              <select className="form-control">
                <option>เลือกประเภทภัย</option>
                <option>น้ำท่วม</option>
                <option>ดินถล่ม</option>
                <option>อัคคีภัย</option>
                <option>แผ่นดินไหว</option>
              </select>
            </div>
            <div className="form-group">
              <label>ระดับความรุนแรง</label>
              <select className="form-control">
                <option>เลือกระดับ</option>
                <option>เล็กน้อย</option>
                <option>ปานกลาง</option>
                <option>รุนแรง</option>
                <option>รุนแรงมาก</option>
              </select>
            </div>
            <div className="form-group">
              <label>รายละเอียดเพิ่มเติม</label>
              <textarea className="form-control" rows={4} placeholder="บันทึกรายละเอียดการสำรวจ..."></textarea>
            </div>
            <div className="form-group">
              <label>อัปโหลดรูปภาพ</label>
              <input type="file" className="form-control" accept="image/*" multiple />
            </div>
            <button type="submit" className="btn-primary">💾 บันทึกข้อมูล</button>
          </form>
        </div>

        <div className="content-card">
          <div className="placeholder-content">
            <p>💡 หน้านี้จะเชื่อมต่อกับ GPS และ Camera ของอุปกรณ์</p>
          </div>
        </div>
      </div>
    </div>
  );
}
