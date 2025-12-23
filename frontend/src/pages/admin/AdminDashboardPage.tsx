import React from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { FiUsers, FiMap, FiSettings, FiActivity } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserManagement from '../../components/admin/UserManagement';
import GeoJSONManagement from '../../components/admin/GeoJSONManagement';
import AuditLogTable from '../../components/admin/AuditLogTable';
import SystemSettings from '../../components/admin/SystemSettings';
import { HealthCheckCard } from '../../components/admin/HealthCheckCard';
import { SystemStatsCard } from '../../components/admin/SystemStatsCard';

interface DashboardStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    byRole: Array<{ role: string; count: number }>;
  };
  geojson: {
    total: number;
    byType: Array<{ type: string; count: number }>;
  };
  auditLogs: {
    total: number;
    last24Hours: number;
    byAction: Array<{ action: string; count: number }>;
  };
}

const StatCard = ({ label, value, helpText, icon, color }: any) => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Stat
      px={4}
      py={5}
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      boxShadow="sm"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Icon as={icon} w={8} h={8} color={color} mr={3} />
        <StatLabel fontSize="sm" fontWeight="medium">
          {label}
        </StatLabel>
      </Box>
      <StatNumber fontSize="3xl" fontWeight="bold">
        {value}
      </StatNumber>
      {helpText && (
        <StatHelpText fontSize="sm" color="gray.500">
          {helpText}
        </StatHelpText>
      )}
    </Stat>
  );
};

const AdminDashboardPage: React.FC = () => {
  const { data: userStats } = useQuery({
    queryKey: ['admin', 'users', 'stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/users/stats');
      return data;
    },
  });

  const { data: geoStats } = useQuery({
    queryKey: ['admin', 'geojson', 'stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/geojson/stats');
      return data;
    },
  });

  const { data: auditStats } = useQuery({
    queryKey: ['admin', 'audit-logs', 'stats'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/audit-logs/stats');
      return data;
    },
  });

  return (
    <Container maxW="container.xl" py={8}>
      <Heading mb={6} size="lg">
        ระบบผู้ดูแลระบบ
      </Heading>

      {/* Health Check & System Stats */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <HealthCheckCard />
        <SystemStatsCard />
      </SimpleGrid>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <StatCard
          label="ผู้ใช้งานทั้งหมด"
          value={userStats?.total || 0}
          helpText={`ใช้งาน: ${userStats?.active || 0} | ระงับ: ${userStats?.inactive || 0}`}
          icon={FiUsers}
          color="blue.500"
        />
        <StatCard
          label="ขอบเขตภูมิศาสตร์"
          value={geoStats?.total || 0}
          helpText={`${geoStats?.byType?.length || 0} ประเภท`}
          icon={FiMap}
          color="green.500"
        />
        <StatCard
          label="บันทึกการตรวจสอบ"
          value={auditStats?.total || 0}
          helpText={`24 ชม.: ${auditStats?.last24Hours || 0} รายการ`}
          icon={FiActivity}
          color="orange.500"
        />
        <StatCard
          label="การตั้งค่าระบบ"
          value="พร้อมใช้งาน"
          helpText="อัพเดทล่าสุด: วันนี้"
          icon={FiSettings}
          color="purple.500"
        />
      </SimpleGrid>

      {/* Tabs for Different Sections */}
      <Tabs colorScheme="blue" variant="enclosed">
        <TabList>
          <Tab>จัดการผู้ใช้</Tab>
          <Tab>ขอบเขตภูมิศาสตร์</Tab>
          <Tab>บันทึกการตรวจสอบ</Tab>
          <Tab>การตั้งค่าระบบ</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.700')}
            >
              <UserManagement />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.700')}
            >
              <GeoJSONManagement />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.700')}
            >
              <AuditLogTable />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              bg={useColorModeValue('white', 'gray.700')}
            >
              <SystemSettings />
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default AdminDashboardPage;
