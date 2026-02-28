import { IsOptional, IsString, IsArray, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class GeoJSONPoint {
  @ApiProperty({ example: 'Point', description: 'GeoJSON type' })
  type: 'Point';

  @ApiProperty({ example: [98.9817, 19.9167], description: '[longitude, latitude]' })
  coordinates: [number, number];
}

class GeoJSONPolygon {
  @ApiProperty({ example: 'Polygon', description: 'GeoJSON type' })
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
    description: 'Array of linear rings (array of coordinates) following GeoJSON spec',
  })
  coordinates: number[][][];
}

export class UpdateSurveyDataDto {
  @ApiProperty({
    description: 'Survey location (GPS point)',
    required: false,
    example: { type: 'Point', coordinates: [98.9817, 19.9167] },
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJSONPoint)
  surveyLocation?: GeoJSONPoint;

  @ApiProperty({
    description: 'Survey area (drawn polygon)',
    required: false,
    example: {
      type: 'Polygon',
      coordinates: [
        [
          [98.9817, 19.9167],
          [98.9827, 19.9167],
          [98.9827, 19.9177],
          [98.9817, 19.9177],
          [98.9817, 19.9167],
        ],
      ],
    },
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GeoJSONPolygon)
  surveyArea?: GeoJSONPolygon;

  @ApiProperty({
    description: 'Survey notes and observations',
    required: false,
    example: 'Water level increased by 15cm since last visit. Noted minor landslide near village entrance.',
  })
  @IsOptional()
  @IsString()
  surveyNotes?: string;

  @ApiProperty({
    description: 'Array of photo URLs',
    required: false,
    type: [String],
    example: [
      'https://cdn.guardian-route.example.com/uploads/surveys/IMG_001.jpg',
      'https://cdn.guardian-route.example.com/uploads/surveys/IMG_002.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  surveyPhotos?: string[];
}
