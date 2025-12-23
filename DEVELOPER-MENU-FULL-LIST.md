# 📋 Developer & Admin Module - Complete Menu List

**วันที่สร้าง**: 29 พฤศจิกายน 2568  
**ผู้จัดทำ**: Team W  
**วัตถุประสงค์**: รายการเมนูทั้งหมดใน Developer และ Admin Module เพื่อใช้ในการ Audit UX/UI และ API Connectivity

---

## 🎯 Overview

ระบบ Guardian Route มีเมนูทั้งหมด **6 หมวดหมู่หลัก** ใน Developer Dashboard:
1. **Testing Forms** (2 เมนู)
2. **Field Officer Views** (4 เมนู)
3. **Supervisor Views** (4 เมนู)
4. **Executive Views** (3 เมนู)
5. **Admin Views** (6 เมนู)
6. **Documentation** (2 เมนู)

**รวมทั้งหมด: 21 เมนู** + **6 เมนู Admin Sidebar** = **27 เมนู**

---

## 📊 Menu Categories

### 1. 🧪 Testing Forms (Dev Only)

| # | Menu Name | Path | Component | Access Role |
|---|-----------|------|-----------|-------------|
| 1.1 | Test: Create Report | `/developer/test/create-report` | `TestCreateReportPage` | DEVELOPER |
| 1.2 | Test: Survey Form | `/developer/test/survey-form` | `TestSurveyFormPage` | DEVELOPER |

**Purpose**: ทางลัดเข้าถึงฟอร์มต่างๆ โดยไม่ต้องผ่าน Workflow - สำหรับทดสอบ UI และ Validation

---

### 2. 🎯 Field Officer Views

| # | Menu Name | Path | Component | Access Role |
|---|-----------|------|-----------|-------------|
| 2.1 | งานของฉัน (My Tasks) | `/field-officer/tasks` | `FieldOfficerDashboard` | FIELD_OFFICER |
| 2.2 | ขั้นตอนการทำงาน (Workflow) | `/developer/field-officer/workflow` | `DevFieldOfficerWorkflowPage` | DEVELOPER |
| 2.3 | แผนที่และรายงาน (Map & Reports) | `/supervisor/map` | `MapView` | ALL |
| 2.4 | ประวัติการรายงาน (Report History) | `/reports` | `ReportsPage` | ALL |

**Purpose**: มุมมองและเครื่องมือสำหรับเจ้าหน้าที่ภาคสนาม

---

### 3. 👨‍💼 Supervisor Views

| # | Menu Name | Path | Component | Access Role |
|---|-----------|------|-----------|-------------|
| 3.1 | แดชบอร์ดบัญชาการ (Command Dashboard) | `/supervisor` | `SupervisorDashboardModern` | SUPERVISOR |
| 3.2 | จัดการเหตุการณ์ (Manage Incidents) | `/supervisor/incidents` | `ManageIncidentsPage` | SUPERVISOR |
| 3.3 | ภาพรวมทีม (Team Overview) | `/developer/supervisor/team` | `DevSupervisorTeamPage` | DEVELOPER |
| 3.4 | วิเคราะห์ข้อมูลสำรวจ (Survey Analysis) | `/analysis/survey` | `SurveyAnalysisPage` | SUPERVISOR |

**Purpose**: เครื่องมือสั่งการและบริหารจัดการทีม

---

### 4. 💼 Executive Views

| # | Menu Name | Path | Component | Access Role |
|---|-----------|------|-----------|-------------|
| 4.1 | แดชบอร์ดสรุป (Summary Dashboard) | `/executive-dashboard` | `ExecutiveDashboardNew` | EXECUTIVE |
| 4.2 | รายงานและสถิติ (Reports & Statistics) | `/developer/executive/reports` | `DevExecutiveReportsPage` | DEVELOPER |
| 4.3 | ภาพรวมงบประมาณ (Budget Overview) | `/developer/executive/budget` | `DevExecutiveBudgetPage` | DEVELOPER |

**Purpose**: ภาพรวมระดับผู้บริหารและรายงานสรุป

---

### 5. ⚙️ Admin Views (Developer Dashboard)

| # | Menu Name | Path | Component | Access Role |
|---|-----------|------|-----------|-------------|
| 5.1 | แดชบอร์ดระบบ (System Dashboard) | `/admin/dashboard` | `AdminDashboardV2` | ADMIN |
| 5.2 | จัดการผู้ใช้ (Manage Users) | `/manage-users` | `ManageUsersPage` | ADMIN |
| 5.3 | จัดการข้อมูล (Manage Data) | `/developer/admin/data` | `DevAdminDataPage` | DEVELOPER |
| 5.4 | กำหนดขอบเขตหมู่บ้าน (Village Boundaries) | `/admin/villages` | `VillageBoundariesPage` | ADMIN |
| 5.5 | ตั้งค่า (Settings) | `/settings` | `SettingsPage` | ADMIN |
| 5.6 | Audit Log | `/admin/audit-logs` | `AuditLogsPage` | ADMIN |

**Purpose**: เครื่องมือจัดการระบบและข้อมูลพื้นฐาน

---

### 6. 📚 Documentation

| # | Menu Name | Path | Component | Access Role |
|---|-----------|------|-----------|-------------|
| 6.1 | คู่มือนักพัฒนา (Developer Handbook) | `/developer-handbook` | `DeveloperHandbookPage` | PUBLIC |
| 6.2 | API Documentation | `/developer/api-docs` | `ApiDocsPage` | DEVELOPER |

**Purpose**: เอกสารและคู่มือสำหรับนักพัฒนา

---

## 🗂️ Admin Sidebar Menu (Actual Admin Role)

| # | Menu Name | Path | Component | Access Role |
|---|-----------|------|-----------|-------------|
| A.1 | แดชบอร์ดระบบ (System Dashboard) | `/dashboard/admin` | `AdminDashboardV2` | ADMIN |
| A.2 | จัดการผู้ใช้ (Manage Users) | `/manage-users` | `ManageUsersPage` | ADMIN |
| A.3 | จัดการข้อมูล (Manage Data) | `/manage-data` | `ManageDataPage` | ADMIN |
| A.4 | กำหนดขอบเขตหมู่บ้าน (Village Boundaries) | `/village-boundaries` | `VillageBoundariesPage` | ADMIN |
| A.5 | ตั้งค่า (Settings) | `/settings` | `SettingsPage` | ADMIN |
| A.6 | Audit Log | `/audit-log` | `AuditLogsPage` | ADMIN |

**Note**: Admin Sidebar มีเมนูที่แตกต่างจาก Developer Dashboard เล็กน้อย (path และ component บางส่วนต่างกัน)

---

## 📝 Additional Routes (Not in Main Menu)

### Field Officer Routes
| Path | Component | Purpose |
|------|-----------|---------|
| `/dashboard/officer` | `FieldOfficerDashboard` | Field Officer Dashboard |
| `/field-officer/dashboard` | `FieldOfficerDashboardNew` | Field Officer Dashboard (New) |
| `/workflow-guide` | `WorkflowGuidePage` | Workflow Guide |
| `/map-incidents` | `MapIncidentPage` | Map Incidents |
| `/survey-area` | `SurveyAreaPage` | Survey Area |
| `/report-history` | `ReportHistoryPage` | Report History |
| `/create-incident` | `CreateIncidentReportPage` | Create Incident Report |
| `/field-survey/:taskId` | `InitialSurveyPage` | Initial Survey |
| `/detailed-assessment/:taskId` | `DetailedAssessmentPage` | Detailed Assessment |

### Supervisor Routes
| Path | Component | Purpose |
|------|-----------|---------|
| `/dashboard/supervisor` | `SupervisorDashboardModern` | Supervisor Dashboard |
| `/manage-incidents` | `ManageIncidentsPage` | Manage Incidents |
| `/team-overview` | `TeamOverviewPage` | Team Overview |
| `/operational-reports` | `OperationalReportsPage` | Operational Reports |
| `/supervisor/incidents` | `ManageIncidentsPage` | Manage Incidents (Alt) |
| `/supervisor/survey-templates` | `SurveyTemplateList` | Survey Templates |
| `/supervisor/survey-templates/new` | `SurveyFormBuilder` | Create Survey Template |
| `/supervisor/survey-templates/edit/:id` | `SurveyFormBuilder` | Edit Survey Template |

### Executive Routes
| Path | Component | Purpose |
|------|-----------|---------|
| `/dashboard/executive` | `ExecutiveDashboardNew` | Executive Dashboard |
| `/executive/analytics` | `ExecutiveAnalytics` | Analytics |
| `/executive/budget-resources` | `ExecutiveBudgetResources` | Budget & Resources |
| `/executive/geospatial-analysis` | `ExecutiveGeospatialAnalysis` | Geospatial Analysis |
| `/reports-statistics` | `ReportsStatisticsPage` | Reports & Statistics |

### Shared Routes
| Path | Component | Purpose |
|------|-----------|---------|
| `/profile` | `ProfilePage` | User Profile |
| `/reports` | `ReportsPage` | Reports List |
| `/reports/new` | `CreateReportPage` | Create Report |
| `/reports/:id` | `ReportDetailsPage` | Report Details |
| `/reports/:id/edit` | `EditReportPage` | Edit Report |
| `/reports/create-full/:taskId` | `CreateFullReportPage` | Create Full Report |
| `/tasks` | `TasksPage` | Tasks |
| `/tasks/my-tasks` | `MyTasksPage` | My Tasks |
| `/analytics` | `AnalyticsDashboard` | Analytics Dashboard |
| `/analysis/overlay` | `OverlayMapPage` | Overlay Map |
| `/survey-analysis` | `SurveyAnalysisPage` | Survey Analysis |

---

## 🎨 Settings Page Tabs (6 Tabs)

ตามเอกสาร SA, Settings Page ต้องมี 6 tabs:

| # | Tab Name | Type | Description |
|---|----------|------|-------------|
| 1 | ทั่วไป (General) | `general` | ชื่อแอป, timezone, โหมดบำรุงรักษา |
| 2 | ผู้ใช้และความปลอดภัย (Users & Security) | `security` | 2FA, password policy, session timeout, IP allowlist |
| 3 | แผนที่และภูมิสารสนเทศ (Map & GIS) | `map` | default lat/lng/zoom, base layer, tile server, weather radar |
| 4 | การแจ้งเตือน (Notifications) | `notifications` | email/SMS toggles, LINE Notify token |
| 5 | การเชื่อมต่อและ API (Connectivity & API) | `api` | Weather API, SMS Gateway, rate limiting |
| 6 | ข้อมูลและพื้นที่จัดเก็บ (Data & Storage) | `data` | retention policy, backup frequency, purge data, factory reset |

---

## 📊 Summary Statistics

### By Category:
- **Testing Forms**: 2 menus
- **Field Officer Views**: 4 menus
- **Supervisor Views**: 4 menus
- **Executive Views**: 3 menus
- **Admin Views**: 6 menus
- **Documentation**: 2 menus

### By Role:
- **DEVELOPER**: 21 menus (full access)
- **ADMIN**: 6 menus (sidebar)
- **SUPERVISOR**: 4 menus (sidebar)
- **EXECUTIVE**: 4 menus (sidebar)
- **FIELD_OFFICER**: 5 menus (sidebar)

### Total Routes:
- **Main Menu Items**: 27 menus
- **Additional Routes**: 35+ routes
- **Settings Tabs**: 6 tabs
- **Grand Total**: 68+ pages/views

---

## 🔍 Notes

1. **Developer Dashboard** มีเมนูมากที่สุด (21 เมนู) เพราะเป็น "Hub" สำหรับทดสอบทุก Role
2. **Admin Sidebar** มีเมนู 6 รายการ ซึ่งบางรายการ path ต่างจาก Developer Dashboard
3. **Settings Page** มี 6 tabs ตามเอกสาร SA
4. มี **Duplicate Routes** บางส่วน (เช่น `/admin/dashboard` vs `/dashboard/admin`)
5. บาง Routes ยังไม่มี Component (ต้องสร้างใหม่)

---

## ✅ Next Steps

1. ใช้รายการนี้เป็นพื้นฐานในการทำ **Menu Status Matrix**
2. ตรวจสอบแต่ละเมนูว่า:
   - มี UI หรือยัง
   - UI ทำงานถูกต้องหรือไม่
   - เชื่อมต่อ API หรือยัง
   - มี Bug หรือไม่
3. จัดลำดับความสำคัญของงานที่ต้องทำ
4. Estimate เวลาในการแก้ไข/พัฒนา

---

**จัดทำโดย Team W** 🚀
