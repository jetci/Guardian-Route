export enum ExportJobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

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
