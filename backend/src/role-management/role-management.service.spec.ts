import { Test, TestingModule } from '@nestjs/testing';
import { RoleManagementService } from './role-management.service';
import { PrismaService } from '../database/prisma.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Role } from '@prisma/client';

describe('RoleManagementService', () => {
  let service: RoleManagementService;
  let prisma: PrismaService;

  const mockPrismaService = {
    roleMetadata: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    rolePermission: {
      createMany: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
    permission: {
      findMany: jest.fn(),
    },
  };

  const mockRoleMetadata = {
    id: '1',
    role: Role.ADMIN,
    displayName: 'ผู้ดูแลระบบ',
    description: 'สิทธิ์เต็มในการจัดการระบบ',
    createdAt: new Date(),
    updatedAt: new Date(),
    permissions: [
      {
        permission: {
          id: 'perm-1',
          name: 'user.create',
          displayName: 'สร้างผู้ใช้',
          description: 'สามารถสร้างผู้ใช้ใหม่',
          category: 'User Management',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleManagementService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RoleManagementService>(RoleManagementService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRoleMetadata', () => {
    const createDto = {
      role: Role.SUPERVISOR,
      displayName: 'หัวหน้างาน',
      description: 'หัวหน้าทีมงาน',
      permissionIds: ['perm-1', 'perm-2'],
    };

    it('should create role metadata successfully with permissions', async () => {
      const createdMetadata = {
        ...mockRoleMetadata,
        role: createDto.role,
        displayName: createDto.displayName,
        description: createDto.description,
        permissions: [],
      };

      const metadataWithPermissions = {
        ...createdMetadata,
        permissions: [
          {
            permission: {
              id: 'perm-1',
              name: 'user.create',
              displayName: 'สร้างผู้ใช้',
              description: 'สามารถสร้างผู้ใช้ใหม่',
              category: 'User Management',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
          {
            permission: {
              id: 'perm-2',
              name: 'user.update',
              displayName: 'แก้ไขผู้ใช้',
              description: 'สามารถแก้ไขข้อมูลผู้ใช้',
              category: 'User Management',
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        ],
      };

      mockPrismaService.roleMetadata.findUnique
        .mockResolvedValueOnce(null) // Check existing
        .mockResolvedValueOnce(createdMetadata) // After create (for assignPermissions)
        .mockResolvedValueOnce(metadataWithPermissions); // Final getRoleMetadata

      mockPrismaService.roleMetadata.create.mockResolvedValue(createdMetadata);
      mockPrismaService.permission.findMany.mockResolvedValue([
        { id: 'perm-1' },
        { id: 'perm-2' },
      ]);
      mockPrismaService.rolePermission.findMany.mockResolvedValue([]);
      mockPrismaService.rolePermission.createMany.mockResolvedValue({ count: 2 });

      const result = await service.createRoleMetadata(createDto);

      expect(result).toHaveProperty('role', createDto.role);
      expect(result).toHaveProperty('displayName', createDto.displayName);
      expect(result).toHaveProperty('permissionCount');
      expect(mockPrismaService.roleMetadata.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if role metadata already exists', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(mockRoleMetadata);

      await expect(service.createRoleMetadata(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.roleMetadata.create).not.toHaveBeenCalled();
    });
  });

  describe('getAllRoleMetadata', () => {
    it('should return all role metadata', async () => {
      const mockRoleMetadataList = [mockRoleMetadata];

      mockPrismaService.roleMetadata.findMany.mockResolvedValue(mockRoleMetadataList);

      const result = await service.getAllRoleMetadata();

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('role');
      expect(result[0]).toHaveProperty('permissionCount');
    });
  });

  describe('getRoleMetadata', () => {
    it('should return role metadata by role', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(mockRoleMetadata);

      const result = await service.getRoleMetadata(Role.ADMIN);

      expect(result).toHaveProperty('role', Role.ADMIN);
      expect(result).toHaveProperty('permissionCount');
    });

    it('should throw NotFoundException if role metadata not found', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(null);

      await expect(service.getRoleMetadata(Role.ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateRoleMetadata', () => {
    const updateDto = {
      displayName: 'ผู้ดูแลระบบ (อัพเดท)',
      description: 'คำอธิบายใหม่',
    };

    it('should update role metadata successfully', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(mockRoleMetadata);
      mockPrismaService.roleMetadata.update.mockResolvedValue({
        ...mockRoleMetadata,
        ...updateDto,
      });

      const result = await service.updateRoleMetadata(Role.ADMIN, updateDto);

      expect(result).toHaveProperty('displayName', updateDto.displayName);
      expect(result).toHaveProperty('permissionCount');
    });

    it('should throw NotFoundException if role metadata not found', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(null);

      await expect(
        service.updateRoleMetadata(Role.ADMIN, updateDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteRoleMetadata', () => {
    it('should delete role metadata successfully', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(mockRoleMetadata);
      mockPrismaService.roleMetadata.delete.mockResolvedValue(mockRoleMetadata);

      const result = await service.deleteRoleMetadata(Role.ADMIN);

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException if role metadata not found', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(null);

      await expect(service.deleteRoleMetadata(Role.ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignPermissions', () => {
    const assignDto = {
      permissionIds: ['perm-1', 'perm-2'],
    };

    it('should assign permissions to role successfully', async () => {
      mockPrismaService.roleMetadata.findUnique
        .mockResolvedValueOnce(mockRoleMetadata)
        .mockResolvedValueOnce(mockRoleMetadata);

      mockPrismaService.permission.findMany.mockResolvedValue([
        { id: 'perm-1' },
        { id: 'perm-2' },
      ]);
      mockPrismaService.rolePermission.findMany.mockResolvedValue([]);
      mockPrismaService.rolePermission.createMany.mockResolvedValue({ count: 2 });

      const result = await service.assignPermissions(Role.ADMIN, assignDto);

      expect(result).toHaveProperty('role', Role.ADMIN);
      expect(result).toHaveProperty('permissionCount');
    });

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(null);

      await expect(service.assignPermissions(Role.ADMIN, assignDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if some permissions not found', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(mockRoleMetadata);
      mockPrismaService.permission.findMany.mockResolvedValue([{ id: 'perm-1' }]);

      await expect(service.assignPermissions(Role.ADMIN, assignDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('removePermissions', () => {
    const removeDto = {
      permissionIds: ['perm-1'],
    };

    it('should remove permissions from role successfully', async () => {
      mockPrismaService.roleMetadata.findUnique
        .mockResolvedValueOnce(mockRoleMetadata)
        .mockResolvedValueOnce(mockRoleMetadata);

      mockPrismaService.rolePermission.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.removePermissions(Role.ADMIN, removeDto);

      expect(result).toHaveProperty('role', Role.ADMIN);
      expect(result).toHaveProperty('permissionCount');
    });

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(null);

      await expect(service.removePermissions(Role.ADMIN, removeDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRolePermissions', () => {
    it('should return permissions for a role', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(mockRoleMetadata);

      const result = await service.getRolePermissions(Role.ADMIN);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });

    it('should throw NotFoundException if role not found', async () => {
      mockPrismaService.roleMetadata.findUnique.mockResolvedValue(null);

      await expect(service.getRolePermissions(Role.ADMIN)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getRoleStatistics', () => {
    it('should return statistics for all roles', async () => {
      mockPrismaService.roleMetadata.findMany.mockResolvedValue([
        { ...mockRoleMetadata, permissions: [{}, {}] },
      ]);
      mockPrismaService.user.count
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(3)
        .mockResolvedValueOnce(7)
        .mockResolvedValueOnce(2);

      const result = await service.getRoleStatistics();

      expect(result).toHaveProperty('totalRoles');
      expect(result).toHaveProperty('roleStats');
      expect(Array.isArray(result.roleStats)).toBe(true);
    });
  });
});
