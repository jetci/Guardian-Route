import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
  ) {}

  /**
   * สร้างผู้ใช้ใหม่
   */
  async createUser(createUserDto: CreateUserDto, adminUser: any) {
    // ตรวจสอบว่า username หรือ email ซ้ำหรือไม่
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      },
    });

    if (existingUser) {
      throw new ConflictException('Username หรือ Email นี้ถูกใช้งานแล้ว');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // สร้างผู้ใช้
    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        email: createUserDto.email,
        password: hashedPassword,
        fullName: createUserDto.fullName,
        role: createUserDto.role,
        phone: createUserDto.phone,
        department: createUserDto.department,
      },
    });

    // Audit log removed

    // ลบ password ออกจาก response
    const { password, ...result } = user;
    return result;
  }

  /**
   * ดึงรายการผู้ใช้ทั้งหมด
   */
  async findAllUsers(filters?: {
    role?: Role;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      role,
      isActive,
      search,
      page = 1,
      limit = 20,
    } = filters || {};

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { fullName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          fullName: true,
          role: true,
          phone: true,
          department: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ดึงข้อมูลผู้ใช้ตาม ID
   */
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้');
    }

    return user;
  }

  /**
   * อัพเดทข้อมูลผู้ใช้
   */
  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
    adminUser: any,
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้');
    }

    // ตรวจสอบว่า username หรือ email ซ้ำหรือไม่ (ถ้ามีการเปลี่ยน)
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          AND: [
            { NOT: { id } },
            {
              OR: [
                updateUserDto.username ? { username: updateUserDto.username } : {},
                updateUserDto.email ? { email: updateUserDto.email } : {},
              ].filter(obj => Object.keys(obj).length > 0),
            },
          ],
        },
      });

      if (existingUser) {
        throw new ConflictException('Username หรือ Email นี้ถูกใช้งานแล้ว');
      }
    }

    // Hash password ถ้ามีการเปลี่ยน
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Audit log removed

    return updatedUser;
  }

  /**
   * เปลี่ยน Role ของผู้ใช้
   */
  async changeUserRole(id: string, role: Role, adminUser: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้');
    }

    // ป้องกันการเปลี่ยน role ของตัวเอง
    if (user.id === adminUser.id) {
      throw new BadRequestException('ไม่สามารถเปลี่ยน role ของตัวเองได้');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Audit log removed

    return updatedUser;
  }

  /**
   * Suspend/Unsuspend ผู้ใช้
   */
  async toggleUserStatus(id: string, adminUser: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้');
    }

    // ป้องกันการ suspend ตัวเอง
    if (user.id === adminUser.id) {
      throw new BadRequestException('ไม่สามารถ suspend ตัวเองได้');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        username: true,
        email: true,
        fullName: true,
        role: true,
        phone: true,
        department: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Audit log removed

    return updatedUser;
  }

  /**
   * ลบผู้ใช้
   */
  async deleteUser(id: string, adminUser: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้');
    }

    // ป้องกันการลบตัวเอง
    if (user.id === adminUser.id) {
      throw new BadRequestException('ไม่สามารถลบตัวเองได้');
    }

    await this.prisma.user.delete({ where: { id } });

    // Audit log removed

    return { message: 'ลบผู้ใช้สำเร็จ' };
  }

  /**
   * สถิติผู้ใช้
   */
  async getUserStats() {
    const [total, byRole, active, inactive] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.groupBy({
        by: ['role'],
        _count: true,
      }),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.count({ where: { isActive: false } }),
    ]);

    return {
      total,
      active,
      inactive,
      byRole: byRole.map((r) => ({
        role: r.role,
        count: r._count,
      })),
    };
  }
}
