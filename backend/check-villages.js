const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVillages() {
  try {
    console.log('🔍 Checking Village data...\n');
    
    const villages = await prisma.village.findMany({
      select: {
        id: true,
        villageNo: true,
        name: true,
        boundary: true,
        centerPoint: true,
      },
      orderBy: { villageNo: 'asc' },
    });

    console.log(`📊 Total villages in database: ${villages.length}\n`);

    let withBoundary = 0;
    let withoutBoundary = 0;

    villages.forEach((v) => {
      const hasBoundary = v.boundary && v.boundary !== null && typeof v.boundary === 'object';
      const hasValidGeoJSON = hasBoundary && v.boundary.type && v.boundary.coordinates;
      
      if (hasValidGeoJSON) {
        withBoundary++;
        console.log(`✅ หมู่ ${v.villageNo} - ${v.name} - มีขอบเขต (${v.boundary.type})`);
      } else {
        withoutBoundary++;
        console.log(`❌ หมู่ ${v.villageNo} - ${v.name} - ไม่มีขอบเขต (boundary: ${v.boundary ? 'not null but invalid' : 'null'})`);
      }
    });

    console.log(`\n📈 Summary:`);
    console.log(`✅ Villages with valid boundaries: ${withBoundary}`);
    console.log(`❌ Villages without boundaries: ${withoutBoundary}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVillages();
