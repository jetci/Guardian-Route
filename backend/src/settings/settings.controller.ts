import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.DEVELOPER)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  @ApiOperation({ summary: 'Get current system settings' })
  @ApiResponse({ status: 200, description: 'Returns current settings' })
  async getSettings() {
    return this.settingsService.getSettings();
  }

  @Put()
  @ApiOperation({ summary: 'Update system settings' })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async updateSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings(updateSettingsDto);
  }

  @Post('backup')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Trigger manual backup' })
  @ApiResponse({ status: 200, description: 'Backup triggered successfully' })
  async triggerBackup() {
    return this.settingsService.triggerBackup();
  }

  @Delete('purge')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Purge old data based on retention policy' })
  @ApiResponse({ status: 200, description: 'Old data purged successfully' })
  @ApiResponse({ status: 500, description: 'Purge operation failed' })
  async purgeOldData() {
    return this.settingsService.purgeOldData();
  }

  @Get('backups')
  @ApiOperation({ summary: 'List available backups' })
  @ApiResponse({ status: 200, description: 'Returns list of backups' })
  async getBackups() {
    return this.settingsService.getBackups();
  }

  @Get('backups/:filename')
  @ApiOperation({ summary: 'Download backup file' })
  @ApiResponse({ status: 200, description: 'Returns backup file stream' })
  async downloadBackup(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.settingsService.getBackupPath(filename);
    res.download(filePath);
  }

  @Post('reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Factory reset - restore all settings to default' })
  @ApiResponse({ status: 200, description: 'Factory reset completed' })
  @ApiResponse({ status: 500, description: 'Reset operation failed' })
  async factoryReset() {
    return this.settingsService.factoryReset();
  }
}
