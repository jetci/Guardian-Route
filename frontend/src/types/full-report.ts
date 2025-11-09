// Full Report Types

export enum ReportSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export type DamageCategory =
  | 'STRUCTURAL'
  | 'ENVIRONMENTAL'
  | 'ECONOMIC'
  | 'SOCIAL';

export type InfrastructureType =
  | 'ROADS'
  | 'BRIDGES'
  | 'BUILDINGS'
  | 'UTILITIES'
  | 'SCHOOLS'
  | 'HOSPITALS'
  | 'WATER_SUPPLY'
  | 'POWER_GRID';

export type ResourceCategory =
  | 'FOOD'
  | 'WATER'
  | 'SHELTER'
  | 'MEDICAL'
  | 'RESCUE_EQUIPMENT'
  | 'TRANSPORTATION'
  | 'COMMUNICATION';

export type ResponseStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface AIAnalysisResult {
  damageLevel: 'low' | 'medium' | 'high' | 'critical';
  damageTypes: string[];
  affectedStructures: string[];
  riskFactors: string[];
  summary: string;
  confidence: number; // 0-1
  tags: string[];
  analyzedAt: Date;
  modelVersion: string;
}

export interface FullReportFormData {
  // Step 1: Basic Information
  taskId: string;
  title: string;
  summary: string;

  // Step 2: Damage Assessment
  severity: ReportSeverity;
  damageDescription: string;
  damageCategories: DamageCategory[];

  // Step 3: Affected Area
  affectedHouseholds: number;
  affectedPopulation: number;
  affectedAreaDescription: string;
  geoJsonArea?: any; // GeoJSON Polygon from preliminary report

  // Step 4: Infrastructure Damage
  infrastructureTypes: InfrastructureType[];
  infrastructureDetails: string;
  estimatedRepairCost?: number;

  // Step 5: Casualties
  casualties: number;
  injuries: number;
  missing: number;
  casualtyDetails?: string;

  // Step 6: Resources Needed
  resourceCategories: ResourceCategory[];
  resourceDetails: string;
  urgentPriorityItems: string[];

  // Step 7: Current Response
  responseStatus: ResponseStatus;
  responseDescription: string;
  respondingAgencies: string[];
  resourcesDeployed?: string;

  // Step 8: Images
  images: File[];
  imageUrls: string[];

  // Step 9: AI Analysis
  aiAnalysis: AIAnalysisResult | null;
  aiAnalysisEdited?: string;
  aiAnalysisModified: boolean;

  // Step 10: Recommendations
  shortTermRecommendations: string;
  longTermRecommendations: string;
  preventiveMeasures: string;
  priorityActions: string[];
}

export interface StepValidation {
  [step: number]: {
    isValid: boolean;
    errors: string[];
  };
}

export interface WizardState {
  currentStep: number;
  totalSteps: number;
  formData: FullReportFormData;
  validation: StepValidation;
  isDraft: boolean;
  draftId?: string;
  lastSaved: Date | null;
  isSubmitting: boolean;
}

export const initialFormData: FullReportFormData = {
  taskId: '',
  title: '',
  summary: '',
  severity: ReportSeverity.LOW,
  damageDescription: '',
  damageCategories: [],
  affectedHouseholds: 0,
  affectedPopulation: 0,
  affectedAreaDescription: '',
  infrastructureTypes: [],
  infrastructureDetails: '',
  casualties: 0,
  injuries: 0,
  missing: 0,
  resourceCategories: [],
  resourceDetails: '',
  urgentPriorityItems: [],
  responseStatus: 'NOT_STARTED',
  responseDescription: '',
  respondingAgencies: [],
  images: [],
  imageUrls: [],
  aiAnalysis: null,
  aiAnalysisModified: false,
  shortTermRecommendations: '',
  longTermRecommendations: '',
  preventiveMeasures: '',
  priorityActions: [],
};
