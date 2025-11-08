import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReportForm } from '../components/reports';
import type { Report } from '../types/Report';

const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const incidentId = searchParams.get('incidentId') || undefined;

  const handleSuccess = (report: Report) => {
    navigate(`/reports/${report.id}`);
  };

  const handleCancel = () => {
    navigate('/reports');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">สร้างรายงานใหม่</h1>
          <p className="mt-2 text-base text-gray-600">
            กรอกข้อมูลรายงานให้ครบถ้วนและถูกต้อง
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <ReportForm
            incidentId={incidentId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;
