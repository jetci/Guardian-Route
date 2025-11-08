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

interface ReportFormProps {
  report?: Report; // If editing
  incidentId?: string; // If creating from incident
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
    
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'number'
          ? value === ''
            ? undefined
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields based on report type
      if (formData.type === ReportType.INCIDENT && !formData.incidentId) {
        throw new Error('กรุณาเลือกเหตุการณ์สำหรับรายงานประเภท INCIDENT');
      }

      if (
        (formData.type === ReportType.MONTHLY || formData.type === ReportType.CUSTOM) &&
        (!formData.periodStart || !formData.periodEnd)
      ) {
        throw new Error('กรุณาระบุช่วงเวลาสำหรับรายงานประเภท MONTHLY หรือ CUSTOM');
      }

      let result: Report;
      
      if (report) {
        // Update existing report
        result = await updateReport(report.id, formData as UpdateReportDto);
      } else {
        // Create new report
        result = await createReport(formData);
      }

      if (onSuccess) {
        onSuccess(result);
      } else {
        navigate(`/reports/${result.id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/reports');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md font-medium">
          {error}
        </div>
      )}

      {/* Report Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ประเภทรายงาน <span className="text-red-500">*</span>
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          disabled={!!report} // Cannot change type when editing
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อรายงาน <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="เช่น รายงานสรุปเหตุการณ์น้ำท่วม หมู่ 1"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          สรุปรายงาน
        </label>
        <textarea
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          rows={3}
          placeholder="สรุปสั้นๆ เกี่ยวกับรายงาน"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Period (for MONTHLY and CUSTOM reports) */}
      {(formData.type === ReportType.MONTHLY || formData.type === ReportType.CUSTOM) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่เริ่มต้น <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="periodStart"
              value={
                formData.periodStart
                  ? new Date(formData.periodStart).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  periodStart: e.target.value ? new Date(e.target.value).toISOString() : '',
                }))
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              วันที่สิ้นสุด <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="periodEnd"
              value={
                formData.periodEnd
                  ? new Date(formData.periodEnd).toISOString().slice(0, 16)
                  : ''
              }
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  periodEnd: e.target.value ? new Date(e.target.value).toISOString() : '',
                }))
              }
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Damage Assessment */}
      <div className="pt-6 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">ประเมินความเสียหาย</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ความเสียหายโดยประมาณ (บาท)
            </label>
            <input
              type="number"
              name="totalDamageEstimate"
              value={formData.totalDamageEstimate || ''}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนครัวเรือนที่ได้รับผลกระทบ
            </label>
            <input
              type="number"
              name="affectedHouseholds"
              value={formData.affectedHouseholds || ''}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              จำนวนผู้ได้รับผลกระทบ (คน)
            </label>
            <input
              type="number"
              name="affectedPersons"
              value={formData.affectedPersons || ''}
              onChange={handleChange}
              min="0"
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Photo URLs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL รูปภาพ (คั่นด้วย comma)
        </label>
        <textarea
          name="photoUrls"
          value={formData.photoUrls?.join(', ') || ''}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              photoUrls: e.target.value
                .split(',')
                .map((url) => url.trim())
                .filter((url) => url),
            }))
          }
          rows={2}
          placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        <p className="mt-2 text-sm text-gray-600">
          ใส่ URL รูปภาพ คั่นด้วยเครื่องหมาย comma (,)
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors font-medium shadow-sm"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-md flex items-center"
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
