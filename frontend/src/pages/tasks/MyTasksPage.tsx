import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useToast,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { TaskCard } from '../../components/tasks/TaskCard';
import { tasksApi } from '../../api/tasks';

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

export const MyTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      setIsLoading(true);
      const response = await tasksApi.getMyTasks();
      setTasks(response);
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถโหลดข้อมูลงานได้',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    try {
      await tasksApi.acceptTask(taskId);
      toast({
        title: 'รับงานสำเร็จ',
        description: 'คุณสามารถเริ่มทำงานได้แล้ว',
        status: 'success',
        duration: 3000,
      });
      // Refresh tasks
      fetchMyTasks();
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถรับงานได้',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const handleViewDetails = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  // Filter tasks by status
  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const surveyedTasks = tasks.filter((t) => t.status === 'SURVEYED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            งานของฉัน
          </Heading>
          <Text color="gray.600">งานที่ได้รับมอบหมายทั้งหมด</Text>
        </Box>

        {/* Summary */}
        <HStack spacing={4} flexWrap="wrap">
          <Badge colorScheme="yellow" fontSize="md" px={3} py={1}>
            รอดำเนินการ: {pendingTasks.length}
          </Badge>
          <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
            กำลังดำเนินการ: {inProgressTasks.length}
          </Badge>
          <Badge colorScheme="green" fontSize="md" px={3} py={1}>
            สำรวจแล้ว: {surveyedTasks.length}
          </Badge>
          <Badge colorScheme="gray" fontSize="md" px={3} py={1}>
            เสร็จสิ้น: {completedTasks.length}
          </Badge>
        </HStack>

        {/* Tabs */}
        <Tabs index={activeTab} onChange={setActiveTab} colorScheme="blue">
          <TabList>
            <Tab>
              รอดำเนินการ <Badge ml={2} colorScheme="yellow">{pendingTasks.length}</Badge>
            </Tab>
            <Tab>
              กำลังดำเนินการ <Badge ml={2} colorScheme="blue">{inProgressTasks.length}</Badge>
            </Tab>
            <Tab>
              สำรวจแล้ว <Badge ml={2} colorScheme="green">{surveyedTasks.length}</Badge>
            </Tab>
            <Tab>
              เสร็จสิ้น <Badge ml={2} colorScheme="gray">{completedTasks.length}</Badge>
            </Tab>
          </TabList>

          <TabPanels>
            {/* Pending Tasks */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {pendingTasks.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>ไม่มีงานที่รอดำเนินการ</AlertDescription>
                  </Alert>
                ) : (
                  pendingTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onAccept={handleAcceptTask}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </VStack>
            </TabPanel>

            {/* In Progress Tasks */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {inProgressTasks.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>ไม่มีงานที่กำลังดำเนินการ</AlertDescription>
                  </Alert>
                ) : (
                  inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </VStack>
            </TabPanel>

            {/* Surveyed Tasks */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {surveyedTasks.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>ไม่มีงานที่สำรวจแล้ว</AlertDescription>
                  </Alert>
                ) : (
                  surveyedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </VStack>
            </TabPanel>

            {/* Completed Tasks */}
            <TabPanel px={0}>
              <VStack spacing={4} align="stretch">
                {completedTasks.length === 0 ? (
                  <Alert status="info">
                    <AlertIcon />
                    <AlertDescription>ไม่มีงานที่เสร็จสิ้น</AlertDescription>
                  </Alert>
                ) : (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onViewDetails={handleViewDetails}
                    />
                  ))
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Container>
  );
};
