import React from 'react';
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
import { TaskTrend } from '../../../types/executive';

interface TaskTrendsChartProps {
  data: TaskTrend[];
  isLoading?: boolean;
}

export const TaskTrendsChart: React.FC<TaskTrendsChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded animate-pulse">
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500">ไม่มีข้อมูล</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(value) => {
            const date = new Date(value as string);
            return date.toLocaleDateString('th-TH');
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#3b82f6"
          strokeWidth={2}
          name="งานทั้งหมด"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#10b981"
          strokeWidth={2}
          name="เสร็จสมบูรณ์"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="inProgress"
          stroke="#f59e0b"
          strokeWidth={2}
          name="กำลังดำเนินการ"
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="pending"
          stroke="#ef4444"
          strokeWidth={2}
          name="รอดำเนินการ"
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
