import { Box, Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { WarningIcon } from '@chakra-ui/icons';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="md" py={20}>
      <VStack spacing={6} textAlign="center">
        <WarningIcon boxSize={20} color="red.500" />
        <Heading size="xl">ไม่มีสิทธิ์เข้าถึง</Heading>
        <Text color="gray.600" fontSize="lg">
          คุณไม่มีสิทธิ์ในการเข้าถึงหน้านี้
        </Text>
        <Text color="gray.500">
          กรุณาติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด
        </Text>
        <Box pt={4}>
          <Button colorScheme="blue" onClick={() => navigate(-1)} mr={3}>
            ย้อนกลับ
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            กลับหน้าหลัก
          </Button>
        </Box>
      </VStack>
    </Container>
  );
};
