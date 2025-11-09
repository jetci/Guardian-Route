#!/bin/bash

# Create Sprint 2 Week 1 GitHub Issues
# Usage: ./scripts/create-sprint2-week1-issues.sh

set -e

REPO="jetci/Guardian-Route"

echo "📝 Creating Sprint 2 Week 1 Issues for $REPO..."

# Issue #1: Backend API kpi-summary
gh issue create \
  --repo $REPO \
  --title "[Sprint2][Week1][Backend] สร้าง API Endpoint: GET /api/analytics/kpi-summary" \
  --label "Sprint2,Week1,type:feature,backend,priority:high" \
  --body "## 📋 Task Description

สร้าง Analytics API Endpoint สำหรับดึงข้อมูล KPI Summary ของ Dashboard

## 🎯 Acceptance Criteria

- [ ] สร้าง endpoint \`GET /api/analytics/kpi-summary\`
- [ ] Response ตามรูปแบบที่กำหนด
- [ ] คำนวณ avgResolutionTime จาก \`resolvedAt - createdAt\`
- [ ] ใช้ Prisma aggregation สำหรับ performance
- [ ] เพิ่ม Unit Tests (coverage ≥ 80%)
- [ ] เพิ่ม API Documentation

## 📊 Expected Response

\`\`\`json
{
  \"total\": 150,
  \"pending\": 25,
  \"investigating\": 40,
  \"resolved\": 85,
  \"avgResolutionTime\": \"3.5h\"
}
\`\`\`

## 🔧 Technical Notes

- ใช้ Prisma \`count()\` และ \`aggregate()\`
- คำนวณ avgResolutionTime เป็นชั่วโมง (1 decimal place)
- พิจารณา Caching (Redis) สำหรับ performance

## 📅 Deadline

**11 พฤศจิกายน 2025**

## 🔗 Related

- Technical Spec: /docs/sprints/SPRINT2_WEEK1_BACKEND_SPEC.md
- Feature Spec: /docs/features/EXECUTIVE_DASHBOARD_SPEC.md"

echo "✅ Issue #1 created"

# Issue #2: Backend API by-status
gh issue create \
  --repo $REPO \
  --title "[Sprint2][Week1][Backend] สร้าง API Endpoint: GET /api/analytics/by-status" \
  --label "Sprint2,Week1,type:feature,backend,priority:high" \
  --body "## 📋 Task Description

สร้าง Analytics API Endpoint สำหรับดึงข้อมูลสัดส่วนเหตุการณ์ตามสถานะ

## 🎯 Acceptance Criteria

- [ ] สร้าง endpoint \`GET /api/analytics/by-status\`
- [ ] Response ตามรูปแบบที่กำหนด
- [ ] ใช้ Prisma \`groupBy\` สำหรับ aggregation
- [ ] เพิ่ม Unit Tests (coverage ≥ 80%)
- [ ] เพิ่ม API Documentation

## 📊 Expected Response

\`\`\`json
[
  { \"status\": \"PENDING\", \"count\": 25 },
  { \"status\": \"INVESTIGATING\", \"count\": 40 },
  { \"status\": \"RESOLVED\", \"count\": 85 },
  { \"status\": \"REJECTED\", \"count\": 10 }
]
\`\`\`

## 🔧 Technical Notes

- ใช้ Prisma \`groupBy({ by: ['status'], _count: true })\`
- Return ทุกสถานะ แม้ count = 0
- Sort by status order

## 📅 Deadline

**11 พฤศจิกายน 2025**

## 🔗 Related

- Technical Spec: /docs/sprints/SPRINT2_WEEK1_BACKEND_SPEC.md"

echo "✅ Issue #2 created"

# Issue #3: Frontend Dashboard Layout
gh issue create \
  --repo $REPO \
  --title "[Sprint2][Week1][Frontend] สร้างหน้า /dashboard และ Layout" \
  --label "Sprint2,Week1,type:feature,frontend,priority:high" \
  --body "## 📋 Task Description

สร้างหน้า Dashboard พร้อม Layout และ Dummy Components สำหรับ 7 widgets

## 🎯 Acceptance Criteria

- [ ] สร้าง route \`/dashboard\` ใน App.tsx
- [ ] สร้าง \`DashboardPage.tsx\` component
- [ ] สร้าง Grid Layout (responsive) สำหรับ 7 widgets
- [ ] สร้าง Dummy Components สำหรับ widgets ทั้ง 7
- [ ] ใช้ Placeholder text สำหรับแต่ละ widget
- [ ] Responsive design (desktop ≥ 1280px)

## 📦 Widgets

1. KPISummaryBar
2. IncidentsByStatusChart
3. IncidentsByPriorityChart
4. IncidentHotspotsMap
5. IncidentTrendChart
6. FieldOfficerWorkloadTable
7. ExportToPDFButton

## 📅 Deadline

**11 พฤศจิกายน 2025**

## 🔗 Related

- Technical Spec: /docs/sprints/SPRINT2_WEEK1_FRONTEND_SPEC.md"

echo "✅ Issue #3 created"

# Issue #4: Frontend Libraries Setup
gh issue create \
  --repo $REPO \
  --title "[Sprint2][Week1][Frontend] ติดตั้งและ Setup Libraries (Recharts, Leaflet)" \
  --label "Sprint2,Week1,type:setup,frontend,priority:high" \
  --body "## 📋 Task Description

ติดตั้งและ Setup Charting และ Map Libraries สำหรับ Dashboard

## 🎯 Acceptance Criteria

- [ ] ติดตั้ง \`recharts\`
- [ ] ติดตั้ง \`leaflet\` และ \`react-leaflet\`
- [ ] ติดตั้ง \`react-leaflet-cluster\`
- [ ] สร้าง Test Page สำหรับ Recharts
- [ ] สร้าง Test Page สำหรับ Leaflet Map
- [ ] เพิ่ม Leaflet CSS
- [ ] Document การใช้งาน

## 📦 Installation

\`\`\`bash
pnpm add recharts leaflet react-leaflet react-leaflet-cluster
pnpm add -D @types/leaflet
\`\`\`

## 📅 Deadline

**11 พฤศจิกายน 2025**

## 🔗 Related

- Technical Spec: /docs/sprints/SPRINT2_WEEK1_FRONTEND_SPEC.md"

echo "✅ Issue #4 created"

# Issue #5: UX Mockup
gh issue create \
  --repo $REPO \
  --title "[Sprint2][Week1][UX] ส่ง UX Final Mockup + Component Spec" \
  --label "Sprint2,Week1,type:design,ux,priority:medium" \
  --body "## 📋 Task Description

ส่ง Final Mockup และ Component Specification สำหรับ Dashboard Widgets ทั้ง 7

## 🎯 Deliverables

- [ ] Figma Design สำหรับ Dashboard (Desktop 1280px+)
- [ ] Screenshot ของแต่ละ Widget (PNG, high-res)
- [ ] Component Spec (Markdown)
- [ ] Icon assets (SVG) ถ้ามี

## 📅 Deadline

**12 พฤศจิกายน 2025**

## 🔗 Related

- Feature Spec: /docs/features/EXECUTIVE_DASHBOARD_SPEC.md"

echo "✅ Issue #5 created"

# Issue #6: QA Test Data
gh issue create \
  --repo $REPO \
  --title "[Sprint2][Week1][QA] Generate Incident Test Data (≥100 รายการ)" \
  --label "Sprint2,Week1,type:testing,qa,priority:medium" \
  --body "## 📋 Task Description

สร้าง Test Data สำหรับ Incidents จำนวน ≥ 100 รายการ

## 🎯 Acceptance Criteria

- [ ] สร้าง Test Data ≥ 100 incidents
- [ ] ครอบคลุมทุก Status และ Priority
- [ ] มี \`resolvedAt\` สำหรับ RESOLVED incidents
- [ ] มี \`assignedTo\` สำหรับ INVESTIGATING/RESOLVED
- [ ] มี Location ที่หลากหลาย
- [ ] Verify distribution

## 🔧 How to Run

\`\`\`bash
cd backend
npx ts-node prisma/seed-incidents.ts
\`\`\`

## 📅 Deadline

**13 พฤศจิกายน 2025**

## 🔗 Related

- Script: /backend/prisma/seed-incidents.ts
- Guide: /docs/sprints/SPRINT2_WEEK1_TEST_DATA_GUIDE.md"

echo "✅ Issue #6 created"

echo ""
echo "🎉 All Sprint 2 Week 1 Issues created successfully!"
echo "📊 Total: 6 issues"
echo ""
echo "Next steps:"
echo "1. Assign issues to team members"
echo "2. Add issues to Sprint 2 Project Board"
echo "3. Share links in Slack #guardian-route-sprint2"
