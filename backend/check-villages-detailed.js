const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkVillagesDetailed() {
    try {
        console.log('🔍 Checking Village Boundary statuses...\n');

        const villages = await prisma.village.findMany({
            orderBy: { villageNo: 'asc' },
        });

        console.log(`📊 Found ${villages.length} villages total\n`);

        villages.forEach((v) => {
            const hasBoundary = v.boundary && typeof v.boundary === 'object' && Object.keys(v.boundary).length > 0;
            const boundaryType = hasBoundary ? v.boundary.type : 'N/A';
            console.log(`[หมู่ ${v.villageNo}] ${v.name.padEnd(20)} | Boundary: ${hasBoundary ? '✅ YES' : '❌ NO '} | Type: ${boundaryType}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkVillagesDetailed();
