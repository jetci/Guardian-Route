import { useState, useEffect } from 'react';
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
  Select,
  FormErrorMessage,
} from '@chakra-ui/react';
import { DrawingMap } from '../maps/DrawingMap';
import { villagesApi } from '../../api/villages';
import type { Village } from '../../types';

interface FieldSurveyFormEnhancedProps {
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
  disasterType: string;
  villageId: string;
  surveyNotes: string;
  surveyPhotos?: string[];
}

const DISASTER_TYPES = [
  { value: 'FLOOD', label: 'น้ำท่วม' },
  { value: 'LANDSLIDE', label: 'ดินถล่ม' },
  { value: 'FIRE', label: 'ไฟไหม้' },
  { value: 'STORM', label: 'พายุ' },
  { value: 'EARTHQUAKE', label: 'แผ่นดินไหว' },
  { value: 'OTHER', label: 'อื่นๆ' },
];

export const FieldSurveyFormEnhanced = ({
  taskId,
  incidentTitle,
  onSubmit,
  onCancel,
}: FieldSurveyFormEnhancedProps) => {
  // Form state
  const [disasterType, setDisasterType] = useState('');
  const [villageId, setVillageId] = useState('');
  const [surveyNotes, setSurveyNotes] = useState('');
  
  // Map state
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [polygonCoordinates, setPolygonCoordinates] = useState<number[][][] | null>(null);
  
  // Villages data
  const [villages, setVillages] = useState<Village[]>([]);
  const [isLoadingVillages, setIsLoadingVillages] = useState(true);
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const toast = useToast();

  // Load villages on mount
  useEffect(() => {
    const loadVillages = async () => {
      try {
        const data = await villagesApi.getAll();
        setVillages(data);
      } catch (error: any) {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไม่สามารถโหลดรายการหมู่บ้านได้',
          status: 'error',
          duration: 5000,
        });
      } finally {
        setIsLoadingVillages(false);
      }
    };

    loadVillages();
  }, [toast]);

  const handleMarkerSet = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng]);
  };

  const handlePolygonComplete = (coordinates: number[][][]) => {
    setPolygonCoordinates(coordinates);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!disasterType) {
      newErrors.disasterType = 'กรุณาเลือกประเภทภัย';
    }

    if (!villageId) {
      newErrors.villageId = 'กรุณาเลือกหมู่บ้าน';
    }

    if (!surveyNotes.trim()) {
      newErrors.surveyNotes = 'กรุณากรอกรายละเอียดการสำรวจ';
    }

    if (!markerPosition && !polygonCoordinates) {
      newErrors.map = 'กรุณาปักหมุดหรือวาดพื้นที่บนแผนที่';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) {
      toast({
        title: 'ข้อมูลไม่ครบถ้วน',
        description: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data: FieldSurveyData = {
        disasterType,
        villageId,
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
        description: 'ข้อมูลการสำรวจถูกบันทึกแล้ว งานเปลี่ยนสถานะเป็น "สำรวจแล้ว"',
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
            {/* Section 1: Map */}
            <Box>
              <Text fontWeight="bold" mb={2} fontSize="lg">
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

              {/* Map Summary */}
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

              {errors.map && (
                <Text color="red.500" fontSize="sm" mt={2}>
                  {errors.map}
                </Text>
              )}
            </Box>

            <Divider />

            {/* Section 2: Form Fields */}
            <Box>
              <Text fontWeight="bold" mb={4} fontSize="lg">
                2. ข้อมูลเบื้องต้น
              </Text>

              <VStack spacing={4} align="stretch">
                {/* Disaster Type */}
                <FormControl isRequired isInvalid={!!errors.disasterType}>
                  <FormLabel>ประเภทภัย</FormLabel>
                  <Select
                    placeholder="เลือกประเภทภัย"
                    value={disasterType}
                    onChange={(e) => {
                      setDisasterType(e.target.value);
                      setErrors({ ...errors, disasterType: '' });
                    }}
                  >
                    {DISASTER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                  {errors.disasterType && (
                    <FormErrorMessage>{errors.disasterType}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Village */}
                <FormControl isRequired isInvalid={!!errors.villageId}>
                  <FormLabel>หมู่บ้าน</FormLabel>
                  <Select
                    placeholder={isLoadingVillages ? 'กำลังโหลด...' : 'เลือกหมู่บ้าน'}
                    value={villageId}
                    onChange={(e) => {
                      setVillageId(e.target.value);
                      setErrors({ ...errors, villageId: '' });
                    }}
                    isDisabled={isLoadingVillages}
                  >
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>
                        {village.name} (หมู่ {village.villageNo})
                      </option>
                    ))}
                  </Select>
                  {errors.villageId && (
                    <FormErrorMessage>{errors.villageId}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Survey Notes */}
                <FormControl isRequired isInvalid={!!errors.surveyNotes}>
                  <FormLabel>คำอธิบายเพิ่มเติม</FormLabel>
                  <Textarea
                    value={surveyNotes}
                    onChange={(e) => {
                      setSurveyNotes(e.target.value);
                      setErrors({ ...errors, surveyNotes: '' });
                    }}
                    placeholder="กรอกรายละเอียดการสำรวจ เช่น ลักษณะความเสียหาย, ขอบเขตพื้นที่, จำนวนผู้ได้รับผลกระทบ, สิ่งที่พบเห็น ฯลฯ"
                    rows={6}
                    resize="vertical"
                  />
                  <HStack justify="space-between" mt={1}>
                    <Text fontSize="sm" color="gray.600">
                      {surveyNotes.length} ตัวอักษร
                    </Text>
                    {errors.surveyNotes && (
                      <Text fontSize="sm" color="red.500">
                        {errors.surveyNotes}
                      </Text>
                    )}
                  </HStack>
                </FormControl>
              </VStack>
            </Box>

            <Divider />

            {/* Section 3: Photo Upload (Future) */}
            <Box>
              <Text fontWeight="bold" mb={2} fontSize="lg">
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
