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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login({ email, password });
      setAuth(response.user, response.accessToken, response.refreshToken);

      toast({
        title: 'เข้าสู่ระบบสำเร็จ',
        description: `ยินดีต้อนรับ ${response.user.firstName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect based on role
      switch (response.user.role) {
        case 'ADMIN':
          navigate('/admin');
          break;
        case 'EXECUTIVE':
          navigate('/executive');
          break;
        case 'SUPERVISOR':
          navigate('/supervisor');
          break;
        case 'FIELD_OFFICER':
          navigate('/field-officer');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
      setError(errorMessage);
      toast({
        title: 'เข้าสู่ระบบไม่สำเร็จ',
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
    <Container maxW="md" py={20}>
      <Card>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <Box textAlign="center">
              <Heading size="lg" mb={2}>
                Guardian Route
              </Heading>
              <Text color="gray.600">ระบบบริหารจัดการภัยพิบัติ</Text>
              <Text color="gray.600" fontSize="sm">
                ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่
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
                <FormControl isRequired>
                  <FormLabel>อีเมล</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@obtwiang.go.th"
                    autoComplete="email"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>รหัสผ่าน</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
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
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="full"
                  isLoading={isLoading}
                  loadingText="กำลังเข้าสู่ระบบ..."
                >
                  เข้าสู่ระบบ
                </Button>

                <Text fontSize="sm" color="gray.600" textAlign="center">
                  ยังไม่มีบัญชี?{' '}
                  <Link to="/register" style={{ color: '#3182ce', fontWeight: 'bold' }}>
                    ลงทะเบียน
                  </Link>
                </Text>
              </VStack>
            </form>

            <Box pt={4} borderTop="1px" borderColor="gray.200">
              <Text fontSize="xs" color="gray.500" textAlign="center" mb={2}>
                บัญชีทดสอบ (Test Accounts):
              </Text>
              <VStack spacing={1} fontSize="xs" color="gray.600">
                <Text>Admin: admin@obtwiang.go.th</Text>
                <Text>Executive: executive@obtwiang.go.th</Text>
                <Text>Supervisor: supervisor@obtwiang.go.th</Text>
                <Text>Field Officer: field@obtwiang.go.th</Text>
                <Text fontWeight="bold">Password: password123</Text>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  );
};
