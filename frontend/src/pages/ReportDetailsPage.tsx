import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ReportDetails } from '../components/reports';
import type { Report } from '../types/Report';
import { getReportById } from '../api/reports';
import { useAuthStore } from '../stores/authStore';

const ReportDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-3 text-base">
            <li>
              <Link to="/reports" className="text-gray-500 hover:text-gray-700">
                รายงาน
              </Link>
            </li>
            <li>
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            </li>
            <li>
              <span className="text-gray-900 font-extrabold">{report.title}</span>
            </li>
          </ol>
        </nav>

        {/* Report Details */}
        <ReportDetails
          report={report}
          currentUser={user}
          onUpdate={loadReport}
        />

        {/* Back Button */}
        <div className="mt-10">
          <Link
            to="/reports"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            กลับไปหน้ารายงาน
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailsPage;
