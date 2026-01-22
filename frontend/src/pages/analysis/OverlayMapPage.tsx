import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  useToast,
  Spinner,
  Checkbox,
  CheckboxGroup,
  Stack,
  Divider,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { incidentsApi, type Incident } from '../../api/incidents';
import { analysisApi, type OverlayAnalysisResult } from '../../api/analysis';
import { ExportAnalysisButton } from '../../components/analysis/ExportAnalysisButton';
import 'leaflet/dist/leaflet.css';

const riskColors = {
  LOW: '#38A169',
  MEDIUM: '#D69E2E',
  HIGH: '#DD6B20',
  CRITICAL: '#E53E3E',
};

export const OverlayMapPage = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<OverlayAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentsApi.getAll();
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถโหลดข้อมูลเหตุการณ์ได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedIds.length < 2) {
      toast({
        title: 'กรุณาเลือกเหตุการณ์',
        description: 'ต้องเลือกอย่างน้อย 2 เหตุการณ์เพื่อวิเคราะห์',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setAnalyzing(true);
      const result = await analysisApi.analyzeOverlay({ incidentIds: selectedIds });
      setAnalysisResult(result);
      toast({
        title: 'วิเคราะห์สำเร็จ',
        description: `พบพื้นที่ซ้ำซาก ${result.overlappingAreas.length} พื้นที่`,
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Error analyzing:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถวิเคราะห์ข้อมูลได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setAnalysisResult(null);
  };

  const center: LatLngExpression = [19.9167, 99.2333]; // ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่

  if (loading) {
    return (
      <Box p={6} display="flex" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading mb={6}>วิเคราะห์ภัยซ้ำซาก (Overlay Map)</Heading>

      <HStack spacing={6} align="start">
        {/* Sidebar */}
        <VStack
          w="300px"
          bg="white"
          p={4}
          borderRadius="lg"
          shadow="sm"
          align="stretch"
          maxH="calc(100vh - 200px)"
          overflowY="auto"
        >
          <Text fontWeight="bold" mb={2}>
            เลือกเหตุการณ์ ({selectedIds.length} รายการ)
          </Text>

          <CheckboxGroup value={selectedIds} onChange={(values) => setSelectedIds(values as string[])}>
            <Stack spacing={2}>
              {incidents.map((incident) => (
                <Checkbox key={incident.id} value={incident.id}>
                  <Text fontSize="sm">{incident.title}</Text>
                  <Badge ml={2} colorScheme={incident.priority === 'CRITICAL' ? 'red' : 'orange'} fontSize="xs">
                    {incident.priority}
                  </Badge>
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>

          <Divider my={4} />

          <Button colorScheme="blue" onClick={handleAnalyze} isLoading={analyzing} isDisabled={selectedIds.length < 2}>
            วิเคราะห์
          </Button>

          <Button variant="outline" onClick={handleReset}>
            รีเซ็ต
          </Button>

          {analysisResult && (
            <ExportAnalysisButton analysisResult={analysisResult} />
          )}

          {analysisResult && (
            <>
              <Divider my={4} />
              <VStack align="stretch" spacing={2}>
                <Text fontWeight="bold">ผลการวิเคราะห์</Text>
                <Text fontSize="sm">
                  จำนวนเหตุการณ์: {analysisResult.totalIncidents}
                </Text>
                <Text fontSize="sm">
                  พื้นที่ซ้ำซาก: {analysisResult.overlappingAreas.length} พื้นที่
                </Text>
                <Text fontSize="sm">
                  ระดับความเสี่ยง:{' '}
                  <Badge colorScheme={analysisResult.riskScore > 70 ? 'red' : analysisResult.riskScore > 50 ? 'orange' : 'green'}>
                    {analysisResult.riskScore}/100
                  </Badge>
                </Text>

                <Divider my={2} />
                <Text fontWeight="bold" fontSize="sm">
                  คำแนะนำ:
                </Text>
                {analysisResult.recommendations.map((rec, index) => (
                  <Text key={index} fontSize="xs" color="gray.600">
                    • {rec}
                  </Text>
                ))}
              </VStack>
            </>
          )}
        </VStack>

        {/* Map */}
        <Box flex={1} h="calc(100vh - 200px)" borderRadius="lg" overflow="hidden" shadow="sm">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Draw overlapping areas */}
            {analysisResult?.overlappingAreas.map((area, index) => (
              <Polygon
                key={index}
                positions={area.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngExpression)}
                pathOptions={{
                  color: riskColors[area.riskLevel],
                  fillColor: riskColors[area.riskLevel],
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              >
                <Popup>
                  <div>
                    <strong>พื้นที่ซ้ำซาก</strong>
                    <br />
                    จำนวนเหตุการณ์: {area.incidentCount}
                    <br />
                    พื้นที่: {area.area.toFixed(2)} ตร.กม.
                    <br />
                    ระดับความเสี่ยง:{' '}
                    <Badge colorScheme={riskColors[area.riskLevel] === '#E53E3E' ? 'red' : 'orange'}>
                      {area.riskLevel}
                    </Badge>
                  </div>
                </Popup>
              </Polygon>
            ))}
          </MapContainer>
        </Box>
      </HStack>
    </Box>
  );
};
