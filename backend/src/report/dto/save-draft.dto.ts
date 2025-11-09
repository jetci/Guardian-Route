import { IsString, IsObject, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveDraftDto {
  @ApiProperty({
    description: 'Task ID associated with this draft',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  taskId: string;

  @ApiProperty({
    description: 'Current step in the wizard',
    example: 3,
  })
  @IsNumber()
  currentStep: number;

  @ApiProperty({
    description: 'Form data from the wizard',
    example: {
      title: 'รายงานน้ำท่วม',
      summary: 'สรุปสถานการณ์...',
    },
  })
  @IsObject()
  formData: any;

  @ApiProperty({
    description: 'Draft ID for updating existing draft',
    required: false,
  })
  @IsOptional()
  @IsString()
  draftId?: string;
}
