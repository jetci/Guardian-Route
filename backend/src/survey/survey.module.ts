import { Module } from '@nestjs/common';
import { SurveyService } from './survey.service';
import { SurveyController, SurveyTemplateController } from './survey.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [SurveyController, SurveyTemplateController],
  providers: [SurveyService],
  exports: [SurveyService],
})
export class SurveyModule {}
