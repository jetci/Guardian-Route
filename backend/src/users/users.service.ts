import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

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
        department: createUserDto.department,
        role: createUserDto.role,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findAll(role?: Role, requestingUserRole?: Role) {
    // Hide DEVELOPER users from ADMIN
    const whereClause: any = role ? { role } : {};

    if (requestingUserRole === Role.ADMIN) {
      whereClause.role = { not: Role.DEVELOPER };
    }

    return this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
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
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
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

  async update(id: string, updateUserDto: UpdateUserDto, requestingUserRole?: Role) {
    const user = await this.findOne(id);

    // RBAC: ADMIN cannot update DEVELOPER users
    if (requestingUserRole === Role.ADMIN && user.role === Role.DEVELOPER) {
      throw new ForbiddenException('Admin cannot modify Developer users');
    }

    // RBAC: ADMIN cannot change role to DEVELOPER
    if (requestingUserRole === Role.ADMIN && updateUserDto.role === Role.DEVELOPER) {
      throw new ForbiddenException('Admin cannot create or assign Developer role');
    }

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
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, requestingUserRole?: Role) {
    const user = await this.findOne(id);

    // RBAC: ADMIN cannot delete DEVELOPER users
    if (requestingUserRole === Role.ADMIN && user.role === Role.DEVELOPER) {
      throw new ForbiddenException('Admin cannot delete Developer users');
    }

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
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true,
      },
    });
  }

  // ==================== Profile Management Methods ====================

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
        role: true,
        isActive: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update fullName if firstName or lastName changed
    let fullName = user.fullName;
    if (updateProfileDto.firstName || updateProfileDto.lastName) {
      const firstName = updateProfileDto.firstName || user.firstName;
      const lastName = updateProfileDto.lastName || user.lastName;
      fullName = `${firstName} ${lastName}`;
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...updateProfileDto,
        fullName,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        phone: true,
        department: true,
        role: true,
        isActive: true,
        profileImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    // Get user with password
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads', 'profiles');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const filename = `${userId}-${Date.now()}.jpg`;
    const filepath = path.join(uploadsDir, filename);

    // Process and save image
    await sharp(file.buffer)
      .resize(400, 400, { fit: 'cover' })
      .jpeg({ quality: 90 })
      .toFile(filepath);

    // Delete old profile image if exists
    if (user.profileImage) {
      const oldImagePath = path.join(process.cwd(), user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update user with new image path
    const imageUrl = `/uploads/profiles/${filename}`;
    await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: imageUrl },
    });

    return { imageUrl };
  }

  async deleteProfileImage(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.profileImage) {
      throw new BadRequestException('No profile image to delete');
    }

    // Delete image file
    const imagePath = path.join(process.cwd(), user.profileImage);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Update user
    await this.prisma.user.update({
      where: { id: userId },
      data: { profileImage: null },
    });

    return { message: 'Profile image deleted successfully' };
  }

  async getActivityLogs(userId: string, limit: number = 20) {
    // Note: This is a placeholder implementation
    // In a real application, you would have an ActivityLog model in Prisma
    // For now, we'll return mock data or implement basic logging

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // TODO: Implement actual activity logging
    // For now, return empty array or mock data
    return [];

    // Future implementation would look like:
    // return this.prisma.activityLog.findMany({
    //   where: { userId },
    //   orderBy: { timestamp: 'desc' },
    //   take: limit,
    // });
  }
}
