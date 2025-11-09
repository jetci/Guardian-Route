import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignIncidentDto {
  @ApiProperty({
    description: 'ID of the field officer to assign',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  fieldOfficerId: string;

  @ApiProperty({
    description: 'Optional notes for the assignment',
    example: 'Please investigate and report back by tomorrow',
    required: false,
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
