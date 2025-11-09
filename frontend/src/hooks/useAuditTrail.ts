import { useState, useCallback } from 'react';

export interface AuditLogEntry {
  timestamp: Date;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'AI_EDIT';
  field: string;
  oldValue?: any;
  newValue?: any;
  source: 'USER' | 'AI';
  userId?: string;
}

export const useAuditTrail = () => {
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  const logChange = useCallback(
    (entry: Omit<AuditLogEntry, 'timestamp'>) => {
      const newEntry: AuditLogEntry = {
        ...entry,
        timestamp: new Date(),
      };
      setAuditLog((prev) => [...prev, newEntry]);
      
      // Optional: Send to backend immediately
      // await api.post('/audit-logs', newEntry);
    },
    []
  );

  const logAIEdit = useCallback(
    (field: string, aiValue: any, userValue: any) => {
      logChange({
        action: 'AI_EDIT',
        field,
        oldValue: aiValue,
        newValue: userValue,
        source: 'USER',
      });
    },
    [logChange]
  );

  const clearLog = useCallback(() => {
    setAuditLog([]);
  }, []);

  return {
    auditLog,
    logChange,
    logAIEdit,
    clearLog,
  };
};
