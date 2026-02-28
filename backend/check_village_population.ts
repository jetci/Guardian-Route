import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkVillagePopulation() {
    console.log('🔍 ตรวจสอบข้อมูลประชากรในหมู่บ้าน...\n');

    const villages = await prisma.village.findMany({
        select: {
            id: true,
            villageNo: true,
            name: true,
            population: true,
            populationMale: true,
            populationFemale: true,
        },
        orderBy: { villageNo: 'asc' },
    });

    console.log(`พบหมู่บ้านทั้งหมด: ${villages.length} หมู่บ้าน\n`);

    // แยกประเภทข้อมูล
    const withPopulation = villages.filter(v => v.population !== null && v.population > 0);
    const withMaleFemale = villages.filter(v => v.populationMale !== null || v.populationFemale !== null);
    const inconsistent = villages.filter(v =>
        v.population !== null &&
        v.population > 0 &&
        (v.populationMale === null || v.populationFemale === null)
    );

    console.log('📊 สรุปข้อมูล:');
    console.log(`   - มีประชากรรวม: ${withPopulation.length} หมู่บ้าน`);
    console.log(`   - มีข้อมูลชาย/หญิง: ${withMaleFemale.length} หมู่บ้าน`);
    console.log(`   - ไม่สอดคล้องกัน: ${inconsistent.length} หมู่บ้าน\n`);

    if (inconsistent.length > 0) {
        console.log('⚠️  หมู่บ้านที่มีประชากรรวม แต่ไม่มีข้อมูลชาย/หญิง:');
        console.log('─'.repeat(80));
        console.log('หมู่ที่ | ชื่อหมู่บ้าน | ประชากรรวม | ชาย | หญิง');
        console.log('─'.repeat(80));

        inconsistent.forEach(v => {
            console.log(
                `${String(v.villageNo).padEnd(6)} | ` +
                `${v.name.padEnd(20)} | ` +
                `${String(v.population || 0).padEnd(12)} | ` +
                `${String(v.populationMale || '-').padEnd(4)} | ` +
                `${String(v.populationFemale || '-')}`
            );
        });
        console.log('─'.repeat(80));
    }

    // แสดงตัวอย่างข้อมูลที่สมบูรณ์
    const complete = villages.filter(v =>
        v.population !== null &&
        v.populationMale !== null &&
        v.populationFemale !== null
    );

    if (complete.length > 0) {
        console.log(`\n✅ หมู่บ้านที่มีข้อมูลครบถ้วน: ${complete.length} หมู่บ้าน`);
        console.log('─'.repeat(80));
        console.log('หมู่ที่ | ชื่อหมู่บ้าน | ประชากรรวม | ชาย | หญิง | ตรวจสอบ');
        console.log('─'.repeat(80));

        complete.slice(0, 5).forEach(v => {
            const sum = (v.populationMale || 0) + (v.populationFemale || 0);
            const match = sum === v.population ? '✅' : '❌';
            console.log(
                `${String(v.villageNo).padEnd(6)} | ` +
                `${v.name.padEnd(20)} | ` +
                `${String(v.population || 0).padEnd(12)} | ` +
                `${String(v.populationMale || 0).padEnd(4)} | ` +
                `${String(v.populationFemale || 0).padEnd(6)} | ` +
                `${match} ${sum === v.population ? '' : `(ควรเป็น ${sum})`}`
            );
        });
        console.log('─'.repeat(80));
    }

    // สรุปรวม
    const totalPopulation = villages.reduce((sum, v) => sum + (v.population || 0), 0);
    const totalMale = villages.reduce((sum, v) => sum + (v.populationMale || 0), 0);
    const totalFemale = villages.reduce((sum, v) => sum + (v.populationFemale || 0), 0);

    console.log('\n📈 สรุปรวมทั้งหมด:');
    console.log(`   ประชากรรวม (จากฟิลด์ population): ${totalPopulation.toLocaleString()} คน`);
    console.log(`   ประชากรชาย: ${totalMale.toLocaleString()} คน`);
    console.log(`   ประชากรหญิง: ${totalFemale.toLocaleString()} คน`);
    console.log(`   รวมชาย+หญิง: ${(totalMale + totalFemale).toLocaleString()} คน`);
    console.log(`   ส่วนต่าง: ${(totalPopulation - (totalMale + totalFemale)).toLocaleString()} คน`);

    await prisma.$disconnect();
}

checkVillagePopulation().catch(console.error);
