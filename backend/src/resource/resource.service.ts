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

  // Allocation
  async allocate(resourceId: string, taskId: string, userId: string) {
    // Verify resource exists and is available
    const resource = await this.findOne(resourceId);

    if (resource.status !== ResourceStatus.AVAILABLE) {
      throw new BadRequestException(
        `Cannot allocate resource with status ${resource.status}. Only AVAILABLE resources can be allocated.`,
      );
    }

    // Verify task exists
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    // Create allocation record and update resource status
    const allocation = await this.prisma.allocationRecord.create({
      data: {
        resourceId,
        taskId,
        allocatedById: userId,
      },
      include: {
        resource: {
          include: {
            resourceType: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        allocatedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Update resource status to IN_USE
    await this.prisma.resource.update({
      where: { id: resourceId },
      data: { status: ResourceStatus.IN_USE },
    });

    return allocation;
  }

  async reclaim(allocationId: string) {
    // Verify allocation exists
    const allocation = await this.prisma.allocationRecord.findUnique({
      where: { id: allocationId },
      include: {
        resource: true,
      },
    });

    if (!allocation) {
      throw new NotFoundException('Allocation record not found');
    }

    if (allocation.reclaimedAt) {
      throw new BadRequestException('Resource has already been reclaimed');
    }

    // Update allocation record
    const updatedAllocation = await this.prisma.allocationRecord.update({
      where: { id: allocationId },
      data: { reclaimedAt: new Date() },
      include: {
        resource: {
          include: {
            resourceType: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        allocatedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    // Update resource status to AVAILABLE
    await this.prisma.resource.update({
      where: { id: allocation.resourceId },
      data: { status: ResourceStatus.AVAILABLE },
    });

    return updatedAllocation;
  }

  async getHistory(resourceId: string) {
    // Verify resource exists
    await this.findOne(resourceId);

    return this.prisma.allocationRecord.findMany({
      where: { resourceId },
      include: {
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        allocatedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { allocatedAt: 'desc' },
    });
  }
