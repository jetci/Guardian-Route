const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function scrubChiangRai() {
    try {
        console.log('🧹 Scrubbing Chiang Rai references from database...\n');

        // 1. Villages
        const villages = await prisma.village.findMany({
            where: {
                OR: [
                    { description: { contains: 'เชียงราย' } },
                    { description: { contains: 'Chiang Rai' } }
                ]
            }
        });
        console.log(`📍 Found ${villages.length} villages with Chiang Rai in description`);
        for (const v of villages) {
            const newDesc = v.description.replace(/เชียงราย/g, 'เชียงใหม่').replace(/Chiang Rai/g, 'Chiang Mai');
            await prisma.village.update({ where: { id: v.id }, data: { description: newDesc } });
            console.log(`   ✅ Fixed description for หมู่ ${v.villageNo}`);
        }

        // 2. Incidents
        const incidents = await prisma.incident.findMany({
            where: {
                OR: [
                    { address: { contains: 'เชียงราย' } },
                    { address: { contains: 'Chiang Rai' } },
                    { title: { contains: 'เชียงราย' } },
                    { title: { contains: 'Chiang Rai' } }
                ]
            }
        });
        console.log(`📝 Found ${incidents.length} incidents with Chiang Rai references`);
        for (const inc of incidents) {
            const newAddress = inc.address ? inc.address.replace(/เชียงราย/g, 'เชียงใหม่').replace(/Chiang Rai/g, 'Chiang Mai') : inc.address;
            const newTitle = inc.title.replace(/เชียงราย/g, 'เชียงใหม่').replace(/Chiang Rai/g, 'Chiang Mai');
            await prisma.incident.update({ where: { id: inc.id }, data: { address: newAddress, title: newTitle } });
            console.log(`   ✅ Fixed incident: ${inc.title}`);
        }

        // 3. Reports
        const reports = await prisma.report.findMany({
            where: {
                OR: [
                    { title: { contains: 'เชียงราย' } },
                    { title: { contains: 'Chiang Rai' } },
                    { summary: { contains: 'เชียงราย' } },
                    { summary: { contains: 'Chiang Rai' } }
                ]
            }
        });
        console.log(`📄 Found ${reports.length} reports with Chiang Rai references`);
        for (const r of reports) {
            const newTitle = r.title.replace(/เชียงราย/g, 'เชียงใหม่').replace(/Chiang Rai/g, 'Chiang Mai');
            const newSummary = r.summary ? r.summary.replace(/เชียงราย/g, 'เชียงใหม่').replace(/Chiang Rai/g, 'Chiang Mai') : r.summary;
            await prisma.report.update({ where: { id: r.id }, data: { title: newTitle, summary: newSummary } });
            console.log(`   ✅ Fixed report: ${r.title}`);
        }

        console.log('\n✅ Scrubbing complete!');

    } catch (error) {
        console.error('❌ Error scrubbing:', error);
    } finally {
        await prisma.$disconnect();
    }
}

scrubChiangRai();
