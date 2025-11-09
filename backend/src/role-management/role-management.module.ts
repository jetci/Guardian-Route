import { Module } from '@nestjs/common';
import { RoleManagementController } from './role-management.controller';
import { RoleManagementService } from './role-management.service';
import { PermissionManagementService } from './permission-management.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [RoleManagementController],
  providers: [RoleManagementService, PermissionManagementService],
  exports: [RoleManagementService, PermissionManagementService],
})
export class RoleManagementModule {}
