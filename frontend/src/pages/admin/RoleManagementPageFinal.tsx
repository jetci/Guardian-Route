import React, { useState, useEffect } from 'react';
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
  Select,
  Checkbox,
  Stack,
  Divider,
  Card,
  CardHeader,
  CardBody,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiMoreVertical, FiSave, FiRefreshCw } from 'react-icons/fi';
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
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  getAllPermissions,
  getPermissionsByCategory,
  getPermissionCategories,
  createPermission,
  updatePermission,
  deletePermission,
  getRolePermissions,
  assignPermissions,
  removePermissions,
  AssignPermissionsDto,
} from '../../api/roleManagement';
import { handleApiError } from '../../utils/errorHandlerChakra';

/**
 * Role Management Page - Complete Integration (Subtask 1 + 2 + 3)
 */
export const RoleManagementPageFinal: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const cancelPermRef = React.useRef<HTMLButtonElement>(null);

  // Modals - Roles
  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteAlertOpen, onOpen: onDeleteAlertOpen, onClose: onDeleteAlertClose } = useDisclosure();

  // Modals - Permissions
  const { isOpen: isCreatePermModalOpen, onOpen: onCreatePermModalOpen, onClose: onCreatePermModalClose } = useDisclosure();
  const { isOpen: isEditPermModalOpen, onOpen: onEditPermModalOpen, onClose: onEditPermModalClose } = useDisclosure();
  const { isOpen: isDeletePermAlertOpen, onOpen: onDeletePermAlertOpen, onClose: onDeletePermAlertClose } = useDisclosure();

  // State - Roles
  const [selectedRole, setSelectedRole] = useState<RoleMetadata | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    role: '' as Role,
    displayName: '',
    description: '',
  });

  // State - Permissions
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null);
  const [permFormData, setPermFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    category: '',
  });
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // State - Role-Permission Assignment
  const [selectedRoleForAssignment, setSelectedRoleForAssignment] = useState<Role>(Role.FIELD_OFFICER);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(new Set());
  const [hasChanges, setHasChanges] = useState(false);

  // ========================================
  // QUERIES - ROLES
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
  // QUERIES - PERMISSIONS
  // ========================================

  // Fetch all permissions
  const { data: permissions, isLoading: isLoadingPermissions, error: permissionsError } = useQuery({
    queryKey: ['permissions'],
    queryFn: getAllPermissions,
  });

  // Fetch permissions by category
  const { data: permissionsByCategory } = useQuery({
    queryKey: ['permissionsByCategory'],
    queryFn: getPermissionsByCategory,
  });

  // Fetch permission categories
  const { data: categories } = useQuery({
    queryKey: ['permissionCategories'],
    queryFn: getPermissionCategories,
  });

  // ========================================
  // QUERIES - ROLE-PERMISSION ASSIGNMENT
  // ========================================

  // Fetch role permissions
  const { data: rolePermissions, isLoading: isLoadingRolePermissions } = useQuery({
    queryKey: ['rolePermissions', selectedRoleForAssignment],
    queryFn: () => getRolePermissions(selectedRoleForAssignment),
    enabled: !!selectedRoleForAssignment,
  });

  // Update selected permissions when role permissions change
  useEffect(() => {
    if (rolePermissions) {
      const permIds = new Set(rolePermissions.map((p: Permission) => p.id));
      setSelectedPermissionIds(permIds);
      setHasChanges(false);
    }
  }, [rolePermissions]);

  // ========================================
  // MUTATIONS - ROLES
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
      handleApiError(error, toast);
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
      handleApiError(error, toast);
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
      handleApiError(error, toast);
    },
  });

  // ========================================
  // MUTATIONS - PERMISSIONS
  // ========================================

  // Create permission
  const createPermMutation = useMutation({
    mutationFn: (data: CreatePermissionDto) => createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissionsByCategory'] });
      queryClient.invalidateQueries({ queryKey: ['permissionCategories'] });
      toast({
        title: 'สร้างสิทธิ์สำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onCreatePermModalClose();
      resetPermForm();
    },
    onError: (error) => {
      handleApiError(error, toast);
    },
  });

  // Update permission
  const updatePermMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePermissionDto }) =>
      updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissionsByCategory'] });
      toast({
        title: 'อัพเดทสิทธิ์สำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onEditPermModalClose();
      setSelectedPermission(null);
    },
    onError: (error) => {
      handleApiError(error, toast);
    },
  });

  // Delete permission
  const deletePermMutation = useMutation({
    mutationFn: (id: string) => deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['permissionsByCategory'] });
      queryClient.invalidateQueries({ queryKey: ['permissionCategories'] });
      toast({
        title: 'ลบสิทธิ์สำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeletePermAlertClose();
      setPermissionToDelete(null);
    },
    onError: (error) => {
      handleApiError(error, toast);
    },
  });

  // ========================================
  // MUTATIONS - ROLE-PERMISSION ASSIGNMENT
  // ========================================

  // Assign permissions mutation
  const assignPermissionsMutation = useMutation({
    mutationFn: ({ role, data }: { role: Role; data: AssignPermissionsDto }) =>
      assignPermissions(role, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', selectedRoleForAssignment] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'บันทึกสิทธิ์สำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setHasChanges(false);
    },
    onError: (error) => {
      handleApiError(error, toast);
    },
  });

  // Remove permissions mutation
  const removePermissionsMutation = useMutation({
    mutationFn: ({ role, data }: { role: Role; data: AssignPermissionsDto }) =>
      removePermissions(role, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rolePermissions', selectedRoleForAssignment] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast({
        title: 'ลบสิทธิ์สำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setHasChanges(false);
    },
    onError: (error) => {
      handleApiError(error, toast);
    },
  });

  // ========================================
  // HANDLERS - ROLES
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
  // HANDLERS - PERMISSIONS
  // ========================================

  const handleCreatePermission = () => {
    if (!permFormData.name || !permFormData.displayName || !permFormData.description || !permFormData.category) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    createPermMutation.mutate(permFormData);
  };

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission);
    setPermFormData({
      name: permission.name,
      displayName: permission.displayName,
      description: permission.description,
      category: permission.category,
    });
    onEditPermModalOpen();
  };

  const handleUpdatePermission = () => {
    if (!selectedPermission || !permFormData.name || !permFormData.displayName || !permFormData.description || !permFormData.category) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    updatePermMutation.mutate({
      id: selectedPermission.id,
      data: permFormData,
    });
  };

  const handleDeletePermissionClick = (id: string) => {
    setPermissionToDelete(id);
    onDeletePermAlertOpen();
  };

  const handleDeletePermissionConfirm = () => {
    if (permissionToDelete) {
      deletePermMutation.mutate(permissionToDelete);
    }
  };

  const resetPermForm = () => {
    setPermFormData({
      name: '',
      displayName: '',
      description: '',
      category: '',
    });
  };

  // ========================================
  // HANDLERS - ROLE-PERMISSION ASSIGNMENT
  // ========================================

  const handleRoleChange = (role: Role) => {
    if (hasChanges) {
      const confirm = window.confirm('คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการเปลี่ยนบทบาทหรือไม่?');
      if (!confirm) return;
    }
    setSelectedRoleForAssignment(role);
    setHasChanges(false);
  };

  const handlePermissionToggle = (permissionId: string) => {
    const newSelected = new Set(selectedPermissionIds);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissionIds(newSelected);
    setHasChanges(true);
  };

  const handleSavePermissions = () => {
    const currentPermissionIds = new Set(rolePermissions?.map((p: Permission) => p.id) || []);
    const toAdd = Array.from(selectedPermissionIds).filter(id => !currentPermissionIds.has(id));
    const toRemove = Array.from(currentPermissionIds).filter(id => !selectedPermissionIds.has(id));

    if (toAdd.length > 0) {
      assignPermissionsMutation.mutate({
        role: selectedRoleForAssignment,
        data: { permissionIds: toAdd },
      });
    }

    if (toRemove.length > 0) {
      removePermissionsMutation.mutate({
        role: selectedRoleForAssignment,
        data: { permissionIds: toRemove },
      });
    }

    if (toAdd.length === 0 && toRemove.length === 0) {
      toast({
        title: 'ไม่มีการเปลี่ยนแปลง',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleResetPermissions = () => {
    if (rolePermissions) {
      const permIds = new Set(rolePermissions.map((p: Permission) => p.id));
      setSelectedPermissionIds(permIds);
      setHasChanges(false);
    }
  };

  // Filter permissions by category
  const filteredPermissions = permissions?.filter(
    (perm) => categoryFilter === 'all' || perm.category === categoryFilter
  ) || [];

  // Group permissions by category for assignment tab
  const permissionsByCategoryForAssignment = permissionsByCategory || {};

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
              <Tab>สิทธิ์ (Permissions)</Tab>
              <Tab>กำหนดสิทธิ์ตามบทบาท</Tab>
            </TabList>

            <TabPanels>
              {/* ========================================
                  ROLES TAB
                  ======================================== */}
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

              {/* ========================================
                  PERMISSIONS TAB
                  ======================================== */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  {/* Header with Create Button and Filter */}
                  <HStack justify="space-between">
                    <HStack spacing={4}>
                      <Text fontSize="lg" fontWeight="semibold">
                        สิทธิ์ทั้งหมด ({filteredPermissions.length})
                      </Text>
                      <Select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        width="200px"
                        size="sm"
                      >
                        <option value="all">ทุกหมวดหมู่</option>
                        {categories?.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </Select>
                    </HStack>
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="green"
                      onClick={onCreatePermModalOpen}
                    >
                      สร้างสิทธิ์
                    </Button>
                  </HStack>

                  {/* Loading State */}
                  {isLoadingPermissions && (
                    <Box textAlign="center" py={8}>
                      <Spinner size="xl" color="green.500" />
                      <Text mt={4} color="gray.600">
                        กำลังโหลดข้อมูล...
                      </Text>
                    </Box>
                  )}

                  {/* Error State */}
                  {permissionsError && (
                    <Alert status="error">
                      <AlertIcon />
                      เกิดข้อผิดพลาดในการโหลดข้อมูล
                    </Alert>
                  )}

                  {/* Permissions Table */}
                  {!isLoadingPermissions && !permissionsError && filteredPermissions.length > 0 && (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>ชื่อสิทธิ์</Th>
                          <Th>คำอธิบาย</Th>
                          <Th>หมวดหมู่</Th>
                          <Th isNumeric>จำนวนบทบาท</Th>
                          <Th>การจัดการ</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredPermissions.map((permission) => (
                          <Tr key={permission.id}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text fontWeight="semibold">{permission.displayName}</Text>
                                <Text fontSize="xs" color="gray.500">
                                  {permission.name}
                                </Text>
                              </VStack>
                            </Td>
                            <Td>
                              <Text fontSize="sm" color="gray.600">
                                {permission.description}
                              </Text>
                            </Td>
                            <Td>
                              <Badge colorScheme="purple">{permission.category}</Badge>
                            </Td>
                            <Td isNumeric>
                              <Badge colorScheme="blue">{permission.roleCount}</Badge>
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
                                    onClick={() => handleEditPermission(permission)}
                                  >
                                    แก้ไข
                                  </MenuItem>
                                  <MenuItem
                                    icon={<FiTrash2 />}
                                    color="red.500"
                                    onClick={() => handleDeletePermissionClick(permission.id)}
                                  >
                                    ลบ
                                  </MenuItem>
                                </MenuList>
                              </Menu>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}

                  {/* Empty State */}
                  {!isLoadingPermissions && !permissionsError && filteredPermissions.length === 0 && (
                    <Box textAlign="center" py={8}>
                      <Text color="gray.600">ไม่มีข้อมูลสิทธิ์</Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              {/* ========================================
                  ROLE-PERMISSION ASSIGNMENT TAB
                  ======================================== */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Header with Role Selector */}
                  <Card>
                    <CardHeader>
                      <HStack justify="space-between">
                        <VStack align="start" spacing={2}>
                          <Text fontSize="lg" fontWeight="semibold">
                            กำหนดสิทธิ์สำหรับบทบาท
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            เลือกบทบาทและกำหนดสิทธิ์ที่ต้องการให้กับบทบาทนั้น
                          </Text>
                        </VStack>
                        <HStack spacing={3}>
                          <Select
                            value={selectedRoleForAssignment}
                            onChange={(e) => handleRoleChange(e.target.value as Role)}
                            width="250px"
                          >
                            <option value={Role.FIELD_OFFICER}>FIELD_OFFICER</option>
                            <option value={Role.SUPERVISOR}>SUPERVISOR</option>
                            <option value={Role.EXECUTIVE}>EXECUTIVE</option>
                            <option value={Role.ADMIN}>ADMIN</option>
                          </Select>
                          <RoleBadge role={selectedRoleForAssignment} size="md" />
                        </HStack>
                      </HStack>
                    </CardHeader>
                  </Card>

                  {/* Action Buttons */}
                  {hasChanges && (
                    <Alert status="warning">
                      <AlertIcon />
                      <HStack justify="space-between" flex={1}>
                        <Text>คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก</Text>
                        <HStack>
                          <Button
                            size="sm"
                            leftIcon={<FiRefreshCw />}
                            onClick={handleResetPermissions}
                          >
                            ยกเลิก
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            leftIcon={<FiSave />}
                            onClick={handleSavePermissions}
                            isLoading={assignPermissionsMutation.isPending || removePermissionsMutation.isPending}
                          >
                            บันทึก
                          </Button>
                        </HStack>
                      </HStack>
                    </Alert>
                  )}

                  {/* Loading State */}
                  {isLoadingRolePermissions && (
                    <Box textAlign="center" py={8}>
                      <Spinner size="xl" color="blue.500" />
                      <Text mt={4} color="gray.600">
                        กำลังโหลดสิทธิ์...
                      </Text>
                    </Box>
                  )}

                  {/* Permissions by Category */}
                  {!isLoadingRolePermissions && (
                    <Accordion allowMultiple defaultIndex={[0]}>
                      {Object.entries(permissionsByCategoryForAssignment).map(([category, perms]) => {
                        const categoryPerms = perms as Permission[];
                        const selectedCount = categoryPerms.filter(p => selectedPermissionIds.has(p.id)).length;
                        
                        return (
                          <AccordionItem key={category}>
                            <AccordionButton>
                              <Box flex="1" textAlign="left">
                                <HStack>
                                  <Text fontWeight="semibold">{category}</Text>
                                  <Badge colorScheme="purple">
                                    {selectedCount}/{categoryPerms.length}
                                  </Badge>
                                </HStack>
                              </Box>
                              <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                              <Stack spacing={3}>
                                {categoryPerms.map((permission) => (
                                  <Checkbox
                                    key={permission.id}
                                    isChecked={selectedPermissionIds.has(permission.id)}
                                    onChange={() => handlePermissionToggle(permission.id)}
                                  >
                                    <VStack align="start" spacing={0}>
                                      <Text fontWeight="medium">{permission.displayName}</Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {permission.description}
                                      </Text>
                                      <Text fontSize="xs" color="gray.400">
                                        {permission.name}
                                      </Text>
                                    </VStack>
                                  </Checkbox>
                                ))}
                              </Stack>
                            </AccordionPanel>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  )}

                  {/* Save Button at Bottom */}
                  {!isLoadingRolePermissions && (
                    <HStack justify="flex-end">
                      <Button
                        leftIcon={<FiRefreshCw />}
                        onClick={handleResetPermissions}
                        isDisabled={!hasChanges}
                      >
                        ยกเลิก
                      </Button>
                      <Button
                        colorScheme="blue"
                        leftIcon={<FiSave />}
                        onClick={handleSavePermissions}
                        isDisabled={!hasChanges}
                        isLoading={assignPermissionsMutation.isPending || removePermissionsMutation.isPending}
                      >
                        บันทึกการเปลี่ยนแปลง
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* ========================================
          ROLE MODALS
          ======================================== */}

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
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                  placeholder="เลือกบทบาท"
                >
                  <option value={Role.ADMIN}>ADMIN</option>
                  <option value={Role.EXECUTIVE}>EXECUTIVE</option>
                  <option value={Role.SUPERVISOR}>SUPERVISOR</option>
                  <option value={Role.FIELD_OFFICER}>FIELD_OFFICER</option>
                </Select>
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

      {/* Delete Role Confirmation Dialog */}
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

      {/* ========================================
          PERMISSION MODALS
          ======================================== */}

      {/* Create Permission Modal */}
      <Modal isOpen={isCreatePermModalOpen} onClose={onCreatePermModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>สร้างสิทธิ์ใหม่</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ชื่อสิทธิ์ (Name)</FormLabel>
                <Input
                  value={permFormData.name}
                  onChange={(e) => setPermFormData({ ...permFormData, name: e.target.value })}
                  placeholder="เช่น users:create"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>ชื่อแสดง</FormLabel>
                <Input
                  value={permFormData.displayName}
                  onChange={(e) => setPermFormData({ ...permFormData, displayName: e.target.value })}
                  placeholder="เช่น สร้างผู้ใช้"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>คำอธิบาย</FormLabel>
                <Textarea
                  value={permFormData.description}
                  onChange={(e) => setPermFormData({ ...permFormData, description: e.target.value })}
                  placeholder="อธิบายสิทธิ์นี้"
                  rows={3}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>หมวดหมู่</FormLabel>
                <Input
                  value={permFormData.category}
                  onChange={(e) => setPermFormData({ ...permFormData, category: e.target.value })}
                  placeholder="เช่น User Management"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCreatePermModalClose}>
              ยกเลิก
            </Button>
            <Button
              colorScheme="green"
              onClick={handleCreatePermission}
              isLoading={createPermMutation.isPending}
            >
              สร้าง
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Permission Modal */}
      <Modal isOpen={isEditPermModalOpen} onClose={onEditPermModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>แก้ไขสิทธิ์</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ชื่อสิทธิ์ (Name)</FormLabel>
                <Input
                  value={permFormData.name}
                  onChange={(e) => setPermFormData({ ...permFormData, name: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>ชื่อแสดง</FormLabel>
                <Input
                  value={permFormData.displayName}
                  onChange={(e) => setPermFormData({ ...permFormData, displayName: e.target.value })}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>คำอธิบาย</FormLabel>
                <Textarea
                  value={permFormData.description}
                  onChange={(e) => setPermFormData({ ...permFormData, description: e.target.value })}
                  rows={3}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>หมวดหมู่</FormLabel>
                <Input
                  value={permFormData.category}
                  onChange={(e) => setPermFormData({ ...permFormData, category: e.target.value })}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditPermModalClose}>
              ยกเลิก
            </Button>
            <Button
              colorScheme="green"
              onClick={handleUpdatePermission}
              isLoading={updatePermMutation.isPending}
            >
              บันทึก
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Permission Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeletePermAlertOpen}
        leastDestructiveRef={cancelPermRef}
        onClose={onDeletePermAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ลบสิทธิ์
            </AlertDialogHeader>

            <AlertDialogBody>
              คุณแน่ใจหรือไม่ที่จะลบสิทธิ์นี้?
              การกระทำนี้ไม่สามารถย้อนกลับได้
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelPermRef} onClick={onDeletePermAlertClose}>
                ยกเลิก
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDeletePermissionConfirm}
                ml={3}
                isLoading={deletePermMutation.isPending}
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
