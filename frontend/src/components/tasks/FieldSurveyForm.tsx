import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  HStack,
  Text,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { DrawingMap } from '../maps/DrawingMap';

interface FieldSurveyFormProps {
  taskId: string;
  incidentTitle: string;
  onSubmit: (data: FieldSurveyData) => Promise<void>;
  onCancel: () => void;
}

export interface FieldSurveyData {
  surveyLocation?: {
    type: 'Point';
    coordinates: [number, number];
  };
  surveyArea?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  surveyNotes: string;
  surveyPhotos?: string[];
}

export const FieldSurveyForm = ({
  taskId,
  incidentTitle,
  onSubmit,
  onCancel,
}: FieldSurveyFormProps) => {
  const [surveyNotes, setSurveyNotes] = useState('');
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][][] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleMarkerSet = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
  };

  const handlePolygonComplete = (coordinates: number[][][]) => {
    setPolygonCoordinates(coordinates);
  };

  const handleSubmit = async () => {
    // Validation
    if (!markerPosition && !polygonCoordinates) {
      toast({
        title: 'ข้อมูลไม่ครบถ้วน',
        description: 'กรุณาปักหมุดหรือวาดพื้นที่บนแผนที่',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!surveyNotes.trim()) {
      toast({
        title: 'ข้อมูลไม่ครบถ้วน',
        description: 'กรุณากรอกรายละเอียดการสำรวจ',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data: FieldSurveyData = {
        surveyNotes: surveyNotes.trim(),
      };

      if (markerPosition) {
        data.surveyLocation = {
          type: 'Point',
          coordinates: [markerPosition[1], markerPosition[0]], // [lng, lat]
        };
      }

      if (polygonCoordinates) {
        data.surveyArea = {
          type: 'Polygon',
          coordinates: polygonCoordinates,
        };
      }

      await onSubmit(data);

      toast({
        title: 'บันทึกข้อมูลสำเร็จ',
        description: 'ข้อมูลการสำรวจถูกบันทึกแล้ว',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.message || 'ไม่สามารถบันทึกข้อมูลได้',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Heading size="md">บันทึกข้อมูลภาคสนาม</Heading>
            <Badge colorScheme="blue" fontSize="md">
              {incidentTitle}
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* Map Section */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                1. ระบุตำแหน่งและพื้นที่
              </Text>
              <Alert status="info" mb={3}>
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  ใช้ปุ่ม "ปักหมุด" เพื่อระบุตำแหน่งเหตุการณ์ หรือ "วาดพื้นที่"
                  เพื่อกำหนดขอบเขตพื้นที่ที่ได้รับผลกระทบ
                </AlertDescription>
              </Alert>

              <DrawingMap
                height="400px"
                onMarkerSet={handleMarkerSet}
                onPolygonComplete={handlePolygonComplete}
                initialMarker={markerPosition || undefined}
                initialPolygon={polygonCoordinates || undefined}
              />

              {/* Summary */}
              <HStack mt={3} spacing={4}>
                {markerPosition && (
                  <Badge colorScheme="blue">
                    📍 ตำแหน่ง: {markerPosition[0].toFixed(6)}, {markerPosition[1].toFixed(6)}
                  </Badge>
                )}
                {polygonCoordinates && (
                  <Badge colorScheme="green">
                    ✏️ พื้นที่: {polygonCoordinates[0].length - 1} จุด
                  </Badge>
                )}
              </HStack>
            </Box>

            <Divider />

            {/* Notes Section */}
            <Box>
              <FormControl isRequired>
                <FormLabel fontWeight="bold">2. รายละเอียดการสำรวจ</FormLabel>
                <Textarea
                  value={surveyNotes}
                  onChange={(e) => setSurveyNotes(e.target.value)}
                  placeholder="กรอกรายละเอียดการสำรวจ เช่น ลักษณะความเสียหาย, ขอบเขตพื้นที่, จำนวนผู้ได้รับผลกระทบ, สิ่งที่พบเห็น ฯลฯ"
                  rows={6}
                  resize="vertical"
                />
                <Text fontSize="sm" color="gray.600" mt={1}>
                  {surveyNotes.length} ตัวอักษร
                </Text>
              </FormControl>
            </Box>

            <Divider />

            {/* Photo Upload Section (Future) */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                3. รูปภาพประกอบ (เร็วๆ นี้)
              </Text>
              <Alert status="info">
                <AlertIcon />
                <AlertDescription fontSize="sm">
                  ฟีเจอร์อัปโหลดรูปภาพจะพร้อมใช้งานในเร็วๆ นี้
                </AlertDescription>
              </Alert>
            </Box>

            {/* Action Buttons */}
            <HStack justify="flex-end" pt={4}>
              <Button variant="outline" onClick={onCancel} isDisabled={isSubmitting}>
                ยกเลิก
              </Button>
              <Button
                colorScheme="green"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                loadingText="กำลังบันทึก..."
              >
                บันทึกข้อมูล
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};
