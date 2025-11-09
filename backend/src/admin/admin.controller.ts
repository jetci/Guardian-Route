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
