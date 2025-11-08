import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReportList, ReportStatistics } from '../components/reports';

const ReportsPage: React.FC = () => {
  const [showStatistics, setShowStatistics] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">รายงาน</h1>
              <p className="mt-2 text-base text-gray-600">
                จัดการและติดตามรายงานทั้งหมดในระบบ
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowStatistics(!showStatistics)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
              >
                {showStatistics ? 'ซ่อนสถิติ' : 'แสดงสถิติ'}
              </button>
              <Link
                to="/reports/new"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md"
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                สร้างรายงานใหม่
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {showStatistics && (
          <div className="mb-8">
            <ReportStatistics />
          </div>
        )}

        {/* Reports List */}
        <ReportList showFilters={true} />
      </div>
    </div>
  );
};

export default ReportsPage;
