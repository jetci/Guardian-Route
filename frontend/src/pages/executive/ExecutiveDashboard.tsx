/**
 * Executive Dashboard
 * Standardized with DashboardLayout
 */

import { DashboardLayout } from '../../components/layout/DashboardLayout';
import HeatmapVisualization from '../../components/HeatmapVisualization';

export default function ExecutiveDashboard() {
  // Mock data with comparisons (ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่)
  const kpiData = {
    monthlyIncidents: 24,
    monthlyChange: '-5%',
    monthlyChangePositive: false,
    avgResponseTime: '2.5 ชม.',
    responseTimeChange: 'ดีขึ้น 0.3 ชม.',
    responseTimePositive: true,
    activeOfficers: 12,
    totalOfficers: 15,
    officerUtilization: '80%',
    utilizationPositive: true,
    completionRate: '85%',
    completionChange: '+3%',
    completionPositive: true
  };

  const incidentsByType = [
    { type: 'น้ำท่วม', count: 8, percentage: 33 },
    { type: 'ดินถล่ม', count: 6, percentage: 25 },
    { type: 'ไฟไหม้ป่า', count: 5, percentage: 21 },
    { type: 'แผ่นดินไหว', count: 3, percentage: 13 },
    { type: 'อื่นๆ', count: 2, percentage: 8 }
  ];

  const villageStats = [
    { village: 'หมู่ 3 - บ้านหนองบัว', incidents: 5, status: 'สูง' },
    { village: 'หมู่ 5 - ดินถล่ม', incidents: 4, status: 'สูง' },
    { village: 'หมู่ 8 - เขาใหญ่', incidents: 3, status: 'ปานกลาง' },
    { village: 'หมู่ 12 - ตำบลเวียง', incidents: 3, status: 'ปานกลาง' },
    { village: 'หมู่ 2 - ป่าบง', incidents: 2, status: 'ต่ำ' }
  ];

  return (
    <DashboardLayout>
      <div className="executive-dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">📈 Executive Dashboard</h1>
            <p className="page-subtitle">ภาพรวมและการวิเคราะห์ระดับผู้บริหาร</p>
            <p className="last-updated">Last Updated: {new Date().toLocaleString('th-TH')}</p>
          </div>
        </header>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card kpi-purple">
            <div className="kpi-icon">📊</div>
            <div className="kpi-content">
              <div className="kpi-value">{kpiData.monthlyIncidents}</div>
              <div className="kpi-label">เหตุการณ์รายเดือน</div>
              <div className={`kpi-trend ${kpiData.monthlyChangePositive ? 'positive' : 'negative'}`}>
                {kpiData.monthlyChange} จากเดือนที่แล้ว
              </div>
            </div>
          </div>

          <div className="kpi-card kpi-blue">
            <div className="kpi-icon">⏱️</div>
            <div className="kpi-content">
              <div className="kpi-value">{kpiData.avgResponseTime}</div>
              <div className="kpi-label">เวลาตอบสนองเฉลี่ย</div>
              <div className={`kpi-trend ${kpiData.responseTimePositive ? 'positive' : 'negative'}`}>
                {kpiData.responseTimeChange}
              </div>
            </div>
          </div>

          <div className="kpi-card kpi-green">
            <div className="kpi-icon">👥</div>
            <div className="kpi-content">
              <div className="kpi-value">{kpiData.activeOfficers}/{kpiData.totalOfficers}</div>
              <div className="kpi-label">เจ้าหน้าที่ปฏิบัติงาน</div>
              <div className={`kpi-trend ${kpiData.utilizationPositive ? 'positive' : 'negative'}`}>
                {kpiData.officerUtilization} Utilization
              </div>
            </div>
          </div>

          <div className="kpi-card kpi-orange">
            <div className="kpi-icon">✅</div>
            <div className="kpi-content">
              <div className="kpi-value">{kpiData.completionRate}</div>
              <div className="kpi-label">อัตราการแก้ไขสำเร็จ</div>
              <div className={`kpi-trend ${kpiData.completionPositive ? 'positive' : 'negative'}`}>
                {kpiData.completionChange} จากเดือนที่แล้ว
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card">
            <h3>📊 เหตุการณ์แยกตามประเภท</h3>
            <div className="incident-types">
              {incidentsByType.map((item, index) => (
                <div key={index} className="incident-type-item">
                  <div className="incident-type-info">
                    <span className="incident-type-name">{item.type}</span>
                    <span className="incident-type-count">{item.count} ครั้ง</span>
                  </div>
                  <div className="incident-type-bar">
                    <div 
                      className="incident-type-fill" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="incident-type-percentage">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>🗺️ แผนที่ความเสี่ยง</h3>
            <HeatmapVisualization />
          </div>
        </div>

        {/* Village Statistics */}
        <div className="village-stats-section">
          <h3>📍 สถิติตามหมู่บ้าน (Top 5)</h3>
          <div className="village-stats-table">
            <table>
              <thead>
                <tr>
                  <th>หมู่บ้าน</th>
                  <th>จำนวนเหตุการณ์</th>
                  <th>ระดับความเสี่ยง</th>
                </tr>
              </thead>
              <tbody>
                {villageStats.map((village, index) => (
                  <tr key={index}>
                    <td>{village.village}</td>
                    <td>{village.incidents}</td>
                    <td>
                      <span className={`status-badge status-${village.status.toLowerCase()}`}>
                        {village.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
