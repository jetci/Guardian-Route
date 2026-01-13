import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedFieldOfficerData() {
  console.log('🌱 Seeding Field Officer test data...\n');

  // Get or create Field Officer
  let fieldOfficer = await prisma.user.findFirst({
    where: { role: Role.FIELD_OFFICER }
  });

  if (!fieldOfficer) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    fieldOfficer = await prisma.user.create({
      data: {
        email: 'field@obtwiang.go.th',
        password: hashedPassword,
        username: 'field_officer_1',
        fullName: 'Somsri Field',
        firstName: 'Somsri',
        lastName: 'Field',
        role: Role.FIELD_OFFICER,
        department: 'Field Operations',
        phone: '081-234-5678',
        isActive: true
      }
    });
    console.log('✅ Created Field Officer user');
  } else {
    console.log('✅ Field Officer user already exists');
  }

  // Get Supervisor
  const supervisor = await prisma.user.findFirst({
    where: { role: Role.SUPERVISOR }
  });

  // Get Villages
  const villages = await prisma.village.findMany({ take: 5 });

  if (villages.length === 0) {
    console.log('⚠️  No villages found. Please run main seed first.');
    return;
  }

  console.log(`📍 Found ${villages.length} villages\n`);

  /*
  // Create 5 test incidents
  console.log('📝 Creating test incidents...');
  const incidents: any[] = [];
  const disasterTypes = ['FLOOD', 'LANDSLIDE', 'FIRE', 'STORM', 'EARTHQUAKE'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const statuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED'];

  const disasterTypeThai: Record<string, string> = {
    'FLOOD': 'น้ำท่วม',
    'LANDSLIDE': 'ดินถล่ม',
    'FIRE': 'ไฟไหม้',
    'STORM': 'พายุ',
    'EARTHQUAKE': 'แผ่นดินไหว'
  };

  for (let i = 0; i < 5; i++) {
    const village = villages[i % villages.length];
    const disasterType = disasterTypes[i] as any;
    
    const incident = await prisma.incident.create({
      data: {
        title: `${disasterTypeThai[disasterType]} - ${village.name}`,
        description: `เหตุการณ์${disasterTypeThai[disasterType]}ที่${village.name} หมู่ ${village.villageNo} ต้องการความช่วยเหลือเร่งด่วน`,
        disasterType,
        priority: priorities[i % priorities.length] as any,
        status: statuses[i % statuses.length] as any,
        location: {
          type: 'Point',
          coordinates: [
            99.2333 + (Math.random() - 0.5) * 0.1,
            19.9167 + (Math.random() - 0.5) * 0.1
          ]
        },
        address: `${village.name} หมู่ ${village.villageNo} ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่`,
        villageId: village.id,
        createdById: fieldOfficer.id,
        assignedToId: i % 2 === 0 ? fieldOfficer.id : null,
        assignedAt: i % 2 === 0 ? new Date() : null,
        images: []
      }
    });
    incidents.push(incident);
  }

  console.log(`✅ Created ${incidents.length} incidents\n`);

  // Create 10 test tasks
  console.log('📋 Creating test tasks...');
  const tasks: any[] = [];
  const taskStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];
  const taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT']; // TaskPriority enum

  for (let i = 0; i < 10; i++) {
    const incident = incidents[i % incidents.length];
    const village = villages[i % villages.length];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (i % 7) + 1);

    const task = await prisma.task.create({
      data: {
        title: `สำรวจพื้นที่ - ${village.name}`,
        description: `สำรวจความเสียหายและจำนวนครัวเรือนที่ได้รับผลกระทบจาก${disasterTypeThai[incident.disasterType]}`,
        priority: taskPriorities[i % taskPriorities.length] as any,
        status: taskStatuses[i % taskStatuses.length] as any,
        dueDate,
        incidentId: incident.id,
        villageId: village.id,
        assignedToId: fieldOfficer.id,
        createdById: supervisor?.id || fieldOfficer.id,
        completedAt: i % 3 === 0 ? new Date() : null,
        surveyedAt: i % 3 === 0 ? new Date() : null,
        surveyNotes: i % 3 === 0 ? `สำรวจเสร็จสิ้น พบความเสียหาย ${10 + i * 5} ครัวเรือน` : null
      }
    });
    tasks.push(task);
  }

  console.log(`✅ Created ${tasks.length} tasks\n`);

  // Create 8 test field surveys
  console.log('📝 Creating test field surveys...');
  const surveys: any[] = [];
  
  for (let i = 0; i < 8; i++) {
    const task = tasks[i];
    const village = villages[i % villages.length];
    const incident = incidents[i % incidents.length];

    const survey = await (prisma as any).fieldSurvey.create({
      data: {
        fieldOfficerId: fieldOfficer.id,
        taskId: task.id,
        incidentId: task.incidentId,
        villageId: village.id,
        villageName: village.name,
        disasterType: disasterTypeThai[incident.disasterType],
        severity: (i % 5) + 1,
        estimatedHouseholds: 10 + i * 5,
        notes: `สำรวจพื้นที่${village.name} พบความเสียหาย ${10 + i * 5} ครัวเรือน ระดับความรุนแรง ${(i % 5) + 1}/5\n\nรายละเอียด:\n- สภาพพื้นที่: ${i % 2 === 0 ? 'น้ำท่วมขัง' : 'แห้ง'}\n- ความเสียหายต่อบ้านเรือน: ${i % 3 === 0 ? 'สูง' : 'ปานกลาง'}\n- ต้องการความช่วยเหลือ: ${i % 2 === 0 ? 'เร่งด่วน' : 'ปกติ'}`,
        gpsLocation: {
          lat: 19.9167 + (Math.random() - 0.5) * 0.05,
          lng: 99.2333 + (Math.random() - 0.5) * 0.05,
          accuracy: 10 + Math.random() * 20,
          altitude: 300 + Math.random() * 100
        },
        polygon: i % 2 === 0 ? {
          type: 'Polygon',
          coordinates: [[
            [99.2333, 19.9167],
            [99.2343, 19.9167],
            [99.2343, 19.9157],
            [99.2333, 19.9157],
            [99.2333, 19.9167]
          ]]
        } : null,
        areaSize: i % 2 === 0 ? 0.5 + Math.random() * 2 : null,
        photoUrls: [],
        additionalData: {
          weather: i % 3 === 0 ? 'ฝนตก' : (i % 3 === 1 ? 'แจ่มใส' : 'มีเมฆบางส่วน'),
          temperature: `${25 + Math.floor(Math.random() * 10)}°C`,
          accessibility: i % 2 === 0 ? 'เข้าถึงได้ง่าย' : 'เข้าถึงยาก',
          waterLevel: i % 3 === 0 ? `${30 + Math.floor(Math.random() * 50)} ซม.` : null,
          roadCondition: i % 2 === 0 ? 'ปกติ' : 'เสียหาย'
        },
        status: i % 4 === 0 ? 'APPROVED' : (i % 4 === 1 ? 'REVIEWED' : 'SUBMITTED')
      }
    });
    surveys.push(survey);
  }

  console.log(`✅ Created ${surveys.length} field surveys\n`);

  // Summary
  console.log('='.repeat(60));
  console.log('📊 Seed Summary:');
  console.log('='.repeat(60));
  console.log(`   Field Officer: ${fieldOfficer.email}`);
  console.log(`   Incidents: ${incidents.length}`);
  console.log(`   Tasks: ${tasks.length}`);
  console.log(`   Field Surveys: ${surveys.length}`);
  console.log('='.repeat(60));
  console.log('\n✅ Field Officer test data seeded successfully!\n');
  */
  console.log('⚠️ Mock data generation is disabled.');
}

seedFieldOfficerData()
  .catch((error) => {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
