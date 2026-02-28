# 🔍 Create Incident Module - Deep Inspection Report

**วันที่ตรวจสอบ:** 23 ธันวาคม 2568  
**เวลา:** 10:15 น.  
**ผู้ตรวจสอบ:** Cascade AI

---

## 📋 สารบัญ

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Backend Analysis](#backend-analysis)
4. [Frontend Analysis](#frontend-analysis)
5. [Issues Found](#issues-found)
6. [Recommendations](#recommendations)

---

## 1. Executive Summary

### ✅ สิ่งที่ทำงานได้ดี

- ✅ Backend API structure ดี (Controller, Service, DTO)
- ✅ Photo upload service มี permission checking
- ✅ Validation ครบถ้วนใน DTO
- ✅ Rate limiting (10 requests/minute)
- ✅ Authentication & Authorization

### ⚠️ ปัญหาที่พบ

- ❌ **ไม่มี Form Validation** ใน Frontend
- ❌ **Polygon ไม่ถูกส่งไป Backend**
- ❌ **Photo Upload ไม่ทำงาน** (upload หลัง incident created)
- ❌ **Thai Encoding** อาจมีปัญหา
- ❌ **Error Handling** ไม่ครบถ้วน
- ⚠️ **Village Selection** ไม่มี validation

### 📊 Overall Score: 6/10

---

## 2. Architecture Overview

### Data Flow

```
User Input (Form)
    ↓
CreateIncidentReportPage.tsx
    ↓
incidentsApi.create()
    ↓
POST /api/incidents
    ↓
IncidentsController.create()
    ↓
IncidentsService.create()
    ↓
Prisma → PostgreSQL
```

### Components Involved

**Backend:**
- `incidents.controller.ts` - API endpoints
- `incidents.service.ts` - Business logic
- `photos.service.ts` - Photo upload
- `create-incident.dto.ts` - Validation

**Frontend:**
- `CreateIncidentReportPage.tsx` - Main form
- `IncidentForm.tsx` - Alternative form
- `PhotoUpload.tsx` - Photo component
- `incidents.ts` - API client

---

## 3. Backend Analysis

### 3.1 Controller (`incidents.controller.ts`)

#### ✅ Strengths

```typescript
@Post()
@Throttle({ default: { limit: 10, ttl: 60000 } })
@ApiOperation({ summary: 'Create a new incident' })
create(
  @Body() createIncidentDto: CreateIncidentDto,
  @CurrentUser() user: any,
) {
  return this.incidentsService.create(createIncidentDto, user.id);
}
```

**Good Points:**
- ✅ Rate limiting implemented
- ✅ JWT authentication required
- ✅ Swagger documentation
- ✅ User ID from token

#### ⚠️ Issues

1. **No Role-Based Access Control**
   ```typescript
   // ❌ Missing @Roles() decorator
   @Post()
   @Throttle({ default: { limit: 10, ttl: 60000 } })
   create(...) { }
   
   // ✅ Should be:
   @Post()
   @Roles('FIELD_OFFICER', 'SUPERVISOR', 'ADMIN')
   @Throttle({ default: { limit: 10, ttl: 60000 } })
   create(...) { }
   ```

2. **No Input Sanitization**
   - Title, description ไม่มี sanitization
   - อาจมี XSS vulnerability

---

### 3.2 Service (`incidents.service.ts`)

#### ✅ Strengths

```typescript
async create(createIncidentDto: CreateIncidentDto, userId: string) {
  return this.prisma.incident.create({
    data: {
      ...createIncidentDto,
      createdById: userId,
    },
    include: {
      createdBy: { select: { ... } },
      village: true,
    },
  });
}
```

**Good Points:**
- ✅ Simple and clean
- ✅ Includes related data
- ✅ Auto-assigns createdById

#### ❌ Issues

1. **No Validation**
   ```typescript
   // ❌ No village validation
   async create(createIncidentDto: CreateIncidentDto, userId: string) {
     // Should validate villageId exists
     if (createIncidentDto.villageId) {
       const village = await this.prisma.village.findUnique({
         where: { id: createIncidentDto.villageId }
       });
       if (!village) {
         throw new BadRequestException('Village not found');
       }
     }
   }
   ```

2. **No Notification**
   ```typescript
   // ❌ No notification to supervisor
   // Should notify supervisor when new incident created
   ```

3. **No Activity Log**
   ```typescript
   // ❌ No activity logging
   // Should log INCIDENT_CREATED
   ```

---

### 3.3 DTO (`create-incident.dto.ts`)

#### ✅ Strengths

```typescript
export class CreateIncidentDto {
  @ApiProperty({ example: 'น้ำท่วมหมู่ 3 บ้านเต๋าดิน' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ enum: DisasterType })
  @IsEnum(DisasterType)
  disasterType: DisasterType;

  @ApiProperty({ example: { type: 'Point', coordinates: [99.2333, 19.9167] } })
  @IsObject()
  location: { type: 'Point'; coordinates: [number, number]; };
}
```

**Good Points:**
- ✅ Comprehensive validation
- ✅ Swagger documentation
- ✅ Type safety

#### ⚠️ Issues

1. **Missing Fields**
   ```typescript
   // ❌ Missing polygon field
   @ApiProperty({ 
     example: { 
       type: 'Polygon', 
       coordinates: [[[99.2333, 19.9167], ...]] 
     },
     required: false 
   })
   @IsObject()
   @IsOptional()
   polygon?: any;
   
   // ❌ Missing estimatedHouseholds
   @ApiProperty({ example: 25 })
   @IsNumber()
   @IsOptional()
   estimatedHouseholds?: number;
   
   // ❌ Missing severity
   @ApiProperty({ example: 3, minimum: 1, maximum: 5 })
   @IsNumber()
   @Min(1)
   @Max(5)
   @IsOptional()
   severity?: number;
   ```

2. **No Custom Validation**
   ```typescript
   // ❌ No validation for coordinates format
   // Should validate [longitude, latitude] order
   ```

---

### 3.4 Photo Service (`photos.service.ts`)

#### ✅ Strengths

```typescript
async uploadPhoto(incidentId: string, file: Express.Multer.File, userId: string) {
  // Verify incident exists
  const incident = await this.prisma.incident.findUnique({
    where: { id: incidentId },
  });

  if (!incident) {
    throw new NotFoundException('Incident not found');
  }

  // Check permissions
  if (incident.createdById !== userId) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !['ADMIN', 'SUPERVISOR', 'EXECUTIVE'].includes(user.role)) {
      throw new BadRequestException('No permission');
    }
  }
}
```

**Good Points:**
- ✅ Permission checking
- ✅ File system management
- ✅ Error handling

#### ⚠️ Issues

1. **No File Validation**
   ```typescript
   // ❌ No file type validation
   // ❌ No file size validation
   // ❌ No virus scanning
   
   // ✅ Should add:
   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
   if (!allowedTypes.includes(file.mimetype)) {
     throw new BadRequestException('Invalid file type');
   }
   
   const maxSize = 5 * 1024 * 1024; // 5MB
   if (file.size > maxSize) {
     throw new BadRequestException('File too large');
   }
   ```

2. **No Image Processing**
   ```typescript
   // ❌ No image compression
   // ❌ No thumbnail generation
   // ❌ No EXIF data removal (privacy)
   ```

---

## 4. Frontend Analysis

### 4.1 CreateIncidentReportPage.tsx

#### ✅ Strengths

- ✅ Map integration with Leaflet
- ✅ GPS location capture
- ✅ Polygon drawing
- ✅ Village boundary display
- ✅ Photo preview

#### ❌ Critical Issues

**Issue #1: Polygon Not Sent to Backend**

```typescript
// ❌ Current code (line 341-353)
const payload = {
  title: `${disasterType} - ${village}`,
  description: notes || `เหตุการณ์${disasterType}ที่${village}`,
  disasterType: disasterType as any,
  priority: ...,
  location: {
    type: 'Point' as const,
    coordinates: [longitude, latitude] as [number, number]
  },
  address: village,
  villageId: selectedVillage?.id,
  images: photos.map(p => p.name) // ❌ Wrong! Should be URLs
};

// ❌ polygonData is NOT included!
```

**Fix:**
```typescript
const payload = {
  title: `${disasterType} - ${village}`,
  description: notes || `เหตุการณ์${disasterType}ที่${village}`,
  disasterType: disasterType as any,
  priority: ...,
  location: {
    type: 'Point' as const,
    coordinates: [longitude, latitude] as [number, number]
  },
  address: village,
  villageId: selectedVillage?.id,
  polygon: polygonData, // ✅ Add polygon
  estimatedHouseholds: parseInt(estimatedHouseholds) || 0, // ✅ Add
  severity: parseInt(severity) || 3, // ✅ Add
  images: [] // ✅ Upload after incident created
};
```

---

**Issue #2: No Form Validation**

```typescript
// ❌ Current code (line 322-334)
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!polygonData) {
    toast.error('⚠️ กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่');
    return;
  }

  if (!latitude || !longitude) {
    toast.error('⚠️ กรุณาใช้ GPS เพื่อระบุตำแหน่งปัจจุบัน');
    return;
  }
  
  // ❌ No other validation!
}
```

**Missing Validations:**
- ❌ village required
- ❌ disasterType required
- ❌ severity validation (1-5)
- ❌ estimatedHouseholds validation (>= 0)
- ❌ notes minimum length

**Fix:**
```typescript
const validateForm = (): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!village) {
    errors.village = 'กรุณาเลือกหมู่บ้าน';
  }

  if (!disasterType) {
    errors.disasterType = 'กรุณาเลือกประเภทภัย';
  }

  const sev = parseInt(severity);
  if (!severity || isNaN(sev) || sev < 1 || sev > 5) {
    errors.severity = 'กรุณาระบุระดับความรุนแรง 1-5';
  }

  const households = parseInt(estimatedHouseholds);
  if (estimatedHouseholds && (isNaN(households) || households < 0)) {
    errors.estimatedHouseholds = 'จำนวนครัวเรือนต้องเป็นตัวเลขที่มากกว่าหรือเท่ากับ 0';
  }

  if (!notes || notes.trim().length < 10) {
    errors.notes = 'กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร';
  }

  if (!latitude || !longitude) {
    errors.location = 'กรุณาใช้ GPS เพื่อระบุตำแหน่ง';
  }

  if (!polygonData) {
    errors.polygon = 'กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่';
  }

  return errors;
};
```

---

**Issue #3: Photo Upload Flow Wrong**

```typescript
// ❌ Current code
const payload = {
  ...
  images: photos.map(p => p.name) // ❌ Wrong! Just filenames
};

await incidentsApi.create(payload); // ❌ Photos not uploaded yet!
```

**Problem:**
1. Photos are NOT uploaded to server
2. Only filenames are sent (not URLs)
3. Backend expects URLs

**Fix:**
```typescript
// ✅ Correct flow
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Validate form
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    // Show errors
    return;
  }

  setIsSubmitting(true);

  try {
    // 2. Create incident first (without photos)
    const incident = await incidentsApi.create({
      title: `${disasterType} - ${village}`,
      description: notes,
      disasterType: disasterType as any,
      priority: ...,
      location: { ... },
      polygon: polygonData,
      estimatedHouseholds: parseInt(estimatedHouseholds) || 0,
      severity: parseInt(severity) || 3,
      villageId: selectedVillage?.id,
      address: village
    });

    // 3. Upload photos after incident created
    if (photos.length > 0) {
      for (const photo of photos) {
        const formData = new FormData();
        formData.append('file', photo.file);
        
        await fetch(`${API_URL}/incidents/${incident.id}/photos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      }
    }

    toast.success('✅ รายงานเหตุการณ์สำเร็จ!');
    navigate('/dashboard/officer');
  } catch (error) {
    console.error('Error:', error);
    toast.error('❌ ไม่สามารถส่งรายงานได้');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

**Issue #4: Map Race Condition**

```typescript
// ❌ Found in line 119-121
useEffect(() => {
  if (!mapRef.current) {
    const map = L.map('survey-map').setView([19.9422, 99.2195], 13);
    // ... no setTimeout but still potential race condition
  }
}, []); // ❌ Empty dependency array
```

**Problem:**
- Map initialized immediately
- DOM might not be ready
- No proper cleanup

**Fix:** (Same as Field Officer Survey - use proper DOM ready check)

---

**Issue #5: Village Selection No Validation**

```typescript
// ❌ Current code (line 82-116)
useEffect(() => {
  if (!mapRef.current || !village) return;

  const selectedVillage = villages.find(v => v.name === village);
  
  if (selectedVillage && selectedVillage.boundary && selectedVillage.boundary.length > 0) {
    // Show boundary
  } else {
    console.warn('No boundary data for village:', village);
    toast.error('ไม่พบข้อมูลขอบเขตของหมู่บ้านนี้'); // ❌ Error but continues
  }
}, [village, villages]);
```

**Problem:**
- Shows error but allows submission
- No validation that village exists in database

**Fix:**
```typescript
// In handleSubmit
const selectedVillage = villages.find(v => v.name === village);
if (!selectedVillage) {
  toast.error('❌ หมู่บ้านที่เลือกไม่ถูกต้อง กรุณาเลือกใหม่');
  return;
}
```

---

### 4.2 IncidentForm.tsx (Alternative Form)

#### ✅ Strengths

- ✅ Uses react-hook-form
- ✅ Better validation structure
- ✅ Survey template integration

#### ⚠️ Issues

1. **Duplicate Functionality**
   - มี 2 forms ทำงานเดียวกัน
   - CreateIncidentReportPage.tsx vs IncidentForm.tsx
   - ควรใช้แค่ตัวเดียว

2. **No Map Integration**
   - IncidentForm.tsx ไม่มี map
   - ต้องกรอก lat/lng ด้วยตัวเอง

---

### 4.3 PhotoUpload.tsx

#### ⚠️ Issues

```typescript
// Line 84-89
if (incidentId) {
  await uploadToServer(file);
} else {
  // Preview mode (before incident is created)
  previewFile(file);
}
```

**Problem:**
- Component expects incidentId
- But CreateIncidentReportPage doesn't provide it
- Photos only previewed, never uploaded

---

## 5. Issues Found

### 🔴 Critical Issues

| # | Issue | Severity | Impact | Location |
|---|-------|----------|--------|----------|
| 1 | **Polygon not sent to backend** | 🔴 CRITICAL | Data loss | CreateIncidentReportPage.tsx:341 |
| 2 | **Photos not uploaded** | 🔴 CRITICAL | Data loss | CreateIncidentReportPage.tsx:352 |
| 3 | **No form validation** | 🔴 CRITICAL | Bad UX, invalid data | CreateIncidentReportPage.tsx:322 |
| 4 | **Missing DTO fields** | 🔴 CRITICAL | Backend incomplete | create-incident.dto.ts |

### 🟡 High Priority Issues

| # | Issue | Severity | Impact | Location |
|---|-------|----------|--------|----------|
| 5 | **No village validation** | 🟡 HIGH | Invalid data | incidents.service.ts:21 |
| 6 | **No notification** | 🟡 HIGH | Poor workflow | incidents.service.ts:21 |
| 7 | **No activity log** | 🟡 HIGH | No audit trail | incidents.service.ts:21 |
| 8 | **No file validation** | 🟡 HIGH | Security risk | photos.service.ts:22 |

### 🟢 Medium Priority Issues

| # | Issue | Severity | Impact | Location |
|---|-------|----------|--------|----------|
| 9 | **No RBAC on create** | 🟢 MEDIUM | Security | incidents.controller.ts:52 |
| 10 | **No input sanitization** | 🟢 MEDIUM | XSS risk | incidents.controller.ts:58 |
| 11 | **Duplicate forms** | 🟢 MEDIUM | Confusion | Frontend |
| 12 | **Map race condition** | 🟢 MEDIUM | Reliability | CreateIncidentReportPage.tsx:119 |

---

## 6. Recommendations

### 6.1 Immediate Fixes (Critical)

#### Fix #1: Add Missing Fields to DTO

```typescript
// backend/src/incidents/dto/create-incident.dto.ts

export class CreateIncidentDto {
  // ... existing fields ...

  @ApiProperty({ 
    example: { 
      type: 'Polygon', 
      coordinates: [[[99.2333, 19.9167], [99.2343, 19.9167], ...]] 
    },
    description: 'GeoJSON Polygon of affected area',
    required: false 
  })
  @IsObject()
  @IsOptional()
  polygon?: any;

  @ApiProperty({ example: 25, description: 'Estimated affected households' })
  @IsNumber()
  @IsOptional()
  estimatedHouseholds?: number;

  @ApiProperty({ example: 3, minimum: 1, maximum: 5, description: 'Severity level' })
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  severity?: number;
}
```

---

#### Fix #2: Update Frontend Submit Logic

```typescript
// frontend/src/pages/field-officer/CreateIncidentReportPage.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // 1. Validate
  const errors = validateForm();
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    toast.error('❌ กรุณากรอกข้อมูลให้ครบถ้วน');
    return;
  }

  setIsSubmitting(true);

  try {
    // 2. Find village
    const selectedVillage = villages.find(v => v.name === village);
    
    // 3. Create incident
    const incident = await incidentsApi.create({
      title: `${disasterType} - ${village}`,
      description: notes || `เหตุการณ์${disasterType}ที่${village}`,
      disasterType: disasterType as any,
      priority: (severity === '5' ? 'CRITICAL' : 
                 severity === '4' ? 'HIGH' : 
                 severity === '3' ? 'MEDIUM' : 'LOW') as any,
      location: {
        type: 'Point' as const,
        coordinates: [longitude!, latitude!] as [number, number]
      },
      polygon: polygonData, // ✅ Include polygon
      address: village,
      villageId: selectedVillage?.id,
      estimatedHouseholds: parseInt(estimatedHouseholds) || 0, // ✅ Include
      severity: parseInt(severity) || 3 // ✅ Include
    });

    // 4. Upload photos
    if (photos.length > 0) {
      const token = localStorage.getItem('accessToken');
      
      for (const photo of photos) {
        const formData = new FormData();
        formData.append('file', photo.file);
        
        await fetch(`${import.meta.env.VITE_API_URL}/incidents/${incident.id}/photos`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
      }
    }

    toast.success('✅ รายงานเหตุการณ์สำเร็จ!');
    navigate('/dashboard/officer');
  } catch (error) {
    console.error('Error:', error);
    toast.error('❌ ไม่สามารถส่งรายงานได้');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

#### Fix #3: Add Form Validation

```typescript
// frontend/src/pages/field-officer/CreateIncidentReportPage.tsx

const [errors, setErrors] = useState<Record<string, string>>({});

const validateForm = (): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!village) {
    errors.village = 'กรุณาเลือกหมู่บ้าน';
  }

  if (!disasterType) {
    errors.disasterType = 'กรุณาเลือกประเภทภัย';
  }

  const sev = parseInt(severity);
  if (!severity || isNaN(sev) || sev < 1 || sev > 5) {
    errors.severity = 'กรุณาระบุระดับความรุนแรง 1-5';
  }

  const households = parseInt(estimatedHouseholds);
  if (estimatedHouseholds && (isNaN(households) || households < 0)) {
    errors.estimatedHouseholds = 'จำนวนครัวเรือนต้องเป็นตัวเลข >= 0';
  }

  if (!notes || notes.trim().length < 10) {
    errors.notes = 'กรุณาระบุรายละเอียดอย่างน้อย 10 ตัวอักษร';
  }

  if (!latitude || !longitude) {
    errors.location = 'กรุณาใช้ GPS เพื่อระบุตำแหน่ง';
  }

  if (!polygonData) {
    errors.polygon = 'กรุณาวาดพื้นที่ที่ได้รับผลกระทบบนแผนที่';
  }

  // Validate village exists
  const selectedVillage = villages.find(v => v.name === village);
  if (village && !selectedVillage) {
    errors.village = 'หมู่บ้านที่เลือกไม่ถูกต้อง';
  }

  return errors;
};
```

---

### 6.2 High Priority Fixes

#### Fix #4: Add Village Validation in Service

```typescript
// backend/src/incidents/incidents.service.ts

async create(createIncidentDto: CreateIncidentDto, userId: string) {
  // Validate village if provided
  if (createIncidentDto.villageId) {
    const village = await this.prisma.village.findUnique({
      where: { id: createIncidentDto.villageId }
    });
    
    if (!village) {
      throw new BadRequestException('Village not found');
    }
  }

  // Create incident
  const incident = await this.prisma.incident.create({
    data: {
      ...createIncidentDto,
      createdById: userId,
    },
    include: {
      createdBy: { select: { ... } },
      village: true,
    },
  });

  // Log activity
  await this.activityLogService.log({
    userId,
    action: 'INCIDENT_CREATED',
    entityType: 'INCIDENT',
    entityId: incident.id,
    details: {
      title: incident.title,
      disasterType: incident.disasterType,
      priority: incident.priority
    }
  });

  // Notify supervisor
  const supervisors = await this.prisma.user.findMany({
    where: { role: 'SUPERVISOR' }
  });

  for (const supervisor of supervisors) {
    await this.notificationsService.create({
      userId: supervisor.id,
      type: 'INCIDENT_CREATED',
      title: 'เหตุการณ์ใหม่',
      message: `${incident.title} ถูกสร้างโดย ${incident.createdBy.firstName}`,
      link: `/incidents/${incident.id}`
    });
  }

  return incident;
}
```

---

#### Fix #5: Add File Validation

```typescript
// backend/src/incidents/photos.service.ts

async uploadPhoto(incidentId: string, file: Express.Multer.File, userId: string) {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException(
      'Invalid file type. Allowed: JPEG, PNG, WebP'
    );
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new BadRequestException(
      'File too large. Maximum size: 5MB'
    );
  }

  // Validate filename (prevent path traversal)
  const safeFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

  // ... rest of upload logic
}
```

---

### 6.3 Medium Priority Fixes

#### Fix #6: Add RBAC

```typescript
// backend/src/incidents/incidents.controller.ts

@Post()
@Roles('FIELD_OFFICER', 'SUPERVISOR', 'ADMIN') // ✅ Add RBAC
@Throttle({ default: { limit: 10, ttl: 60000 } })
@ApiOperation({ summary: 'Create a new incident' })
create(
  @Body() createIncidentDto: CreateIncidentDto,
  @CurrentUser() user: any,
) {
  return this.incidentsService.create(createIncidentDto, user.id);
}
```

---

#### Fix #7: Add Input Sanitization

```typescript
// backend/src/incidents/incidents.service.ts

import * as sanitizeHtml from 'sanitize-html';

async create(createIncidentDto: CreateIncidentDto, userId: string) {
  // Sanitize inputs
  const sanitizedData = {
    ...createIncidentDto,
    title: sanitizeHtml(createIncidentDto.title, { allowedTags: [] }),
    description: createIncidentDto.description 
      ? sanitizeHtml(createIncidentDto.description, { allowedTags: [] })
      : undefined,
    address: createIncidentDto.address
      ? sanitizeHtml(createIncidentDto.address, { allowedTags: [] })
      : undefined
  };

  // ... create with sanitized data
}
```

---

## 7. Testing Checklist

### Backend API Tests

- [ ] Create incident with all fields
- [ ] Create incident with minimal fields
- [ ] Create incident with invalid villageId
- [ ] Create incident with invalid disasterType
- [ ] Create incident with invalid coordinates
- [ ] Create incident without authentication
- [ ] Create incident with wrong role
- [ ] Upload photo to incident
- [ ] Upload invalid file type
- [ ] Upload file too large
- [ ] Delete photo from incident

### Frontend Tests

- [ ] Form validation works
- [ ] Village selection works
- [ ] GPS location works
- [ ] Polygon drawing works
- [ ] Photo upload works
- [ ] Error messages display
- [ ] Success message displays
- [ ] Navigation after submit
- [ ] Thai text displays correctly

---

## 8. Summary

### Critical Fixes Needed (Must Do)

1. ✅ Add polygon, estimatedHouseholds, severity to DTO
2. ✅ Fix frontend submit to include all fields
3. ✅ Fix photo upload flow
4. ✅ Add form validation

### High Priority (Should Do)

5. ✅ Add village validation in service
6. ✅ Add notification on incident create
7. ✅ Add activity logging
8. ✅ Add file validation

### Medium Priority (Nice to Have)

9. ✅ Add RBAC to create endpoint
10. ✅ Add input sanitization
11. ✅ Remove duplicate form
12. ✅ Fix map race condition

---

## 9. Estimated Effort

| Priority | Issues | Estimated Time |
|----------|--------|----------------|
| Critical | 4 | 4 hours |
| High | 4 | 3 hours |
| Medium | 4 | 2 hours |
| **Total** | **12** | **9 hours (~1.5 days)** |

---

**Status:** 📋 Report Complete  
**Next Action:** Implement fixes in priority order  
**Owner:** Development Team
