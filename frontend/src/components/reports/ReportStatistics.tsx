import React, { useState, useEffect } from 'react';
import type { ReportStatistics as ReportStatsType, ReportType } from '../../types/Report';
import { getReportStatistics } from '../../api/reports';

interface ReportStatisticsProps {
  periodStart?: string;
  periodEnd?: string;
  type?: ReportType;
}

const ReportStatistics: React.FC<ReportStatisticsProps> = ({
  periodStart,
  periodEnd,
  type,
}) => {
  const [stats, setStats] = useState<ReportStatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, [periodStart, periodEnd, type]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReportStatistics({
        periodStart,
        periodEnd,
        type,
      });
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md font-medium">
        {error}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-50 rounded-xl p-4">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">รายงานทั้งหมด</p>
              <p className="text-3xl font-extrabold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-50 rounded-xl p-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ความเสียหายเฉลี่ย</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {formatCurrency(stats.avgDamageEstimate)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-50 rounded-xl p-4">
              <svg
                className="h-6 w-6 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ครัวเรือนที่ได้รับผลกระทบ</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {stats.totalAffectedHouseholds}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-50 rounded-xl p-4">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">ผู้ได้รับผลกระทบ</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {stats.totalAffectedPersons}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* By Status */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">รายงานตามสถานะ</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Object.entries(stats.byStatus).map(([status, count]) => (
            <div key={status} className="text-center bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-4xl font-extrabold text-gray-900">{count}</p>
              <p className="text-base text-gray-600 mt-1 font-medium">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* By Type */}
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">รายงานตามประเภท</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {Object.entries(stats.byType).map(([type, count]) => (
            <div key={type} className="text-center">
              <p className="text-4xl font-extrabold text-gray-900">{count}</p>
              <p className="text-base text-gray-600 mt-1 font-medium">{type}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportStatistics;
