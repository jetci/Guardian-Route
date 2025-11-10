import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SupervisorTaskView, TaskFilters } from '../../types/supervisor';

interface KanbanContextValue {
  // State
  tasks: SupervisorTaskView[];
  selectedTaskId: string | null;
  isLoading: boolean;
  error: string | null;
  filters: TaskFilters;
  
  // Actions
  setTasks: (tasks: SupervisorTaskView[]) => void;
  selectTask: (taskId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  applyFilters: (filters: TaskFilters) => void;
  updateTask: (taskId: string, updates: Partial<SupervisorTaskView>) => void;
  refreshTasks: () => Promise<void>;
}

const KanbanContext = createContext<KanbanContextValue | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within KanbanProvider');
  }
  return context;
};

interface KanbanProviderProps {
  children: ReactNode;
  onRefresh?: () => Promise<SupervisorTaskView[]>;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({ children, onRefresh }) => {
  const [tasks, setTasks] = useState<SupervisorTaskView[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({});

  const selectTask = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
  }, []);

  const applyFilters = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<SupervisorTaskView>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, []);

  const refreshTasks = useCallback(async () => {
    if (!onRefresh) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const newTasks = await onRefresh();
      setTasks(newTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh tasks');
    } finally {
      setIsLoading(false);
    }
  }, [onRefresh]);

  const value: KanbanContextValue = {
    tasks,
    selectedTaskId,
    isLoading,
    error,
    filters,
    setTasks,
    selectTask,
    setLoading: setIsLoading,
    setError,
    applyFilters,
    updateTask,
    refreshTasks,
  };

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
};
