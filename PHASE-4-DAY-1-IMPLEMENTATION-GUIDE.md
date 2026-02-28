# 🚀 Phase 4 Day 1 - Implementation Guide

**วันที่:** 28 พฤศจิกายน 2568  
**เวลา:** 14:20 น.  
**สถานะ:** ✅ Ready to Start

---

## ✅ สิ่งที่เสร็จแล้ว (Setup Complete)

### Backend
- ✅ `health.controller.ts` - 3 endpoints
- ✅ `health.service.ts` - Health check logic
- ✅ `health.module.ts` - Module configuration
- ✅ `app.module.ts` - **HealthModule registered แล้ว**

### Frontend
- ✅ `api/health.ts` - API client
- ✅ `HealthCheckCard.tsx` + CSS - Health status card
- ✅ `SystemStatsCard.tsx` + CSS - System statistics card
- ✅ `AdminDashboardPage.tsx` - **Updated แล้ว**

---

## 🎯 Morning Tasks (4 ชั่วโมง)

### Task 1: Restart Backend Server (5 นาที)
```bash
# ปิด backend server ที่รันอยู่ (Ctrl+C)
# จากนั้นรันใหม่
cd backend
npm run start:dev
```

**Expected Output:**
```
[Nest] Starting Nest application...
[Nest] HealthModule dependencies initialized
[Nest] Mapped {/api/health, GET} route
[Nest] Mapped {/api/health/system-stats, GET} route
[Nest] Mapped {/api/health/database, GET} route
✅ Guardian Route API is running on: http://localhost:3001
```

### Task 2: Test Health Endpoints (15 นาที)

#### Test 1: Basic Health Check
```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-28T07:20:00.000Z",
  "uptime": 123.45,
  "responseTime": "5ms",
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "database": "up",
    "api": "up"
  }
}
```

#### Test 2: System Stats
```bash
curl http://localhost:3001/api/health/system-stats
```

**Expected Response:**
```json
{
  "system": {
    "platform": "win32",
    "arch": "x64",
    "cpus": 8,
    "loadAverage": [0, 0, 0],
    "uptime": 123456
  },
  "memory": {
    "total": "16.00 GB",
    "used": "8.50 GB",
    "free": "7.50 GB",
    "usagePercent": 53
  },
  "process": {
    "uptime": 123.45,
    "memory": {
      "heapUsed": "45.23 MB",
      "heapTotal": "60.00 MB",
      "external": "1.23 MB",
      "rss": "120.45 MB"
    },
    "pid": 12345
  },
  "database": {
    "status": "connected",
    "activeConnections": 5
  },
  "statistics": {
    "activeUsers": 10,
    "totalIncidents": 50,
    "totalTasks": 30,
    "totalVillages": 15
  }
}
```

#### Test 3: Database Health
```bash
curl http://localhost:3001/api/health/database
```

**Expected Response:**
```json
{
  "status": "healthy",
  "connected": true,
  "activeConnections": 5,
  "timestamp": "2025-11-28T07:20:00.000Z"
}
```

### Task 3: Test Frontend (10 นาที)

1. เปิด browser: http://localhost:5173
2. Login ด้วย Admin account
3. ไปที่ Admin Dashboard: http://localhost:5173/admin/dashboard
4. ตรวจสอบ:
   - ✅ HealthCheckCard แสดงสถานะระบบ
   - ✅ SystemStatsCard แสดงข้อมูล CPU, Memory, Database
   - ✅ Auto-refresh ทุก 30 วินาที
   - ✅ ไม่มี console errors

### Task 4: Test Responsive Design (10 นาที)

#### Desktop (1920x1080)
- ✅ Cards แสดง 2 columns
- ✅ Stats แสดง 4 columns
- ✅ ข้อความอ่านง่าย

#### Tablet (768x1024)
- ✅ Cards แสดง 1 column
- ✅ Stats แสดง 2 columns
- ✅ Layout ไม่เบี้ยว

#### Mobile (375x667)
- ✅ Cards แสดง 1 column
- ✅ Stats แสดง 1 column
- ✅ Text ไม่ล้น

---

## ⚙️ Afternoon Tasks (4 ชั่วโมง)

### Task 5: Enhanced Audit Logs (ใช้ component ที่มีอยู่)

ตรวจสอบ `AuditLogTable.tsx` ที่มีอยู่แล้ว:
```bash
# ดูไฟล์
cat frontend/src/components/admin/AuditLogTable.tsx
```

**ถ้ายังไม่มี features เหล่านี้ ให้เพิ่ม:**

#### Feature 1: Date Range Filter
```typescript
const [dateRange, setDateRange] = useState({
  startDate: null,
  endDate: null,
});

// Add DatePicker component
<DateRangePicker
  startDate={dateRange.startDate}
  endDate={dateRange.endDate}
  onChange={setDateRange}
/>
```

#### Feature 2: User Filter
```typescript
const [selectedUser, setSelectedUser] = useState(null);

// Add Select component
<Select
  placeholder="เลือกผู้ใช้"
  value={selectedUser}
  onChange={(e) => setSelectedUser(e.target.value)}
>
  {users.map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ))}
</Select>
```

#### Feature 3: Action Type Filter
```typescript
const [actionType, setActionType] = useState('all');

const actionTypes = ['all', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];

<Select
  value={actionType}
  onChange={(e) => setActionType(e.target.value)}
>
  {actionTypes.map(type => (
    <option key={type} value={type}>{type}</option>
  ))}
</Select>
```

#### Feature 4: Pagination
```typescript
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

// Use query with pagination
const { data } = useQuery({
  queryKey: ['audit-logs', page, pageSize, filters],
  queryFn: () => auditLogsApi.getAll({ page, pageSize, ...filters }),
});

// Add pagination controls
<Pagination
  current={page}
  pageSize={pageSize}
  total={data?.total}
  onChange={setPage}
/>
```

#### Feature 5: Export CSV
```typescript
const handleExportCSV = async () => {
  const logs = await auditLogsApi.getAll({ ...filters, all: true });
  
  const csv = [
    ['Timestamp', 'User', 'Action', 'Resource', 'Details'].join(','),
    ...logs.map(log => [
      log.timestamp,
      log.user.name,
      log.action,
      log.resource,
      log.details
    ].join(','))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `audit-logs-${new Date().toISOString()}.csv`;
  a.click();
};

<Button onClick={handleExportCSV}>
  📥 Export CSV
</Button>
```

---

## 📋 Testing Checklist

### Morning Tests
- [ ] Backend server restart สำเร็จ
- [ ] `/api/health` ตอบกลับ 200 OK
- [ ] `/api/health/system-stats` แสดงข้อมูลถูกต้อง
- [ ] `/api/health/database` แสดง connected
- [ ] Admin Dashboard เปิดได้
- [ ] HealthCheckCard แสดงสถานะ
- [ ] SystemStatsCard แสดงข้อมูล
- [ ] Auto-refresh ทำงาน (30s)
- [ ] Responsive design ถูกต้อง (Desktop/Tablet/Mobile)
- [ ] ไม่มี console errors

### Afternoon Tests
- [ ] Audit Logs เปิดได้
- [ ] Date Range Filter ทำงาน
- [ ] User Filter ทำงาน
- [ ] Action Type Filter ทำงาน
- [ ] Pagination ทำงาน
- [ ] Export CSV ได้
- [ ] ไฟล์ CSV ถูกต้อง
- [ ] UI สะอาด ใช้งานง่าย
- [ ] Responsive design ถูกต้อง

---

## 🐛 Troubleshooting

### Problem 1: Backend ไม่ start
**Error:** `Cannot find module './health/health.module'`

**Solution:**
```bash
# ตรวจสอบว่าไฟล์มีอยู่
ls backend/src/health/

# ถ้าไม่มี ให้สร้างใหม่ตาม skeleton ใน PHASE-4-DAY-1-SETUP-COMPLETE.md
```

### Problem 2: Frontend ไม่แสดง Health Cards
**Error:** `Cannot find module '../../components/admin/HealthCheckCard'`

**Solution:**
```bash
# ตรวจสอบว่าไฟล์มีอยู่
ls frontend/src/components/admin/Health*.tsx

# ถ้าไม่มี ให้สร้างใหม่ตาม skeleton
```

### Problem 3: API ตอบกลับ 404
**Error:** `GET /api/health 404`

**Solution:**
```bash
# ตรวจสอบว่า HealthModule registered ใน app.module.ts
grep "HealthModule" backend/src/app.module.ts

# ถ้าไม่มี ให้เพิ่ม:
# import { HealthModule } from './health/health.module';
# และเพิ่มใน imports: [..., HealthModule]
```

### Problem 4: Database connection error
**Error:** `Database health check failed`

**Solution:**
```bash
# ตรวจสอบ database connection
psql -U postgres -d guardian_route

# ตรวจสอบ .env
cat backend/.env | grep DATABASE_URL
```

---

## 📊 Progress Tracking

### Morning Progress (Expected)
- ⏰ 09:00 - 09:05: Restart backend
- ⏰ 09:05 - 09:20: Test endpoints
- ⏰ 09:20 - 09:30: Test frontend
- ⏰ 09:30 - 09:40: Test responsive
- ⏰ 09:40 - 10:00: Fix bugs (if any)
- ⏰ 10:00 - 13:00: Break / Other tasks

### Afternoon Progress (Expected)
- ⏰ 13:00 - 14:00: Add Date Range Filter
- ⏰ 14:00 - 14:30: Add User & Action Filters
- ⏰ 14:30 - 15:00: Add Pagination
- ⏰ 15:00 - 15:30: Add Export CSV
- ⏰ 15:30 - 16:30: Test all features
- ⏰ 16:30 - 17:00: Fix bugs & polish UI

---

## 🎯 Success Criteria

### Morning Success ✅
- [ ] Health Check API ทำงานได้
- [ ] Admin Dashboard แสดง Health Status
- [ ] แสดง System Stats (CPU, Memory, Users)
- [ ] Auto-refresh ทุก 30 วินาที
- [ ] Responsive ทุก device

### Afternoon Success ✅
- [ ] Audit Logs แสดงได้
- [ ] Filters ทำงานได้ทั้งหมด
- [ ] Pagination ทำงานถูกต้อง
- [ ] Export CSV ได้
- [ ] UI สะอาด ใช้งานง่าย

---

## 📝 Daily Report Template

```markdown
# Phase 4 Day 1 - Daily Report

**วันที่:** 28 พฤศจิกายน 2568  
**ผู้รายงาน:** [ชื่อ]

## ✅ งานที่เสร็จ
- [ ] Task 1: ...
- [ ] Task 2: ...

## ⚠️ ปัญหาที่พบ
1. **ปัญหา:** ...
   **แก้ไข:** ...

## ❓ งานที่ยังขาด
- [ ] ...

## ⏱️ เวลาที่ใช้
- Morning: X ชั่วโมง
- Afternoon: X ชั่วโมง
- **รวม:** X ชั่วโมง

## 📊 Progress
- **เป้าหมาย:** 76% → 85%
- **ผลจริง:** XX%
```

---

## 🚀 Next Steps (Day 2)

### Village Boundary Editor
- Install leaflet-draw
- Create VillageBoundaryEditorPage
- Implement draw/edit/delete
- Connect to API

---

**Status:** 🟢 Ready to Start  
**ETA:** 8 ชั่วโมง  
**Expected Completion:** วันนี้ 17:00 น.

---

**เริ่มงานได้เลยครับ!** 💪
