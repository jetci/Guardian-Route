export enum Role {
  FIELD_OFFICER = 'FIELD_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  EXECUTIVE = 'EXECUTIVE',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface Village {
  id: string;
  villageNo: number;
  name: string;
  alternateNames: string[];
  centerPoint?: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  boundary?: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  households?: number;
  population?: number;
  area?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    incidents: number;
    tasks: number;
    surveys: number;
  };
}

export interface VillageStatistics {
  totalVillages: number;
  totalHouseholds: number;
  totalPopulation: number;
  totalArea: number;
  averageHouseholdsPerVillage: number;
  averagePopulationPerVillage: number;
}
