import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export enum GeoJsonType {
  VILLAGE_BOUNDARY = 'village_boundary',
  DISTRICT_BOUNDARY = 'district_boundary',
  RISK_ZONE = 'risk_zone',
  INFRASTRUCTURE = 'infrastructure',
}

export class UploadGeoJsonDto {
  @ApiProperty({
    description: 'Type of GeoJSON data',
    enum: GeoJsonType,
    example: GeoJsonType.VILLAGE_BOUNDARY,
  })
  @IsEnum(GeoJsonType)
  type: GeoJsonType;

  @ApiProperty({
    description: 'Description of the data',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class GeoJsonValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  features: number;
  geometryTypes: string[];
  bounds?: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  properties?: string[];
}

export class GeoJsonUploadResponse {
  success: boolean;
  message: string;
  validation: GeoJsonValidationResult;
  preview?: any;
  savedCount?: number;
}
