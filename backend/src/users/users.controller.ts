import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  Put,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ==================== Profile Management Endpoints ====================

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile' })
  updateProfile(@Request() req: any, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password' })
  changePassword(@Request() req: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(req.user.userId, changePasswordDto);
  }

  @Post('profile/image')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Upload profile image' })
  async uploadProfileImage(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.usersService.uploadProfileImage(req.user.userId, file);
  }

  @Delete('profile/image')
  @ApiOperation({ summary: 'Delete profile image' })
  deleteProfileImage(@Request() req: any) {
    return this.usersService.deleteProfileImage(req.user.userId);
  }

  @Get('activity-logs')
  @ApiOperation({ summary: 'Get user activity logs' })
  getActivityLogs(@Request() req: any, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.usersService.getActivityLogs(req.user.userId, limitNum);
  }

  // ==================== Admin User Management Endpoints ====================

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new user (Admin only)' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('statistics')
  @Roles(Role.ADMIN, Role.EXECUTIVE)
  @ApiOperation({ summary: 'Get user statistics' })
  getStatistics() {
    return this.usersService.getStatistics();
  }

  @Get()
  @Roles(Role.ADMIN, Role.SUPERVISOR, Role.DEVELOPER)
  @ApiOperation({ summary: 'Get all users' })
  findAll(@Query('role') role?: Role, @Request() req?: any) {
    return this.usersService.findAll(role, req?.user?.role);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/toggle-status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Toggle user active/inactive status (Admin only)' })
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleStatus(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Update user' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req?: any) {
    return this.usersService.update(id, updateUserDto, req?.user?.role);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DEVELOPER)
  @ApiOperation({ summary: 'Deactivate user' })
  remove(@Param('id') id: string, @Request() req?: any) {
    return this.usersService.remove(id, req?.user?.role);
  }
}
