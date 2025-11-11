import client from './client';
import type { ExportJobStatus } from '../types/export'; // Assuming a types file exists

// Mock user ID for now, as per instruction

export interface ExportJob {
  jobId: string;
  exportType: 'PDF' | 'EXCEL';
  status: ExportJobStatus;
  fileName: string | null;
  downloadUrl: string | null;
  createdAt: string;
  updatedAt: string;
  error: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface GetJobsResponse {
  jobs: ExportJob[];
}

/**
 * Fetches the list of export jobs for the current user.
 * @param status Optional filter for job status.
 */
export async function getExportJobs(status?: ExportJobStatus): Promise<ExportJob[]> {
  const params = new URLSearchParams();
  if (status) {
    params.append('status', status);
  }
  // NOTE: The backend API filters by userId from the JWT, so we don't need to pass it here.
  // We assume the client is configured to send the necessary auth token.
  const response = await client.get<ExportJob[]>(`/export/jobs?${params.toString()}`);
  return response.data;
}

/**
 * Fetches the status of a single export job.
 * @param jobId The ID of the job to fetch.
 */
export async function getExportJobStatus(jobId: string): Promise<ExportJob> {
  const response = await client.get<ExportJob>(`/export/job/${jobId}`);
  return response.data;
}

/**
 * Initiates the secure download of a completed export file.
 * @param jobId The ID of the completed job to download.
 * @param fileName The expected file name for the download.
 */
export async function downloadExportFile(jobId: string, fileName: string) {
  try {
    // Use the client to make a GET request to the secure download endpoint
    const response = await client.get(`/export/job/${jobId}/download`, {
      responseType: 'blob', // Important: The response is a file stream/blob
    });

    // Create a blob URL for the file
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName); // Set the file name
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url); // Clean up the blob URL

    console.log(`Download initiated for job ${jobId}: ${fileName}`);
  } catch (error) {
    console.error('Failed to download export file:', error);
    // Assuming the client handles error responses (e.g., 403 Forbidden, 404 Not Found)
    // and throws an error that can be caught here.
    throw new Error('Failed to download file. Check job status and permissions.');
  }
}
