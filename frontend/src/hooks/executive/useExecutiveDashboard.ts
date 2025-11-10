import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../api/client';
import { DashboardSummary, DashboardFilters } from '../../types/executive';

export const useExecutiveDashboard = (filters?: DashboardFilters) => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.region) params.append('region', filters.region);
      if (filters?.disasterType) params.append('disasterType', filters.disasterType);
      if (filters?.priority) params.append('priority', filters.priority);

      const response = await apiClient.get<DashboardSummary>(
        `/executive/dashboard/summary?${params.toString()}`
      );
      setSummary(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch dashboard summary';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return {
    summary,
    isLoading,
    error,
    refetch: fetchSummary,
  };
};
