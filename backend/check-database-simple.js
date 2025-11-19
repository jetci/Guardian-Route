const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking Database (Without PostGIS)...\n');

  try {
    // 1. Count Villages
    console.log('1️⃣ Village Count:');
    const villageCount = await prisma.village.count();
    console.log(`   ${villageCount === 20 ? '✅' : '⚠️'} Total Villages: ${villageCount} (Expected: 20)`);
    console.log('');

    // 2. List All Villages
    console.log('2️⃣ All Villages:');
    const villages = await prisma.village.findMany({
      select: {
        id: true,
        name: true,
        villageNo: true,
      },
      orderBy: {
        villageNo: 'asc',
      },
    });
    
    villages.forEach((v, i) => {
      console.log(`   ${String(i + 1).padStart(2, ' ')}. หมู่ ${v.villageNo} - ${v.name}`);
    });
    console.log('');

    // 3. Check GeoJSON data
    console.log('3️⃣ GeoJSON Data Check:');
    const villagesWithBoundary = await prisma.village.count({
      where: {
        boundary: {
          not: null,
        },
      },
    });
    console.log(`   ${villagesWithBoundary === 20 ? '✅' : '⚠️'} Villages with GeoJSON: ${villagesWithBoundary}/${villageCount}`);
    console.log('');

    // 4. Check Users
    console.log('4️⃣ User Count:');
    const userCount = await prisma.user.count();
    console.log(`   ✅ Total Users: ${userCount}`);
    
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });
    
    console.log('   By Role:');
    usersByRole.forEach(r => {
      console.log(`      - ${r.role}: ${r._count}`);
    });
    console.log('');

    // 5. List Test Users
    console.log('5️⃣ Test Users:');
    const testUsers = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        firstName: true,
        lastName: true,
      },
      orderBy: {
        role: 'asc',
      },
    });
    
    testUsers.forEach(u => {
      console.log(`   - ${u.email.padEnd(35, ' ')} | ${u.role.padEnd(15, ' ')} | ${u.firstName} ${u.lastName}`);
    });
    console.log('');

    // 6. Check Incidents
    console.log('6️⃣ Incident Count:');
    const incidentCount = await prisma.incident.count();
    console.log(`   ✅ Total Incidents: ${incidentCount}`);
    console.log('');

    // 7. Check Tasks
    console.log('7️⃣ Task Count:');
    const taskCount = await prisma.task.count();
    console.log(`   ✅ Total Tasks: ${taskCount}`);
    console.log('');

    // Summary
    console.log('═'.repeat(60));
    console.log('📊 DATABASE VERIFICATION SUMMARY');
    console.log('═'.repeat(60));
    console.log(`   Villages:        ${villageCount === 20 ? '✅' : '⚠️'} ${villageCount}/20`);
    console.log(`   GeoJSON Data:    ${villagesWithBoundary === 20 ? '✅' : '⚠️'} ${villagesWithBoundary}/20`);
    console.log(`   Users:           ✅ ${userCount} users`);
    console.log(`   Incidents:       ✅ ${incidentCount} incidents`);
    console.log(`   Tasks:           ✅ ${taskCount} tasks`);
    console.log(`   PostGIS:         ❌ NOT INSTALLED`);
    console.log('═'.repeat(60));
    console.log('');

    if (villageCount === 20 && villagesWithBoundary === 20) {
      console.log('✅ Data verification: PASSED');
      console.log('⚠️  PostGIS extension: NEEDS INSTALLATION');
    } else {
      console.log('⚠️  Database verification: INCOMPLETE');
      if (villageCount !== 20) {
        console.log(`   - Need to seed ${20 - villageCount} more villages`);
      }
      if (villagesWithBoundary !== 20) {
        console.log(`   - Need GeoJSON for ${20 - villagesWithBoundary} villages`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
