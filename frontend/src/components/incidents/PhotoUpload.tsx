import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  HStack,
  VStack,
  Image,
  IconButton,
  Text,
  useToast,
  SimpleGrid,
  Progress,
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

interface Photo {
  id: string;
  url: string;
  filename: string;
}

interface PhotoUploadProps {
  incidentId?: string;
  photos: Photo[];
  onPhotoUploaded?: (photo: Photo) => void;
  onPhotoDeleted?: (photoId: string) => void;
  maxPhotos?: number;
  disabled?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  incidentId,
  photos = [],
  onPhotoUploaded,
  onPhotoDeleted,
  maxPhotos = 10,
  disabled = false,
}) => {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    if (!file.type.match(/^image\/(jpg|jpeg|png|gif)$/)) {
      toast({
        title: 'ประเภทไฟล์ไม่ถูกต้อง',
        description: 'กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, GIF)',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'ไฟล์ใหญ่เกินไป',
        description: 'กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Check max photos
    if (photos.length >= maxPhotos) {
      toast({
        title: 'จำนวนรูปภาพเต็ม',
        description: `สามารถอัปโหลดได้สูงสุด ${maxPhotos} รูป`,
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    // Upload file
    if (incidentId) {
      await uploadToServer(file);
    } else {
      // Preview mode (before incident is created)
      previewFile(file);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadToServer = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('accessToken');
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/incidents/${incidentId}/photos`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const photo = await response.json();

      toast({
        title: 'อัปโหลดสำเร็จ',
        status: 'success',
        duration: 2000,
      });

      if (onPhotoUploaded) {
        onPhotoUploaded(photo);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัปโหลดรูปภาพได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const previewFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const photo: Photo = {
        id: `preview-${Date.now()}`,
        url: e.target?.result as string,
        filename: file.name,
      };

      if (onPhotoUploaded) {
        onPhotoUploaded(photo);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (photoId: string) => {
    if (!incidentId || photoId.startsWith('preview-')) {
      // Local delete
      if (onPhotoDeleted) {
        onPhotoDeleted(photoId);
      }
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/incidents/${incidentId}/photos/${photoId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      toast({
        title: 'ลบรูปภาพสำเร็จ',
        status: 'success',
        duration: 2000,
      });

      if (onPhotoDeleted) {
        onPhotoDeleted(photoId);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถลบรูปภาพได้',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <HStack>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <Button
          leftIcon={<AddIcon />}
          onClick={() => fileInputRef.current?.click()}
          isDisabled={disabled || isUploading || photos.length >= maxPhotos}
          size="sm"
        >
          เพิ่มรูปภาพ
        </Button>
        <Text fontSize="sm" color="gray.600">
          ({photos.length}/{maxPhotos})
        </Text>
      </HStack>

      {isUploading && (
        <Box>
          <Text fontSize="sm" mb={2}>กำลังอัปโหลด...</Text>
          <Progress value={uploadProgress} size="sm" colorScheme="blue" />
        </Box>
      )}

      {photos.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
          {photos.map((photo) => (
            <Box key={photo.id} position="relative">
              <Image
                src={photo.url.startsWith('http') ? photo.url : `${import.meta.env.VITE_API_URL}${photo.url}`}
                alt={photo.filename}
                borderRadius="md"
                objectFit="cover"
                w="full"
                h="150px"
              />
              {!disabled && (
                <IconButton
                  aria-label="Delete photo"
                  icon={<DeleteIcon />}
                  size="sm"
                  colorScheme="red"
                  position="absolute"
                  top={2}
                  right={2}
                  onClick={() => handleDelete(photo.id)}
                />
              )}
            </Box>
          ))}
        </SimpleGrid>
      )}

      {photos.length === 0 && (
        <Box
          borderWidth={2}
          borderStyle="dashed"
          borderColor="gray.300"
          borderRadius="md"
          p={8}
          textAlign="center"
        >
          <Text color="gray.500">ยังไม่มีรูปภาพ</Text>
          <Text fontSize="sm" color="gray.400" mt={1}>
            คลิกปุ่ม "เพิ่มรูปภาพ" เพื่ออัปโหลด
          </Text>
        </Box>
      )}
    </VStack>
  );
};
