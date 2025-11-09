import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto,
  BulkCreatePermissionsDto,
  PermissionQueryDto,
} from './dto/permission.dto';

@Injectable()
export class PermissionManagementService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create permission
   */
  async createPermission(dto: CreatePermissionDto): Promise<PermissionResponseDto> {
    // Check if permission with same name already exists
    const existing = await this.prisma.permission.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`Permission with name "${dto.name}" already exists`);
    }

    // Create permission
    const permission = await this.prisma.permission.create({
      data: {
        name: dto.name,
        displayName: dto.displayName,
        description: dto.description,
        category: dto.category,
      },
      include: {
        roles: {
          include: {
            roleMetadata: true,
          },
        },
      },
    });

    return this.formatPermissionResponse(permission);
  }

  /**
   * Bulk create permissions
   */
  async bulkCreatePermissions(dto: BulkCreatePermissionsDto) {
    const results = {
      created: [] as PermissionResponseDto[],
      failed: [] as { permission: CreatePermissionDto; error: string }[],
    };

    for (const permissionDto of dto.permissions) {
      try {
        const created = await this.createPermission(permissionDto);
        results.created.push(created);
      } catch (error) {
        results.failed.push({
          permission: permissionDto,
          error: error.message,
        });
      }
    }

    return results;
  }

  /**
   * Get all permissions
   */
  async getAllPermissions(query?: PermissionQueryDto): Promise<PermissionResponseDto[]> {
    const where: any = {};

    // Filter by category
    if (query?.category) {
      where.category = query.category;
    }

    // Search in name, displayName, description
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { displayName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const permissions = await this.prisma.permission.findMany({
      where,
      include: {
        roles: {
          include: {
            roleMetadata: true,
          },
        },
      },
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });

    return permissions.map((p) => this.formatPermissionResponse(p));
  }

  /**
   * Get permission by ID
   */
  async getPermission(id: string): Promise<PermissionResponseDto> {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: {
          include: {
            roleMetadata: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    return this.formatPermissionResponse(permission);
  }

  /**
   * Get permission by name
   */
  async getPermissionByName(name: string): Promise<PermissionResponseDto> {
    const permission = await this.prisma.permission.findUnique({
      where: { name },
      include: {
        roles: {
          include: {
            roleMetadata: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with name "${name}" not found`);
    }

    return this.formatPermissionResponse(permission);
  }

  /**
   * Update permission
   */
  async updatePermission(
    id: string,
    dto: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    // Check if permission exists
    const existing = await this.prisma.permission.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    // Check if name is being changed and if it conflicts
    if (dto.name && dto.name !== existing.name) {
      const nameConflict = await this.prisma.permission.findUnique({
        where: { name: dto.name },
      });

      if (nameConflict) {
        throw new ConflictException(`Permission with name "${dto.name}" already exists`);
      }
    }

    // Update permission
    const updated = await this.prisma.permission.update({
      where: { id },
      data: {
        name: dto.name,
        displayName: dto.displayName,
        description: dto.description,
        category: dto.category,
      },
      include: {
        roles: {
          include: {
            roleMetadata: true,
          },
        },
      },
    });

    return this.formatPermissionResponse(updated);
  }

  /**
   * Delete permission
   */
  async deletePermission(id: string): Promise<{ message: string }> {
    // Check if permission exists
    const existing = await this.prisma.permission.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });

    if (!existing) {
      throw new NotFoundException(`Permission with ID "${id}" not found`);
    }

    // Check if permission is assigned to any role
    if (existing.roles.length > 0) {
      throw new BadRequestException(
        `Cannot delete permission "${existing.name}" because it is assigned to ${existing.roles.length} role(s)`,
      );
    }

    // Delete permission
    await this.prisma.permission.delete({
      where: { id },
    });

    return { message: `Permission "${existing.name}" deleted successfully` };
  }

  /**
   * Get permission categories
   */
  async getCategories(): Promise<string[]> {
    const permissions = await this.prisma.permission.findMany({
      select: {
        category: true,
      },
      distinct: ['category'],
      orderBy: {
        category: 'asc',
      },
    });

    return permissions.map((p) => p.category);
  }

  /**
   * Get permissions by category
   */
  async getPermissionsByCategory(): Promise<Record<string, PermissionResponseDto[]>> {
    const permissions = await this.getAllPermissions();

    const grouped: Record<string, PermissionResponseDto[]> = {};

    for (const permission of permissions) {
      if (!grouped[permission.category]) {
        grouped[permission.category] = [];
      }
      grouped[permission.category].push(permission);
    }

    return grouped;
  }

  /**
   * Get permission statistics
   */
  async getPermissionStatistics() {
    const totalPermissions = await this.prisma.permission.count();
    const categories = await this.getCategories();

    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const count = await this.prisma.permission.count({
          where: { category },
        });
        return { category, count };
      }),
    );

    // Get permissions with most roles
    const permissionsWithRoles = await this.prisma.permission.findMany({
      include: {
        roles: true,
      },
      orderBy: {
        roles: {
          _count: 'desc',
        },
      },
      take: 5,
    });

    return {
      totalPermissions,
      totalCategories: categories.length,
      categoryStats,
      mostUsedPermissions: permissionsWithRoles.map((p) => ({
        id: p.id,
        name: p.name,
        displayName: p.displayName,
        roleCount: p.roles.length,
      })),
    };
  }

  /**
   * Get roles that have a specific permission
   */
  async getPermissionRoles(permissionId: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id: permissionId },
      include: {
        roles: {
          include: {
            roleMetadata: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException(`Permission with ID "${permissionId}" not found`);
    }

    return permission.roles.map((rp) => ({
      role: rp.role,
      displayName: rp.roleMetadata.displayName,
      assignedAt: rp.assignedAt,
    }));
  }

  /**
   * Format permission response
   */
  private formatPermissionResponse(permission: any): PermissionResponseDto {
    return {
      id: permission.id,
      name: permission.name,
      displayName: permission.displayName,
      description: permission.description,
      category: permission.category,
      roleCount: permission.roles?.length || 0,
      roles: permission.roles?.map((rp: any) => ({
        role: rp.role,
        displayName: rp.roleMetadata.displayName,
        assignedAt: rp.assignedAt,
      })),
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
