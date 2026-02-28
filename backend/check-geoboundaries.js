const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkGeoBoundaries() {
    try {
        console.log('🔍 Checking GeoBoundary data...\n');

        const boundaries = await prisma.geoBoundary.findMany({
            orderBy: { createdAt: 'desc' },
        });

        console.log(`📊 Total geo_boundaries in database: ${boundaries.length}\n`);

        boundaries.forEach((b) => {
            console.log(`🔹 [${b.type}] ${b.name} - villageId: ${b.villageId || 'none'}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkGeoBoundaries();
