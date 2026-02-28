import { useState } from 'react';
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
} from '@chakra-ui/react';
import { DeleteIcon, AddIcon } from '@chakra-ui/icons';

interface SimplePhotoUploadProps {
  photos: string[];
  onPhotosChange: (urls: string[]) => void;
  maxPhotos?: number;
}

export const SimplePhotoUpload = ({
  photos,
  onPhotosChange,
  maxPhotos = 10,
}: SimplePhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > maxPhotos) {
      toast({
        title: 'เกินจำนวนรูปที่กำหนด',
        description: `สามารถอัปโหลดได้สูงสุด ${maxPhotos} รูป`,
        status: 'warning',
        duration: 3000,
      });
      return;
    }

    try {
      setUploading(true);
      const newUrls: string[] = [];

      for (const file of Array.from(files)) {
        // TODO: Upload to actual storage
        // For now, use data URL
        const reader = new FileReader();
        const url = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newUrls.push(url);
      }

      onPhotosChange([...photos, ...newUrls]);
      toast({
        title: 'อัปโหลดสำเร็จ',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถอัปโหลดรูปภาพได้',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <VStack align="stretch" spacing={4}>
      <HStack>
        <Button
          as="label"
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          isLoading={uploading}
          isDisabled={photos.length >= maxPhotos}
        >
          เพิ่มรูปภาพ
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </Button>
        <Text fontSize="sm" color="gray.600">
          {photos.length} / {maxPhotos} รูป
        </Text>
      </HStack>

      {photos.length > 0 && (
        <SimpleGrid columns={{ base: 2, md: 3 }} spacing={4}>
          {photos.map((url, index) => (
            <Box key={index} position="relative" borderRadius="md" overflow="hidden">
              <Image src={url} alt={`Photo ${index + 1}`} objectFit="cover" h="150px" w="100%" />
              <IconButton
                aria-label="Delete photo"
                icon={<DeleteIcon />}
                size="sm"
                colorScheme="red"
                position="absolute"
                top={2}
                right={2}
                onClick={() => handleDelete(index)}
              />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};
