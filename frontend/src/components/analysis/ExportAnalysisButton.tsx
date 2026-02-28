import { Button, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import type { OverlayAnalysisResult } from '../../api/analysis';

interface ExportAnalysisButtonProps {
  analysisResult: OverlayAnalysisResult;
}

export const ExportAnalysisButton = ({ analysisResult }: ExportAnalysisButtonProps) => {
  const toast = useToast();

  const exportToPDF = () => {
    try {
      // Create PDF content
      const content = generatePDFContent(analysisResult);
      
      // Create blob and download
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `overlay-analysis-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'ส่งออกสำเร็จ',
        description: 'ดาวน์โหลดรายงานเรียบร้อยแล้ว',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งออกรายงานได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const exportToExcel = () => {
    try {
      // Create CSV content
      const content = generateCSVContent(analysisResult);
      
      // Create blob and download
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `overlay-analysis-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: 'ส่งออกสำเร็จ',
        description: 'ดาวน์โหลดรายงานเรียบร้อยแล้ว',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งออกรายงานได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} colorScheme="green" size="sm">
        ส่งออกรายงาน
      </MenuButton>
      <MenuList>
        <MenuItem onClick={exportToPDF}>ส่งออกเป็น PDF</MenuItem>
        <MenuItem onClick={exportToExcel}>ส่งออกเป็น Excel</MenuItem>
      </MenuList>
    </Menu>
  );
};

function generatePDFContent(result: OverlayAnalysisResult): string {
  const date = new Date().toLocaleDateString('th-TH');
  
  let content = `รายงานการวิเคราะห์ภัยซ้ำซาก\n`;
  content += `วันที่: ${date}\n`;
  content += `\n`;
  content += `สรุปผลการวิเคราะห์\n`;
  content += `===================\n`;
  content += `จำนวนเหตุการณ์ทั้งหมด: ${result.totalIncidents} รายการ\n`;
  content += `พื้นที่ซ้ำซาก: ${result.overlappingAreas.length} พื้นที่\n`;
  content += `ระดับความเสี่ยง: ${result.riskScore}/100\n`;
  content += `\n`;
  
  content += `รายละเอียดพื้นที่ซ้ำซาก\n`;
  content += `===================\n`;
  result.overlappingAreas.forEach((area, index) => {
    content += `\nพื้นที่ที่ ${index + 1}:\n`;
    content += `  จำนวนเหตุการณ์: ${area.incidentCount} รายการ\n`;
    content += `  พื้นที่: ${area.area.toFixed(2)} ตารางกิโลเมตร\n`;
    content += `  ระดับความเสี่ยง: ${area.riskLevel}\n`;
  });
  
  content += `\n`;
  content += `คำแนะนำ\n`;
  content += `===================\n`;
  result.recommendations.forEach((rec, index) => {
    content += `${index + 1}. ${rec}\n`;
  });
  
  return content;
}

function generateCSVContent(result: OverlayAnalysisResult): string {
  let csv = '\uFEFF'; // BOM for UTF-8
  
  // Summary
  csv += 'สรุปผลการวิเคราะห์\n';
  csv += `จำนวนเหตุการณ์,${result.totalIncidents}\n`;
  csv += `พื้นที่ซ้ำซาก,${result.overlappingAreas.length}\n`;
  csv += `ระดับความเสี่ยง,${result.riskScore}\n`;
  csv += '\n';
  
  // Areas
  csv += 'พื้นที่,จำนวนเหตุการณ์,พื้นที่ (ตร.กม.),ระดับความเสี่ยง\n';
  result.overlappingAreas.forEach((area, index) => {
    csv += `พื้นที่ ${index + 1},${area.incidentCount},${area.area.toFixed(2)},${area.riskLevel}\n`;
  });
  
  csv += '\n';
  csv += 'คำแนะนำ\n';
  result.recommendations.forEach((rec, index) => {
    csv += `${index + 1},${rec}\n`;
  });
  
  return csv;
}
