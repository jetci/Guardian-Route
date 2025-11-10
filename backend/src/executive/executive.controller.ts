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
}
