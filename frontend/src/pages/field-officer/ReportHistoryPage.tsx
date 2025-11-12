import { useState } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { mockTasks } from '../../mocks/dashboardData';
import './ReportHistoryPage.css';

type ReportStatus = 'ALL' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED';

const statusLabels: Record<string, string> = {
  'NEW_ASSIGNMENT': 'งานใหม่',
  'SURVEY_COMPLETE': 'รอตรวจสอบ',
  'REVISION_REQUIRED': 'ต้องแก้ไข',
  'PENDING_REVIEW': 'รอตรวจสอบ',
  'APPROVED': 'อนุมัติแล้ว',
  'REJECTED': 'ปฏิเสธ',
};

export function ReportHistoryPage() {
  const [statusFilter, setStatusFilter] = useState<ReportStatus>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Filter reports
  const filteredReports = mockTasks.filter(task => {
    // Status filter
    if (statusFilter !== 'ALL' && task.status !== statusFilter) {
      return false;
    }

    // Date filter (simplified - would need proper date parsing in production)
    // For now, just show all dates

    return true;
  });

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'REVISION_REQUIRED': return 'status-revision';
      case 'SURVEY_COMPLETE':
      case 'PENDING_REVIEW': return 'status-pending';
      default: return 'status-new';
    }
  };

  const handleViewReport = (id: number) => {
    alert(`ดูรายงาน ID: ${id}\n(จะเปิดหน้ารายละเอียดรายงาน)`);
  };

  const handleDownloadPDF = (id: number) => {
    alert(`ดาวน์โหลด PDF รายงาน ID: ${id}\n(จะสร้างไฟล์ PDF)`);
  };

  return (
    <DashboardLayout>
      <div className="report-history-page">
        {/* Header */}
        <div className="page-header">
          <h2>📋 ประวัติการรายงาน</h2>
          <p className="subtitle">รายงานทั้งหมดที่คุณส่ง</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group">
            <label>สถานะ:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReportStatus)}
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="PENDING_REVIEW">รอตรวจสอบ</option>
              <option value="APPROVED">อนุมัติแล้ว</option>
              <option value="REJECTED">ปฏิเสธ</option>
              <option value="REVISION_REQUIRED">ต้องแก้ไข</option>
            </select>
          </div>

          <div className="filter-group">
            <label>จากวันที่:</label>
            <input 
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>ถึงวันที่:</label>
            <input 
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <button className="btn-search">
            🔍 ค้นหา
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{mockTasks.length}</div>
            <div className="stat-label">ทั้งหมด</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{mockTasks.filter(t => t.status === 'SURVEY_COMPLETE').length}</div>
            <div className="stat-label">รอตรวจสอบ</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{mockTasks.filter(t => t.status === 'REVISION_REQUIRED').length}</div>
            <div className="stat-label">ต้องแก้ไข</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">0</div>
            <div className="stat-label">อนุมัติแล้ว</div>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ชื่อเหตุการณ์</th>
                <th>สถานที่</th>
                <th>วันที่ส่ง</th>
                <th>สถานะ</th>
                <th>หมายเหตุ</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    ไม่พบรายงาน
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id}>
                    <td className="id-cell">#{report.id}</td>
                    <td className="title-cell">{report.title}</td>
                    <td>{report.location}</td>
                    <td>{report.submittedDate || report.dueDate}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(report.status)}`}>
                        {statusLabels[report.status] || report.status}
                      </span>
                    </td>
                    <td className="notes-cell">
                      {report.supervisorComment || report.revisionNote || '-'}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn-icon"
                        onClick={() => handleViewReport(report.id)}
                        title="ดูรายละเอียด"
                      >
                        👁️
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => handleDownloadPDF(report.id)}
                        title="ดาวน์โหลด PDF"
                      >
                        📄
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (placeholder) */}
        <div className="pagination">
          <button className="page-btn" disabled>← ก่อนหน้า</button>
          <span className="page-info">หน้า 1 จาก 1</span>
          <button className="page-btn" disabled>ถัดไป →</button>
        </div>
      </div>
    </DashboardLayout>
  );
}
