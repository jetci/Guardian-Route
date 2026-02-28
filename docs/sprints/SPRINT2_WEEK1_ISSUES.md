# Sprint 2 Week 1 - GitHub Issues

**Project:** Guardian Route - Disaster Management System  
**Sprint:** 2  
**Week:** 1  
**Date:** November 9, 2025

---

## Issue #1: [Sprint2][Week1][Backend] สร้าง API Endpoint: GET /api/analytics/kpi-summary

**Labels:** `Sprint2`, `Week1`, `type:feature`, `backend`  
**Assignee:** Backend Lead  
**Deadline:** November 11, 2025

### 📋 Task Description

สร้าง Analytics API Endpoint สำหรับดึงข้อมูล KPI Summary ของ Dashboard

### 🎯 Acceptance Criteria

- [ ] สร้าง endpoint `GET /api/analytics/kpi-summary`
- [ ] Response ตามรูปแบบที่กำหนด
- [ ] คำนวณ avgResolutionTime จาก `resolvedAt - createdAt`
- [ ] ใช้ Prisma aggregation สำหรับ performance
- [ ] เพิ่ม Unit Tests (coverage ≥ 80%)
- [ ] เพิ่ม API Documentation

### 📊 Expected Response

```json
{
  "total": 150,
  "pending": 25,
  "investigating": 40,
  "resolved": 85,
  "avgResolutionTime": "3.5h"
}
```

### 🔧 Technical Notes

- ใช้ Prisma `count()` และ `aggregate()`
- คำนวณ avgResolutionTime เป็นชั่วโมง (1 decimal place)
- พิจารณา Caching (Redis) สำหรับ performance

### 📅 Deadline

**11 พฤศจิกายน 2025**

### 🔗 Related

- Sprint 2 Planning: `/docs/sprints/SPRINT2_PLANNING.md`
- Feature Spec: `/docs/features/EXECUTIVE_DASHBOARD_SPEC.md`

---

## Issue #2: [Sprint2][Week1][Backend] สร้าง API Endpoint: GET /api/analytics/by-status

**Labels:** `Sprint2`, `Week1`, `type:feature`, `backend`  
**Assignee:** Backend  
**Deadline:** November 11, 2025

### 📋 Task Description

สร้าง Analytics API Endpoint สำหรับดึงข้อมูลสัดส่วนเหตุการณ์ตามสถานะ

### 🎯 Acceptance Criteria

- [ ] สร้าง endpoint `GET /api/analytics/by-status`
- [ ] Response ตามรูปแบบที่กำหนด
- [ ] ใช้ Prisma `groupBy` สำหรับ aggregation
- [ ] เพิ่ม Unit Tests (coverage ≥ 80%)
- [ ] เพิ่ม API Documentation

### 📊 Expected Response

```json
[
  { "status": "PENDING", "count": 25 },
  { "status": "INVESTIGATING", "count": 40 },
  { "status": "RESOLVED", "count": 85 },
  { "status": "REJECTED", "count": 10 }
]
```

### 🔧 Technical Notes

- ใช้ Prisma `groupBy({ by: ['status'], _count: true })`
- Return ทุกสถานะ แม้ count = 0
- Sort by status (PENDING, INVESTIGATING, RESOLVED, REJECTED)

### 📅 Deadline

**11 พฤศจิกายน 2025**

### 🔗 Related

- Sprint 2 Planning: `/docs/sprints/SPRINT2_PLANNING.md`
- Feature Spec: `/docs/features/EXECUTIVE_DASHBOARD_SPEC.md`

---

## Issue #3: [Sprint2][Week1][Frontend] สร้างหน้า /dashboard และ Layout

**Labels:** `Sprint2`, `Week1`, `type:feature`, `frontend`  
**Assignee:** Frontend Lead  
**Deadline:** November 11, 2025

### 📋 Task Description

สร้างหน้า Dashboard พร้อม Layout และ Dummy Components สำหรับ 7 widgets

### 🎯 Acceptance Criteria

- [ ] สร้าง route `/dashboard` ใน App.tsx
- [ ] สร้าง `DashboardPage.tsx` component
- [ ] สร้าง Grid Layout (responsive) สำหรับ 7 widgets
- [ ] สร้าง Dummy Components สำหรับ widgets ทั้ง 7:
  - [ ] KPISummaryBar
  - [ ] IncidentsByStatusChart
  - [ ] IncidentsByPriorityChart
  - [ ] IncidentHotspotsMap
  - [ ] IncidentTrendChart
  - [ ] FieldOfficerWorkloadTable
  - [ ] ExportToPDFButton
- [ ] ใช้ Placeholder text สำหรับแต่ละ widget
- [ ] Responsive design (desktop ≥ 1280px)

### 🎨 UI/UX Notes

```
+----------------------------------------------------------------------+
| [Guardian Route] Executive Dashboard         [Last Updated: 1 min ago] |
+----------------------------------------------------------------------+
| [ KPI Summary Bar - 5 metrics ]                                      |
+----------------------------------------------------------------------+
|                            |                                         |
| Widget: Status Chart       |      Widget: Trend Chart                |
|                            |                                         |
+----------------------------+-----------------------------------------+
|                            |                                         |
| Widget: Priority Chart     |      Widget: Hotspots Map               |
|                            |                                         |
+----------------------------+-----------------------------------------+
|                                                                      |
|                    Widget: Officer Workload Table                    |
+----------------------------------------------------------------------+
```

### 🔧 Technical Notes

- ใช้ Chakra UI Grid หรือ CSS Grid
- แต่ละ widget ใช้ Card/Box component
- เพิ่ม Loading skeleton (Phase 2)

### 📅 Deadline

**11 พฤศจิกายน 2025**

### 🔗 Related

- Sprint 2 Planning: `/docs/sprints/SPRINT2_PLANNING.md`
- Feature Spec: `/docs/features/EXECUTIVE_DASHBOARD_SPEC.md`

---

## Issue #4: [Sprint2][Week1][Frontend] ติดตั้งและ Setup Libraries

**Labels:** `Sprint2`, `Week1`, `type:setup`, `frontend`  
**Assignee:** Frontend  
**Deadline:** November 11, 2025

### 📋 Task Description

ติดตั้งและ Setup Charting และ Map Libraries สำหรับ Dashboard

### 🎯 Acceptance Criteria

- [ ] ติดตั้ง `recharts` (latest version)
- [ ] ติดตั้ง `leaflet` และ `react-leaflet`
- [ ] ติดตั้ง `react-leaflet-cluster` (สำหรับ marker clustering)
- [ ] สร้าง Test Page สำหรับทดสอบ Recharts (Donut, Bar, Line charts)
- [ ] สร้าง Test Page สำหรับทดสอบ Leaflet Map
- [ ] เพิ่ม Leaflet CSS ใน index.html หรือ App.tsx
- [ ] Document การใช้งานใน README

### 📦 Dependencies

```bash
pnpm add recharts leaflet react-leaflet react-leaflet-cluster
pnpm add -D @types/leaflet
```

### 🔧 Technical Notes

**Recharts Test:**
- สร้าง `/src/test-pages/ChartsTestPage.tsx`
- ทดสอบ DonutChart, BarChart, LineChart
- ใช้ mock data

**Leaflet Test:**
- สร้าง `/src/test-pages/MapTestPage.tsx`
- ทดสอบ Map with markers
- ทดสอบ Marker clustering

### 📅 Deadline

**11 พฤศจิกายน 2025**

### 🔗 Related

- Recharts Docs: https://recharts.org/
- React-Leaflet Docs: https://react-leaflet.js.org/

---

## Issue #5: [Sprint2][Week1][UX] ส่ง UX Final Mockup + Component Spec

**Labels:** `Sprint2`, `Week1`, `type:design`, `ux`  
**Assignee:** UX/UI Designer  
**Deadline:** November 12, 2025

### 📋 Task Description

ส่ง Final Mockup และ Component Specification สำหรับ Dashboard Widgets ทั้ง 7

### 🎯 Deliverables

- [ ] Figma Design สำหรับ Dashboard (Desktop 1280px+)
- [ ] Screenshot ของแต่ละ Widget (PNG, high-res)
- [ ] Component Spec (Markdown) ระบุ:
  - Colors (HEX codes)
  - Typography (Font sizes, weights)
  - Spacing (Padding, margins)
  - Border radius, shadows
  - Hover states, active states
- [ ] Icon assets (SVG) ถ้ามี

### 📁 Deliverable Format

```
/docs/design/
  ├── dashboard-mockup.fig (Figma file)
  ├── dashboard-mockup.png (Screenshot)
  ├── widgets/
  │   ├── kpi-summary-bar.png
  │   ├── status-chart.png
  │   ├── priority-chart.png
  │   ├── hotspots-map.png
  │   ├── trend-chart.png
  │   ├── workload-table.png
  │   └── export-button.png
  └── DASHBOARD_COMPONENT_SPEC.md
```

### 🎨 Design Notes

- ใช้ Color Palette ของ Guardian Route
- Accessible colors (WCAG AA)
- Consistent with existing UI

### 📅 Deadline

**12 พฤศจิกายน 2025**

### 🔗 Related

- Feature Spec: `/docs/features/EXECUTIVE_DASHBOARD_SPEC.md`
- PRD: `/docs/features/EXECUTIVE_DASHBOARD_PRD.md`

---

## Issue #6: [Sprint2][Week1][QA] Generate Incident Test Data

**Labels:** `Sprint2`, `Week1`, `type:testing`, `qa`  
**Assignee:** QA  
**Deadline:** November 13, 2025

### 📋 Task Description

สร้าง Test Data สำหรับ Incidents จำนวน ≥ 100 รายการ พร้อมความหลากหลายของ status และ priority

### 🎯 Acceptance Criteria

- [ ] สร้าง Test Data ≥ 100 incidents
- [ ] ครอบคลุมทุก Status: PENDING, INVESTIGATING, RESOLVED, REJECTED
- [ ] ครอบคลุมทุก Priority: CRITICAL, HIGH, MEDIUM, LOW
- [ ] มี `resolvedAt` สำหรับ incidents ที่ RESOLVED
- [ ] มี `assignedTo` สำหรับ incidents ที่ INVESTIGATING/RESOLVED
- [ ] มี Location (lat, lng) ที่หลากหลาย
- [ ] มี Photos สำหรับบางรายการ
- [ ] Export เป็น SQL seed file หรือ JSON

### 📊 Distribution Suggestion

| Status | Count | Priority Distribution |
|---|---|---|
| PENDING | 25 | CRITICAL: 5, HIGH: 10, MEDIUM: 7, LOW: 3 |
| INVESTIGATING | 40 | CRITICAL: 8, HIGH: 15, MEDIUM: 12, LOW: 5 |
| RESOLVED | 30 | CRITICAL: 3, HIGH: 10, MEDIUM: 12, LOW: 5 |
| REJECTED | 5 | Any |

### 🔧 Technical Notes

- ใช้ Faker.js หรือ Script สำหรับ generate data
- ใช้ Prisma seed script: `/backend/prisma/seed.ts`
- Location ควรอยู่ในพื้นที่ประเทศไทย

### 📅 Deadline

**13 พฤศจิกายน 2025**

### 🔗 Related

- Prisma Seeding: https://www.prisma.io/docs/guides/database/seed-database

---

## Issue #7: [Sprint2][Week1][SA] เปิด GitHub Issues สำหรับ Sprint 2 Week 1

**Labels:** `Sprint2`, `Week1`, `type:admin`  
**Assignee:** System Analyst  
**Deadline:** November 9, 2025

### 📋 Task Description

สร้าง GitHub Issues สำหรับ Task ทั้ง 6 รายการข้างต้น

### 🎯 Acceptance Criteria

- [ ] สร้าง Issue #1: Backend API kpi-summary
- [ ] สร้าง Issue #2: Backend API by-status
- [ ] สร้าง Issue #3: Frontend Dashboard Layout
- [ ] สร้าง Issue #4: Frontend Libraries Setup
- [ ] สร้าง Issue #5: UX Mockup & Spec
- [ ] สร้าง Issue #6: QA Test Data
- [ ] แต่ละ Issue มี Labels: `Sprint2`, `Week1`, `type:*`, team tag
- [ ] แต่ละ Issue มี Assignee
- [ ] แต่ละ Issue มี Deadline ใน Description

### 📅 Deadline

**9 พฤศจิกายน 2025 (วันนี้)**

### 🔗 Related

- Sprint 2 Planning: `/docs/sprints/SPRINT2_PLANNING.md`

---

## Summary

**Total Issues:** 7  
**Backend:** 2 issues  
**Frontend:** 2 issues  
**UX/UI:** 1 issue  
**QA:** 1 issue  
**SA:** 1 issue

**Week 1 Deadline:** November 13, 2025

---

**Status:** 📝 Ready to Create  
**Date:** November 9, 2025
