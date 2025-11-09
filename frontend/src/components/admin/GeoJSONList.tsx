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
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  HStack,
  Select,
  useToast,
  Flex,
  Text,
  Button,
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiMap,
  FiDownload,
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface GeoBoundary {
  id: string;
  name: string;
  type: string;
  geojson: any;
  villageId?: string;
  uploadedBy: string;
  createdAt: string;
}

const GeoJSONList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch GeoJSON boundaries
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'geojson', page, typeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '20');
      if (typeFilter) params.append('type', typeFilter);

      const { data } = await axios.get(`/api/admin/geojson?${params}`);
      return data;
    },
  });

  // Delete GeoJSON
  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/admin/geojson/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'geojson'] });
      toast({
        title: 'สำเร็จ',
        description: 'ลบ GeoJSON สำเร็จ',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถลบ GeoJSON ได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('คุณต้องการลบ GeoJSON นี้หรือไม่?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDownload = (boundary: GeoBoundary) => {
    const dataStr = JSON.stringify(boundary.geojson, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `${boundary.name}.geojson`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      village: 'green',
      district: 'blue',
      province: 'purple',
      custom: 'orange',
    };
    return colors[type] || 'gray';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      village: 'หมู่บ้าน',
      district: 'ตำบล',
      province: 'จังหวัด',
      custom: 'กำหนดเอง',
    };
    return labels[type] || type;
  };

  return (
    <Box>
      {/* Filters */}
      <Flex gap={4} mb={4} flexWrap="wrap">
        <Select
          placeholder="ทุกประเภท"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          maxW="200px"
        >
          <option value="village">หมู่บ้าน</option>
          <option value="district">ตำบล</option>
          <option value="province">จังหวัด</option>
          <option value="custom">กำหนดเอง</option>
        </Select>
      </Flex>

      {/* Table */}
      <Box overflowX="auto" borderWidth="1px" borderRadius="lg">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ชื่อ</Th>
              <Th>ประเภท</Th>
              <Th>Village ID</Th>
              <Th>วันที่อัพโหลด</Th>
              <Th>การกระทำ</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  กำลังโหลด...
                </Td>
              </Tr>
            ) : data?.data?.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  ไม่พบข้อมูล
                </Td>
              </Tr>
            ) : (
              data?.data?.map((boundary: GeoBoundary) => (
                <Tr key={boundary.id}>
                  <Td fontWeight="medium">{boundary.name}</Td>
                  <Td>
                    <Badge colorScheme={getTypeBadgeColor(boundary.type)}>
                      {getTypeLabel(boundary.type)}
                    </Badge>
                  </Td>
                  <Td>
                    {boundary.villageId ? (
                      <Text fontSize="sm" fontFamily="mono">
                        {boundary.villageId.substring(0, 8)}...
                      </Text>
                    ) : (
                      '-'
                    )}
                  </Td>
                  <Td>{new Date(boundary.createdAt).toLocaleDateString('th-TH')}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem icon={<FiMap />}>แสดงบนแผนที่</MenuItem>
                        <MenuItem
                          icon={<FiDownload />}
                          onClick={() => handleDownload(boundary)}
                        >
                          ดาวน์โหลด
                        </MenuItem>
                        <MenuItem icon={<FiEdit />}>แก้ไข</MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => handleDelete(boundary.id)}
                        >
                          ลบ
                        </MenuItem>
                      </MenuList>
                    </Menu>
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

export default GeoJSONList;
