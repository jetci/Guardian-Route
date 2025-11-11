# Deprecated Files Notice

## ExecutiveDashboardPage.deprecated.tsx

**สถานะ:** Deprecated (เลิกใช้แล้ว)

**เหตุผล:**
- ไฟล์นี้ใช้ Chakra UI และ Components เก่าที่ไม่เชื่อมต่อกับ Backend API ใหม่
- ถูกแทนที่ด้วย `ExecutiveDashboard.tsx` ที่ใช้ Tailwind CSS และเชื่อมต่อกับ `/api/kpi/*` และ `/api/export/*`

**วันที่เลิกใช้:** 2025-11-10

**ไฟล์ใหม่ที่ใช้แทน:** `ExecutiveDashboard.tsx`

**การดำเนินการ:**
- ไฟล์นี้จะถูกลบออกใน Sprint ถัดไป (หลังจากการทดสอบเสร็จสมบูรณ์)
- หากมีการใช้งาน Components เก่า (KPISummaryBar, TrendChart, TypeDonutChart, CriticalIncidentsTable, RiskHeatmap) ให้ตรวจสอบและ migrate ไปใช้ Components ใหม่

**Components ใหม่:**
- `MonthlyTrendChart.tsx` (แทน TrendChart)
- `HazardTypeDonut.tsx` (แทน TypeDonutChart)
- `SevereEventTable.tsx` (แทน CriticalIncidentsTable)
- `RiskHeatMap.tsx` (แทน RiskHeatmap)
- `ExportButton.tsx` (อัปเดตให้ใช้ Backend API)
