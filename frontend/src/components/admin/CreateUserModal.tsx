import React from 'react';
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
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface CreateUserFormData {
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
  phone?: string;
  department?: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateUserFormData>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserFormData) => axios.post('/api/admin/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'สำเร็จ',
        description: 'สร้างผู้ใช้ใหม่สำเร็จ',
        status: 'success',
        duration: 3000,
      });
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.response?.data?.message || 'ไม่สามารถสร้างผู้ใช้ได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const onSubmit = (data: CreateUserFormData) => {
    createUserMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>เพิ่มผู้ใช้ใหม่</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>ชื่อผู้ใช้ (Username)</FormLabel>
                <Input
                  {...register('username', { required: true })}
                  placeholder="john_doe"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>อีเมล</FormLabel>
                <Input
                  type="email"
                  {...register('email', { required: true })}
                  placeholder="john@example.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>รหัสผ่าน</FormLabel>
                <Input
                  type="password"
                  {...register('password', { required: true, minLength: 6 })}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>ชื่อ-นามสกุล</FormLabel>
                <Input
                  {...register('fullName', { required: true })}
                  placeholder="จอห์น โด"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>บทบาท</FormLabel>
                <Select {...register('role', { required: true })} placeholder="เลือกบทบาท">
                  <option value="FIELD_OFFICER">เจ้าหน้าที่ภาคสนาม</option>
                  <option value="SUPERVISOR">หัวหน้างาน</option>
                  <option value="EXECUTIVE">ผู้บริหาร</option>
                  <option value="ADMIN">ผู้ดูแลระบบ</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>เบอร์โทรศัพท์</FormLabel>
                <Input
                  {...register('phone')}
                  placeholder="081-234-5678"
                />
              </FormControl>

              <FormControl>
                <FormLabel>แผนก</FormLabel>
                <Input
                  {...register('department')}
                  placeholder="แผนกป้องกันและบรรเทาสาธารณภัย"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              ยกเลิก
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={createUserMutation.isPending}
            >
              สร้างผู้ใช้
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;
