import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Box,
  Select,
  Flex,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import { type Incident, IncidentStatus, Role } from '../../types';
import { apiClient } from '../../api/client';
import { useAuthStore } from '../../stores/authStore';
import { ImageGallery } from '../upload/ImageGallery';
import { type Survey, type SurveyTemplate } from '../../types/Survey';
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
  INVESTIGATING: 'purple',
  RESOLVED: 'green',
  REJECTED: 'red',
  CLOSED: 'gray',
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
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถดึงรายละเอียดเหตุการณ์ได้',
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
        title: 'สำเร็จ',
        description: `อัปเดตสถานะเหตุการณ์เป็น ${newStatus} เรียบร้อยแล้ว`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchIncidentDetails();
      onUpdate();
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถอัปเดตสถานะเหตุการณ์ได้',
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
        title: 'สำเร็จ',
        description: 'สร้างแบบสำรวจใหม่เรียบร้อยแล้ว',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setSelectedTemplateId('');
      fetchIncidentDetails();
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถสร้างแบบสำรวจได้',
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
        title: 'สำเร็จ',
        description: 'ทำเครื่องหมายแบบสำรวจว่าเสร็จสมบูรณ์แล้ว',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchIncidentDetails();
    } catch (error) {
      toast({
        title: 'ข้อผิดพลาด',
        description: 'ไม่สามารถทำเครื่องหมายแบบสำรวจว่าเสร็จสมบูรณ์ได้',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const getStatusBadge = (status: IncidentStatus) => (
    <Badge colorScheme={statusColors[status]} fontSize="0.9em" px={3} py={1} borderRadius="full" textTransform="uppercase" fontWeight="bold">
      {status}
    </Badge>
  );

  const renderSurveyStatus = (status: Survey['status']) => {
    switch (status) {
      case 'PENDING':
        return <Badge colorScheme="orange" px={3} py={1} borderRadius="full">รอดำเนินการ</Badge>;
      case 'IN_PROGRESS':
        return <Badge colorScheme="blue" px={3} py={1} borderRadius="full">กำลังดำเนินการ</Badge>;
      case 'COMPLETED':
        return <Badge colorScheme="green" px={3} py={1} borderRadius="full">เสร็จสมบูรณ์</Badge>;
      case 'CANCELLED':
        return <Badge colorScheme="red" px={3} py={1} borderRadius="full">ยกเลิก</Badge>;
      default:
        return <Badge px={3} py={1} borderRadius="full">{status}</Badge>;
    }
  };

  if (!incidentId || !isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(3px)" />
      <ModalContent borderRadius="2xl" shadow="2xl">
        <ModalHeader borderBottomWidth="1px" fontSize="2xl" fontWeight="extrabold" color="gray.800" p={6}>
          รายละเอียดเหตุการณ์: {incident?.title || 'กำลังโหลด...'}
        </ModalHeader>
        <ModalCloseButton size="lg" top={4} right={4} />
        <ModalBody p={8}>
          {isLoading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner size="xl" color="blue.600" thickness="4px" />
            </Flex>
          ) : incident ? (
            <VStack align="stretch" spacing={8}>
              <Box p={6} bg="gray.50" borderRadius="xl" border="1px" borderColor="gray.200">
                <Heading size="lg" mb={4} color="blue.600" borderBottom="2px" borderColor="blue.100" pb={2}>ข้อมูลเหตุการณ์</Heading>
                <VStack align="stretch" spacing={3} fontSize="md">
                  <HStack>
                    <Text fontWeight="bold" w="150px" color="gray.700">สถานะ:</Text>
                    {getStatusBadge(incident.status)}
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="150px" color="gray.700">ระดับความสำคัญ:</Text>
                    <Badge colorScheme={incident.priority === 'CRITICAL' ? 'red' : incident.priority === 'HIGH' ? 'orange' : 'gray'} fontSize="0.9em" px={3} py={1} borderRadius="full" textTransform="uppercase" fontWeight="bold">
                      {incident.priority}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="150px" color="gray.700">ประเภทภัย:</Text>
                    <Text color="gray.600">{incident.disasterType}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="bold" w="150px" color="gray.700">วันที่รายงาน:</Text>
                    <Text color="gray.600">{new Date(incident.reportedAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}</Text>
                  </HStack>
                  <HStack align="start">
                    <Text fontWeight="bold" w="150px" color="gray.700">ที่ตั้ง:</Text>
                    <Text flex="1" color="gray.600">{incident.address || `${incident.location.coordinates[1]}, ${incident.location.coordinates[0]}`}</Text>
                  </HStack>
                  <Box pt={2}>
                    <Text fontWeight="bold" color="gray.700" mb={1}>รายละเอียด:</Text>
                    <Text color="gray.600" whiteSpace="pre-wrap">{incident.description}</Text>
                  </Box>
                </VStack>
              </Box>

              {(user?.role === Role.SUPERVISOR || user?.role === Role.ADMIN) && (
                <Box p={6} bg="white" borderRadius="xl" border="1px" borderColor="gray.200" shadow="sm">
                  <Heading size="md" mb={3} color="gray.700">อัปเดตสถานะ</Heading>
                  <HStack>
                    <Select
                      placeholder="เปลี่ยนสถานะ"
                      onChange={(e) => handleStatusChange(e.target.value as IncidentStatus)}
                      value={incident.status}
                      isDisabled={isUpdatingStatus}
                      maxW="250px"
                      borderRadius="lg"
                      borderColor="gray.300"
                    >
                      {Object.values(IncidentStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </Select>
                    {isUpdatingStatus && <Spinner size="sm" color="blue.500" />}
                  </HStack>
                </Box>
              )}

              <Box>
                <Heading size="lg" mb={4} color="blue.600" borderBottom="2px" borderColor="blue.100" pb={2}>แบบสำรวจ ({surveys.length})</Heading>
                
                {(user?.role === Role.SUPERVISOR || user?.role === Role.ADMIN) && (
                  <VStack align="stretch" spacing={3} p={6} bg="gray.50" borderRadius="xl" border="1px" borderColor="gray.200" mb={6}>
                    <Heading size="md" color="gray.700">สร้างแบบสำรวจใหม่</Heading>
                    <FormControl>
                      <FormLabel fontWeight="bold" color="gray.700">เลือกเทมเพลต</FormLabel>
                      <Select
                        placeholder="เลือกเทมเพลตแบบสำรวจ"
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        isDisabled={isCreatingSurvey}
                        borderRadius="lg"
                        borderColor="gray.300"
                      >
                        {surveyTemplates.map(template => (
                          <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      colorScheme="blue"
                      onClick={handleCreateSurvey}
                      isLoading={isCreatingSurvey}
                      disabled={!selectedTemplateId}
                      size="lg"
                      borderRadius="xl"
                      className="shadow-md"
                    >
                      สร้างแบบสำรวจ
                    </Button>
                  </VStack>
                )}

                <VStack align="stretch" spacing={4}>
                  {surveys.map(survey => (
                    <Box key={survey.id} p={4} bg="white" borderRadius="xl" shadow="md" border="1px" borderColor="gray.200">
                      <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="extrabold" fontSize="lg" color="gray.800">{survey.template?.name || 'แบบสำรวจ'}</Text>
                          <Text fontSize="sm" color="gray.500">สร้างโดย: {survey.createdById || 'ไม่ระบุ'}</Text>
                        </VStack>
                        <HStack spacing={3}>
                          {renderSurveyStatus(survey.status)}
                          {survey.status !== 'COMPLETED' && (
                            <Button
                              size="md"
                              colorScheme="blue"
                              onClick={() => {
                                onClose();
                                navigate(`/survey/${survey.id}/respond`);
                              }}
                              borderRadius="lg"
                            >
                              ตอบแบบสำรวจ
                            </Button>
                          )}
                          {(user?.role === Role.SUPERVISOR || user?.role === Role.ADMIN) && survey.status !== 'COMPLETED' && (
                            <Button
                              size="md"
                              colorScheme="green"
                              onClick={() => handleCompleteSurvey(survey.id)}
                              borderRadius="lg"
                            >
                              เสร็จสมบูรณ์
                            </Button>
                          )}
                        </HStack>
                      </HStack>
                    </Box>
                  ))}
                  {surveys.length === 0 && <Text color="gray.500" textAlign="center" py={4}>ไม่มีแบบสำรวจที่เชื่อมโยงกับเหตุการณ์นี้</Text>}
                </VStack>
              </Box>

              <Box>
                <Heading size="lg" mb={4} color="blue.600" borderBottom="2px" borderColor="blue.100" pb={2}>งานที่เกี่ยวข้อง</Heading>
                <Text color="gray.500">การรวมงานจะแสดงที่นี่</Text>
              </Box>

              {incident.images && incident.images.length > 0 && (
                <Box>
                  <Heading size="lg" mb={4} color="blue.600" borderBottom="2px" borderColor="blue.100" pb={2}>รูปภาพ ({incident.images.length})</Heading>
                  <ImageGallery images={incident.images} />
                </Box>
              )}

            </VStack>
          ) : (
            <Text fontSize="xl" color="red.500" textAlign="center">ไม่พบเหตุการณ์</Text>
          )}
        </ModalBody>

        <ModalFooter borderTopWidth="1px" p={6}>
          <Button variant="outline" onClick={onClose} size="lg" borderRadius="xl">
            ปิด
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default IncidentDetailsModal;
