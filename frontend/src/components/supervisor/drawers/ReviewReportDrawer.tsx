import React, { useEffect, useState } from 'react';
import { useReportDetails } from '../../../hooks/supervisor/useReportDetails';
import { useKanban } from '../../../context/supervisor/KanbanContext';

interface ReviewReportDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string | null;
  taskId: string;
}

export const ReviewReportDrawer: React.FC<ReviewReportDrawerProps> = ({
  isOpen,
  onClose,
  reportId,
  taskId,
}) => {
  const { report, isLoading, error, fetchReport, approveReport, requestRevision } = useReportDetails(reportId);
  const { refreshTasks } = useKanban();
  
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showRevisionDialog, setShowRevisionDialog] = useState(false);
  const [revisionComments, setRevisionComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && reportId) {
      fetchReport();
    }
  }, [isOpen, reportId, fetchReport]);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await approveReport();
      alert('รายงานได้รับการอนุมัติเรียบร้อยแล้ว');
      await refreshTasks();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการอนุมัติรายงาน');
    } finally {
      setIsSubmitting(false);
      setShowApproveConfirm(false);
    }
  };

  const handleRequestRevision = async () => {
    if (revisionComments.length < 20) {
      alert('กรุณากรอกความคิดเห็นอย่างน้อย 20 ตัวอักษร');
      return;
    }

    setIsSubmitting(true);
    try {
      await requestRevision(revisionComments);
      alert('ส่งคำขอแก้ไขรายงานเรียบร้อยแล้ว');
      await refreshTasks();
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการส่งคำขอแก้ไข');
    } finally {
      setIsSubmitting(false);
      setShowRevisionDialog(false);
      setRevisionComments('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-2xl font-bold">ตรวจสอบรายงาน</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-180px)] overflow-y-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-red-700">
              <p className="font-semibold">เกิดข้อผิดพลาด</p>
              <p>{error}</p>
            </div>
          )}

          {report && (
            <div className="space-y-6">
              {/* Basic Info */}
              <section>
                <h3 className="mb-3 text-lg font-semibold">ข้อมูลพื้นฐาน</h3>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  <div>
                    <span className="font-medium">หัวข้อ:</span> {report.title}
                  </div>
                  <div>
                    <span className="font-medium">สรุป:</span> {report.summary}
                  </div>
                  <div>
                    <span className="font-medium">ความรุนแรง:</span>{' '}
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      report.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                      report.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                </div>
              </section>

              {/* Damage Assessment */}
              <section>
                <h3 className="mb-3 text-lg font-semibold">ประเมินความเสียหาย</h3>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  <div>
                    <span className="font-medium">ประเภทความเสียหาย:</span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {report.damageCategories.map((cat, idx) => (
                        <span key={idx} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">ค่าความเสียหายโดยประมาณ:</span> {report.estimatedCost.toLocaleString()} บาท
                  </div>
                </div>
              </section>

              {/* Affected Area */}
              <section>
                <h3 className="mb-3 text-lg font-semibold">พื้นที่ได้รับผลกระทบ</h3>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                  <div>
                    <span className="font-medium">ครัวเรือนที่ได้รับผลกระทบ:</span> {report.affectedHouseholds} ครัวเรือน
                  </div>
                  <div>
                    <span className="font-medium">ประชากรที่ได้รับผลกระทบ:</span> {report.affectedPopulation} คน
                  </div>
                </div>
              </section>

              {/* Infrastructure Damage */}
              {report.infrastructureDamage.length > 0 && (
                <section>
                  <h3 className="mb-3 text-lg font-semibold">โครงสร้างพื้นฐานที่เสียหาย</h3>
                  <div className="rounded-lg bg-gray-50 p-4 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {report.infrastructureDamage.map((item, idx) => (
                        <span key={idx} className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                    {report.infrastructureDetails && (
                      <div className="mt-2">
                        <span className="font-medium">รายละเอียด:</span> {report.infrastructureDetails}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* Casualties */}
              {(report.casualties > 0 || report.injuries > 0 || report.missing > 0) && (
                <section>
                  <h3 className="mb-3 text-lg font-semibold">ผู้ประสบภัย</h3>
                  <div className="rounded-lg bg-red-50 p-4 space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-gray-600">เสียชีวิต</div>
                        <div className="text-2xl font-bold text-red-700">{report.casualties}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">บาดเจ็บ</div>
                        <div className="text-2xl font-bold text-orange-700">{report.injuries}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">สูญหาย</div>
                        <div className="text-2xl font-bold text-yellow-700">{report.missing}</div>
                      </div>
                    </div>
                    {report.casualtyDetails && (
                      <div className="mt-2 pt-2 border-t border-red-200">
                        <span className="font-medium">รายละเอียด:</span> {report.casualtyDetails}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {/* AI Analysis */}
              {report.aiAnalysis && (
                <section>
                  <h3 className="mb-3 text-lg font-semibold flex items-center gap-2">
                    <svg className="h-5 w-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7H7v6h6V7z" />
                      <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                    </svg>
                    การวิเคราะห์จาก AI
                  </h3>
                  <div className="rounded-lg bg-purple-50 p-4 space-y-3">
                    <div>
                      <div className="font-medium text-purple-900">ประเมินความเสียหาย:</div>
                      <p className="mt-1 text-gray-700">{report.aiAnalysis.damageAssessment}</p>
                    </div>
                    <div>
                      <div className="font-medium text-purple-900">ความต้องการเร่งด่วน:</div>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {report.aiAnalysis.urgentNeeds.map((need, idx) => (
                          <li key={idx} className="text-gray-700">{need}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="font-medium text-purple-900">คำแนะนำ:</div>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {report.aiAnalysis.recommendations.map((rec, idx) => (
                          <li key={idx} className="text-gray-700">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              )}

              {/* Images */}
              {report.images.length > 0 && (
                <section>
                  <h3 className="mb-3 text-lg font-semibold">รูปภาพประกอบ</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {report.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`ภาพที่ ${idx + 1}`}
                        className="rounded-lg w-full h-48 object-cover cursor-pointer hover:opacity-90 transition"
                        onClick={() => window.open(img, '_blank')}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Recommendations */}
              <section>
                <h3 className="mb-3 text-lg font-semibold">คำแนะนำ</h3>
                <div className="space-y-4">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <div className="font-medium text-blue-900 mb-2">คำแนะนำทั่วไป</div>
                    <p className="text-gray-700 whitespace-pre-wrap">{report.generalRecommendations}</p>
                  </div>
                  <div className="rounded-lg bg-green-50 p-4">
                    <div className="font-medium text-green-900 mb-2">คำแนะนำด้านนโยบาย</div>
                    <p className="text-gray-700 whitespace-pre-wrap">{report.policyRecommendations}</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-4">
                    <div className="font-medium text-yellow-900 mb-2">มาตรการป้องกัน</div>
                    <p className="text-gray-700 whitespace-pre-wrap">{report.preventionMeasures}</p>
                  </div>
                </div>
              </section>

              {/* Metadata */}
              <section>
                <h3 className="mb-3 text-lg font-semibold">ข้อมูลเพิ่มเติม</h3>
                <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                  <div>
                    <span className="font-medium">ส่งโดย:</span> {report.submittedBy.name}
                  </div>
                  <div>
                    <span className="font-medium">ส่งเมื่อ:</span> {new Date(report.submittedAt).toLocaleString('th-TH')}
                  </div>
                  {report.reviewedBy && (
                    <>
                      <div>
                        <span className="font-medium">ตรวจสอบโดย:</span> {report.reviewedBy.name}
                      </div>
                      <div>
                        <span className="font-medium">ตรวจสอบเมื่อ:</span> {new Date(report.reviewedAt!).toLocaleString('th-TH')}
                      </div>
                      {report.reviewComments && (
                        <div>
                          <span className="font-medium">ความคิดเห็น:</span> {report.reviewComments}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </section>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {report && report.status === 'PENDING_REVIEW' && (
          <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-6">
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowRevisionDialog(true)}
                disabled={isSubmitting}
                className="px-6 py-2 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50"
              >
                ส่งกลับแก้ไข
              </button>
              <button
                onClick={() => setShowApproveConfirm(true)}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                อนุมัติรายงาน
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approve Confirmation Dialog */}
      {showApproveConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">ยืนยันการอนุมัติรายงาน</h3>
            <p className="text-gray-600 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการอนุมัติรายงานนี้? การกระทำนี้ไม่สามารถยกเลิกได้
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowApproveConfirm(false)}
                disabled={isSubmitting}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการอนุมัติ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Revision Dialog */}
      {showRevisionDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">ส่งกลับแก้ไขรายงาน</h3>
            <p className="text-gray-600 mb-4">
              กรุณาระบุสิ่งที่ต้องการให้แก้ไข (อย่างน้อย 20 ตัวอักษร)
            </p>
            <textarea
              value={revisionComments}
              onChange={(e) => setRevisionComments(e.target.value)}
              className="w-full border rounded-lg p-3 min-h-[120px] focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="เช่น กรุณาเพิ่มรายละเอียดเกี่ยวกับ..."
            />
            <div className="text-sm text-gray-500 mt-1">
              {revisionComments.length} / 20 ตัวอักษร
            </div>
            <div className="flex gap-4 justify-end mt-6">
              <button
                onClick={() => {
                  setShowRevisionDialog(false);
                  setRevisionComments('');
                }}
                disabled={isSubmitting}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleRequestRevision}
                disabled={isSubmitting || revisionComments.length < 20}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอแก้ไข'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
