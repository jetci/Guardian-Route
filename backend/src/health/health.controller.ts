import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'System is healthy' })
  async getHealth() {
    return this.healthService.getHealthStatus();
  }

  @Get('system-stats')
  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({ status: 200, description: 'Return system statistics' })
  async getSystemStats() {
    return this.healthService.getSystemStats();
  }

  @Get('database')
  @ApiOperation({ summary: 'Check database connection' })
  @ApiResponse({ status: 200, description: 'Database connection status' })
  async getDatabaseHealth() {
    return this.healthService.getDatabaseHealth();
  }
}
