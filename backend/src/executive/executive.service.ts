import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { DashboardFiltersDto } from './dto/dashboard-filters.dto';
import { TaskStatus, ReportStatus, DisasterType, Priority } from '@prisma/client';

@Injectable()
export class ExecutiveService {
  constructor(private prisma: PrismaService) {}

  async getDashboardSummary(filters: DashboardFiltersDto) {
    const whereClause: any = {};

    // Apply date filters
    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) {
        whereClause.createdAt.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        whereClause.createdAt.lte = new Date(filters.endDate);
      }
    }

    // Apply priority filter
    if (filters.priority) {
      whereClause.priority = filters.priority;
    }

    // Fetch all required data in parallel
    const [
      totalTasks,
      tasksByStatus,
      tasksByPriority,
      totalIncidents,
      incidentsByType,
      totalReports,
      reportsByStatus,
      activeFieldOfficers,
      damageStats,
    ] = await Promise.all([
      // Total tasks
      this.prisma.task.count({ where: whereClause }),

      // Tasks by status
      this.prisma.task.groupBy({
        by: ['status'],
        where: whereClause,
        _count: true,
      }),

      // Tasks by priority
      this.prisma.task.groupBy({
        by: ['priority'],
        where: whereClause,
        _count: true,
      }),

      // Total incidents
      this.prisma.incident.count({
        where: filters.disasterType
          ? { disasterType: filters.disasterType }
          : undefined,
      }),

      // Incidents by type
      this.prisma.incident.groupBy({
        by: ['disasterType'],
        _count: true,
      }),

      // Total reports
      this.prisma.report.count(),

      // Reports by status
      this.prisma.report.groupBy({
        by: ['status'],
        _count: true,
      }),

      // Active field officers
      this.prisma.user.count({
        where: {
          role: 'FIELD_OFFICER',
          isActive: true,
        },
      }),

      // Damage statistics
      this.prisma.report.aggregate({
        _sum: {
          affectedHouseholds: true,
          affectedPersons: true,
          totalDamageEstimate: true,
        },
      }),
    ]);

    // Transform tasks by status into a map
    const taskStatusMap: Record<TaskStatus, number> = {
      PENDING: 0,
      IN_PROGRESS: 0,
      SURVEYED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    tasksByStatus.forEach((item) => {
      taskStatusMap[item.status] = item._count;
    });

    // Transform tasks by priority into a map
    const taskPriorityMap: Record<Priority, number> = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0,
    };

    tasksByPriority.forEach((item) => {
      taskPriorityMap[item.priority] = item._count;
    });

    // Transform incidents by type into a map
    const incidentTypeMap: Record<DisasterType, number> = {
      FLOOD: 0,
      LANDSLIDE: 0,
      FIRE: 0,
      STORM: 0,
      EARTHQUAKE: 0,
      OTHER: 0,
    };

    incidentsByType.forEach((item) => {
      incidentTypeMap[item.disasterType] = item._count;
    });

    // Transform reports by status into a map
    const reportStatusMap: Record<ReportStatus, number> = {
      DRAFT: 0,
      SUBMITTED: 0,
      UNDER_REVIEW: 0,
      REVISION_REQUIRED: 0,
      APPROVED: 0,
      REJECTED: 0,
    };

    reportsByStatus.forEach((item) => {
      reportStatusMap[item.status] = item._count;
    });

    return {
      totalTasks,
      tasksByStatus: {
        PENDING_ASSIGNMENT: taskStatusMap.PENDING,
        IN_PROGRESS: taskStatusMap.IN_PROGRESS,
        SURVEYED: taskStatusMap.SURVEYED,
        COMPLETED: taskStatusMap.COMPLETED,
        CANCELLED: taskStatusMap.CANCELLED,
      },
      tasksByPriority: taskPriorityMap,
      totalIncidents,
      incidentsByType: incidentTypeMap,
      totalReports,
      reportsByStatus: reportStatusMap,
      activeFieldOfficers,
      totalAffectedHouseholds: damageStats._sum.affectedHouseholds || 0,
      totalAffectedPopulation: damageStats._sum.affectedPersons || 0,
      totalEstimatedDamage: damageStats._sum.totalDamageEstimate || 0,
    };
  }

  /**
   * Get task trends over time (daily aggregation)
   */
  async getTaskTrends(filters: DashboardFiltersDto) {
    const startDate = filters.startDate
      ? new Date(filters.startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // Default: last 30 days
    const endDate = filters.endDate ? new Date(filters.endDate) : new Date();

    // Get all tasks within the date range
    const tasks = await this.prisma.task.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
    });

    // Group tasks by date
    const trendMap = new Map<string, { total: number; completed: number; inProgress: number; pending: number }>();

    tasks.forEach((task) => {
      const dateKey = task.createdAt.toISOString().split('T')[0];
      if (!trendMap.has(dateKey)) {
        trendMap.set(dateKey, { total: 0, completed: 0, inProgress: 0, pending: 0 });
      }
      const dayData = trendMap.get(dateKey)!;
      dayData.total++;
      if (task.status === 'COMPLETED') dayData.completed++;
      if (task.status === 'IN_PROGRESS') dayData.inProgress++;
      if (task.status === 'PENDING') dayData.pending++;
    });

    // Convert to array and sort by date
    const trends = Array.from(trendMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return trends;
  }

  /**
   * Get incident distribution by disaster type
   */
  async getIncidentDistribution(filters: DashboardFiltersDto) {
    const whereClause: any = {};

    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) whereClause.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) whereClause.createdAt.lte = new Date(filters.endDate);
    }

    const distribution = await this.prisma.incident.groupBy({
      by: ['disasterType'],
      where: whereClause,
      _count: true,
    });

    const total = distribution.reduce((sum, item) => sum + item._count, 0);

    return distribution.map((item) => ({
      type: item.disasterType,
      count: item._count,
      percentage: total > 0 ? Math.round((item._count / total) * 100) : 0,
    }));
  }

  /**
   * Get tasks grouped by region/province
   */
  async getTasksByRegion(filters: DashboardFiltersDto) {
    const whereClause: any = {};

    if (filters.startDate || filters.endDate) {
      whereClause.createdAt = {};
      if (filters.startDate) whereClause.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) whereClause.createdAt.lte = new Date(filters.endDate);
    }

    // Get tasks with incident location data
    const tasks = await this.prisma.task.findMany({
      where: whereClause,
      include: {
        incident: {
          select: {
            location: true,
          },
        },
      },
    });

    // Group by province (assuming location has province field)
    const regionMap = new Map<string, number>();

    tasks.forEach((task) => {
      if (task.incident?.location) {
        const location = task.incident.location as any;
        const province = location.province || location.district || 'Unknown';
        regionMap.set(province, (regionMap.get(province) || 0) + 1);
      }
    });

    // Convert to array and sort by count (descending)
    const regions = Array.from(regionMap.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 regions

    return regions;
  }
}
