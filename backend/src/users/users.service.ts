import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Generate username from email
    const username = createUserDto.email.split('@')[0];
    
    // Generate fullName from firstName and lastName
    const fullName = `${createUserDto.firstName} ${createUserDto.lastName}`;

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        username,
        fullName,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        phone: createUserDto.phone,
        role: createUserDto.role,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll(role?: Role) {
    return this.prisma.user.findMany({
      where: role ? { role } : undefined,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    // Hash password if updating
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete - deactivate user
    return this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStatistics() {
    const [total, byRole, byStatus] = await Promise.all([
      // Total users
      this.prisma.user.count(),
      
      // Count by role
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      
      // Count by status
      this.prisma.user.groupBy({
        by: ['isActive'],
        _count: true,
      }),
    ]);

    // Transform role counts
    const roleStats = {
      ADMIN: 0,
      EXECUTIVE: 0,
      SUPERVISOR: 0,
      FIELD_OFFICER: 0,
    };

    byRole.forEach((item) => {
      roleStats[item.role] = item._count;
    });

    // Transform status counts
    const statusStats = {
      ACTIVE: 0,
      INACTIVE: 0,
    };

    byStatus.forEach((item) => {
      if (item.isActive) {
        statusStats.ACTIVE = item._count;
      } else {
        statusStats.INACTIVE = item._count;
      }
    });

    return {
      total,
      byRole: roleStats,
      byStatus: statusStats,
    };
  }

  async toggleStatus(id: string) {
    const user = await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }
}
