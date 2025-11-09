import { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Text } from '@chakra-ui/react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { analyticsApi, type RiskArea } from '../../api/analytics';
import 'leaflet/dist/leaflet.css';

const getSeverityColor = (severity: number): string => {
  const colors = ['#38A169', '#D69E2E', '#DD6B20', '#E53E3E', '#9B2C2C'];
  return colors[severity - 1] || colors[0];
};

const getSeverityRadius = (count: number): number => {
  return Math.min(50, 10 + count * 5);
};

export const RiskHeatmap = () => {
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await analyticsApi.getRiskAreas();
        setRiskAreas(result);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลพื้นที่เสี่ยงได้');
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

  const center: LatLngExpression = riskAreas.length > 0
    ? [riskAreas[0].lat, riskAreas[0].lng]
    : [13.7563, 100.5018]; // Bangkok default

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="sm">
      <Heading size="md" mb={4}>
        Heatmap พื้นที่เสี่ยง
      </Heading>
      <Box height="400px" borderRadius="md" overflow="hidden">
        <MapContainer
          center={center}
          zoom={6}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {riskAreas.map((area, index) => (
            <CircleMarker
              key={index}
              center={[area.lat, area.lng]}
              radius={getSeverityRadius(area.count)}
              fillColor={getSeverityColor(area.severity)}
              fillOpacity={0.6}
              stroke={false}
            >
              <Popup>
                <div>
                  <strong>พื้นที่เสี่ยง</strong>
                  <br />
                  จำนวนเหตุการณ์: {area.count}
                  <br />
                  ระดับความรุนแรง: {area.severity}/5
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </Box>
      <Box mt={4}>
        <Text fontSize="sm" color="gray.600">
          <strong>สัญลักษณ์:</strong>
        </Text>
        <Box display="flex" gap={4} mt={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#38A169" borderRadius="full" />
            <Text fontSize="sm">ระดับ 1 (ต่ำ)</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#D69E2E" borderRadius="full" />
            <Text fontSize="sm">ระดับ 2</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#DD6B20" borderRadius="full" />
            <Text fontSize="sm">ระดับ 3</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#E53E3E" borderRadius="full" />
            <Text fontSize="sm">ระดับ 4</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Box w={4} h={4} bg="#9B2C2C" borderRadius="full" />
            <Text fontSize="sm">ระดับ 5 (สูง)</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
