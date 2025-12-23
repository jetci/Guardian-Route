import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController, SurveyTemplateController } from './survey.controller';
import { FieldOfficerSurveyController } from './field-officer-survey.controller';
import { FieldOfficerSurveyService } from './field-officer-survey.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [
    SurveyController,
    SurveyTemplateController,
    FieldOfficerSurveyController,
  ],
  providers: [SurveyService, FieldOfficerSurveyService],
  exports: [SurveyService, FieldOfficerSurveyService],
})
export class SurveyModule {}
