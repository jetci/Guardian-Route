import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@obtwiang.go.th' },
    update: {},
    create: {
      email: 'admin@obtwiang.go.th',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'System',
      phone: '081-234-5678',
      role: Role.ADMIN,
    },
  });

  console.log('✅ Created Admin:', admin.email);

  // Create Executive
  const executive = await prisma.user.upsert({
    where: { email: 'executive@obtwiang.go.th' },
    update: {},
    create: {
      email: 'executive@obtwiang.go.th',
      password: hashedPassword,
      firstName: 'Somkid',
      lastName: 'Executive',
      phone: '081-234-5681',
      role: Role.EXECUTIVE,
    },
  });

  console.log('✅ Created Executive:', executive.email);

  // Create Supervisor
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@obtwiang.go.th' },
    update: {},
    create: {
      email: 'supervisor@obtwiang.go.th',
      password: hashedPassword,
      firstName: 'Somchai',
      lastName: 'Supervisor',
      phone: '081-234-5679',
      role: Role.SUPERVISOR,
    },
  });

  console.log('✅ Created Supervisor:', supervisor.email);

  // Create Field Officer
  const fieldOfficer = await prisma.user.upsert({
    where: { email: 'field@obtwiang.go.th' },
    update: {},
    create: {
      email: 'field@obtwiang.go.th',
      password: hashedPassword,
      firstName: 'Somsri',
      lastName: 'Field',
      phone: '081-234-5680',
      role: Role.FIELD_OFFICER,
    },
  });

  console.log('✅ Created Field Officer:', fieldOfficer.email);

  console.log('\n✅ Seed completed!');
  console.log('\n📝 Test Users:');
  console.log('┌─────────────────────────────────────────────────────────────┐');
  console.log('│ Email                        │ Password    │ Role           │');
  console.log('├─────────────────────────────────────────────────────────────┤');
  console.log('│ admin@obtwiang.go.th         │ password123 │ ADMIN          │');
  console.log('│ executive@obtwiang.go.th     │ password123 │ EXECUTIVE      │');
  console.log('│ supervisor@obtwiang.go.th    │ password123 │ SUPERVISOR     │');
  console.log('│ field@obtwiang.go.th         │ password123 │ FIELD_OFFICER  │');
  console.log('└─────────────────────────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
