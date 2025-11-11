import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { KpiSummaryDto } from './dto/kpi-summary.dto';
import { IncidentsByStatusDto } from './dto/incidents-by-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('kpi-summary')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE)
  @ApiOperation({ summary: 'Get KPI summary for dashboard' })
  @ApiResponse({ status: 200, description: 'KPI summary retrieved', type: KpiSummaryDto })
  async getKpiSummary(): Promise<KpiSummaryDto> {
    return this.analyticsService.getKpiSummary();
  }

  @Get('by-status')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE)
  @ApiOperation({ summary: 'Get incidents count by status' })
  @ApiResponse({ status: 200, description: 'Incidents by status retrieved', type: [IncidentsByStatusDto] })
  async getIncidentsByStatus(): Promise<IncidentsByStatusDto[]> {
    return this.analyticsService.getIncidentsByStatus();
  }
}

  @Get('trend')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.EXECUTIVE)
  @ApiOperation({ summary: 'Get incident trend data for last 6 months' })
  @ApiResponse({ status: 200, description: 'Trend data retrieved' })
  async getTrendData() {
    return this.analyticsService.getTrendData();
  }

  @Get('by-type')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE)
  @ApiOperation({ summary: 'Get incidents count by type' })
  @ApiResponse({ status: 200, description: 'Incidents by type retrieved' })
  async getIncidentsByType() {
    return this.analyticsService.getIncidentsByType();
  }

  @Get('critical-incidents')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.EXECUTIVE)
  @ApiOperation({ summary: 'Get critical incidents (HIGH and CRITICAL priority)' })
  @ApiResponse({ status: 200, description: 'Critical incidents retrieved' })
  async getCriticalIncidents() {
    return this.analyticsService.getCriticalIncidents();
  }

  @Get('risk-areas')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.EXECUTIVE)
  @ApiOperation({ summary: 'Get risk areas (hotspots) based on incident density' })
  @ApiResponse({ status: 200, description: 'Risk areas retrieved' })
  async getRiskAreas() {
    return this.analyticsService.getRiskAreas();
  }
