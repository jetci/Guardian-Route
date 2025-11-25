import React, { useEffect } from 'react';
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

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  phone?: string;
  department?: string;
}

interface EditUserFormData {
  username?: string;
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  phone?: string;
  department?: string;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user }) => {
  const { register, handleSubmit, reset } = useForm<EditUserFormData>();
  const toast = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      reset({
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone || '',
        department: user.department || '',
      });
    }
  }, [user, reset]);

  const updateUserMutation = useMutation({
    mutationFn: (data: EditUserFormData) =>
      axios.patch(`/api/admin/users/${user.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      toast({
        title: 'สำเร็จ',
        description: 'อัพเดทข้อมูลผู้ใช้สำเร็จ',
        status: 'success',
        duration: 3000,
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: error.response?.data?.message || 'ไม่สามารถอัพเดทข้อมูลได้',
        status: 'error',
        duration: 3000,
      });
    },
  });

  const onSubmit = (data: EditUserFormData) => {
    // Remove empty password field
    if (!data.password) {
      delete data.password;
    }
    updateUserMutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>แก้ไขข้อมูลผู้ใช้</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>ชื่อผู้ใช้ (Username)</FormLabel>
                <Input {...register('username')} placeholder="john_doe" />
              </FormControl>

              <FormControl>
                <FormLabel>อีเมล</FormLabel>
                <Input type="email" {...register('email')} placeholder="john@example.com" />
              </FormControl>

              <FormControl>
                <FormLabel>รหัสผ่านใหม่ (เว้นว่างหากไม่ต้องการเปลี่ยน)</FormLabel>
                <Input
                  type="password"
                  {...register('password')}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                />
              </FormControl>

              <FormControl>
                <FormLabel>ชื่อ</FormLabel>
                <Input {...register('firstName')} placeholder="จอห์น" />
              </FormControl>

              <FormControl>
                <FormLabel>นามสกุล</FormLabel>
                <Input {...register('lastName')} placeholder="โด" />
              </FormControl>

              <FormControl>
                <FormLabel>บทบาท</FormLabel>
                <Select {...register('role')} placeholder="เลือกบทบาท">
                  <option value="FIELD_OFFICER">เจ้าหน้าที่ภาคสนาม</option>
                  <option value="SUPERVISOR">หัวหน้างาน</option>
                  <option value="EXECUTIVE">ผู้บริหาร</option>
                  <option value="ADMIN">ผู้ดูแลระบบ</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>เบอร์โทรศัพท์</FormLabel>
                <Input {...register('phone')} placeholder="081-234-5678" />
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
              isLoading={updateUserMutation.isPending}
            >
              บันทึก
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditUserModal;
