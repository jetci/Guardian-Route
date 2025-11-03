import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Heading,
  Button,
  useToast,
  VStack,
  HStack,
  Text,
  Spinner,
  Flex,
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
import { useAuthStore } from '../../stores/authStore';
import { apiClient } from "../../api/client";
import { SurveyTemplate } from '../../types/Survey';

const SurveyTemplateList: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useAuthStore();  const [templates, setTemplates] = useState<SurveyTemplate[]>([]);
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
        title: 'Error',
        description: 'Failed to fetch survey templates.',
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
        title: 'Success',
        description: 'Survey Template deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchTemplates();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete survey template.',
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
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8} maxW="6xl" mx="auto">
      <HStack justify="space-between" mb={6}>
        <Heading size="xl" color="teal.500">
          Survey Templates
        </Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="teal"
          onClick={() => navigate('/supervisor/survey-templates/new')}
        >
          Create New Template
        </Button>
      </HStack>

      <Box bg="white" p={6} borderRadius="lg" shadow="md">
        {templates.length === 0 ? (
          <Text textAlign="center" py={10} color="gray.500">
            No survey templates found. Click "Create New Template" to get started.
          </Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Description</Th>
                <Th isNumeric>Fields</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {templates.map((template) => (
                <Tr key={template.id}>
                  <Td fontWeight="bold">{template.name}</Td>
                  <Td>{template.description || '-'}</Td>
                  <Td isNumeric>{(template.fields as any[]).length}</Td>
                  <Td>
                    <HStack>
                      {template.isActive ? (
                        <CheckCircleIcon color="green.500" />
                      ) : (
                        <CloseIcon color="red.500" />
                      )}
                      <Text>{template.isActive ? 'Active' : 'Inactive'}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Edit"
                        icon={<EditIcon />}
                        size="sm"
                        onClick={() => navigate(`/supervisor/survey-templates/edit/${template.id}`)}
                      />
                      <IconButton
                        aria-label="Delete"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
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
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Survey Template
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this survey template? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default SurveyTemplateList;
