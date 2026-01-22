import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { reportService } from '../../services/reportService';
import { incidentService } from '../../services/incidentService';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import { ReportStatus } from '../../types/Report';
import './ReportHistoryPage.css';

const statusLabels: Record<string, string> = {
  'NEW_ASSIGNMENT': 'งานใหม่',
  'SURVEY_COMPLETE': 'รอตรวจสอบ',
  'REVISION_REQUIRED': 'ต้องแก้ไข',
  'PENDING_REVIEW': 'รอตรวจสอบ',
  'APPROVED': 'อนุมัติแล้ว',
  'REJECTED': 'ปฏิเสธ',
  'DRAFT': 'แบบร่าง',
  'SUBMITTED': 'ส่งแล้ว',
  'UNDER_REVIEW': 'รอตรวจสอบ',
};

export function ReportHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch reports on mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const newReports: any[] = [];

    try {
      // 1. Fetch Tasks (Reports)
      try {
        const reportsData = await reportService.getMyReports();
        newReports.push(...reportsData);
      } catch (error) {
        console.error('Error loading tasks/reports:', error);
      }

      // 2. Fetch Incidents
      try {
        const incidentsData = await incidentService.getMyIncidents();
        const formattedIncidents = incidentsData.map((incident: any) => {
          // Helper to translate disaster type
          const getDisasterTypeLabel = (type: string): string => {
            const labels: Record<string, string> = {
              'FLOOD': 'น้ำท่วม',
              'LANDSLIDE': 'ดินถล่ม',
              'STORM': 'วาตภัย',
              'FIRE': 'อัคคีภัย',
              'EARTHQUAKE': 'แผ่นดินไหว',
              'DROUGHT': 'ภัยแล้ง',
              'FOREST_FIRE': 'ไฟป่า',
              'OTHER': 'อื่นๆ',
              'น้ำท่วม': 'น้ำท่วม',
              'ดินถล่ม': 'ดินถล่ม',
              'วาตภัย': 'วาตภัย',
              'อัคคีภัย': 'อัคคีภัย',
              'แผ่นดินไหว': 'แผ่นดินไหว',
              'ภัยแล้ง': 'ภัยแล้ง',
              'ไฟป่า': 'ไฟป่า',
              'อื่นๆ': 'อื่นๆ',
            };
            return labels[type] || type;
          };

          const disasterType = getDisasterTypeLabel(incident.disasterType || incident.type);
          const locationName = incident.address || incident.villageName || 'ไม่ระบุ';

          return {
            id: incident.id,
            title: `${disasterType} - ${locationName}`,
            location: locationName,
            submittedDate: incident.createdAt,
            status: incident.status || 'PENDING_REVIEW',
            supervisorComment: '-',
            type: 'INCIDENT',
            pdfUrl: incident.pdfUrl
          };
        });
        newReports.push(...formattedIncidents);
      } catch (error) {
        console.error('Error loading incidents:', error);
      }

      // Sort combined data
      newReports.sort((a, b) =>
        new Date(b.submittedDate || b.createdAt).getTime() - new Date(a.submittedDate || a.createdAt).getTime()
      );

      setReports(newReports);

    } catch (error) {
      console.error('Critical error in loadReports:', error);
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter reports
  const filteredReports = reports.filter(report => {
    // Search Term Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesId = report.id?.toLowerCase().includes(term);
      const matchesTitle = report.title?.toLowerCase().includes(term);
      const matchesLocation = report.location?.toLowerCase().includes(term);

      if (!matchesId && !matchesTitle && !matchesLocation) {
        return false;
      }
    }

    // Status filter
    if (statusFilter !== 'ALL' && report.status !== statusFilter) {
      return false;
    }

    // Date filter
    if (dateFrom) {
      const reportDate = new Date(report.submittedDate || report.createdAt);
      if (reportDate < dateFrom) return false;
    }

    if (dateTo) {
      const reportDate = new Date(report.submittedDate || report.createdAt);
      // Set time to end of day for dateTo
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (reportDate > endOfDay) return false;
    }

    return true;
  });

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'status-approved';
      case 'REJECTED': return 'status-rejected';
      case 'REVISION_REQUIRED': return 'status-revision';
      case 'SURVEY_COMPLETE':
      case 'PENDING_REVIEW':
      case 'SUBMITTED':
      case 'UNDER_REVIEW': return 'status-pending';
      default: return 'status-new';
    }
  };

  const handleViewReport = (id: string) => {
    navigate(`/reports/${id}`);
  };

  const handleDownloadPDF = async (report: any) => {
    if (!report.pdfUrl) {
      toast.error('ไม่พบไฟล์ PDF สำหรับรายงานนี้');
      return;
    }

    try {
      await reportService.downloadPdf(report.pdfUrl, `${report.title}.pdf`);
      toast.success('เริ่มดาวน์โหลด PDF...');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('ไม่สามารถดาวน์โหลด PDF ได้');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <DashboardLayout>
      <div className="report-history-page font-sarabun">
        {/* Header */}
        <div className="page-header">
          <h2>📋 ประวัติการรายงาน</h2>
          <p className="subtitle">รายงานทั้งหมดที่คุณส่ง</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-group" style={{ flex: 2 }}>
            <label>ค้นหา:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ระบุ ID, ชื่อเหตุการณ์, หรือสถานที่..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                fontSize: '14px'
              }}
            />
          </div>

          <div className="filter-group">
            <label>สถานะ:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
            <ThaiDatePicker
              id="date-from"
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="เลือกวันเริ่มต้น"
              maxDate={new Date()}
            />
          </div>

          <div className="filter-group">
            <label>ถึงวันที่:</label>
            <ThaiDatePicker
              id="date-to"
              value={dateTo}
              onChange={setDateTo}
              placeholder="เลือกวันสิ้นสุด"
              maxDate={new Date()}
            />
          </div>

          <button className="btn-search" onClick={loadReports}>
            🔄 รีเฟรช
          </button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{reports.length}</div>
            <div className="stat-label">ทั้งหมด</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{reports.filter((r: any) => ['PENDING_REVIEW', 'SUBMITTED', 'UNDER_REVIEW'].includes(r.status)).length}</div>
            <div className="stat-label">รอตรวจสอบ</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{reports.filter((r: any) => r.status === 'REVISION_REQUIRED').length}</div>
            <div className="stat-label">ต้องแก้ไข</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{reports.filter((r: any) => r.status === 'APPROVED').length}</div>
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    ไม่พบรายงาน
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id}>
                    <td className="id-cell">#{report.id.substring(0, 8)}...</td>
                    <td className="title-cell">{report.title}</td>
                    <td>{report.location}</td>
                    <td>{formatDate(report.submittedDate || report.createdAt)}</td>
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
                      {report.pdfUrl && (
                        <button
                          className="btn-icon"
                          onClick={() => handleDownloadPDF(report)}
                          title="ดาวน์โหลด PDF"
                        >
                          📄
                        </button>
                      )}
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
