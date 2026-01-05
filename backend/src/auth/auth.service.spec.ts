import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PrismaService } from '../database/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        JWT_EXPIRATION: '8h',
        JWT_SECRET: 'test-secret',
        REFRESH_TOKEN_SECRET: 'refresh-secret',
        REFRESH_TOKEN_EXPIRATION: '7d',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phone: '0812345678',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: Role.FIELD_OFFICER,
        isActive: true,
      });
      mockPrisma.activityLog.create.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(registerDto.email);
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.activityLog.create).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if email exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing-user' });

      await expect(service.register(registerDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should allow ADMIN to set role', async () => {
      const registerDto = {
        email: 'admin@example.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: Role.SUPERVISOR,
      };

      const requestingUser = { role: Role.ADMIN };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        role: Role.SUPERVISOR,
      });
      mockPrisma.activityLog.create.mockResolvedValue({});

      await service.register(registerDto, requestingUser);

      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: Role.SUPERVISOR,
          }),
        })
      );
    });
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashedPassword',
        firstName: 'Test',
        lastName: 'User',
        role: Role.FIELD_OFFICER,
        isActive: true,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toHaveProperty('id');
      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException if user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if account is inactive', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        isActive: false,
      });

      await expect(
        service.validateUser('test@example.com', 'password123')
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashedPassword',
        isActive: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword')
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return access token and refresh token', async () => {
      const user = {
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: Role.FIELD_OFFICER,
      };

      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');
      mockPrisma.activityLog.create.mockResolvedValue({});

      const result = await service.login(user);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('access_token'); // snake_case for frontend
      expect(result).toHaveProperty('refresh_token');
      expect(result.user).toEqual(
        expect.objectContaining({
          id: user.id,
          email: user.email,
        })
      );
      expect(mockPrisma.activityLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          action: 'LOGIN',
        }),
      });
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      const payload = {
        sub: 'user-1',
        email: 'test@example.com',
        role: Role.FIELD_OFFICER,
      };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: Role.FIELD_OFFICER,
        isActive: true,
      });
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');

      const result = await service.refreshToken('valid-refresh-token');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.id).toBe('user-1');
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const payload = { sub: 'user-1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        isActive: false,
      });

      await expect(service.refreshToken('valid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('logout', () => {
    it('should log logout activity', async () => {
      mockPrisma.activityLog.create.mockResolvedValue({});

      const result = await service.logout('user-1');

      expect(result.message).toBe('Logged out successfully');
      expect(mockPrisma.activityLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: 'user-1',
          action: 'LOGOUT',
        }),
      });
    });
  });

  describe('verifyToken', () => {
    it('should return user when token is valid', async () => {
      const payload = { sub: 'user-1' };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: Role.FIELD_OFFICER,
        isActive: true,
      });

      const result = await service.verifyToken('valid-token');

      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.verifyToken('invalid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const payload = { sub: 'user-1' };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'user-1',
        isActive: false,
      });

      await expect(service.verifyToken('valid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
