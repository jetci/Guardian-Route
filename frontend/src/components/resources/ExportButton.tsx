import React, { useState } from 'react';

interface ExportButtonProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  isExporting: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  onExportPDF,
  onExportExcel,
  isExporting,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (exportFunc: () => void) => {
    exportFunc();
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={isExporting}
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isExporting ? 'กำลังส่งออก...' : '📥 ส่งออก'}
        </button>
      </div>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleExport(onExportPDF);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              ส่งออกเป็น PDF
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleExport(onExportExcel);
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              role="menuitem"
            >
              ส่งออกเป็น Excel
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
