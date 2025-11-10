import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import type { Resource, ResourceFilters } from '../../types/resource';

interface UseResourcesReturn {
  resources: Resource[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useResources = (filters?: ResourceFilters): UseResourcesReturn => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.resourceTypeId) params.append('resourceTypeId', filters.resourceTypeId);
      if (filters?.status) params.append('status', filters.status);

      const response = await apiClient.get<Resource[]>(
        `/resources?${params.toString()}`
      );
      setResources(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูลทรัพยากร');
      console.error('Error fetching resources:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters?.search, filters?.resourceTypeId, filters?.status]);

  return {
    resources,
    isLoading,
    error,
    refetch: fetchResources,
  };
};
