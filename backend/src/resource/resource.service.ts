import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { CreateResourceTypeDto } from './dto/create-resource-type.dto';
import { ResourceStatus } from '@prisma/client';

@Injectable()
export class ResourceService {
  constructor(private prisma: PrismaService) {}

  // Resource Types
  async createResourceType(dto: CreateResourceTypeDto) {
    return this.prisma.resourceType.create({
      data: dto,
    });
  }

  async findAllResourceTypes() {
    return this.prisma.resourceType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  // Resources
  async create(dto: CreateResourceDto) {
    // Verify resource type exists
    const resourceType = await this.prisma.resourceType.findUnique({
      where: { id: dto.resourceTypeId },
    });

    if (!resourceType) {
      throw new BadRequestException('Resource type not found');
    }

    return this.prisma.resource.create({
      data: {
        ...dto,
        status: dto.status || ResourceStatus.AVAILABLE,
      },
      include: {
        resourceType: true,
      },
    });
  }

  async findAll(filters?: {
    search?: string;
    resourceTypeId?: string;
    status?: ResourceStatus;
  }) {
    const where: any = {};

    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        {
          registrationNumber: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (filters?.resourceTypeId) {
      where.resourceTypeId = filters.resourceTypeId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    return this.prisma.resource.findMany({
      where,
      include: {
        resourceType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const resource = await this.prisma.resource.findUnique({
      where: { id },
      include: {
        resourceType: true,
      },
    });

    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return resource;
  }

  async update(id: string, dto: UpdateResourceDto) {
    // Verify resource exists
    await this.findOne(id);

    // If resourceTypeId is provided, verify it exists
    if (dto.resourceTypeId) {
      const resourceType = await this.prisma.resourceType.findUnique({
        where: { id: dto.resourceTypeId },
      });

      if (!resourceType) {
        throw new BadRequestException('Resource type not found');
      }
    }

    return this.prisma.resource.update({
      where: { id },
      data: dto,
      include: {
        resourceType: true,
      },
    });
  }

  async remove(id: string) {
    // Verify resource exists
    await this.findOne(id);

    // Check if resource is currently allocated
    const activeAllocations = await this.prisma.allocationRecord.count({
      where: {
        resourceId: id,
        reclaimedAt: null,
      },
    });

    if (activeAllocations > 0) {
      throw new BadRequestException(
        'Cannot delete resource that is currently allocated',
      );
    }

    return this.prisma.resource.delete({
      where: { id },
    });
  }
}
