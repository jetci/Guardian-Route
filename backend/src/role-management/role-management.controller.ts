import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleManagementService } from './role-management.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnhancedRolesGuard } from '../auth/guards/enhanced-roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  CreateRoleMetadataDto,
  UpdateRoleMetadataDto,
  AssignPermissionsDto,
  RemovePermissionsDto,
} from './dto/role-metadata.dto';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  BulkCreatePermissionsDto,
  PermissionQueryDto,
} from './dto/permission.dto';
import { PermissionManagementService } from './permission-management.service';

@Controller('api/role-management')
@UseGuards(JwtAuthGuard, EnhancedRolesGuard)
@Roles(Role.ADMIN) // Only ADMIN can manage roles
export class RoleManagementController {
  constructor(
    private readonly roleManagementService: RoleManagementService,
    private readonly permissionManagementService: PermissionManagementService,
  ) {}

  /**
   * Create role metadata
   * POST /api/role-management/roles
   */
  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  async createRoleMetadata(@Body() dto: CreateRoleMetadataDto) {
    return this.roleManagementService.createRoleMetadata(dto);
  }

  /**
   * Get all role metadata
   * GET /api/role-management/roles
   */
  @Get('roles')
  async getAllRoleMetadata() {
    return this.roleManagementService.getAllRoleMetadata();
  }

  /**
   * Get role statistics
   * GET /api/role-management/roles/stats
   */
  @Get('roles/stats')
  async getRoleStatistics() {
    return this.roleManagementService.getRoleStatistics();
  }

  /**
   * Get role metadata by role
   * GET /api/role-management/roles/:role
   */
  @Get('roles/:role')
  async getRoleMetadata(@Param('role') role: Role) {
    return this.roleManagementService.getRoleMetadata(role);
  }

  /**
   * Update role metadata
   * PATCH /api/role-management/roles/:role
   */
  @Patch('roles/:role')
  async updateRoleMetadata(
    @Param('role') role: Role,
    @Body() dto: UpdateRoleMetadataDto,
  ) {
    return this.roleManagementService.updateRoleMetadata(role, dto);
  }

  /**
   * Delete role metadata
   * DELETE /api/role-management/roles/:role
   */
  @Delete('roles/:role')
  @HttpCode(HttpStatus.OK)
  async deleteRoleMetadata(@Param('role') role: Role) {
    return this.roleManagementService.deleteRoleMetadata(role);
  }

  /**
   * Assign permissions to role
   * POST /api/role-management/roles/:role/permissions
   */
  @Post('roles/:role/permissions')
  async assignPermissions(
    @Param('role') role: Role,
    @Body() dto: AssignPermissionsDto,
  ) {
    return this.roleManagementService.assignPermissions(role, dto);
  }

  /**
   * Remove permissions from role
   * DELETE /api/role-management/roles/:role/permissions
   */
  @Delete('roles/:role/permissions')
  async removePermissions(
    @Param('role') role: Role,
    @Body() dto: RemovePermissionsDto,
  ) {
    return this.roleManagementService.removePermissions(role, dto);
  }

  /**
   * Get role permissions
   * GET /api/role-management/roles/:role/permissions
   */
  @Get('roles/:role/permissions')
  async getRolePermissions(@Param('role') role: Role) {
    return this.roleManagementService.getRolePermissions(role);
  }

  // ========================================
  // PERMISSION MANAGEMENT ENDPOINTS
  // ========================================

  /**
   * Create permission
   * POST /api/role-management/permissions
   */
  @Post('permissions')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(@Body() dto: CreatePermissionDto) {
    return this.permissionManagementService.createPermission(dto);
  }

  /**
   * Bulk create permissions
   * POST /api/role-management/permissions/bulk
   */
  @Post('permissions/bulk')
  @HttpCode(HttpStatus.CREATED)
  async bulkCreatePermissions(@Body() dto: BulkCreatePermissionsDto) {
    return this.permissionManagementService.bulkCreatePermissions(dto);
  }

  /**
   * Get all permissions
   * GET /api/role-management/permissions
   */
  @Get('permissions')
  async getAllPermissions(@Body() query?: PermissionQueryDto) {
    return this.permissionManagementService.getAllPermissions(query);
  }

  /**
   * Get permission statistics
   * GET /api/role-management/permissions/stats
   */
  @Get('permissions/stats')
  async getPermissionStatistics() {
    return this.permissionManagementService.getPermissionStatistics();
  }

  /**
   * Get permission categories
   * GET /api/role-management/permissions/categories
   */
  @Get('permissions/categories')
  async getCategories() {
    return this.permissionManagementService.getCategories();
  }

  /**
   * Get permissions grouped by category
   * GET /api/role-management/permissions/by-category
   */
  @Get('permissions/by-category')
  async getPermissionsByCategory() {
    return this.permissionManagementService.getPermissionsByCategory();
  }

  /**
   * Get permission by ID
   * GET /api/role-management/permissions/:id
   */
  @Get('permissions/:id')
  async getPermission(@Param('id') id: string) {
    return this.permissionManagementService.getPermission(id);
  }

  /**
   * Update permission
   * PATCH /api/role-management/permissions/:id
   */
  @Patch('permissions/:id')
  async updatePermission(
    @Param('id') id: string,
    @Body() dto: UpdatePermissionDto,
  ) {
    return this.permissionManagementService.updatePermission(id, dto);
  }

  /**
   * Delete permission
   * DELETE /api/role-management/permissions/:id
   */
  @Delete('permissions/:id')
  @HttpCode(HttpStatus.OK)
  async deletePermission(@Param('id') id: string) {
    return this.permissionManagementService.deletePermission(id);
  }

  /**
   * Get roles that have a specific permission
   * GET /api/role-management/permissions/:id/roles
   */
  @Get('permissions/:id/roles')
  async getPermissionRoles(@Param('id') id: string) {
    return this.permissionManagementService.getPermissionRoles(id);
  }
}
