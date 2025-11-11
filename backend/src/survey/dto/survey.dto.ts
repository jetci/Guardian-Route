import { ApiProperty } from '@nestjs/swagger';
import { Survey as SurveyModel, SurveyStatus } from '@prisma/client';
import { SurveyTemplateDto } from './survey-template.dto';

export class SurveyDto {
  @ApiProperty({ description: 'Unique identifier of the survey' })
  id: string;

  @ApiProperty({ description: 'ID of the Incident this survey is related to', required: false })
  incidentId: string | null;

  @ApiProperty({ description: 'ID of the Village this survey is related to', required: false })
  villageId: string | null;

  @ApiProperty({ description: 'ID of the Survey Template used' })
  templateId: string;

  @ApiProperty({ enum: SurveyStatus, description: 'Current status of the survey' })
  status: SurveyStatus;

  @ApiProperty({ description: 'Date and time when the survey was completed', required: false })
  completedAt: Date | null;

  @ApiProperty({ description: 'GeoJSON Polygon for the survey area (optional)', required: false })
  polygon: any | null;

  @ApiProperty({ description: 'ID of the user who created the survey' })
  createdById: string;

  @ApiProperty({ description: 'Survey Template details', type: SurveyTemplateDto, required: false })
  template?: SurveyTemplateDto;

  constructor(model: SurveyModel) {
    this.id = model.id;
    this.incidentId = model.incidentId;
    this.villageId = model.villageId;
    this.templateId = model.templateId;
    this.status = model.status;
    this.completedAt = model.completedAt;
    this.polygon = model.polygon;
    this.createdById = model.createdById;
  }
}
