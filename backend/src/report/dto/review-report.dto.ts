import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '@prisma/client';

export class ReviewReportDto {
  @ApiProperty({
    description: 'New status after review',
    enum: [
      ReportStatus.APPROVED,
      ReportStatus.REJECTED,
      ReportStatus.REVISION_REQUIRED,
    ],
    example: ReportStatus.APPROVED,
  })
  @IsEnum([
    ReportStatus.APPROVED,
    ReportStatus.REJECTED,
    ReportStatus.REVISION_REQUIRED,
  ])
  status: ReportStatus;

  @ApiPropertyOptional({
    description: 'Review notes',
    example: 'Report approved with minor comments',
  })
  @IsOptional()
  @IsString()
  reviewNotes?: string;
}
