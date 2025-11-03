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

export enum IncidentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum DisasterType {
  FLOOD = 'FLOOD',
  LANDSLIDE = 'LANDSLIDE',
  FIRE = 'FIRE',
  STORM = 'STORM',
  EARTHQUAKE = 'EARTHQUAKE',
  OTHER = 'OTHER',
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export interface Incident {
  id: string;
  title: string;
  description?: string;
  status: IncidentStatus;
  priority: Priority;
  location: GeoJSONPoint;
  address?: string;
  villageId?: string;
  disasterType: DisasterType;
  reportedAt: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  village?: Village;
  _count?: {
    tasks: number;
    surveys: number;
    reports: number;
  };
}

export interface CreateIncidentDto {
  title: string;
  description?: string;
  disasterType: DisasterType;
  priority?: Priority;
  location: GeoJSONPoint;
  address?: string;
  villageId?: string;
}

export interface UpdateIncidentDto extends Partial<CreateIncidentDto> {
  status?: IncidentStatus;
  resolvedAt?: string;
}
