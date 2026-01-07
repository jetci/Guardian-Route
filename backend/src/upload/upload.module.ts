import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MalwareScannerService } from './malware-scanner.service';

@Module({
  providers: [UploadService, MalwareScannerService],
  controllers: [UploadController],
  exports: [UploadService, MalwareScannerService],
})
export class UploadModule { }
