import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IncidentStatus, Priority, DisasterType } from '@prisma/client';

@ApiTags('incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(
    @Body() createIncidentDto: CreateIncidentDto,
    @CurrentUser() user: any,
  ) {
    return this.incidentsService.create(createIncidentDto, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incidents with optional filters' })
  @ApiQuery({ name: 'status', enum: IncidentStatus, required: false })
  @ApiQuery({ name: 'priority', enum: Priority, required: false })
  @ApiQuery({ name: 'disasterType', enum: DisasterType, required: false })
  @ApiQuery({ name: 'villageId', type: String, required: false })
  @ApiResponse({ status: 200, description: 'Return all incidents' })
  findAll(
    @Query('status') status?: IncidentStatus,
    @Query('priority') priority?: Priority,
    @Query('disasterType') disasterType?: DisasterType,
    @Query('villageId') villageId?: string,
  ) {
    return this.incidentsService.findAll({
      status,
      priority,
      disasterType,
      villageId,
    });
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get incidents statistics' })
  @ApiResponse({ status: 200, description: 'Return statistics' })
  getStatistics() {
    return this.incidentsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiResponse({ status: 200, description: 'Return incident details' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update incident' })
  @ApiResponse({ status: 200, description: 'Incident updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  update(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
    @CurrentUser() user: any,
  ) {
    return this.incidentsService.update(
      id,
      updateIncidentDto,
      user.userId,
      user.role,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete incident (Admin only)' })
  @ApiResponse({ status: 200, description: 'Incident deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.incidentsService.remove(id, user.userId, user.role);
  }
}
