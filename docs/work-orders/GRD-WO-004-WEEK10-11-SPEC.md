# Week 10-11: Report Generation Module
## Complete Technical Specification & Implementation Guide

**Document ID:** GRD-WO-004-WEEK10-11-SPEC
**Issued by:** Manus AI (Based on SA Guide)
**Date:** 2025-11-03
**Subject:** Technical Specification for Report Generation Module

---

## 📊 SITUATION ASSESSMENT

**Current Status:**
- ✅ Phase 1: Complete (Backend Configuration Fixes)
- ✅ Phase 2: Complete (Frontend Configuration Fixes)
- ✅ Phase 3: Complete (Clean Restart Script & Backend Code Fixes)
- 🟡 Phase 5: Survey Module Test Pending (Blocked by environment instability)
- ❌ Development Environment: Unstable (Frontend 500 Internal Server Error)

**Strategic Pivot:**
เนื่องจากปัญหาด้านสภาพแวดล้อมการพัฒนาที่ยังคงอยู่และขัดขวางการทดสอบโมดูล Survey (Phase 5) จึงมีการปรับกลยุทธ์ตามคำแนะนำของ System Analyst (SA) โดยเน้นการสร้างเอกสารทางเทคนิคสำหรับ Report Module ก่อน (Option C: Hybrid Approach) เพื่อให้เกิดความคืบหน้าและมีแผนงานที่ชัดเจนสำหรับการพัฒนาในอนาคต

---

## 📝 REPORT MODULE - TECHNICAL SPECIFICATION

### **1. Database Schema**

| Model | Field | Type | Description | Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **Report** | `id` | `uuid` | Primary key | `NOT NULL` |
| | `title` | `string` | ชื่อรายงาน | `NOT NULL` |
| | `type` | `ReportType enum` | ประเภทของรายงาน | `NOT NULL` |
| | `templateId` | `string` | ID ของ ReportTemplate ที่ใช้ | `Optional` |
| | `content` | `json` | ข้อมูลเนื้อหาของรายงาน (JSON) | `NOT NULL` |
| | `pdfUrl` | `string` | URL สำหรับดาวน์โหลดไฟล์ PDF | `Optional` |
| | `status` | `ReportStatus enum` | สถานะของรายงาน | `Default: 'DRAFT'` |
| | `incidentId` | `string` | ID ของ Incident ที่เกี่ยวข้อง | `Optional` |
| | `taskIds` | `string[]` | รายการ ID ของ Tasks ที่เกี่ยวข้อง | `Default: []` |
| | `surveyIds` | `string[]` | รายการ ID ของ Surveys ที่เกี่ยวข้อง | `Default: []` |
| | `createdById` | `string` | ID ของ User ผู้สร้างรายงาน | `NOT NULL` |
| | `generatedAt` | `datetime` | วันที่และเวลาที่สร้าง PDF เสร็จสิ้น | `Optional` |
| | `createdAt` | `datetime` | วันที่และเวลาที่สร้างรายงาน | `Default: CURRENT_TIMESTAMP` |
| | `updatedAt` | `datetime` | วันที่และเวลาที่อัปเดตล่าสุด | `NOT NULL` |
| **ReportTemplate** | `id` | `uuid` | Primary key | `NOT NULL` |
| | `name` | `string` | ชื่อ Template | `NOT NULL` |
| | `type` | `ReportType enum` | ประเภทของรายงานที่ Template รองรับ | `NOT NULL` |
| | `description` | `string` | คำอธิบาย Template | `Optional` |
| | `structure` | `json` | โครงสร้างของ Template (JSON) | `NOT NULL` |
| | `isActive` | `boolean` | สถานะการใช้งาน Template | `Default: true` |
| | `createdAt` | `datetime` | วันที่และเวลาที่สร้าง Template | `Default: CURRENT_TIMESTAMP` |
| | `updatedAt` | `datetime` | วันที่และเวลาที่อัปเดตล่าสุด | `NOT NULL` |

### **2. Enums**

| Enum Name | Values | Description |
| :--- | :--- | :--- |
| **ReportType** | `INCIDENT_SUMMARY` | รายงานสรุปเหตุการณ์ |
| | `TASK_PROGRESS` | รายงานความคืบหน้าของ Task |
| | `SURVEY_RESULTS` | รายงานผลการสำรวจ |
| | `MONTHLY_SUMMARY` | รายงานสรุปรายเดือน |
| | `CUSTOM` | รายงานที่กำหนดเอง |
| **ReportStatus** | `DRAFT` | ร่างรายงาน (ยังไม่สร้าง PDF) |
| | `GENERATING` | กำลังสร้างไฟล์ PDF |
| | `READY` | สร้างไฟล์ PDF เสร็จสมบูรณ์ |
| | `ERROR` | เกิดข้อผิดพลาดในการสร้างไฟล์ PDF |

### **3. API Endpoints**

| Method | Path | Description |
| :--- | :--- | :--- |
| **Reports** | | |
| `POST` | `/api/reports` | สร้างรายงานใหม่ |
| `GET` | `/api/reports` | ดึงรายการรายงานทั้งหมด (รองรับ Filters) |
| `GET` | `/api/reports/:id` | ดึงข้อมูลรายงานตาม ID |
| `GET` | `/api/reports/:id/pdf` | ดาวน์โหลดไฟล์ PDF ของรายงาน |
| `PATCH` | `/api/reports/:id` | อัปเดตข้อมูลรายงาน |
| `DELETE` | `/api/reports/:id` | ลบรายงาน |
| `POST` | `/api/reports/:id/generate` | สั่งสร้างไฟล์ PDF ของรายงาน |
| **Report Templates** | | |
| `GET` | `/api/reports/templates` | ดึงรายการ Report Templates ทั้งหมด |
| `POST` | `/api/reports/templates` | สร้าง Report Template ใหม่ |
| `GET` | `/api/reports/templates/:id` | ดึงข้อมูล Report Template ตาม ID |
| `PATCH` | `/api/reports/templates/:id` | อัปเดต Report Template |
| `DELETE` | `/api/reports/templates/:id` | ลบ Report Template |

### **4. PDF Generation Strategy**

| Aspect | Detail |
| :--- | :--- |
| **Technology** | **Puppeteer** (ผ่าน HTML to PDF) |
| **Reason** | รองรับการแสดงผลภาษาไทย (Thai font support) และมีความยืดหยุ่นสูงในการสร้างเอกสารที่ซับซ้อน |
| **Process** | แปลง HTML ที่สร้างจาก Template และข้อมูล (`content` field) ไปเป็น PDF ผ่าน Headless Browser |
| **Fonts** | Google Fonts (เช่น **Sarabun**) เพื่อรองรับภาษาไทยอย่างถูกต้อง |
| **Format** | A4, กำหนดขอบ (margins) ตามมาตรฐาน |
| **Template Structure** | 1. **Header:** โลโก้, ชื่อรายงาน, วันที่ 2. **Body:** เนื้อหาแบบ Dynamic ตามประเภทรายงาน 3. **Footer:** เลขหน้า, ข้อมูลการสร้าง |

### **5. Component Design (Frontend)**

| Component | Description |
| :--- | :--- |
| **ReportForm** | ฟอร์มสำหรับสร้างรายงาน: เลือกประเภทรายงาน, เลือกแหล่งข้อมูล (Incident, Tasks, Surveys), แสดงตัวอย่าง HTML, ปุ่ม Generate PDF |
| **ReportsList** | ตารางแสดงรายการรายงาน: รองรับการกรอง (Filters), แสดงสถานะ (Status badges), ปุ่มดาวน์โหลด PDF, ปุ่ม View/Edit/Delete |
| **ReportViewer** | แสดงตัวอย่าง HTML ของรายงาน, ปุ่มดาวน์โหลด PDF, แสดง Metadata และลิงก์ไปยังข้อมูลที่เกี่ยวข้อง |
| **ReportPreview** | Component ย่อยสำหรับแสดงผลเนื้อหาของรายงานแต่ละประเภท (เช่น `IncidentSummaryPreview.tsx`) |

### **6. Integration Points**

| Integration Target | Report Type | Details |
| :--- | :--- | :--- |
| **Incidents** | `INCIDENT_SUMMARY` | สร้างรายงานสรุปเหตุการณ์: รวมรายละเอียดเหตุการณ์, รูปภาพ, Tasks, และ Surveys ที่เกี่ยวข้อง |
| **Tasks** | `TASK_PROGRESS` | สร้างรายงานความคืบหน้าของ Task: แสดงอัตราความสำเร็จ, ไทม์ไลน์, และรายละเอียด Task |
| **Surveys** | `SURVEY_RESULTS` | สร้างรายงานผลการสำรวจ: รวบรวมคำตอบ, แสดงผลในรูปแบบแผนภูมิ (Charts) และตาราง |

---

## 📋 IMPLEMENTATION CHECKLIST

### **Backend (Day 1)**
- [ ] Add `Report` & `ReportTemplate` models to Prisma schema
- [ ] Run migration
- [ ] Install `puppeteer`
- [ ] Create `ReportsModule`
- [ ] Create `ReportsService` (CRUD)
- [ ] Create `PdfGeneratorService`
- [ ] Create `ReportsController`
- [ ] Create template services
- [ ] Add Swagger docs
- [ ] Test endpoints with curl/Postman

### **Frontend (Day 2)**
- [ ] Create Report types
- [ ] Create Reports API client
- [ ] Create `ReportForm` component
- [ ] Create `ReportsList` component
- [ ] Create `ReportViewer` component
- [ ] Create `ReportsPage`
- [ ] Add navigation
- [ ] Test UI flow

### **Integration (Day 3)**
- [ ] Test report generation
- [ ] Test PDF download
- [ ] Test Thai fonts
- [ ] Fix bugs
- [ ] Polish UI
- [ ] Document
- [ ] Commit & push

### **Testing Scenarios**
- [ ] Create incident summary report
- [ ] Generate PDF
- [ ] Download PDF
- [ ] View in browser
- [ ] Verify Thai characters
- [ ] Test with images
- [ ] Test pagination

---

## 💾 PRISMA MIGRATION SCRIPT

**File:** `backend/prisma/migrations/YYYYMMDDHHMMSS_add_reports/migration.sql` (Note: `YYYYMMDDHHMMSS` is a placeholder for the actual timestamp)

```sql
-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('INCIDENT_SUMMARY', 'TASK_PROGRESS', 'SURVEY_RESULTS', 'MONTHLY_SUMMARY', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'GENERATING', 'READY', 'ERROR');

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "templateId" TEXT,
    "content" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "incidentId" TEXT,
    "taskIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "surveyIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdById" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ReportType" NOT NULL,
    "description" TEXT,
    "structure" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "reports_createdById_idx" ON "reports"("createdById");
CREATE INDEX "reports_incidentId_idx" ON "reports"("incidentId");
CREATE INDEX "reports_status_idx" ON "reports"("status");
CREATE INDEX "reports_type_idx" ON "reports"("type");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

---

## 📂 CODE SKELETON (Documented)

### **Backend Files to Create:**

```
backend/src/reports/
├── reports.module.ts
├── reports.service.ts
├── reports.controller.ts
├── pdf-generator.service.ts
├── templates/
│   ├── incident-summary.template.ts
│   ├── task-progress.template.ts
│   └── survey-results.template.ts
├── dto/
│   ├── create-report.dto.ts
│   └── update-report.dto.ts
└── entities/
    └── report.entity.ts
```

### **Frontend Files to Create:**

```
frontend/src/components/reports/
├── ReportForm.tsx
├── ReportsList.tsx
├── ReportViewer.tsx
├── ReportPreview.tsx
└── templates/
    ├── IncidentSummaryPreview.tsx
    ├── TaskProgressPreview.tsx
    └── SurveyResultsPreview.tsx

frontend/src/pages/supervisor/
└── ReportsPage.tsx

frontend/src/api/
└── reports.ts
```

---

## 🚀 ALTERNATIVE IMPLEMENTATION METHODS

### **Method 1: GitHub Direct Editing** ⭐ RECOMMENDED

**Process:**
1. Edit files directly in GitHub web interface
2. Commit changes
3. TypeScript will validate syntax
4. Test later when environment is stable

**Pros:**
- No local environment needed
- Always available
- Version controlled
- Can work anywhere

### **Method 2: Cloud IDE** 🌐

**Options:**
- GitHub Codespaces
- Replit
- CodeSandbox
- StackBlitz

**Pros:**
- Fresh environment
- No local issues
- Can run servers
- Shareable

**Try:**
1. Go to GitHub repo
2. Click "Code" → "Codespaces" → "Create codespace"
3. Wait for environment to load
4. Open terminal
5. `cd backend && npm install && npm run start:dev`
6. Open new terminal
7. `cd frontend && npm install && npm run dev`

---

## ✅ SUCCESS CRITERIA

- [ ] Can create reports
- [ ] Can generate PDF
- [ ] Thai fonts work
- [ ] Can download PDF
- [ ] UI is intuitive
- [ ] No console errors
