import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface IntersectionResult {
  geometry: GeoJSON.Polygon;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  incidentCount: number;
  area: number;
}

interface ExportOverlayButtonProps {
  results: IntersectionResult[];
  disabled?: boolean;
  analysisName?: string;
  mapImageBase64?: string;
}

const ExportOverlayButton: React.FC<ExportOverlayButtonProps> = ({
  results,
  disabled = false,
  analysisName = 'Overlay Analysis',
  mapImageBase64,
}) => {
  const [exporting, setExporting] = useState<'excel' | 'pdf' | null>(null);

  const handleExport = async (format: 'excel' | 'pdf') => {
    if (results.length === 0) {
      toast.error('ไม่มีข้อมูลสำหรับ Export');
      return;
    }

    try {
      setExporting(format);
      toast.loading(`กำลัง Export ${format.toUpperCase()}...`, { id: 'export' });
      
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

      const response = await axios.post(
        `${apiUrl}/export/overlay/${format}`,
        {
          results,
          analysisName,
          mapImageBase64,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      // Download file
      const blob = new Blob([response.data], {
        type: format === 'excel'
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf',
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `overlay-analysis-${Date.now()}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast.success(`ดาวน์โหลด ${format.toUpperCase()} เรียบร้อย`, { id: 'export' });
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.response?.data?.message || `ไม่สามารถ Export ${format.toUpperCase()} ได้`, { id: 'export' });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => handleExport('excel')}
        disabled={disabled || exporting !== null || results.length === 0}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {exporting === 'excel' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>กำลัง Export...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Export Excel</span>
          </>
        )}
      </button>

      <button
        onClick={() => handleExport('pdf')}
        disabled={disabled || exporting !== null || results.length === 0}
        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {exporting === 'pdf' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>กำลัง Export...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>Export PDF</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ExportOverlayButton;
