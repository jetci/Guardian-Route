import React from 'react';
import type { ExportJob } from '../types/export';
import { ExportJobStatus } from '../types/export';
import { downloadExportFile } from '../api/export';

interface ExportJobStatusTableProps {
  jobs: ExportJob[];
  isLoading: boolean;
}

const getStatusColor = (status: ExportJobStatus): string => {
  switch (status) {
    case ExportJobStatus.DONE:
      return 'text-green-600 bg-green-100';
    case ExportJobStatus.FAILED:
      return 'text-red-600 bg-red-100';
    case ExportJobStatus.PROCESSING:
      return 'text-blue-600 bg-blue-100 animate-pulse';
    case ExportJobStatus.PENDING:
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const ExportJobStatusTable: React.FC<ExportJobStatusTableProps> = ({ jobs, isLoading }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Export Job Status
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          รายการสถานะการส่งออกไฟล์ PDF/Excel ล่าสุดของคุณ
        </p>
      </div>
      <div className="border-t border-gray-200">
        {isLoading && (
          <div className="p-4 text-center text-blue-500">
            กำลังโหลดสถานะงาน...
          </div>
        )}
        {!isLoading && jobs.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            ไม่พบรายการ Export Jobs
          </div>
        )}
        {!isLoading && jobs.length > 0 && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ประเภท
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ร้องขอเมื่อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เสร็จสิ้นเมื่อ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ไฟล์
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.jobId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {job.exportType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(job.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(job.finishedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {job.fileName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {job.status === ExportJobStatus.DONE && job.fileName ? (
                      <button
                        onClick={() => downloadExportFile(job.jobId, job.fileName!)}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                      >
                        ดาวน์โหลด
                      </button>
                    ) : job.status === ExportJobStatus.FAILED ? (
                      <span className="text-red-500 cursor-help" title={job.error || 'Unknown error'}>
                        ดูข้อผิดพลาด
                      </span>
                    ) : (
                      <button disabled className="text-gray-400">
                        รอ...
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExportJobStatusTable;
