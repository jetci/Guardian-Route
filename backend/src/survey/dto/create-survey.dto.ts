import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateSurveyDto {
  @ApiProperty({ description: 'ID of the Survey Template to use' })
  @IsUUID()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({ description: 'ID of the Incident this survey is related to', required: false })
  @IsUUID()
  @IsOptional()
  incidentId?: string;

  @ApiProperty({ description: 'ID of the Village this survey is related to', required: false })
  @IsUUID()
  @IsOptional()
  villageId?: string;

  @ApiProperty({ description: 'GeoJSON Polygon for the survey area (optional)', required: false })
  @IsString()
  @IsOptional()
  polygon?: string; // JSON string for GeoJSON
}
