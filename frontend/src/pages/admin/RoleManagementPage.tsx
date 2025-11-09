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
  Card,
  CardHeader,
  CardBody,
  Divider,
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
  Checkbox,
  Stack,
  Alert,
  AlertIcon,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiShield, FiUsers, FiKey } from 'react-icons/fi';
import { Layout } from '../../components/Layout';
import { RoleBadge } from '../../components/RoleBadge';
import { PermissionIndicator } from '../../components/PermissionIndicator';
import { Role } from '../../components/guards/RoleGuard';
import { Permission } from '../../hooks/useAuth';

/**
 * Role Management Page
 * 
 * UI for managing roles and permissions (UI only, no API integration)
 */
export const RoleManagementPage: React.FC = () => {
  const { isOpen: isRoleModalOpen, onOpen: onRoleModalOpen, onClose: onRoleModalClose } = useDisclosure();
  const { isOpen: isPermModalOpen, onOpen: onPermModalOpen, onClose: onPermModalClose } = useDisclosure();

  // Mock data for roles
  const roles = [
    {
      id: '1',
      name: Role.ADMIN,
      displayName: 'ผู้ดูแลระบบ',
      description: 'มีสิทธิ์เข้าถึงทุกฟังก์ชันในระบบ',
      userCount: 2,
      permissionCount: 25,
    },
    {
      id: '2',
      name: Role.EXECUTIVE,
      displayName: 'ผู้บริหาร',
      description: 'สามารถดูรายงานและวิเคราะห์ข้อมูลระดับองค์กร',
      userCount: 5,
      permissionCount: 21,
    },
    {
      id: '3',
      name: Role.SUPERVISOR,
      displayName: 'หัวหน้างาน',
      description: 'สามารถจัดการทีมและมอบหมายงาน',
      userCount: 15,
      permissionCount: 14,
    },
    {
      id: '4',
      name: Role.FIELD_OFFICER,
      displayName: 'เจ้าหน้าที่ภาคสนาม',
      description: 'สามารถรายงานเหตุการณ์และทำงานที่ได้รับมอบหมาย',
      userCount: 50,
      permissionCount: 7,
    },
  ];

  // Mock data for permissions
  const permissionGroups = [
    {
      name: 'User Management',
      permissions: [
        { id: Permission.CREATE_USER, name: 'สร้างผู้ใช้', description: 'สามารถสร้างผู้ใช้ใหม่' },
        { id: Permission.READ_USER, name: 'ดูข้อมูลผู้ใช้', description: 'สามารถดูข้อมูลผู้ใช้' },
        { id: Permission.UPDATE_USER, name: 'แก้ไขผู้ใช้', description: 'สามารถแก้ไขข้อมูลผู้ใช้' },
        { id: Permission.DELETE_USER, name: 'ลบผู้ใช้', description: 'สามารถลบผู้ใช้' },
        { id: Permission.MANAGE_ROLES, name: 'จัดการบทบาท', description: 'สามารถจัดการบทบาทผู้ใช้' },
      ],
    },
    {
      name: 'Incident Management',
      permissions: [
        { id: Permission.CREATE_INCIDENT, name: 'สร้างเหตุการณ์', description: 'สามารถสร้างเหตุการณ์ใหม่' },
        { id: Permission.READ_INCIDENT, name: 'ดูเหตุการณ์', description: 'สามารถดูเหตุการณ์' },
        { id: Permission.UPDATE_INCIDENT, name: 'แก้ไขเหตุการณ์', description: 'สามารถแก้ไขเหตุการณ์' },
        { id: Permission.DELETE_INCIDENT, name: 'ลบเหตุการณ์', description: 'สามารถลบเหตุการณ์' },
        { id: Permission.ASSIGN_INCIDENT, name: 'มอบหมายเหตุการณ์', description: 'สามารถมอบหมายเหตุการณ์' },
      ],
    },
    {
      name: 'Task Management',
      permissions: [
        { id: Permission.CREATE_TASK, name: 'สร้างงาน', description: 'สามารถสร้างงานใหม่' },
        { id: Permission.READ_TASK, name: 'ดูงาน', description: 'สามารถดูงาน' },
        { id: Permission.UPDATE_TASK, name: 'แก้ไขงาน', description: 'สามารถแก้ไขงาน' },
        { id: Permission.DELETE_TASK, name: 'ลบงาน', description: 'สามารถลบงาน' },
        { id: Permission.ASSIGN_TASK, name: 'มอบหมายงาน', description: 'สามารถมอบหมายงาน' },
      ],
    },
    {
      name: 'Report Management',
      permissions: [
        { id: Permission.CREATE_REPORT, name: 'สร้างรายงาน', description: 'สามารถสร้างรายงานใหม่' },
        { id: Permission.READ_REPORT, name: 'ดูรายงาน', description: 'สามารถดูรายงาน' },
        { id: Permission.UPDATE_REPORT, name: 'แก้ไขรายงาน', description: 'สามารถแก้ไขรายงาน' },
        { id: Permission.DELETE_REPORT, name: 'ลบรายงาน', description: 'สามารถลบรายงาน' },
        { id: Permission.APPROVE_REPORT, name: 'อนุมัติรายงาน', description: 'สามารถอนุมัติรายงาน' },
      ],
    },
    {
      name: 'Analytics',
      permissions: [
        { id: Permission.VIEW_ANALYTICS, name: 'ดูสถิติ', description: 'สามารถดูสถิติของตนเอง' },
        { id: Permission.VIEW_TEAM_ANALYTICS, name: 'ดูสถิติทีม', description: 'สามารถดูสถิติของทีม' },
        { id: Permission.VIEW_ALL_ANALYTICS, name: 'ดูสถิติทั้งหมด', description: 'สามารถดูสถิติทั้งหมด' },
      ],
    },
    {
      name: 'Admin Functions',
      permissions: [
        { id: Permission.MANAGE_SYSTEM_SETTINGS, name: 'จัดการการตั้งค่าระบบ', description: 'สามารถจัดการการตั้งค่าระบบ' },
        { id: Permission.VIEW_AUDIT_LOGS, name: 'ดูบันทึกการตรวจสอบ', description: 'สามารถดูบันทึกการตรวจสอบ' },
        { id: Permission.MANAGE_GEOJSON, name: 'จัดการ GeoJSON', description: 'สามารถจัดการ GeoJSON' },
        { id: Permission.MANAGE_CUSTOM_LAYERS, name: 'จัดการ Custom Layers', description: 'สามารถจัดการ Custom Layers' },
      ],
    },
  ];

  return (
    <Layout>
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box>
            <Heading size="lg" mb={2}>
              จัดการบทบาทและสิทธิ์
            </Heading>
            <Text color="gray.600">
              จัดการบทบาทผู้ใช้และกำหนดสิทธิ์การเข้าถึงระบบ
            </Text>
          </Box>

          <Alert status="info">
            <AlertIcon />
            หน้านี้เป็น UI เท่านั้น ยังไม่ได้เชื่อมต่อกับ API
          </Alert>

          {/* Tabs */}
          <Tabs colorScheme="blue">
            <TabList>
              <Tab>
                <Icon as={FiShield} mr={2} />
                บทบาท
              </Tab>
              <Tab>
                <Icon as={FiKey} mr={2} />
                สิทธิ์
              </Tab>
              <Tab>
                <Icon as={FiUsers} mr={2} />
                กำหนดสิทธิ์ตามบทบาท
              </Tab>
            </TabList>

            <TabPanels>
              {/* Roles Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium">บทบาททั้งหมด ({roles.length})</Text>
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="blue"
                      size="sm"
                      onClick={onRoleModalOpen}
                    >
                      เพิ่มบทบาท
                    </Button>
                  </HStack>

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
                      {roles.map((role) => (
                        <Tr key={role.id}>
                          <Td>
                            <RoleBadge role={role.name} />
                          </Td>
                          <Td>{role.description}</Td>
                          <Td isNumeric>
                            <Badge colorScheme="blue">{role.userCount}</Badge>
                          </Td>
                          <Td isNumeric>
                            <Badge colorScheme="green">{role.permissionCount}</Badge>
                          </Td>
                          <Td>
                            <HStack spacing={2}>
                              <Button size="xs" leftIcon={<FiEdit2 />} colorScheme="blue">
                                แก้ไข
                              </Button>
                              <Button size="xs" leftIcon={<FiTrash2 />} colorScheme="red" isDisabled>
                                ลบ
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </VStack>
              </TabPanel>

              {/* Permissions Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  <HStack justify="space-between">
                    <Text fontWeight="medium">สิทธิ์ทั้งหมด (25)</Text>
                    <Button
                      leftIcon={<FiPlus />}
                      colorScheme="blue"
                      size="sm"
                      onClick={onPermModalOpen}
                    >
                      เพิ่มสิทธิ์
                    </Button>
                  </HStack>

                  {permissionGroups.map((group) => (
                    <Card key={group.name}>
                      <CardHeader>
                        <Heading size="sm">{group.name}</Heading>
                      </CardHeader>
                      <CardBody>
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>สิทธิ์</Th>
                              <Th>คำอธิบาย</Th>
                              <Th>การจัดการ</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {group.permissions.map((perm) => (
                              <Tr key={perm.id}>
                                <Td>
                                  <HStack>
                                    <PermissionIndicator permission={perm.id as Permission} />
                                    <Text fontSize="sm">{perm.name}</Text>
                                  </HStack>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" color="gray.600">
                                    {perm.description}
                                  </Text>
                                </Td>
                                <Td>
                                  <HStack spacing={2}>
                                    <Button size="xs" leftIcon={<FiEdit2 />}>
                                      แก้ไข
                                    </Button>
                                    <Button size="xs" leftIcon={<FiTrash2 />} colorScheme="red" isDisabled>
                                      ลบ
                                    </Button>
                                  </HStack>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </TabPanel>

              {/* Role-Permission Assignment Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="medium">กำหนดสิทธิ์ตามบทบาท</Text>
                  
                  {roles.map((role) => (
                    <Card key={role.id}>
                      <CardHeader>
                        <HStack justify="space-between">
                          <HStack>
                            <RoleBadge role={role.name} />
                            <Text fontSize="sm" color="gray.600">
                              ({role.permissionCount} สิทธิ์)
                            </Text>
                          </HStack>
                          <Button size="sm" colorScheme="blue">
                            บันทึก
                          </Button>
                        </HStack>
                      </CardHeader>
                      <CardBody>
                        <Stack spacing={3}>
                          {permissionGroups.map((group) => (
                            <Box key={group.name}>
                              <Text fontWeight="medium" fontSize="sm" mb={2}>
                                {group.name}
                              </Text>
                              <Stack spacing={2} pl={4}>
                                {group.permissions.map((perm) => (
                                  <Checkbox key={perm.id} defaultChecked={role.name === Role.ADMIN}>
                                    <Text fontSize="sm">{perm.name}</Text>
                                  </Checkbox>
                                ))}
                              </Stack>
                              <Divider mt={2} />
                            </Box>
                          ))}
                        </Stack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>

        {/* Create Role Modal */}
        <Modal isOpen={isRoleModalOpen} onClose={onRoleModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>เพิ่มบทบาทใหม่</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>ชื่อบทบาท</FormLabel>
                  <Input placeholder="เช่น MANAGER" />
                </FormControl>
                <FormControl>
                  <FormLabel>ชื่อแสดง</FormLabel>
                  <Input placeholder="เช่น ผู้จัดการ" />
                </FormControl>
                <FormControl>
                  <FormLabel>คำอธิบาย</FormLabel>
                  <Textarea placeholder="คำอธิบายบทบาท" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onRoleModalClose}>
                ยกเลิก
              </Button>
              <Button colorScheme="blue">สร้าง</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Create Permission Modal */}
        <Modal isOpen={isPermModalOpen} onClose={onPermModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>เพิ่มสิทธิ์ใหม่</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>ชื่อสิทธิ์</FormLabel>
                  <Input placeholder="เช่น CREATE_PROJECT" />
                </FormControl>
                <FormControl>
                  <FormLabel>ชื่อแสดง</FormLabel>
                  <Input placeholder="เช่น สร้างโครงการ" />
                </FormControl>
                <FormControl>
                  <FormLabel>คำอธิบาย</FormLabel>
                  <Textarea placeholder="คำอธิบายสิทธิ์" />
                </FormControl>
                <FormControl>
                  <FormLabel>หมวดหมู่</FormLabel>
                  <Input placeholder="เช่น Project Management" />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onPermModalClose}>
                ยกเลิก
              </Button>
              <Button colorScheme="blue">สร้าง</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Layout>
  );
};

export default RoleManagementPage;
