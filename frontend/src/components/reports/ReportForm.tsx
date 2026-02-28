import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type Report,
  ReportType,
  ReportStatus,
  type CreateReportDto,
  type UpdateReportDto,
} from '../../types/Report';
import { createReport, updateReport } from '../../api/reports';
import ThaiDatePicker from '../ThaiDatePicker';
import { FileText, DollarSign, Image, Calendar } from 'lucide-react';

interface ReportFormProps {
  report?: Report;
  incidentId?: string;
  onSuccess?: (report: Report) => void;
  onCancel?: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({
  report,
  incidentId,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateReportDto>({
    type: report?.type || ReportType.CUSTOM,
    title: report?.title || '',
    summary: report?.summary || '',
    details: report?.details || {},
    totalDamageEstimate: report?.totalDamageEstimate || undefined,
    affectedHouseholds: report?.affectedHouseholds || undefined,
    affectedPersons: report?.affectedPersons || undefined,
    photoUrls: report?.photoUrls || [],
    periodStart: report?.periodStart || '',
    periodEnd: report?.periodEnd || '',
    incidentId: report?.incidentId || incidentId || undefined,
    status: report?.status || ReportStatus.DRAFT,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value === '' ? undefined : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/reports');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const photoUrls = formData.photoUrls
        ? (Array.isArray(formData.photoUrls)
          ? formData.photoUrls
          : (formData.photoUrls as any).split(',').map((url: string) => url.trim())
        ).filter(Boolean)
        : [];

      const submitData: CreateReportDto | UpdateReportDto = {
        ...formData,
        photoUrls,
      };

      let result: Report;
      if (report) {
        result = await updateReport(report.id, submitData);
      } else {
        result = await createReport(submitData as CreateReportDto);
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate(`/reports/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการบันทึกรายงาน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 p-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-900 px-5 py-4 rounded-lg text-base">
          {error}
        </div>
      )}

      {/* Basic Information Section */}
      <section className="bg-white rounded-lg border-2 border-gray-300 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-400 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          ข้อมูลพื้นฐาน
        </h3>

        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label htmlFor="type" className="block text-base font-semibold text-gray-900 mb-3">
              ประเภทรายงาน <span className="text-red-600">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              disabled={!!report}
              className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg text-gray-900
                         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500
                         disabled:bg-gray-100 disabled:text-gray-500 transition-all"
            >
              {Object.values(ReportType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-base font-semibold text-gray-900 mb-3">
              ชื่อรายงาน <span className="text-red-600">*</span>
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="เช่น รายงานสรุปเหตุการณ์น้ำท่วม หมู่ 1 บ้านเวียง"
              className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500
                         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-base font-semibold text-gray-900 mb-3">
              สรุปรายงาน
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={5}
              placeholder="สรุปสั้นๆ เกี่ยวกับรายงาน เช่น สภาพความเสียหาย ผลกระทบต่อพื้นที่"
              className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500
                         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 
                         transition-all resize-none"
            />
            <p className="mt-3 text-sm text-gray-600 leading-relaxed">
              กรอกสรุปรายงานเพื่อให้ผู้อ่านเข้าใจภาพรวมได้รวดเร็ว
            </p>
          </div>
        </div>
      </section>

      {/* Period Selection Section (for MONTHLY and CUSTOM reports) */}
      {(formData.type === ReportType.MONTHLY || formData.type === ReportType.CUSTOM) && (
        <section className="bg-white rounded-lg border-2 border-gray-300 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-400 flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            ช่วงเวลารายงาน
          </h3>

          <div className="space-y-6">
            {/* Start Date */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                วันที่เริ่มต้น <span className="text-red-600">*</span>
              </label>
              <ThaiDatePicker
                id="period-start"
                value={formData.periodStart ? new Date(formData.periodStart) : null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    periodStart: date ? date.toISOString() : '',
                  }))
                }
                placeholder="เลือกวันที่เริ่มต้น"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-base font-semibold text-gray-900 mb-3">
                วันที่สิ้นสุด <span className="text-red-600">*</span>
              </label>
              <ThaiDatePicker
                id="period-end"
                value={formData.periodEnd ? new Date(formData.periodEnd) : null}
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    periodEnd: date ? date.toISOString() : '',
                  }))
                }
                placeholder="เลือกวันที่สิ้นสุด"
              />
            </div>
          </div>
        </section>
      )}

      {/* Damage Assessment Section */}
      <section className="bg-white rounded-lg border-2 border-gray-300 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-400 flex items-center gap-2">
          <DollarSign className="w-6 h-6" />
          ประเมินความเสียหาย
        </h3>

        <div className="space-y-6">
          {/* Total Damage */}
          <div>
            <label htmlFor="totalDamageEstimate" className="block text-base font-semibold text-gray-900 mb-3">
              ความเสียหาย (บาท)
            </label>
            <input
              id="totalDamageEstimate"
              type="number"
              name="totalDamageEstimate"
              value={formData.totalDamageEstimate || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500
                         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Affected Households */}
          <div>
            <label htmlFor="affectedHouseholds" className="block text-base font-semibold text-gray-900 mb-3">
              จำนวนครัวเรือน
            </label>
            <input
              id="affectedHouseholds"
              type="number"
              name="affectedHouseholds"
              value={formData.affectedHouseholds || ''}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="0"
              className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500
                         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Affected Persons */}
          <div>
            <label htmlFor="affectedPersons" className="block text-base font-semibold text-gray-900 mb-3">
              จำนวนผู้ได้รับผลกระทบ
            </label>
            <input
              id="affectedPersons"
              type="number"
              name="affectedPersons"
              value={formData.affectedPersons || ''}
              onChange={handleChange}
              min="0"
              step="1"
              placeholder="0"
              className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500
                         focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Photo URLs Section */}
      <section className="bg-white rounded-lg border-2 border-gray-300 p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-gray-400 flex items-center gap-2">
          <Image className="w-6 h-6" />
          รูปภาพประกอบ
        </h3>

        <div>
          <label htmlFor="photoUrls" className="block text-base font-semibold text-gray-900 mb-3">
            URL รูปภาพ (คั่นด้วย comma)
          </label>
          <textarea
            id="photoUrls"
            name="photoUrls"
            value={Array.isArray(formData.photoUrls) ? formData.photoUrls.join(', ') : formData.photoUrls}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                photoUrls: e.target.value as any,
              }))
            }
            rows={4}
            placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
            className="w-full px-4 py-4 text-lg border-2 border-gray-400 rounded-lg text-gray-900 placeholder-gray-500 font-mono
                       focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 
                       transition-all resize-none"
          />
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            ใส่ URL รูปภาพที่อัปโหลดแล้ว คั่นแต่ละรูปด้วย comma (,)
          </p>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-end gap-4 pt-8 border-t-2 border-gray-400">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 min-h-[48px] border-2 border-gray-400 rounded-lg 
                     text-base font-semibold text-gray-700 bg-white 
                     hover:bg-gray-50 active:bg-gray-100 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 min-h-[48px] bg-blue-600 text-white rounded-lg 
                     text-base font-semibold shadow-md
                     hover:bg-blue-700 active:bg-blue-800 transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {report ? 'บันทึกการแก้ไข' : 'สร้างรายงาน'}
        </button>
      </div>
    </form>
  );
};

export default ReportForm;
