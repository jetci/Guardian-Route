import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllBoundaries() {
  console.log('🗑️  Clearing ALL village boundaries...\n');

  const result = await prisma.village.updateMany({
    data: {
      boundary: Prisma.JsonNull
    }
  });

  console.log(`✅ Cleared boundaries from ${result.count} villages`);
  console.log('\n📝 Now you can add real boundaries through Admin UI');
}

clearAllBoundaries()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
