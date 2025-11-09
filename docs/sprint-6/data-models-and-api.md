# Sprint 6: Data Models, Validation Schemas, and API Contracts

**Document Version:** 1.0  
**Date:** Nov 09, 2025  
**Author:** Manus AI

---

## 1. Frontend Data Models

### 1.1. Full Report Form Data

```typescript
// types/full-report.ts

export enum ReportSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface FullReportFormData {
  // Step 1: Basic Information
  taskId: string;
  title: string;
  summary: string;
  
  // Step 2: Damage Assessment
  severity: ReportSeverity;
  damageDescription: string;
  damageCategories: DamageCategory[];
  
  // Step 3: Affected Area
  affectedHouseholds: number;
  affectedPopulation: number;
  affectedAreaDescription: string;
  geoJsonArea?: GeoJSONPolygon; // From preliminary report
  
  // Step 4: Infrastructure Damage
  infrastructureTypes: InfrastructureType[];
  infrastructureDetails: Record<InfrastructureType, string>;
  estimatedRepairCost?: number;
  
  // Step 5: Casualties
  casualties: number;
  injuries: number;
  missing: number;
  casualtyDetails?: string;
  
  // Step 6: Resources Needed
  resourceCategories: ResourceCategory[];
  resourceDetails: Record<ResourceCategory, string>;
  urgentPriorityItems: string[];
  
  // Step 7: Current Response
  responseStatus: ResponseStatus;
  responseDescription: string;
  respondingAgencies: string[];
  resourcesDeployed?: string;
  
  // Step 8: Images
  images: File[];
  imageUrls: string[];
  
  // Step 9: AI Analysis
  aiAnalysis: AIAnalysisResult | null;
  aiAnalysisEdited?: string;
  aiAnalysisModified: boolean;
  
  // Step 10: Recommendations
  shortTermRecommendations: string;
  longTermRecommendations: string;
  preventiveMeasures: string;
  priorityActions: string[];
}

export type DamageCategory = 
  | 'STRUCTURAL'
  | 'ENVIRONMENTAL'
  | 'ECONOMIC'
  | 'SOCIAL';

export type InfrastructureType =
  | 'ROADS'
  | 'BRIDGES'
  | 'BUILDINGS'
  | 'UTILITIES'
  | 'SCHOOLS'
  | 'HOSPITALS'
  | 'WATER_SUPPLY'
  | 'POWER_GRID';

export type ResourceCategory =
  | 'FOOD'
  | 'WATER'
  | 'SHELTER'
  | 'MEDICAL'
  | 'RESCUE_EQUIPMENT'
  | 'TRANSPORTATION'
  | 'COMMUNICATION';

export type ResponseStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED';
```

### 1.2. AI Analysis Result

```typescript
export interface AIAnalysisResult {
  damageLevel: 'low' | 'medium' | 'high' | 'critical';
  damageTypes: string[];
  affectedStructures: string[];
  riskFactors: string[];
  summary: string;
  confidence: number; // 0-1
  tags: string[];
  analyzedAt: Date;
  modelVersion: string; // e.g., "gemini-2.5-flash"
}
```

### 1.3. Wizard State

```typescript
export interface WizardState {
  currentStep: number;
  totalSteps: number;
  formData: FullReportFormData;
  validation: StepValidation;
  isDraft: boolean;
  draftId?: string;
  lastSaved: Date | null;
  isSubmitting: boolean;
}

export interface StepValidation {
  [step: number]: {
    isValid: boolean;
    errors: string[];
  };
}
```

---

## 2. Backend Data Models

### 2.1. Create Full Report DTO (Enhanced)

```typescript
// backend/src/report/dto/create-full-report.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { 
  IsString, 
  IsOptional, 
  IsArray, 
  IsNumber, 
  IsEnum,
  IsBoolean,
  Min,
  Max,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ReportSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class AIAnalysisDto {
  @ApiProperty()
  @IsString()
  damageLevel: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  damageTypes: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  affectedStructures: string[];

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  riskFactors: string[];

  @ApiProperty()
  @IsString()
  summary: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1)
  confidence: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty()
  @IsString()
  modelVersion: string;
}

export class CreateFullReportDto {
  // Step 1: Basic Information
  @ApiProperty({ description: 'Task ID from preliminary report' })
  @IsString()
  taskId: string;

  @ApiProperty({ minLength: 10, maxLength: 200 })
  @IsString()
  @MinLength(10)
  @MaxLength(200)
  title: string;

  @ApiProperty({ minLength: 100, maxLength: 2000 })
  @IsString()
  @MinLength(100)
  @MaxLength(2000)
  summary: string;

  // Step 2: Damage Assessment
  @ApiProperty({ enum: ReportSeverity })
  @IsEnum(ReportSeverity)
  severity: ReportSeverity;

  @ApiProperty({ minLength: 200 })
  @IsString()
  @MinLength(200)
  damageDescription: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  damageCategories: string[];

  // Step 3: Affected Area
  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  affectedHouseholds: number;

  @ApiProperty({ minimum: 0 })
  @IsNumber()
  @Min(0)
  affectedPopulation: number;

  @ApiProperty()
  @IsString()
  affectedAreaDescription: string;

  // Step 4: Infrastructure Damage
  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  infrastructureTypes?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  infrastructureDetails?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimatedRepairCost?: number;

  // Step 5: Casualties
  @ApiProperty({ minimum: 0, default: 0 })
  @IsNumber()
  @Min(0)
  casualties: number;

  @ApiProperty({ minimum: 0, default: 0 })
  @IsNumber()
  @Min(0)
  injuries: number;

  @ApiProperty({ minimum: 0, default: 0 })
  @IsNumber()
  @Min(0)
  missing: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  casualtyDetails?: string;

  // Step 6: Resources Needed
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  resourceCategories: string[];

  @ApiProperty()
  @IsString()
  resourceDetails: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  urgentPriorityItems: string[];

  // Step 7: Current Response
  @ApiProperty()
  @IsString()
  responseStatus: string;

  @ApiProperty()
  @IsString()
  responseDescription: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  respondingAgencies: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resourcesDeployed?: string;

  // Step 8: Images
  @ApiProperty({ type: [String], description: 'Array of image URLs' })
  @IsArray()
  @IsString({ each: true })
  imageUrls: string[];

  // Step 9: AI Analysis
  @ApiProperty({ type: AIAnalysisDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => AIAnalysisDto)
  aiAnalysis?: AIAnalysisDto;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aiAnalysisEdited?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  aiAnalysisModified: boolean;

  // Step 10: Recommendations
  @ApiProperty({ minLength: 100 })
  @IsString()
  @MinLength(100)
  shortTermRecommendations: string;

  @ApiProperty({ minLength: 100 })
  @IsString()
  @MinLength(100)
  longTermRecommendations: string;

  @ApiProperty()
  @IsString()
  preventiveMeasures: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  priorityActions: string[];
}
```

### 2.2. Analyze Images DTO

```typescript
// backend/src/report/dto/analyze-images.dto.ts

export class AnalyzeImagesDto {
  @ApiProperty({ type: [String], description: 'Array of image URLs to analyze' })
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  imageUrls: string[];

  @ApiProperty({ required: false, description: 'Custom prompt for analysis' })
  @IsOptional()
  @IsString()
  customPrompt?: string;
}
```

---

## 3. Validation Schemas (Zod)

### 3.1. Step 1 Validation

```typescript
import { z } from 'zod';

export const step1Schema = z.object({
  taskId: z.string().uuid('Task ID ไม่ถูกต้อง'),
  title: z.string()
    .min(10, 'ชื่อรายงานต้องมีอย่างน้อย 10 ตัวอักษร')
    .max(200, 'ชื่อรายงานต้องไม่เกิน 200 ตัวอักษร'),
  summary: z.string()
    .min(100, 'สรุปต้องมีอย่างน้อย 100 ตัวอักษร')
    .max(2000, 'สรุปต้องไม่เกิน 2000 ตัวอักษร'),
});
```

### 3.2. Step 2 Validation

```typescript
export const step2Schema = z.object({
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], {
    errorMap: () => ({ message: 'กรุณาเลือกระดับความรุนแรง' }),
  }),
  damageDescription: z.string()
    .min(200, 'รายละเอียดความเสียหายต้องมีอย่างน้อย 200 ตัวอักษร'),
  damageCategories: z.array(z.string())
    .min(1, 'กรุณาเลือกประเภทความเสียหายอย่างน้อย 1 ประเภท'),
});
```

### 3.3. Step 3 Validation

```typescript
export const step3Schema = z.object({
  affectedHouseholds: z.number()
    .min(0, 'จำนวนครัวเรือนต้องไม่ติดลบ')
    .int('จำนวนครัวเรือนต้องเป็นจำนวนเต็ม'),
  affectedPopulation: z.number()
    .min(0, 'จำนวนประชากรต้องไม่ติดลบ')
    .int('จำนวนประชากรต้องเป็นจำนวนเต็ม'),
  affectedAreaDescription: z.string()
    .min(50, 'รายละเอียดพื้นที่ต้องมีอย่างน้อย 50 ตัวอักษร'),
});
```

### 3.4. Complete Form Validation

```typescript
export const fullReportSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  // ... all other steps
  
  // Cross-field validation
}).refine(
  (data) => {
    // If casualties > 0, casualtyDetails must be provided
    if (data.casualties > 0 || data.injuries > 0 || data.missing > 0) {
      return !!data.casualtyDetails && data.casualtyDetails.length >= 50;
    }
    return true;
  },
  {
    message: 'กรุณาระบุรายละเอียดผู้ประสบภัยเมื่อมีผู้เสียชีวิต บาดเจ็บ หรือสูญหาย',
    path: ['casualtyDetails'],
  }
);
```

---

## 4. API Endpoints

### 4.1. Report Endpoints (Existing + New)

| Method | Endpoint | Description | Auth | Role |
|:---|:---|:---|:---|:---|
| **POST** | `/api/reports/full` | Create full report | ✅ | REPORT_TEAM |
| **GET** | `/api/reports/:id` | Get report by ID | ✅ | ALL |
| **PATCH** | `/api/reports/:id` | Update report | ✅ | REPORT_TEAM |
| **POST** | `/api/reports/:id/submit` | Submit for review | ✅ | REPORT_TEAM |
| **POST** | `/api/reports/:id/review` | Review report | ✅ | SUPERVISOR+ |
| **GET** | `/api/reports/drafts` | Get user's drafts | ✅ | REPORT_TEAM |
| **POST** | `/api/reports/drafts` | Save draft | ✅ | REPORT_TEAM |
| **DELETE** | `/api/reports/drafts/:id` | Delete draft | ✅ | REPORT_TEAM |

### 4.2. AI Analysis Endpoints (New)

| Method | Endpoint | Description | Auth | Role |
|:---|:---|:---|:---|:---|
| **POST** | `/api/reports/analyze-images` | Analyze images with AI | ✅ | REPORT_TEAM |
| **POST** | `/api/reports/:id/reanalyze` | Re-analyze report images | ✅ | REPORT_TEAM |

### 4.3. Preliminary Report Endpoint (New)

| Method | Endpoint | Description | Auth | Role |
|:---|:---|:---|:---|:---|
| **GET** | `/api/tasks/:taskId/preliminary-data` | Get preliminary report data | ✅ | REPORT_TEAM |

---

## 5. API Request/Response Examples

### 5.1. Create Full Report

**Request:**
```http
POST /api/reports/full
Authorization: Bearer <token>
Content-Type: application/json

{
  "taskId": "uuid-123",
  "title": "รายงานน้ำท่วมหมู่ 3 บ้านเต๋าดิน",
  "summary": "เหตุการณ์น้ำท่วมครั้งใหญ่เกิดขึ้นเมื่อวันที่ 9 พฤศจิกายน 2568...",
  "severity": "HIGH",
  "damageDescription": "น้ำท่วมขังสูงถึง 1.5 เมตร...",
  "damageCategories": ["STRUCTURAL", "ECONOMIC"],
  "affectedHouseholds": 150,
  "affectedPopulation": 450,
  "affectedAreaDescription": "พื้นที่ครอบคลุมหมู่ 3 และหมู่ 4...",
  "casualties": 0,
  "injuries": 5,
  "missing": 0,
  "casualtyDetails": "ผู้บาดเจ็บ 5 ราย ได้รับการรักษาแล้ว",
  "resourceCategories": ["FOOD", "WATER", "SHELTER"],
  "resourceDetails": "ต้องการอาหารสำเร็จรูป 500 ชุด...",
  "urgentPriorityItems": ["น้ำดื่ม", "ยารักษาโรค"],
  "responseStatus": "IN_PROGRESS",
  "responseDescription": "ทีมกู้ภัยเข้าพื้นที่แล้ว...",
  "respondingAgencies": ["สำนักงานป้องกันฯ", "มูลนิธิกู้ภัย"],
  "imageUrls": [
    "https://storage.example.com/image1.jpg",
    "https://storage.example.com/image2.jpg"
  ],
  "aiAnalysis": {
    "damageLevel": "high",
    "damageTypes": ["flooding", "structural damage"],
    "affectedStructures": ["houses", "roads"],
    "riskFactors": ["continued rainfall", "weak structures"],
    "summary": "พื้นที่ได้รับผลกระทบจากน้ำท่วมอย่างรุนแรง...",
    "confidence": 0.92,
    "tags": ["flood", "high-risk"],
    "modelVersion": "gemini-2.5-flash"
  },
  "aiAnalysisModified": false,
  "shortTermRecommendations": "1. อพยพผู้ประสบภัยไปยังศูนย์พักพิง...",
  "longTermRecommendations": "1. ปรับปรุงระบบระบายน้ำ...",
  "preventiveMeasures": "1. สร้างเขื่อนป้องกันน้ำท่วม...",
  "priorityActions": ["อพยพผู้ประสบภัย", "จัดหาน้ำดื่ม", "ซ่อมแซมถนน"]
}
```

**Response:**
```json
{
  "id": "report-uuid",
  "type": "INCIDENT",
  "status": "DRAFT",
  "title": "รายงานน้ำท่วมหมู่ 3 บ้านเต๋าดิน",
  "summary": "เหตุการณ์น้ำท่วมครั้งใหญ่...",
  "details": { /* full report data */ },
  "aiAnalysis": { /* AI analysis result */ },
  "createdAt": "2025-11-09T12:00:00Z",
  "updatedAt": "2025-11-09T12:00:00Z",
  "authorId": "user-uuid",
  "author": {
    "id": "user-uuid",
    "name": "สมชาย ใจดี",
    "email": "somchai@example.com"
  }
}
```

### 5.2. Analyze Images

**Request:**
```http
POST /api/reports/analyze-images
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrls": [
    "https://storage.example.com/image1.jpg",
    "https://storage.example.com/image2.jpg"
  ],
  "customPrompt": "วิเคราะห์ความเสียหายจากน้ำท่วมในภาพ"
}
```

**Response:**
```json
{
  "damageLevel": "high",
  "damageTypes": ["flooding", "structural damage", "road damage"],
  "affectedStructures": ["residential buildings", "roads", "bridges"],
  "riskFactors": [
    "continued rainfall",
    "weak building foundations",
    "blocked drainage"
  ],
  "summary": "จากการวิเคราะห์ภาพพบว่าพื้นที่ได้รับผลกระทบจากน้ำท่วมอย่างรุนแรง มีน้ำท่วมขังสูงประมาณ 1-1.5 เมตร อาคารที่พักอาศัยและถนนได้รับความเสียหาย ควรเร่งอพยพผู้ประสบภัยและจัดหาที่พักพิงชั่วคราว",
  "confidence": 0.92,
  "tags": ["flood", "high-risk", "structural-damage", "urgent"],
  "modelVersion": "gemini-2.5-flash"
}
```

### 5.3. Get Preliminary Data

**Request:**
```http
GET /api/tasks/uuid-123/preliminary-data
Authorization: Bearer <token>
```

**Response:**
```json
{
  "taskId": "uuid-123",
  "incidentId": "incident-uuid",
  "disasterType": "FLOOD",
  "village": {
    "id": "village-uuid",
    "name": "บ้านเต๋าดิน",
    "villageNo": 3
  },
  "description": "น้ำท่วมขังบริเวณถนนสายหลัก...",
  "surveyLocation": {
    "type": "Point",
    "coordinates": [99.8832, 19.9263]
  },
  "surveyArea": {
    "type": "Polygon",
    "coordinates": [[[99.88, 19.92], [99.89, 19.92], [99.89, 19.93], [99.88, 19.93], [99.88, 19.92]]]
  },
  "surveyNotes": "พื้นที่น้ำท่วมขังสูง ประชาชนต้องการความช่วยเหลือ",
  "surveyedAt": "2025-11-08T14:30:00Z"
}
```

---

## 6. Database Schema Updates

### 6.1. Report Table (Existing - No Changes Needed)

The existing `Report` model already supports:
- `details: Json` - Can store full report data
- `aiAnalysis: Json` - Can store AI analysis
- `photoUrls: String[]` - Can store image URLs
- `status: ReportStatus` - DRAFT, SUBMITTED, UNDER_REVIEW, etc.

### 6.2. Audit Log Table (Existing)

```prisma
model AuditLog {
  id          String   @id @default(uuid())
  entityType  String   @map("entity_type")
  entityId    String   @map("entity_id")
  action      String
  details     Json?
  userId      String?  @map("user_id")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  createdAt   DateTime @default(now()) @map("created_at")
  
  user User? @relation(fields: [userId], references: [id])
  
  @@index([entityType, entityId])
  @@index([userId])
  @@index([createdAt])
}
```

---

## 7. Error Responses

### 7.1. Validation Error

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "ชื่อรายงานต้องมีอย่างน้อย 10 ตัวอักษร"
    },
    {
      "field": "summary",
      "message": "สรุปต้องมีอย่างน้อย 100 ตัวอักษร"
    }
  ]
}
```

### 7.2. Authorization Error

```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "คุณไม่มีสิทธิ์เข้าถึงฟีเจอร์นี้ (ต้องเป็น REPORT_TEAM)"
}
```

### 7.3. AI Analysis Error

```json
{
  "statusCode": 500,
  "message": "AI analysis failed",
  "error": "ไม่สามารถวิเคราะห์ภาพได้ กรุณาลองใหม่อีกครั้ง",
  "details": {
    "reason": "Gemini API rate limit exceeded",
    "retryAfter": 60
  }
}
```

---

## 8. Summary

This document defines:
- **Frontend data models** for wizard state and form data
- **Backend DTOs** with comprehensive validation
- **Zod schemas** for client-side validation
- **API endpoints** for full report creation and AI analysis
- **Request/Response examples** for all major operations
- **Error handling** patterns

All models are designed to support:
- ✅ 10-step wizard flow
- ✅ Gemini AI integration
- ✅ Image upload and analysis
- ✅ Audit trail tracking
- ✅ Draft saving and resuming
- ✅ Role-based access control
