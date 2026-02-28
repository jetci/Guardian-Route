import { api } from './client';

export enum GeoJsonType {
  VILLAGE_BOUNDARY = 'village_boundary',
  DISTRICT_BOUNDARY = 'district_boundary',
  RISK_ZONE = 'risk_zone',
  INFRASTRUCTURE = 'infrastructure',
}

export interface GeoJsonValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  features: number;
  geometryTypes: string[];
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  properties?: string[];
}

export interface GeoJsonUploadResponse {
  success: boolean;
  message: string;
  validation: GeoJsonValidationResult;
  preview?: any;
  savedCount?: number;
}

export const geojsonApi = {
  validateGeoJson: async (
    file: File,
    type: GeoJsonType
  ): Promise<GeoJsonUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await api.post('/villages/upload/geojson/validate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadGeoJson: async (
    file: File,
    type: GeoJsonType,
    description?: string
  ): Promise<GeoJsonUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    if (description) {
      formData.append('description', description);
    }

    const response = await api.post('/villages/upload/geojson', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
