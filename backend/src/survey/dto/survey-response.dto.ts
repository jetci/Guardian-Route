import { ApiProperty } from '@nestjs/swagger';
import { SurveyResponse as SurveyResponseModel } from '@prisma/client';

export class SurveyResponseDto {
  @ApiProperty({ description: 'Unique identifier of the survey response' })
  id: string;

  @ApiProperty({ description: 'ID of the Survey this response belongs to' })
  surveyId: string;

  @ApiProperty({ type: 'object', description: 'Actual survey response data (key-value pairs)', additionalProperties: true })
  data: any;

  @ApiProperty({ description: 'Date and time when the response was submitted' })
  submittedAt: Date;

  @ApiProperty({ description: 'ID of the user who submitted the response' })
  submittedById: string;

  constructor(model: SurveyResponseModel) {
    this.id = model.id;
    this.surveyId = model.surveyId;
    this.data = model.data;
    this.submittedAt = model.submittedAt;
    this.submittedById = model.submittedById;
  }
}
