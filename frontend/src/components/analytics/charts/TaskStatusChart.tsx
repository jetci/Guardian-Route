/**
 * TaskStatusChart Component
 * Horizontal bar chart showing task count by status
 */

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Box, HStack, Badge, Text, VStack } from '@chakra-ui/react';
import type { TaskStatusMetric } from '../../../types/analytics';
import { ChartContainer } from './ChartContainer';

interface TaskStatusChartProps {
  data: TaskStatusMetric[];
  total: number;
  loading?: boolean;
  error?: string | null;
  height?: number;
}

// Status colors matching the system
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#718096',      // Gray
  IN_PROGRESS: '#3182CE',  // Blue
  SURVEYED: '#805AD5',     // Purple
  COMPLETED: '#38A169',    // Green
  CANCELLED: '#E53E3E',    // Red
};

// Status labels in Thai
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'รอดำเนินการ',
  IN_PROGRESS: 'กำลังดำเนินการ',
  SURVEYED: 'สำรวจแล้ว',
  COMPLETED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก',
};

export const TaskStatusChart = ({
  data,
  total,
  loading = false,
  error = null,
  height = 300,
}: TaskStatusChartProps) => {
  // Transform data for Recharts
  const chartData = useMemo(() => {
    return data.map((item) => ({
      status: STATUS_LABELS[item.status] || item.status,
      count: item.count,
      percentage: item.percentage,
      originalStatus: item.status,
    }));
  }, [data]);

  // Check if empty
  const isEmpty = !data || data.length === 0 || total === 0;

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
          <Text fontWeight="bold" mb={1}>
            {data.status}
          </Text>
          <Text fontSize="sm" color="gray.600">
            จำนวน: {data.count} งาน
          </Text>
          <Text fontSize="sm" color="gray.600">
            สัดส่วน: {data.percentage}%
          </Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <ChartContainer
      loading={loading}
      error={error}
      isEmpty={isEmpty}
      height={height}
      title="สถานะงาน"
    >
      <VStack align="stretch" spacing={4}>
        {/* Summary badges */}
        <HStack spacing={4} flexWrap="wrap">
          <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
            ทั้งหมด: {total} งาน
          </Badge>
          {data.map((item) => (
            <Badge
              key={item.status}
              colorScheme={getColorScheme(item.status)}
              fontSize="sm"
              px={2}
              py={1}
            >
              {STATUS_LABELS[item.status]}: {item.count} ({item.percentage}%)
            </Badge>
          ))}
        </HStack>

        {/* Bar chart */}
        <ResponsiveContainer width="100%" height={height - 80}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="status" type="category" width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="count" name="จำนวนงาน" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={STATUS_COLORS[entry.originalStatus] || '#718096'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </VStack>
    </ChartContainer>
  );
};

// Helper function to get Chakra color scheme from status
function getColorScheme(status: string): string {
  const schemes: Record<string, string> = {
    PENDING: 'gray',
    IN_PROGRESS: 'blue',
    SURVEYED: 'purple',
    COMPLETED: 'green',
    CANCELLED: 'red',
  };
  return schemes[status] || 'gray';
}

export default TaskStatusChart;
