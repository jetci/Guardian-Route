import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ข้อมูลจริงจากผู้ใช้
const realPopulationData = [
    { villageNo: 1, name: 'หนองตุ้ม', male: 199, female: 245 },
    { villageNo: 2, name: 'ป่าบง', male: 101, female: 144 },
    { villageNo: 3, name: 'หนองอึ่ง', male: 214, female: 225 },
    { villageNo: 4, name: 'สวนดอก', male: 270, female: 297 },
    { villageNo: 5, name: 'ต้นหนุน', male: 160, female: 181 },
    { villageNo: 6, name: 'สันทรายคองน้อย', male: 355, female: 420 },
    { villageNo: 7, name: 'แม่ใจใต้', male: 312, female: 367 },
    { villageNo: 8, name: 'แม่ใจเหนือ', male: 306, female: 318 },
    { villageNo: 9, name: 'สันป่าไหน่', male: 106, female: 120 },
    { villageNo: 10, name: 'สันป่ายาง', male: 489, female: 467 },
    { villageNo: 11, name: 'ท่าสะแล', male: 180, female: 167 },
    { villageNo: 12, name: 'โป่งถืบ', male: 463, female: 407 },
    { villageNo: 13, name: 'ห้วยบอน', male: 462, female: 463 },
    { villageNo: 14, name: 'เสาหิน', male: 223, female: 256 },
    { villageNo: 15, name: 'โป่งถืบใน', male: 345, female: 377 },
    { villageNo: 16, name: 'ปางผึ้ง', male: 141, female: 125 },
    { villageNo: 17, name: 'ใหม่คองน้อย', male: 313, female: 326 },
    { villageNo: 18, name: 'ศรีดอนชัย', male: 220, female: 240 },
    { villageNo: 19, name: 'ใหม่ชยาราม', male: 223, female: 234 },
    { villageNo: 20, name: 'สระนิคม', male: 255, female: 327 },
];

async function importRealPopulationData() {
    console.log('📥 กำลัง Import ข้อมูลประชากรจริง...\n');

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    console.log('📋 รายการข้อมูลที่จะ Import:');
    console.log('─'.repeat(80));
    console.log('หมู่ที่ | ชื่อหมู่บ้าน | ชาย | หญิง | รวม | สถานะ');
    console.log('─'.repeat(80));

    for (const data of realPopulationData) {
        const total = data.male + data.female;

        try {
            // ค้นหาหมู่บ้านจาก villageNo
            const village = await prisma.village.findUnique({
                where: { villageNo: data.villageNo }
            });

            if (!village) {
                errors.push(`หมู่ ${data.villageNo}: ไม่พบในฐานข้อมูล`);
                console.log(
                    `${String(data.villageNo).padEnd(6)} | ` +
                    `${data.name.padEnd(20)} | ` +
                    `${String(data.male).padEnd(4)} | ` +
                    `${String(data.female).padEnd(6)} | ` +
                    `${String(total).padEnd(4)} | ❌ ไม่พบ`
                );
                errorCount++;
                continue;
            }

            // Update ข้อมูล
            await prisma.village.update({
                where: { villageNo: data.villageNo },
                data: {
                    populationMale: data.male,
                    populationFemale: data.female,
                    population: total,
                }
            });

            console.log(
                `${String(data.villageNo).padEnd(6)} | ` +
                `${data.name.padEnd(20)} | ` +
                `${String(data.male).padEnd(4)} | ` +
                `${String(data.female).padEnd(6)} | ` +
                `${String(total).padEnd(4)} | ✅ สำเร็จ`
            );
            successCount++;

        } catch (error: any) {
            errors.push(`หมู่ ${data.villageNo}: ${error.message}`);
            console.log(
                `${String(data.villageNo).padEnd(6)} | ` +
                `${data.name.padEnd(20)} | ` +
                `${String(data.male).padEnd(4)} | ` +
                `${String(data.female).padEnd(6)} | ` +
                `${String(total).padEnd(4)} | ❌ ผิดพลาด`
            );
            errorCount++;
        }
    }

    console.log('─'.repeat(80));

    // สรุปผล
    console.log('\n📊 สรุปผลการ Import:');
    console.log(`   ✅ สำเร็จ: ${successCount} หมู่บ้าน`);
    console.log(`   ❌ ผิดพลาด: ${errorCount} หมู่บ้าน`);

    if (errors.length > 0) {
        console.log('\n⚠️  รายการผิดพลาด:');
        errors.forEach(err => console.log(`   - ${err}`));
    }

    // ตรวจสอบข้อมูลหลัง Import
    console.log('\n🔍 ตรวจสอบข้อมูลหลัง Import:');
    const allVillages = await prisma.village.findMany({
        select: {
            population: true,
            populationMale: true,
            populationFemale: true,
        }
    });

    const totalMale = allVillages.reduce((sum, v) => sum + (v.populationMale || 0), 0);
    const totalFemale = allVillages.reduce((sum, v) => sum + (v.populationFemale || 0), 0);
    const totalPopulation = allVillages.reduce((sum, v) => sum + (v.population || 0), 0);
    const calculated = totalMale + totalFemale;

    console.log(`   - ประชากรชาย: ${totalMale.toLocaleString()} คน`);
    console.log(`   - ประชากรหญิง: ${totalFemale.toLocaleString()} คน`);
    console.log(`   - ประชากรรวม (จากฟิลด์): ${totalPopulation.toLocaleString()} คน`);
    console.log(`   - ประชากรรวม (คำนวณ): ${calculated.toLocaleString()} คน`);

    if (totalPopulation === calculated) {
        console.log('   ✅ ข้อมูลสอดคล้องกัน');
    } else {
        console.log(`   ⚠️  ข้อมูลไม่สอดคล้อง (ส่วนต่าง: ${totalPopulation - calculated} คน)`);
    }

    // แสดงตัวอย่างข้อมูล
    console.log('\n📋 ตัวอย่างข้อมูลที่ Import (5 หมู่บ้านแรก):');
    const samples = await prisma.village.findMany({
        take: 5,
        orderBy: { villageNo: 'asc' },
        select: {
            villageNo: true,
            name: true,
            populationMale: true,
            populationFemale: true,
            population: true,
        }
    });

    console.log('─'.repeat(80));
    console.log('หมู่ที่ | ชื่อหมู่บ้าน | ชาย | หญิง | รวม | ตรวจสอบ');
    console.log('─'.repeat(80));

    samples.forEach(v => {
        const sum = (v.populationMale || 0) + (v.populationFemale || 0);
        const match = sum === v.population ? '✅' : '❌';
        console.log(
            `${String(v.villageNo).padEnd(6)} | ` +
            `${v.name.padEnd(20)} | ` +
            `${String(v.populationMale || 0).padEnd(4)} | ` +
            `${String(v.populationFemale || 0).padEnd(6)} | ` +
            `${String(v.population || 0).padEnd(4)} | ${match}`
        );
    });
    console.log('─'.repeat(80));

    await prisma.$disconnect();
    console.log('\n✅ เสร็จสิ้น');
}

importRealPopulationData().catch(console.error);
