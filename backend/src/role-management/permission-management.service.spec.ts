import { Test, TestingModule } from '@nestjs/testing';
import { PermissionManagementService } from './permission-management.service';
import { PrismaService } from '../database/prisma.service';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

describe('PermissionManagementService', () => {
  let service: PermissionManagementService;
  let prisma: PrismaService;

  const mockPrismaService = {
    permission: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockPermission = {
    id: 'perm-1',
    name: 'incident.create',
    displayName: 'สร้างเหตุการณ์',
    description: 'สามารถสร้างเหตุการณ์ใหม่',
    category: 'Incident Management',
    createdAt: new Date(),
    updatedAt: new Date(),
    roles: [
      {
        role: 'ADMIN',
        roleMetadata: {
          displayName: 'ผู้ดูแลระบบ',
        },
        assignedAt: new Date(),
      },
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionManagementService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PermissionManagementService>(PermissionManagementService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPermission', () => {
    const createDto = {
      name: 'incident.create',
      displayName: 'สร้างเหตุการณ์',
      description: 'สามารถสร้างเหตุการณ์ใหม่',
      category: 'Incident Management',
    };

    it('should create permission successfully', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);
      mockPrismaService.permission.create.mockResolvedValue(mockPermission);

      const result = await service.createPermission(createDto);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name', createDto.name);
      expect(result).toHaveProperty('roleCount');
      expect(mockPrismaService.permission.findUnique).toHaveBeenCalledWith({
        where: { name: createDto.name },
      });
    });

    it('should throw ConflictException if permission name already exists', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      await expect(service.createPermission(createDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.permission.create).not.toHaveBeenCalled();
    });
  });

  describe('bulkCreatePermissions', () => {
    it('should create multiple permissions successfully', async () => {
      const bulkDto = {
        permissions: [
          {
            name: 'user.create',
            displayName: 'สร้างผู้ใช้',
            description: 'สามารถสร้างผู้ใช้ใหม่',
            category: 'User Management',
          },
          {
            name: 'user.update',
            displayName: 'แก้ไขผู้ใช้',
            description: 'สามารถแก้ไขข้อมูลผู้ใช้',
            category: 'User Management',
          },
        ],
      };

      mockPrismaService.permission.findUnique.mockResolvedValue(null);
      mockPrismaService.permission.create
        .mockResolvedValueOnce({ ...mockPermission, name: 'user.create' })
        .mockResolvedValueOnce({ ...mockPermission, name: 'user.update' });

      const result = await service.bulkCreatePermissions(bulkDto);

      expect(result).toHaveProperty('created');
      expect(result).toHaveProperty('failed');
      expect(Array.isArray(result.created)).toBe(true);
      expect(Array.isArray(result.failed)).toBe(true);
    });
  });

  describe('getAllPermissions', () => {
    it('should return all permissions', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([mockPermission]);

      const result = await service.getAllPermissions();

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('roleCount');
      expect(mockPrismaService.permission.findMany).toHaveBeenCalled();
    });

    it('should filter permissions by category', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([mockPermission]);

      const result = await service.getAllPermissions({ category: 'Incident Management' });

      expect(Array.isArray(result)).toBe(true);
      expect(mockPrismaService.permission.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            category: 'Incident Management',
          }),
        }),
      );
    });

    it('should search permissions', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([mockPermission]);

      const result = await service.getAllPermissions({ search: 'incident' });

      expect(Array.isArray(result)).toBe(true);
      expect(mockPrismaService.permission.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe('getPermission', () => {
    it('should return permission by id', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      const result = await service.getPermission('perm-1');

      expect(result).toHaveProperty('id', 'perm-1');
      expect(result).toHaveProperty('roleCount');
      expect(mockPrismaService.permission.findUnique).toHaveBeenCalledWith({
        where: { id: 'perm-1' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(service.getPermission('perm-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPermissionByName', () => {
    it('should return permission by name', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      const result = await service.getPermissionByName('user.create');

      expect(result).toHaveProperty('name', 'incident.create');
      expect(result).toHaveProperty('roleCount');
      expect(mockPrismaService.permission.findUnique).toHaveBeenCalledWith({
        where: { name: 'user.create' },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(service.getPermissionByName('user.create')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updatePermission', () => {
    const updateDto = {
      displayName: 'สร้างเหตุการณ์ (อัพเดท)',
      description: 'คำอธิบายใหม่',
    };

    it('should update permission successfully', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);
      mockPrismaService.permission.update.mockResolvedValue({
        ...mockPermission,
        ...updateDto,
      });

      const result = await service.updatePermission('perm-1', updateDto);

      expect(result).toHaveProperty('displayName', updateDto.displayName);
      expect(result).toHaveProperty('roleCount');
      expect(mockPrismaService.permission.update).toHaveBeenCalledWith({
        where: { id: 'perm-1' },
        data: expect.any(Object),
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(service.updatePermission('perm-1', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deletePermission', () => {
    it('should delete permission successfully', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue({
        ...mockPermission,
        roles: [],
      });
      mockPrismaService.permission.delete.mockResolvedValue(mockPermission);

      const result = await service.deletePermission('perm-1');

      expect(result).toHaveProperty('message');
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(service.deletePermission('perm-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if permission is assigned to roles', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      await expect(service.deletePermission('perm-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([
        { category: 'User Management' },
        { category: 'Incident Management' },
      ]);

      const result = await service.getCategories();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if no categories exist', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([]);

      const result = await service.getCategories();

      expect(result).toEqual([]);
    });
  });

  describe('getPermissionsByCategory', () => {
    it('should return permissions grouped by category', async () => {
      mockPrismaService.permission.findMany.mockResolvedValue([
        mockPermission,
        { ...mockPermission, id: 'perm-2', category: 'User Management' },
      ]);

      const result = await service.getPermissionsByCategory();

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('Incident Management');
    });
  });

  describe('getPermissionStatistics', () => {
    it('should return permission statistics', async () => {
      mockPrismaService.permission.count.mockResolvedValue(10);
      mockPrismaService.permission.findMany
        .mockResolvedValueOnce([
          { category: 'User Management' },
          { category: 'Incident Management' },
        ])
        .mockResolvedValueOnce([mockPermission]);

      const result = await service.getPermissionStatistics();

      expect(result).toHaveProperty('totalPermissions');
      expect(result).toHaveProperty('totalCategories');
      expect(result).toHaveProperty('categoryStats');
      expect(result).toHaveProperty('mostUsedPermissions');
    });
  });

  describe('getPermissionRoles', () => {
    it('should return roles that have the permission', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(mockPermission);

      const result = await service.getPermissionRoles('perm-1');

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('role');
      expect(result[0]).toHaveProperty('displayName');
    });

    it('should throw NotFoundException if permission not found', async () => {
      mockPrismaService.permission.findUnique.mockResolvedValue(null);

      await expect(service.getPermissionRoles('perm-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
