import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsObject, IsBoolean } from 'class-validator';

export class GeneratePdfDto {
  @ApiPropertyOptional({
    description: 'PDF generation options',
    example: {
      includeImages: true,
      includeCharts: true,
      pageSize: 'A4',
      orientation: 'portrait',
    },
  })
  @IsOptional()
  @IsObject()
  options?: {
    includeImages?: boolean;
    includeCharts?: boolean;
    pageSize?: 'A4' | 'Letter';
    orientation?: 'portrait' | 'landscape';
  };

  @ApiPropertyOptional({
    description: 'Force regeneration even if PDF already exists',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  forceRegenerate?: boolean;
}
