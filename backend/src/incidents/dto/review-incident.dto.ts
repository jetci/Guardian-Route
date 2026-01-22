import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentStatus } from '@prisma/client';

export class ReviewIncidentDto {
  @ApiProperty({
    description: 'New status after review',
    enum: IncidentStatus,
    example: 'RESOLVED',
  })
  @IsEnum(IncidentStatus, { message: 'status must be one of: PENDING, IN_PROGRESS, RESOLVED, CLOSED' })
  @IsNotEmpty()
  status: IncidentStatus;

  @ApiProperty({
    description: 'Review comments (decision rationale, actions required)',
    example: 'Approved. Assign two field officers to verify damages and proceed with relief distribution.',
  })
  @IsString()
  @IsNotEmpty()
  reviewNotes: string;

  @ApiProperty({
    description: 'Additional details or instructions for teams (optional)',
    required: false,
    example: 'Coordinate with local administrative office. Prepare sandbags if water level rises overnight.',
  })
  @IsString()
  @IsOptional()
  additionalNotes?: string;
}
