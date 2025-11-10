import { useState } from 'react';
import { apiClient } from '../../api/client';

interface AllocationRecord {
  id: string;
  resourceId: string;
  taskId: string;
  allocatedById: string;
  allocatedAt: string;
  reclaimedAt: string | null;
  resource: {
    id: string;
    name: string;
    resourceType: {
      id: string;
      name: string;
    };
  };
  task: {
    id: string;
    title: string;
  };
  allocatedBy: {
    id: string;
    fullName: string;
  };
}

interface UseAllocationReturn {
  isLoading: boolean;
  error: string | null;
  allocate: (resourceId: string, taskId: string) => Promise<AllocationRecord>;
  reclaim: (allocationId: string) => Promise<AllocationRecord>;
  fetchHistory: (resourceId: string) => Promise<AllocationRecord[]>;
}

export const useAllocation = (): UseAllocationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allocate = async (resourceId: string, taskId: string): Promise<AllocationRecord> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post<AllocationRecord>(
        `/resources/${resourceId}/allocate`,
        { taskId }
      );
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการมอบหมายทรัพยากร';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const reclaim = async (allocationId: string): Promise<AllocationRecord> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.post<AllocationRecord>(
        `/resources/reclaim/${allocationId}`
      );
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการคืนทรัพยากร';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async (resourceId: string): Promise<AllocationRecord[]> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<AllocationRecord[]>(
        `/resources/${resourceId}/history`
      );
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงประวัติ';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    allocate,
    reclaim,
    fetchHistory,
  };
};
