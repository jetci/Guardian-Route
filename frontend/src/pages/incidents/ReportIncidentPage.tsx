import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Button,
  useToast,
  FormErrorMessage,
  HStack,
  Text,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { DrawingMap } from '../../components/maps/DrawingMap';
import { PhotoUpload } from '../../components/incidents/PhotoUpload';
import { incidentsApi } from '../../api/incidents';
import type { CreateIncidentDto } from '../../types';

interface Village {
  id: string;
  name: string;
  nameEn: string;
}

export const ReportIncidentPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [villages, setVillages] = useState<Village[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    disasterType: '',
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    villageId: '',
    estimatedAffectedHouseholds: '',
    estimatedAffectedPopulation: '',
  });

  // Map state
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const [polygonCoordinates, setPolygonCoordinates] = useState<[number, number][]>([]);

  // Photos state
  const [photos, setPhotos] = useState<any[]>([]);

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load villages
  useEffect(() => {
    // TODO: Load from API
    // For now, use mock data
    setVillages([
      { id: '1', name: 'หมู่ 1 บ้านเวียง', nameEn: 'Ban Wiang' },
      { id: '2', name: 'หมู่ 2 บ้านสันทราย', nameEn: 'Ban San Sai' },
      { id: '3', name: 'หมู่ 3 บ้านดอนชัย', nameEn: 'Ban Don Chai' },
    ]);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.disasterType) {
      newErrors.disasterType = 'กรุณาเลือกประเภทภัย';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'กรุณากรอกหัวข้อ';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'กรุณากรอกรายละเอียด';
    }
    if (!formData.villageId) {
      newErrors.villageId = 'กรุณาเลือกหมู่บ้าน';
    }
    if (!markerPosition) {
      newErrors.location = 'กรุณาปักหมุดตำแหน่งบนแผนที่';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const data: CreateIncidentDto = {
        disasterType: formData.disasterType,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        villageId: formData.villageId,
        location: {
          lat: markerPosition![0],
          lng: markerPosition![1],
        },
      };

      // Add affected area if polygon is drawn
      if (polygonCoordinates.length > 0) {
        data.affectedArea = {
          type: 'Polygon',
          coordinates: [[...polygonCoordinates.map((coord) => [coord[1], coord[0]]), [polygonCoordinates[0][1], polygonCoordinates[0][0]]]],
        };
      }

      // Add estimates if provided
      if (formData.estimatedAffectedHouseholds) {
        data.estimatedAffectedHouseholds = parseInt(formData.estimatedAffectedHouseholds, 10);
      }
      if (formData.estimatedAffectedPopulation) {
        data.estimatedAffectedPopulation = parseInt(formData.estimatedAffectedPopulation, 10);
      }

      await incidentsApi.create(data);

      toast({
        title: 'รายงานเหตุการณ์สำเร็จ',
        description: 'ระบบได้บันทึกข้อมูลเรียบร้อยแล้ว',
        status: 'success',
        duration: 3000,
      });

      navigate('/incidents/my');
    } catch (error: any) {
      console.error('Error creating incident:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Heading size="lg">รายงานเหตุการณ์ภัย</Heading>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            {/* Disaster Type */}
            <FormControl isRequired isInvalid={!!errors.disasterType}>
              <FormLabel>ประเภทภัย</FormLabel>
              <Select
                name="disasterType"
                value={formData.disasterType}
                onChange={handleInputChange}
                placeholder="เลือกประเภทภัย"
              >
                <option value="FLOOD">น้ำท่วม</option>
                <option value="LANDSLIDE">ดินถล่ม</option>
                <option value="FIRE">ไฟไหม้</option>
                <option value="DROUGHT">ภัยแล้ง</option>
                <option value="STORM">พายุ</option>
                <option value="EARTHQUAKE">แผ่นดินไหว</option>
                <option value="OTHER">อื่นๆ</option>
              </Select>
              <FormErrorMessage>{errors.disasterType}</FormErrorMessage>
            </FormControl>

            {/* Title */}
            <FormControl isRequired isInvalid={!!errors.title}>
              <FormLabel>หัวข้อ</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="เช่น น้ำท่วมบริเวณถนนสายหลัก"
              />
              <FormErrorMessage>{errors.title}</FormErrorMessage>
            </FormControl>

            {/* Description */}
            <FormControl isRequired isInvalid={!!errors.description}>
              <FormLabel>รายละเอียด</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="อธิบายสถานการณ์และความเสียหายเบื้องต้น"
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            {/* Priority and Village */}
            <HStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ระดับความรุนแรง</FormLabel>
                <Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                >
                  <option value="LOW">ต่ำ</option>
                  <option value="MEDIUM">ปานกลาง</option>
                  <option value="HIGH">สูง</option>
                  <option value="CRITICAL">วิกฤติ</option>
                </Select>
              </FormControl>

              <FormControl isRequired isInvalid={!!errors.villageId}>
                <FormLabel>หมู่บ้าน</FormLabel>
                <Select
                  name="villageId"
                  value={formData.villageId}
                  onChange={handleInputChange}
                  placeholder="เลือกหมู่บ้าน"
                >
                  {villages.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>{errors.villageId}</FormErrorMessage>
              </FormControl>
            </HStack>

            {/* Estimates */}
            <HStack spacing={4}>
              <FormControl>
                <FormLabel>จำนวนครัวเรือนที่ได้รับผลกระทบ (ประมาณการ)</FormLabel>
                <Input
                  type="number"
                  name="estimatedAffectedHouseholds"
                  value={formData.estimatedAffectedHouseholds}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </FormControl>

              <FormControl>
                <FormLabel>จำนวนประชากรที่ได้รับผลกระทบ (ประมาณการ)</FormLabel>
                <Input
                  type="number"
                  name="estimatedAffectedPopulation"
                  value={formData.estimatedAffectedPopulation}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </FormControl>
            </HStack>

            {/* Map */}
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      ตำแหน่งและพื้นที่ภัย <Text as="span" color="red.500">*</Text>
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      • ปักหมุดเพื่อระบุตำแหน่งเหตุการณ์
                      <br />
                      • วาดพื้นที่เพื่อระบุขอบเขตพื้นที่ที่ได้รับผลกระทบ (ถ้ามี)
                    </Text>
                    {errors.location && (
                      <Text color="red.500" fontSize="sm" mb={2}>
                        {errors.location}
                      </Text>
                    )}
                  </Box>

                  <DrawingMap
                    center={[19.9167, 99.2333]}
                    zoom={13}
                    onMarkerSet={setMarkerPosition}
                    onPolygonComplete={setPolygonCoordinates}
                  />
                </VStack>
              </CardBody>
            </Card>

            {/* Photos */}
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontWeight="bold" mb={2}>
                      รูปภาพประกอบ (ถ้ามี)
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      อัปโหลดรูปภาพประกอบเหตุการณ์ (สูงสุด 10 รูป, ขนาดไม่เกิน 5MB ต่อรูป)
                    </Text>
                  </Box>

                  <PhotoUpload
                    photos={photos}
                    onPhotoUploaded={(photo) => setPhotos([...photos, photo])}
                    onPhotoDeleted={(photoId) => setPhotos(photos.filter(p => p.id !== photoId))}
                    maxPhotos={10}
                  />
                </VStack>
              </CardBody>
            </Card>

            {/* Submit Button */}
            <HStack justify="flex-end" spacing={4}>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                isDisabled={isSubmitting}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="กำลังบันทึก..."
              >
                บันทึกรายงาน
              </Button>
            </HStack>
          </VStack>
        </form>
      </VStack>
    </Container>
  );
};
