import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../database/prisma.service';
import {
    ConflictException,
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('UsersService', () => {
    let service: UsersService;
    let prisma: PrismaService;

    const mockPrisma = {
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            count: jest.fn(),
            groupBy: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create user with role assignment', async () => {
            const createDto = {
                email: 'test@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                phone: '0812345678',
                department: 'Operations',
                role: Role.FIELD_OFFICER,
            };

            mockPrisma.user.findUnique.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
            mockPrisma.user.create.mockResolvedValue({
                id: 'user-1',
                email: createDto.email,
                firstName: createDto.firstName,
                lastName: createDto.lastName,
                role: createDto.role,
            });

            const result = await service.create(createDto);

            expect(result).toHaveProperty('id');
            expect(result.email).toBe(createDto.email);
            expect(mockPrisma.user.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        email: createDto.email,
                        role: Role.FIELD_OFFICER,
                        password: 'hashedPassword',
                    }),
                })
            );
        });

        it('should throw ConflictException if email exists', async () => {
            const createDto = {
                email: 'existing@example.com',
                password: 'password123',
                firstName: 'John',
                lastName: 'Doe',
                role: Role.FIELD_OFFICER,
            };

            mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

            await expect(service.create(createDto)).rejects.toThrow(
                ConflictException
            );
        });
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 'user-1', email: 'user1@test.com', role: Role.FIELD_OFFICER },
                { id: 'user-2', email: 'user2@test.com', role: Role.SUPERVISOR },
            ];

            mockPrisma.user.findMany.mockResolvedValue(mockUsers);

            const result = await service.findAll();

            expect(result).toEqual(mockUsers);
        });

        it('should filter users by role', async () => {
            mockPrisma.user.findMany.mockResolvedValue([]);

            await service.findAll(Role.ADMIN);

            expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { role: Role.ADMIN },
                })
            );
        });

        it('should hide DEVELOPER users from ADMIN', async () => {
            mockPrisma.user.findMany.mockResolvedValue([]);

            await service.findAll(undefined, Role.ADMIN);

            expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: { role: { not: Role.DEVELOPER } },
                })
            );
        });
    });

    describe('findOne', () => {
        it('should return user by id', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                role: Role.FIELD_OFFICER,
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.findOne('user-1');

            expect(result).toEqual(mockUser);
        });

        it('should throw NotFoundException if user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await expect(service.findOne('invalid-id')).rejects.toThrow(
                NotFoundException
            );
        });
    });

    describe('update', () => {
        it('should update user profile', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                role: Role.FIELD_OFFICER,
            };

            const updateDto = {
                firstName: 'Jane',
                lastName: 'Smith',
                phone: '0898765432',
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockPrisma.user.update.mockResolvedValue({
                ...mockUser,
                ...updateDto,
            });

            const result = await service.update('user-1', updateDto);

            expect(result.firstName).toBe('Jane');
            expect(mockPrisma.user.update).toHaveBeenCalled();
        });

        it('should throw ForbiddenException if ADMIN tries to update DEVELOPER', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 'user-1',
                role: Role.DEVELOPER,
            });

            await expect(
                service.update('user-1', {}, Role.ADMIN)
            ).rejects.toThrow(ForbiddenException);
        });

        it('should throw ForbiddenException if ADMIN tries to assign DEVELOPER role', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 'user-1',
                role: Role.FIELD_OFFICER,
            });

            await expect(
                service.update('user-1', { role: Role.DEVELOPER }, Role.ADMIN)
            ).rejects.toThrow(ForbiddenException);
        });
    });

    describe('remove', () => {
        it('should soft delete user (deactivate)', async () => {
            const mockUser = {
                id: 'user-1',
                role: Role.FIELD_OFFICER,
                isActive: true,
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockPrisma.user.update.mockResolvedValue({
                ...mockUser,
                isActive: false,
            });

            const result = await service.remove('user-1');

            expect(result.isActive).toBe(false);
            expect(mockPrisma.user.update).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                data: { isActive: false },
            });
        });

        it('should throw ForbiddenException if ADMIN tries to delete DEVELOPER', async () => {
            mockPrisma.user.findUnique.mockResolvedValue({
                id: 'user-1',
                role: Role.DEVELOPER,
            });

            await expect(service.remove('user-1', Role.ADMIN)).rejects.toThrow(
                ForbiddenException
            );
        });
    });

    describe('getStatistics', () => {
        it('should return user statistics', async () => {
            mockPrisma.user.count.mockResolvedValue(10);
            mockPrisma.user.groupBy
                .mockResolvedValueOnce([
                    { role: Role.ADMIN, _count: 2 },
                    { role: Role.FIELD_OFFICER, _count: 5 },
                ])
                .mockResolvedValueOnce([
                    { isActive: true, _count: 8 },
                    { isActive: false, _count: 2 },
                ]);

            const result = await service.getStatistics();

            expect(result.total).toBe(10);
            expect(result.byRole).toHaveProperty(Role.ADMIN);
            expect(result.byStatus.ACTIVE).toBe(8);
            expect(result.byStatus.INACTIVE).toBe(2);
        });
    });

    describe('toggleStatus', () => {
        it('should toggle user active status', async () => {
            const mockUser = {
                id: 'user-1',
                isActive: true,
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockPrisma.user.update.mockResolvedValue({
                ...mockUser,
                isActive: false,
            });

            const result = await service.toggleStatus('user-1');

            expect(result.isActive).toBe(false);
            expect(mockPrisma.user.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { isActive: false },
                })
            );
        });
    });

    describe('changePassword', () => {
        it('should change password successfully', async () => {
            const mockUser = {
                id: 'user-1',
                password: 'oldHashedPassword',
            };

            const changePasswordDto = {
                currentPassword: 'oldPassword',
                newPassword: 'newPassword123',
                confirmPassword: 'newPassword123',
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');
            mockPrisma.user.update.mockResolvedValue({});

            const result = await service.changePassword('user-1', changePasswordDto);

            expect(result.message).toBe('Password changed successfully');
            expect(mockPrisma.user.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: { password: 'newHashedPassword' },
                })
            );
        });

        it('should throw BadRequestException if passwords do not match', async () => {
            const changePasswordDto = {
                currentPassword: 'oldPassword',
                newPassword: 'newPassword123',
                confirmPassword: 'differentPassword',
            };

            await expect(
                service.changePassword('user-1', changePasswordDto)
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw UnauthorizedException if current password is incorrect', async () => {
            const mockUser = {
                id: 'user-1',
                password: 'hashedPassword',
            };

            const changePasswordDto = {
                currentPassword: 'wrongPassword',
                newPassword: 'newPassword123',
                confirmPassword: 'newPassword123',
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.changePassword('user-1', changePasswordDto)
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                id: 'user-1',
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: Role.FIELD_OFFICER,
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            const result = await service.getProfile('user-1');

            expect(result).toEqual(mockUser);
        });
    });

    describe('updateProfile', () => {
        it('should update user profile and fullName', async () => {
            const mockUser = {
                id: 'user-1',
                firstName: 'John',
                lastName: 'Doe',
                fullName: 'John Doe',
            };

            const updateDto = {
                firstName: 'Jane',
                phone: '0812345678',
            };

            mockPrisma.user.findUnique.mockResolvedValue(mockUser);
            mockPrisma.user.update.mockResolvedValue({
                ...mockUser,
                ...updateDto,
                fullName: 'Jane Doe',
            });

            const result = await service.updateProfile('user-1', updateDto);

            expect(result.firstName).toBe('Jane');
            expect(result.fullName).toBe('Jane Doe');
        });
    });
});
