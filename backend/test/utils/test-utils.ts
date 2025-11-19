import { ConfigService } from '@nestjs/config';

// Mock PrismaService
export const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  incident: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  task: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  village: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  survey: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  surveyResponse: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  $disconnect: jest.fn(),
  $connect: jest.fn(),
};

// Mock ConfigService
export const mockConfigService = {
  get: jest.fn((key: string) => {
    const config: Record<string, any> = {
      JWT_SECRET: 'test-secret-key',
      JWT_EXPIRES_IN: '8h',
      JWT_REFRESH_EXPIRES_IN: '7d',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      PORT: 3001,
      NODE_ENV: 'test',
    };
    return config[key];
  }),
};

// Mock JwtService
export const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
  decode: jest.fn(),
};

// Helper: Clear all mocks
export const clearAllMocks = () => {
  Object.values(mockPrismaService).forEach((model: any) => {
    if (typeof model === 'object') {
      Object.values(model).forEach((method: any) => {
        if (typeof method?.mockClear === 'function') {
          method.mockClear();
        }
      });
    }
  });
  jest.clearAllMocks();
};

// Helper: Mock user data
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashedPassword123',
  firstName: 'Test',
  lastName: 'User',
  role: 'FIELD_OFFICER',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Helper: Mock incident data
export const createMockIncident = (overrides = {}) => ({
  id: 'test-incident-id',
  title: 'Test Incident',
  description: 'Test description',
  type: 'FLOOD',
  severity: 'MEDIUM',
  status: 'PENDING',
  location: { type: 'Point', coordinates: [99.8, 19.9] },
  reportedById: 'test-user-id',
  villageId: 'test-village-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Helper: Mock task data
export const createMockTask = (overrides = {}) => ({
  id: 'test-task-id',
  title: 'Test Task',
  description: 'Test task description',
  status: 'PENDING',
  priority: 'MEDIUM',
  assignedToId: 'test-user-id',
  createdById: 'test-creator-id',
  incidentId: 'test-incident-id',
  dueDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});
