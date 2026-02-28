const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking population data...\n');
  
  const villages = await prisma.village.findMany({
    orderBy: { villageNo: 'asc' },
    select: {
      villageNo: true,
      name: true,
      households: true,
      population: true,
      populationMale: true,
      populationFemale: true,
      centerPoint: true,
      boundary: true,
    }
  });
  
  console.log(`📊 Total villages: ${villages.length}\n`);
  
  let hasPopulation = 0;
  let hasHouseholds = 0;
  let hasGender = 0;
  let hasCenterPoint = 0;
  let hasBoundary = 0;
  
  console.log('┌────┬──────────────────────┬──────────┬──────────┬──────┬──────┬────────┬────────┐');
  console.log('│ หมู่│ ชื่อหมู่บ้าน         │ ครัวเรือน│ ประชากร │ ชาย  │ หญิง │ พิกัด  │ ขอบเขต│');
  console.log('├────┼──────────────────────┼──────────┼──────────┼──────┼──────┼────────┼────────┤');
  
  villages.forEach(v => {
    const namePadded = v.name.padEnd(20, ' ');
    const households = v.households?.toString().padStart(8, ' ') || '     N/A';
    const population = v.population?.toString().padStart(8, ' ') || '     N/A';
    const male = v.populationMale?.toString().padStart(4, ' ') || ' N/A';
    const female = v.populationFemale?.toString().padStart(4, ' ') || ' N/A';
    const center = v.centerPoint ? '   ✅' : '   ❌';
    const boundary = v.boundary ? '    ✅' : '    ❌';
    
    if (v.population) hasPopulation++;
    if (v.households) hasHouseholds++;
    if (v.populationMale || v.populationFemale) hasGender++;
    if (v.centerPoint) hasCenterPoint++;
    if (v.boundary) hasBoundary++;
    
    console.log(`│ ${v.villageNo.toString().padStart(2, ' ')} │ ${namePadded} │${households} │${population} │${male} │${female} │${center} │${boundary} │`);
  });
  
  console.log('└────┴──────────────────────┴──────────┴──────────┴──────┴──────┴────────┴────────┘');
  
  console.log('\n📈 Summary:');
  console.log(`  ✅ Villages with population data: ${hasPopulation}/${villages.length}`);
  console.log(`  ✅ Villages with households data: ${hasHouseholds}/${villages.length}`);
  console.log(`  ✅ Villages with gender data: ${hasGender}/${villages.length}`);
  console.log(`  ✅ Villages with center point: ${hasCenterPoint}/${villages.length}`);
  console.log(`  ✅ Villages with boundary: ${hasBoundary}/${villages.length}`);
  
  if (hasPopulation === 0) {
    console.log('\n🔴 CRITICAL: ข้อมูลประชากรหายหมดทั้งหมด!');
    console.log('💡 สาเหตุที่เป็นไปได้:');
    console.log('   1. รัน "npx prisma db seed" ซึ่งจะ overwrite ข้อมูลเดิม');
    console.log('   2. รัน "npx prisma migrate reset" ซึ่งจะลบข้อมูลทั้งหมด');
    console.log('   3. มีการ update ข้อมูลผ่าน seed.ts ที่มี bug');
  }
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
