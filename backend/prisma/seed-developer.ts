/**
 * Seed Developer User
 * Email: jetci.jm@gmail.com
 * Password: g0KEk,^],k;yo
 * Role: DEVELOPER
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Developer user...');

  const email = 'jetci.jm@gmail.com';
  const password = 'g0KEk,^],k;yo';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log('⚠️  Developer user already exists. Updating...');
    await prisma.user.update({
      where: { email },
      data: {
        role: 'DEVELOPER',
        password: hashedPassword,
        isActive: true,
      },
    });
    console.log('✅ Developer user updated successfully!');
  } else {
    console.log('➕ Creating new Developer user...');
    await prisma.user.create({
      data: {
        email,
        username: 'jetci',
        password: hashedPassword,
        firstName: 'Jetci',
        lastName: 'Developer',
        fullName: 'Jetci Developer',
        phone: '000-000-0000',
        role: 'DEVELOPER',
        isActive: true,
      },
    });
    console.log('✅ Developer user created successfully!');
  }

  console.log('\n📋 Developer Credentials:');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('Role: DEVELOPER');
  console.log('\n⚠️  IMPORTANT: This user has elevated permissions!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding developer:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
