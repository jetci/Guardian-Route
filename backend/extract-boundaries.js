const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function extractBoundaries() {
    try {
        console.log('📡 Extracting village boundaries from database...\n');

        const villages = await prisma.village.findMany({
            where: {
                boundary: { not: null }
            },
            orderBy: { villageNo: 'asc' },
        });

        console.log(`📊 Found ${villages.length} villages with boundaries in database.`);

        const extractedData = villages.map(v => ({
            villageNo: v.villageNo,
            name: v.name,
            boundary: v.boundary,
            centerPoint: v.centerPoint
        }));

        const outputPath = path.join(__dirname, 'extracted-boundaries.json');
        fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2), 'utf8');

        console.log(`✅ Extracted data saved to: ${outputPath}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

extractBoundaries();
