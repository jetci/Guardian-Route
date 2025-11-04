import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SubmitReportDto {
  @ApiPropertyOptional({
    description: 'Optional notes when submitting the report',
    example: 'Report ready for review',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
