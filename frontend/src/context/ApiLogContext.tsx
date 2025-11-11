import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

// Define the structure for a single API log entry
export interface ApiLogEntry {
  id: string;
  method: string;
  url: string;
  status: number | 'PENDING';
  duration: number | null; // in ms
  timestamp: number; // Unix timestamp
  error: string | null;
  // Store request and response data for inspection
  requestData: any;
  responseData: any;
}

// Define the context value interface
interface ApiLogContextValue {
  logs: ApiLogEntry[];
  addLog: (log: Omit<ApiLogEntry, 'id' | 'timestamp'>) => string;
  updateLog: (id: string, updates: Partial<ApiLogEntry>) => void;
  clearLogs: () => void;
}

// Create the context
const ApiLogContext = createContext<ApiLogContextValue | undefined>(undefined);

// Max number of logs to keep
const MAX_LOGS = 50;

/**
 * ApiLog Provider component.
 * Manages the state of API logs and provides methods to interact with them.
 */
export const ApiLogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);

  // Function to add a new log entry (initial request)
  const addLog = useCallback((log: Omit<ApiLogEntry, 'id' | 'timestamp'>): string => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const newLog: ApiLogEntry = {
      ...log,
      id,
      timestamp: Date.now(),
      status: 'PENDING',
      duration: null,
      error: null,
      responseData: null,
    };

    setLogs((prevLogs) => {
      // Add new log to the beginning and trim the array
      const newLogs = [newLog, ...prevLogs];
      return newLogs.slice(0, MAX_LOGS);
    });

    return id;
  }, []);

  // Function to update an existing log entry (response or error)
  const updateLog = useCallback((id: string, updates: Partial<ApiLogEntry>) => {
    setLogs((prevLogs) => {
      const index = prevLogs.findIndex((log) => log.id === id);
      if (index === -1) return prevLogs;

      const updatedLog = {
        ...prevLogs[index],
        ...updates,
      };

      const newLogs = [...prevLogs];
      newLogs[index] = updatedLog;
      return newLogs;
    });
  }, []);

  // Function to clear all logs
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  const value = {
    logs,
    addLog,
    updateLog,
    clearLogs,
  };

  return <ApiLogContext.Provider value={value}>{children}</ApiLogContext.Provider>;
};

/**
 * Custom hook to access the API Log context.
 */
export const useApiLog = (): ApiLogContextValue => {
  const context = useContext(ApiLogContext);
  if (context === undefined) {
    throw new Error('useApiLog must be used within an ApiLogProvider');
  }
  return context;
};
