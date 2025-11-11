import { Button, Menu, MenuButton, MenuList, MenuItem, useToast } from '@chakra-ui/react';
import { FiDownload, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';

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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/export/pdf`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'text',
        }
      );

      // Open PDF in new tab (HTML format from backend)
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(response.data);
        newWindow.document.close();
      }

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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/export/excel`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

      // Download Excel file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `executive-dashboard-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

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
