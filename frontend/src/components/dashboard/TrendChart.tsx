import { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsApi, type TrendData } from '../../api/analytics';

export const TrendChart = () => {
  const [data, setData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await analyticsApi.getTrendData();
        setData(result);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลแนวโน้มได้');
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
        แนวโน้มเหตุการณ์ 6 เดือนย้อนหลัง
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="count"
            stroke="#3182CE"
            strokeWidth={2}
            name="จำนวนเหตุการณ์"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgResponseTime"
            stroke="#38A169"
            strokeWidth={2}
            name="เวลาตอบสนองเฉลี่ย (ชม.)"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};
