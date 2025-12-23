# 📘 คู่มือการแก้ไขปัญหา Field Officer Module

**เอกสารอ้างอิง:** FIELD_OFFICER_FIX_PLAN.md  
**วันที่:** 23 ธันวาคม 2568  
**เวอร์ชัน:** 1.0

---

## 🎯 วัตถุประสงค์

เอกสารนี้เป็นคู่มือการแก้ไขปัญหาทั้ง 10 รายการที่พบในระบบ Field Officer พร้อม code examples และ best practices

---

## 📋 สารบัญ

1. [Issue #1: FieldSurvey Table](#issue-1)
2. [Issue #2: Thai Encoding](#issue-2)
3. [Issue #3: Test Data](#issue-3)
4. [Issue #4: Validation](#issue-4)
5. [Issue #5: GPS Handling](#issue-5)
6. [Issue #6: Upload Endpoint](#issue-6)
7. [Issue #7: Map Race Condition](#issue-7)
8. [Issue #8: Status Labels](#issue-8)
9. [Issue #9: Drawing Tools](#issue-9)
10. [Issue #10: Form Validation](#issue-10)

---

<a name="issue-1"></a>
## 🔴 Issue #1: สร้าง FieldSurvey Table

### ปัญหา
Survey data ถูกเก็บใน Report table ทำให้ data model สับสนและยากต่อการ maintain

### วิธีแก้ไข

#### 1. เพิ่ม Model ใน Prisma Schema

```prisma
// backend/prisma/schema.prisma

model FieldSurvey {
  id                  String       @id @default(uuid())
  fieldOfficerId      String       @map("field_officer_id")
  taskId              String?      @map("task_id")
  incidentId          String?      @map("incident_id")
  villageId           String?      @map("village_id")
  villageName         String       @map("village_name")
  disasterType        String       @map("disaster_type")
  severity            Int          // 1-5
  estimatedHouseholds Int          @map("estimated_households")
  notes               String       @db.Text
  gpsLocation         Json         @map("gps_location")
  polygon             Json?
  areaSize            Decimal?     @map("area_size") @db.Decimal(10, 4)
  photoUrls           String[]     @default([]) @map("photo_urls")
  additionalData      Json?        @map("additional_data")
  submittedAt         DateTime     @default(now()) @map("submitted_at")
  updatedAt           DateTime     @updatedAt @map("updated_at")
  status              SurveyStatus @default(SUBMITTED)
  
  fieldOfficer User      @relation("FieldSurveys", fields: [fieldOfficerId], references: [id])
  task         Task?     @relation(fields: [taskId], references: [id])
  incident     Incident? @relation(fields: [incidentId], references: [id])
  village      Village?  @relation(fields: [villageId], references: [id])
  
  @@index([fieldOfficerId])
  @@index([taskId])
  @@index([incidentId])
  @@index([villageId])
  @@index([submittedAt])
  @@index([status])
  @@map("field_surveys")
}

enum SurveyStatus {
  DRAFT
  SUBMITTED
  REVIEWED
  APPROVED
  REJECTED
}
```

#### 2. สร้าง Migration

```bash
cd backend
npx prisma migrate dev --name add_field_survey_table
npx prisma generate
```

#### 3. อัพเดท Service

```typescript
// backend/src/survey/field-officer-survey.service.ts

@Injectable()
export class FieldOfficerSurveyService {
  constructor(private prisma: PrismaService) {}

  async submitFieldSurvey(
    fieldOfficerId: string,
    surveyDto: FieldOfficerSurveyDto
  ): Promise<FieldOfficerSurveyResponseDto> {
    // Validate village if provided
    if (surveyDto.villageId) {
      const village = await this.prisma.village.findUnique({
        where: { id: surveyDto.villageId }
      });
      if (!village) {
        throw new BadRequestException('Village not found');
      }
    }

    // Create field survey
    const fieldSurvey = await this.prisma.fieldSurvey.create({
      data: {
        fieldOfficerId,
        taskId: surveyDto.taskId,
        incidentId: surveyDto.incidentId,
        villageId: surveyDto.villageId,
        villageName: surveyDto.villageName,
        disasterType: surveyDto.disasterType,
        severity: surveyDto.severity,
        estimatedHouseholds: surveyDto.estimatedHouseholds,
        notes: surveyDto.notes,
        gpsLocation: surveyDto.gpsLocation,
        polygon: surveyDto.polygon,
        areaSize: surveyDto.areaSize,
        photoUrls: surveyDto.photoUrls || [],
        additionalData: surveyDto.additionalData || {},
        status: 'SUBMITTED'
      },
      include: {
        fieldOfficer: { select: { id: true, firstName: true, lastName: true } },
        village: true,
        task: true,
        incident: true
      }
    });

    // Update task if provided
    if (surveyDto.taskId) {
      await this.prisma.task.update({
        where: { id: surveyDto.taskId },
        data: { status: 'IN_PROGRESS', surveyedAt: new Date() }
      });
    }

    return this.mapToResponseDto(fieldSurvey);
  }
}
```

### ✅ Checklist
- [ ] Schema updated
- [ ] Migration created
- [ ] Service updated
- [ ] Tests passing
- [ ] Data migrated

---

<a name="issue-2"></a>
## 🔴 Issue #2: แก้ไข Thai Encoding

### ปัญหา
ภาษาไทยแสดงเป็น `???` ใน API responses

### วิธีแก้ไข

#### 1. Database Configuration

```sql
-- Check encoding
SHOW SERVER_ENCODING;
SHOW CLIENT_ENCODING;

-- Set to UTF8
ALTER DATABASE guardian_route SET client_encoding TO 'UTF8';
```

#### 2. Backend Configuration

```typescript
// backend/src/main.ts

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // UTF-8 middleware
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true
  });

  await app.listen(3001);
}
```

```typescript
// backend/src/database/prisma.service.ts

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    await this.$executeRawUnsafe(`SET CLIENT_ENCODING TO 'UTF8';`);
    console.log('✅ Database connected with UTF-8');
  }
}
```

#### 3. Frontend Configuration

```typescript
// frontend/src/api/client.ts

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Accept': 'application/json; charset=utf-8'
  }
});
```

#### 4. PowerShell Script

```powershell
# test-thai.ps1
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

$body = @{
    villageName = "บ้านหนองตุ้ม"
    notes = "ทดสอบภาษาไทย"
} | ConvertTo-Json

Invoke-RestMethod -Uri $url -Method Post -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
```

### ✅ Checklist
- [ ] Database UTF-8
- [ ] Backend headers set
- [ ] Frontend configured
- [ ] PowerShell working
- [ ] Tests passing

---

<a name="issue-3"></a>
## 🟡 Issue #3: สร้าง Test Data

### ปัญหา
ไม่มีข้อมูลทดสอบสำหรับ Field Officer

### วิธีแก้ไข

```typescript
// backend/prisma/seed-field-officer-data.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedFieldOfficerData() {
  console.log('🌱 Seeding Field Officer data...');

  // Get Field Officer
  const fieldOfficer = await prisma.user.findFirst({
    where: { role: 'FIELD_OFFICER' }
  });

  const villages = await prisma.village.findMany({ take: 5 });

  // Create 5 incidents
  const incidents = [];
  for (let i = 0; i < 5; i++) {
    const incident = await prisma.incident.create({
      data: {
        title: `น้ำท่วม - ${villages[i].name}`,
        description: `เหตุการณ์น้ำท่วมที่${villages[i].name}`,
        disasterType: 'FLOOD',
        priority: 'HIGH',
        status: 'PENDING',
        location: { type: 'Point', coordinates: [99.23, 19.92] },
        villageId: villages[i].id,
        createdById: fieldOfficer.id
      }
    });
    incidents.push(incident);
  }

  // Create 10 tasks
  for (let i = 0; i < 10; i++) {
    await prisma.task.create({
      data: {
        title: `สำรวจพื้นที่ - ${villages[i % 5].name}`,
        description: 'สำรวจความเสียหาย',
        priority: 'HIGH',
        status: 'PENDING',
        incidentId: incidents[i % 5].id,
        assignedToId: fieldOfficer.id,
        createdById: fieldOfficer.id,
        dueDate: new Date(Date.now() + 86400000)
      }
    });
  }

  console.log('✅ Seeding complete');
}

seedFieldOfficerData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```bash
# Run seeder
npm run seed:field-officer
```

---

<a name="issue-4"></a>
## 🟡 Issue #4: แก้ไข Validation

### ปัญหา
villageId เป็น required แต่บางครั้งอาจไม่ทราบหมู่บ้าน

### วิธีแก้ไข

```typescript
// backend/src/survey/dto/field-officer-survey.dto.ts

export class FieldOfficerSurveyDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional() // ✅ Changed from @IsNotEmpty()
  villageId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty() // ✅ Always required
  villageName: string;
}
```

```typescript
// Service auto-match
if (!surveyDto.villageId && surveyDto.villageName) {
  const village = await this.prisma.village.findFirst({
    where: {
      OR: [
        { name: surveyDto.villageName },
        { alternateNames: { has: surveyDto.villageName } }
      ]
    }
  });
  if (village) {
    surveyDto.villageId = village.id;
  }
}
```

---

<a name="issue-5"></a>
## 🟡 Issue #5: GPS Error Handling

### ปัญหา
ไม่มี fallback เมื่อ GPS ไม่ทำงาน

### วิธีแก้ไข

```typescript
// frontend/src/hooks/useGPS.ts

export function useGPS(options = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('เบราว์เซอร์ไม่รองรับ GPS');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        });
        setLoading(false);
        toast.success('📍 ได้รับตำแหน่ง GPS แล้ว');
      },
      (err) => {
        let message = '';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            message = 'กรุณาอนุญาตการเข้าถึงตำแหน่ง';
            break;
          case err.POSITION_UNAVAILABLE:
            message = 'ไม่สามารถรับสัญญาณ GPS ได้';
            break;
          case err.TIMEOUT:
            message = 'หมดเวลารอสัญญาณ GPS';
            break;
        }
        setError({ code: err.code, message });
        setLoading(false);
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  return { position, error, loading, getCurrentPosition };
}
```

---

<a name="issue-6"></a>
## 🟡 Issue #6: Upload Endpoint

### ปัญหา
ไม่มี endpoint สำหรับ upload survey images

### วิธีแก้ไข

```typescript
// backend/src/upload/upload.controller.ts

@Post('survey-images')
@UseInterceptors(FilesInterceptor('images', 10, {
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only images allowed'), false);
    }
    cb(null, true);
  }
}))
async uploadSurveyImages(
  @UploadedFiles() files: Express.Multer.File[],
  @CurrentUser() user: any
) {
  const urls = await this.uploadService.uploadMultiple(files, 'surveys');
  return { urls };
}
```

---

<a name="issue-7"></a>
## 🟢 Issue #7: Map Race Condition

### ปัญหา
ใช้ setTimeout ทำให้เกิด race condition

### วิธีแก้ไข

```typescript
// แทนที่ setTimeout
setTimeout(() => {
  map.pm.Toolbar.setButtonDisabled('drawPolygon', true);
}, 100);

// ใช้ Geoman events
map.on('pm:globalremovalmodetoggled', (e) => {
  console.log('Removal mode:', e.enabled);
});

map.on('pm:drawstart', (e) => {
  console.log('Drawing started:', e.shape);
});
```

---

<a name="issue-8"></a>
## 🟢 Issue #8: Status Labels

### ปัญหา
Status labels ไม่สอดคล้องกัน

### วิธีแก้ไข

```typescript
// Standardize status enum
enum SurveyStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEWED = 'REVIEWED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

// Status mapping
const STATUS_LABELS = {
  DRAFT: 'แบบร่าง',
  SUBMITTED: 'ส่งแล้ว',
  IN_PROGRESS: 'กำลังดำเนินการ',
  REVIEWED: 'ตรวจสอบแล้ว',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ปฏิเสธ'
};

const STATUS_COLORS = {
  DRAFT: 'gray',
  SUBMITTED: 'blue',
  IN_PROGRESS: 'orange',
  REVIEWED: 'purple',
  APPROVED: 'green',
  REJECTED: 'red'
};
```

---

<a name="issue-9"></a>
## 🟢 Issue #9: Drawing Tools

### ปัญหา
Drawing tools ถูก disable โดย default

### วิธีแก้ไข

```typescript
// Enable tools by default
map.pm.addControls({
  position: 'topleft',
  drawPolygon: true,  // ✅ Enable
  drawRectangle: true, // ✅ Enable
  editMode: true,      // ✅ Enable
  removalMode: true    // ✅ Enable
});

// Add instructions
<div className="map-instructions">
  <h4>📍 วิธีใช้งาน:</h4>
  <ol>
    <li>คลิกปุ่ม Polygon เพื่อวาดพื้นที่</li>
    <li>คลิกบนแผนที่เพื่อสร้างจุด</li>
    <li>คลิกจุดแรกอีกครั้งเพื่อปิดรูป</li>
    <li>ใช้ปุ่ม Edit เพื่อแก้ไข</li>
  </ol>
</div>
```

---

<a name="issue-10"></a>
## 🟢 Issue #10: Form Validation

### ปัญหา
ไม่มี validation ก่อน submit

### วิธีแก้ไข

```typescript
const validateForm = (): boolean => {
  const errors: string[] = [];

  if (!selectedVillage && !formData.village) {
    errors.push('กรุณาเลือกหมู่บ้าน');
  }

  if (!formData.disasterType) {
    errors.push('กรุณาเลือกประเภทภัย');
  }

  if (!formData.severity || formData.severity < 1 || formData.severity > 5) {
    errors.push('กรุณาระบุระดับความรุนแรง 1-5');
  }

  if (!currentLocation && !drawnArea) {
    errors.push('กรุณาระบุตำแหน่ง GPS หรือวาดพื้นที่');
  }

  if (formData.estimatedHouseholds < 0) {
    errors.push('จำนวนครัวเรือนต้องไม่ติดลบ');
  }

  if (errors.length > 0) {
    setErrors(errors);
    toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  // Submit form
};
```

---

## 📊 Testing Checklist

### Unit Tests
- [ ] DTO validation tests
- [ ] Service method tests
- [ ] Hook tests

### Integration Tests
- [ ] API endpoint tests
- [ ] Database operations
- [ ] File upload tests

### E2E Tests
- [ ] Complete survey workflow
- [ ] GPS scenarios
- [ ] Form validation
- [ ] Error handling

### Performance Tests
- [ ] API response time
- [ ] Map rendering
- [ ] Image upload speed

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Code review complete
- [ ] Documentation updated
- [ ] Backup database

### Deployment
- [ ] Run migrations
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Run smoke tests

### Post-deployment
- [ ] Monitor logs
- [ ] Check metrics
- [ ] User acceptance testing
- [ ] Rollback plan ready

---

**เวอร์ชัน:** 1.0  
**อัพเดทล่าสุด:** 23 ธันวาคม 2568  
**สถานะ:** ✅ พร้อมใช้งาน
