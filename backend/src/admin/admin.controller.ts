import { Controller, Get, Post, Put, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.DEVELOPER)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  // GeoJSON Management Endpoints
  @Get('geojson')
  @ApiOperation({ summary: 'Get all GeoJSON boundaries' })
  @ApiResponse({ status: 200, description: 'Return all boundaries' })
  async getAllBoundaries() {
    return this.adminService.getAllBoundaries();
  }

  @Get('geojson/:id')
  @ApiOperation({ summary: 'Get specific GeoJSON boundary' })
  @ApiResponse({ status: 200, description: 'Return boundary by ID' })
  async getBoundary(@Param('id') id: string) {
    return this.adminService.getBoundary(id);
  }

  @Post('geojson/upload')
  @ApiOperation({ summary: 'Upload GeoJSON file' })
  @ApiResponse({ status: 201, description: 'Boundary created' })
  async uploadGeoJSON(@Body() data: any, @Request() req) {
    return this.adminService.createBoundary(data, req.user.id);
  }

  @Post('boundaries/draw')
  @ApiOperation({ summary: 'Save drawn boundary' })
  @ApiResponse({ status: 201, description: 'Boundary saved' })
  async saveDrawnBoundary(@Body() data: any, @Request() req) {
    return this.adminService.createBoundary(data, req.user.id);
  }

  @Patch('geojson/:id')
  @ApiOperation({ summary: 'Update GeoJSON boundary (partial update)' })
  @ApiResponse({ status: 200, description: 'Boundary updated' })
  async updateBoundary(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.adminService.updateBoundary(id, data, req.user.id);
  }

  @Delete('geojson/:id')
  @ApiOperation({ summary: 'Delete GeoJSON boundary' })
  @ApiResponse({ status: 200, description: 'Boundary deleted' })
  async deleteBoundary(@Param('id') id: string) {
    return this.adminService.deleteBoundary(id);
  }

  // Village Boundaries
  @Get('villages/boundaries')
  @ApiOperation({ summary: 'Get all village boundaries' })
  @ApiResponse({ status: 200, description: 'Return village boundaries' })
  async getVillageBoundaries() {
    return this.adminService.getVillageBoundaries();
  }

  @Patch('villages/:villageId/boundary')
  @ApiOperation({ summary: 'Update village boundary (partial update)' })
  @ApiResponse({ status: 200, description: 'Village boundary updated' })
  async updateVillageBoundary(
    @Param('villageId') villageId: string,
    @Body() data: { boundary: any; centerPoint: any },
  ) {
    return this.adminService.updateVillageBoundary(
      villageId,
      data.boundary,
      data.centerPoint,
    );
  }

  @Delete('villages/:villageId/boundary')
  @ApiOperation({ summary: 'Delete village boundary' })
  @ApiResponse({ status: 200, description: 'Village boundary deleted' })
  async deleteVillageBoundary(@Param('villageId') villageId: string) {
    return this.adminService.deleteVillageBoundary(villageId);
  }

  // Tambon Boundary
  @Get('tambon/boundary')
  @ApiOperation({ summary: 'Get tambon boundary' })
  @ApiResponse({ status: 200, description: 'Return tambon boundary' })
  async getTambonBoundary() {
    return this.adminService.getTambonBoundary();
  }

  @Post('tambon/boundary')
  @ApiOperation({ summary: 'Save or update tambon boundary' })
  @ApiResponse({ status: 201, description: 'Tambon boundary saved' })
  async saveTambonBoundary(@Body() data: any, @Request() req) {
    return this.adminService.saveTambonBoundary(data, req.user.id);
  }
}
