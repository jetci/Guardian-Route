import { Module, Global } from '@nestjs/common';
import { ActivityLogService } from './services/activity-log.service';
import { DatabaseModule } from '../database/database.module';
import { SecurityController } from './controllers/security.controller';

@Global()
@Module({
  imports: [DatabaseModule],
  controllers: [SecurityController],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class CommonModule { }
