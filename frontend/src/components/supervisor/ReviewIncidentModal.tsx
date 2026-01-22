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
  Textarea,
  useToast,
  VStack,
  Text,
  HStack,
  Badge,
  RadioGroup,
  Radio,
  Stack,
} from '@chakra-ui/react';
import { incidentsApi } from '../../api/incidents';
import type { Incident } from '../../types';
import { IncidentStatus } from '../../types';

interface ReviewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident | null;
  onSuccess: () => void;
}

export const ReviewIncidentModal: React.FC<ReviewIncidentModalProps> = ({
  isOpen,
  onClose,
  incident,
  onSuccess,
}) => {
  const [reviewStatus, setReviewStatus] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isOpen) {
      setReviewStatus('APPROVED');
      setReviewNotes('');
      setAdditionalNotes('');
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!incident) return;

    if (!reviewNotes.trim()) {
      toast({
        title: 'กรุณากรอกความเห็น',
        description: 'ต้องระบุความเห็นในการตรวจสอบ',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      // Map review status to incident status
      const status: IncidentStatus = reviewStatus === 'APPROVED' ? IncidentStatus.IN_PROGRESS : IncidentStatus.CLOSED;

      await incidentsApi.review(incident.id, {
        status,
        reviewNotes: reviewNotes.trim(),
        additionalNotes: additionalNotes.trim() || undefined,
      });

      toast({
        title: 'ตรวจสอบสำเร็จ',
        description: `ได้${reviewStatus === 'APPROVED' ? 'อนุมัติ' : 'ปฏิเสธ'}เหตุการณ์แล้ว`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error reviewing incident:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: err.response?.data?.message || 'ไม่สามารถตรวจสอบเหตุการณ์ได้',
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
        <ModalHeader>ตรวจสอบเหตุการณ์</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Incident Info */}
            <VStack align="stretch" spacing={2} p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" fontSize="lg">
                {incident.title}
              </Text>
              <Text color="gray.600">{incident.description}</Text>
              <HStack spacing={2}>
                <Badge colorScheme="blue">{incident.disasterType}</Badge>
                <Badge colorScheme="purple">{incident.priority}</Badge>
                <Badge colorScheme="orange">{incident.status}</Badge>
              </HStack>
              {incident.village && (
                <Text fontSize="sm" color="gray.600">
                  หมู่บ้าน: {incident.village.name}
                </Text>
              )}
              {incident.createdBy && (
                <Text fontSize="sm" color="gray.600">
                  รายงานโดย: {incident.createdBy.firstName} {incident.createdBy.lastName}
                </Text>
              )}
            </VStack>

            {/* Review Status */}
            <FormControl isRequired>
              <FormLabel>ผลการตรวจสอบ</FormLabel>
              <RadioGroup value={reviewStatus} onChange={(value) => setReviewStatus(value as 'APPROVED' | 'REJECTED')}>
                <Stack direction="row" spacing={4}>
                  <Radio value="APPROVED" colorScheme="green">
                    อนุมัติ (ส่งต่อเพื่อดำเนินการ)
                  </Radio>
                  <Radio value="REJECTED" colorScheme="red">
                    ปฏิเสธ (ไม่ดำเนินการ)
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            {/* Review Notes */}
            <FormControl isRequired>
              <FormLabel>ความเห็นในการตรวจสอบ</FormLabel>
              <Textarea
                placeholder={
                  reviewStatus === 'APPROVED'
                    ? 'เช่น เหตุการณ์มีความสำคัญ ควรดำเนินการโดยเร็ว...'
                    : 'เช่น ข้อมูลไม่ครบถ้วน หรือไม่อยู่ในเขตพื้นที่รับผิดชอบ...'
                }
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
              />
            </FormControl>

            {/* Additional Notes */}
            <FormControl>
              <FormLabel>หมายเหตุเพิ่มเติม (ถ้ามี)</FormLabel>
              <Textarea
                placeholder="ข้อมูลเพิ่มเติมหรือคำแนะนำ..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                rows={3}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={isLoading}>
            ยกเลิก
          </Button>
          <Button
            colorScheme={reviewStatus === 'APPROVED' ? 'green' : 'red'}
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {reviewStatus === 'APPROVED' ? 'อนุมัติ' : 'ปฏิเสธ'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
