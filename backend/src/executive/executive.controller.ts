import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExecutiveService } from './executive.service';
import { DashboardFiltersDto } from './dto/dashboard-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('executive')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('executive')
export class ExecutiveController {
  constructor(private readonly executiveService: ExecutiveService) {}

  @Get('dashboard/summary')
  @Roles(Role.EXECUTIVE, Role.ADMIN)
  @ApiOperation({
    summary: 'Get dashboard summary statistics (EXECUTIVE, ADMIN only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getDashboardSummary(@Query() filters: DashboardFiltersDto) {
    return this.executiveService.getDashboardSummary(filters);
  }

  @Get('dashboard/task-trends')
  @Roles(Role.EXECUTIVE, Role.ADMIN)
  @ApiOperation({
    summary: 'Get task trends over time (EXECUTIVE, ADMIN only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Task trends retrieved successfully',
  })
  async getTaskTrends(@Query() filters: DashboardFiltersDto) {
    return this.executiveService.getTaskTrends(filters);
  }

  @Get('dashboard/incident-distribution')
  @Roles(Role.EXECUTIVE, Role.ADMIN)
  @ApiOperation({
    summary: 'Get incident distribution by disaster type (EXECUTIVE, ADMIN only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Incident distribution retrieved successfully',
  })
  async getIncidentDistribution(@Query() filters: DashboardFiltersDto) {
    return this.executiveService.getIncidentDistribution(filters);
  }

  @Get('dashboard/tasks-by-region')
  @Roles(Role.EXECUTIVE, Role.ADMIN)
  @ApiOperation({
    summary: 'Get tasks grouped by region (EXECUTIVE, ADMIN only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Tasks by region retrieved successfully',
  })
  async getTasksByRegion(@Query() filters: DashboardFiltersDto) {
    return this.executiveService.getTasksByRegion(filters);
  }
}
