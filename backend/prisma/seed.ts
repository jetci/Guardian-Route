import { PrismaClient, Role, IncidentStatus, Priority, TaskPriority, TaskStatus, NotificationType, ReportType, ReportStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { villagesWithGeoJSONData } from './villages-with-geojson-seed';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ========================================
  // 1. SEED VILLAGES (20 หมู่บ้าน)
  // ========================================
  console.log('📍 Seeding Villages...');

  for (const villageData of villagesWithGeoJSONData) {
    const village = await prisma.village.upsert({
      where: { villageNo: villageData.villageNo },
      update: {
        // ⚠️ CRITICAL: Only update metadata fields, NEVER user-entered data
        // This prevents data loss when seed runs on existing villages
        // See: CRITICAL-006, CRITICAL-008 resolution reports
        name: villageData.name,
        alternateNames: villageData.alternateNames,
        area: villageData.area,
        description: villageData.description,
        // DO NOT UPDATE: households, population, populationMale, populationFemale
        // DO NOT UPDATE: centerPoint, boundary (user may have corrected these)
      },
      create: {
        villageNo: villageData.villageNo,
        name: villageData.name,
        alternateNames: villageData.alternateNames,
        households: villageData.households,
        population: villageData.population,
        area: villageData.area,
        description: villageData.description,
        centerPoint: villageData.centerPoint,
        boundary: villageData.boundary as any,
      },
    });
    console.log(`  ✅ หมู่ ${village.villageNo}: ${village.name} (📍 ${villageData.centerPoint ? 'มีพิกัด' : 'ไม่มีพิกัด'})`);
  }

  console.log(`\n✅ Created ${villagesWithGeoJSONData.length} villages with GeoJSON data\n`);

  // ========================================
  // 2. SEED USERS (4 roles)
  // ========================================
  console.log('👥 Seeding Users...');

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@obtwiang.go.th' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Admin System',
      firstName: 'Admin',
      lastName: 'System',
      phone: '081-234-5678',
      role: Role.ADMIN,
    },
  });

  console.log('  ✅ Created Admin:', admin.email);

  // Create Executive
  const executive = await prisma.user.upsert({
    where: { email: 'executive@obtwiang.go.th' },
    update: {},
    create: {
      username: 'executive',
      email: 'executive@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Somkid Executive',
      firstName: 'Somkid',
      lastName: 'Executive',
      phone: '081-234-5681',
      role: Role.EXECUTIVE,
    },
  });

  console.log('  ✅ Created Executive:', executive.email);

  // Create Supervisor
  const supervisor = await prisma.user.upsert({
    where: { email: 'supervisor@obtwiang.go.th' },
    update: {},
    create: {
      username: 'supervisor',
      email: 'supervisor@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Somchai Supervisor',
      firstName: 'Somchai',
      lastName: 'Supervisor',
      phone: '081-234-5679',
      role: Role.SUPERVISOR,
    },
  });

  console.log('  ✅ Created Supervisor:', supervisor.email);

  // Create Field Officer
  const fieldOfficer = await prisma.user.upsert({
    where: { email: 'field@obtwiang.go.th' },
    update: {},
    create: {
      username: 'field',
      email: 'field@obtwiang.go.th',
      password: hashedPassword,
      fullName: 'Somsri Field',
      firstName: 'Somsri',
      lastName: 'Field',
      phone: '081-234-5680',
      role: Role.FIELD_OFFICER,
    },
  });

  console.log('  ✅ Created Field Officer:', fieldOfficer.email);

  // Create Developer
  const developer = await prisma.user.upsert({
    where: { email: 'jetci.jm@gmail.com' },
    update: {},
    create: {
      username: 'jetci',
      email: 'jetci.jm@gmail.com',
      password: await bcrypt.hash('g0KEk,^],k;yo', 10),
      fullName: 'Jetci Developer',
      firstName: 'Jetci',
      lastName: 'Developer',
      phone: '081-234-9999',
      role: Role.DEVELOPER,
    },
  });

  console.log('  ✅ Created Developer:', developer.email);

  // ========================================
  // 3. SEED INCIDENTS, TASKS, NOTIFICATIONS, REPORTS (RBAC test data)
  // ========================================
  console.log('\n🧪 Seeding RBAC test data: Incidents, Tasks, Notifications, Reports...');

  // Fetch a few villages for linking
  const villages = await prisma.village.findMany({ take: 5 });
  if (villages.length === 0) {
    console.warn('⚠️ No villages found. Skipping incidents/tasks seeding.');
  } else {
    const incidents: any[] = [];

    // Create 5 incidents across villages
    const incidentStatuses: IncidentStatus[] = [IncidentStatus.PENDING, IncidentStatus.IN_PROGRESS, IncidentStatus.RESOLVED];
    const priorities: Priority[] = [Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL];

    for (let i = 0; i < Math.min(5, villages.length); i++) {
      const village = villages[i];
      const status = incidentStatuses[i % incidentStatuses.length];
      const priority = priorities[i % priorities.length];

      const incident = await prisma.incident.create({
        data: {
          title: `เหตุการณ์น้ำท่วม - ${village.name}`,
          description: `รายงานเหตุการณ์น้ำท่วมที่หมู่ ${village.villageNo} (${village.name}) ต้องการการสำรวจพื้นที่`.
            slice(0),
          disasterType: 'FLOOD' as any,
          priority,
          status,
          location: { type: 'Point', coordinates: [99.2333 + (Math.random() - 0.5) * 0.02, 19.9167 + (Math.random() - 0.5) * 0.02] } as any,
          address: `${village.name} หมู่ ${village.villageNo} ต.เวียง อ.ฝาง จ.เชียงใหม่`,
          villageId: village.id,
          createdById: fieldOfficer.id,
          assignedToId: status === IncidentStatus.IN_PROGRESS ? fieldOfficer.id : null,
          assignedAt: status === IncidentStatus.IN_PROGRESS ? new Date() : null,
          images: [],
        },
      });
      incidents.push(incident);
    }

    console.log(`  ✅ Created ${incidents.length} incidents`);

    // Create tasks for each incident
    const tasksAll: any[] = [];
    const taskStatuses: TaskStatus[] = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS];
    const taskPriorities: TaskPriority[] = [TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH];

    for (const incident of incidents) {
      // Two tasks per incident
      for (let j = 0; j < 2; j++) {
        const village = villages[j % villages.length];
        const dueDate = new Date(Date.now() + (j + 1) * 24 * 60 * 60 * 1000);
        const status = taskStatuses[(j + 1) % taskStatuses.length];
        const priority = taskPriorities[(j + 1) % taskPriorities.length];

        const task = await prisma.task.create({
          data: {
            title: `สำรวจพื้นที่ - ${village.name} (เหตุการณ์: ${incident.title})`,
            description: 'สำรวจความเสียหายและเก็บข้อมูลครัวเรือนที่ได้รับผลกระทบ',
            priority,
            status,
            dueDate,
            incidentId: incident.id,
            villageId: village.id,
            assignedToId: fieldOfficer.id,
            createdById: supervisor.id,
          },
        });
        tasksAll.push(task);

        // Notification: Task assigned to Field Officer
        const notification = await prisma.notification.create({
          data: {
            title: `ได้รับมอบหมายงาน: ${task.title}`,
            message: `คุณได้รับมอบหมายงานสำรวจพื้นที่สำหรับเหตุการณ์ ${incident.title}`,
            type: NotificationType.TASK_ASSIGNED,
            data: { taskId: task.id, incidentId: incident.id },
          },
        });
        await prisma.userNotification.create({
          data: {
            userId: fieldOfficer.id,
            notificationId: notification.id,
          },
        });
      }
    }

    console.log(`  ✅ Created ${tasksAll.length} tasks`);

    // Create sample reports linked to incidents and tasks
    const reportsCreated: any[] = [];
    for (const incident of incidents.slice(0, 3)) {
      const relatedTasks = tasksAll.filter((t) => t.incidentId === incident.id).map((t) => t.id);
      const report = await prisma.report.create({
        data: {
          type: ReportType.INCIDENT_SUMMARY,
          status: ReportStatus.SUBMITTED,
          title: `สรุปเหตุการณ์ - ${incident.title}`,
          summary: `สรุปภาพรวมเหตุการณ์และแผนสำรวจสำหรับ ${incident.title}`,
          details: {
            notes: 'รายงานสำหรับการทดสอบ RBAC และการแสดงผลรายงาน',
            totalTasks: relatedTasks.length,
          } as any,
          incidentId: incident.id,
          authorId: supervisor.id,
          taskIds: relatedTasks,
          photoUrls: [],
        },
      });
      reportsCreated.push(report);
    }

    console.log(`  ✅ Created ${reportsCreated.length} reports`);
  }

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n✅ Seed completed!\n');

  console.log('📊 Summary:');
  console.log(`  • Villages: ${villagesWithGeoJSONData.length}`);
  console.log(`  • Users: 4`);

  console.log('\n📝 Test Users:');
  console.log('┌──────────────────────────────┬─────────────┬───────────────┐');
  console.log('│ Email                        │ Password    │ Role          │');
  console.log('├──────────────────────────────┼─────────────┼───────────────┤');
  console.log('│ admin@obtwiang.go.th         │ password123 │ ADMIN         │');
  console.log('│ executive@obtwiang.go.th     │ password123 │ EXECUTIVE     │');
  console.log('│ supervisor@obtwiang.go.th    │ password123 │ SUPERVISOR    │');
  console.log('│ field@obtwiang.go.th         │ password123   │ FIELD_OFFICER │');
  console.log('│ jetci.jm@gmail.com           │ g0KEk,^],k;yo │ DEVELOPER     │');
  console.log('└──────────────────────────────┴───────────────┴───────────────┘');

  console.log('\n🏘️  Villages (20 หมู่บ้าน):');
  console.log('┌────┬──────────────────────┬──────────┬──────────┐');
  console.log('│ หมู่│ ชื่อหมู่บ้าน         │ ครัวเรือน│ ประชากร │');
  console.log('├────┼──────────────────────┼──────────┼──────────┤');
  villagesWithGeoJSONData.forEach((v) => {
    const namePadded = v.name.padEnd(20, ' ');
    const householdsPadded = v.households.toString().padStart(8, ' ');
    const populationPadded = v.population.toString().padStart(8, ' ');
    console.log(`│ ${v.villageNo.toString().padStart(2, ' ')} │ ${namePadded} │${householdsPadded} │${populationPadded} │`);
  });
  console.log('└────┴──────────────────────┴──────────┴──────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
