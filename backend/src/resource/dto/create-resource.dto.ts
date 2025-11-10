import { IsString, IsNotEmpty, IsEnum, IsOptional, MinLength, IsUUID } from 'class-validator';
import { ResourceStatus } from '@prisma/client';

export class CreateResourceDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsUUID()
  @IsNotEmpty()
  resourceTypeId: string;

  @IsEnum(ResourceStatus)
  @IsOptional()
  status?: ResourceStatus;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  registrationNumber?: string;
}
