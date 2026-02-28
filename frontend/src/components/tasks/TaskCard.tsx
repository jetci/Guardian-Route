import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Badge,
  HStack,
  VStack,
  Button,
  Divider,
  Box,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { formatThaiDateShort } from '../../utils/dateFormatter';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SURVEYED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  incident: {
    id: string;
    title: string;
    disasterType: string;
    priority: string;
  };
  createdAt: string;
}

interface TaskCardProps {
  task: Task;
  onAccept?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
}

const statusConfig = {
  PENDING: { label: 'รอดำเนินการ', colorScheme: 'yellow' },
  IN_PROGRESS: { label: 'กำลังดำเนินการ', colorScheme: 'blue' },
  SURVEYED: { label: 'สำรวจแล้ว', colorScheme: 'green' },
  COMPLETED: { label: 'เสร็จสิ้น', colorScheme: 'gray' },
  CANCELLED: { label: 'ยกเลิก', colorScheme: 'red' },
};

const priorityConfig = {
  LOW: { label: 'ต่ำ', colorScheme: 'gray' },
  MEDIUM: { label: 'ปานกลาง', colorScheme: 'blue' },
  HIGH: { label: 'สูง', colorScheme: 'orange' },
  URGENT: { label: 'เร่งด่วน', colorScheme: 'red' },
};

const disasterTypeConfig: Record<string, string> = {
  FLOOD: '🌊 น้ำท่วม',
  LANDSLIDE: '⛰️ ดินถล่ม',
  FIRE: '🔥 ไฟไหม้',
  STORM: '🌪️ พายุ',
  EARTHQUAKE: '🏚️ แผ่นดินไหว',
  OTHER: '📋 อื่นๆ',
};

export const TaskCard = ({ task, onAccept, onViewDetails }: TaskCardProps) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(task.id);
    } else {
      navigate(`/tasks/${task.id}`);
    }
  };

  const handleAccept = () => {
    if (onAccept) {
      onAccept(task.id);
    }
  };

  return (
    <Card variant="outline" _hover={{ shadow: 'md', borderColor: 'blue.300' }}>
      <CardHeader pb={2}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={1} flex={1}>
            <Heading size="sm">{task.title}</Heading>
            <Text fontSize="sm" color="gray.600">
              {task.incident.title}
            </Text>
          </VStack>
          <VStack align="end" spacing={1}>
            <Badge colorScheme={statusConfig[task.status].colorScheme}>
              {statusConfig[task.status].label}
            </Badge>
            <Badge colorScheme={priorityConfig[task.priority].colorScheme} variant="subtle">
              {priorityConfig[task.priority].label}
            </Badge>
          </VStack>
        </HStack>
      </CardHeader>

      <CardBody pt={2}>
        <VStack align="stretch" spacing={3}>
          {task.description && (
            <Text fontSize="sm" color="gray.700" noOfLines={2}>
              {task.description}
            </Text>
          )}

          <HStack spacing={2} flexWrap="wrap">
            <Badge variant="outline">
              {disasterTypeConfig[task.incident.disasterType] || task.incident.disasterType}
            </Badge>
            {task.dueDate && (
              <Badge colorScheme="purple" variant="subtle">
                📅 {formatThaiDateShort(task.dueDate)}
              </Badge>
            )}
          </HStack>

          <Divider />

          <HStack justify="space-between">
            <Text fontSize="xs" color="gray.500">
              สร้างเมื่อ: {formatThaiDateShort(task.createdAt)}
            </Text>

            <HStack>
              {task.status === 'PENDING' && onAccept && (
                <Button size="sm" colorScheme="green" onClick={handleAccept}>
                  รับงาน
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleViewDetails}>
                ดูรายละเอียด
              </Button>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};
