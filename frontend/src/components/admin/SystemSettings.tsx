import React, { useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Button,
  Heading,
  Divider,
  useToast,
  SimpleGrid,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FiSave, FiRefreshCw } from 'react-icons/fi';

interface SystemSettingsForm {
  mapConfig?: {
    centerLat?: number;
    centerLng?: number;
    defaultZoom?: number;
  };
  geminiAiEnabled?: boolean;
  notificationsEnabled?: boolean;
  broadcastEnabled?: boolean;
  geminiApiKey?: string;
  systemName?: string;
  systemLogo?: string;
  sessionTimeout?: number;
  maxUploadSize?: number;
}

const SystemSettings: React.FC = () => {
  const { register, handleSubmit, reset, watch } = useForm<SystemSettingsForm>();
  const toast = useToast();
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data } = await axios.get('/api/admin/settings');
      return data;
    },
  });

  // Load settings into form
  useEffect(() => {
    if (settings) {
      reset({
        mapConfig: settings.mapConfig || {},
        geminiAiEnabled: settings.geminiAiEnabled || false,
        notificationsEnabled: settings.notificationsEnabled || false,
        broadcastEnabled: settings.broadcastEnabled || false,
        geminiApiKey: settings.geminiApiKey || '',
        systemName: settings.systemName || '',
        systemLogo: settings.systemLogo || '',
        sessionTimeout: settings.sessionTimeout || 60,
        maxUploadSize: settings.maxUploadSize || 10,
      });
    }
  }, [settings, reset]);

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: (data: SystemSettingsForm) =>
      axios.patch('/api/admin/settings', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast({
        title: 'สำเร็จ',
        description: 'บันทึกการตั้งค่าสำเร็จ',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถบันทึกการตั้งค่าได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  // Reset to default mutation
  const resetMutation = useMutation({
    mutationFn: () => axios.post('/api/admin/settings/reset'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast({
        title: 'สำเร็จ',
        description: 'รีเซ็ตการตั้งค่าเป็นค่าเริ่มต้นสำเร็จ',
        status: 'success',
        duration: 3000,
      });
    },
    onError: () => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถรีเซ็ตการตั้งค่าได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const onSubmit = (data: SystemSettingsForm) => {
    updateMutation.mutate(data);
  };

  const handleReset = () => {
    if (confirm('คุณต้องการรีเซ็ตการตั้งค่าเป็นค่าเริ่มต้นหรือไม่?')) {
      resetMutation.mutate();
    }
  };

  if (isLoading) {
    return <Text>กำลังโหลด...</Text>;
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={8} align="stretch">
          {/* System Info */}
          <Box>
            <Heading size="md" mb={4}>
              ข้อมูลระบบ
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>ชื่อระบบ</FormLabel>
                <Input
                  {...register('systemName')}
                  placeholder="Guardian Route"
                />
              </FormControl>

              <FormControl>
                <FormLabel>โลโก้ระบบ (URL)</FormLabel>
                <Input
                  {...register('systemLogo')}
                  placeholder="https://example.com/logo.png"
                />
              </FormControl>
            </VStack>
          </Box>

          <Divider />

          {/* Map Configuration */}
          <Box>
            <Heading size="md" mb={4}>
              การตั้งค่าแผนที่
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
              <FormControl>
                <FormLabel>ละติจูดกลาง</FormLabel>
                <Input
                  type="number"
                  step="0.000001"
                  {...register('mapConfig.centerLat')}
                  placeholder="18.7883"
                />
              </FormControl>

              <FormControl>
                <FormLabel>ลองจิจูดกลาง</FormLabel>
                <Input
                  type="number"
                  step="0.000001"
                  {...register('mapConfig.centerLng')}
                  placeholder="98.9853"
                />
              </FormControl>

              <FormControl>
                <FormLabel>ระดับซูมเริ่มต้น</FormLabel>
                <Input
                  type="number"
                  {...register('mapConfig.defaultZoom')}
                  placeholder="13"
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Feature Toggles */}
          <Box>
            <Heading size="md" mb={4}>
              เปิด/ปิดฟีเจอร์
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0} flex={1}>
                  เปิดใช้งาน Gemini AI
                </FormLabel>
                <Switch {...register('geminiAiEnabled')} colorScheme="blue" />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0} flex={1}>
                  เปิดใช้งานการแจ้งเตือน
                </FormLabel>
                <Switch {...register('notificationsEnabled')} colorScheme="blue" />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb={0} flex={1}>
                  เปิดใช้งานการแจ้งเตือนแบบ Broadcast
                </FormLabel>
                <Switch {...register('broadcastEnabled')} colorScheme="blue" />
              </FormControl>
            </VStack>
          </Box>

          <Divider />

          {/* API Configuration */}
          <Box>
            <Heading size="md" mb={4}>
              การตั้งค่า API
            </Heading>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Gemini API Key</FormLabel>
                <Input
                  type="password"
                  {...register('geminiApiKey')}
                  placeholder="AIza..."
                />
                <Text fontSize="sm" color="gray.500" mt={1}>
                  API Key สำหรับ Google Gemini AI
                </Text>
              </FormControl>
            </VStack>
          </Box>

          <Divider />

          {/* Other Settings */}
          <Box>
            <Heading size="md" mb={4}>
              การตั้งค่าอื่นๆ
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                <FormLabel>Session Timeout (นาที)</FormLabel>
                <Input
                  type="number"
                  {...register('sessionTimeout')}
                  placeholder="60"
                />
              </FormControl>

              <FormControl>
                <FormLabel>ขนาดไฟล์อัพโหลดสูงสุด (MB)</FormLabel>
                <Input
                  type="number"
                  {...register('maxUploadSize')}
                  placeholder="10"
                />
              </FormControl>
            </SimpleGrid>
          </Box>

          <Divider />

          {/* Actions */}
          <HStack justify="space-between">
            <Button
              leftIcon={<FiRefreshCw />}
              variant="outline"
              colorScheme="orange"
              onClick={handleReset}
              isLoading={resetMutation.isPending}
            >
              รีเซ็ตเป็นค่าเริ่มต้น
            </Button>

            <Button
              leftIcon={<FiSave />}
              colorScheme="blue"
              type="submit"
              isLoading={updateMutation.isPending}
            >
              บันทึกการตั้งค่า
            </Button>
          </HStack>

          {/* Warning */}
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>คำเตือน</AlertTitle>
              <AlertDescription fontSize="sm">
                การเปลี่ยนแปลงการตั้งค่าบางอย่างอาจต้องรีสตาร์ทระบบเพื่อให้มีผลทันที
              </AlertDescription>
            </Box>
          </Alert>
        </VStack>
      </form>
    </Box>
  );
};

export default SystemSettings;
