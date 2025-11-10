import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import type { ResourceType } from '../../types/resource';

interface UseResourceTypesReturn {
  resourceTypes: ResourceType[];
  isLoading: boolean;
  error: string | null;
}

export const useResourceTypes = (): UseResourceTypesReturn => {
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.get<ResourceType[]>('/resources/types');
        setResourceTypes(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดประเภททรัพยากร');
        console.error('Error fetching resource types:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResourceTypes();
  }, []);

  return {
    resourceTypes,
    isLoading,
    error,
  };
};
