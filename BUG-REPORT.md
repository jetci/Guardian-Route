# 🐛 รายงานบัคที่พบและการแก้ไข - Guardian Route

**วันที่:** 11 พฤศจิกายน 2025  
**สถานะ:** กำลังแก้ไข

---

## ✅ ปัญหาที่แก้ไขแล้ว

### 1. **Backend Dependencies ผิด**
**ปัญหา:** `package.json` มี Chakra UI dependencies ที่ไม่ควรอยู่ใน backend
```json
"@chakra-ui/react": "^2.10.9",  // ❌ ควรอยู่ใน frontend เท่านั้น
"@emotion/react": "^11.14.0",
"@emotion/styled": "^11.14.1",
"framer-motion": "^10.18.0"
```

**การแก้ไข:** ✅ ลบ dependencies ที่ไม่จำเป็นออก

### 2. **bcrypt เวอร์ชันผิด**
**ปัญหา:** `"bcrypt": "^6.0.0"` ไม่มีเวอร์ชัน 6.x  
**การแก้ไข:** ✅ เปลี่ยนเป็น `"bcrypt": "^5.1.1"`

### 3. **ไฟล์ .env ไม่มี**
**ปัญหา:** ทั้ง backend และ frontend ไม่มีไฟล์ .env  
**การแก้ไข:** ✅ คัดลอกจาก .env.example

### 4. **Prisma Client ไม่ได้ generate**
**ปัญหา:** Prisma Client ยังไม่ได้ generate  
**การแก้ไข:** ✅ รัน `npx prisma generate`

### 5. **Role.REPORTER ไม่มีใน enum**
**ปัญหา:** ใช้ `Role.REPORTER` แต่ไม่มีใน Prisma schema  
**การแก้ไข:** ✅ เปลี่ยนเป็น `Role.FIELD_OFFICER` หรือ `Role.SUPERVISOR`

**ไฟล์ที่แก้ไข:**
- `src/report/report.controller.extension.ts`
- `src/notifications/notifications.service.ts`

### 6. **Report model ใช้ field 'content' ที่ไม่มี**
**ปัญหา:** `content` field ไม่มีใน Prisma schema  
**การแก้ไข:** ✅ เปลี่ยนเป็น `summary` และ `details`

**ไฟล์ที่แก้ไข:**
- `src/report/report.service.extension.ts`

### 7. **TasksService ขาด methods**
**ปัญหา:** ขาด `getMyTasks`, `acceptTask`, `updateSurveyData`  
**การแก้ไข:** ✅ เพิ่ม methods ทั้ง 3 ใน `tasks.service.ts`

### 8. **UsersService ขาด required fields**
**ปัญหา:** Prisma schema ต้องการ `username` และ `fullName`  
**การแก้ไข:** ✅ สร้าง fields จาก email และ firstName/lastName

### 9. **Import paths ผิด**
**ปัญหา:** หลายไฟล์ใช้ import path แบบเก่า  
**การแก้ไข:** ✅ แก้ไข paths ให้ถูกต้อง

**ตัวอย่าง:**
```typescript
// ❌ เก่า
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

// ✅ ใหม่
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrismaService } from '../database/prisma.service';
```

### 10. **IncidentStatus ใช้ค่าผิด**
**ปัญหา:** ใช้ `'REPORTED'`, `'INVESTIGATING'` ที่ไม่มีใน enum  
**การแก้ไข:** ✅ เปลี่ยนเป็น `'PENDING'`, `'IN_PROGRESS'`

---

## ⚠️ ปัญหาที่ยังไม่ได้แก้ไข

### 1. **Notification Models ไม่มีใน Prisma Schema**
**ปัญหา:** `notifications.service.ts` ใช้ `notification` และ `userNotification` models ที่ไม่มีใน schema

**ไฟล์ที่มีปัญหา:**
- `src/notifications/notifications.service.ts` (7 errors)

**วิธีแก้ไข (ชั่วคราว):**
- ✅ คอมเมนต์ `NotificationsModule` ออกจาก `app.module.ts`

**วิธีแก้ไขถาวร (ต้องทำ):**
- เพิ่ม Notification models ใน `prisma/schema.prisma`:

```prisma
model Notification {
  id          String   @id @default(uuid())
  title       String
  message     String
  type        String   // 'info', 'warning', 'error', 'success'
  createdAt   DateTime @default(now()) @map("created_at")
  
  userNotifications UserNotification[]
  
  @@map("notifications")
}

model UserNotification {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  notificationId String   @map("notification_id")
  isRead         Boolean  @default(false) @map("is_read")
  readAt         DateTime? @map("read_at")
  createdAt      DateTime @default(now()) @map("created_at")
  
  user         User         @relation(fields: [userId], references: [id])
  notification Notification @relation(fields: [notificationId], references: [id])
  
  @@index([userId])
  @@index([notificationId])
  @@map("user_notifications")
}
```

### 2. **Incident Model ไม่มี 'photos' field**
**ปัญหา:** `photos.service.ts` ใช้ `incident.photos` แต่ schema ใช้ `images`

**ไฟล์ที่มีปัญหา:**
- `src/incidents/photos.service.ts` (8 errors)

**วิธีแก้ไข:**
- เปลี่ยน `photos` เป็น `images` ทั้งหมดใน `photos.service.ts`

### 3. **Syntax Error ที่บรรทัด 217**
**ปัญหา:** `incidents.service.ts` มี syntax error

**ไฟล์ที่มีปัญหา:**
- `src/incidents/incidents.service.ts:217`

**ต้องตรวจสอบ:** โค้ดรอบๆ บรรทัด 217

---

## 📊 สรุปสถานะ

| หมวดหมู่ | สถานะ | จำนวนบัค |
|---------|-------|----------|
| **Dependencies** | ✅ แก้ไขแล้ว | 0 |
| **Configuration** | ✅ แก้ไขแล้ว | 0 |
| **Prisma Schema** | ✅ แก้ไขแล้ว | 0 |
| **Role Enum** | ✅ แก้ไขแล้ว | 0 |
| **Import Paths** | ✅ แก้ไขแล้ว | 0 |
| **Notification Module** | ⚠️ ชั่วคราว | 7 |
| **Photos Service** | ❌ ยังไม่แก้ | 8 |
| **Syntax Errors** | ❌ ยังไม่แก้ | 1 |
| **รวม** | **กำลังแก้ไข** | **16** |

---

## 🔧 ขั้นตอนต่อไป

### ลำดับความสำคัญ:

1. **แก้ไข Syntax Error** (บรรทัด 217)
2. **แก้ไข Photos Service** (เปลี่ยน photos → images)
3. **เพิ่ม Notification Models** (ถ้าต้องการใช้งาน)
4. **ทดสอบ Build Backend**
5. **ตรวจสอบ Frontend**
6. **ทดสอบรันระบบ**

---

## 💡 คำแนะนำ

### สำหรับ Notification System:
- **ตัวเลือก 1:** เพิ่ม models ใน Prisma schema (แนะนำ)
- **ตัวเลือก 2:** ลบ NotificationsModule ออกทั้งหมด (ถ้าไม่ใช้)

### สำหรับ Photos Service:
- ใช้ `images` field ที่มีอยู่แล้วใน Incident model
- หรือเปลี่ยนชื่อ field ใน schema เป็น `photos`

---

**หมายเหตุ:** รายงานนี้จะอัปเดตเมื่อแก้ไขบัคเพิ่มเติม
