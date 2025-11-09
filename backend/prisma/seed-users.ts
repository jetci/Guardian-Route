import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedUsers() {
  console.log('🌱 Seeding users...');

  // Hash password (bcrypt rounds = 10)
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@guardianroute.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@guardianroute.com',
      password: hashedPassword,
      fullName: 'System Administrator',
      firstName: 'System',
      lastName: 'Administrator',
      phone: '081-000-0001',
      department: 'IT Department',
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Executive User
  const executive = await prisma.user.upsert({
    where: { email: 'executive@guardianroute.com' },
    update: {},
    create: {
      username: 'executive',
      email: 'executive@guardianroute.com',
      password: hashedPassword,
      fullName: 'Executive Manager',
      firstName: 'Executive',
      lastName: 'Manager',
      phone: '081-000-0002',
      department: 'Management',
      role: Role.EXECUTIVE,
      isActive: true,
    },
  });
  console.log('✅ Executive user created:', executive.email);

  // Supervisor User
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@guardianroute.com' },
    update: {},
    create: {
      username: 'supervisor',
      email: 'supervisor@guardianroute.com',
      password: hashedPassword,
      fullName: 'Field Supervisor',
      firstName: 'Field',
      lastName: 'Supervisor',
      phone: '081-000-0003',
      department: 'Field Operations',
      role: Role.SUPERVISOR,
      isActive: true,
    },
  });
  console.log('✅ Supervisor user created:', supervisor.email);

  // Field Officer User
  const fieldOfficer = await prisma.user.upsert({
    where: { email: 'officer@guardianroute.com' },
    update: {},
    create: {
      username: 'officer',
      email: 'officer@guardianroute.com',
      password: hashedPassword,
      fullName: 'Field Officer',
      firstName: 'Field',
      lastName: 'Officer',
      phone: '081-000-0004',
      department: 'Field Operations',
      role: Role.FIELD_OFFICER,
      isActive: true,
    },
  });
  console.log('✅ Field Officer user created:', fieldOfficer.email);

  // Test User (inactive)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@guardianroute.com' },
    update: {},
    create: {
      username: 'testuser',
      email: 'test@guardianroute.com',
      password: hashedPassword,
      fullName: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      phone: '081-000-0005',
      department: 'Testing',
      role: Role.FIELD_OFFICER,
      isActive: false, // Inactive for testing
    },
  });
  console.log('✅ Test user created (inactive):', testUser.email);

  console.log('\n📋 User Credentials Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('| Role          | Username   | Email                        | Password     |');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('| ADMIN         | admin      | admin@guardianroute.com      | Password123! |');
  console.log('| EXECUTIVE     | executive  | executive@guardianroute.com  | Password123! |');
  console.log('| SUPERVISOR    | supervisor | supervisor@guardianroute.com | Password123! |');
  console.log('| FIELD_OFFICER | officer    | officer@guardianroute.com    | Password123! |');
  console.log('| TEST (inactive)| testuser  | test@guardianroute.com       | Password123! |');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n✅ User seeding completed!');
}

async function main() {
  try {
    await seedUsers();
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
