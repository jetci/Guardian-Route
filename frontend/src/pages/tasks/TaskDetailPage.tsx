import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  useToast,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { FieldSurveyForm, FieldSurveyData } from '../../components/tasks/FieldSurveyForm';
import { tasksApi } from '../../api/tasks';

interface TaskDetail {
  id: string;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'SURVEYED' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  incident: {
    id: string;
    title: string;
    description?: string;
    disasterType: string;
    priority: string;
    address?: string;
  };
  createdAt: string;
  surveyedAt?: string;
  surveyNotes?: string;
}

const statusConfig = {
  PENDING: { label: 'รอดำเนินการ', colorScheme: 'yellow' },
  IN_PROGRESS: { label: 'กำลังดำเนินการ', colorScheme: 'blue' },
  SURVEYED: { label: 'สำรวจแล้ว', colorScheme: 'green' },
  COMPLETED: { label: 'เสร็จสิ้น', colorScheme: 'gray' },
  CANCELLED: { label: 'ยกเลิก', colorScheme: 'red' },
};

export const TaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const [task, setTask] = useState<TaskDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showSurveyForm, setShowSurveyForm] = useState(false);

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail(taskId);
    }
  }, [taskId]);

  const fetchTaskDetail = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await tasksApi.getTaskById(id);
      setTask(response);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถโหลดข้อมูลงานได้',
        status: 'error',
        duration: 5000,
      });
      navigate('/tasks/my-tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async () => {
    if (!taskId) return;

    try {
      setIsAccepting(true);
      await tasksApi.acceptTask(taskId);
      toast({
        title: 'รับงานสำเร็จ',
        description: 'คุณสามารถเริ่มทำงานได้แล้ว',
        status: 'success',
        duration: 3000,
      });
      // Refresh task detail
      fetchTaskDetail(taskId);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถรับงานได้',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsAccepting(false);
    }
  };

  const handleStartSurvey = () => {
    setShowSurveyForm(true);
  };

  const handleSubmitSurvey = async (data: FieldSurveyData) => {
    if (!taskId) return;

    try {
      await tasksApi.submitSurveyData(taskId, data);
      toast({
        title: 'บันทึกข้อมูลสำเร็จ',
        description: 'ข้อมูลการสำรวจถูกบันทึกแล้ว งานเปลี่ยนสถานะเป็น "สำรวจแล้ว"',
        status: 'success',
        duration: 5000,
      });
      navigate('/tasks/my-tasks');
    } catch (error: any) {
      throw error; // Let FieldSurveyForm handle the error
    }
  };

  const handleCancelSurvey = () => {
    setShowSurveyForm(false);
  };

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" />
          <Text>กำลังโหลดข้อมูล...</Text>
        </VStack>
      </Container>
    );
  }

  if (!task) {
    return (
      <Container maxW="container.xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>ไม่พบข้อมูลงาน</AlertDescription>
        </Alert>
      </Container>
    );
  }

  // Show survey form if status is IN_PROGRESS
  if (task.status === 'IN_PROGRESS' && showSurveyForm) {
    return (
      <Container maxW="container.xl" py={8}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          mb={4}
          onClick={handleCancelSurvey}
        >
          กลับ
        </Button>
        <FieldSurveyForm
          taskId={task.id}
          incidentTitle={task.incident.title}
          onSubmit={handleSubmitSurvey}
          onCancel={handleCancelSurvey}
        />
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Back Button */}
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          alignSelf="flex-start"
          onClick={() => navigate('/tasks/my-tasks')}
        >
          กลับไปยังงานของฉัน
        </Button>

        {/* Task Header */}
        <Card>
          <CardHeader>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <Heading size="lg">{task.title}</Heading>
                <Text color="gray.600">{task.incident.title}</Text>
              </VStack>
              <Badge colorScheme={statusConfig[task.status].colorScheme} fontSize="lg" px={3} py={1}>
                {statusConfig[task.status].label}
              </Badge>
            </HStack>
          </CardHeader>

          <CardBody>
            <VStack align="stretch" spacing={4}>
              {/* Task Description */}
              {task.description && (
                <Box>
                  <Text fontWeight="bold" mb={1}>
                    คำอธิบายงาน:
                  </Text>
                  <Text>{task.description}</Text>
                </Box>
              )}

              <Divider />

              {/* Incident Details */}
              <Box>
                <Text fontWeight="bold" mb={2}>
                  รายละเอียดเหตุการณ์:
                </Text>
                <VStack align="stretch" spacing={2}>
                  <HStack>
                    <Text fontWeight="medium" w="150px">
                      ประเภทภัย:
                    </Text>
                    <Badge>{task.incident.disasterType}</Badge>
                  </HStack>
                  <HStack>
                    <Text fontWeight="medium" w="150px">
                      ระดับความสำคัญ:
                    </Text>
                    <Badge colorScheme="orange">{task.incident.priority}</Badge>
                  </HStack>
                  {task.incident.address && (
                    <HStack align="start">
                      <Text fontWeight="medium" w="150px">
                        ที่อยู่:
                      </Text>
                      <Text>{task.incident.address}</Text>
                    </HStack>
                  )}
                  {task.incident.description && (
                    <VStack align="stretch">
                      <Text fontWeight="medium">รายละเอียด:</Text>
                      <Text>{task.incident.description}</Text>
                    </VStack>
                  )}
                </VStack>
              </Box>

              <Divider />

              {/* Survey Data (if surveyed) */}
              {task.status === 'SURVEYED' && task.surveyNotes && (
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    ข้อมูลการสำรวจ:
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    <HStack>
                      <Text fontWeight="medium" w="150px">
                        สำรวจเมื่อ:
                      </Text>
                      <Text>
                        {task.surveyedAt
                          ? new Date(task.surveyedAt).toLocaleString('th-TH')
                          : '-'}
                      </Text>
                    </HStack>
                    <VStack align="stretch">
                      <Text fontWeight="medium">รายละเอียด:</Text>
                      <Text whiteSpace="pre-wrap">{task.surveyNotes}</Text>
                    </VStack>
                  </VStack>
                </Box>
              )}

              <Divider />

              {/* Action Buttons */}
              <HStack justify="flex-end" pt={4}>
                {task.status === 'PENDING' && (
                  <Button
                    colorScheme="green"
                    size="lg"
                    onClick={handleAcceptTask}
                    isLoading={isAccepting}
                    loadingText="กำลังรับงาน..."
                  >
                    รับงาน
                  </Button>
                )}

                {task.status === 'IN_PROGRESS' && (
                  <Button colorScheme="blue" size="lg" onClick={handleStartSurvey}>
                    เริ่มบันทึกข้อมูลภาคสนาม
                  </Button>
                )}

                {task.status === 'SURVEYED' && (
                  <Alert status="success">
                    <AlertIcon />
                    <AlertDescription>
                      งานนี้สำรวจเสร็จแล้ว รอการทำรายงาน
                    </AlertDescription>
                  </Alert>
                )}
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
};
