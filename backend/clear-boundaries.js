const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearBoundaries() {
  try {
    console.log('🗑️ Clearing all village boundaries...\n');
    
    const result = await prisma.village.updateMany({
      data: {
        boundary: null,
        centerPoint: null,
      },
    });

    console.log(`✅ Cleared boundaries from ${result.count} villages`);
    console.log('💡 ตอนนี้สามารถเริ่มวาดขอบเขตใหม่ได้แล้ว!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearBoundaries();
