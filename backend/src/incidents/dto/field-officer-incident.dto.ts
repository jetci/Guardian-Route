import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsObject, ValidateNested, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for Field Officer Incident Report Creation
 * Used by Field Officers to create detailed incident reports from the field
 */

export class GPSLocationDto {
  @ApiProperty({ example: 19.9167, description: 'Latitude' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 99.2333, description: 'Longitude' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 10.5, description: 'GPS accuracy in meters', required: false })
  @IsNumber()
  @IsOptional()
  accuracy?: number;
}

export class PolygonGeometryDto {
  @ApiProperty({ example: 'Polygon', description: 'GeoJSON geometry type' })
  @IsString()
  type: string;

  @ApiProperty({ 
    example: [[[99.2333, 19.9167], [99.2343, 19.9167], [99.2343, 19.9177], [99.2333, 19.9177], [99.2333, 19.9167]]],
    description: 'Array of coordinate arrays defining the polygon'
  })
  @IsArray()
  coordinates: number[][][];
}

export class FieldOfficerIncidentDto {
  @ApiProperty({ example: '2025-11-29', description: 'Incident date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  incidentDate: string;

  @ApiProperty({ 
    example: 'น้ำท่วม', 
    description: 'Disaster type (น้ำท่วม, ดินถ่ม, ไฟป่า, แผ่นดินไหว, etc.)' 
  })
  @IsString()
  @IsNotEmpty()
  disasterType: string;

  @ApiProperty({ example: 'บ้านเต๋าดิน หมู่ 3', description: 'Village name' })
  @IsString()
  @IsNotEmpty()
  village: string;

  @ApiProperty({ example: 'uuid-of-village', description: 'Village ID', required: false })
  @IsString()
  @IsOptional()
  villageId?: string;

  @ApiProperty({ example: 25, description: 'Estimated affected households' })
  @IsNumber()
  estimatedHouseholds: number;

  @ApiProperty({ 
    example: 3, 
    description: 'Severity level (1=น้อย, 2=ปานกลาง, 3=มาก, 4=รุนแรง, 5=วิกฤต)', 
    minimum: 1, 
    maximum: 5 
  })
  @IsNumber()
  severity: number;

  @ApiProperty({ 
    example: 'น้ำท่วมขังบริเวณถนนสายหลัก ระดับน้ำสูงประมาณ 50 ซม. ประชาชนต้องการความช่วยเหลือด้านอาหารและน้ำดื่ม มีบ้านเรือนได้รับความเสียหาย 15 หลัง',
    description: 'Detailed incident notes and observations'
  })
  @IsString()
  @IsNotEmpty()
  notes: string;

  @ApiProperty({ 
    type: GPSLocationDto,
    description: 'GPS coordinates of incident location'
  })
  @ValidateNested()
  @Type(() => GPSLocationDto)
  gpsLocation: GPSLocationDto;

  @ApiProperty({ 
    type: PolygonGeometryDto,
    description: 'Polygon geometry defining affected area (GeoJSON)',
    required: false
  })
  @ValidateNested()
  @Type(() => PolygonGeometryDto)
  @IsOptional()
  affectedArea?: PolygonGeometryDto;

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
    example: { 
      waterLevel: '50 cm',
      affectedRoads: ['ถนนสายหลัก', 'ซอย 3'],
      evacuationNeeded: false,
      immediateNeeds: ['อาหาร', 'น้ำดื่ม', 'ยา']
    },
    description: 'Additional incident data (flexible JSON)',
    required: false
  })
  @IsObject()
  @IsOptional()
  additionalData?: Record<string, any>;

  @ApiProperty({ example: 'uuid-of-task', description: 'Related task ID', required: false })
  @IsString()
  @IsOptional()
  taskId?: string;
}

export class FieldOfficerIncidentResponseDto {
  @ApiProperty({ example: 'uuid-of-incident' })
  id: string;

  @ApiProperty({ example: 'uuid-of-user' })
  reportedBy: string;

  @ApiProperty({ example: 'ชื่อเจ้าหน้าที่' })
  reporterName: string;

  @ApiProperty({ example: '2025-11-29' })
  incidentDate: string;

  @ApiProperty({ example: 'น้ำท่วม' })
  disasterType: string;

  @ApiProperty({ example: 'บ้านเต๋าดิน หมู่ 3' })
  village: string;

  @ApiProperty({ example: 'uuid-of-village' })
  villageId?: string;

  @ApiProperty({ example: 25 })
  estimatedHouseholds: number;

  @ApiProperty({ example: 3 })
  severity: number;

  @ApiProperty({ example: 'Incident notes...' })
  notes: string;

  @ApiProperty({ type: GPSLocationDto })
  gpsLocation: GPSLocationDto;

  @ApiProperty({ type: PolygonGeometryDto })
  affectedArea?: PolygonGeometryDto;

  @ApiProperty({ example: ['url1', 'url2'] })
  photoUrls: string[];

  @ApiProperty()
  additionalData?: Record<string, any>;

  @ApiProperty({ example: 'uuid-of-task' })
  taskId?: string;

  @ApiProperty({ example: '2025-11-29T14:30:00Z' })
  createdAt: Date;

  @ApiProperty({ example: 'PENDING' })
  status: string;

  @ApiProperty({ example: 'HIGH' })
  priority: string;

  constructor(partial: Partial<FieldOfficerIncidentResponseDto>) {
    Object.assign(this, partial);
  }
}
