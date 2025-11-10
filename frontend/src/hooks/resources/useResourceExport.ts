import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { Resource } from '../../types/resource';

interface UseResourceExportReturn {
  isExporting: boolean;
  exportToPDF: (resources: Resource[], filters: any) => Promise<void>;
  exportToExcel: (resources: Resource[], filters: any) => Promise<void>;
}

export const useResourceExport = (): UseResourceExportReturn => {
  const [isExporting, setIsExporting] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const exportToPDF = async (resources: Resource[], filters: any) => {
    setIsExporting(true);

    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      const today = formatDate(new Date());

      // Add Thai font
      // Note: jsPDF does not support Thai fonts out of the box.
      // This is a placeholder. For production, a custom font would be needed.
      doc.setFont('helvetica', 'normal');

      // Header
      doc.setFontSize(18);
      doc.text('Resource Report', 40, 60);
      doc.setFontSize(10);
      doc.text(`Export Date: ${today}`, 40, 80);

      // Table
      const tableData = resources.map((res) => [
        res.id.slice(0, 8),
        res.name,
        res.resourceType.name,
        res.status,
        res.location,
        res.registrationNumber || '-',
      ]);

      (doc as any).autoTable({
        startY: 100,
        head: [['ID', 'Name', 'Type', 'Status', 'Location', 'Registration']],
        body: tableData,
        theme: 'grid',
        styles: {
          font: 'helvetica',
          fontSize: 8,
        },
        headStyles: {
          fillColor: [22, 160, 133],
          textColor: 255,
          fontStyle: 'bold',
        },
      });

      // Signature
      const finalY = (doc as any).lastAutoTable.finalY || 700;
      doc.setFontSize(10);
      doc.text('Exported by: Guardian-Route System', 40, finalY + 40);

      // Save
      doc.save(`resources-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async (resources: Resource[], filters: any) => {
    setIsExporting(true);

    try {
      const worksheetData = resources.map((res) => ({
        ID: res.id,
        Name: res.name,
        Type: res.resourceType.name,
        Status: res.status,
        Location: res.location,
        'Registration Number': res.registrationNumber || '-',
        'Created At': res.createdAt,
        'Updated At': res.updatedAt,
      }));

      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Resources');

      XLSX.writeFile(workbook, `resources-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportToPDF,
    exportToExcel,
  };
};
