import { apiClient } from './client';

export interface GeoBoundary {
  id: string;
  name: string;
  type: 'village' | 'district' | 'province' | 'custom';
  geojson: any; // GeoJSON object
  properties?: any;
  villageId?: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoundaryDto {
  name: string;
  type: 'village' | 'district' | 'province' | 'custom';
  geojson: any;
  properties?: any;
  villageId?: string;
}

export interface UpdateBoundaryDto {
  name?: string;
  type?: 'village' | 'district' | 'province' | 'custom';
  geojson?: any;
  properties?: any;
  villageId?: string;
}

export interface VillageBoundary {
  id: string;
  villageNo: number;
  name: string;
  boundary: any; // GeoJSON Polygon
  centerPoint: any; // GeoJSON Point
}

const boundariesService = {
  // Get all boundaries
  async getAllBoundaries(): Promise<GeoBoundary[]> {
    const response = await apiClient.get('/admin/geojson');
    return response.data;
  },

  // Get specific boundary
  async getBoundary(id: string): Promise<GeoBoundary> {
    const response = await apiClient.get(`/admin/geojson/${id}`);
    return response.data;
  },

  // Upload GeoJSON file
  async uploadGeoJSON(data: CreateBoundaryDto): Promise<GeoBoundary> {
    const response = await apiClient.post('/admin/geojson/upload', data);
    return response.data;
  },

  // Save drawn boundary
  async saveDrawnBoundary(data: CreateBoundaryDto): Promise<GeoBoundary> {
    const response = await apiClient.post('/admin/boundaries/draw', data);
    return response.data;
  },

  // Update boundary
  async updateBoundary(id: string, data: UpdateBoundaryDto): Promise<GeoBoundary> {
    const response = await apiClient.put(`/admin/geojson/${id}`, data);
    return response.data;
  },

  // Delete boundary
  async deleteBoundary(id: string): Promise<void> {
    await apiClient.delete(`/admin/geojson/${id}`);
  },

  // Get village boundaries
  async getVillageBoundaries(): Promise<VillageBoundary[]> {
    const response = await apiClient.get('/admin/villages/boundaries');
    return response.data;
  },
};

export default boundariesService;
