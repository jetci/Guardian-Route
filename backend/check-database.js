const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('🔍 Checking Database...\n');

  try {
    // 1. Check PostGIS
    console.log('1️⃣ PostGIS Version:');
    const postgisVersion = await prisma.$queryRaw`SELECT PostGIS_version() as version;`;
    console.log('   ✅', postgisVersion[0]?.version || 'PostGIS installed');
    console.log('');

    // 2. Count Villages
    console.log('2️⃣ Village Count:');
    const villageCount = await prisma.village.count();
    console.log(`   ${villageCount === 20 ? '✅' : '⚠️'} Total Villages: ${villageCount} (Expected: 20)`);
    console.log('');

    // 3. List Villages
    console.log('3️⃣ Village List (First 5):');
    const villages = await prisma.village.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        code: true,
      },
    });
    
    villages.forEach((v, i) => {
      console.log(`   ${i + 1}. ${v.name} (${v.code})`);
    });
    console.log('');

    // 4. Check GeoJSON data
    console.log('4️⃣ GeoJSON Data Check:');
    const villagesWithBoundary = await prisma.village.count({
      where: {
        boundary: {
          not: null,
        },
      },
    });
    console.log(`   ${villagesWithBoundary === 20 ? '✅' : '⚠️'} Villages with GeoJSON: ${villagesWithBoundary}/20`);
    console.log('');

    // 5. Check Users
    console.log('5️⃣ User Count:');
    const userCount = await prisma.user.count();
    console.log(`   ✅ Total Users: ${userCount}`);
    
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true,
    });
    
    usersByRole.forEach(r => {
      console.log(`      - ${r.role}: ${r._count}`);
    });
    console.log('');

    // 6. Check Incidents
    console.log('6️⃣ Incident Count:');
    const incidentCount = await prisma.incident.count();
    console.log(`   ✅ Total Incidents: ${incidentCount}`);
    console.log('');

    // Summary
    console.log('📊 Summary:');
    console.log(`   PostGIS: ${postgisVersion[0]?.version ? '✅' : '⚠️'}`);
    console.log(`   Villages: ${villageCount === 20 ? '✅' : '⚠️'} (${villageCount}/20)`);
    console.log(`   GeoJSON: ${villagesWithBoundary === 20 ? '✅' : '⚠️'} (${villagesWithBoundary}/20)`);
    console.log(`   Users: ✅ (${userCount})`);
    console.log(`   Incidents: ✅ (${incidentCount})`);
    console.log('');

    if (villageCount === 20 && villagesWithBoundary === 20) {
      console.log('🎉 Database verification: ✅ PASSED');
    } else {
      console.log('⚠️ Database verification: INCOMPLETE');
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
