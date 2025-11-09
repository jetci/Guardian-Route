import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  HStack,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  Icon,
  Spinner,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '../../components/Layout';
import { RoleBadge } from '../../components/RoleBadge';
import {
  getAllRoleMetadata,
  getRoleStatistics,
  createRoleMetadata,
  updateRoleMetadata,
  deleteRoleMetadata,
  Role,
  RoleMetadata,
  CreateRoleMetadataDto,
  UpdateRoleMetadataDto,
} from '../../api/roleManagement';
import { handleApiError } from '../../utils/errorHandler';

/**
 * Role Management Page - Subtask 1: Roles CRUD Integration
 */
export const RoleManagementPageV2: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  // Modals
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();

  // State
  const [selectedRole, setSelectedRole] = useState<RoleMetadata | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    role: '' as Role,
    displayName: '',
    description: '',
  });

  // ========================================
  // QUERIES
  // ========================================

  // Fetch all roles
  const { data: roles, isLoading: isLoadingRoles, error: rolesError } = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoleMetadata,
  });

  // Fetch role statistics
  const { data: stats } = useQuery({
    queryKey: ['roleStats'],
    queryFn: getRoleStatistics,
  });

  // ========================================
  // MUTATIONS
  // ========================================

  // Create role
  const createMutation = useMutation({
    mutationFn: (data: CreateRoleMetadataDto) => createRoleMetadata(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roleStats'] });
      toast({
        title: 'สร้างบทบาทสำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCreateModalClose();
      resetForm();
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  // Update role
  const updateMutation = useMutation({
    mutationFn: ({ role, data }: { role: Role; data: UpdateRoleMetadataDto }) =>
      updateRoleMetadata(role, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'อัพเดทบทบาทสำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditModalClose();
      setSelectedRole(null);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  // Delete role
  const deleteMutation = useMutation({
    mutationFn: (role: Role) => deleteRoleMetadata(role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roleStats'] });
      toast({
        title: 'ลบบทบาทสำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteAlertClose();
      setRoleToDelete(null);
    },
    onError: (error) => {
      handleApiError(error);
    },
  });

  // ========================================
  // HANDLERS
  // ========================================

  const handleCreate = () => {
    if (!formData.role || !formData.displayName || !formData.description) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    createMutation.mutate({
      role: formData.role,
      displayName: formData.displayName,
      description: formData.description,
    });
  };

  const handleEdit = (role: RoleMetadata) => {
    setSelectedRole(role);
    setFormData({
      role: role.role,
      displayName: role.displayName,
      description: role.description,
    });
    onEditModalOpen();
  };

  const handleUpdate = () => {
    if (!selectedRole || !formData.displayName || !formData.description) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    updateMutation.mutate({
      role: selectedRole.role,
      data: {
        displayName: formData.displayName,
        description: formData.description,
      },
    });
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
    onDeleteAlertOpen();
  };

  const handleDeleteConfirm = () => {
    if (roleToDelete) {
      deleteMutation.mutate(roleToDelete);
    }
  };

  const resetForm = () => {
    setFormData({
      role: '' as Role,
      displayName: '',
      description: '',
    });
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <Layout>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <Heading size="lg">จัดการบทบาทและสิทธิ์</Heading>
          </HStack>

          {/* Tabs */}
          <Tabs colorScheme="blue">
            <TabList>
              <Tab>บทบาท (Roles)</Tab>
              <Tab isDisabled>สิทธิ์ (Permissions)</Tab>
              <Tab isDisabled>กำหนดสิทธิ์ตามบทบาท</Tab>
            </TabList>

            <TabPanels>
              {/* Roles Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {/* Header with Create Button */}
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="semibold">
                      บทบาททั้งหมด ({roles?.length || 0})
                    </Text>
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="blue"
                      onClick={onCreateModalOpen}
                    >
                      สร้างบทบาท
                    </Button>
                  </HStack>

                  {/* Loading State */}
                  {isLoadingRoles && (
                    <Box textAlign="center" py={8}>
                      <Spinner size="xl" color="blue.500" />
                      <Text mt={4} color="gray.600">
                        กำลังโหลดข้อมูล...
                      </Text>
                    </Box>
                  )}

                  {/* Error State */}
                  {rolesError && (
                    <Alert status="error">
                      <AlertIcon />
                      เกิดข้อผิดพลาดในการโหลดข้อมูล
                    </Alert>
                  )}

                  {/* Roles Table */}
                  {!isLoadingRoles && !rolesError && roles && (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>บทบาท</Th>
                          <Th>คำอธิบาย</Th>
                          <Th isNumeric>จำนวนผู้ใช้</Th>
                          <Th isNumeric>จำนวนสิทธิ์</Th>
                          <Th>การจัดการ</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {roles.map((role) => {
                          const roleStat = stats?.roleStats.find((s: any) => s.role === role.role);
                          return (
                            <Tr key={role.role}>
                              <Td>
                                <RoleBadge role={role.role} size="md" />
                              </Td>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="semibold">{role.displayName}</Text>
                                  <Text fontSize="sm" color="gray.600">
                                    {role.description}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td isNumeric>
                                <Badge colorScheme="blue">{roleStat?.userCount || 0}</Badge>
                              </Td>
                              <Td isNumeric>
                                <Badge colorScheme="green">{role.permissionCount}</Badge>
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
                                      icon={<FiEdit2 />}
                                      onClick={() => handleEdit(role)}
                                    >
                                      แก้ไข
                                    </MenuItem>
                                    <MenuItem
                                      icon={<FiTrash2 />}
                                      color="red.500"
                                      onClick={() => handleDeleteClick(role.role)}
                                    >
                                      ลบ
                                    </MenuItem>
                                  </MenuList>
                                </Menu>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  )}

                  {/* Empty State */}
                  {!isLoadingRoles && !rolesError && roles?.length === 0 && (
                    <Box textAlign="center" py={8}>
                      <Text color="gray.600">ไม่มีข้อมูลบทบาท</Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* Permissions Tab - Disabled */}
              <TabPanel>
                <Alert status="info">
                  <AlertIcon />
                  ฟีเจอร์นี้จะพร้อมใช้งานใน Subtask 2
                </Alert>
              </TabPanel>

              {/* Role-Permission Assignment Tab - Disabled */}
              <TabPanel>
                <Alert status="info">
                  <AlertIcon />
                  ฟีเจอร์นี้จะพร้อมใช้งานใน Subtask 3
                </Alert>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Create Role Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>สร้างบทบาทใหม่</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>บทบาท</FormLabel>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <option value="">เลือกบทบาท</option>
                  <option value={Role.ADMIN}>ADMIN</option>
                  <option value={Role.EXECUTIVE}>EXECUTIVE</option>
                  <option value={Role.SUPERVISOR}>SUPERVISOR</option>
                  <option value={Role.FIELD_OFFICER}>FIELD_OFFICER</option>
                </select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>ชื่อแสดง</FormLabel>
                <Input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="เช่น ผู้ดูแลระบบ"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>คำอธิบาย</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="อธิบายบทบาทและความรับผิดชอบ"
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreateModalClose}>
              ยกเลิก
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleCreate}
              isLoading={createMutation.isPending}
            >
              สร้าง
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Role Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>แก้ไขบทบาท</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isDisabled>
                <FormLabel>บทบาท</FormLabel>
                <Input value={selectedRole?.role || ''} isReadOnly />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>ชื่อแสดง</FormLabel>
                <Input
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>คำอธิบาย</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditModalClose}>
              ยกเลิก
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              isLoading={updateMutation.isPending}
            >
              บันทึก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ลบบทบาท
            </AlertDialogHeader>

            <AlertDialogBody>
              คุณแน่ใจหรือไม่ที่จะลบบทบาท <strong>{roleToDelete}</strong>?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteAlertClose}>
                ยกเลิก
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeleteConfirm}
                ml={3}
                isLoading={deleteMutation.isPending}
              >
                ลบ
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Layout>
  );
};
