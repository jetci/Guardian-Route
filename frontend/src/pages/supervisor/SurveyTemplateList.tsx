import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Button,
  useToast,
  HStack,
  Text,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, CheckCircleIcon, CloseIcon } from '@chakra-ui/icons';
import { apiClient } from "../../api/client";
import type { SurveyTemplate } from '../../types/survey';

const SurveyTemplateList: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get<SurveyTemplate[]>('/survey-templates');
      setTemplates(response.data);
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถดึงข้อมูลเทมเพลตแบบสำรวจได้',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleDelete = async () => {
    if (!templateToDelete) return;

    try {
      await apiClient.delete(`/survey-templates/${templateToDelete}`);
      toast({
        title: 'สำเร็จ',
        description: 'ลบเทมเพลตแบบสำรวจเรียบร้อยแล้ว',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchTemplates();
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถลบเทมเพลตแบบสำรวจได้',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
      setTemplateToDelete(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setTemplateToDelete(id);
    onOpen();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="xl" color="blue.600" thickness="4px" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <Box maxW="6xl" mx="auto" px={{ base: 4, sm: 6, lg: 8 }}>
        <HStack justify="space-between" mb={8}>
          <Heading size="xl" color="gray.900" fontWeight="extrabold">
            เทมเพลตแบบสำรวจ
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={() => navigate('/supervisor/survey-templates/new')}
            size="lg"
            borderRadius="xl"
            className="shadow-md"
          >
            สร้างเทมเพลตใหม่
          </Button>
        </HStack>

        <Box bg="white" p={8} borderRadius="xl" shadow="lg" border="1px" borderColor="gray.200">
          {templates.length === 0 ? (
            <Text textAlign="center" py={10} color="gray.500" fontSize="lg">
              ไม่พบเทมเพลตแบบสำรวจ คลิก "สร้างเทมเพลตใหม่" เพื่อเริ่มต้น
            </Text>
          ) : (
            <Table variant="simple" size="md">
              <Thead>
                <Tr bg="gray.50">
                  <Th color="gray.600" fontSize="sm" textTransform="uppercase">ชื่อ</Th>
                  <Th color="gray.600" fontSize="sm" textTransform="uppercase">คำอธิบาย</Th>
                  <Th isNumeric color="gray.600" fontSize="sm" textTransform="uppercase">จำนวนฟิลด์</Th>
                  <Th color="gray.600" fontSize="sm" textTransform="uppercase">สถานะ</Th>
                  <Th color="gray.600" fontSize="sm" textTransform="uppercase">การดำเนินการ</Th>
                </Tr>
              </Thead>
              <Tbody>
                {templates.map((template: any) => (
                  <Tr key={template.id} _hover={{ bg: 'gray.50' }} transition="background-color 0.2s">
                    <Td fontWeight="bold" color="gray.800">{template.name}</Td>
                    <Td color="gray.600">{template.description || '-'}</Td>
                    <Td isNumeric color="gray.600">{(template.fields as any[]).length}</Td>
                    <Td>
                      <HStack spacing={2}>
                        {template.isActive ? (
                          <CheckCircleIcon color="green.500" />
                        ) : (
                          <CloseIcon color="red.500" />
                        )}
                        <Text color={template.isActive ? 'green.600' : 'red.600'} fontWeight="medium">
                          {template.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit"
                          icon={<EditIcon />}
                          size="md"
                          colorScheme="blue"
                          variant="outline"
                          borderRadius="lg"
                          onClick={() => navigate(`/supervisor/survey-templates/edit/${template.id}`)}
                        />
                        <IconButton
                          aria-label="Delete"
                          icon={<DeleteIcon />}
                          size="md"
                          colorScheme="red"
                          variant="outline"
                          borderRadius="lg"
                          onClick={() => openDeleteModal(template.id)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent borderRadius="xl" shadow="2xl">
              <AlertDialogHeader fontSize="xl" fontWeight="bold" color="red.600">
                ลบเทมเพลตแบบสำรวจ
              </AlertDialogHeader>

              <AlertDialogBody color="gray.700">
                คุณแน่ใจหรือไม่ว่าต้องการลบเทมเพลตแบบสำรวจนี้ การดำเนินการนี้ไม่สามารถยกเลิกได้
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose} size="lg" borderRadius="lg">
                  ยกเลิก
                </Button>
                <Button colorScheme="red" onClick={handleDelete} ml={3} size="lg" borderRadius="lg">
                  ลบ
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Box>
    </div>
  );
};

export default SurveyTemplateList;
