import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsObject,
  MinLength,
  IsEnum,
} from 'class-validator';

export class CreateFullReportWizardDto {
  @ApiProperty({ description: 'Task ID' })
  @IsString()
  taskId: string;

  // Step 1: Basic Info
  @ApiProperty({ description: 'Report title', minLength: 10 })
  @IsString()
  @MinLength(10)
  reportTitle: string;

  @ApiProperty({ description: 'Executive summary', minLength: 50 })
  @IsString()
  @MinLength(50)
  executiveSummary: string;

  // Step 2: Damage Assessment
  @ApiProperty({ description: 'Severity level' })
  @IsString()
  severity: string;

  @ApiProperty({ description: 'Damage categories' })
  @IsArray()
  damageCategories: string[];

  @ApiProperty({ description: 'Estimated damage cost' })
  @IsNumber()
  estimatedDamageCost: number;

  // Step 3: Affected Area
  @ApiProperty({ description: 'Affected households' })
  @IsNumber()
  affectedHouseholds: number;

  @ApiProperty({ description: 'Affected population' })
  @IsNumber()
  affectedPopulation: number;

  @ApiProperty({ description: 'Evacuated people' })
  @IsNumber()
  evacuatedPeople: number;

  // Step 4: Infrastructure
  @ApiProperty({ description: 'Infrastructure damage' })
  @IsArray()
  infrastructureDamage: string[];

  @ApiProperty({ description: 'Infrastructure damage details' })
  @IsString()
  @IsOptional()
  infrastructureDamageDetails?: string;

  @ApiProperty({ description: 'Infrastructure repair cost' })
  @IsNumber()
  @IsOptional()
  infrastructureRepairCost?: number;

  // Step 5: Casualties
  @ApiProperty({ description: 'Number of casualties' })
  @IsNumber()
  casualties: number;

  @ApiProperty({ description: 'Number of injuries' })
  @IsNumber()
  injuries: number;

  @ApiProperty({ description: 'Number of missing persons' })
  @IsNumber()
  missing: number;

  @ApiProperty({ description: 'Casualty details' })
  @IsString()
  @IsOptional()
  casualtyDetails?: string;

  // Step 6: Resources
  @ApiProperty({ description: 'Urgent priority items' })
  @IsArray()
  urgentPriorityItems: Array<{
    item: string;
    quantity: number;
    priority: string;
  }>;

  // Step 7: Response
  @ApiProperty({ description: 'Responding agencies' })
  @IsArray()
  respondingAgencies: Array<{
    agency: string;
    role: string;
    personnel: number;
  }>;

  // Step 8: Photos
  @ApiProperty({ description: 'Photo URLs' })
  @IsArray()
  @IsOptional()
  photoUrls?: string[];

  // Step 9: AI Analysis
  @ApiProperty({ description: 'AI analysis result' })
  @IsObject()
  @IsOptional()
  aiAnalysis?: {
    damageLevel: string;
    affectedStructures: string;
    estimatedAffectedArea: number;
    visibleHazards: string;
    recommendations: string;
    confidence?: number;
  };

  // Step 10: Recommendations
  @ApiProperty({ description: 'General recommendations', minLength: 100 })
  @IsString()
  @MinLength(100)
  recommendations: string;

  @ApiProperty({ description: 'Policy recommendations', minLength: 100 })
  @IsString()
  @MinLength(100)
  policyRecommendations: string;

  @ApiProperty({ description: 'Future prevention measures', minLength: 100 })
  @IsString()
  @MinLength(100)
  futurePreventionMeasures: string;

  // Audit log
  @ApiProperty({ description: 'Audit log entries' })
  @IsArray()
  @IsOptional()
  auditLog?: Array<{
    timestamp: Date;
    action: string;
    field: string;
    oldValue?: any;
    newValue?: any;
    source: string;
  }>;
}
