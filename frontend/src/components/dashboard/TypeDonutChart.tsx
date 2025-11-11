import { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { analyticsApi, type IncidentsByType } from '../../api/analytics';

const COLORS = ['#3182CE', '#38A169', '#DD6B20', '#E53E3E', '#805AD5', '#D69E2E'];

export const TypeDonutChart = () => {
  const [data, setData] = useState<IncidentsByType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await analyticsApi.getIncidentsByType();
        // Map data to include 'name' property for recharts
        const mappedData = result.map(item => ({
          ...item,
          name: item.type, // Assuming 'type' is the name property
        }));
        setData(mappedData);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลประเภทภัยได้');
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
        เปรียบเทียบประเภทภัย
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ payload, percent }) => `${payload.name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};
