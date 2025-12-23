/**
 * Field Officer Survey API
 * API calls for field survey submissions
 */

import { apiClient } from './client';

export interface GPSCoordinates {
  lat: number;
  lng: number;
}

export interface FieldSurveySubmission {
  taskId?: string;
  incidentId?: string;
  villageId?: string;
  villageName: string;
  disasterType: string;
  severity: number;
  estimatedHouseholds: number;
  notes: string;
  gpsLocation: GPSCoordinates;
  polygon?: any; // GeoJSON polygon
  areaSize?: number; // in km²
  photoUrls?: string[];
  additionalData?: Record<string, any>;
}

export interface FieldSurveyResponse {
  id: string;
  fieldOfficerId: string;
  taskId?: string;
  incidentId?: string;
  villageId?: string;
  villageName: string;
  disasterType: string;
  severity: number;
  estimatedHouseholds: number;
  notes: string;
  gpsLocation: GPSCoordinates;
  photoUrls: string[];
  additionalData?: Record<string, any>;
  submittedAt: string;
  status: string;
}

export const fieldSurveyApi = {
  /**
   * Submit a new field survey
   */
  async submitSurvey(data: FieldSurveySubmission): Promise<FieldSurveyResponse> {
    const response = await apiClient.post('/field-officer/surveys', data);
    return response.data;
  },

  /**
   * Get all surveys submitted by current field officer
   */
  async getMySurveys(): Promise<FieldSurveyResponse[]> {
    const response = await apiClient.get('/field-officer/surveys/my-surveys');
    return response.data;
  },

  /**
   * Get a specific survey by ID
   */
  async getSurveyById(surveyId: string): Promise<FieldSurveyResponse> {
    const response = await apiClient.get(`/field-officer/surveys/${surveyId}`);
    return response.data;
  },

  /**
   * Upload images for survey
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await apiClient.post('/upload/survey-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.urls || [];
  },
};
