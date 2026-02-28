import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber, IsEnum } from 'class-validator';

export enum ReportSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateFullReportDto {
  @ApiProperty()
  @IsString()
  taskId: string;

  // Step 1: Basic Information
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  summary: string;

  // Step 2: Incident Details
  @ApiProperty()
  @IsString()
  incidentDescription: string;

  @ApiProperty({ enum: ReportSeverity })
  @IsEnum(ReportSeverity)
  severity: ReportSeverity;

  // Step 3: Affected Area
  @ApiProperty()
  @IsNumber()
  affectedHouseholds: number;

  @ApiProperty()
  @IsNumber()
  affectedPopulation: number;

  @ApiProperty()
  @IsString()
  affectedAreaDescription: string;

  // Step 4: Infrastructure Damage
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  infrastructureDamage?: string;

  // Step 5: Casualties
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  casualties?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  injuries?: number;

  // Step 6: Resources Needed
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resourcesNeeded?: string;

  // Step 7: Current Response
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  currentResponse?: string;

  // Step 8: Recommendations
  @ApiProperty()
  @IsString()
  recommendations: string;

  // Step 9: Photos (URLs)
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  photoUrls?: string[];

  // Step 10: AI Analysis
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aiAnalysis?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aiAnalysisEdited?: string;
}
