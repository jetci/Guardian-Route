import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { CreateResourceTypeDto } from './dto/create-resource-type.dto';
import { AllocateResourceDto } from './dto/allocate-resource.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Request } from 'express';
import { Role, ResourceStatus } from '@prisma/client';

@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  // Resource Types
  @Post('types')
  @Roles(Role.ADMIN)
  createResourceType(@Body() dto: CreateResourceTypeDto) {
    return this.resourceService.createResourceType(dto);
  }

  @Get('types')
  @Roles(Role.ADMIN, Role.EXECUTIVE, Role.SUPERVISOR, Role.FIELD_OFFICER)
  findAllResourceTypes() {
    return this.resourceService.findAllResourceTypes();
  }

  // Resources
  @Post()
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  create(@Body() dto: CreateResourceDto) {
    return this.resourceService.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.EXECUTIVE, Role.SUPERVISOR)
  findAll(
    @Query('search') search?: string,
    @Query('resourceTypeId') resourceTypeId?: string,
    @Query('status') status?: ResourceStatus,
  ) {
    return this.resourceService.findAll({ search, resourceTypeId, status });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.EXECUTIVE, Role.SUPERVISOR)
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  update(@Param('id') id: string, @Body() dto: UpdateResourceDto) {
    return this.resourceService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }

  // Allocation
  @Post(':id/allocate')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  allocate(
    @Param('id') id: string,
    @Body() dto: AllocateResourceDto,
    @Request() req: any,
  ) {
    return this.resourceService.allocate(id, dto.taskId, req.user.userId);
  }

  @Post('reclaim/:allocationId')
  @Roles(Role.ADMIN, Role.SUPERVISOR)
  reclaim(@Param('allocationId') allocationId: string) {
    return this.resourceService.reclaim(allocationId);
  }

  @Get(':id/history')
  @Roles(Role.ADMIN, Role.EXECUTIVE, Role.SUPERVISOR)
  getHistory(@Param('id') id: string) {
    return this.resourceService.getHistory(id);
  }
}
