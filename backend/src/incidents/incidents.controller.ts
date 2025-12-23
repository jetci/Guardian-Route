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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { PhotosService } from './photos.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IncidentStatus, Priority, DisasterType } from '@prisma/client';
import { Throttle } from '@nestjs/throttler';
import { AssignIncidentDto } from './dto/assign-incident.dto';
import { ReviewIncidentDto } from './dto/review-incident.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(
    private readonly incidentsService: IncidentsService,
    private readonly photosService: PhotosService,
  ) { }

  @Get('statistics')
  @ApiOperation({ summary: 'Get incident statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStatistics() {
    return this.incidentsService.getStatistics();
  }

  @Post()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @ApiOperation({ summary: 'Create a new incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  create(
    @Body() createIncidentDto: CreateIncidentDto,
    @CurrentUser() user: any,
  ) {
    return this.incidentsService.create(createIncidentDto, user.id);
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

  @Get('my')
  @ApiOperation({ summary: 'Get my incidents' })
  @ApiResponse({ status: 200, description: 'Return incidents created by current user' })
  findMy(@CurrentUser() user: any) {
    return this.incidentsService.findMyIncidents(user.id);
  }

  @Get('unassigned')
  @Roles('SUPERVISOR', 'EXECUTIVE', 'ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Get unassigned incidents (Supervisor only)' })
  @ApiResponse({ status: 200, description: 'Return unassigned incidents' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findUnassigned() {
    return this.incidentsService.findUnassigned();
  }

  @Patch(':id/assign')
  @Roles('SUPERVISOR', 'EXECUTIVE', 'ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Assign incident to field officer (Supervisor only)' })
  @ApiResponse({ status: 200, description: 'Incident assigned successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Incident or field officer not found' })
  assign(
    @Param('id') id: string,
    @Body() assignDto: AssignIncidentDto,
    @CurrentUser() user: any,
  ) {
    return this.incidentsService.assign(id, assignDto.fieldOfficerId, user.id, assignDto.notes);
  }

  @Patch(':id/review')
  @Roles('SUPERVISOR', 'EXECUTIVE', 'ADMIN', 'DEVELOPER')
  @ApiOperation({ summary: 'Review incident (Supervisor only)' })
  @ApiResponse({ status: 200, description: 'Incident reviewed successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  review(
    @Param('id') id: string,
    @Body() reviewDto: ReviewIncidentDto,
    @CurrentUser() user: any,
  ) {
    return this.incidentsService.review(id, reviewDto, user.id);
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
      user.id,
      user.role,
    );
  }

  @Post(':id/photos')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  @ApiOperation({ summary: 'Upload photo to incident' })
  @ApiResponse({ status: 201, description: 'Photo uploaded successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ) {
    return this.photosService.uploadPhoto(id, file, user.id);
  }

  @Get(':id/photos')
  @ApiOperation({ summary: 'Get all photos of an incident' })
  @ApiResponse({ status: 200, description: 'Return all photos' })
  getPhotos(@Param('id') id: string) {
    return this.photosService.getPhotos(id);
  }

  @Delete(':id/photos/:photoId')
  @ApiOperation({ summary: 'Delete a photo from incident' })
  @ApiResponse({ status: 200, description: 'Photo deleted successfully' })
  @ApiResponse({ status: 404, description: 'Photo not found' })
  deletePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @CurrentUser() user: any,
  ) {
    return this.photosService.deletePhoto(id, photoId, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete incident (Admin only)' })
  @ApiResponse({ status: 200, description: 'Incident deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @ApiResponse({ status: 404, description: 'Incident not found' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.incidentsService.remove(id, user.id, user.role);
  }
}
