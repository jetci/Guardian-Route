import React, { useState } from 'react';
import {
  Box,
  Button,
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
  useDisclosure,
  HStack,
  Input,
  Select,
  useToast,
  Flex,
  Text,
} from '@chakra-ui/react';
import {
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiUserX,
  FiUserCheck,
  FiShield,
  FiPlus,
  FiSearch,
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const createModal = useDisclosure();
  const editModal = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', page, search, roleFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '20');
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('isActive', statusFilter);

      const { data } = await axios.get(`/api/admin/users?${params}`);
      return data;
    },
  });

  // Toggle user status
  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) =>
      axios.patch(`/api/admin/users/${userId}/toggle-status`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'สำเร็จ',
        description: 'เปลี่ยนสถานะผู้ใช้สำเร็จ',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถเปลี่ยนสถานะผู้ใช้ได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => axios.delete(`/api/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'สำเร็จ',
        description: 'ลบผู้ใช้สำเร็จ',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถลบผู้ใช้ได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    editModal.onOpen();
  };

  const handleToggleStatus = (userId: string) => {
    if (confirm('คุณต้องการเปลี่ยนสถานะผู้ใช้นี้หรือไม่?')) {
      toggleStatusMutation.mutate(userId);
    }
  };

  const handleDelete = (userId: string) => {
    if (confirm('คุณต้องการลบผู้ใช้นี้หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'red',
      EXECUTIVE: 'purple',
      SUPERVISOR: 'blue',
      FIELD_OFFICER: 'green',
    };
    return colors[role] || 'gray';
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'ผู้ดูแลระบบ',
      EXECUTIVE: 'ผู้บริหาร',
      SUPERVISOR: 'หัวหน้างาน',
      FIELD_OFFICER: 'เจ้าหน้าที่ภาคสนาม',
    };
    return labels[role] || role;
  };

  return (
    <Box>
      {/* Filters and Actions */}
      <Flex gap={4} mb={4} flexWrap="wrap">
        <HStack flex={1} minW="200px">
          <FiSearch />
          <Input
            placeholder="ค้นหา (ชื่อ, อีเมล, username)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </HStack>
        <Select
          placeholder="ทุกบทบาท"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          maxW="200px"
        >
          <option value="ADMIN">ผู้ดูแลระบบ</option>
          <option value="EXECUTIVE">ผู้บริหาร</option>
          <option value="SUPERVISOR">หัวหน้างาน</option>
          <option value="FIELD_OFFICER">เจ้าหน้าที่ภาคสนาม</option>
        </Select>
        <Select
          placeholder="ทุกสถานะ"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW="150px"
        >
          <option value="true">ใช้งาน</option>
          <option value="false">ระงับ</option>
        </Select>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={createModal.onOpen}
        >
          เพิ่มผู้ใช้
        </Button>
      </Flex>

      {/* Users Table */}
      <Box overflowX="auto" borderWidth="1px" borderRadius="lg">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ชื่อผู้ใช้</Th>
              <Th>ชื่อ-นามสกุล</Th>
              <Th>อีเมล</Th>
              <Th>บทบาท</Th>
              <Th>แผนก</Th>
              <Th>สถานะ</Th>
              <Th>การกระทำ</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  กำลังโหลด...
                </Td>
              </Tr>
            ) : data?.data?.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  ไม่พบข้อมูล
                </Td>
              </Tr>
            ) : (
              data?.data?.map((user: User) => (
                <Tr key={user.id}>
                  <Td fontWeight="medium">{user.username}</Td>
                  <Td>{user.fullName}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge colorScheme={getRoleBadgeColor(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </Td>
                  <Td>{user.department || '-'}</Td>
                  <Td>
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'ใช้งาน' : 'ระงับ'}
                    </Badge>
                  </Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        icon={<FiMoreVertical />}
                        variant="ghost"
                        size="sm"
                      />
                      <MenuList>
                        <MenuItem
                          icon={<FiEdit />}
                          onClick={() => handleEdit(user)}
                        >
                          แก้ไข
                        </MenuItem>
                        <MenuItem
                          icon={<FiShield />}
                          onClick={() => {
                            /* TODO: Change role modal */
                          }}
                        >
                          เปลี่ยนบทบาท
                        </MenuItem>
                        <MenuItem
                          icon={user.isActive ? <FiUserX /> : <FiUserCheck />}
                          onClick={() => handleToggleStatus(user.id)}
                        >
                          {user.isActive ? 'ระงับผู้ใช้' : 'เปิดใช้งาน'}
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => handleDelete(user.id)}
                        >
                          ลบผู้ใช้
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

      {/* Modals */}
      <CreateUserModal isOpen={createModal.isOpen} onClose={createModal.onClose} />
      {selectedUser && (
        <EditUserModal
          isOpen={editModal.isOpen}
          onClose={editModal.onClose}
          user={selectedUser}
        />
      )}
    </Box>
  );
};

export default UserManagement;
