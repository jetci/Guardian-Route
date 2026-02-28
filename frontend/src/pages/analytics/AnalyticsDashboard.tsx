/**
 * Analytics Dashboard Page
 * Main analytics dashboard with Chart 1 & 2
 */

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  SimpleGrid,
  useToast,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { TaskStatusChart } from '../../components/analytics/charts/TaskStatusChart';
import { TaskTrendChart } from '../../components/analytics/charts/TaskTrendChart';
import { QuickDateFilter } from '../../components/analytics/filters/QuickDateFilter';
import { DateRangePicker } from '../../components/analytics/filters/DateRangePicker';
import { analyticsService } from '../../services/analyticsService';
import type {
  TaskStatusOverview,
  TaskTrendData,
} from '../../types/analytics';
import { DateGranularity } from '../../types/analytics';
import type { DateRange } from '../../utils/thaiCalendar';
import { getQuickDateRanges } from '../../utils/thaiCalendar';

export const AnalyticsDashboard = () => {
  const toast = useToast();

  // Date range state
  const quickRanges = getQuickDateRanges();
  const [startDate, setStartDate] = useState<Date>(quickRanges.last30Days.start);
  const [endDate, setEndDate] = useState<Date>(quickRanges.last30Days.end);
  const [selectedQuickRange, setSelectedQuickRange] = useState<string>('last30Days');

  // State for Chart 1: Task Status
  const [taskStatus, setTaskStatus] = useState<TaskStatusOverview | null>(null);
  const [taskStatusLoading, setTaskStatusLoading] = useState(true);
  const [taskStatusError, setTaskStatusError] = useState<string | null>(null);

  // State for Chart 2: Task Trend
  const [taskTrend, setTaskTrend] = useState<TaskTrendData | null>(null);
  const [taskTrendLoading, setTaskTrendLoading] = useState(true);
  const [taskTrendError, setTaskTrendError] = useState<string | null>(null);

  // Load data when date range changes
  useEffect(() => {
    loadAnalyticsData();
  }, [startDate, endDate]);

  const loadAnalyticsData = async () => {
    await Promise.all([loadTaskStatus(), loadTaskTrend()]);
  };

  const loadTaskStatus = async () => {
    try {
      setTaskStatusLoading(true);
      setTaskStatusError(null);

      const data = await analyticsService.getTaskStatusOverview({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setTaskStatus(data);
    } catch (error: any) {
      console.error('Failed to load task status:', error);
      const errorMessage = error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลสถานะงานได้';
      setTaskStatusError(errorMessage);
      
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTaskStatusLoading(false);
    }
  };

  const loadTaskTrend = async () => {
    try {
      setTaskTrendLoading(true);
      setTaskTrendError(null);

      const data = await analyticsService.getTaskTrend({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        granularity: DateGranularity.DAILY,
      });

      setTaskTrend(data);
    } catch (error: any) {
      console.error('Failed to load task trend:', error);
      const errorMessage = error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลแนวโน้มงานได้';
      setTaskTrendError(errorMessage);
      
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTaskTrendLoading(false);
    }
  };

  // Handle quick range selection
  const handleQuickRangeSelect = (rangeKey: string, range: DateRange) => {
    setStartDate(range.start);
    setEndDate(range.end);
    setSelectedQuickRange(rangeKey);
  };

  // Handle custom date range selection
  const handleCustomDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    setSelectedQuickRange(''); // Clear quick range selection
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack align="stretch" spacing={8}>
        {/* Header */}
        <Box>
          <Heading size="lg" mb={2}>
            📊 Analytics Dashboard
          </Heading>
          <Heading size="sm" color="gray.600" fontWeight="normal">
            วิเคราะห์ข้อมูลและแนวโน้มการทำงาน
          </Heading>
        </Box>

        {/* Filters */}
        <Box
          bg="white"
          p={4}
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
        >
          <VStack align="stretch" spacing={3}>
            <HStack justify="space-between" align="center">
              <Heading size="sm">ช่วงเวลา</Heading>
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleCustomDateChange}
              />
            </HStack>
            <Divider />
            <QuickDateFilter
              selectedRange={selectedQuickRange}
              onRangeSelect={handleQuickRangeSelect}
            />
          </VStack>
        </Box>

        {/* Charts Grid */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
          {/* Chart 1: Task Status Overview */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <TaskStatusChart
              data={taskStatus?.metrics || []}
              total={taskStatus?.total || 0}
              loading={taskStatusLoading}
              error={taskStatusError}
              height={350}
            />
          </Box>

          {/* Chart 2: Task Trend */}
          <Box
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
          >
            <TaskTrendChart
              dataPoints={taskTrend?.dataPoints || []}
              granularity={taskTrend?.granularity || DateGranularity.DAILY}
              summary={taskTrend?.summary || {
                totalCreated: 0,
                totalCompleted: 0,
                completionRate: 0,
                trend: 'STABLE',
              }}
              loading={taskTrendLoading}
              error={taskTrendError}
              height={350}
            />
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default AnalyticsDashboard;
