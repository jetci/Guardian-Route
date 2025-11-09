import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import {
  notificationsApi,
  BroadcastType,
  BroadcastTarget,
  type CreateBroadcastDto,
} from '../../api/notifications';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  incidentId?: string;
}

export const BroadcastModal = ({ isOpen, onClose, incidentId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBroadcastDto>({
    title: '',
    message: '',
    type: BroadcastType.INFO,
    target: BroadcastTarget.ALL_FIELD_OFFICERS,
    incidentId,
  });
  const toast = useToast();

  const handleSubmit = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const result = await notificationsApi.sendBroadcast(formData);
      toast({
        title: 'ส่งการแจ้งเตือนสำเร็จ',
        description: `ส่งถึง ${result.recipientCount} คน`,
        status: 'success',
        duration: 3000,
      });
      onClose();
      setFormData({
        title: '',
        message: '',
        type: BroadcastType.INFO,
        target: BroadcastTarget.ALL_FIELD_OFFICERS,
        incidentId,
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถส่งการแจ้งเตือนได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ส่งการแจ้งเตือนแบบ Broadcast</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>หัวข้อ</FormLabel>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="เช่น แจ้งเตือนเหตุการณ์ฉุกเฉิน"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>ข้อความ</FormLabel>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="ระบุรายละเอียดการแจ้งเตือน..."
                rows={5}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>ประเภท</FormLabel>
              <Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value as BroadcastType })
                }
              >
                <option value={BroadcastType.EMERGENCY}>🚨 ฉุกเฉิน (EMERGENCY)</option>
                <option value={BroadcastType.ALERT}>⚠️ แจ้งเตือน (ALERT)</option>
                <option value={BroadcastType.INFO}>ℹ️ ข้อมูล (INFO)</option>
                <option value={BroadcastType.UPDATE}>🔄 อัปเดต (UPDATE)</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>ส่งถึง</FormLabel>
              <Select
                value={formData.target}
                onChange={(e) =>
                  setFormData({ ...formData, target: e.target.value as BroadcastTarget })
                }
              >
                <option value={BroadcastTarget.ALL_FIELD_OFFICERS}>
                  เจ้าหน้าที่ภาคสนามทั้งหมด
                </option>
                <option value={BroadcastTarget.ALL_REPORTERS}>
                  ทีมรายงานทั้งหมด
                </option>
                <option value={BroadcastTarget.ALL_STAFF}>
                  เจ้าหน้าที่ทั้งหมด
                </option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            ยกเลิก
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
            ส่งการแจ้งเตือน
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
