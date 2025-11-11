import { PartialType } from '@nestjs/swagger';
import { CreateSurveyTemplateDto } from './create-survey-template.dto';

export class UpdateSurveyTemplateDto extends PartialType(CreateSurveyTemplateDto) {}
