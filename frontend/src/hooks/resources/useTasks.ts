import { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';

interface Task {
  id: string;
  title: string;
  status: string;
}

interface UseTasksReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

export const useTasks = (): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch active tasks (not completed or cancelled)
        const response = await apiClient.get<Task[]>('/tasks', {
          params: {
            status: 'PENDING,IN_PROGRESS,SURVEYED',
          },
        });
        setTasks(response.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลภารกิจ';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return {
    tasks,
    isLoading,
    error,
  };
};
