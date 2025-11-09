import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { GeoJsonService } from './geojson.service';
import { SystemSettingsService } from './system-settings.service';
import { GeoJsonHistoryService } from './geojson-history.service';
import { SettingsNotificationService } from './settings-notification.service';
import { CustomLayerService } from './custom-layer.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UploadGeoJsonDto } from './dto/upload-geojson.dto';
import { UpdateSystemSettingsDto } from './dto/system-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly geoJsonService: GeoJsonService,
    private readonly systemSettingsService: SystemSettingsService,
    private readonly geoJsonHistoryService: GeoJsonHistoryService,
    private readonly settingsNotificationService: SettingsNotificationService,
    private readonly customLayerService: CustomLayerService,
  ) {}

  /**
   * POST /api/admin/users
   * สร้างผู้ใช้ใหม่
   */
  @Post('users')
  async createUser(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.adminService.createUser(createUserDto, req.user);
  }

  /**
   * GET /api/admin/users
   * ดึงรายการผู้ใช้ทั้งหมด
   */
  @Get('users')
  async findAllUsers(
    @Query('role') role?: Role,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.findAllUsers({
      role,
      isActive: isActive ? isActive === 'true' : undefined,
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  /**
   * GET /api/admin/users/stats
   * ดึงสถิติผู้ใช้
   */
  @Get('users/stats')
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  /**
   * GET /api/admin/users/:id
   * ดึงข้อมูลผู้ใช้ตาม ID
   */
  @Get('users/:id')
  async findUserById(@Param('id') id: string) {
    return this.adminService.findUserById(id);
  }

  /**
   * PATCH /api/admin/users/:id
   * อัพเดทข้อมูลผู้ใช้
   */
  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    return this.adminService.updateUser(id, updateUserDto, req.user);
  }

  /**
   * PATCH /api/admin/users/:id/role
   * เปลี่ยน Role ของผู้ใช้
   */
  @Patch('users/:id/role')
  async changeUserRole(
    @Param('id') id: string,
    @Body('role') role: Role,
    @Request() req,
  ) {
    return this.adminService.changeUserRole(id, role, req.user);
  }

  /**
   * PATCH /api/admin/users/:id/toggle-status
   * Suspend/Unsuspend ผู้ใช้
   */
  @Patch('users/:id/toggle-status')
  async toggleUserStatus(@Param('id') id: string, @Request() req) {
    return this.adminService.toggleUserStatus(id, req.user);
  }

  /**
   * DELETE /api/admin/users/:id
   * ลบผู้ใช้
   */
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string, @Request() req) {
    return this.adminService.deleteUser(id, req.user);
  }

  // ========================================
  // GeoJSON Management
  // ========================================

  /**
   * POST /api/admin/geojson
   * อัพโหลด GeoJSON
   */
  @Post('geojson')
  async uploadGeoJson(@Body() dto: UploadGeoJsonDto, @Request() req) {
    return this.geoJsonService.uploadGeoJson(dto, req.user);
  }

  /**
   * GET /api/admin/geojson
   * ดึงรายการ GeoJSON
   */
  @Get('geojson')
  async findAllGeoJson(
    @Query('type') type?: string,
    @Query('villageId') villageId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.geoJsonService.findAll({
      type,
      villageId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  /**
   * GET /api/admin/geojson/stats
   * ดึงสถิติ GeoJSON
   */
  @Get('geojson/stats')
  async getGeoJsonStats() {
    return this.geoJsonService.getStats();
  }

  /**
   * GET /api/admin/geojson/:id
   * ดึง GeoJSON ตาม ID
   */
  @Get('geojson/:id')
  async findOneGeoJson(@Param('id') id: string) {
    return this.geoJsonService.findOne(id);
  }

  /**
   * PATCH /api/admin/geojson/:id
   * อัพเดท GeoJSON
   */
  @Patch('geojson/:id')
  async updateGeoJson(
    @Param('id') id: string,
    @Body('geojson') geojson: any,
    @Request() req,
  ) {
    return this.geoJsonService.update(id, geojson, req.user);
  }

  /**
   * DELETE /api/admin/geojson/:id
   * ลบ GeoJSON
   */
  @Delete('geojson/:id')
  async deleteGeoJson(@Param('id') id: string, @Request() req) {
    return this.geoJsonService.delete(id, req.user);
  }

  // ========================================
  // System Settings
  // ========================================

  /**
   * GET /api/admin/settings
   * ดึงการตั้งค่าระบบ
   */
  @Get('settings')
  async getSettings() {
    return this.systemSettingsService.getSettings();
  }

  /**
   * GET /api/admin/settings/:key
   * ดึงการตั้งค่าตาม key
   */
  @Get('settings/:key')
  async getSetting(@Param('key') key: string) {
    return this.systemSettingsService.getSetting(key);
  }

  /**
   * PATCH /api/admin/settings
   * อัพเดทการตั้งค่าระบบ
   */
  @Patch('settings')
  async updateSettings(
    @Body() dto: UpdateSystemSettingsDto,
    @Request() req,
  ) {
    return this.systemSettingsService.updateSettings(dto, req.user);
  }

  /**
   * POST /api/admin/settings/reset
   * รีเซ็ตการตั้งค่ากลับเป็นค่าเริ่มต้น
   */
  @Post('settings/reset')
  async resetSettings(@Request() req) {
    return this.systemSettingsService.resetToDefault(req.user);
  }

  /**
   * DELETE /api/admin/settings/:key
   * ลบการตั้งค่าตาม key
   */
  @Delete('settings/:key')
  async deleteSetting(@Param('key') key: string, @Request() req) {
    return this.systemSettingsService.deleteSetting(key, req.user);
  }
}

  // ========================================
  // GEOJSON HISTORY ENDPOINTS
  // ========================================

  /**
   * GET /api/admin/geojson/:id/history
   * ดึงประวัติการเปลี่ยนแปลง GeoJSON
   */
  @Get('geojson/:id/history')
  async getGeoJsonHistory(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.geoJsonHistoryService.getHistory(id, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  /**
   * GET /api/admin/geojson/:id/history/stats
   * ดึงสถิติประวัติ GeoJSON
   */
  @Get('geojson/:id/history/stats')
  async getGeoJsonHistoryStats(@Param('id') id: string) {
    return this.geoJsonHistoryService.getHistoryStats(id);
  }

  /**
   * GET /api/admin/geojson/:id/history/:version
   * ดึงประวัติตาม version
   */
  @Get('geojson/:id/history/:version')
  async getGeoJsonHistoryByVersion(
    @Param('id') id: string,
    @Param('version') version: string,
  ) {
    return this.geoJsonHistoryService.getHistoryByVersion(id, Number(version));
  }

  /**
   * GET /api/admin/geojson/:id/history/compare
   * เปรียบเทียบ 2 versions
   */
  @Get('geojson/:id/history/compare')
  async compareGeoJsonVersions(
    @Param('id') id: string,
    @Query('version1') version1: string,
    @Query('version2') version2: string,
  ) {
    return this.geoJsonHistoryService.compareVersions(
      id,
      Number(version1),
      Number(version2),
    );
  }

  /**
   * POST /api/admin/geojson/:id/history/:version/restore
   * Restore GeoJSON เป็น version เก่า
   */
  @Post('geojson/:id/history/:version/restore')
  async restoreGeoJsonVersion(
    @Param('id') id: string,
    @Param('version') version: string,
    @Request() req,
  ) {
    return this.geoJsonHistoryService.restoreVersion(
      id,
      Number(version),
      req.user.id,
    );
  }

  // ========================================
  // CUSTOM LAYER ENDPOINTS
  // ========================================

  /**
   * POST /api/admin/layers
   * สร้าง Custom Layer ใหม่
   */
  @Post('layers')
  async createCustomLayer(@Body() data: any, @Request() req) {
    return this.customLayerService.create({
      ...data,
      createdBy: req.user.id,
    });
  }

  /**
   * GET /api/admin/layers
   * ดึงรายการ Custom Layers
   */
  @Get('layers')
  async findAllCustomLayers(
    @Query('type') type?: string,
    @Query('createdBy') createdBy?: string,
    @Query('visibleOnly') visibleOnly?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.customLayerService.findAll({
      type,
      createdBy,
      visibleOnly: visibleOnly === 'true',
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 50,
    });
  }

  /**
   * GET /api/admin/layers/stats
   * ดึงสถิติ Custom Layers
   */
  @Get('layers/stats')
  async getCustomLayerStats(@Query('createdBy') createdBy?: string) {
    return this.customLayerService.getStats(createdBy);
  }

  /**
   * GET /api/admin/layers/export
   * Export Custom Layers เป็น GeoJSON
   */
  @Get('layers/export')
  async exportCustomLayers(@Query('ids') ids?: string) {
    const layerIds = ids ? ids.split(',') : undefined;
    return this.customLayerService.exportAsGeoJSON(layerIds);
  }

  /**
   * GET /api/admin/layers/:id
   * ดึง Custom Layer ตาม ID
   */
  @Get('layers/:id')
  async findOneCustomLayer(@Param('id') id: string) {
    return this.customLayerService.findOne(id);
  }

  /**
   * PATCH /api/admin/layers/:id
   * อัพเดท Custom Layer
   */
  @Patch('layers/:id')
  async updateCustomLayer(@Param('id') id: string, @Body() data: any) {
    return this.customLayerService.update(id, data);
  }

  /**
   * PATCH /api/admin/layers/:id/toggle-visibility
   * เปิด/ปิด Layer visibility
   */
  @Patch('layers/:id/toggle-visibility')
  async toggleCustomLayerVisibility(@Param('id') id: string) {
    return this.customLayerService.toggleVisibility(id);
  }

  /**
   * POST /api/admin/layers/reorder
   * เปลี่ยน Layer order
   */
  @Post('layers/reorder')
  async reorderCustomLayers(
    @Body() data: Array<{ id: string; zIndex: number }>,
  ) {
    return this.customLayerService.reorderLayers(data);
  }

  /**
   * POST /api/admin/layers/:id/clone
   * Clone Custom Layer
   */
  @Post('layers/:id/clone')
  async cloneCustomLayer(@Param('id') id: string, @Request() req) {
    return this.customLayerService.clone(id, req.user.id);
  }

  /**
   * DELETE /api/admin/layers/:id
   * ลบ Custom Layer
   */
  @Delete('layers/:id')
  async removeCustomLayer(@Param('id') id: string) {
    return this.customLayerService.remove(id);
  }

  /**
   * DELETE /api/admin/layers
   * ลบ Custom Layers หลายตัว
   */
  @Delete('layers')
  async removeCustomLayers(@Body('ids') ids: string[]) {
    return this.customLayerService.removeMany(ids);
  }

  // ========================================
  // SETTINGS NOTIFICATION ENDPOINTS
  // ========================================

  /**
   * GET /api/admin/notifications
   * ดึงการแจ้งเตือนของผู้ใช้
   */
  @Get('notifications')
  async getNotifications(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('unreadOnly') unreadOnly?: string,
  ) {
    return this.settingsNotificationService.getNotifications(req.user.id, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
      unreadOnly: unreadOnly === 'true',
    });
  }

  /**
   * GET /api/admin/notifications/stats
   * ดึงสถิติการแจ้งเตือน
   */
  @Get('notifications/stats')
  async getNotificationStats(@Request() req) {
    return this.settingsNotificationService.getNotificationStats(req.user.id);
  }

  /**
   * PATCH /api/admin/notifications/:id/read
   * ทำเครื่องหมายว่าอ่านแล้ว
   */
  @Patch('notifications/:id/read')
  async markNotificationAsRead(@Param('id') id: string) {
    return this.settingsNotificationService.markAsRead(id);
  }

  /**
   * POST /api/admin/notifications/mark-all-read
   * ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว
   */
  @Post('notifications/mark-all-read')
  async markAllNotificationsAsRead(@Request() req) {
    return this.settingsNotificationService.markAllAsRead(req.user.id);
  }

  /**
   * DELETE /api/admin/notifications/:id
   * ลบการแจ้งเตือน
   */
  @Delete('notifications/:id')
  async deleteNotification(@Param('id') id: string) {
    return this.settingsNotificationService.deleteNotification(id);
  }
}
