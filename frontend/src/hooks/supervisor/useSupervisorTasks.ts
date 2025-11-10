import { useState, useEffect, useCallback } from 'react';
import { SupervisorTaskView, TaskFilters, SupervisorTasksResponse } from '../../types/supervisor';
import { apiClient } from '../../api/client';

export const useSupervisorTasks = (initialFilters?: TaskFilters) => {
  const [tasks, setTasks] = useState<SupervisorTaskView[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>(initialFilters || {});

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.incidentType) params.append('incidentType', filters.incidentType);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);

      const response = await apiClient.get<SupervisorTasksResponse>(
        `/tasks/supervisor-view?${params.toString()}`
      );

      setTasks(response.data.tasks);
      return response.data.tasks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const applyFilters = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
  }, []);

  const refreshTasks = useCallback(() => {
    return fetchTasks();
  }, [fetchTasks]);

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    isLoading,
    error,
    filters,
    applyFilters,
    refreshTasks,
  };
};
