export interface DashboardSummary {
  totalTasks: number;
  tasksByStatus: {
    PENDING_ASSIGNMENT: number;
    IN_PROGRESS: number;
    SURVEYED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  tasksByPriority: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    CRITICAL: number;
  };
  totalIncidents: number;
  incidentsByType: {
    FLOOD: number;
    LANDSLIDE: number;
    FIRE: number;
    STORM: number;
    EARTHQUAKE: number;
    OTHER: number;
  };
  totalReports: number;
  reportsByStatus: {
    DRAFT: number;
    SUBMITTED: number;
    UNDER_REVIEW: number;
    REVISION_REQUIRED: number;
    APPROVED: number;
    REJECTED: number;
  };
  activeFieldOfficers: number;
  totalAffectedHouseholds: number;
  totalAffectedPopulation: number;
  totalEstimatedDamage: number;
}

export interface TaskTrend {
  date: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface IncidentDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  region?: string;
  disasterType?: string;
  priority?: string;
}

export interface RegionData {
  region: string;
  count: number;
}
