import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface VillageFromAPI {
  id: string;
  villageNo: number;
  name: string;
  alternateNames: string[];
  households: number;
  population: number;
  area: number;
  description: string;
  centerPoint: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  boundary: {
    type: string;
    coordinates: [number, number][][]; // GeoJSON format [lng, lat]
  } | null;
}

export interface Village {
  id: number;
  name: string;
  moo: number;
  lat: number;
  lng: number;
  population?: number;
  households?: number;
  boundary?: [number, number][]; // Leaflet format [lat, lng]
}

/**
 * แปลง GeoJSON coordinates [lng, lat] เป็น Leaflet format [lat, lng]
 */
function convertBoundary(geoJsonBoundary: { coordinates: [number, number][][] } | null): [number, number][] | undefined {
  if (!geoJsonBoundary || !geoJsonBoundary.coordinates || !geoJsonBoundary.coordinates[0]) {
    return undefined;
  }
  
  // GeoJSON: [lng, lat] -> Leaflet: [lat, lng]
  return geoJsonBoundary.coordinates[0].map(coord => [coord[1], coord[0]] as [number, number]);
}

/**
 * ดึงข้อมูลหมู่บ้านทั้งหมดจาก API
 */
export async function fetchVillages(): Promise<Village[]> {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<VillageFromAPI[]>(`${API_URL}/api/villages`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return response.data.map(v => {
      // Default coordinates (Tambon center) if centerPoint is missing
      const lat = v.centerPoint?.coordinates?.[1] || 19.9167;
      const lng = v.centerPoint?.coordinates?.[0] || 99.2333;
      
      return {
        id: v.villageNo,
        name: v.name,
        moo: v.villageNo,
        lat: lat,
        lng: lng,
        population: v.population,
        households: v.households,
        boundary: convertBoundary(v.boundary)
      };
    });
  } catch (error) {
    console.error('Error fetching villages:', error);
    throw error;
  }
}

/**
 * ดึงข้อมูลหมู่บ้านตามหมู่ที่
 */
export async function fetchVillageByNo(villageNo: number): Promise<Village | null> {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<VillageFromAPI>(`${API_URL}/api/villages/no/${villageNo}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const v = response.data;
    const lat = v.centerPoint?.coordinates?.[1] || 19.9167;
    const lng = v.centerPoint?.coordinates?.[0] || 99.2333;
    
    return {
      id: v.villageNo,
      name: v.name,
      moo: v.villageNo,
      lat: lat,
      lng: lng,
      population: v.population,
      households: v.households,
      boundary: convertBoundary(v.boundary)
    };
  } catch (error) {
    console.error(`Error fetching village ${villageNo}:`, error);
    return null;
  }
}
