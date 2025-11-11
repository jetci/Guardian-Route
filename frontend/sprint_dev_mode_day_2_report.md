# รายงานความคืบหน้า Sprint: Developer Mode (Module 9) - Day 2

**โครงการ:** Guardian-Route (Frontend)
**Sprint:** Developer Mode (Module 9)
**วันที่:** 2
**เป้าหมายหลักของ Sprint Day 2:** พัฒนา API Debug Panel และ Axios Interceptor

## สรุปผลการดำเนินงาน (Day 2)

| Task | สถานะ | รายละเอียด |
| :--- | :--- | :--- |
| **Axios Interceptor** | **✅ สำเร็จ** | สร้าง `setupApiLoggingInterceptor.ts` เพื่อ Intercept ทุก Request/Response ของ Axios และคำนวณ `duration` |
| **Context สำหรับเก็บ Log** | **✅ สำเร็จ** | สร้าง `ApiLogContext.tsx` เพื่อจัดการ Log Store แบบ In-memory โดยจำกัดจำนวน Log ล่าสุดไว้ที่ 50 รายการ |
| **Debug Panel UI** | **✅ สำเร็จ** | สร้าง `DevDebugPanel.tsx` ซึ่งเป็น Floating Button ที่เปิด Panel แสดงรายการ API Call พร้อม Filter (ALL, SUCCESS, ERROR, PENDING) และรายละเอียด Request/Response/Error |
| **Integration** | **✅ สำเร็จ** | ผนวก `ApiLogProvider` และ `DevDebugPanel` เข้ากับ `App.tsx` และใช้ `useApiLogInterceptor` เพื่อเชื่อม Context กับ Interceptor |

## รายละเอียดการดำเนินการ

### 1. ApiLogContext
*   กำหนด `ApiLogEntry` interface ที่ครอบคลุมข้อมูลที่จำเป็น (`method`, `url`, `status`, `duration`, `error`, `requestData`, `responseData`)
*   ใช้ `useState` และ `useCallback` ใน `ApiLogProvider` เพื่อประสิทธิภาพในการจัดการ Log Array

### 2. Axios Interceptor (`setupApiLoggingInterceptor.ts`)
*   ใช้ Global Ref (`addLogRef`, `updateLogRef`) เพื่อให้ Interceptor ที่อยู่นอก React Component สามารถเข้าถึงฟังก์ชัน Context ได้
*   ใน Request Interceptor: บันทึก Log เริ่มต้นด้วยสถานะ `PENDING` และบันทึก `_startTime` และ `_logId` ไว้ใน `config`
*   ใน Response Interceptor: ใช้ `_logId` และ `_startTime` เพื่ออัปเดตสถานะ (`status`, `duration`, `responseData`)
*   จัดการ Error Interceptor เพื่อบันทึกข้อผิดพลาดของ Network หรือ HTTP Status Code ที่เป็น Error

### 3. DevDebugPanel
*   ใช้ `useApiLog()` hook เพื่อดึง Log และฟังก์ชัน `clearLogs`
*   มีปุ่ม Floating Button ที่แสดงจำนวน Error Count เมื่อ Panel ปิดอยู่
*   มีระบบ Filter Log ตามสถานะ (ALL, SUCCESS, ERROR, PENDING)
*   Log แต่ละรายการสามารถขยายเพื่อดูรายละเอียด Request/Response/Error ได้

## ข้อจำกัดที่พบ

*   เนื่องจาก Axios Interceptor ทำงานนอก React Component Tree จึงต้องใช้เทคนิค Global Ref (`addLogRef`, `updateLogRef`) เพื่อ "ฉีด" ฟังก์ชัน Context เข้าไปใน Interceptor ซึ่งเป็นวิธีปฏิบัติทั่วไปสำหรับกรณีนี้

## แผนงานถัดไป

*   **Day 3:** Developer Handbook
*   **Day 4:** Access Control (DevGuard)
*   **Day 5:** Manual Testing + UAT

**ไฟล์ที่เกี่ยวข้อง:**
*   `Guardian-Route/frontend/src/context/ApiLogContext.tsx`
*   `Guardian-Route/frontend/src/utils/setupApiLoggingInterceptor.ts`
*   `Guardian-Route/frontend/src/components/DevDebugPanel.tsx`
*   `Guardian-Route/frontend/src/App.tsx` (แก้ไข)
*   `Guardian-Route/frontend/sprint_dev_mode_day_2_report.md` (รายงานนี้)
