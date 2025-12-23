import { apiClient } from './client';
import type { Village, VillageStatistics } from '../types';

/**
 * Village API - เชื่อมต่อกับ Backend API
 * Transform data จาก Backend format เป็น Frontend format
 */

// Helper type for Leaflet coordinates
export interface LeafletVillage {
  id: string; // UUID from backend
  villageNo: number; // หมู่ที่
  name: string;
  moo: number;
  lat: number;
  lng: number;
  population?: number;
  malePopulation?: number;
  femalePopulation?: number;
  households?: number;
  boundary?: [number, number][]; // Leaflet format [lat, lng]
  alternateNames?: string[];
  color?: string; // Map boundary color
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

  console.log(`Transforming village ${village.name}:`, {
    rawBoundary: village.boundary,
    boundaryType: typeof village.boundary,
    hasCoordinates: village.boundary?.coordinates ? 'yes' : 'no'
  });

  const boundary = convertBoundaryToLeaflet(village.boundary);
  console.log(`Converted boundary for ${village.name}:`, boundary);

  return {
    id: village.id, // UUID
    villageNo: village.villageNo,
    name: village.name,
    moo: village.villageNo,
    lat,
    lng,
    population: village.population,
    malePopulation: village.populationMale,
    femalePopulation: village.populationFemale,
    households: village.households,
    boundary,
    alternateNames: village.alternateNames || [],
    color: '#3b82f6' // Default blue color for map boundaries
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
    console.log('Raw villages from backend:', response.data);
    const transformed = response.data.map(transformToLeaflet);
    console.log('Transformed villages:', transformed);
    return transformed;
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

  /**
   * สร้างหมู่บ้านใหม่ (ADMIN only)
   */
  create: async (data: {
    name: string;
    villageNo: number;
    lat?: number;
    lng?: number;
    population?: number;
    households?: number;
  }): Promise<Village> => {
    const response = await apiClient.post<Village>('/villages', data);
    return response.data;
  },

  /**
   * อัปเดตข้อมูลหมู่บ้าน (ADMIN only)
   */
  update: async (id: number | string, data: {
    name?: string;
    villageNo?: number;
    lat?: number;
    lng?: number;
    population?: number;
    households?: number;
  }): Promise<Village> => {
    const response = await apiClient.patch<Village>(`/villages/${id}`, data);
    return response.data;
  },

  /**
   * ลบหมู่บ้าน (ADMIN only)
   */
  delete: async (id: number | string): Promise<void> => {
    await apiClient.delete(`/villages/${id}`);
  },
};
