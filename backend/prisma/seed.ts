import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { villagesWithGeoJSONData } from './villages-with-geojson-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ========================================
  // 1. SEED VILLAGES (20 หมู่บ้าน)
  // ========================================
  console.log('📍 Seeding Villages...');

  for (const villageData of villagesWithGeoJSONData) {
    const village = await prisma.village.upsert({
      where: { villageNo: villageData.villageNo },
      update: {
        centerPoint: villageData.centerPoint,
        boundary: villageData.boundary,
      },
      create: {
        villageNo: villageData.villageNo,
        name: villageData.name,
        alternateNames: villageData.alternateNames,
        households: villageData.households,
        population: villageData.population,
        area: villageData.area,
        description: villageData.description,
        centerPoint: villageData.centerPoint,
        boundary: villageData.boundary,
      },
    });
    console.log(`  ✅ หมู่ ${village.villageNo}: ${village.name} (📍 ${villageData.centerPoint ? 'มีพิกัด' : 'ไม่มีพิกัด'})`);
  }

  console.log(`\n✅ Created ${villagesWithGeoJSONData.length} villages with GeoJSON data\n`);

  // ========================================
  // 2. SEED USERS (4 roles)
  // ========================================
  console.log('👥 Seeding Users...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@obtwiang.go.th' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Admin System',
      firstName: 'Admin',
      lastName: 'System',
      phone: '081-234-5678',
      role: Role.ADMIN,
    },
  });

  console.log('  ✅ Created Admin:', admin.email);

  // Create Executive
  const executive = await prisma.user.upsert({
    where: { email: 'executive@obtwiang.go.th' },
    update: {},
    create: {
      username: 'executive',
      email: 'executive@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Somkid Executive',
      firstName: 'Somkid',
      lastName: 'Executive',
      phone: '081-234-5681',
      role: Role.EXECUTIVE,
    },
  });

  console.log('  ✅ Created Executive:', executive.email);

  // Create Supervisor
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@obtwiang.go.th' },
    update: {},
    create: {
      username: 'supervisor',
      email: 'supervisor@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Somchai Supervisor',
      firstName: 'Somchai',
      lastName: 'Supervisor',
      phone: '081-234-5679',
      role: Role.SUPERVISOR,
    },
  });

  console.log('  ✅ Created Supervisor:', supervisor.email);

  // Create Field Officer
  const fieldOfficer = await prisma.user.upsert({
    where: { email: 'field@obtwiang.go.th' },
    update: {},
    create: {
      username: 'field',
      email: 'field@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Somsri Field',
      firstName: 'Somsri',
      lastName: 'Field',
      phone: '081-234-5680',
      role: Role.FIELD_OFFICER,
    },
  });

  console.log('  ✅ Created Field Officer:', fieldOfficer.email);

  // Create Developer
  const developer = await prisma.user.upsert({
    where: { email: 'jetci.jm@gmail.com' },
    update: {},
    create: {
      username: 'jetci',
      email: 'jetci.jm@gmail.com',
      password: await bcrypt.hash('g0KEk,^],k;yo', 10),
      fullName: 'Jetci Developer',
      firstName: 'Jetci',
      lastName: 'Developer',
      phone: '081-234-9999',
      role: Role.DEVELOPER,
    },
  });

  console.log('  ✅ Created Developer:', developer.email);

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n✅ Seed completed!\n');

  console.log('📊 Summary:');
  console.log(`  • Villages: ${villagesWithGeoJSONData.length}`);
  console.log(`  • Users: 4`);

  console.log('\n📝 Test Users:');
  console.log('┌──────────────────────────────┬─────────────┬───────────────┐');
  console.log('│ Email                        │ Password    │ Role          │');
  console.log('├──────────────────────────────┼─────────────┼───────────────┤');
  console.log('│ admin@obtwiang.go.th         │ password123 │ ADMIN         │');
  console.log('│ executive@obtwiang.go.th     │ password123 │ EXECUTIVE     │');
  console.log('│ supervisor@obtwiang.go.th    │ password123 │ SUPERVISOR    │');
  console.log('│ field@obtwiang.go.th         │ password123   │ FIELD_OFFICER │');
  console.log('│ jetci.jm@gmail.com           │ g0KEk,^],k;yo │ DEVELOPER     │');
  console.log('└──────────────────────────────┴───────────────┴───────────────┘');

  console.log('\n🏘️  Villages (20 หมู่บ้าน):');
  console.log('┌────┬──────────────────────┬──────────┬──────────┐');
  console.log('│ หมู่│ ชื่อหมู่บ้าน         │ ครัวเรือน│ ประชากร │');
  console.log('├────┼──────────────────────┼──────────┼──────────┤');
  villagesWithGeoJSONData.forEach((v) => {
    const namePadded = v.name.padEnd(20, ' ');
    const householdsPadded = v.households.toString().padStart(8, ' ');
    const populationPadded = v.population.toString().padStart(8, ' ');
    console.log(`│ ${v.villageNo.toString().padStart(2, ' ')} │ ${namePadded} │${householdsPadded} │${populationPadded} │`);
  });
  console.log('└────┴──────────────────────┴──────────┴──────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
