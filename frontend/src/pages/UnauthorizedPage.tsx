import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiShield, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * Unauthorized Page
 * 
 * Shown when user tries to access a resource they don't have permission for
 */
const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const iconColor = useColorModeValue('red.500', 'red.300');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <Container maxW="container.md">
        <Box
          bg={cardBg}
          borderRadius="lg"
          p={12}
          textAlign="center"
          boxShadow="xl"
        >
          <VStack spacing={6}>
            {/* Icon */}
            <Icon as={FiShield} boxSize={24} color={iconColor} />

            {/* Status Code */}
            <Heading size="3xl" color={iconColor}>
              403
            </Heading>

            {/* Title */}
            <Heading size="xl">ไม่มีสิทธิ์เข้าถึง</Heading>

            {/* Description */}
            <Text fontSize="lg" color="gray.600" maxW="md">
              ขออภัย คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด
            </Text>

            {/* User Info */}
            {user && (
              <Box
                p={4}
                bg={useColorModeValue('gray.100', 'gray.700')}
                borderRadius="md"
                w="full"
                maxW="md"
              >
                <VStack spacing={2} align="start">
                  <Text fontSize="sm" fontWeight="bold">
                    ข้อมูลผู้ใช้:
                  </Text>
                  <Text fontSize="sm">
                    <strong>ชื่อ:</strong> {user.fullName || user.email}
                  </Text>
                  <Text fontSize="sm">
                    <strong>บทบาท:</strong> {user.role}
                  </Text>
                </VStack>
              </Box>
            )}

            {/* Actions */}
            <VStack spacing={3} w="full" maxW="sm">
              <Button
                leftIcon={<FiArrowLeft />}
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={handleGoBack}
              >
                กลับหน้าก่อนหน้า
              </Button>
              
              <Button
                variant="outline"
                colorScheme="blue"
                size="lg"
                w="full"
                onClick={handleGoHome}
              >
                กลับหน้าหลัก
              </Button>
            </VStack>

            {/* Help Text */}
            <Text fontSize="sm" color="gray.500" mt={4}>
              หากคุณต้องการสิทธิ์เพิ่มเติม กรุณาติดต่อผู้ดูแลระบบ
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default UnauthorizedPage;
