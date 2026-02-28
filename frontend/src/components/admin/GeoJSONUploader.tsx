import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Divider,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiCheck } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface GeoJSONUploaderProps {
  onSuccess?: () => void;
}

const GeoJSONUploader: React.FC<GeoJSONUploaderProps> = ({ onSuccess }) => {
  const [geojsonData, setGeojsonData] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('village');
  const [mode, setMode] = useState<string>('merge');
  const [villageId, setVillageId] = useState<string>('');

  const toast = useToast();
  const queryClient = useQueryClient();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        setGeojsonData(json);
        
        // Auto-fill name from filename
        if (!name) {
          setName(file.name.replace('.geojson', '').replace('.json', ''));
        }

        toast({
          title: 'สำเร็จ',
          description: 'อ่านไฟล์ GeoJSON สำเร็จ',
          status: 'success',
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: 'ไฟล์ GeoJSON ไม่ถูกต้อง',
          status: 'error',
          duration: 3000,
        });
      }
    };
    reader.readAsText(file);
  }, [name, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json', '.geojson'],
    },
    multiple: false,
  });

  const uploadMutation = useMutation({
    mutationFn: (data: any) => axios.post('/api/admin/geojson', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'geojson'] });
      toast({
        title: 'สำเร็จ',
        description: 'อัพโหลด GeoJSON สำเร็จ',
        status: 'success',
        duration: 3000,
      });
      
      // Reset form
      setGeojsonData(null);
      setFileName('');
      setName('');
      setVillageId('');
      
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.response?.data?.message || 'ไม่สามารถอัพโหลดได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const handleUpload = () => {
    if (!geojsonData) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'กรุณาเลือกไฟล์ GeoJSON',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    if (!name) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'กรุณากรอกชื่อขอบเขต',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    uploadMutation.mutate({
      name,
      type,
      geojson: geojsonData,
      mode,
      villageId: villageId || undefined,
    });
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Drag & Drop Zone */}
      <Box
        {...getRootProps()}
        p={10}
        borderWidth={2}
        borderStyle="dashed"
        borderColor={isDragActive ? 'blue.500' : 'gray.300'}
        borderRadius="lg"
        bg={isDragActive ? 'blue.50' : 'gray.50'}
        cursor="pointer"
        textAlign="center"
        transition="all 0.2s"
        _hover={{
          borderColor: 'blue.400',
          bg: 'blue.50',
        }}
      >
        <input {...getInputProps()} />
        <VStack spacing={3}>
          <Box
            as={FiUpload}
            fontSize="4xl"
            color={isDragActive ? 'blue.500' : 'gray.400'}
          />
          <Text fontSize="lg" fontWeight="medium">
            {isDragActive
              ? 'วางไฟล์ที่นี่...'
              : 'ลากไฟล์ GeoJSON มาวางที่นี่'}
          </Text>
          <Text fontSize="sm" color="gray.500">
            หรือคลิกเพื่อเลือกไฟล์ (.json, .geojson)
          </Text>
        </VStack>
      </Box>

      {/* File Info */}
      {fileName && (
        <Alert status="success" borderRadius="md">
          <AlertIcon as={FiCheck} />
          <Box flex="1">
            <AlertTitle>ไฟล์ที่เลือก</AlertTitle>
            <AlertDescription>
              <HStack>
                <FiFile />
                <Code>{fileName}</Code>
              </HStack>
            </AlertDescription>
          </Box>
        </Alert>
      )}

      <Divider />

      {/* Upload Form */}
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>ชื่อขอบเขต</FormLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="เช่น หมู่บ้านหนองตุ้ม"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>ประเภท</FormLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="village">หมู่บ้าน</option>
            <option value="district">ตำบล</option>
            <option value="province">จังหวัด</option>
            <option value="custom">กำหนดเอง</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Village ID (ถ้ามี)</FormLabel>
          <Input
            value={villageId}
            onChange={(e) => setVillageId(e.target.value)}
            placeholder="UUID ของหมู่บ้าน"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>โหมดการอัพโหลด</FormLabel>
          <Select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="merge">เพิ่มเข้าไป (Merge)</option>
            <option value="overwrite">เขียนทับ (Overwrite)</option>
          </Select>
          <Text fontSize="sm" color="gray.500" mt={1}>
            {mode === 'merge'
              ? 'เพิ่มขอบเขตใหม่โดยไม่ลบข้อมูลเดิม'
              : 'ลบขอบเขตเดิมของหมู่บ้านนี้และเขียนทับด้วยข้อมูลใหม่'}
          </Text>
        </FormControl>
      </VStack>

      {/* Upload Button */}
      <Button
        colorScheme="blue"
        size="lg"
        leftIcon={<FiUpload />}
        onClick={handleUpload}
        isLoading={uploadMutation.isPending}
        isDisabled={!geojsonData || !name}
      >
        อัพโหลด GeoJSON
      </Button>

      {/* Info */}
      <Alert status="info" borderRadius="md">
        <AlertIcon />
        <Box fontSize="sm">
          <AlertTitle mb={1}>ข้อมูล GeoJSON ที่รองรับ</AlertTitle>
          <AlertDescription>
            รองรับ GeoJSON ทุกประเภท: Point, LineString, Polygon, MultiPoint,
            MultiLineString, MultiPolygon, Feature, FeatureCollection
          </AlertDescription>
        </Box>
      </Alert>
    </VStack>
  );
};

export default GeoJSONUploader;
