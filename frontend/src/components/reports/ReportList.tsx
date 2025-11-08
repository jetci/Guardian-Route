import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  type Report,
  ReportType,
  ReportStatus,
  type FilterReportDto,
} from '../../types/Report';
import { getReports, deleteReport } from '../../api/reports';

interface ReportListProps {
  incidentId?: string; // Optional: filter by incident
  showFilters?: boolean;
}

const ReportList: React.FC<ReportListProps> = ({
  incidentId,
  showFilters = true,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState<FilterReportDto>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    incidentId,
  });

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReports(filters);
      setReports(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
      setPage(response.meta.page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบรายงานนี้?')) return;
    
    try {
      await deleteReport(id);
      loadReports();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete report');
    }
  };

  const handleFilterChange = (key: keyof FilterReportDto, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filter changes
    }));
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

  const getTypeBadgeClass = (type: ReportType): string => {
    const classes: Record<ReportType, string> = {
      [ReportType.INCIDENT]: 'bg-red-100 text-red-800',
      [ReportType.TASK]: 'bg-blue-100 text-blue-800',
      [ReportType.SURVEY]: 'bg-purple-100 text-purple-800',
      [ReportType.MONTHLY]: 'bg-indigo-100 text-indigo-800',
      [ReportType.CUSTOM]: 'bg-teal-100 text-teal-800',
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ประเภทรายงาน
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) =>
                  handleFilterChange('type', e.target.value || undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">ทั้งหมด</option>
                {Object.values(ReportType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                สถานะ
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  handleFilterChange('status', e.target.value || undefined)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">ทั้งหมด</option>
                {Object.values(ReportStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เรียงตาม
              </label>
              <select
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="createdAt">วันที่สร้าง</option>
                <option value="updatedAt">วันที่แก้ไข</option>
                <option value="title">ชื่อรายงาน</option>
                <option value="type">ประเภท</option>
                <option value="status">สถานะ</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ลำดับ
              </label>
              <select
                value={filters.sortOrder || 'desc'}
                onChange={(e) =>
                  handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="desc">ใหม่สุด → เก่าสุด</option>
                <option value="asc">เก่าสุด → ใหม่สุด</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-6 py-4 rounded-xl shadow-md font-medium">
          {error}
        </div>
      )}

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-xl text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <p className="mt-2">ไม่พบรายงาน</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    รายงาน
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    ประเภท
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    ผู้สร้าง
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    วันที่สร้าง
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                    การจัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-blue-50/50 transition-colors cursor-pointer" onClick={() => window.location.href = `/reports/${report.id}`}>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <Link
                        to={`/reports/${report.id}`}
                        className="text-blue-700 hover:text-blue-900 font-extrabold text-lg"
                      >
                        {report.title}
                      </Link>
                      {report.summary && (
                        <p className="text-sm text-gray-600 mt-1">
                          {report.summary.substring(0, 100)}
                          {report.summary.length > 100 && '...'}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${getTypeBadgeClass(
                          report.type
                        )}`}
                      >
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadgeClass(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-700 font-medium">
                      {report.author.firstName} {report.author.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link
                        to={`/reports/${report.id}`}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        ดู
                      </Link>
                      {report.status === ReportStatus.DRAFT && (
                        <>
                          <Link
                            to={`/reports/${report.id}/edit`}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold"
                          >
                            แก้ไข
                          </Link>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(report.id); }}
                            className="text-red-600 hover:text-red-800 font-semibold"
                          >
                            ลบ
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-4 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-b-2xl">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: page - 1 }))}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm"
              >
                ก่อนหน้า
              </button>
              <button
                onClick={() => setFilters((prev) => ({ ...prev, page: page + 1 }))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 transition-colors shadow-sm"
              >
                ถัดไป
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  แสดง <span className="font-medium">{(page - 1) * (filters.limit || 10) + 1}</span> ถึง{' '}
                  <span className="font-medium">
                    {Math.min(page * (filters.limit || 10), total)}
                  </span>{' '}
                  จาก <span className="font-medium">{total}</span> รายการ
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-xl shadow-md">
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, page: page - 1 }))}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-3 py-2 rounded-l-xl border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    ก่อนหน้า
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setFilters((prev) => ({ ...prev, page: pageNum }))}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-colors ${
                        pageNum === page
                          ? 'z-10 bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, page: page + 1 }))}
                    disabled={page === totalPages}
                    className="relative inline-flex items-center px-3 py-2 rounded-r-xl border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    ถัดไป
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportList;
