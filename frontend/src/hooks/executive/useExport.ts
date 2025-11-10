import { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { DashboardSummary, TaskTrend, IncidentDistribution, RegionData } from '../../types/executive';
import { SupervisorTask } from '../../types/supervisor';

interface ExportData {
  summary: DashboardSummary | null;
  trends: TaskTrend[];
  distribution: IncidentDistribution[];
  regions: RegionData[];
  tasks: SupervisorTask[];
}

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportToPDF = async (data: ExportData) => {
    setIsExporting(true);
    setError(null);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Title
      pdf.setFontSize(20);
      pdf.text('Executive Dashboard Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Export Date
      pdf.setFontSize(10);
      pdf.text(`Export Date: ${new Date().toLocaleString('th-TH')}`, pageWidth / 2, yPosition, {
        align: 'center',
      });
      yPosition += 15;

      // Summary Section
      if (data.summary) {
        pdf.setFontSize(14);
        pdf.text('Summary Statistics', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        const summaryData = [
          [`Total Tasks`, data.summary.totalTasks.toString()],
          [`Total Incidents`, data.summary.totalIncidents.toString()],
          [`Total Reports`, data.summary.totalReports.toString()],
          [`Active Officers`, data.summary.activeFieldOfficers.toString()],
          [`Affected Households`, data.summary.totalAffectedHouseholds.toString()],
          [`Affected Population`, data.summary.totalAffectedPopulation.toString()],
          [`Estimated Damage (THB)`, data.summary.totalEstimatedDamage.toLocaleString()],
        ];

        summaryData.forEach(([label, value]) => {
          pdf.text(`${label}: ${value}`, 15, yPosition);
          yPosition += 6;
        });

        yPosition += 5;
      }

      // Capture charts as images
      const chartsContainer = document.querySelector('.charts-section');
      if (chartsContainer) {
        const canvas = await html2canvas(chartsContainer as HTMLElement, {
          scale: 2,
          logging: false,
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Tasks List
      if (data.tasks.length > 0) {
        if (yPosition + 50 > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.text('Tasks List', 15, yPosition);
        yPosition += 8;

        pdf.setFontSize(8);
        data.tasks.slice(0, 20).forEach((task, index) => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.text(
            `${index + 1}. ${task.title} - ${task.status} - ${task.priority}`,
            15,
            yPosition
          );
          yPosition += 5;
        });

        if (data.tasks.length > 20) {
          yPosition += 5;
          pdf.text(`... and ${data.tasks.length - 20} more tasks`, 15, yPosition);
        }
      }

      // Save PDF
      const fileName = `executive-dashboard-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export PDF';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  const exportToExcel = async (data: ExportData) => {
    setIsExporting(true);
    setError(null);

    try {
      const workbook = XLSX.utils.book_new();

      // Summary Sheet
      if (data.summary) {
        const summaryData = [
          ['Metric', 'Value'],
          ['Total Tasks', data.summary.totalTasks],
          ['Total Incidents', data.summary.totalIncidents],
          ['Total Reports', data.summary.totalReports],
          ['Active Field Officers', data.summary.activeFieldOfficers],
          ['Affected Households', data.summary.totalAffectedHouseholds],
          ['Affected Population', data.summary.totalAffectedPopulation],
          ['Estimated Damage (THB)', data.summary.totalEstimatedDamage],
          [],
          ['Tasks by Status', ''],
          ['PENDING_ASSIGNMENT', data.summary.tasksByStatus.PENDING_ASSIGNMENT],
          ['IN_PROGRESS', data.summary.tasksByStatus.IN_PROGRESS],
          ['SURVEYED', data.summary.tasksByStatus.SURVEYED],
          ['COMPLETED', data.summary.tasksByStatus.COMPLETED],
          ['CANCELLED', data.summary.tasksByStatus.CANCELLED],
        ];

        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
      }

      // Task Trends Sheet
      if (data.trends.length > 0) {
        const trendsSheet = XLSX.utils.json_to_sheet(data.trends);
        XLSX.utils.book_append_sheet(workbook, trendsSheet, 'Task Trends');
      }

      // Incident Distribution Sheet
      if (data.distribution.length > 0) {
        const distributionSheet = XLSX.utils.json_to_sheet(data.distribution);
        XLSX.utils.book_append_sheet(workbook, distributionSheet, 'Incident Distribution');
      }

      // Tasks by Region Sheet
      if (data.regions.length > 0) {
        const regionsSheet = XLSX.utils.json_to_sheet(data.regions);
        XLSX.utils.book_append_sheet(workbook, regionsSheet, 'Tasks by Region');
      }

      // Tasks List Sheet
      if (data.tasks.length > 0) {
        const tasksData = data.tasks.map((task) => ({
          Title: task.title,
          Status: task.status,
          Priority: task.priority,
          'Assigned To': task.assignedTo?.name || 'N/A',
          Location: task.incident?.location?.village || 'N/A',
          'Created At': new Date(task.createdAt).toLocaleString('th-TH'),
          'Updated At': new Date(task.updatedAt).toLocaleString('th-TH'),
        }));

        const tasksSheet = XLSX.utils.json_to_sheet(tasksData);
        XLSX.utils.book_append_sheet(workbook, tasksSheet, 'Tasks');
      }

      // Save Excel
      const fileName = `executive-dashboard-${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to export Excel';
      setError(errorMessage);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPDF,
    exportToExcel,
    isExporting,
    error,
  };
};
