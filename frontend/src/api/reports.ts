import { apiClient } from './client';
import {
  type Report,
  type CreateReportDto,
  type UpdateReportDto,
  type FilterReportDto,
  type SubmitReportDto,
  type ReviewReportDto,
  type GeneratePdfDto,
  type ReportStatistics,
  type ReportListResponse,
} from '../types/Report';

/**
 * Create a new report
 */
export const createReport = async (data: CreateReportDto): Promise<Report> => {
  const response = await apiClient.post('/reports', data);
  return response.data;
};

/**
 * Get all reports with filtering and pagination
 */
export const getReports = async (
  filters?: FilterReportDto
): Promise<ReportListResponse> => {
  const response = await apiClient.get('/reports', {
    params: filters,
  });
  return response.data;
};

/**
 * Get a single report by ID
 */
export const getReportById = async (id: string): Promise<Report> => {
  const response = await apiClient.get(`/reports/${id}`);
  return response.data;
};

/**
 * Update a report
 */
export const updateReport = async (
  id: string,
  data: UpdateReportDto
): Promise<Report> => {
  const response = await apiClient.patch(`/reports/${id}`, data);
  return response.data;
};

/**
 * Delete a report
 */
export const deleteReport = async (id: string): Promise<{ message: string }> => {
  const response = await apiClient.delete(`/reports/${id}`);
  return response.data;
};

/**
 * Submit a report for review
 */
export const submitReport = async (
  id: string,
  data?: SubmitReportDto
): Promise<Report> => {
  const response = await apiClient.post(`/reports/${id}/submit`, data || {});
  return response.data;
};

/**
 * Review a report (SUPERVISOR, EXECUTIVE, ADMIN only)
 */
export const reviewReport = async (
  id: string,
  data: ReviewReportDto
): Promise<Report> => {
  const response = await apiClient.post(`/reports/${id}/review`, data);
  return response.data;
};

/**
 * Generate PDF for a report
 */
export const generateReportPdf = async (
  id: string,
  data?: GeneratePdfDto
): Promise<{ message: string; pdfUrl: string; generatedAt: string }> => {
  const response = await apiClient.post(
    `/reports/${id}/generate-pdf`,
    data || {}
  );
  return response.data;
};

/**
 * Get report statistics
 */
export const getReportStatistics = async (filters?: {
  periodStart?: string;
  periodEnd?: string;
  type?: string;
}): Promise<ReportStatistics> => {
  const response = await apiClient.get('/reports/statistics', {
    params: filters,
  });
  return response.data;
};

/**
 * Download PDF file
 */
export const downloadReportPdf = async (pdfUrl: string, filename: string) => {
  const response = await apiClient.get(pdfUrl, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
