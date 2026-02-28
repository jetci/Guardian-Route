import type { User, Incident, Village } from './index';

export enum ReportType {
  INCIDENT = 'INCIDENT',
  TASK = 'TASK',
  SURVEY = 'SURVEY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM',
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  PENDING_REVIEW = 'PENDING_REVIEW', // Added
  UNDER_REVIEW = 'UNDER_REVIEW',
  REVISION_REQUESTED = 'REVISION_REQUESTED', // Added/Fixed
  REVISION_REQUIRED = 'REVISION_REQUIRED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Report {
  id: string;
  type: ReportType;
  status: ReportStatus;

  // Report content
  title: string;
  summary?: string;
  details?: Record<string, any>;

  // Damage assessment
  totalDamageEstimate?: number;
  affectedHouseholds?: number;
  affectedPersons?: number;

  // AI Analysis
  aiAnalysis?: Record<string, any>;

  // Photos
  photoUrls: string[];

  // Template and Period
  templateId?: string;
  periodStart?: string;
  periodEnd?: string;
  metadata?: Record<string, any>;

  // PDF Generation
  pdfUrl?: string;
  pdfGeneratedAt?: string;

  // Review
  reviewNotes?: string;
  reviewedAt?: string;

  // Timestamps
  submittedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;

  // Foreign Keys
  incidentId?: string;
  authorId: string;
  reviewedById?: string;

  // Relations
  incident?: Incident;
  author: User;
  reviewedBy?: User;
  village?: Village;
}

export interface CreateReportDto {
  type: ReportType;
  title: string;
  summary?: string;
  details?: Record<string, any>;
  totalDamageEstimate?: number;
  affectedHouseholds?: number;
  affectedPersons?: number;
  aiAnalysis?: Record<string, any>;
  photoUrls?: string[];
  templateId?: string;
  periodStart?: string;
  periodEnd?: string;
  metadata?: Record<string, any>;
  incidentId?: string;
  status?: ReportStatus;
}

export interface UpdateReportDto extends Partial<CreateReportDto> { }

export interface FilterReportDto {
  type?: ReportType;
  status?: ReportStatus;
  incidentId?: string;
  authorId?: string;
  periodStartFrom?: string;
  periodStartTo?: string;
  createdFrom?: string;
  createdTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SubmitReportDto {
  notes?: string;
}

export interface ReviewReportDto {
  status: ReportStatus.APPROVED | ReportStatus.REVISION_REQUIRED | ReportStatus.REJECTED | ReportStatus.REVISION_REQUESTED;
  comments?: string; // Changed from reviewNotes to match usage
  reviewNotes?: string;
}

export interface GeneratePdfDto {
  forceRegenerate?: boolean;
  includeImages?: boolean;
  template?: string;
}

export interface ReportStatistics {
  total: number;
  byStatus: Record<string, number>;
  byType: Record<string, number>;
  avgDamageEstimate: number;
  totalAffectedHouseholds: number;
  totalAffectedPersons: number;
}

export interface ReportListResponse {
  data: Report[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Report Template Types
export interface ReportTemplate {
  id: string;
  name: string;
  description?: string;
  type: ReportType;
  structure: ReportTemplateField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReportTemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'table' | 'image';
  required?: boolean;
  defaultValue?: any;
  options?: string[]; // For select fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  order: number;
}
