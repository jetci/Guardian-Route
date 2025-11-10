import React, { useState } from 'react';
import { useExport } from '../../hooks/executive/useExport';
import { DashboardSummary, TaskTrend, IncidentDistribution, RegionData } from '../../types/executive';
import { SupervisorTask } from '../../types/supervisor';
import toast from 'react-hot-toast';

interface ExportButtonProps {
  summary: DashboardSummary | null;
  trends: TaskTrend[];
  distribution: IncidentDistribution[];
  regions: RegionData[];
  tasks: SupervisorTask[];
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  summary,
  trends,
  distribution,
  regions,
  tasks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { exportToPDF, exportToExcel, isExporting } = useExport();

  const handleExportPDF = async () => {
    setIsOpen(false);
    try {
      await exportToPDF({ summary, trends, distribution, regions, tasks });
      toast.success('ส่งออก PDF สำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการส่งออก PDF');
    }
  };

  const handleExportExcel = async () => {
    setIsOpen(false);
    try {
      await exportToExcel({ summary, trends, distribution, regions, tasks });
      toast.success('ส่งออก Excel สำเร็จ');
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการส่งออก Excel');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        {isExporting ? (
          <>
            <span className="mr-2">⏳</span>
            กำลังส่งออก...
          </>
        ) : (
          <>
            <span className="mr-2">📥</span>
            ส่งออก
          </>
        )}
      </button>

      {isOpen && !isExporting && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-20 overflow-hidden">
            <button
              onClick={handleExportPDF}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center"
            >
              <span className="mr-3">📄</span>
              <span>Export as PDF</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors flex items-center border-t border-gray-200"
            >
              <span className="mr-3">📊</span>
              <span>Export as Excel</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
