import type { FormField } from './FormBuilder';

export interface SurveyData {
  // Step 1: Incident Info & Map
  taskId?: string;
  villageId: string;
  villageName: string;
  disasterType: string;
  otherDisasterType?: string;
  surveyDate: string;
  gpsLocation: { lat: number; lng: number } | null;
  polygon: any | null; // GeoJSON
  photoUrls: string[];

  // Step 2: Affected People
  affectedHouseholds: number;
  affectedPeople: number;
  injuredCount: number;
  deadCount: number;
  missingCount: number;
  evacuatedPeople: number;
  evacuatedHouseholds: number;

  // Step 3: Damage Assessment
  // 3.1 Buildings
  damagedHousesPartial: number;
  damagedHousesFull: number; // implied by "houses" usually, but let's be specific if needed, or just use one field
  damagedHighRise: number;
  damagedFactories: number;
  damagedTemples: number;
  damagedGovtPlaces: number;
  damagedOther: string;
  estimatedBuildingDamage: number; // Baht

  // 3.2 Agriculture
  cropRai: number;
  riceRai: number;
  orchardRai: number;
  fishPonds: number;
  shrimpPonds: number;
  livestockCows: number;
  livestockPigs: number;
  livestockPoultry: number;
  livestockOther: string;
  estimatedAgriDamage: number; // Baht

  // 3.3 Public Utilities
  roadsAgri: number;
  weirs: number;
  bridgeNecks: number;
  bridges: number;
  dams: number;
  dikes: number;
  landslides: number;
  utilityOther: string;
  estimatedUtilityDamage: number; // Baht

  totalEstimatedDamage: number; // Sum of all damage

  // Step 4: Relief
  reliefOperations: string;

  // Step 5: Resources Used
  waterTrucks: number;
  rescueTrucks: number;
  boats: number;
  cars: number;
  pumps: number;
  backhoes: number;
  trucks6Wheel: number;
  loaders: number;
  chainsaws: number;
  cranes: number;
  govtAgenciesCount: number;
  privateGroupsCount: number;
  volunteersCount: number;

  // Step 6: Operations (Agencies)
  involvedAgencies: {
    localGovt: boolean;
    privateSector: boolean;
    other: string;
  };

  // Step 7: Certification
  reportType: 'INFO' | 'DISASTER_ZONE' | 'ASSISTANCE';
}

export const INITIAL_SURVEY_DATA: SurveyData = {
  villageId: '',
  villageName: '',
  disasterType: '',
  surveyDate: new Date().toISOString().split('T')[0],
  gpsLocation: null,
  polygon: null,
  photoUrls: [],
  affectedHouseholds: 0,
  affectedPeople: 0,
  injuredCount: 0,
  deadCount: 0,
  missingCount: 0,
  evacuatedPeople: 0,
  evacuatedHouseholds: 0,
  damagedHousesPartial: 0,
  damagedHousesFull: 0,
  damagedHighRise: 0,
  damagedFactories: 0,
  damagedTemples: 0,
  damagedGovtPlaces: 0,
  damagedOther: '',
  estimatedBuildingDamage: 0,
  cropRai: 0,
  riceRai: 0,
  orchardRai: 0,
  fishPonds: 0,
  shrimpPonds: 0,
  livestockCows: 0,
  livestockPigs: 0,
  livestockPoultry: 0,
  livestockOther: '',
  estimatedAgriDamage: 0,
  roadsAgri: 0,
  weirs: 0,
  bridgeNecks: 0,
  bridges: 0,
  dams: 0,
  dikes: 0,
  landslides: 0,
  utilityOther: '',
  estimatedUtilityDamage: 0,
  totalEstimatedDamage: 0,
  reliefOperations: '',
  waterTrucks: 0,
  rescueTrucks: 0,
  boats: 0,
  cars: 0,
  pumps: 0,
  backhoes: 0,
  trucks6Wheel: 0,
  loaders: 0,
  chainsaws: 0,
  cranes: 0,
  govtAgenciesCount: 0,
  privateGroupsCount: 0,
  volunteersCount: 0,
  involvedAgencies: {
    localGovt: false,
    privateSector: false,
    other: ''
  },
  reportType: 'INFO'
};

// --- Dynamic Survey Types (Supervisor Module) ---


export interface SurveyTemplate {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface Survey {
  id: string;
  templateId: string;
  template?: SurveyTemplate;
  data: Record<string, any>;
  incidentId?: string;
  taskId?: string;
  submittedBy: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

