/**
 * TaskTrendChart Component
 * Line chart showing task creation and completion trends over time
 */

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, HStack, Badge, Text, VStack } from '@chakra-ui/react';
import { TriangleUpIcon, TriangleDownIcon, MinusIcon } from '@chakra-ui/icons';
import type { TaskTrendDataPoint, DateGranularity } from '../../../types/analytics';
import { ChartContainer } from './ChartContainer';
import { formatThaiDateShort } from '../../../utils/thaiCalendar';

interface TaskTrendChartProps {
  dataPoints: TaskTrendDataPoint[];
  granularity: DateGranularity;
  summary: {
    totalCreated: number;
    totalCompleted: number;
    completionRate: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
  loading?: boolean;
  error?: string | null;
  height?: number;
}

export const TaskTrendChart = ({
  dataPoints,
  granularity,
  summary,
  loading = false,
  error = null,
  height = 350,
}: TaskTrendChartProps) => {
  // Transform data for Recharts
  const chartData = useMemo(() => {
    return dataPoints.map((point) => ({
      date: formatThaiDateShort(new Date(point.date)),
      fullDate: point.date,
      สร้างใหม่: point.created,
      เสร็จสิ้น: point.completed,
      กำลังดำเนินการ: point.inProgress,
      รอดำเนินการ: point.pending,
    }));
  }, [dataPoints]);

  // Check if empty
  const isEmpty = !dataPoints || dataPoints.length === 0;

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Box
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor="gray.200"
        >
          <Text fontWeight="bold" mb={2}>
            {data.date}
          </Text>
          {payload.map((entry: any, index: number) => (
            <Text key={index} fontSize="sm" color={entry.color}>
              {entry.name}: {entry.value} งาน
            </Text>
          ))}
        </Box>
      );
    }
    return null;
  };

  // Trend icon
  const TrendIcon = () => {
    if (summary.trend === 'UP') {
      return <TriangleUpIcon color="green.500" />;
    } else if (summary.trend === 'DOWN') {
      return <TriangleDownIcon color="red.500" />;
    }
    return <MinusIcon color="gray.500" />;
  };

  // Trend text
  const getTrendText = () => {
    if (summary.trend === 'UP') {
      return 'เพิ่มขึ้น';
    } else if (summary.trend === 'DOWN') {
      return 'ลดลง';
    }
    return 'คงที่';
  };

  // Trend color
  const getTrendColor = () => {
    if (summary.trend === 'UP') {
      return 'green';
    } else if (summary.trend === 'DOWN') {
      return 'red';
    }
    return 'gray';
  };

  return (
    <ChartContainer
      loading={loading}
      error={error}
      isEmpty={isEmpty}
      height={height}
      title="แนวโน้มงาน"
    >
      <VStack align="stretch" spacing={4}>
        {/* Summary badges */}
        <HStack spacing={4} flexWrap="wrap">
          <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
            สร้างทั้งหมด: {summary.totalCreated} งาน
          </Badge>
          <Badge colorScheme="green" fontSize="md" px={3} py={1}>
            เสร็จสิ้น: {summary.totalCompleted} งาน
          </Badge>
          <Badge colorScheme="purple" fontSize="md" px={3} py={1}>
            อัตราความสำเร็จ: {summary.completionRate}%
          </Badge>
          <Badge colorScheme={getTrendColor()} fontSize="md" px={3} py={1}>
            <HStack spacing={1}>
              <TrendIcon />
              <Text>แนวโน้ม: {getTrendText()}</Text>
            </HStack>
          </Badge>
        </HStack>

        {/* Line chart */}
        <ResponsiveContainer width="100%" height={height - 100}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="สร้างใหม่"
              stroke="#3182CE"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="เสร็จสิ้น"
              stroke="#38A169"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="กำลังดำเนินการ"
              stroke="#805AD5"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="รอดำเนินการ"
              stroke="#718096"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </VStack>
    </ChartContainer>
  );
};

export default TaskTrendChart;
