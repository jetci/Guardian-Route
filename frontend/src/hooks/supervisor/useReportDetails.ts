import { useState, useCallback } from 'react';
import { apiClient } from '../../api/client';

export interface ReportDetails {
  id: string;
  taskId: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REVISION_REQUESTED';
  
  // Basic Info
  title: string;
  summary: string;
  
  // Damage Assessment
  severity: string;
  damageCategories: string[];
  estimatedCost: number;
  
  // Affected Area
  affectedHouseholds: number;
  affectedPopulation: number;
  
  // Infrastructure
  infrastructureDamage: string[];
  infrastructureDetails: string;
  
  // Casualties
  casualties: number;
  injuries: number;
  missing: number;
  casualtyDetails: string;
  
  // Resources & Response
  urgentPriorityItems: Array<{ item: string; quantity: string }>;
  respondingAgencies: Array<{ name: string; role: string }>;
  
  // Images & AI
  images: string[];
  aiAnalysis?: {
    damageAssessment: string;
    urgentNeeds: string[];
    recommendations: string[];
  };
  
  // Recommendations
  generalRecommendations: string;
  policyRecommendations: string;
  preventionMeasures: string;
  
  // Audit
  auditLog?: Array<{
    timestamp: Date;
    action: string;
    field?: string;
    oldValue?: string;
    newValue?: string;
  }>;
  
  // Metadata
  submittedBy: {
    id: string;
    name: string;
  };
  submittedAt: Date;
  reviewedBy?: {
    id: string;
    name: string;
  };
  reviewedAt?: Date;
  reviewComments?: string;
}

export const useReportDetails = (reportId: string | null) => {
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    if (!reportId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ReportDetails>(`/reports/${reportId}/details`);
      setReport(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch report details';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  const approveReport = useCallback(async () => {
    if (!reportId) return;

    try {
      await apiClient.patch(`/reports/${reportId}/approve`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve report';
      throw new Error(errorMessage);
    }
  }, [reportId]);

  const requestRevision = useCallback(async (comments: string) => {
    if (!reportId) return;

    try {
      await apiClient.patch(`/reports/${reportId}/request-revision`, { comments });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request revision';
      throw new Error(errorMessage);
    }
  }, [reportId]);

  return {
    report,
    isLoading,
    error,
    fetchReport,
    approveReport,
    requestRevision,
  };
};
