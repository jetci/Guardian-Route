import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearHouseholdsData() {
    console.log('🧹 กำลังล้างข้อมูลครัวเรือนที่เป็นข้อมูลเท็จ...\n');

    // ค้นหาหมู่บ้านที่มีข้อมูลครัวเรือน
    const villagesWithHouseholds = await prisma.village.findMany({
        where: {
            households: { not: null }
        },
        select: {
            id: true,
            villageNo: true,
            name: true,
            households: true,
        },
        orderBy: { villageNo: 'asc' }
    });

    console.log(`พบหมู่บ้านที่มีข้อมูลครัวเรือน: ${villagesWithHouseholds.length} หมู่บ้าน\n`);

    if (villagesWithHouseholds.length === 0) {
        console.log('✅ ไม่พบข้อมูลครัวเรือนที่ต้องล้าง');
        await prisma.$disconnect();
        return;
    }

    // แสดงรายการที่จะลบ
    console.log('📋 รายการที่จะล้างข้อมูล:');
    console.log('─'.repeat(60));
    console.log('หมู่ที่ | ชื่อหมู่บ้าน | ครัวเรือน (จะถูกลบ)');
    console.log('─'.repeat(60));

    villagesWithHouseholds.forEach(v => {
        console.log(
            `${String(v.villageNo).padEnd(6)} | ` +
            `${v.name.padEnd(30)} | ` +
            `${v.households} ครัวเรือน`
        );
    });
    console.log('─'.repeat(60));

    const totalHouseholds = villagesWithHouseholds.reduce((sum, v) => sum + (v.households || 0), 0);
    console.log(`\nครัวเรือนรวมที่จะถูกลบ: ${totalHouseholds.toLocaleString()} ครัวเรือน\n`);

    // ยืนยันการดำเนินการ
    console.log('⚠️  กำลังดำเนินการล้างข้อมูล...');
    console.log('   - ตั้งค่า households = NULL');
    console.log('   - เก็บข้อมูลอื่นๆ ไว้\n');

    // ล้างข้อมูล
    const result = await prisma.village.updateMany({
        where: {
            households: { not: null }
        },
        data: {
            households: null
        }
    });

    console.log(`✅ ล้างข้อมูลสำเร็จ: ${result.count} หมู่บ้าน\n`);

    // ตรวจสอบผลลัพธ์
    const afterCheck = await prisma.village.findMany({
        where: {
            households: { not: null }
        }
    });

    if (afterCheck.length === 0) {
        console.log('✅ ยืนยัน: ไม่มีข้อมูลครัวเรือนเหลืออยู่');
    } else {
        console.log(`⚠️  ยังมีข้อมูลครัวเรือนเหลืออยู่: ${afterCheck.length} หมู่บ้าน`);
    }

    // สรุปข้อมูลหลังล้าง
    console.log('\n📊 สรุปข้อมูลหลังล้าง:');
    const allVillages = await prisma.village.findMany({
        select: {
            population: true,
            populationMale: true,
            populationFemale: true,
            households: true,
        }
    });

    const withPopulation = allVillages.filter(v => v.population !== null).length;
    const withGender = allVillages.filter(v => v.populationMale !== null || v.populationFemale !== null).length;
    const withHouseholds = allVillages.filter(v => v.households !== null).length;

    console.log(`   - หมู่บ้านที่มีประชากรรวม: ${withPopulation} หมู่บ้าน`);
    console.log(`   - หมู่บ้านที่มีข้อมูลชาย/หญิง: ${withGender} หมู่บ้าน`);
    console.log(`   - หมู่บ้านที่มีข้อมูลครัวเรือน: ${withHouseholds} หมู่บ้าน`);

    await prisma.$disconnect();
    console.log('\n✅ เสร็จสิ้น');
}

clearHouseholdsData().catch(console.error);
