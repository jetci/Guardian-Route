import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Role } from '@prisma/client';
import {
  CreateRoleMetadataDto,
  UpdateRoleMetadataDto,
  RoleMetadataResponseDto,
  AssignPermissionsDto,
  RemovePermissionsDto,
} from './dto/role-metadata.dto';

@Injectable()
export class RoleManagementService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create role metadata
   */
  async createRoleMetadata(dto: CreateRoleMetadataDto): Promise<RoleMetadataResponseDto> {
    // Check if role metadata already exists
    const existing = await this.prisma.roleMetadata.findUnique({
      where: { role: dto.role },
    });

    if (existing) {
      throw new ConflictException(`Role metadata for ${dto.role} already exists`);
    }

    // Create role metadata
    const roleMetadata = await this.prisma.roleMetadata.create({
      data: {
        role: dto.role,
        displayName: dto.displayName,
        description: dto.description,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    // Assign permissions if provided
    if (dto.permissionIds && dto.permissionIds.length > 0) {
      await this.assignPermissions(dto.role, { permissionIds: dto.permissionIds });
    }

    return this.formatRoleMetadataResponse(roleMetadata);
  }

  /**
   * Get all role metadata
   */
  async getAllRoleMetadata(): Promise<RoleMetadataResponseDto[]> {
    const roleMetadataList = await this.prisma.roleMetadata.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
      orderBy: {
        role: 'asc',
      },
    });

    return roleMetadataList.map((rm) => this.formatRoleMetadataResponse(rm));
  }

  /**
   * Get role metadata by role
   */
  async getRoleMetadata(role: Role): Promise<RoleMetadataResponseDto> {
    const roleMetadata = await this.prisma.roleMetadata.findUnique({
      where: { role },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleMetadata) {
      throw new NotFoundException(`Role metadata for ${role} not found`);
    }

    return this.formatRoleMetadataResponse(roleMetadata);
  }

  /**
   * Update role metadata
   */
  async updateRoleMetadata(
    role: Role,
    dto: UpdateRoleMetadataDto,
  ): Promise<RoleMetadataResponseDto> {
    // Check if role metadata exists
    const existing = await this.prisma.roleMetadata.findUnique({
      where: { role },
    });

    if (!existing) {
      throw new NotFoundException(`Role metadata for ${role} not found`);
    }

    // Update role metadata
    const updated = await this.prisma.roleMetadata.update({
      where: { role },
      data: {
        displayName: dto.displayName,
        description: dto.description,
      },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    return this.formatRoleMetadataResponse(updated);
  }

  /**
   * Delete role metadata
   */
  async deleteRoleMetadata(role: Role): Promise<{ message: string }> {
    // Check if role metadata exists
    const existing = await this.prisma.roleMetadata.findUnique({
      where: { role },
    });

    if (!existing) {
      throw new NotFoundException(`Role metadata for ${role} not found`);
    }

    // Delete role metadata (cascade will delete role permissions)
    await this.prisma.roleMetadata.delete({
      where: { role },
    });

    return { message: `Role metadata for ${role} deleted successfully` };
  }

  /**
   * Assign permissions to role
   */
  async assignPermissions(
    role: Role,
    dto: AssignPermissionsDto,
  ): Promise<RoleMetadataResponseDto> {
    // Check if role metadata exists
    const roleMetadata = await this.prisma.roleMetadata.findUnique({
      where: { role },
    });

    if (!roleMetadata) {
      throw new NotFoundException(`Role metadata for ${role} not found`);
    }

    // Validate permissions exist
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: { in: dto.permissionIds },
      },
    });

    if (permissions.length !== dto.permissionIds.length) {
      throw new BadRequestException('One or more permissions not found');
    }

    // Get existing permissions
    const existingPermissions = await this.prisma.rolePermission.findMany({
      where: {
        role,
        permissionId: { in: dto.permissionIds },
      },
    });

    // Filter out already assigned permissions
    const newPermissionIds = dto.permissionIds.filter(
      (id) => !existingPermissions.some((ep) => ep.permissionId === id),
    );

    // Assign new permissions
    if (newPermissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: newPermissionIds.map((permissionId) => ({
          role,
          permissionId,
        })),
      });
    }

    // Return updated role metadata
    return this.getRoleMetadata(role);
  }

  /**
   * Remove permissions from role
   */
  async removePermissions(
    role: Role,
    dto: RemovePermissionsDto,
  ): Promise<RoleMetadataResponseDto> {
    // Check if role metadata exists
    const roleMetadata = await this.prisma.roleMetadata.findUnique({
      where: { role },
    });

    if (!roleMetadata) {
      throw new NotFoundException(`Role metadata for ${role} not found`);
    }

    // Remove permissions
    await this.prisma.rolePermission.deleteMany({
      where: {
        role,
        permissionId: { in: dto.permissionIds },
      },
    });

    // Return updated role metadata
    return this.getRoleMetadata(role);
  }

  /**
   * Get role permissions
   */
  async getRolePermissions(role: Role) {
    const roleMetadata = await this.prisma.roleMetadata.findUnique({
      where: { role },
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!roleMetadata) {
      throw new NotFoundException(`Role metadata for ${role} not found`);
    }

    return roleMetadata.permissions.map((rp) => ({
      id: rp.permission.id,
      name: rp.permission.name,
      displayName: rp.permission.displayName,
      description: rp.permission.description,
      category: rp.permission.category,
      assignedAt: rp.assignedAt,
    }));
  }

  /**
   * Get role statistics
   */
  async getRoleStatistics() {
    const roleMetadataList = await this.prisma.roleMetadata.findMany({
      include: {
        permissions: true,
      },
    });

    // Get user count per role
    const userCounts = await Promise.all(
      Object.values(Role).map(async (role) => {
        const count = await this.prisma.user.count({
          where: { role: role as Role },
        });
        return { role, count };
      }),
    );

    return {
      totalRoles: Object.values(Role).length,
      rolesWithMetadata: roleMetadataList.length,
      roleStats: Object.values(Role).map((role) => {
        const metadata = roleMetadataList.find((rm) => rm.role === role);
        const userCount = userCounts.find((uc) => uc.role === role)?.count || 0;

        return {
          role,
          displayName: metadata?.displayName || role,
          userCount,
          permissionCount: metadata?.permissions.length || 0,
        };
      }),
    };
  }

  /**
   * Format role metadata response
   */
  private formatRoleMetadataResponse(roleMetadata: any): RoleMetadataResponseDto {
    return {
      role: roleMetadata.role,
      displayName: roleMetadata.displayName,
      description: roleMetadata.description,
      permissionCount: roleMetadata.permissions?.length || 0,
      permissions: roleMetadata.permissions?.map((rp: any) => ({
        id: rp.permission.id,
        name: rp.permission.name,
        displayName: rp.permission.displayName,
        category: rp.permission.category,
      })),
      createdAt: roleMetadata.createdAt,
      updatedAt: roleMetadata.updatedAt,
    };
  }
}
