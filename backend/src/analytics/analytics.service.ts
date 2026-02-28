import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AnalyticsQueryDto, DateGranularity } from './dto/analytics-query.dto';
import {
  TaskStatusResponseDto,
  TaskStatusMetricDto,
} from './dto/task-status-response.dto';
import {
  TaskTrendResponseDto,
  TaskTrendDataPointDto,
  TaskTrendSummaryDto,
} from './dto/task-trend-response.dto';
import { TaskStatus } from '../tasks/dto/create-task.dto';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) { }

  /**
   * Get task status overview
   * Returns count and percentage for each task status
   */
  async getTaskStatusOverview(
    query: AnalyticsQueryDto,
    currentUserId: string,
    userRole: string,
  ): Promise<TaskStatusResponseDto> {
    const startTime = Date.now();

    try {
      // Build where clause with filters
      const where = this.buildWhereClause(query, currentUserId, userRole);

      // Get task counts by status using groupBy
      const statusCounts = await this.prisma.task.groupBy({
        by: ['status'],
        where,
        _count: {
          id: true,
        },
      });

      // Calculate total
      const total = statusCounts.reduce((sum, item) => sum + item._count.id, 0);

      // Build metrics with percentage
      const metrics: TaskStatusMetricDto[] = statusCounts.map((item) => ({
        status: item.status as TaskStatus,
        count: item._count.id,
        percentage: total > 0 ? Math.round((item._count.id / total) * 100 * 100) / 100 : 0,
      }));

      // Sort by count descending
      metrics.sort((a, b) => b.count - a.count);

      const duration = Date.now() - startTime;
      this.logger.log(`Task status overview generated in ${duration}ms`);

      return {
        metrics,
        total,
        generatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to get task status overview', error);
      throw error;
    }
  }

  /**
   * Get task trend over time
   * Returns time-series data of task creation and completion
   */
  async getTaskTrend(
    query: AnalyticsQueryDto,
    currentUserId: string,
    userRole: string,
  ): Promise<TaskTrendResponseDto> {
    const startTime = Date.now();

    try {
      const granularity = query.granularity || DateGranularity.DAILY;
      const { startDate, endDate } = this.getDateRange(query);

      // Build where clause
      const where = this.buildWhereClause(query, currentUserId, userRole);

      // Get all tasks in date range
      const tasks = await this.prisma.task.findMany({
        where: {
          ...where,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          completedAt: true,
        },
      });

      // Generate data points based on granularity
      const dataPoints = this.generateTrendDataPoints(
        tasks,
        startDate,
        endDate,
        granularity,
      );

      // Calculate summary
      const summary = this.calculateTrendSummary(dataPoints);

      const duration = Date.now() - startTime;
      this.logger.log(`Task trend generated in ${duration}ms`);

      return {
        dataPoints,
        granularity,
        summary,
        generatedAt: new Date(),
      };
    } catch (error) {
      this.logger.error('Failed to get task trend', error);
      throw error;
    }
  }

  /**
   * Build Prisma where clause from query filters
   */
  private buildWhereClause(
    query: AnalyticsQueryDto,
    currentUserId: string,
    userRole: string,
  ): any {
    const where: any = {};

    // Date range filter
    const { startDate, endDate } = this.getDateRange(query);
    where.createdAt = {
      gte: startDate,
      lte: endDate,
    };

    // RBAC: Field Officers see only their tasks
    if (userRole === 'FIELD_OFFICER') {
      where.assignedToId = currentUserId;
    }

    // RBAC: Supervisors see their team's tasks
    if (userRole === 'SUPERVISOR' && !query.userId) {
      // TODO: Add team filter when team relationship is available
      // For now, allow all tasks
    }

    // User filter (for admins/executives)
    if (query.userId && (userRole === 'ADMIN' || userRole === 'EXECUTIVE')) {
      where.assignedToId = query.userId;
    }

    // Team filter
    if (query.teamId) {
      // TODO: Add team filter when team relationship is available
    }

    // Status filter
    if (query.status) {
      where.status = query.status;
    }

    // Priority filter
    if (query.priority) {
      where.priority = query.priority;
    }

    return where;
  }

  /**
   * Get date range from query or default to last 30 days
   */
  private getDateRange(query: AnalyticsQueryDto): { startDate: Date; endDate: Date } {
    const now = new Date();
    const endDate = query.endDate ? new Date(query.endDate) : now;
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago

    return { startDate, endDate };
  }

  /**
   * Generate trend data points based on granularity
   */
  private generateTrendDataPoints(
    tasks: any[],
    startDate: Date,
    endDate: Date,
    granularity: DateGranularity,
  ): TaskTrendDataPointDto[] {
    const dataPoints: TaskTrendDataPointDto[] = [];
    const intervals = this.generateTimeIntervals(startDate, endDate, granularity);

    for (const interval of intervals) {
      const tasksInInterval = tasks.filter(
        (task) =>
          new Date(task.createdAt) >= interval.start &&
          new Date(task.createdAt) < interval.end,
      );

      const completedInInterval = tasks.filter(
        (task) =>
          task.completedAt &&
          new Date(task.completedAt) >= interval.start &&
          new Date(task.completedAt) < interval.end,
      );

      dataPoints.push({
        date: interval.start.toISOString(),
        created: tasksInInterval.length,
        completed: completedInInterval.length,
        inProgress: tasksInInterval.filter((t) => t.status === 'IN_PROGRESS').length,
        pending: tasksInInterval.filter((t) => t.status === 'PENDING').length,
      });
    }

    return dataPoints;
  }

  /**
   * Generate time intervals based on granularity
   */
  private generateTimeIntervals(
    startDate: Date,
    endDate: Date,
    granularity: DateGranularity,
  ): Array<{ start: Date; end: Date }> {
    const intervals: Array<{ start: Date; end: Date }> = [];
    let current = new Date(startDate);

    while (current < endDate) {
      const next = this.getNextInterval(current, granularity);
      intervals.push({
        start: new Date(current),
        end: next > endDate ? new Date(endDate) : new Date(next),
      });
      current = next;
    }

    return intervals;
  }

  /**
   * Get next interval date based on granularity
   */
  private getNextInterval(date: Date, granularity: DateGranularity): Date {
    const next = new Date(date);

    switch (granularity) {
      case DateGranularity.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case DateGranularity.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      case DateGranularity.MONTHLY:
        next.setMonth(next.getMonth() + 1);
        break;
      case DateGranularity.QUARTERLY:
        next.setMonth(next.getMonth() + 3);
        break;
      case DateGranularity.YEARLY:
        next.setFullYear(next.getFullYear() + 1);
        break;
    }

    return next;
  }

  /**
   * Calculate trend summary from data points
   */
  private calculateTrendSummary(dataPoints: TaskTrendDataPointDto[]): TaskTrendSummaryDto {
    const totalCreated = dataPoints.reduce((sum, dp) => sum + dp.created, 0);
    const totalCompleted = dataPoints.reduce((sum, dp) => sum + dp.completed, 0);
    const completionRate =
      totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100 * 100) / 100 : 0;

    // Calculate trend direction (compare first half vs second half)
    const midPoint = Math.floor(dataPoints.length / 2);
    const firstHalf = dataPoints.slice(0, midPoint);
    const secondHalf = dataPoints.slice(midPoint);

    const firstHalfAvg =
      firstHalf.reduce((sum, dp) => sum + dp.created, 0) / (firstHalf.length || 1);
    const secondHalfAvg =
      secondHalf.reduce((sum, dp) => sum + dp.created, 0) / (secondHalf.length || 1);

    let trend: 'UP' | 'DOWN' | 'STABLE' = 'STABLE';
    const diff = secondHalfAvg - firstHalfAvg;
    const threshold = firstHalfAvg * 0.1; // 10% threshold

    if (diff > threshold) {
      trend = 'UP';
    } else if (diff < -threshold) {
      trend = 'DOWN';
    }

    return {
      totalCreated,
      totalCompleted,
      completionRate,
      trend,
    };
  }
  /**
   * Get incident overview statistics
   */
  async getIncidentOverview(query?: AnalyticsQueryDto) {
    const where: any = {};

    if (query) {
      const { startDate, endDate } = this.getDateRange(query);
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    }

    const [total, resolved, activeUsers] = await Promise.all([
      this.prisma.incident.count({ where }),
      this.prisma.incident.count({
        where: {
          ...where,
          status: { in: ['RESOLVED', 'CLOSED'] }
        },
      }),
      this.prisma.user.count({
        where: { isActive: true },
      }),
    ]);

    const resolutionRate = total > 0 ? (resolved / total) * 100 : 0;

    return {
      totalIncidents: total,
      resolutionRate: Math.round(resolutionRate * 10) / 10,
      activeUsers,
      systemHealth: 98.5, // Mock for now
    };
  }

  /**
   * Get incident trend over time (last 6 months)
   */
  async getIncidentTrend() {
    const months = 6;
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - months + 1, 1);

    const incidents = await this.prisma.incident.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Group by month
    const labels: string[] = [];
    const incidentCounts: number[] = [];
    const resolvedCounts: number[] = [];

    for (let i = 0; i < months; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      labels.push(monthLabel);

      const nextMonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const monthIncidents = incidents.filter(
        (inc) => inc.createdAt >= d && inc.createdAt < nextMonth
      );

      incidentCounts.push(monthIncidents.length);
      resolvedCounts.push(
        monthIncidents.filter((inc) => ['RESOLVED', 'CLOSED'].includes(inc.status)).length
      );
    }

    return {
      labels,
      datasets: [
        {
          label: 'Incidents',
          data: incidentCounts,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Resolved',
          data: resolvedCounts,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }

  /**
   * Get incidents by type
   */
  async getIncidentsByType() {
    const byType = await this.prisma.incident.groupBy({
      by: ['disasterType'],
      _count: true,
    });

    const labels = byType.map((item) => item.disasterType);
    const data = byType.map((item) => item._count);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(168, 85, 247, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(156, 163, 175, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  /**
   * Get incidents by severity
   */
  async getIncidentsBySeverity() {
    const bySeverity = await this.prisma.incident.groupBy({
      by: ['priority'],
      _count: true,
    });

    // Ensure order: CRITICAL, HIGH, MEDIUM, LOW
    const order = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    const sortedData = order.map((priority) => {
      const found = bySeverity.find((item) => item.priority === priority);
      return found ? found._count : 0;
    });

    return {
      labels: order,
      datasets: [
        {
          label: 'Number of Incidents',
          data: sortedData,
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(249, 115, 22, 0.8)',
            'rgba(234, 179, 8, 0.8)',
            'rgba(34, 197, 94, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  /**
   * Get top performers (users with most completed reports/tasks)
   */
  async getTopPerformers() {
    // For simplicity in this phase, we'll count reports created
    const topReporters = await this.prisma.report.groupBy({
      by: ['authorId'],
      _count: true,
      orderBy: {
        _count: {
          authorId: 'desc',
        },
      },
      take: 5,
    });

    // Get user details
    const performers = await Promise.all(
      topReporters.map(async (item) => {
        const user = await this.prisma.user.findUnique({
          where: { id: item.authorId },
          select: { firstName: true, lastName: true },
        });
        return {
          name: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
          reports: item._count,
          rating: (4.0 + Math.random()).toFixed(1), // Mock rating for now
        };
      })
    );

    return performers;
  }
}
