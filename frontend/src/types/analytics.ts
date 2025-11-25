/**
 * Analytics Module Types
 * TypeScript definitions for analytics data and filters
 */

import type { TaskStatus, TaskPriority } from './index';

// ==================== Enums ====================

export enum DateGranularity {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum ChartType {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
  AREA = 'AREA',
  DONUT = 'DONUT',
}

export enum ExportFormat {
  XLSX = 'XLSX',
  CSV = 'CSV',
  PDF = 'PDF',
  PNG = 'PNG',
}

// ==================== Filters ====================

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  granularity?: DateGranularity;
  userId?: string;
  teamId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  villageId?: string;
  tambonId?: string;
}

export interface DateRangeFilter {
  start: Date;
  end: Date;
  label: string;
}

// ==================== Metrics ====================

export interface TaskStatusMetric {
  status: TaskStatus;
  count: number;
  percentage: number;
}

export interface TaskTrendDataPoint {
  date: string; // ISO date string
  created: number;
  completed: number;
  inProgress: number;
  pending: number;
}

export interface IncidentTypeMetric {
  type: string;
  count: number;
  percentage: number;
  severity?: string;
}

export interface VillageReportMetric {
  villageId: string;
  villageName: string;
  reportCount: number;
  completedCount: number;
  completionRate: number;
}

export interface PerformanceMetric {
  date: string;
  successRate: number;
  averageCompletionTime: number; // in hours
  lateTasksPercentage: number;
  onTimePercentage: number;
}

export interface UserPerformanceMetric {
  userId: string;
  userName: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  lateTasks: number;
  averageCompletionTime: number;
  successRate: number;
}

// ==================== Aggregated Data ====================

export interface TaskStatusOverview {
  metrics: TaskStatusMetric[];
  total: number;
  lastUpdated: Date;
}

export interface TaskTrendData {
  dataPoints: TaskTrendDataPoint[];
  granularity: DateGranularity;
  summary: {
    totalCreated: number;
    totalCompleted: number;
    completionRate: number;
    trend: 'UP' | 'DOWN' | 'STABLE';
  };
}

export interface IncidentTypeDistribution {
  metrics: IncidentTypeMetric[];
  total: number;
  mostCommonType: string;
}

export interface VillageReportData {
  metrics: VillageReportMetric[];
  total: number;
  topVillages: VillageReportMetric[];
}

export interface PerformanceData {
  dataPoints: PerformanceMetric[];
  average: {
    successRate: number;
    completionTime: number;
    latePercentage: number;
  };
}

export interface TeamPerformanceData {
  users: UserPerformanceMetric[];
  teamAverage: {
    successRate: number;
    completionTime: number;
    tasksPerUser: number;
  };
}

// ==================== API Request/Response ====================

export interface AnalyticsQueryParams {
  startDate?: string; // ISO date string
  endDate?: string;
  granularity?: DateGranularity;
  userId?: string;
  teamId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  villageId?: string;
  tambonId?: string;
}

export interface AnalyticsResponse<T> {
  data: T;
  filters: AnalyticsQueryParams;
  generatedAt: string;
  cacheExpiry?: string;
}

// ==================== Chart Props ====================

export interface BaseChartProps {
  loading?: boolean;
  error?: string | null;
  height?: number;
  responsive?: boolean;
}

export interface TaskStatusChartProps extends BaseChartProps {
  data: TaskStatusMetric[];
  total: number;
}

export interface TaskTrendChartProps extends BaseChartProps {
  data: TaskTrendDataPoint[];
  granularity: DateGranularity;
}

export interface IncidentTypeChartProps extends BaseChartProps {
  data: IncidentTypeMetric[];
  total: number;
}

export interface VillageReportChartProps extends BaseChartProps {
  data: VillageReportMetric[];
  topN?: number;
}

export interface PerformanceChartProps extends BaseChartProps {
  data: PerformanceMetric[];
}

export interface UserPerformanceChartProps extends BaseChartProps {
  data: UserPerformanceMetric[];
  topN?: number;
}

// ==================== Export ====================

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeCharts?: boolean;
  includeRawData?: boolean;
}

export interface ExportRequest {
  chartType: ChartType;
  data: any;
  filters: AnalyticsFilters;
  options: ExportOptions;
}

export interface ExportResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}

// ==================== Dashboard ====================

export interface DashboardConfig {
  role: 'EXECUTIVE' | 'SUPERVISOR' | 'FIELD_OFFICER';
  charts: ChartType[];
  defaultFilters: AnalyticsFilters;
  refreshInterval?: number; // in milliseconds
}

export interface DashboardData {
  taskStatus?: TaskStatusOverview;
  taskTrend?: TaskTrendData;
  incidentTypes?: IncidentTypeDistribution;
  villageReports?: VillageReportData;
  performance?: PerformanceData;
  teamPerformance?: TeamPerformanceData;
}
