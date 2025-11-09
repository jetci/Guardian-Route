import { Module, Global } from '@nestjs/common';
import { ActivityLogService } from './services/activity-log.service';
import { DatabaseModule } from '../database/database.module';

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService],
})
export class CommonModule {}
