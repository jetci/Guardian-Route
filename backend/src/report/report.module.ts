import { Module } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { DatabaseModule } from '../database/database.module';
import { GeminiService } from './gemini.service';
import { ReportServiceExtension } from './report.service.extension';
import { ReportControllerExtension } from './report.controller.extension';
// import { PdfGeneratorService } from './pdf-generator.service'; // TODO: Re-enable when PDF feature is needed

@Module({
  imports: [DatabaseModule],
  controllers: [ReportController, ReportControllerExtension],
  providers: [ReportService, GeminiService, ReportServiceExtension], // Removed PdfGeneratorService
  exports: [ReportService],
})
export class ReportModule {}
