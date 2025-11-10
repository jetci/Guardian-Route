import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DisasterType, Priority } from '@prisma/client';

export class DashboardFiltersDto {
  @ApiPropertyOptional({
    description: 'Start date for filtering data (ISO 8601 format)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'End date for filtering data (ISO 8601 format)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description: 'Filter by region/province',
    example: 'Bangkok',
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Filter by disaster type',
    enum: DisasterType,
    example: DisasterType.FLOOD,
  })
  @IsOptional()
  @IsEnum(DisasterType)
  disasterType?: DisasterType;

  @ApiPropertyOptional({
    description: 'Filter by priority level',
    enum: Priority,
    example: Priority.HIGH,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;
}
