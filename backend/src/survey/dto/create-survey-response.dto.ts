import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsJSON } from 'class-validator';

export class CreateSurveyResponseDto {
  @ApiProperty({ description: 'Actual survey response data (JSON string)' })
  @IsString()
  @IsNotEmpty()
  @IsJSON()
  data: string; // JSON string for key-value pairs of responses
}
