import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject, IsUUID, IsArray, IsNumber, Min, Max } from 'class-validator';
import { DisasterType, Priority } from '@prisma/client';

export class CreateIncidentDto {
  @ApiProperty({ example: 'น้ำท่วมหมู่ 3 บ้านเต๋าดิน' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'น้ำท่วมขังบริเวณถนนสายหลัก ระดับน้ำสูงประมาณ 50 ซม.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: DisasterType,
    example: DisasterType.FLOOD
  })
  @IsEnum(DisasterType)
  disasterType: DisasterType;

  @ApiProperty({
    enum: Priority,
    example: Priority.HIGH,
    default: Priority.MEDIUM
  })
  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @ApiProperty({
    example: {
      type: 'Point',
      coordinates: [99.2333, 19.9167]
    },
    description: 'GeoJSON Point [longitude, latitude]'
  })
  @IsObject()
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @ApiProperty({ example: '123 ถนนเชียงใหม่-ฝาง', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'uuid-of-village', required: false })
  @IsUUID()
  @IsOptional()
  villageId?: string;

  @ApiProperty({
    example: ['/uploads/image1.webp', '/uploads/image2.webp'],
    description: 'Array of image URLs',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: {
      type: 'Polygon',
      coordinates: [[[99.2333, 19.9167], [99.2343, 19.9167], [99.2343, 19.9157], [99.2333, 19.9157], [99.2333, 19.9167]]]
    },
    description: 'GeoJSON Polygon of affected area',
    required: false
  })
  @IsObject()
  @IsOptional()
  affectedArea?: any;

  @ApiProperty({
    example: 25,
    description: 'Estimated number of affected households',
    required: false
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  estimatedHouseholds?: number;

  @ApiProperty({
    example: 3,
    minimum: 1,
    maximum: 5,
    description: 'Severity level (1=Low, 5=Critical)',
    required: false
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  severity?: number;
}
