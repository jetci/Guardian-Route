import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
  Alert,
  AlertIcon,
  AlertDescription,
  Grid,
  GridItem,
  FormHelperText,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { authApi } from '../../api/auth';
import { useAuthStore } from '../../stores/authStore';
import type { RegisterData } from '../../types';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: keyof RegisterData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (formData.password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return false;
    }

    if (formData.password !== confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register(formData);
      setAuth(response.user, response.accessToken, response.refreshToken);

      toast({
        title: 'ลงทะเบียนสำเร็จ',
        description: `ยินดีต้อนรับ ${response.user.firstName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to field officer page (default role)
      navigate('/field-officer');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'ลงทะเบียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      toast({
        title: 'ลงทะเบียนไม่สำเร็จ',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="2xl" py={10}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" mb={2}>
                ลงทะเบียนผู้ใช้งานใหม่
              </Heading>
              <Text color="gray.600">Guardian Route</Text>
              <Text color="gray.600" fontSize="sm">
                ระบบบริหารจัดการภัยพิบัติ ตำบลเวียง
              </Text>
            </Box>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>ชื่อ</FormLabel>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="ชื่อ"
                      />
                    </FormControl>
                  </GridItem>

                  <GridItem>
                    <FormControl isRequired>
                      <FormLabel>นามสกุล</FormLabel>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="นามสกุล"
                      />
                    </FormControl>
                  </GridItem>
                </Grid>

                <FormControl isRequired>
                  <FormLabel>อีเมล</FormLabel>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="example@obtwiang.go.th"
                    autoComplete="email"
                  />
                  <FormHelperText>ใช้อีเมลของหน่วยงาน</FormHelperText>
                </FormControl>

                <FormControl>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="081-234-5678"
                    autoComplete="tel"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>รหัสผ่าน</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
                        icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText>รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร</FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={
                          showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'
                        }
                        icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="ghost"
                        size="sm"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                  loadingText="กำลังลงทะเบียน..."
                  mt={4}
                >
                  ลงทะเบียน
                </Button>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                  มีบัญชีอยู่แล้ว?{' '}
                  <Link to="/login" style={{ color: '#3182ce', fontWeight: 'bold' }}>
                    เข้าสู่ระบบ
                  </Link>
                </Text>
              </VStack>
            </form>

            <Box pt={4} borderTop="1px" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500" textAlign="center">
                บัญชีที่ลงทะเบียนใหม่จะได้รับสิทธิ์เป็น <strong>เจ้าหน้าที่ภาคสนาม</strong>{' '}
                โดยอัตโนมัติ
              </Text>
              <Text fontSize="xs" color="gray.500" textAlign="center" mt={1}>
                หากต้องการสิทธิ์อื่น กรุณาติดต่อผู้ดูแลระบบ
              </Text>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
