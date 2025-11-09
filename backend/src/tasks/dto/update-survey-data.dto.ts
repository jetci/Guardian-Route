import { IsOptional, IsString, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GeoJSONPoint {
  @ApiProperty({ example: 'Point' })
  type: 'Point';

  @ApiProperty({ example: [98.9817, 19.9167], description: '[longitude, latitude]' })
  coordinates: [number, number];
}

class GeoJSONPolygon {
  @ApiProperty({ example: 'Polygon' })
  type: 'Polygon';

  @ApiProperty({
    example: [
      [
        [98.9817, 19.9167],
        [98.9827, 19.9167],
        [98.9827, 19.9177],
        [98.9817, 19.9177],
        [98.9817, 19.9167],
      ],
    ],
    description: 'Array of linear rings (array of coordinates)',
  })
  coordinates: number[][][];
}

export class UpdateSurveyDataDto {
  @ApiProperty({
    description: 'Survey location (GPS point)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJSONPoint)
  surveyLocation?: GeoJSONPoint;

  @ApiProperty({
    description: 'Survey area (drawn polygon)',
    required: false,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJSONPolygon)
  surveyArea?: GeoJSONPolygon;

  @ApiProperty({
    description: 'Survey notes and observations',
    required: false,
  })
  @IsOptional()
  @IsString()
  surveyNotes?: string;

  @ApiProperty({
    description: 'Array of photo URLs',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  surveyPhotos?: string[];
}
