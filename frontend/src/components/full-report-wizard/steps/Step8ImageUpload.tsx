import React, { useState, useCallback } from 'react';
import { useWizard } from '../../../context/wizard/WizardContext';
import {
  Form,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Button } from '../../ui/button';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'failed';
  url?: string;
  error?: string;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const Step8ImageUpload: React.FC = () => {
  const { state, updateFormData } = useWizard();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // TODO: Replace with actual upload logic
    // const formData = new FormData();
    // formData.append('file', file);
    // const response = await api.post('/upload', formData);
    // return response.data.url;
    
    return URL.createObjectURL(file);
  };

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      const fileArray = Array.from(files);
      const remainingSlots = MAX_IMAGES - images.length;

      if (fileArray.length > remainingSlots) {
        alert(`สามารถอัปโหลดได้สูงสุด ${MAX_IMAGES} รูป`);
        return;
      }

      const newImages: UploadedImage[] = fileArray.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        status: 'uploading' as const,
      }));

      setImages((prev) => [...prev, ...newImages]);

      // Upload each image
      for (const image of newImages) {
        if (image.file.size > MAX_FILE_SIZE) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, status: 'failed', error: 'ไฟล์ใหญ่เกิน 20MB' }
                : img
            )
          );
          continue;
        }

        try {
          const url = await uploadImage(image.file);
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id ? { ...img, status: 'success', url } : img
            )
          );
        } catch (error) {
          setImages((prev) =>
            prev.map((img) =>
              img.id === image.id
                ? { ...img, status: 'failed', error: 'อัปโหลดล้มเหลว' }
                : img
            )
          );
        }
      }

      // Update wizard context
      const successfulUrls = newImages
        .filter((img) => img.status === 'success')
        .map((img) => img.url!);
      updateFormData({
        photoUrls: [...(state.formData.photoUrls || []), ...successfulUrls],
      });
    },
    [images, state.formData.photoUrls, updateFormData]
  );

  const handleRemove = (id: string) => {
    const imageToRemove = images.find((img) => img.id === id);
    setImages((prev) => prev.filter((img) => img.id !== id));

    if (imageToRemove?.url) {
      updateFormData({
        photoUrls: state.formData.photoUrls?.filter(
          (url) => url !== imageToRemove.url
        ),
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const successCount = images.filter((img) => img.status === 'success').length;

  return (
    <Form>
      <div className="space-y-6">
        <FormItem>
          <FormLabel>อัปโหลดรูปภาพประกอบรายงาน</FormLabel>
          <FormDescription>
            อัปโหลดรูปภาพสถานที่เกิดเหตุ ความเสียหาย หรือภาพประกอบอื่นๆ (สูงสุด{' '}
            {MAX_IMAGES} รูป, ขนาดไม่เกิน 20MB ต่อรูป)
          </FormDescription>
        </FormItem>

        {/* Upload Area */}
        {images.length < MAX_IMAGES && (
          <div
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 mb-2">
              ลากและวางรูปภาพที่นี่ หรือ
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <ImageIcon className="mr-2 h-4 w-4" />
              เลือกรูปภาพ
            </Button>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <p className="text-xs text-gray-500 mt-2">
              {images.length} / {MAX_IMAGES} รูป
            </p>
          </div>
        )}

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative border rounded-lg overflow-hidden"
              >
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />

                {/* Status Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center',
                    image.status === 'uploading' && 'bg-black/50',
                    image.status === 'failed' && 'bg-red-500/50'
                  )}
                >
                  {image.status === 'uploading' && (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  )}
                  {image.status === 'success' && (
                    <CheckCircle className="absolute top-2 right-2 h-6 w-6 text-green-500 bg-white rounded-full" />
                  )}
                  {image.status === 'failed' && (
                    <div className="text-center text-white">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-xs">{image.error}</p>
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 left-2"
                  onClick={() => handleRemove(image.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {images.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              ✅ อัปโหลดสำเร็จ {successCount} / {images.length} รูป
            </p>
            {images.some((img) => img.status === 'failed') && (
              <p className="text-sm text-red-600 mt-1">
                ⚠️ บางรูปอัปโหลดล้มเหลว กรุณาลองใหม่อีกครั้ง
              </p>
            )}
          </div>
        )}

        <FormMessage />
      </div>
    </Form>
  );
};
