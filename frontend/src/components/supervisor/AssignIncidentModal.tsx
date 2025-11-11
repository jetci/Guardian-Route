import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  VStack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { incidentsApi } from '../../api/incidents';
import { usersApi } from '../../api/users';
import type { Incident, User } from '../../types';

interface AssignIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  onSuccess: () => void;
}

export const AssignIncidentModal: React.FC<AssignIncidentModalProps> = ({
  isOpen,
  onClose,
  incident,
  onSuccess,
}) => {
  const [fieldOfficers, setFieldOfficers] = useState<User[]>([]);
  const [selectedOfficerId, setSelectedOfficerId] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingOfficers, setIsFetchingOfficers] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchFieldOfficers();
      setSelectedOfficerId('');
      setNotes('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fetchFieldOfficers = async () => {
    try {
      setIsFetchingOfficers(true);
      const officers = await usersApi.getFieldOfficers();
      setFieldOfficers(officers);
    } catch (error) {
      console.error('Error fetching field officers:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ไม่สามารถโหลดรายชื่อเจ้าหน้าที่ได้',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsFetchingOfficers(false);
    }
  };

  const handleSubmit = async () => {
    if (!incident || !selectedOfficerId) {
      toast({
        title: 'กรุณาเลือกเจ้าหน้าที่',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      await incidentsApi.assign(incident.id, {
        fieldOfficerId: selectedOfficerId,
        notes: notes.trim() || undefined,
      });

      toast({
        title: 'มอบหมายงานสำเร็จ',
        description: 'ได้มอบหมายเหตุการณ์ให้เจ้าหน้าที่แล้ว',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning incident:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ไม่สามารถมอบหมายงานได้',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!incident) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>มอบหมายเหตุการณ์</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold" fontSize="lg">
              {incident.title}
            </Text>
            <Text color="gray.600">{incident.description}</Text>

            {isFetchingOfficers ? (
              <VStack py={4}>
                <Spinner />
                <Text>กำลังโหลดรายชื่อเจ้าหน้าที่...</Text>
              </VStack>
            ) : (
              <>
                <FormControl isRequired>
                  <FormLabel>เลือกเจ้าหน้าที่ภาคสนาม</FormLabel>
                  <Select
                    placeholder="-- เลือกเจ้าหน้าที่ --"
                    value={selectedOfficerId}
                    onChange={(e) => setSelectedOfficerId(e.target.value)}
                  >
                    {fieldOfficers.map((officer) => (
                      <option key={officer.id} value={officer.id}>
                        {officer.firstName} {officer.lastName} ({officer.username})
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>หมายเหตุ (ถ้ามี)</FormLabel>
                  <Textarea
                    placeholder="เช่น กรุณาตรวจสอบพื้นที่โดยเร็ว..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </FormControl>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            ยกเลิก
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={!selectedOfficerId || isFetchingOfficers}
          >
            มอบหมาย
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
