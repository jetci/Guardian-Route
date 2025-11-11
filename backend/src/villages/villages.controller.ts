import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VillagesService } from './villages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('villages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('villages')
export class VillagesController {
  constructor(private readonly villagesService: VillagesService) {}

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

  @Get(':id')
  @ApiOperation({ summary: 'Get village by ID' })
  @ApiResponse({ status: 200, description: 'Return village by ID' })
  findOne(@Param('id') id: string) {
    return this.villagesService.findOne(id);
  }
}
