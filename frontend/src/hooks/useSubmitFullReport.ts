import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullReportFormData } from '../types/full-report';
import { useAuditTrail } from './useAuditTrail';

interface SubmitOptions {
  taskId: string;
  formData: FullReportFormData;
}

interface SubmitResult {
  success: boolean;
  reportId?: string;
  message?: string;
}

export const useSubmitFullReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { auditLog, logChange } = useAuditTrail();

  const validateBeforeSubmit = (formData: FullReportFormData): string | null => {
    // Check required fields
    if (!formData.reportTitle || formData.reportTitle.length < 10) {
      return 'กรุณากรอกหัวข้อรายงาน (อย่างน้อย 10 ตัวอักษร)';
    }

    if (!formData.executiveSummary || formData.executiveSummary.length < 50) {
      return 'กรุณากรอกสรุปสำหรับผู้บริหาร (อย่างน้อย 50 ตัวอักษร)';
    }

    // Check if AI analysis exists (if images were uploaded)
    if (formData.photoUrls && formData.photoUrls.length > 0 && !formData.aiAnalysis) {
      return 'กรุณารอการวิเคราะห์ภาพจาก AI ให้เสร็จสิ้นก่อนส่งรายงาน';
    }

    // Check final recommendations
    if (!formData.recommendations || formData.recommendations.length < 100) {
      return 'กรุณากรอกข้อเสนอแนะทั่วไป (อย่างน้อย 100 ตัวอักษร)';
    }

    if (!formData.policyRecommendations || formData.policyRecommendations.length < 100) {
      return 'กรุณากรอกข้อเสนอแนะเชิงนโยบาย (อย่างน้อย 100 ตัวอักษร)';
    }

    if (!formData.futurePreventionMeasures || formData.futurePreventionMeasures.length < 100) {
      return 'กรุณากรอกมาตรการป้องกันในอนาคต (อย่างน้อย 100 ตัวอักษร)';
    }

    return null;
  };

  const submitReport = async (options: SubmitOptions): Promise<SubmitResult> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate before submit
      const validationError = validateBeforeSubmit(options.formData);
      if (validationError) {
        setError(validationError);
        return { success: false, message: validationError };
      }

      // Log submission attempt
      logChange({
        action: 'CREATE',
        field: 'full_report',
        newValue: 'Submitting full report',
        source: 'USER',
      });

      // TODO: Replace with actual API call
      // const response = await api.post('/reports/full', {
      //   taskId: options.taskId,
      //   ...options.formData,
      //   auditLog: auditLog,
      // });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock success response
      const mockReportId = 'report-' + Math.random().toString(36).substr(2, 9);

      // Log successful submission
      logChange({
        action: 'CREATE',
        field: 'full_report',
        newValue: `Report ${mockReportId} submitted successfully`,
        source: 'USER',
      });

      return {
        success: true,
        reportId: mockReportId,
        message: 'ส่งรายงานสำเร็จ',
      };
    } catch (err: any) {
      const errorMessage = err.message || 'เกิดข้อผิดพลาดในการส่งรายงาน';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAndRedirect = async (options: SubmitOptions) => {
    const result = await submitReport(options);

    if (result.success) {
      // Show success toast (assuming toast is available globally)
      // toast.success('ส่งรายงานสำเร็จ รายงานอยู่ในสถานะรอการตรวจสอบ');

      // Clear draft from localStorage
      localStorage.removeItem(`wizard-draft-${options.taskId}`);

      // Redirect to task detail page
      navigate(`/tasks/${options.taskId}`, {
        state: { message: 'ส่งรายงานสำเร็จ' },
      });
    }

    return result;
  };

  return {
    isSubmitting,
    error,
    submitReport,
    submitAndRedirect,
    validateBeforeSubmit,
  };
};
