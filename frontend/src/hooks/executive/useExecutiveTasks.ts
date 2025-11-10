import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../../api/client';
import { SupervisorTask } from '../../types/supervisor';
import { DashboardFilters } from '../../types/executive';

export const useExecutiveTasks = (filters?: DashboardFilters) => {
  const [tasks, setTasks] = useState<SupervisorTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.region) params.append('region', filters.region);
      if (filters?.disasterType) params.append('disasterType', filters.disasterType);
      if (filters?.priority) params.append('priority', filters.priority);

      const response = await apiClient.get<SupervisorTask[]>(
        `/tasks/supervisor-view?${params.toString()}`
      );
      setTasks(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    refetch: fetchTasks,
  };
};
