import { useState } from 'react';
import { apiClient } from '../../api/client';
import type { Resource, ResourceStatus } from '../../types/resource';

interface ResourceFormData {
  name: string;
  resourceTypeId: string;
  status: ResourceStatus;
  location: string;
  registrationNumber?: string;
}

interface UseResourceFormReturn {
  isSubmitting: boolean;
  error: string | null;
  createResource: (data: ResourceFormData) => Promise<Resource>;
  updateResource: (id: string, data: Partial<ResourceFormData>) => Promise<Resource>;
  deleteResource: (id: string) => Promise<void>;
}

export const useResourceForm = (): UseResourceFormReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createResource = async (data: ResourceFormData): Promise<Resource> => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await apiClient.post<Resource>('/resources', data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างทรัพยากร';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateResource = async (
    id: string,
    data: Partial<ResourceFormData>
  ): Promise<Resource> => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await apiClient.patch<Resource>(`/resources/${id}`, data);
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการแก้ไขทรัพยากร';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteResource = async (id: string): Promise<void> => {
    try {
      setIsSubmitting(true);
      setError(null);
      await apiClient.delete(`/resources/${id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการลบทรัพยากร';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    createResource,
    updateResource,
    deleteResource,
  };
};
