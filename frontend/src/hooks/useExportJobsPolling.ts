import { useState, useEffect } from 'react';
import { getExportJobs } from '../api/export';
import type { ExportJob } from '../api/export';
import { ExportJobStatus } from '../types/export';

const POLLING_INTERVAL_MS = 10000; // 10 seconds

/**
 * Custom hook to fetch and poll the user's export jobs.
 * It stops polling for jobs that are in a final state (DONE or FAILED).
 */
export function useExportJobsPolling() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    try {
      // Fetch all jobs for the current user
      const fetchedJobs = await getExportJobs();
      setJobs(fetchedJobs);
      setError(null);
    } catch (err) {
      console.error('Error fetching export jobs:', err);
      setError('Failed to fetch export jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchJobs();

    // Polling logic
    const intervalId = setInterval(() => {
      // Only poll if there are jobs that are not in a final state
      const shouldPoll = jobs.some(
        (job) =>
          job.status === ExportJobStatus.PENDING ||
          job.status === ExportJobStatus.PROCESSING,
      );

      if (shouldPoll || isLoading) {
        fetchJobs();
      }
    }, POLLING_INTERVAL_MS);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [jobs, isLoading]); // Re-run effect when jobs or isLoading changes to update shouldPoll logic

  return { jobs, isLoading, error, refetch: fetchJobs };
}
