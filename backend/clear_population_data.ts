import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearInconsistentPopulationData() {
    console.log('🧹 กำลังล้างข้อมูลประชากรที่ไม่สมบูรณ์...\n');

    // ค้นหาหมู่บ้านที่มีประชากรรวม แต่ไม่มีข้อมูลชาย/หญิง
    const inconsistentVillages = await prisma.village.findMany({
        where: {
            population: { not: null },
            AND: [
                { populationMale: null },
                { populationFemale: null }
            ]
        },
        select: {
            id: true,
            villageNo: true,
            name: true,
            population: true,
            populationMale: true,
            populationFemale: true,
        },
        orderBy: { villageNo: 'asc' }
    });

    console.log(`พบหมู่บ้านที่มีข้อมูลไม่สมบูรณ์: ${inconsistentVillages.length} หมู่บ้าน\n`);

    if (inconsistentVillages.length === 0) {
        console.log('✅ ไม่พบข้อมูลที่ต้องล้าง');
        await prisma.$disconnect();
        return;
    }

    // แสดงรายการที่จะลบ
    console.log('📋 รายการที่จะล้างข้อมูล:');
    console.log('─'.repeat(60));
    console.log('หมู่ที่ | ชื่อหมู่บ้าน | ประชากรรวม (จะถูกลบ)');
    console.log('─'.repeat(60));

    inconsistentVillages.forEach(v => {
        console.log(
            `${String(v.villageNo).padEnd(6)} | ` +
            `${v.name.padEnd(25)} | ` +
            `${v.population} คน`
        );
    });
    console.log('─'.repeat(60));

    const totalPopulation = inconsistentVillages.reduce((sum, v) => sum + (v.population || 0), 0);
    console.log(`\nประชากรรวมที่จะถูกลบ: ${totalPopulation.toLocaleString()} คน\n`);

    // ยืนยันการดำเนินการ
    console.log('⚠️  กำลังดำเนินการล้างข้อมูล...');
    console.log('   - ตั้งค่า population = NULL');
    console.log('   - เก็บข้อมูลอื่นๆ ไว้\n');

    // ล้างข้อมูล
    const result = await prisma.village.updateMany({
        where: {
            population: { not: null },
            AND: [
                { populationMale: null },
                { populationFemale: null }
            ]
        },
        data: {
            population: null
        }
    });

    console.log(`✅ ล้างข้อมูลสำเร็จ: ${result.count} หมู่บ้าน\n`);

    // ตรวจสอบผลลัพธ์
    const afterCheck = await prisma.village.findMany({
        where: {
            population: { not: null },
            AND: [
                { populationMale: null },
                { populationFemale: null }
            ]
        }
    });

    if (afterCheck.length === 0) {
        console.log('✅ ยืนยัน: ไม่มีข้อมูลไม่สมบูรณ์เหลืออยู่');
    } else {
        console.log(`⚠️  ยังมีข้อมูลไม่สมบูรณ์เหลืออยู่: ${afterCheck.length} หมู่บ้าน`);
    }

    // สรุปข้อมูลหลังล้าง
    console.log('\n📊 สรุปข้อมูลหลังล้าง:');
    const allVillages = await prisma.village.findMany({
        select: {
            population: true,
            populationMale: true,
            populationFemale: true,
        }
    });

    const withPopulation = allVillages.filter(v => v.population !== null).length;
    const withGender = allVillages.filter(v => v.populationMale !== null || v.populationFemale !== null).length;
    const totalPop = allVillages.reduce((sum, v) => sum + (v.population || 0), 0);

    console.log(`   - หมู่บ้านที่มีประชากรรวม: ${withPopulation} หมู่บ้าน`);
    console.log(`   - หมู่บ้านที่มีข้อมูลชาย/หญิง: ${withGender} หมู่บ้าน`);
    console.log(`   - ประชากรรวมทั้งหมด: ${totalPop.toLocaleString()} คน`);

    await prisma.$disconnect();
    console.log('\n✅ เสร็จสิ้น');
}

clearInconsistentPopulationData().catch(console.error);
