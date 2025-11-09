import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KpiSummaryDto } from './dto/kpi-summary.dto';
import { IncidentsByStatusDto } from './dto/incidents-by-status.dto';
import { IncidentStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getKpiSummary(): Promise<KpiSummaryDto> {
    const [total, pending, investigating, resolved, resolvedIncidents] = await Promise.all([
      this.prisma.incident.count(),
      this.prisma.incident.count({ where: { status: 'PENDING' } }),
      this.prisma.incident.count({ where: { status: 'INVESTIGATING' } }),
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
      investigating,
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
    const statusOrder: IncidentStatus[] = ['PENDING', 'INVESTIGATING', 'RESOLVED', 'REJECTED'];
    result.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));

    return result;
  }
}
