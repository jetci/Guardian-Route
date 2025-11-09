import { IsString, IsNotEmpty, IsEnum, IsOptional, IsArray } from 'class-validator';
import { Role } from '@prisma/client';

/**
 * DTO for creating Role Metadata
 */
export class CreateRoleMetadataDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  permissionIds?: string[]; // Optional: assign permissions during creation
}

/**
 * DTO for updating Role Metadata
 */
export class UpdateRoleMetadataDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

/**
 * DTO for Role Metadata response
 */
export interface RoleMetadataResponseDto {
  role: Role;
  displayName: string;
  description: string;
  permissionCount: number;
  permissions?: PermissionSummaryDto[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO for Permission summary (used in role metadata response)
 */
export interface PermissionSummaryDto {
  id: string;
  name: string;
  displayName: string;
  category: string;
}

/**
 * DTO for assigning permissions to role
 */
export class AssignPermissionsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  permissionIds: string[];
}

/**
 * DTO for removing permissions from role
 */
export class RemovePermissionsDto {
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  permissionIds: string[];
}
