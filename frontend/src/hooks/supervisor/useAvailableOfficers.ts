import { useState, useEffect, useCallback } from 'react';
import { AvailableOfficer } from '../../types/supervisor';
import { apiClient } from '../../api/client';

export const useAvailableOfficers = () => {
  const [officers, setOfficers] = useState<AvailableOfficer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOfficers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<AvailableOfficer[]>('/users/available-officers');
      
      // Sort by availability and task count (least busy first)
      const sortedOfficers = response.data.sort((a, b) => {
        if (a.isAvailable !== b.isAvailable) {
          return a.isAvailable ? -1 : 1;
        }
        return a.currentTaskCount - b.currentTaskCount;
      });

      setOfficers(sortedOfficers);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch available officers';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  return {
    officers,
    isLoading,
    error,
    refreshOfficers: fetchOfficers,
  };
};
