import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { reportService } from '../../services/reportService';
import { incidentService } from '../../services/incidentService';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import {
  FileText, Search, Filter, RefreshCw, ChevronRight,
  Download, Eye, AlertCircle, CheckCircle, Clock, XCircle,
  MapPin
} from 'lucide-react';

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

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    const newReports: any[] = [];

    try {
      try {
        const reportsData = await reportService.getMyReports();
        newReports.push(...reportsData);
      } catch (error) {
        console.error('Error loading tasks/reports:', error);
      }

      try {
        const incidentsData = await incidentService.getMyIncidents();
        const formattedIncidents = incidentsData.map((incident: any) => {
          const getDisasterTypeLabel = (type: string): string => {
            const labels: Record<string, string> = {
              'FLOOD': 'น้ำท่วม', 'LANDSLIDE': 'ดินถล่ม', 'STORM': 'วาตภัย', 'FIRE': 'อัคคีภัย',
              'EARTHQUAKE': 'แผ่นดินไหว', 'DROUGHT': 'ภัยแล้ง', 'FOREST_FIRE': 'ไฟป่า', 'OTHER': 'อื่นๆ',
              'น้ำท่วม': 'น้ำท่วม', 'ดินถล่ม': 'ดินถล่ม', 'วาตภัย': 'วาตภัย', 'อัคคีภัย': 'อัคคีภัย',
              'แผ่นดินไหว': 'แผ่นดินไหว', 'ภัยแล้ง': 'ภัยแล้ง', 'ไฟป่า': 'ไฟป่า', 'อื่นๆ': 'อื่นๆ',
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

      newReports.sort((a, b) =>
        new Date(b.submittedDate || b.createdAt).getTime() - new Date(a.submittedDate || a.createdAt).getTime()
      );
      setReports(newReports);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!report.id?.toLowerCase().includes(term) && !report.title?.toLowerCase().includes(term) && !report.location?.toLowerCase().includes(term)) return false;
    }
    if (statusFilter !== 'ALL' && report.status !== statusFilter) return false;
    if (dateFrom && new Date(report.submittedDate || report.createdAt) < dateFrom) return false;
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      if (new Date(report.submittedDate || report.createdAt) > endOfDay) return false;
    }
    return true;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'APPROVED': return { label: 'อนุมัติแล้ว', color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle size={14} /> };
      case 'REJECTED': return { label: 'ปฏิเสธ', color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} /> };
      case 'REVISION_REQUIRED': return { label: 'ต้องแก้ไข', color: '#f59e0b', bg: '#fffbeb', icon: <AlertCircle size={14} /> };
      case 'SURVEY_COMPLETE':
      case 'PENDING_REVIEW':
      case 'SUBMITTED':
      case 'UNDER_REVIEW': return { label: 'รอตรวจสอบ', color: '#3b82f6', bg: '#eff6ff', icon: <Clock size={14} /> };
      default: return { label: 'งานใหม่', color: '#6366f1', bg: '#f5f3ff', icon: <FileText size={14} /> };
    }
  };

  const handleDownloadPDF = async (report: any) => {
    if (!report.pdfUrl) {
      toast.error('ไม่พบไฟล์ PDF'); return;
    }
    try {
      await reportService.downloadPdf(report.pdfUrl, `${report.title}.pdf`);
      toast.success('ดาวน์โหลด PDF สำเร็จ');
    } catch (error) { toast.error('ไม่สามารถดาวน์โหลดได้'); }
  };

  // Styles
  const pageStyle = { fontFamily: "'Sarabun', sans-serif", padding: '16px', background: '#f0f4f8', minHeight: '100vh' };

  const headerStyle = { marginBottom: '24px', padding: '0 8px' };
  const titleStyle = { fontSize: '26px', fontWeight: '900', color: '#1e293b', marginBottom: '4px' };
  const subtitleStyle = { fontSize: '15px', color: '#64748b' };

  const statsRowStyle = {
    display: 'flex', gap: '16px', overflowX: 'auto' as const, marginBottom: '28px',
    padding: '8px 4px 16px', scrollbarWidth: 'none' as const
  };

  const statCardStyle = (gradient: string) => ({
    flex: '0 0 160px',
    background: gradient,
    padding: '20px',
    borderRadius: '24px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between'
  });

  const filterSectionStyle = {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    padding: '24px',
    borderRadius: '28px',
    marginBottom: '28px',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
  };

  const inputStyle = {
    width: '100%', padding: '14px 18px', borderRadius: '16px',
    border: '1px solid #e2e8f0', background: 'white', fontSize: '15px',
    outline: 'none', transition: 'all 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
  };

  const cardStyle = (statusColor: string) => ({
    background: 'white', borderRadius: '24px', padding: '24px', marginBottom: '20px',
    border: '1px solid #f1f5f9', borderLeft: `6px solid ${statusColor}`,
    boxShadow: '0 4px 15px rgba(0,0,0,0.03)', position: 'relative' as const,
    cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s'
  });

  return (
    <DashboardLayout>
      <div style={pageStyle}>

        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={titleStyle}>📋 ประวัติการรายงาน</h2>
              <p style={subtitleStyle}>ศูนย์รวมข้อมูลรายงานที่คุณได้บันทึกไว้ในระบบ</p>
            </div>
            <button
              onClick={loadReports}
              style={{
                background: 'white', border: 'none', width: '48px', height: '48px',
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#3b82f6', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }}
            >
              <RefreshCw size={22} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Stats Row with Gradients */}
        <div style={statsRowStyle}>
          {[
            { label: 'ทั้งหมด', val: reports.length, grad: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)', icon: <FileText size={18} /> },
            { label: 'รอตรวจสอบ', val: reports.filter((r: any) => ['PENDING_REVIEW', 'SUBMITTED', 'UNDER_REVIEW'].includes(r.status)).length, grad: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)', icon: <Clock size={18} /> },
            { label: 'ต้องแก้ไข', val: reports.filter((r: any) => r.status === 'REVISION_REQUIRED').length, grad: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', icon: <AlertCircle size={18} /> },
            { label: 'อนุมัติแล้ว', val: reports.filter((r: any) => r.status === 'APPROVED').length, grad: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', icon: <CheckCircle size={18} /> }
          ].map((s, idx) => (
            <div key={idx} style={statCardStyle(s.grad)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>{s.label}</span>
                {s.icon}
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', marginTop: '8px' }}>{s.val}</div>
            </div>
          ))}
        </div>

        {/* Filters Section with Soft Background */}
        <div style={filterSectionStyle}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input
                type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="พิมพ์เพื่อค้นหาไอดี, ชื่อเหตุการณ์ หรือสถานที่..."
                style={{ ...inputStyle, paddingLeft: '48px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <select
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="ALL">เลือกทุกสถานะ</option>
                <option value="PENDING_REVIEW">รอตรวจสอบ</option>
                <option value="APPROVED">อนุมัติแล้ว</option>
                <option value="REJECTED">ปฏิเสธแล้ว</option>
                <option value="REVISION_REQUIRED">ต้องแก้ไขข้อมูล</option>
              </select>
              <ChevronRight size={18} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: '#94a3b8', pointerEvents: 'none' }} />
            </div>
            <button style={{
              padding: '0 20px', borderRadius: '16px', background: '#eff6ff', border: 'none',
              color: '#3b82f6', fontSize: '14px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Filter size={18} /> กรอง
            </button>
          </div>
        </div>

        {/* List View with Color-Coded Cards */}
        <div style={{ paddingBottom: '100px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
              <RefreshCw size={40} className="animate-spin" style={{ opacity: 0.3, marginBottom: '12px' }} />
              <div style={{ fontWeight: '600' }}>กำลังเชื่อมต่อฐานข้อมูล...</div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#94a3b8', background: 'white', borderRadius: '32px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#64748b' }}>ไม่พบรายการรายงาน</div>
              <div style={{ fontSize: '14px' }}>ลองเปลี่ยนเงื่อนไขการค้นหาหรือเริ่มรายงานใหม่</div>
            </div>
          ) : (
            filteredReports.map(report => {
              const config = getStatusConfig(report.status);
              const isIncident = report.type === 'INCIDENT';

              return (
                <div
                  key={report.id}
                  style={cardStyle(config.color)}
                  onClick={() => navigate(`/reports/${report.id}`)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{
                      padding: '6px 12px', borderRadius: '10px', background: config.bg, color: config.color,
                      fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px'
                    }}>
                      {config.icon} {config.label.toUpperCase()}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b' }}>
                        {new Date(report.submittedDate || report.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>
                        {new Date(report.submittedDate || report.createdAt).getFullYear() + 543}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px', background: isIncident ? '#fee2e2' : '#e0f2fe',
                      color: isIncident ? '#ef4444' : '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {isIncident ? <AlertCircle size={24} /> : <FileText size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '6px', lineHeight: 1.3 }}>
                        {report.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#64748b' }}>
                        <MapPin size={15} color="#ef4444" /> {report.location || 'ไม่ระบุสถานที่'}
                      </div>
                    </div>
                  </div>

                  {report.supervisorComment && report.supervisorComment !== '-' && (
                    <div style={{
                      marginTop: '20px', background: '#fffbeb', padding: '16px', borderRadius: '16px',
                      fontSize: '14px', color: '#92400e', border: '1px solid #fde68a'
                    }}>
                      <div style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <AlertCircle size={16} /> ความเห็นจากหัวหน้า:
                      </div>
                      {report.supervisorComment}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/reports/${report.id}`); }}
                      style={{
                        flex: 2, padding: '14px', borderRadius: '16px', background: '#f1f5f9',
                        border: 'none', color: '#475569', fontSize: '15px', fontWeight: '800',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                      }}
                    >
                      <Eye size={18} /> ดูรายงาน
                    </button>
                    {report.pdfUrl && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadPDF(report); }}
                        style={{
                          flex: 1, padding: '14px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
                        }}
                      >
                        <Download size={18} /> PDF
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <style>{`
            .animate-spin { animation: spin 1s linear infinite; }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>

      </div>
    </DashboardLayout>
  );
}
