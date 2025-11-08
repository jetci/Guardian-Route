import type { FormField } from './FormBuilder';

export interface SurveyTemplate {
  id: string;
  name: string;
  description: string | null;
  fields: FormField[];
  isActive: boolean;
}

export interface Survey {
  id: string;
  incidentId: string | null;
  villageId: string | null;
  templateId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  completedAt: Date | null;
  polygon: any | null; // GeoJSON
  createdById: string;
  template?: SurveyTemplate;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  data: Record<string, any>; // Actual response data
  submittedAt: Date;
  submittedById: string;
}
