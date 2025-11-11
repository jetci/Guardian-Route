import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Select,
  Input,
  Button,
  useToast,
  Flex,
  Text,
  Code,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiDownload, FiEye } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  targetType?: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

const AuditLogTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const toast = useToast();

  // Fetch audit logs
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', page, actionFilter, targetTypeFilter, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '50');
      if (actionFilter) params.append('action', actionFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const { data } = await axios.get(`/api/admin/audit-logs?${params}`);
      return data;
    },
  });

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (actionFilter) params.append('action', actionFilter);
      if (targetTypeFilter) params.append('targetType', targetTypeFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await axios.get(`/api/admin/audit-logs/export/csv?${params}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit-logs-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: 'สำเร็จ',
        description: 'ดาวน์โหลด CSV สำเร็จ',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถดาวน์โหลด CSV ได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getActionBadgeColor = (action: string) => {
    const colors: Record<string, string> = {
      CREATE_USER: 'green',
      UPDATE_USER: 'blue',
      DELETE_USER: 'red',
      SUSPEND_USER: 'orange',
      ACTIVATE_USER: 'green',
      CHANGE_ROLE: 'purple',
      UPLOAD_GEOJSON: 'cyan',
      EDIT_POLYGON: 'teal',
      DELETE_GEOJSON: 'red',
      UPDATE_SETTINGS: 'yellow',
      RESET_SETTINGS: 'orange',
    };
    return colors[action] || 'gray';
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_USER: 'สร้างผู้ใช้',
      UPDATE_USER: 'แก้ไขผู้ใช้',
      DELETE_USER: 'ลบผู้ใช้',
      SUSPEND_USER: 'ระงับผู้ใช้',
      ACTIVATE_USER: 'เปิดใช้งานผู้ใช้',
      CHANGE_ROLE: 'เปลี่ยนบทบาท',
      UPLOAD_GEOJSON: 'อัพโหลด GeoJSON',
      EDIT_POLYGON: 'แก้ไข Polygon',
      DELETE_GEOJSON: 'ลบ GeoJSON',
      UPDATE_SETTINGS: 'อัพเดทการตั้งค่า',
      RESET_SETTINGS: 'รีเซ็ตการตั้งค่า',
    };
    return labels[action] || action;
  };

  return (
    <Box>
      {/* Filters */}
      <Flex gap={4} mb={4} flexWrap="wrap" align="end">
        <Box flex={1} minW="150px">
          <Text fontSize="sm" mb={1} fontWeight="medium">
            การกระทำ
          </Text>
          <Select
            placeholder="ทุกการกระทำ"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            size="sm"
          >
            <option value="CREATE_USER">สร้างผู้ใช้</option>
            <option value="UPDATE_USER">แก้ไขผู้ใช้</option>
            <option value="DELETE_USER">ลบผู้ใช้</option>
            <option value="SUSPEND_USER">ระงับผู้ใช้</option>
            <option value="ACTIVATE_USER">เปิดใช้งานผู้ใช้</option>
            <option value="CHANGE_ROLE">เปลี่ยนบทบาท</option>
            <option value="UPLOAD_GEOJSON">อัพโหลด GeoJSON</option>
            <option value="EDIT_POLYGON">แก้ไข Polygon</option>
            <option value="DELETE_GEOJSON">ลบ GeoJSON</option>
            <option value="UPDATE_SETTINGS">อัพเดทการตั้งค่า</option>
          </Select>
        </Box>

        <Box flex={1} minW="150px">
          <Text fontSize="sm" mb={1} fontWeight="medium">
            ประเภทเป้าหมาย
          </Text>
          <Select
            placeholder="ทุกประเภท"
            value={targetTypeFilter}
            onChange={(e) => setTargetTypeFilter(e.target.value)}
            size="sm"
          >
            <option value="USER">ผู้ใช้</option>
            <option value="GEOJSON">GeoJSON</option>
            <option value="SETTINGS">การตั้งค่า</option>
          </Select>
        </Box>

        <Box minW="150px">
          <Text fontSize="sm" mb={1} fontWeight="medium">
            วันที่เริ่มต้น
          </Text>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            size="sm"
          />
        </Box>

        <Box minW="150px">
          <Text fontSize="sm" mb={1} fontWeight="medium">
            วันที่สิ้นสุด
          </Text>
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            size="sm"
          />
        </Box>

        <Button
          leftIcon={<FiDownload />}
          colorScheme="green"
          size="sm"
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </Flex>

      {/* Table */}
      <Box overflowX="auto" borderWidth="1px" borderRadius="lg">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>เวลา</Th>
              <Th>ผู้ใช้</Th>
              <Th>การกระทำ</Th>
              <Th>เป้าหมาย</Th>
              <Th>IP Address</Th>
              <Th>รายละเอียด</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={6} textAlign="center">
                  กำลังโหลด...
                </Td>
              </Tr>
            ) : data?.data?.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center">
                  ไม่พบข้อมูล
                </Td>
              </Tr>
            ) : (
              data?.data?.map((log: AuditLog) => (
                <Tr key={log.id}>
                  <Td>
                    <Text fontSize="xs">
                      {new Date(log.createdAt).toLocaleString('th-TH')}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium">
                      {log.username}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {log.userId.substring(0, 8)}...
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={getActionBadgeColor(log.action)} fontSize="xs">
                      {getActionLabel(log.action)}
                    </Badge>
                  </Td>
                  <Td>
                    {log.targetType && (
                      <>
                        <Text fontSize="sm">{log.targetType}</Text>
                        {log.targetId && (
                          <Code fontSize="xs">{log.targetId.substring(0, 8)}...</Code>
                        )}
                      </>
                    )}
                  </Td>
                  <Td>
                    <Text fontSize="xs" fontFamily="mono">
                      {log.ipAddress || '-'}
                    </Text>
                  </Td>
                  <Td>
                    {log.details && (
                      <Tooltip
                        label={JSON.stringify(log.details, null, 2)}
                        placement="left"
                      >
                        <IconButton
                          icon={<FiEye />}
                          size="xs"
                          variant="ghost"
                          aria-label="View details"
                        />
                      </Tooltip>
                    )}
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <Flex justify="space-between" align="center" mt={4}>
          <Text fontSize="sm" color="gray.600">
            หน้า {data.page} จาก {data.totalPages} (ทั้งหมด {data.total} รายการ)
          </Text>
          <HStack>
            <Button
              size="sm"
              onClick={() => setPage(page - 1)}
              isDisabled={page === 1}
            >
              ก่อนหน้า
            </Button>
            <Button
              size="sm"
              onClick={() => setPage(page + 1)}
              isDisabled={page === data.totalPages}
            >
              ถัดไป
            </Button>
          </HStack>
        </Flex>
      )}
    </Box>
  );
};

export default AuditLogTable;
