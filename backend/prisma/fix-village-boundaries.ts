import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function fixVillageBoundaries() {
  console.log('🔧 Fixing village boundaries...\n');

  // Get all villages
  const villages = await prisma.village.findMany({
    orderBy: { villageNo: 'asc' }
  });

  console.log(`📊 Total villages: ${villages.length}\n`);

  let fixedCount = 0;

  for (const village of villages) {
    // Check if boundary is placeholder (all coordinates are the same)
    if (village.boundary && typeof village.boundary === 'object') {
      const boundary = village.boundary as any;
      
      if (boundary.coordinates && boundary.coordinates[0]) {
        const coords = boundary.coordinates[0];
        
        // Check if all coordinates are the same (placeholder)
        const firstCoord = coords[0];
        const isPlaceholder = coords.every((coord: number[]) => 
          coord[0] === firstCoord[0] && coord[1] === firstCoord[1]
        );

        if (isPlaceholder) {
          // Remove placeholder boundary
          await prisma.village.update({
            where: { id: village.id },
            data: {
              boundary: Prisma.JsonNull
            }
          });
          
          console.log(`  ❌ Removed placeholder boundary: หมู่ ${village.villageNo} - ${village.name}`);
          fixedCount++;
        } else {
          console.log(`  ✅ Valid boundary: หมู่ ${village.villageNo} - ${village.name}`);
        }
      }
    } else {
      console.log(`  ⚪ No boundary: หมู่ ${village.villageNo} - ${village.name}`);
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} villages with placeholder boundaries`);
  console.log(`✅ ${villages.length - fixedCount} villages with valid or no boundaries`);
}

fixVillageBoundaries()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
