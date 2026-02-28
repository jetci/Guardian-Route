const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Creating sample incidents...\n');
  
  // Get first user (Field Officer)
  const fieldOfficer = await prisma.user.findFirst({
    where: { role: 'FIELD_OFFICER' }
  });
  
  if (!fieldOfficer) {
    console.error('❌ No Field Officer found! Please run seed first.');
    process.exit(1);
  }
  
  // Get some villages
  const villages = await prisma.village.findMany({ take: 5 });
  
  if (villages.length === 0) {
    console.error('❌ No villages found! Please run seed first.');
    process.exit(1);
  }
  
  // Sample incidents data
  const sampleIncidents = [
    {
      title: 'น้ำท่วมหมู่ 1 บ้านหนองตุ้ม',
      description: 'น้ำท่วมขังบริเวณถนนสายหลัก ระดับน้ำประมาณ 30 ซม.',
      disasterType: 'FLOOD',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      location: {
        type: 'Point',
        coordinates: [99.2333, 19.9167] // [lng, lat]
      },
      address: 'หมู่ 1 บ้านหนองตุ้ม ต.เวียง อ.ฝาง จ.เชียงใหม่',
      villageId: villages[0]?.id,
      reportedAt: new Date(),
    },
    {
      title: 'ไฟป่าบริเวณหมู่ 3',
      description: 'พบจุดไฟป่าบริเวณภูเขาด้านทิศเหนือของหมู่บ้าน',
      disasterType: 'FIRE',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      location: {
        type: 'Point',
        coordinates: [99.2400, 19.9200]
      },
      address: 'หมู่ 3 บ้านหนองอึ่ง ต.เวียง อ.ฝาง จ.เชียงใหม่',
      villageId: villages[2]?.id,
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      title: 'ดินถลมหมู่ 5',
      description: 'ดินถลมปิดกั้นถนนเข้าหมู่บ้าน กว้างประมาณ 10 เมตร',
      disasterType: 'LANDSLIDE',
      priority: 'MEDIUM',
      status: 'PENDING',
      location: {
        type: 'Point',
        coordinates: [99.2280, 19.9150]
      },
      address: 'หมู่ 5 บ้านต้นหนุน ต.เวียง อ.ฝาง จ.เชียงใหม่',
      villageId: villages[4]?.id,
      reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      title: 'วาตภัยหมู่ 7',
      description: 'ลมแรงพัดหลังคาบ้านเสียหาย 3 หลังคาเรือน',
      disasterType: 'STORM',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      location: {
        type: 'Point',
        coordinates: [99.2350, 19.9180]
      },
      address: 'หมู่ 7 บ้านแม่ใจใต้ ต.เวียง อ.ฝาง จ.เชียงใหม่',
      villageId: villages[1]?.id,
      reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    },
    {
      title: 'ภัยแล้งหมู่ 10',
      description: 'แหล่งน้ำแห้งขอด ประชาชนขาดแคลนน้ำใช้',
      disasterType: 'DROUGHT',
      priority: 'MEDIUM',
      status: 'PENDING',
      location: {
        type: 'Point',
        coordinates: [99.2320, 19.9140]
      },
      address: 'หมู่ 10 บ้านสันป่ายาง ต.เวียง อ.ฝาง จ.เชียงใหม่',
      villageId: villages[3]?.id,
      reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
  ];
  
  // Create incidents
  for (const incidentData of sampleIncidents) {
    const incident = await prisma.incident.create({
      data: {
        ...incidentData,
        createdById: fieldOfficer.id,
      }
    });
    console.log(`  ✅ Created: ${incident.title}`);
  }
  
  console.log(`\n✅ Created ${sampleIncidents.length} sample incidents!`);
  console.log('\n📍 Now you can view them on the map at:');
  console.log('   http://localhost:5173/field-officer/map-incidents');
}

main()
  .catch(e => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
