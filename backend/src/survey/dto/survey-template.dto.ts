import { ApiProperty } from '@nestjs/swagger';

export class SurveyTemplateDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string | null;

  @ApiProperty({ type: 'object', description: 'JSON schema of the survey form', additionalProperties: true })
  formSchema: any;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<SurveyTemplateDto> & { description: string | null }) {
    Object.assign(this, partial);
  }
}
