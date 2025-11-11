import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  Text,
  HStack,
  Select,
  Input,
  Button,
  useToast,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import api from '../../api/client';

interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  incidentId?: string;
  details?: Record<string, unknown>;
  createdAt: string;
  user?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  incident?: {
    id: string;
    title: string;
  };
}

const AuditLogsPage = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const toast = useToast();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/activity-logs', {
        params: {
          action: actionFilter || undefined,
          userId: userFilter || undefined,
          date: dateFilter || undefined,
        },
      });
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูล Activity Logs ได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchLogs();
  };

  const handleReset = () => {
    setActionFilter('');
    setUserFilter('');
    setDateFilter('');
    fetchLogs();
  };

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case 'CREATE_INCIDENT':
        return 'green';
      case 'UPDATE_INCIDENT':
        return 'blue';
      case 'DELETE_INCIDENT':
        return 'red';
      case 'ASSIGN_INCIDENT':
        return 'purple';
      case 'REVIEW_INCIDENT':
        return 'orange';
      case 'LOGIN':
        return 'gray';
      case 'LOGOUT':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      CREATE_INCIDENT: 'สร้างเหตุการณ์',
      UPDATE_INCIDENT: 'แก้ไขเหตุการณ์',
      DELETE_INCIDENT: 'ลบเหตุการณ์',
      ASSIGN_INCIDENT: 'มอบหมายเหตุการณ์',
      REVIEW_INCIDENT: 'ตรวจสอบเหตุการณ์',
      LOGIN: 'เข้าสู่ระบบ',
      LOGOUT: 'ออกจากระบบ',
    };
    return labels[action] || action;
  };

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" py={10}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>กำลังโหลดข้อมูล...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6}>Activity Logs (Audit Trail)</Heading>

      {/* Filters */}
      <Card mb={6}>
        <CardBody>
          <HStack spacing={4} mb={4}>
            <Box flex={1}>
              <Text mb={2} fontWeight="medium">
                Action
              </Text>
              <Select
                placeholder="-- ทั้งหมด --"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="CREATE_INCIDENT">สร้างเหตุการณ์</option>
                <option value="UPDATE_INCIDENT">แก้ไขเหตุการณ์</option>
                <option value="DELETE_INCIDENT">ลบเหตุการณ์</option>
                <option value="ASSIGN_INCIDENT">มอบหมายเหตุการณ์</option>
                <option value="REVIEW_INCIDENT">ตรวจสอบเหตุการณ์</option>
                <option value="LOGIN">เข้าสู่ระบบ</option>
                <option value="LOGOUT">ออกจากระบบ</option>
              </Select>
            </Box>

            <Box flex={1}>
              <Text mb={2} fontWeight="medium">
                User ID
              </Text>
              <Input
                placeholder="กรอก User ID"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              />
            </Box>

            <Box flex={1}>
              <Text mb={2} fontWeight="medium">
                วันที่
              </Text>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Box>
          </HStack>

          <HStack spacing={4}>
            <Button colorScheme="blue" onClick={handleFilter}>
              ค้นหา
            </Button>
            <Button variant="outline" onClick={handleReset}>
              รีเซ็ต
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardBody>
          {logs.length === 0 ? (
            <Text textAlign="center" py={8} color="gray.500">
              ไม่พบข้อมูล Activity Logs
            </Text>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>เวลา</Th>
                    <Th>Action</Th>
                    <Th>ผู้ใช้งาน</Th>
                    <Th>เหตุการณ์</Th>
                    <Th>รายละเอียด</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {logs.map((log) => (
                    <Tr key={log.id}>
                      <Td>
                        <Text fontSize="sm">
                          {format(new Date(log.createdAt), 'dd MMM yyyy', {
                            locale: th,
                          })}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {format(new Date(log.createdAt), 'HH:mm:ss')}
                        </Text>
                      </Td>
                      <Td>
                        <Badge colorScheme={getActionBadgeColor(log.action)}>
                          {getActionLabel(log.action)}
                        </Badge>
                      </Td>
                      <Td>
                        {log.user ? (
                          <>
                            <Text fontSize="sm" fontWeight="medium">
                              {log.user.firstName} {log.user.lastName}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              @{log.user.username} ({log.user.role})
                            </Text>
                          </>
                        ) : (
                          <Text fontSize="sm" color="gray.500">
                            {log.userId}
                          </Text>
                        )}
                      </Td>
                      <Td>
                        {log.incident ? (
                          <Text fontSize="sm">{log.incident.title}</Text>
                        ) : log.incidentId ? (
                          <Text fontSize="sm" color="gray.500">
                            {log.incidentId}
                          </Text>
                        ) : (
                          <Text fontSize="sm" color="gray.400">
                            -
                          </Text>
                        )}
                      </Td>
                      <Td>
                        {log.details ? (
                          <Text
                            fontSize="xs"
                            fontFamily="mono"
                            maxW="300px"
                            isTruncated
                            title={JSON.stringify(log.details, null, 2)}
                          >
                            {JSON.stringify(log.details)}
                          </Text>
                        ) : (
                          <Text fontSize="sm" color="gray.400">
                            -
                          </Text>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>

      {/* Summary */}
      <Box mt={4} textAlign="right">
        <Text fontSize="sm" color="gray.600">
          ทั้งหมด {logs.length} รายการ
        </Text>
      </Box>
    </Container>
  );
};

export default AuditLogsPage;
