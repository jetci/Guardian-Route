import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Button,
  useToast,
  Spinner,
  Text,
  Badge,
  Card,
  CardBody,
  SimpleGrid,
  Icon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';
import { incidentsApi } from '../../api/incidents';
import type { Incident } from '../../types';

const priorityColors: Record<string, string> = {
  LOW: 'green',
  MEDIUM: 'yellow',
  HIGH: 'orange',
  CRITICAL: 'red',
};

const priorityLabels: Record<string, string> = {
  LOW: 'ต่ำ',
  MEDIUM: 'ปานกลาง',
  HIGH: 'สูง',
  CRITICAL: 'วิกฤติ',
};

const statusColors: Record<string, string> = {
  PENDING: 'gray',
  IN_PROGRESS: 'blue',
  RESOLVED: 'green',
  CLOSED: 'purple',
};

const statusLabels: Record<string, string> = {
  PENDING: 'รอดำเนินการ',
  IN_PROGRESS: 'กำลังดำเนินการ',
  RESOLVED: 'แก้ไขแล้ว',
  CLOSED: 'ปิดงาน',
};

const disasterTypeLabels: Record<string, string> = {
  FLOOD: 'น้ำท่วม',
  LANDSLIDE: 'ดินถล่ม',
  FIRE: 'ไฟไหม้',
  DROUGHT: 'ภัยแล้ง',
  STORM: 'พายุ',
  EARTHQUAKE: 'แผ่นดินไหว',
  OTHER: 'อื่นๆ',
};

export const MyIncidentsPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      setIsLoading(true);
      const data = await incidentsApi.getMy();
      setIncidents(data);
    } catch (error: any) {
      console.error('Error loading incidents:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>กำลังโหลดข้อมูล...</Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">เหตุการณ์ที่ฉันรายงาน</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => navigate('/incidents/report')}
          >
            รายงานเหตุการณ์ใหม่
          </Button>
        </HStack>

        {incidents.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} py={8}>
                <Text fontSize="6xl">⚠️</Text>
                <Text color="gray.600">ยังไม่มีเหตุการณ์ที่รายงาน</Text>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  onClick={() => navigate('/incidents/report')}
                >
                  รายงานเหตุการณ์แรก
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {incidents.map((incident) => (
              <Card
                key={incident.id}
                cursor="pointer"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={() => navigate(`/incidents/${incident.id}`)}
              >
                <CardBody>
                  <VStack align="stretch" spacing={3}>
                    <HStack justify="space-between">
                      <Badge colorScheme={priorityColors[incident.priority]}>
                        {priorityLabels[incident.priority]}
                      </Badge>
                      <Badge colorScheme={statusColors[incident.status]}>
                        {statusLabels[incident.status]}
                      </Badge>
                    </HStack>

                    <Heading size="sm" noOfLines={2}>
                      {incident.title}
                    </Heading>

                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {incident.description}
                    </Text>

                    <VStack align="stretch" spacing={2} fontSize="sm">
                      <HStack>
                        <Text>🚨</Text>
                        <Text>{disasterTypeLabels[incident.disasterType] || incident.disasterType}</Text>
                      </HStack>

                      <HStack>
                        <Text>📍</Text>
                        <Text>{incident.village.name}</Text>
                      </HStack>

                      <HStack>
                        <Text>🕐</Text>
                        <Text color="gray.500">{formatDate(incident.createdAt)}</Text>
                      </HStack>
                    </VStack>

                    {incident._count && (
                      <HStack spacing={4} fontSize="sm" color="gray.600">
                        <Text>งาน: {incident._count.tasks}</Text>
                        <Text>สำรวจ: {incident._count.surveys}</Text>
                        <Text>รายงาน: {incident._count.reports}</Text>
                      </HStack>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Container>
  );
};
