# Sprint 2 Week 1 - Test Data Generation Guide

**Project:** Guardian Route - Disaster Management System  
**Sprint:** 2  
**Week:** 1  
**For:** QA Team  
**Date:** November 9, 2025

---

## 1. Overview

เอกสารนี้เป็นคู่มือสำหรับ QA Team ในการ generate Test Data สำหรับ Incidents จำนวน 100 รายการ เพื่อใช้ในการทดสอบ Executive Dashboard

**Script Location:** `/backend/prisma/seed-incidents.ts`

---

## 2. Test Data Specifications

### 2.1. Distribution

| Status | Count | Priority Distribution |
|---|---|---|
| **PENDING** | 25 | CRITICAL: 5, HIGH: 10, MEDIUM: 7, LOW: 3 |
| **INVESTIGATING** | 40 | CRITICAL: 8, HIGH: 15, MEDIUM: 12, LOW: 5 |
| **RESOLVED** | 30 | CRITICAL: 3, HIGH: 10, MEDIUM: 12, LOW: 5 |
| **REJECTED** | 5 | CRITICAL: 1, HIGH: 2, MEDIUM: 1, LOW: 1 |
| **TOTAL** | **100** | CRITICAL: 17, HIGH: 37, MEDIUM: 32, LOW: 14 |

### 2.2. Data Characteristics

- **Created Date:** Random dates within the last 30 days
- **Locations:** 10 locations across Thailand (Bangkok, Chiang Mai, Phuket, etc.)
- **Incident Types:** Flood, Fire, Earthquake, Landslide, Storm, Accident, etc.
- **Assigned Officers:** Random Field Officers (for INVESTIGATING and RESOLVED incidents)
- **Resolution Time:** 0-10 hours (for RESOLVED incidents)

---

## 3. Prerequisites

### 3.1. Field Officers

Script จะตรวจสอบว่ามี Field Officers ในระบบหรือไม่ ถ้าไม่มี จะสร้างขึ้นมาอัตโนมัติ 5 คน:

- `officer1@guardian.test`
- `officer2@guardian.test`
- `officer3@guardian.test`
- `officer4@guardian.test`
- `officer5@guardian.test`

### 3.2. Database

ต้องมี Database ที่ถูก migrate แล้ว (Prisma schema ต้องอัปเดตล่าสุด)

---

## 4. How to Run

### 4.1. Navigate to Backend Directory

```bash
cd /home/ubuntu/Guardian-Route/backend
```

### 4.2. Run the Seed Script

```bash
npx ts-node prisma/seed-incidents.ts
```

### 4.3. Expected Output

```
🌱 Seeding test incidents...
✅ Successfully created 100 test incidents

Distribution:
  PENDING: 25
  INVESTIGATING: 40
  RESOLVED: 30
  REJECTED: 5
  TOTAL: 100
```

---

## 5. Verification

### 5.1. Check Total Count

```bash
npx prisma studio
```

หรือใช้ SQL query:

```sql
SELECT COUNT(*) FROM "Incident";
```

Expected: 100 incidents (หรือมากกว่า ถ้ามี incidents เดิมอยู่แล้ว)

### 5.2. Check Status Distribution

```sql
SELECT status, COUNT(*) as count
FROM "Incident"
GROUP BY status
ORDER BY status;
```

### 5.3. Check Priority Distribution

```sql
SELECT priority, COUNT(*) as count
FROM "Incident"
GROUP BY priority
ORDER BY priority;
```

### 5.4. Check Assigned Officers

```sql
SELECT COUNT(*) as assigned_count
FROM "Incident"
WHERE "assignedToId" IS NOT NULL;
```

Expected: ~70 (INVESTIGATING: 40 + RESOLVED: 30)

### 5.5. Check Resolved Incidents

```sql
SELECT COUNT(*) as resolved_count
FROM "Incident"
WHERE status = 'RESOLVED' AND "resolvedAt" IS NOT NULL;
```

Expected: 30

---

## 6. Cleanup (Optional)

ถ้าต้องการลบ test data และเริ่มใหม่:

```bash
# ⚠️ WARNING: This will delete ALL incidents
npx prisma migrate reset
```

หรือลบเฉพาะ incidents ที่สร้างจาก script:

```sql
-- Delete incidents created in the last hour (adjust as needed)
DELETE FROM "Incident"
WHERE "createdAt" > NOW() - INTERVAL '1 hour';
```

---

## 7. Customization

### 7.1. Change Distribution

แก้ไขค่า `DISTRIBUTION` ใน `seed-incidents.ts`:

```typescript
const DISTRIBUTION = {
  PENDING: { count: 30, priorities: { CRITICAL: 6, HIGH: 12, MEDIUM: 8, LOW: 4 } },
  // ... etc
};
```

### 7.2. Add More Locations

แก้ไข array `THAILAND_LOCATIONS`:

```typescript
const THAILAND_LOCATIONS = [
  { lat: 13.7563, lng: 100.5018, name: 'Bangkok' },
  { lat: 18.7883, lng: 98.9853, name: 'Chiang Mai' },
  // Add more...
];
```

### 7.3. Change Date Range

แก้ไขค่า `thirtyDaysAgo`:

```typescript
const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
const createdAt = randomDate(sixtyDaysAgo, now);
```

---

## 8. Troubleshooting

### 8.1. Error: "No field officers found"

Script จะสร้าง Field Officers อัตโนมัติ แต่ถ้ายังมีปัญหา ให้สร้าง manually:

```bash
# ใช้ Prisma Studio หรือ SQL
INSERT INTO "User" (email, username, password, role)
VALUES ('officer1@test.com', 'officer1', 'hashed_password', 'FIELD_OFFICER');
```

### 8.2. Error: "Unique constraint failed"

อาจมี incidents ที่ซ้ำกัน ให้ลบ incidents เดิมก่อน หรือแก้ไข script ให้ generate unique titles

### 8.3. Error: "ts-node: command not found"

ติดตั้ง ts-node:

```bash
npm install -g ts-node
# หรือ
pnpm add -D ts-node
```

---

## 9. Next Steps

หลังจาก generate test data แล้ว:

1. ✅ Verify ข้อมูลผ่าน Prisma Studio
2. ✅ Test Analytics API Endpoints (`/api/analytics/kpi-summary`, `/api/analytics/by-status`)
3. ✅ Test Dashboard widgets ด้วย real data
4. ✅ Document any issues found

---

**Status:** 📝 **Ready for QA**  
**Deadline:** November 13, 2025
