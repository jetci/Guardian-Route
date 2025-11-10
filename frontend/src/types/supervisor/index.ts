// Sprint 7: Supervisor Dashboard Types

export type TaskStatus = 
  | 'PENDING_ASSIGNMENT' 
  | 'IN_PROGRESS' 
  | 'SURVEYED' 
  | 'COMPLETED'
  | 'CANCELLED';

export type TaskPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export type DisasterType = 
  | 'FLOOD' 
  | 'LANDSLIDE' 
  | 'FIRE' 
  | 'STORM' 
  | 'EARTHQUAKE' 
  | 'OTHER';

export type ReportStatus = 
  | 'PENDING_REVIEW' 
  | 'APPROVED' 
  | 'REVISION_REQUESTED';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  village: string;
}

export interface AssignedOfficer {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
}

export interface IncidentDetails {
  id: string;
  type: DisasterType;
  location: Location;
}

export interface SupervisorTaskView {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
  
  // Incident details
  incident: IncidentDetails;
  
  // Assignment details
  assignedTo: AssignedOfficer | null;
  
  // Progress tracking
  surveyedAt?: Date;
  completedAt?: Date;
  
  // Report status
  hasReport: boolean;
  reportStatus?: ReportStatus;
}

export interface TaskSummary {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
}

export interface SupervisorTasksResponse {
  tasks: SupervisorTaskView[];
  summary: TaskSummary;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  incidentType?: DisasterType;
  dateFrom?: string;
  dateTo?: string;
}

export interface AvailableOfficer {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  email: string;
  currentTaskCount: number;
  isAvailable: boolean;
  lastActive: Date;
}

export interface BroadcastMessage {
  title: string;
  message: string;
  priority: 'URGENT' | 'NORMAL';
  targetRole: 'FIELD_OFFICER' | 'ALL';
}

export interface ReportReviewAction {
  action: 'APPROVE' | 'REQUEST_REVISION';
  comments?: string;
  reviewedBy: string;
}
