import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { Role } from '@prisma/client';

/**
 * DTO for creating Permission
 */
export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  name: string; // e.g., "CREATE_USER", "VIEW_ANALYTICS"

  @IsString()
  @IsNotEmpty()
  displayName: string; // e.g., "สร้างผู้ใช้", "ดูการวิเคราะห์"

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string; // e.g., "User Management", "Analytics"
}

/**
 * DTO for updating Permission
 */
export class UpdatePermissionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;
}

/**
 * DTO for Permission response
 */
export interface PermissionResponseDto {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  roleCount: number;
  roles?: RoleSummaryDto[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for Role summary (used in permission response)
 */
export interface RoleSummaryDto {
  role: Role;
  displayName: string;
  assignedAt: Date;
}

/**
 * DTO for bulk permission creation
 */
export class BulkCreatePermissionsDto {
  @IsArray()
  @IsNotEmpty()
  permissions: CreatePermissionDto[];
}

/**
 * DTO for permission query filters
 */
export class PermissionQueryDto {
  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  search?: string; // Search in name, displayName, description
}
