import { PartialType } from '@nestjs/swagger';
import { CreateIncidentDto } from './create-incident.dto';
import { IsEnum, IsOptional, IsDateString } from 'class-validator';
import { IncidentStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIncidentDto extends PartialType(CreateIncidentDto) {
  @ApiProperty({ 
    enum: IncidentStatus,
    example: IncidentStatus.IN_PROGRESS,
    required: false
  })
  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;

  @ApiProperty({ 
    example: '2025-11-03T10:30:00Z',
    required: false,
    description: 'ISO 8601 datetime when incident was resolved'
  })
  @IsDateString()
  @IsOptional()
  resolvedAt?: string;
}
