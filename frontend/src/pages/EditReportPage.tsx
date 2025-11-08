import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ReportForm } from '../components/reports';
import type { Report } from '../types/Report';
import { getReportById } from '../api/reports';

const EditReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadReport();
    }
  }, [id]);

  const loadReport = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getReportById(id);
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (updatedReport: Report) => {
    navigate(`/reports/${updatedReport.id}`);
  };

  const handleCancel = () => {
    navigate(`/reports/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md">
            {error || 'Report not found'}
          </div>
          <div className="mt-4">
            <Link
              to="/reports"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← กลับไปหน้ารายงาน
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">แก้ไขรายงาน</h1>
          <p className="mt-2 text-base text-gray-600">
            แก้ไขข้อมูลรายงาน: {report.title}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <ReportForm
            report={report}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default EditReportPage;
