import { useState, useRef } from 'react';
import { uploadApi } from '../../api/upload';
import { useToast } from '@chakra-ui/react';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  maxSizeMB?: number;
}

export const ImageUpload = ({ onUploadSuccess, maxSizeMB = 5 }: ImageUploadProps) => {
  const toast = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: 'ไฟล์ใหญ่เกินไป',
        description: `ไฟล์ใหญ่เกิน ${maxSizeMB}MB`,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'ไฟล์ไม่ถูกต้อง',
        description: 'กรุณาเลือกไฟล์รูปภาพ',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
      });
      return;
    }

    setSelectedFile(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const result = await uploadApi.uploadImage(selectedFile);
      toast({
        title: 'สำเร็จ',
        description: 'อัปโหลดรูปภาพสำเร็จ',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onUploadSuccess(result.url);
      
      // Reset
      setPreview(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'เกิดข้อผิดพลาด',
        description: 'อัปโหลดรูปภาพล้มเหลว',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          อัปโหลดรูปภาพ
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-base text-gray-700
            file:mr-4 file:py-2 file:px-4
            file:rounded-xl file:border-0
            file:text-base file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            cursor-pointer transition-colors"
        />
        <p className="mt-2 text-sm text-gray-600">
          รองรับ JPEG, PNG, WebP (สูงสุด {maxSizeMB}MB)
        </p>
      </div>

      {preview && (
        <div className="space-y-3">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-xl border-4 border-gray-200 shadow-md"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
            >
              {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
