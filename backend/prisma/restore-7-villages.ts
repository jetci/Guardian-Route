import { PrismaClient } from '@prisma/client';
import { villagesWithGeoJSONData } from './villages-with-geojson-seed';

const prisma = new PrismaClient();

// 7 หมู่บ้านที่มีขอบเขตจริง (ไม่ใช่ placeholder)
const REAL_BOUNDARY_VILLAGES = [1, 2, 3, 4, 5, 7, 11];

async function restore7Villages() {
  console.log('🔄 Restoring 7 villages with real boundaries...\n');

  for (const villageNo of REAL_BOUNDARY_VILLAGES) {
    const villageData = villagesWithGeoJSONData.find(v => v.villageNo === villageNo);
    
    if (!villageData) {
      console.log(`  ⚠️  Village ${villageNo} not found in seed data`);
      continue;
    }

    // Check if boundary is placeholder
    if (villageData.boundary && villageData.boundary.coordinates && villageData.boundary.coordinates[0]) {
      const coords = villageData.boundary.coordinates[0];
      const firstCoord = coords[0];
      const isPlaceholder = coords.every((coord: number[]) => 
        coord[0] === firstCoord[0] && coord[1] === firstCoord[1]
      );

      if (isPlaceholder) {
        console.log(`  ⚠️  หมู่ ${villageNo} - ${villageData.name}: Boundary is placeholder, skipping`);
        continue;
      }
    }

    await prisma.village.update({
      where: { villageNo: villageData.villageNo },
      data: {
        boundary: villageData.boundary,
        centerPoint: villageData.centerPoint,
      },
    });

    console.log(`  ✅ หมู่ ${villageData.villageNo} - ${villageData.name}: Restored boundary`);
  }

  console.log('\n✅ Restored 7 villages with real boundaries');
}

restore7Villages()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
