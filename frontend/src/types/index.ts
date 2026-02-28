export enum Role {
  FIELD_OFFICER = 'FIELD_OFFICER',
  SUPERVISOR = 'SUPERVISOR',
  EXECUTIVE = 'EXECUTIVE',
  ADMIN = 'ADMIN',
  DEVELOPER = 'DEVELOPER',
}

export interface User {
  id: string;
  email: string;
  username?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  isActive?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role?: Role;
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
  populationMale?: number;
  populationFemale?: number;
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
  DROUGHT = 'DROUGHT',
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
  images?: string[];
  villageId?: string;
  affectedArea?: any;
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
  images?: string[];
  villageId?: string;
  affectedArea?: any; // GeoJSON FeatureCollection
  estimatedHouseholds?: number;
  severity?: number;
}

export interface UpdateIncidentDto extends Partial<CreateIncidentDto> {
  status?: IncidentStatus;
  resolvedAt?: string;
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SURVEYED = 'SURVEYED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REVISION_REQUIRED = 'REVISION_REQUIRED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  incidentId: string;
  assignedToId?: string;
  createdById: string;
  villageId?: string;
  incident?: {
    id: string;
    title: string;
    description?: string;
    disasterType: string;
    priority: string;
    address?: string;
  };
  assignedTo?: User;
  createdBy?: User;
  village?: Village;
  supervisorComment?: string;
  revisionNote?: string; // Added revisionNote
  reviewedBy?: string;
  reviewedAt?: string;
  assigner?: User;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority: TaskPriority;
  incidentId: string;
  assignedToId?: string;
  dueDate?: string;
}

export interface UpdateTaskDto extends Partial<CreateTaskDto> {
  status?: TaskStatus;
}

export * from './Report';
export * from './survey';
export * from './analytics';
export * from './notification';
export * from './FormBuilder';
