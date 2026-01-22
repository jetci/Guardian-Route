import { Button, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import { analyticsApi } from '../../api/analytics';

export const ExportButton = () => {
  const toast = useToast();

  const exportToPDF = async () => {
    try {
      toast({
        title: 'กำลังสร้างรายงาน PDF',
        description: 'กรุณารอสักครู่...',
        status: 'info',
        duration: 2000,
      });

      // Fetch all data
      const [kpi, trend, byType, critical, riskAreas] = await Promise.all([
        analyticsApi.getKpiSummary(),
        analyticsApi.getTrendData(),
        analyticsApi.getIncidentsByType(),
        analyticsApi.getCriticalIncidents(),
        analyticsApi.getRiskAreas(),
      ]);

      // Create PDF content
      const content = `
Guardian Route - Executive Dashboard Report
Generated: ${new Date().toLocaleString('th-TH')}

=== KPI Summary ===
Total Incidents: ${kpi.total}
Pending: ${kpi.pending}
In Progress: ${kpi.inProgress}
Resolved: ${kpi.resolved}
Avg Resolution Time: ${kpi.avgResolutionTime}

=== Trend Data (Last 6 Months) ===
${trend.map((t: any) => `${t.month}: ${t.count} incidents, ${t.avgResponseTime}h avg response`).join('\n')}

=== Incidents by Type ===
${byType.map((t: any) => `${t.type}: ${t.count} (${t.percentage}%)`).join('\n')}

=== Critical Incidents ===
${critical.map((i: any) => `${i.title} - ${i.priority} - ${i.status}`).join('\n')}

=== Risk Areas ===
${riskAreas.map((r: any) => `Lat: ${r.lat}, Lng: ${r.lng}, Count: ${r.count}, Severity: ${r.severity}/5`).join('\n')}
      `;

      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `executive-dashboard-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'ส่งออกสำเร็จ',
        description: 'ดาวน์โหลดรายงาน PDF แล้ว',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Export PDF error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งออกรายงาน PDF ได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const exportToExcel = async () => {
    try {
      toast({
        title: 'กำลังสร้างไฟล์ Excel',
        description: 'กรุณารอสักครู่...',
        status: 'info',
        duration: 2000,
      });

      // Fetch all data
      const [kpi, trend, byType, critical] = await Promise.all([
        analyticsApi.getKpiSummary(),
        analyticsApi.getTrendData(),
        analyticsApi.getIncidentsByType(),
        analyticsApi.getCriticalIncidents(),
      ]);

      // Create CSV content
      let csv = 'Guardian Route - Executive Dashboard Report\n';
      csv += `Generated: ${new Date().toLocaleString('th-TH')}\n\n`;

      csv += 'KPI Summary\n';
      csv += 'Metric,Value\n';
      csv += `Total Incidents,${kpi.total}\n`;
      csv += `Pending,${kpi.pending}\n`;
      csv += `In Progress,${kpi.inProgress}\n`;
      csv += `Resolved,${kpi.resolved}\n`;
      csv += `Avg Resolution Time,${kpi.avgResolutionTime}\n\n`;

      csv += 'Trend Data\n';
      csv += 'Month,Count,Avg Response Time (h)\n';
      trend.forEach((t: any) => {
        csv += `${t.month},${t.count},${t.avgResponseTime}\n`;
      });
      csv += '\n';

      csv += 'Incidents by Type\n';
      csv += 'Type,Count,Percentage\n';
      byType.forEach((t: any) => {
        csv += `${t.type},${t.count},${t.percentage}%\n`;
      });
      csv += '\n';

      csv += 'Critical Incidents\n';
      csv += 'Title,Priority,Status,Location,Date\n';
      critical.forEach((i: any) => {
        csv += `"${i.title}",${i.priority},${i.status},"${i.location}",${new Date(i.createdAt).toLocaleDateString('th-TH')}\n`;
      });

      // Create blob and download
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `executive-dashboard-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'ส่งออกสำเร็จ',
        description: 'ดาวน์โหลดไฟล์ Excel (CSV) แล้ว',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Export Excel error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งออกไฟล์ Excel ได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<FiChevronDown />} leftIcon={<FiDownload />} colorScheme="blue">
        ส่งออกรายงาน
      </MenuButton>
      <MenuList>
        <MenuItem onClick={exportToPDF}>ส่งออกเป็น PDF</MenuItem>
        <MenuItem onClick={exportToExcel}>ส่งออกเป็น Excel</MenuItem>
      </MenuList>
    </Menu>
  );
};
