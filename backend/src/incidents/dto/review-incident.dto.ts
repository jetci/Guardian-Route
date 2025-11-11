import { IsString, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IncidentStatus } from '@prisma/client';

export class ReviewIncidentDto {
  @ApiProperty({
    description: 'New status after review',
    enum: IncidentStatus,
    example: 'INVESTIGATING',
  })
  @IsEnum(IncidentStatus)
  @IsNotEmpty()
  status: IncidentStatus;

  @ApiProperty({
    description: 'Review comments',
    example: 'Approved. Please proceed with investigation.',
  })
  @IsString()
  @IsNotEmpty()
  reviewNotes: string;

  @ApiProperty({
    description: 'Additional details or instructions',
    required: false,
  })
  @IsString()
  @IsOptional()
  additionalNotes?: string;
}
