import { useEffect, useState } from 'react';
import {
  Box,
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
} from '@chakra-ui/react';
import { analyticsApi, type CriticalIncident } from '../../api/analytics';

const priorityColors: Record<string, string> = {
  CRITICAL: 'red',
  HIGH: 'orange',
  MEDIUM: 'yellow',
  LOW: 'green',
};

const statusColors: Record<string, string> = {
  PENDING: 'yellow',
  IN_PROGRESS: 'blue',
  RESOLVED: 'green',
  CLOSED: 'gray',
};

export const CriticalIncidentsTable = () => {
  const [incidents, setIncidents] = useState<CriticalIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await analyticsApi.getCriticalIncidents();
        setIncidents(result);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลเหตุการณ์รุนแรงได้');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box p={6} bg="white" borderRadius="lg" shadow="sm">
        <Spinner />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} bg="white" borderRadius="lg" shadow="sm">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <Heading size="md" mb={4}>
        เหตุการณ์รุนแรงล่าสุด
      </Heading>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>หัวข้อ</Th>
              <Th>ระดับความรุนแรง</Th>
              <Th>สถานะ</Th>
              <Th>ตำแหน่ง</Th>
              <Th>วันที่</Th>
            </Tr>
          </Thead>
          <Tbody>
            {incidents.map((incident) => (
              <Tr key={incident.id}>
                <Td>{incident.title}</Td>
                <Td>
                  <Badge colorScheme={priorityColors[incident.priority]}>
                    {incident.priority}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={statusColors[incident.status]}>
                    {incident.status}
                  </Badge>
                </Td>
                <Td>{incident.location}</Td>
                <Td>{new Date(incident.createdAt).toLocaleDateString('th-TH')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
