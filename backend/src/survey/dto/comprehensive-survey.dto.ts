import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsObject, ValidateNested, IsDateString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for Comprehensive Survey Submission (8-Step Survey)
 * Used by Field Officers to submit detailed survey data
 */

export class GPSLocationDto {
    @ApiProperty({ example: 19.9167, description: 'Latitude' })
    @IsNumber()
    lat: number;

    @ApiProperty({ example: 99.2333, description: 'Longitude' })
    @IsNumber()
    lng: number;
}

export class DamageAssessmentDto {
    @ApiProperty({ description: 'Building damage details' })
    @IsObject()
    buildings: {
        partial: number;
        full: number;
        highRise: number;
        factories: number;
        temples: number;
        govtPlaces: number;
        other: string;
        estimatedDamage: number;
    };

    @ApiProperty({ description: 'Agriculture damage details' })
    @IsObject()
    agriculture: {
        cropRai: number;
        riceRai: number;
        orchardRai: number;
        fishPonds: number;
        shrimpPonds: number;
        livestockCows: number;
        livestockPigs: number;
        livestockPoultry: number;
        livestockOther: string;
        estimatedDamage: number;
    };

    @ApiProperty({ description: 'Public utilities damage details' })
    @IsObject()
    utilities: {
        roadsAgri: number;
        weirs: number;
        bridgeNecks: number;
        bridges: number;
        dams: number;
        dikes: number;
        landslides: number;
        other: string;
        estimatedDamage: number;
    };
}

export class ComprehensiveSurveyDto {
    // Step 1: Incident Info
    @ApiProperty({ example: 'uuid-of-task', description: 'Related task ID', required: false })
    @IsString()
    @IsOptional()
    taskId?: string;

    @ApiProperty({ example: 'uuid-of-village', description: 'Village ID' })
    @IsString()
    @IsNotEmpty()
    villageId: string;

    @ApiProperty({ example: 'บ้านเต๋าดิน หมู่ 3', description: 'Village name' })
    @IsString()
    @IsNotEmpty()
    villageName: string;

    @ApiProperty({ example: 'น้ำท่วม', description: 'Disaster type' })
    @IsString()
    @IsNotEmpty()
    disasterType: string;

    @ApiProperty({ example: '2026-01-20', description: 'Survey date (ISO format)' })
    @IsDateString()
    surveyDate: string;

    @ApiProperty({ type: GPSLocationDto, description: 'GPS coordinates' })
    @ValidateNested()
    @Type(() => GPSLocationDto)
    gpsLocation: GPSLocationDto;

    // Step 2: Affected People
    @ApiProperty({ example: 25, description: 'Number of affected households' })
    @IsInt()
    @Min(0)
    affectedHouseholds: number;

    @ApiProperty({ example: 100, description: 'Number of affected people' })
    @IsInt()
    @Min(0)
    affectedPeople: number;

    @ApiProperty({ example: 0, description: 'Number of deaths' })
    @IsInt()
    @Min(0)
    deadCount: number;

    @ApiProperty({ example: 0, description: 'Number of missing people' })
    @IsInt()
    @Min(0)
    missingCount: number;

    @ApiProperty({ example: 2, description: 'Number of injured people' })
    @IsInt()
    @Min(0)
    injuredCount: number;

    @ApiProperty({ example: 50, description: 'Number of evacuated people', required: false })
    @IsInt()
    @Min(0)
    @IsOptional()
    evacuatedPeople?: number;

    @ApiProperty({ example: 15, description: 'Number of evacuated households', required: false })
    @IsInt()
    @Min(0)
    @IsOptional()
    evacuatedHouseholds?: number;

    // Step 3: Damage Assessment
    @ApiProperty({ type: DamageAssessmentDto, description: 'Detailed damage assessment' })
    @ValidateNested()
    @Type(() => DamageAssessmentDto)
    damageAssessment: DamageAssessmentDto;

    // Step 4: Relief Operations
    @ApiProperty({ example: 'ช่วยเหลือด้านอาหารและน้ำดื่ม', description: 'Relief operations description', required: false })
    @IsString()
    @IsOptional()
    reliefOperations?: string;

    // Step 5: Resources
    @ApiProperty({ description: 'Resources used in operations', required: false })
    @IsObject()
    @IsOptional()
    resourcesData?: {
        waterTrucks: number;
        rescueTrucks: number;
        boats: number;
        cars: number;
        pumps: number;
        backhoes: number;
        trucks6Wheel: number;
        loaders: number;
        chainsaws: number;
        cranes: number;
        govtAgenciesCount: number;
        privateGroupsCount: number;
        volunteersCount: number;
    };

    // Step 6: Operations
    @ApiProperty({ description: 'Involved agencies and operations', required: false })
    @IsObject()
    @IsOptional()
    operationsData?: {
        localGovt: boolean;
        privateSector: boolean;
        other: string;
    };

    // Step 7: Certification
    @ApiProperty({ example: 'INFO', description: 'Report type: INFO, DISASTER_ZONE, or ASSISTANCE' })
    @IsString()
    @IsNotEmpty()
    reportType: string;

    // Additional Metadata
    @ApiProperty({ example: ['https://example.com/photo1.jpg'], description: 'Photo URLs', required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    photoUrls?: string[];

    @ApiProperty({ description: 'GeoJSON polygon of affected area', required: false })
    @IsObject()
    @IsOptional()
    polygon?: any;

    @ApiProperty({ description: 'Additional notes', required: false })
    @IsString()
    @IsOptional()
    notes?: string;
}

export class ComprehensiveSurveyResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    fieldOfficerId: string;

    @ApiProperty()
    taskId?: string;

    @ApiProperty()
    villageId: string;

    @ApiProperty()
    villageName: string;

    @ApiProperty()
    disasterType: string;

    @ApiProperty()
    surveyDate: Date;

    @ApiProperty()
    gpsLocation: GPSLocationDto;

    @ApiProperty()
    affectedHouseholds: number;

    @ApiProperty()
    affectedPeople: number;

    @ApiProperty()
    deadCount: number;

    @ApiProperty()
    missingCount: number;

    @ApiProperty()
    injuredCount: number;

    @ApiProperty()
    evacuatedPeople: number;

    @ApiProperty()
    evacuatedHouseholds: number;

    @ApiProperty()
    damageAssessment: any;

    @ApiProperty()
    reliefData?: any;

    @ApiProperty()
    resourcesData?: any;

    @ApiProperty()
    operationsData?: any;

    @ApiProperty()
    reportType: string;

    @ApiProperty()
    photoUrls: string[];

    @ApiProperty()
    polygon?: any;

    @ApiProperty()
    notes?: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    submittedAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<ComprehensiveSurveyResponseDto>) {
        Object.assign(this, partial);
    }
}
