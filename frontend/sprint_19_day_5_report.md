# รายงานความคืบหน้า Sprint 19 - วันที่ 5

**โครงการ:** Guardian-Route (Frontend)
**Sprint:** 19
**วันที่:** 5
**เป้าหมายหลักของ Sprint:** สร้าง Frontend Export Queue Status Panel บน MonitoringPage.tsx

## สรุปผลการดำเนินงาน (วันที่ 5)

| Task | สถานะ | รายละเอียด |
| :--- | :--- | :--- |
| เพิ่ม Section "Export Job Status" ใน MonitoringPage.tsx | **✅ สำเร็จ** | เพิ่ม Component ใหม่เพื่อแสดงสถานะ Job |
| เรียก API `GET /export/jobs` และ `GET /export/job/:id` | **✅ สำเร็จ** | สร้าง `src/api/export.ts` สำหรับ API Client และ `src/types/export.ts` สำหรับ Type Definition |
| ใช้ Polling (ทุก 10 วินาที) | **✅ สำเร็จ** | สร้าง Custom Hook `useExportJobsPolling.ts` เพื่อจัดการการ Polling และหยุด Polling เมื่อ Job เสร็จสิ้น |
| เพิ่ม Indicator: Status, เวลาที่ร้องขอ, เวลาสิ้นสุด | **✅ สำเร็จ** | Component `ExportJobStatusTable.tsx` แสดงข้อมูลทั้งหมดอย่างชัดเจน |
| เพิ่มปุ่ม Download ไฟล์ (เฉพาะ Status = done) | **✅ สำเร็จ** | เพิ่มปุ่ม "ดาวน์โหลด" ที่เรียกใช้ฟังก์ชัน `downloadExportFile` (Mocked Alert) |

## รายละเอียดการดำเนินการ

### 1. การเตรียม API Client และ Types

*   **Types:** สร้าง `src/types/export.ts` เพื่อกำหนด `ExportJobStatus` และ `ExportJob` Interface
*   **API Client:** สร้าง `src/api/export.ts` เพื่อรวมฟังก์ชัน `getExportJobs` และ `getExportJobStatus` ซึ่งจะเรียกใช้ Backend API ที่สร้างไว้ใน Day 3 และ Day 4

### 2. การสร้าง Custom Hook สำหรับ Polling

*   สร้าง `src/hooks/useExportJobsPolling.ts`
*   Hook นี้ใช้ `useEffect` และ `setInterval` เพื่อเรียก `getExportJobs` ทุก 10 วินาที
*   มีการปรับปรุง Logic ให้หยุด Polling เมื่อ Job ทั้งหมดที่แสดงอยู่ในสถานะ `DONE` หรือ `FAILED` เพื่อลดภาระการเรียก API

### 3. การสร้าง UI Component

*   สร้าง `src/components/ExportJobStatusTable.tsx`
*   Component นี้รับ `jobs` และ `isLoading` เป็น Props
*   แสดงตารางที่มีคอลัมน์สำหรับ **ประเภท**, **สถานะ** (พร้อมสีและ Animation สำหรับ `PROCESSING`), **ร้องขอเมื่อ**, **เสร็จสิ้นเมื่อ**, และ **ไฟล์**
*   ปุ่ม **"ดาวน์โหลด"** จะปรากฏเฉพาะ Job ที่มีสถานะ `DONE` และจะเรียกใช้ฟังก์ชัน `downloadExportFile` (ซึ่งถูก Mock เป็น `alert` ตามข้อกำหนด)

### 4. การรวมเข้ากับ MonitoringPage

*   แก้ไข `src/pages/MonitoringPage.tsx`
*   นำเข้า `useExportJobsPolling` และ `ExportJobStatusTable`
*   เพิ่ม Section **"Export Job Status"** ในส่วนบนของหน้า Monitoring Dashboard เพื่อให้ผู้ใช้เห็นสถานะ Job ของตนเองได้ทันที

## แผนงานถัดไป

*   ดำเนินการต่อใน Sprint 19 - Day 6 ตามแผนงานที่ได้รับมอบหมายต่อไป

**ไฟล์ที่เกี่ยวข้อง:**
*   `Guardian-Route/frontend/src/types/export.ts`
*   `Guardian-Route/frontend/src/api/export.ts`
*   `Guardian-Route/frontend/src/hooks/useExportJobsPolling.ts`
*   `Guardian-Route/frontend/src/components/ExportJobStatusTable.tsx`
*   `Guardian-Route/frontend/src/pages/MonitoringPage.tsx` (แก้ไข)
*   `Guardian-Route/frontend/sprint_19_day_5_report.md` (รายงานนี้)
