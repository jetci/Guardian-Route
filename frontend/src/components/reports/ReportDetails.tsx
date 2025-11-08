import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ReportStatus,
} from '../../types/Report';
import type {
  Report,
  ReviewReportDto,
} from '../../types/Report';
import { submitReport, reviewReport, generateReportPdf, downloadReportPdf } from '../../api/reports';
import { Role } from '../../types';

interface ReportDetailsProps {
  report: Report;
  currentUser: { id: string; role: Role };
  onUpdate: () => void;
}

const ReportDetails: React.FC<ReportDetailsProps> = ({
  report,
  currentUser,
  onUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<ReviewReportDto>({
    status: ReportStatus.APPROVED,
    reviewNotes: '',
  });

  const canEdit = report.authorId === currentUser.id && report.status === ReportStatus.DRAFT;
  const canSubmit = report.authorId === currentUser.id && report.status === ReportStatus.DRAFT;
  const canReview =
    (currentUser.role === Role.SUPERVISOR ||
      currentUser.role === Role.EXECUTIVE ||
      currentUser.role === Role.ADMIN) &&
    (report.status === ReportStatus.SUBMITTED || report.status === ReportStatus.UNDER_REVIEW);

  const handleSubmit = async () => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะส่งรายงานนี้เพื่อตรวจสอบ?')) return;

    try {
      setLoading(true);
      setError(null);
      await submitReport(report.id);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    try {
      setLoading(true);
      setError(null);
      await reviewReport(report.id, reviewData);
      setShowReviewModal(false);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to review report');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateReportPdf(report.id, { forceRegenerate: true });
      alert(`PDF สร้างสำเร็จ: ${result.pdfUrl}`);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!report.pdfUrl) return;
    
    try {
      await downloadReportPdf(report.pdfUrl, `${report.title}.pdf`);
    } catch (err: any) {
      setError('Failed to download PDF');
    }
  };

  const getStatusBadgeClass = (status: ReportStatus): string => {
    const classes: Record<ReportStatus, string> = {
      [ReportStatus.DRAFT]: 'bg-gray-100 text-gray-800',
      [ReportStatus.SUBMITTED]: 'bg-blue-100 text-blue-800',
      [ReportStatus.UNDER_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [ReportStatus.REVISION_REQUIRED]: 'bg-orange-100 text-orange-800',
      [ReportStatus.APPROVED]: 'bg-green-100 text-green-800',
      [ReportStatus.REJECTED]: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md font-medium">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">{report.title}</h1>
            <div className="flex items-center space-x-2 mt-2">
              <span
                className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(
                  report.status
                )}`}
              >
                {report.status}
              </span>
              <span className="text-sm text-gray-400 mx-2">•</span>
              <span className="text-base text-gray-600 font-medium">ประเภท: {report.type}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            {canEdit && (
              <Link
                to={`/reports/${report.id}/edit`}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-md"
              >
                แก้ไข
              </Link>
            )}
            {canSubmit && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-md"
              >
                ส่งเพื่อตรวจสอบ
              </button>
            )}
            {canReview && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-md"
              >
                ตรวจสอบรายงาน
              </button>
            )}
            <button
              onClick={handleGeneratePdf}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium shadow-md"
            >
              สร้าง PDF
            </button>
            {report.pdfUrl && (
              <button
                onClick={handleDownloadPdf}
                className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium shadow-md"
              >
                ดาวน์โหลด PDF
              </button>
            )}
          </div>
        </div>

        {report.summary && (
          <p className="text-lg text-gray-700 mt-4 border-t pt-4">{report.summary}</p>
        )}
      </div>

      {/* Report Information */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">ข้อมูลรายงาน</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-600">ผู้สร้างรายงาน</dt>
            <dd className="mt-1 text-base text-gray-900 font-medium">
              {report.author.firstName} {report.author.lastName} ({report.author.role})
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-600">วันที่สร้าง</dt>
            <dd className="mt-1 text-base text-gray-900 font-medium">{formatDate(report.createdAt)}</dd>
          </div>
          {report.periodStart && (
            <div>
              <dt className="text-sm font-medium text-gray-600">ช่วงเวลาเริ่มต้น</dt>
              <dd className="mt-1 text-base text-gray-900 font-medium">{formatDate(report.periodStart)}</dd>
            </div>
          )}
          {report.periodEnd && (
            <div>
              <dt className="text-sm font-medium text-gray-600">ช่วงเวลาสิ้นสุด</dt>
              <dd className="mt-1 text-base text-gray-900 font-medium">{formatDate(report.periodEnd)}</dd>
            </div>
          )}
          {report.submittedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-600">วันที่ส่งตรวจสอบ</dt>
              <dd className="mt-1 text-base text-gray-900 font-medium">{formatDate(report.submittedAt)}</dd>
            </div>
          )}
          {report.reviewedAt && report.reviewedBy && (
            <>
              <div>
                <dt className="text-sm font-medium text-gray-600">ผู้ตรวจสอบ</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">
                  {report.reviewedBy.firstName} {report.reviewedBy.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-600">วันที่ตรวจสอบ</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">{formatDate(report.reviewedAt)}</dd>
              </div>
            </>
          )}
          {report.approvedAt && (
            <div>
              <dt className="text-sm font-medium text-gray-600">วันที่อนุมัติ</dt>
              <dd className="mt-1 text-base text-gray-900 font-medium">{formatDate(report.approvedAt)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Damage Assessment */}
      {(report.totalDamageEstimate || report.affectedHouseholds || report.affectedPersons) && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">ประเมินความเสียหาย</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.totalDamageEstimate && (
              <div className="bg-red-50 p-6 rounded-xl border border-red-200 shadow-sm">
                <p className="text-sm text-red-600 font-medium">ความเสียหายโดยประมาณ</p>
                <p className="text-2xl font-bold text-red-900 mt-1">
                  {formatCurrency(Number(report.totalDamageEstimate))}
                </p>
              </div>
            )}
            {report.affectedHouseholds && (
              <div className="bg-orange-50 p-6 rounded-xl border border-orange-200 shadow-sm">
                <p className="text-sm text-orange-600 font-medium">ครัวเรือนที่ได้รับผลกระทบ</p>
                <p className="text-2xl font-bold text-orange-900 mt-1">
                  {report.affectedHouseholds} ครัวเรือน
                </p>
              </div>
            )}
            {report.affectedPersons && (
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 shadow-sm">
                <p className="text-sm text-yellow-600 font-medium">ผู้ได้รับผลกระทบ</p>
                <p className="text-2xl font-bold text-yellow-900 mt-1">
                  {report.affectedPersons} คน
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Details */}
      {report.details && Object.keys(report.details).length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">รายละเอียด</h2>
          <pre className="bg-gray-50 p-6 rounded-xl overflow-x-auto text-sm border border-gray-200">
            {JSON.stringify(report.details, null, 2)}
          </pre>
        </div>
      )}

      {/* Photos */}
      {report.photoUrls && report.photoUrls.length > 0 && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">รูปภาพ ({report.photoUrls.length})</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {report.photoUrls.map((url, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={url}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-48 object-cover rounded-xl shadow-md hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Review Notes */}
      {report.reviewNotes && (
        <div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-300 shadow-lg">
          <h2 className="text-xl font-bold text-yellow-900 mb-4 border-b pb-2">หมายเหตุจากการตรวจสอบ</h2>
          <p className="text-yellow-800">{report.reviewNotes}</p>
        </div>
      )}

      {/* Incident Link */}
      {report.incident && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">เหตุการณ์ที่เกี่ยวข้อง</h2>
          <Link
            to={`/incidents/${report.incident.id}`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {report.incident.title}
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            สถานะ: {report.incident.status} • ระดับความสำคัญ: {report.incident.priority}
          </p>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-6">ตรวจสอบรายงาน</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ผลการตรวจสอบ
                </label>
                <select
                  value={reviewData.status}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      status: e.target.value as any,
                    }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value={ReportStatus.APPROVED}>อนุมัติ</option>
                  <option value={ReportStatus.REVISION_REQUIRED}>ต้องแก้ไข</option>
                  <option value={ReportStatus.REJECTED}>ปฏิเสธ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หมายเหตุ
                </label>
                <textarea
                  value={reviewData.reviewNotes}
                  onChange={(e) =>
                    setReviewData((prev) => ({
                      ...prev,
                      reviewNotes: e.target.value,
                    }))
                  }
                  rows={4}
                  placeholder="ระบุหมายเหตุหรือข้อเสนอแนะ"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReviewModal(false)}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors font-medium shadow-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleReview}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors font-medium shadow-md"
              >
                {loading ? 'กำลังบันทึก...' : 'บันทึกผลการตรวจสอบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetails;
