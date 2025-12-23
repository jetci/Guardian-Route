import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { TrendChart } from '../../../components/dashboard/TrendChart';
import { TypeDonutChart } from '../../../components/dashboard/TypeDonutChart';
import { KPISummaryBar } from '../../../components/dashboard/KPISummaryBar';
import { CriticalIncidentsTable } from '../../../components/dashboard/CriticalIncidentsTable';
import { ExportButton } from '../../../components/dashboard/ExportButton';
import ThaiDatePicker from '../../../components/ThaiDatePicker';
import toast from 'react-hot-toast';
import './DevExecutiveReportsPage.css';

type DateRange = '7days' | '30days' | '90days' | '1year' | 'custom';
type ReportType = 'all' | 'flood' | 'landslide' | 'fire' | 'earthquake' | 'storm';

/**
 * Developer View: Executive Reports
 * แสดงรายงานและสถิติระดับผู้บริหาร พร้อม Filters และ Export
 */
export default function DevExecutiveReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30days');
  const [reportType, setReportType] = useState<ReportType>('all');
  const [customStartDate, setCustomStartDate] = useState<Date | null>(null);
  const [customEndDate, setCustomEndDate] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleApplyFilters = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('🔄 อัปเดตรายงานแล้ว');
  };

  const handleResetFilters = () => {
    setDateRange('30days');
    setReportType('all');
    setCustomStartDate(null);
    setCustomEndDate(null);
    setRefreshKey(prev => prev + 1);
    toast('🔄 รีเซ็ตตัวกรองแล้ว', { icon: 'ℹ️' });
  };

  const getDateRangeLabel = () => {
    switch (dateRange) {
      case '7days': return '7 วันย้อนหลัง';
      case '30days': return '30 วันย้อนหลัง';
      case '90days': return '90 วันย้อนหลัง';
      case '1year': return '1 ปีย้อนหลัง';
      case 'custom': return 'กำหนดเอง';
      default: return '';
    }
  };

  const getReportTypeLabel = () => {
    switch (reportType) {
      case 'all': return 'ทุกประเภท';
      case 'flood': return 'น้ำท่วม';
      case 'landslide': return 'ดินถล่ม';
      case 'fire': return 'อัคคีภัย';
      case 'earthquake': return 'แผ่นดินไหว';
      case 'storm': return 'วาตภัย';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="executive-reports-page">
        {/* Header */}
        <div className="reports-header">
          <div className="header-content">
            <h1>📊 Executive Reports & Statistics</h1>
            <p className="subtitle">รายงานและสถิติสำหรับผู้บริหาร - ภาพรวมและแนวโน้ม</p>
          </div>
          <div className="header-actions">
            <ExportButton />
          </div>
        </div>

        {/* Filters Section */}
        <div className="filters-section">
          <div className="filters-header">
            <h2>🔍 ตัวกรองรายงาน</h2>
            <button className="btn-reset" onClick={handleResetFilters}>
              🔄 รีเซ็ต
            </button>
          </div>

          <div className="filters-grid">
            {/* Date Range Filter */}
            <div className="filter-group">
              <label htmlFor="dateRange">📅 ช่วงเวลา</label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="filter-select"
              >
                <option value="7days">7 วันย้อนหลัง</option>
                <option value="30days">30 วันย้อนหลัง</option>
                <option value="90days">90 วันย้อนหลัง</option>
                <option value="1year">1 ปีย้อนหลัง</option>
                <option value="custom">กำหนดเอง</option>
              </select>
            </div>

            {/* Report Type Filter */}
            <div className="filter-group">
              <label htmlFor="reportType">🏷️ ประเภทภัย</label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
                className="filter-select"
              >
                <option value="all">ทุกประเภท</option>
                <option value="flood">🌊 น้ำท่วม</option>
                <option value="landslide">⛰️ ดินถล่ม</option>
                <option value="fire">🔥 อัคคีภัย</option>
                <option value="earthquake">🌍 แผ่นดินไหว</option>
                <option value="storm">💨 วาตภัย</option>
              </select>
            </div>

            {/* Custom Date Range */}
            {dateRange === 'custom' && (
              <>
                <div className="filter-group">
                  <label htmlFor="startDate">📆 วันที่เริ่มต้น</label>
                  <ThaiDatePicker
                    id="startDate"
                    value={customStartDate}
                    onChange={setCustomStartDate}
                    placeholder="เลือกวันที่เริ่มต้น"
                  />
                </div>
                <div className="filter-group">
                  <label htmlFor="endDate">📆 วันที่สิ้นสุด</label>
                  <ThaiDatePicker
                    id="endDate"
                    value={customEndDate}
                    onChange={setCustomEndDate}
                    placeholder="เลือกวันที่สิ้นสุด"
                  />
                </div>
              </>
            )}

            {/* Apply Button */}
            <div className="filter-group filter-actions">
              <button className="btn-apply" onClick={handleApplyFilters}>
                ✅ ใช้ตัวกรอง
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="active-filters">
            <span className="filter-badge">📅 {getDateRangeLabel()}</span>
            <span className="filter-badge">🏷️ {getReportTypeLabel()}</span>
            {dateRange === 'custom' && customStartDate && customEndDate && (
              <span className="filter-badge">
                📆 {customStartDate.toLocaleDateString('th-TH')} ถึง {customEndDate.toLocaleDateString('th-TH')}
              </span>
            )}
          </div>
        </div>

        {/* KPI Summary */}
        <div className="reports-section">
          <h2 className="section-title">📊 สรุปตัวเลขสำคัญ (KPIs)</h2>
          <KPISummaryBar key={refreshKey} />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Trend Chart */}
          <div className="chart-card">
            <TrendChart key={`trend-${refreshKey}`} />
          </div>

          {/* Type Distribution */}
          <div className="chart-card">
            <TypeDonutChart key={`type-${refreshKey}`} />
          </div>
        </div>

        {/* Critical Incidents Table */}
        <div className="reports-section">
          <h2 className="section-title">🚨 เหตุการณ์สำคัญ</h2>
          <CriticalIncidentsTable key={`critical-${refreshKey}`} />
        </div>

        {/* Summary Statistics */}
        <div className="summary-stats">
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <h3>Trend Analysis</h3>
              <p>วิเคราะห์แนวโน้มการเกิดเหตุการณ์</p>
              <span className="stat-value">+12%</span>
              <span className="stat-label">เพิ่มขึ้นจากเดือนที่แล้ว</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <h3>Response Time</h3>
              <p>เวลาตอบสนองเฉลี่ย</p>
              <span className="stat-value">2.5 ชม.</span>
              <span className="stat-label success">ดีขึ้น 15% จากเดือนที่แล้ว</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>Resolution Rate</h3>
              <p>อัตราการแก้ไขปัญหา</p>
              <span className="stat-value">87%</span>
              <span className="stat-label success">เป้าหมาย: 85%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Affected Population</h3>
              <p>ประชากรได้รับผลกระทบ</p>
              <span className="stat-value">1,234</span>
              <span className="stat-label">คน (เดือนนี้)</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h2 className="section-title">📥 ส่งออกรายงาน</h2>
          <div className="export-options">
            <button className="export-btn pdf">
              📄 Export to PDF
            </button>
            <button className="export-btn excel">
              📊 Export to Excel
            </button>
            <button className="export-btn csv">
              📋 Export to CSV
            </button>
            <button className="export-btn print">
              🖨️ Print Report
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
