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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
