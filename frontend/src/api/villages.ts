import { apiClient } from './client';
import type { Village, VillageStatistics } from '../types';

/**
 * Village API - เชื่อมต่อกับ Backend API
 * Transform data จาก Backend format เป็น Frontend format
 */

// Helper type for Leaflet coordinates
export interface LeafletVillage {
  id: number;
  name: string;
  moo: number;
  lat: number;
  lng: number;
  population?: number;
  households?: number;
  boundary?: [number, number][]; // Leaflet format [lat, lng]
  alternateNames?: string[];
}

/**
 * แปลง GeoJSON coordinates [lng, lat] เป็น Leaflet format [lat, lng]
 */
function convertBoundaryToLeaflet(
  geoJsonBoundary: { coordinates: number[][][] } | null | undefined
): [number, number][] | undefined {
  if (!geoJsonBoundary || !geoJsonBoundary.coordinates || !geoJsonBoundary.coordinates[0]) {
    return undefined;
  }
  
  // GeoJSON: [lng, lat] -> Leaflet: [lat, lng]
  return geoJsonBoundary.coordinates[0].map(coord => [coord[1], coord[0]] as [number, number]);
}

/**
 * Transform Village from Backend to Leaflet format
 */
function transformToLeaflet(village: Village): LeafletVillage {
  const lat = village.centerPoint?.coordinates?.[1] || 19.9167;
  const lng = village.centerPoint?.coordinates?.[0] || 99.2333;
  
  return {
    id: village.villageNo,
    name: village.name,
    moo: village.villageNo,
    lat,
    lng,
    population: village.population,
    households: village.households,
    boundary: convertBoundaryToLeaflet(village.boundary),
    alternateNames: village.alternateNames || []
  };
}

export const villagesApi = {
  /**
   * ดึงข้อมูลหมู่บ้านทั้งหมด (Backend format)
   */
  getAll: async (): Promise<Village[]> => {
    const response = await apiClient.get<Village[]>('/villages');
    return response.data;
  },

  /**
   * ดึงข้อมูลหมู่บ้านทั้งหมด (Leaflet format สำหรับแผนที่)
   */
  getAllForMap: async (): Promise<LeafletVillage[]> => {
    const response = await apiClient.get<Village[]>('/villages');
    return response.data.map(transformToLeaflet);
  },

  /**
   * ดึงข้อมูลหมู่บ้านตาม ID (Backend format)
   */
  getById: async (id: string): Promise<Village> => {
    const response = await apiClient.get<Village>(`/villages/${id}`);
    return response.data;
  },

  /**
   * ดึงข้อมูลหมู่บ้านตามหมู่ที่ (Backend format)
   */
  getByVillageNo: async (villageNo: number): Promise<Village> => {
    const response = await apiClient.get<Village>(`/villages/no/${villageNo}`);
    return response.data;
  },

  /**
   * ดึงข้อมูลหมู่บ้านตามหมู่ที่ (Leaflet format)
   */
  getByVillageNoForMap: async (villageNo: number): Promise<LeafletVillage> => {
    const response = await apiClient.get<Village>(`/villages/no/${villageNo}`);
    return transformToLeaflet(response.data);
  },

  /**
   * ดึงสถิติหมู่บ้าน
   */
  getStatistics: async (): Promise<VillageStatistics> => {
    const response = await apiClient.get<VillageStatistics>('/villages/statistics');
    return response.data;
  },
};
