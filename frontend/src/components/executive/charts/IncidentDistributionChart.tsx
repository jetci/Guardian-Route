import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IncidentDistribution } from '../../../types/executive';

interface IncidentDistributionChartProps {
  data: IncidentDistribution[];
  isLoading?: boolean;
}

const COLORS = {
  FLOOD: '#3b82f6',
  LANDSLIDE: '#f59e0b',
  FIRE: '#ef4444',
  STORM: '#8b5cf6',
  EARTHQUAKE: '#ec4899',
  OTHER: '#6b7280',
};

const DISASTER_LABELS: Record<string, string> = {
  FLOOD: 'น้ำท่วม',
  LANDSLIDE: 'ดินถล่ม',
  FIRE: 'ไฟไหม้',
  STORM: 'พายุ',
  EARTHQUAKE: 'แผ่นดินไหว',
  OTHER: 'อื่นๆ',
};

export const IncidentDistributionChart: React.FC<IncidentDistributionChartProps> = ({
  data,
  isLoading = false,
}) => {
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

  const chartData = data.map((item) => ({
    name: DISASTER_LABELS[item.type] || item.type,
    value: item.count,
    percentage: item.percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percentage }) => `${name}: ${percentage}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => {
            const type = data[index].type;
            return <Cell key={`cell-${index}`} fill={COLORS[type as keyof typeof COLORS] || COLORS.OTHER} />;
          })}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string) => [`${value} เหตุการณ์`, name]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
