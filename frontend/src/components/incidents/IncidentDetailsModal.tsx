import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Box,
  Divider,
  useToast,
  Select,
  FormControl,
  FormLabel,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { Incident, Task, IncidentStatus, Role } from '../../types';
import { api } from '../../utils/api';
import { useAuthStore } from '../../stores/authStore';
import { ImageGallery } from '../upload/ImageGallery';
import { TasksList } from '../tasks/TasksList';
import { TaskForm } from '../tasks/TaskForm';
import { Survey, SurveyTemplate } from '../../types/Survey';
import { useNavigate } from 'react-router-dom';

interface IncidentDetailsModalProps {
  incidentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const statusColors: Record<IncidentStatus, string> = {
  PENDING: 'orange',
  IN_PROGRESS: 'blue',
  RESOLVED: 'green',
  CLOSED: 'red',
};

const IncidentDetailsModal: React.FC<IncidentDetailsModalProps> = ({ incidentId, isOpen, onClose, onUpdate }) => {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveyTemplates, setSurveyTemplates] = useState<SurveyTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const { user } = useAuthStore();
  const toast = useToast();
  const navigate = useNavigate();

  const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const fetchIncidentDetails = useCallback(async () => {
    if (!incidentId) return;
    setIsLoading(true);
    try {
      const incidentResponse = await apiClient.get<Incident>(`/incidents/${incidentId}`);
      setIncident(incidentResponse.data);

      const surveysResponse = await apiClient.get<Survey[]>(`/surveys/incident/${incidentId}`);
      setSurveys(surveysResponse.data);

      const templatesResponse = await apiClient.get<SurveyTemplate[]>('/survey-templates');
      setSurveyTemplates(templatesResponse.data.filter(t => t.isActive));

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch incident details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } finally {
      setIsLoading(false);
    }
  }, [incidentId, onClose, toast]);

  useEffect(() => {
    if (isOpen) {
      fetchIncidentDetails();
    }
  }, [isOpen, fetchIncidentDetails]);

  const handleStatusChange = async (newStatus: IncidentStatus) => {
    if (!incidentId) return;
    setIsUpdatingStatus(true);
    try {
      await apiClient.patch(`/incidents/${incidentId}/status`, { status: newStatus });
      toast({
        title: 'Success',
        description: `Incident status updated to ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchIncidentDetails();
      onUpdate(); // Notify parent to refresh list
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update incident status.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCreateSurvey = async () => {
    if (!incidentId || !selectedTemplateId) return;
    setIsCreatingSurvey(true);
    try {
      await apiClient.post('/surveys', {
        templateId: selectedTemplateId,
        incidentId: incidentId,
        villageId: incident?.villageId,
      });
      toast({
        title: 'Success',
        description: 'New survey created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSelectedTemplateId('');
      fetchIncidentDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create survey.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsCreatingSurvey(false);
    }
  };

  const handleCompleteSurvey = async (surveyId: string) => {
    try {
      await apiClient.patch(`/surveys/${surveyId}/complete`);
      toast({
        title: 'Success',
        description: 'Survey marked as completed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchIncidentDetails();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete survey.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusBadge = (status: IncidentStatus) => (
    <Badge colorScheme={statusColors[status]} fontSize="0.8em">
      {status}
    </Badge>
  );

  const renderSurveyStatus = (status: Survey['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge colorScheme="orange">รอดำเนินการ</Badge>;
      case 'IN_PROGRESS':
        return <Badge colorScheme="blue">กำลังดำเนินการ</Badge>;
      case 'COMPLETED':
        return <Badge colorScheme="green">เสร็จสมบูรณ์</Badge>;
      case 'CANCELLED':
        return <Badge colorScheme="red">ยกเลิก</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!incidentId || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent borderRadius="xl">
        <ModalHeader borderBottomWidth="1px">
          {incident?.title || 'Incident Details'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          {isLoading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" />
            </Flex>
          ) : incident ? (
            <VStack align="stretch" spacing={6}>
              {/* Incident Info */}
              <Box>
                <Heading size="md" mb={2}>Incident Information</Heading>
                <VStack align="stretch" spacing={1} fontSize="sm">
                  <HStack>
                    <Text fontWeight="bold" w="120px">Status:</Text>
                    {getStatusBadge(incident.status)}
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="120px">Priority:</Text>
                    <Badge colorScheme={incident.priority === 'CRITICAL' ? 'red' : incident.priority === 'HIGH' ? 'yellow' : 'gray'}>
                      {incident.priority}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="120px">Type:</Text>
                    <Text>{incident.disasterType}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="120px">Reported At:</Text>
                    <Text>{new Date(incident.reportedAt).toLocaleString()}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="120px">Location:</Text>
                    <Text>{incident.address || `${incident.location.coordinates[1]}, ${incident.location.coordinates[0]}`}</Text>
                  </HStack>
                  <Text mt={2}>{incident.description}</Text>
                </VStack>
              </Box>

              {/* Status Update (Supervisor/Admin only) */}
              {(user?.role === Role.SUPERVISOR || user?.role === Role.ADMIN) && (
                <Box>
                  <Heading size="sm" mb={2}>Update Status</Heading>
                  <HStack>
                    <Select
                      placeholder="Change Status"
                      onChange={(e) => handleStatusChange(e.target.value as IncidentStatus)}
                      value={incident.status}
                      isDisabled={isUpdatingStatus}
                      maxW="200px"
                    >
                      {Object.values(IncidentStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Select>
                    {isUpdatingStatus && <Spinner size="sm" />}
                  </HStack>
                </Box>
              )}

              <Divider />

              {/* Surveys Section */}
              <Box>
                <Heading size="md" mb={4}>Surveys ({surveys.length})</Heading>
                
                {/* Create New Survey */}
                {(user?.role === Role.SUPERVISOR || user?.role === Role.ADMIN) && (
                  <VStack align="stretch" spacing={3} p={4} borderWidth="1px" borderRadius="lg" mb={4}>
                    <Heading size="sm">Create New Survey</Heading>
                    <FormControl>
                      <FormLabel>Select Template</FormLabel>
                      <Select
                        placeholder="Select Survey Template"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        isDisabled={isCreatingSurvey}
                      >
                        {surveyTemplates.map(template => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      colorScheme="teal"
                      onClick={handleCreateSurvey}
                      isLoading={isCreatingSurvey}
                      isDisabled={!selectedTemplateId}
                    >
                      Create Survey
                    </Button>
                  </VStack>
                )}

                {/* List of Existing Surveys */}
                <VStack align="stretch" spacing={3}>
                  {surveys.map(survey => (
                    <Box key={survey.id} p={3} borderWidth="1px" borderRadius="md" shadow="sm">
                      <HStack justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="bold">{survey.template?.name || 'Survey'}</Text>
                          <Text fontSize="sm" color="gray.500">Created by: {survey.createdById}</Text>
                        </VStack>
                        <HStack>
                          {renderSurveyStatus(survey.status)}
                          {survey.status !== 'COMPLETED' && (
                            <Button
                              size="sm"
                              colorScheme="blue"
                              onClick={() => navigate(`/survey/${survey.id}/respond`)}
                            >
                              Respond
                            </Button>
                          )}
                          {(user?.role === Role.SUPERVISOR || user?.role === Role.ADMIN) && survey.status !== 'COMPLETED' && (
                            <Button
                              size="sm"
                              colorScheme="green"
                              onClick={() => handleCompleteSurvey(survey.id)}
                            >
                              Complete
                            </Button>
                          )}
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                  {surveys.length === 0 && <Text color="gray.500">No surveys linked to this incident.</Text>}
                </VStack>
              </Box>

              <Divider />

              {/* Tasks Section (Placeholder) */}
              <Box>
                <Heading size="md" mb={4}>Tasks</Heading>
                {/* Assuming TasksList and TaskForm are available */}
                {/* <TasksList incidentId={incidentId} /> */}
                {/* <TaskForm incidentId={incidentId} /> */}
                <Text color="gray.500">Task integration will be here.</Text>
              </Box>

              <Divider />

              {/* Images Section */}
              {incident.images && incident.images.length > 0 && (
                <Box>
                  <Heading size="md" mb={4}>Images</Heading>
                  <ImageGallery images={incident.images} />
                </Box>
              )}

            </VStack>
          ) : (
            <Text>Incident not found.</Text>
          )}
        </ModalBody>

        <ModalFooter borderTopWidth="1px">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IncidentDetailsModal;
