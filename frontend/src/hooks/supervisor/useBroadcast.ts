import { useState } from 'react';
import { apiClient } from '../../api/client';

interface BroadcastPayload {
  title: string;
  message: string;
  priority: 'URGENT' | 'NORMAL';
  targetRole: 'FIELD_OFFICER' | 'ALL';
}

interface BroadcastResponse {
  success: boolean;
  message: string;
  recipientCount: number;
  broadcastId: string;
}

export const useBroadcast = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<BroadcastResponse | null>(null);

  const sendBroadcast = async (payload: BroadcastPayload) => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiClient.post<BroadcastResponse>('/notifications/broadcast', payload);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while sending the broadcast.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendBroadcast, isLoading, error, data };
};
