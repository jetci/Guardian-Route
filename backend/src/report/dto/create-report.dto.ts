import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsDateString,
  IsObject,
  IsUUID,
  Min,
} from 'class-validator';
import { ReportType, ReportStatus } from '@prisma/client';

export class CreateReportDto {
  @ApiProperty({
    description: 'Type of report',
    enum: ReportType,
    example: ReportType.INCIDENT,
  })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({
    description: 'Report title',
    example: 'Flood Damage Assessment - Village 1',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Report summary',
    example: 'Summary of flood damage in Village 1 affecting 15 households',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    description: 'Structured report data',
    example: {
      findings: ['Severe flooding in low-lying areas'],
      recommendations: ['Improve drainage system'],
    },
  })
  @IsOptional()
  @IsObject()
  details?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Total damage estimate in THB',
    example: 500000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalDamageEstimate?: number;

  @ApiPropertyOptional({
    description: 'Number of affected households',
    example: 15,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  affectedHouseholds?: number;

  @ApiPropertyOptional({
    description: 'Number of affected persons',
    example: 45,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  affectedPersons?: number;

  @ApiPropertyOptional({
    description: 'AI analysis results from Gemini API',
    example: {
      severity: 'high',
      recommendations: ['Immediate evacuation required'],
    },
  })
  @IsOptional()
  @IsObject()
  aiAnalysis?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Array of photo URLs',
    example: [
      'https://example.com/photo1.jpg',
      'https://example.com/photo2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photoUrls?: string[];

  @ApiPropertyOptional({
    description: 'Template ID for custom reports',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({
    description: 'Period start date (for monthly/custom reports)',
    example: '2025-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  periodStart?: string;

  @ApiPropertyOptional({
    description: 'Period end date (for monthly/custom reports)',
    example: '2025-01-31T23:59:59Z',
  })
  @IsOptional()
  @IsDateString()
  periodEnd?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for report generation',
    example: {
      filters: { village: '1', status: 'RESOLVED' },
      parameters: { includeImages: true },
    },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Incident ID (required for INCIDENT reports)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  incidentId?: string;

  @ApiPropertyOptional({
    description: 'Initial status of the report',
    enum: ReportStatus,
    example: ReportStatus.DRAFT,
    default: ReportStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;
}
