// Mock Auth API for testing without backend
import type { LoginResponse } from '../types';
import { Role } from '../types';

// Mock users database
const mockUsers = {
  'jetci.jm@gmail.com': {
    id: '0',
    email: 'jetci.jm@gmail.com',
    firstName: 'Jetci',
    lastName: 'Developer',
    role: Role.DEVELOPER,
    password: 'g0KEk,^],k;yo',
  },
  'admin@obtwiang.go.th': {
    id: '1',
    email: 'admin@obtwiang.go.th',
    firstName: 'Admin',
    lastName: 'User',
    role: Role.ADMIN,
    password: 'password123',
  },
  'supervisor@obtwiang.go.th': {
    id: '2',
    email: 'supervisor@obtwiang.go.th',
    firstName: 'Supervisor',
    lastName: 'User',
    role: Role.SUPERVISOR,
    password: 'password123',
  },
  'executive@obtwiang.go.th': {
    id: '3',
    email: 'executive@obtwiang.go.th',
    firstName: 'Executive',
    lastName: 'User',
    role: Role.EXECUTIVE,
    password: 'password123',
  },
  'field@obtwiang.go.th': {
    id: '4',
    email: 'field@obtwiang.go.th',
    firstName: 'Field',
    lastName: 'Officer',
    role: Role.FIELD_OFFICER,
    password: 'password123',
  },
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(800); // Simulate network delay

    const user = mockUsers[email as keyof typeof mockUsers];

    if (!user || user.password !== password) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken: `mock-access-token-${user.id}`,
      refreshToken: `mock-refresh-token-${user.id}`,
    };
  },
};
