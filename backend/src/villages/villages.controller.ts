import { Controller, Get, Post, Patch, Delete, Param, UseGuards, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { VillagesService } from './villages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UploadGeoJsonDto } from './dto/upload-geojson.dto';
import { CreateVillageDto } from './dto/create-village.dto';
import { UpdateVillageDto } from './dto/update-village.dto';

@ApiTags('villages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('villages')
export class VillagesController {
  constructor(private readonly villagesService: VillagesService) { }

  @Get()
  @ApiOperation({ summary: 'Get all villages' })
  @ApiResponse({ status: 200, description: 'Return all villages' })
  findAll() {
    return this.villagesService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get villages statistics' })
  @ApiResponse({ status: 200, description: 'Return statistics summary' })
  getStatistics() {
    return this.villagesService.getStatistics();
  }

  @Get('no/:villageNo')
  @ApiOperation({ summary: 'Get village by village number' })
  @ApiResponse({ status: 200, description: 'Return village by number' })
  findByVillageNo(@Param('villageNo') villageNo: string) {
    return this.villagesService.findByVillageNo(+villageNo);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new village (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'Village created successfully' })
  @ApiResponse({ status: 409, description: 'Village number already exists' })
  create(@Body() createVillageDto: CreateVillageDto) {
    return this.villagesService.create(createVillageDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get village by ID' })
  @ApiResponse({ status: 200, description: 'Return village by ID' })
  findOne(@Param('id') id: string) {
    return this.villagesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update village (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Village updated successfully' })
  @ApiResponse({ status: 404, description: 'Village not found' })
  update(@Param('id') id: string, @Body() updateVillageDto: UpdateVillageDto) {
    return this.villagesService.update(id, updateVillageDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete village (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Village deleted successfully' })
  @ApiResponse({ status: 404, description: 'Village not found' })
  @ApiResponse({ status: 400, description: 'Cannot delete village with related data' })
  remove(@Param('id') id: string) {
    return this.villagesService.remove(id);
  }

  @Post('upload/geojson/validate')
  @ApiOperation({ summary: 'Validate GeoJSON file without saving' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['village_boundary', 'district_boundary', 'risk_zone', 'infrastructure'],
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async validateGeoJson(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadGeoJsonDto,
  ) {
    return this.villagesService.validateGeoJson(file, dto);
  }

  @Post('upload/geojson')
  @ApiOperation({ summary: 'Upload and save GeoJSON file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        type: {
          type: 'string',
          enum: ['village_boundary', 'district_boundary', 'risk_zone', 'infrastructure'],
        },
        description: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadGeoJson(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadGeoJsonDto,
  ) {
    return this.villagesService.uploadGeoJson(file, dto);
  }
}
