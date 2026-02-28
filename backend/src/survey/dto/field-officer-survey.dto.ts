import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for Field Officer Initial Survey Submission
 * Used by Field Officers to submit survey data from the field
 */

export class GPSCoordinatesDto {
  @ApiProperty({ example: 19.9167, description: 'Latitude' })
  @IsNumber()
  lat: number;

  @ApiProperty({ example: 99.2333, description: 'Longitude' })
  @IsNumber()
  lng: number;

  @ApiProperty({ example: 10.5, description: 'GPS accuracy in meters', required: false })
  @IsNumber()
  @IsOptional()
  accuracy?: number;

  @ApiProperty({ example: 350.5, description: 'Altitude in meters', required: false })
  @IsNumber()
  @IsOptional()
  altitude?: number;
}

export class FieldOfficerSurveyDto {
  @ApiProperty({ example: 'uuid-of-task', description: 'Related task ID', required: false })
  @IsString()
  @IsOptional()
  taskId?: string;

  @ApiProperty({ example: 'uuid-of-incident', description: 'Related incident ID', required: false })
  @IsString()
  @IsOptional()
  incidentId?: string;

  @ApiProperty({ example: 'uuid-of-village', description: 'Village ID (optional if village name is provided)', required: false })
  @IsString()
  @IsOptional()
  villageId?: string;

  @ApiProperty({ example: 'บ้านเต๋าดิน หมู่ 3', description: 'Village name' })
  @IsString()
  @IsNotEmpty()
  villageName: string;

  @ApiProperty({
    example: 'น้ำท่วม',
    description: 'Disaster type (น้ำท่วม, ดินถ่ม, ไฟป่า, etc.)'
  })
  @IsString()
  @IsNotEmpty()
  disasterType: string;

  @ApiProperty({ example: 3, description: 'Severity level (1-5)', minimum: 1, maximum: 5 })
  @IsNumber()
  severity: number;

  @ApiProperty({ example: 25, description: 'Estimated affected households' })
  @IsNumber()
  estimatedHouseholds: number;

  @ApiProperty({
    example: 'น้ำท่วมขังบริเวณถนนสายหลัก ระดับน้ำประมาณ 50 ซม. ประชาชนต้องการความช่วยเหลือด้านอาหารและน้ำดื่ม',
    description: 'Survey notes and observations'
  })
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty({
    type: GPSCoordinatesDto,
    description: 'GPS coordinates of survey location'
  })
  @ValidateNested()
  @Type(() => GPSCoordinatesDto)
  gpsLocation: GPSCoordinatesDto;

  @ApiProperty({
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
    description: 'Array of photo URLs (uploaded separately)',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photoUrls?: string[];

  @ApiProperty({
    example: { type: 'Polygon', coordinates: [[[99.8833, 19.9167], [99.8850, 19.9167], [99.8850, 19.9150], [99.8833, 19.9150], [99.8833, 19.9167]]] },
    description: 'GeoJSON polygon of affected area (drawn on map)',
    required: false
  })
  @IsObject()
  @IsOptional()
  polygon?: any; // GeoJSON polygon

  @ApiProperty({
    example: 2.5,
    description: 'Area size in km² (calculated from polygon)',
    required: false
  })
  @IsNumber()
  @IsOptional()
  areaSize?: number;

  @ApiProperty({
    example: { weather: 'ฝนตก', temperature: '28°C', visibility: 'ดี' },
    description: 'Additional survey data (flexible JSON)',
    required: false
  })
  @IsObject()
  @IsOptional()
  additionalData?: Record<string, any>;
}

export class FieldOfficerSurveyResponseDto {
  @ApiProperty({ example: 'uuid-of-survey' })
  id: string;

  @ApiProperty({ example: 'uuid-of-user' })
  fieldOfficerId: string;

  @ApiProperty({ example: 'uuid-of-task' })
  taskId?: string;

  @ApiProperty({ example: 'uuid-of-incident' })
  incidentId?: string;

  @ApiProperty({ example: 'uuid-of-village' })
  villageId: string;

  @ApiProperty({ example: 'บ้านเต๋าดิน หมู่ 3' })
  villageName: string;

  @ApiProperty({ example: 'น้ำท่วม' })
  disasterType: string;

  @ApiProperty({ example: 3 })
  severity: number;

  @ApiProperty({ example: 25 })
  estimatedHouseholds: number;

  @ApiProperty({ example: 'Survey notes...' })
  notes: string;

  @ApiProperty({ type: GPSCoordinatesDto })
  gpsLocation: GPSCoordinatesDto;

  @ApiProperty({ example: ['url1', 'url2'] })
  photoUrls: string[];

  @ApiProperty({ 
    example: { type: 'Polygon', coordinates: [[[99.8833, 19.9167]]] },
    required: false 
  })
  polygon?: any;

  @ApiProperty({ example: 2.5, required: false })
  areaSize?: number;

  @ApiProperty()
  additionalData?: Record<string, any>;

  @ApiProperty({ example: '2025-11-29T14:30:00Z' })
  submittedAt: Date;

  @ApiProperty({ example: 'SUBMITTED' })
  status: string;

  constructor(partial: Partial<FieldOfficerSurveyResponseDto>) {
    Object.assign(this, partial);
  }
}
