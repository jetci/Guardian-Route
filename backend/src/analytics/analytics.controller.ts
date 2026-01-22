import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AnalyticsQueryDto } from './dto/analytics-query.dto';
import { TaskStatusResponseDto } from './dto/task-status-response.dto';
import { TaskTrendResponseDto } from './dto/task-trend-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get('tasks/status')
  @ApiOperation({ summary: 'Get task status overview' })
  @ApiResponse({
    status: 200,
    description: 'Returns task count by status with percentages',
    type: TaskStatusResponseDto,
  })
  async getTaskStatusOverview(
    @Query() query: AnalyticsQueryDto,
    @CurrentUser() user: any,
  ): Promise<TaskStatusResponseDto> {
    return this.analyticsService.getTaskStatusOverview(query, user.sub, user.role);
  }

  @Get('tasks/trend')
  @ApiOperation({ summary: 'Get task trend over time' })
  @ApiResponse({
    status: 200,
    description: 'Returns time-series data of task creation and completion',
    type: TaskTrendResponseDto,
  })
  async getTaskTrend(
    @Query() query: AnalyticsQueryDto,
    @CurrentUser() user: any,
  ): Promise<TaskTrendResponseDto> {
    return this.analyticsService.getTaskTrend(query, user.sub, user.role);
  }

  @Get('incidents/overview')
  @ApiOperation({ summary: 'Get incident overview statistics' })
  async getIncidentOverview(@Query() query: AnalyticsQueryDto) {
    return this.analyticsService.getIncidentOverview(query);
  }

  @Get('incidents/trend')
  @ApiOperation({ summary: 'Get incident trend over time' })
  async getIncidentTrend() {
    return this.analyticsService.getIncidentTrend();
  }

  @Get('incidents/by-type')
  @ApiOperation({ summary: 'Get incidents by type' })
  async getIncidentsByType() {
    return this.analyticsService.getIncidentsByType();
  }

  @Get('incidents/by-severity')
  @ApiOperation({ summary: 'Get incidents by severity' })
  async getIncidentsBySeverity() {
    return this.analyticsService.getIncidentsBySeverity();
  }

  @Get('performers/top')
  @ApiOperation({ summary: 'Get top performers' })
  async getTopPerformers() {
    return this.analyticsService.getTopPerformers();
  }
}
