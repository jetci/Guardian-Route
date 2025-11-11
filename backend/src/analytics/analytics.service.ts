import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { KpiSummaryDto } from './dto/kpi-summary.dto';
import { IncidentsByStatusDto } from './dto/incidents-by-status.dto';
import { IncidentStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpiSummary(): Promise<KpiSummaryDto> {
    const [total, pending, inProgress, resolved, resolvedIncidents] = await Promise.all([
      this.prisma.incident.count(),
      this.prisma.incident.count({ where: { status: 'PENDING' } }),
      this.prisma.incident.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.incident.count({ where: { status: 'RESOLVED' } }),
      this.prisma.incident.findMany({
        where: { status: 'RESOLVED', resolvedAt: { not: null } },
        select: { createdAt: true, resolvedAt: true },
      }),
    ]);

    let avgMillis = 0;
    if (resolvedIncidents.length > 0) {
      const totalMillis = resolvedIncidents.reduce((sum, inc) => {
        return sum + (inc.resolvedAt!.getTime() - inc.createdAt.getTime());
      }, 0);
      avgMillis = totalMillis / resolvedIncidents.length;
    }

    const avgHours = (avgMillis / (1000 * 60 * 60)).toFixed(1);

    return {
      total,
      pending,
      investigating: inProgress,
      resolved,
      avgResolutionTime: `${avgHours}h`,
    };
  }

  async getIncidentsByStatus(): Promise<IncidentsByStatusDto[]> {
    const statusCounts = await this.prisma.incident.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    // Initialize all statuses with count 0
    const allStatuses = Object.values(IncidentStatus).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {} as Record<IncidentStatus, number>);

    // Populate with actual counts
    for (const item of statusCounts) {
      allStatuses[item.status] = item._count.status;
    }

    // Convert to array and sort
    const result = Object.entries(allStatuses).map(([status, count]) => ({
      status: status as IncidentStatus,
      count,
    }));

    // Sort by predefined order
    const statusOrder: IncidentStatus[] = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    result.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

    return result;
  }

  /**
   * Get incident trend data for the last 6 months
   */
  async getTrendData() {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const incidents = await this.prisma.incident.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
        resolvedAt: true,
      },
    });

    // Group by month
    const monthlyData = new Map<string, { count: number; totalResponseTime: number }>();

    for (const incident of incidents) {
      const month = incident.createdAt.toISOString().substring(0, 7); // YYYY-MM
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { count: 0, totalResponseTime: 0 });
      }

      const data = monthlyData.get(month)!;
      data.count++;

      if (incident.resolvedAt) {
        const responseTime = (incident.resolvedAt.getTime() - incident.createdAt.getTime()) / (1000 * 60 * 60);
        data.totalResponseTime += responseTime;
      }
    }

    // Convert to array and calculate averages
    const result = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      count: data.count,
      avgResponseTime: data.count > 0 ? Math.round(data.totalResponseTime / data.count) : 0,
    }));

    // Sort by month
    result.sort((a, b) => a.month.localeCompare(b.month));

    return result;
  }

  /**
   * Get incidents grouped by type
   */
  async getIncidentsByType() {
    const incidents = await this.prisma.incident.groupBy({
      by: ['disasterType'],
      _count: {
        disasterType: true,
      },
    });

    const total = incidents.reduce((sum, item) => sum + item._count.disasterType, 0);

    return incidents.map((item) => ({
      type: item.disasterType,
      count: item._count.disasterType,
      percentage: total > 0 ? Math.round((item._count.disasterType / total) * 100) : 0,
    }));
  }

  /**
   * Get critical incidents (HIGH and CRITICAL priority)
   */
  async getCriticalIncidents(limit = 10) {
    const incidents = await this.prisma.incident.findMany({
      where: {
        priority: {
          in: ['HIGH', 'CRITICAL'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        title: true,
        priority: true,
        status: true,
        location: true,
        createdAt: true,
      },
    });

    return incidents.map((incident) => ({
      id: incident.id,
      title: incident.title,
      priority: incident.priority,
      status: incident.status,
      location: incident.location?.coordinates
        ? `${incident.location.coordinates[1]}, ${incident.location.coordinates[0]}`
        : 'N/A',
      createdAt: incident.createdAt,
    }));
  }

  /**
   * Get risk areas (hotspots) based on incident density
   */
  async getRiskAreas() {
    const incidents = await this.prisma.incident.findMany({
      where: {
        location: {
          not: null,
        },
      },
      select: {
        location: true,
        priority: true,
      },
    });

    // Group incidents by approximate location (grid-based)
    const gridSize = 0.1; // ~11km
    const locationMap = new Map<string, { lat: number; lng: number; count: number; totalSeverity: number }>();

    for (const incident of incidents) {
      if (!incident.location?.coordinates) continue;

      const [lng, lat] = incident.location.coordinates;
      const gridLat = Math.floor(lat / gridSize) * gridSize;
      const gridLng = Math.floor(lng / gridSize) * gridSize;
      const key = `${gridLat},${gridLng}`;

      if (!locationMap.has(key)) {
        locationMap.set(key, {
          lat: gridLat + gridSize / 2,
          lng: gridLng + gridSize / 2,
          count: 0,
          totalSeverity: 0,
        });
      }

      const data = locationMap.get(key)!;
      data.count++;

      // Calculate severity score
      const severityScore = {
        CRITICAL: 4,
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      }[incident.priority] || 1;

      data.totalSeverity += severityScore;
    }

    // Convert to array and calculate severity
    return Array.from(locationMap.values())
      .map((data) => ({
        lat: data.lat,
        lng: data.lng,
        count: data.count,
        severity: Math.min(5, Math.ceil(data.totalSeverity / data.count)),
      }))
      .filter((area) => area.count >= 2) // Only show areas with 2+ incidents
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 risk areas
  }
}
