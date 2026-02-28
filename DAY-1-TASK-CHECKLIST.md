# ✅ Phase 4 Day 1 - Task Checklist

**วันที่:** 28 พฤศจิกายน 2568  
**เวลาเริ่ม:** 16:10 น.  
**เป้าหมายเสร็จ:** วันนี้ 20:00 น. (4 ชั่วโมง)

---

## 🎯 เป้าหมาย Day 1

**Progress Target:** 76% → 85%

### Morning Goals ✅
- Admin Dashboard แสดงสถานะระบบ (Health Check)
- แสดง System Stats (CPU, Memory, Database, Users)
- Auto-refresh ทุก 30 วินาที
- Responsive ทุก device

### Afternoon Goals ✅
- Audit Logs Viewer ใช้งานได้เต็มรูปแบบ
- Filters: Date Range, User, Action Type
- Pagination ทำงานถูกต้อง
- Export CSV/Excel ได้

---

## ☀️ MORNING TASKS (2 ชั่วโมง - เหลือเวลา)

### ✅ สิ่งที่เสร็จแล้ว (Setup Complete)
- [x] HealthModule created
- [x] HealthModule registered in app.module.ts
- [x] HealthCheckCard component created
- [x] SystemStatsCard component created
- [x] AdminDashboardPage updated

### 🔄 Task M1: Restart Backend (5 นาที)
```bash
# ปิด backend server (Ctrl+C)
cd backend
npm run start:dev
```

**Expected Output:**
```
[Nest] HealthModule dependencies initialized ✅
[Nest] Mapped {/api/health, GET} route ✅
[Nest] Mapped {/api/health/system-stats, GET} route ✅
[Nest] Mapped {/api/health/database, GET} route ✅
✅ Guardian Route API is running on: http://localhost:3001
```

**Checklist:**
- [ ] Backend restart สำเร็จ
- [ ] ไม่มี compilation errors
- [ ] HealthModule loaded

---

### 🔄 Task M2: Test Health Endpoints (15 นาที)

#### Test 1: Basic Health Check
```bash
curl http://localhost:3001/api/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-28T09:10:00.000Z",
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

**Checklist:**
- [ ] Status code: 200 OK
- [ ] Response มี status field
- [ ] Services.database = "up"
- [ ] Services.api = "up"

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

**Checklist:**
- [ ] Status code: 200 OK
- [ ] มีข้อมูล system
- [ ] มีข้อมูล memory
- [ ] มีข้อมูล database
- [ ] มีข้อมูล statistics

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
  "timestamp": "2025-11-28T09:10:00.000Z"
}
```

**Checklist:**
- [ ] Status code: 200 OK
- [ ] connected = true
- [ ] activeConnections > 0

---

### 🔄 Task M3: Test Frontend (30 นาที)

#### Step 1: Open Admin Dashboard
1. เปิด browser: http://localhost:5173
2. Login ด้วย Admin account
3. ไปที่: http://localhost:5173/admin/dashboard

**Checklist:**
- [ ] หน้า Admin Dashboard เปิดได้
- [ ] ไม่มี console errors
- [ ] Layout แสดงถูกต้อง

#### Step 2: Verify HealthCheckCard
**Expected Display:**
- ✅ สถานะระบบ: ปกติ (สีเขียว)
- ✅ เวลาทำงาน: Xd Xh Xm
- ✅ เวลาตอบสนอง: Xms
- ✅ เวอร์ชัน: 1.0.0
- ✅ สภาพแวดล้อม: development
- ✅ Database: 🟢 เชื่อมต่อ
- ✅ API: 🟢 พร้อมใช้งาน
- ✅ อัปเดตล่าสุด: [timestamp]

**Checklist:**
- [ ] Card แสดงผล
- [ ] ข้อมูลถูกต้อง
- [ ] สีสถานะถูกต้อง (เขียว = healthy)
- [ ] Timestamp แสดง

#### Step 3: Verify SystemStatsCard
**Expected Display:**
- ✅ ระบบปฏิบัติการ: Platform, Arch, CPUs, Uptime
- ✅ การใช้หน่วยความจำ: Progress bar + Total/Used/Free
- ✅ ฐานข้อมูล: Status + Connections
- ✅ สถิติระบบ: 4 cards (Users, Incidents, Tasks, Villages)
- ✅ Process: PID, Uptime, Heap, RSS

**Checklist:**
- [ ] Card แสดงผล
- [ ] Memory bar แสดงเปอร์เซ็นต์
- [ ] Statistics cards แสดงตัวเลข
- [ ] ไม่มี loading errors

#### Step 4: Test Auto-Refresh
1. เปิด DevTools (F12)
2. ดู Network tab
3. รอ 30 วินาที

**Expected:**
- ทุก 30 วินาที จะมี request ไปที่:
  - `/api/health`
  - `/api/health/system-stats`

**Checklist:**
- [ ] Auto-refresh ทำงาน
- [ ] ข้อมูลอัปเดต
- [ ] ไม่มี errors

---

### 🔄 Task M4: Test Responsive Design (20 นาที)

#### Desktop (1920x1080)
**Expected Layout:**
- Health Cards: 2 columns (side by side)
- Stats Cards: 4 columns
- Text: อ่านง่าย ไม่เล็กเกินไป

**Checklist:**
- [ ] Layout ถูกต้อง
- [ ] Cards ไม่ล้น
- [ ] Spacing เหมาะสม

#### Tablet (768x1024)
**Expected Layout:**
- Health Cards: 1 column (stacked)
- Stats Cards: 2 columns
- Text: อ่านได้ชัดเจน

**Checklist:**
- [ ] Layout responsive
- [ ] Cards ปรับขนาด
- [ ] ไม่มี horizontal scroll

#### Mobile (375x667)
**Expected Layout:**
- Health Cards: 1 column
- Stats Cards: 1 column
- Text: ไม่เล็กเกินไป

**Checklist:**
- [ ] Layout mobile-friendly
- [ ] Cards stack vertically
- [ ] Touch targets เพียงพอ

---

## 🌙 AFTERNOON TASKS (2 ชั่วโมง)

### 🔄 Task A1: Check Existing AuditLogTable (10 นาที)

```bash
# ดูไฟล์ที่มีอยู่
cat frontend/src/components/admin/AuditLogTable.tsx
```

**Checklist:**
- [ ] ไฟล์มีอยู่
- [ ] Component ทำงานได้
- [ ] มี basic table

---

### 🔄 Task A2: Add Date Range Filter (30 นาที)

**Implementation:**
```typescript
import { useState } from 'react';

const [dateRange, setDateRange] = useState({
  startDate: null,
  endDate: null,
});

// Add to component
<Box mb={4}>
  <FormLabel>ช่วงเวลา</FormLabel>
  <HStack>
    <Input
      type="date"
      value={dateRange.startDate}
      onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
      placeholder="วันที่เริ่มต้น"
    />
    <Input
      type="date"
      value={dateRange.endDate}
      onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
      placeholder="วันที่สิ้นสุด"
    />
  </HStack>
</Box>
```

**Checklist:**
- [ ] Date inputs แสดง
- [ ] เลือกวันที่ได้
- [ ] Filter ทำงาน

---

### 🔄 Task A3: Add User & Action Filters (30 นาที)

**Implementation:**
```typescript
const [selectedUser, setSelectedUser] = useState('all');
const [actionType, setActionType] = useState('all');

const actionTypes = ['all', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'];

// Add to component
<HStack spacing={4} mb={4}>
  <Box flex={1}>
    <FormLabel>ผู้ใช้</FormLabel>
    <Select
      value={selectedUser}
      onChange={(e) => setSelectedUser(e.target.value)}
    >
      <option value="all">ทั้งหมด</option>
      {users?.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
      ))}
    </Select>
  </Box>
  
  <Box flex={1}>
    <FormLabel>ประเภทการกระทำ</FormLabel>
    <Select
      value={actionType}
      onChange={(e) => setActionType(e.target.value)}
    >
      {actionTypes.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </Select>
  </Box>
</HStack>
```

**Checklist:**
- [ ] User select แสดง
- [ ] Action select แสดง
- [ ] Filters ทำงาน

---

### 🔄 Task A4: Add Pagination (20 นาที)

**Implementation:**
```typescript
const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(20);

const { data, isLoading } = useQuery({
  queryKey: ['audit-logs', page, pageSize, dateRange, selectedUser, actionType],
  queryFn: () => auditLogsApi.getAll({
    page,
    pageSize,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    userId: selectedUser !== 'all' ? selectedUser : undefined,
    action: actionType !== 'all' ? actionType : undefined,
  }),
});

// Add pagination controls
<HStack justify="space-between" mt={4}>
  <Text>
    แสดง {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, data?.total || 0)} จาก {data?.total || 0} รายการ
  </Text>
  <HStack>
    <Button
      onClick={() => setPage(p => Math.max(1, p - 1))}
      isDisabled={page === 1}
    >
      ก่อนหน้า
    </Button>
    <Text>หน้า {page}</Text>
    <Button
      onClick={() => setPage(p => p + 1)}
      isDisabled={page * pageSize >= (data?.total || 0)}
    >
      ถัดไป
    </Button>
  </HStack>
</HStack>
```

**Checklist:**
- [ ] Pagination แสดง
- [ ] Previous/Next ทำงาน
- [ ] แสดงจำนวนรายการถูกต้อง

---

### 🔄 Task A5: Add Export CSV (20 นาที)

**Implementation:**
```typescript
const handleExportCSV = async () => {
  try {
    // Fetch all logs with current filters
    const allLogs = await auditLogsApi.getAll({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      userId: selectedUser !== 'all' ? selectedUser : undefined,
      action: actionType !== 'all' ? actionType : undefined,
      all: true, // Get all records
    });
    
    // Create CSV content
    const headers = ['Timestamp', 'User', 'Action', 'Resource', 'Details'];
    const rows = allLogs.map(log => [
      new Date(log.timestamp).toLocaleString('th-TH'),
      log.user?.name || 'Unknown',
      log.action,
      log.resource,
      log.details || ''
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('ส่งออกข้อมูลสำเร็จ');
  } catch (error) {
    toast.error('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
  }
};

// Add button
<Button
  leftIcon={<Icon as={FiDownload} />}
  colorScheme="green"
  onClick={handleExportCSV}
>
  📥 Export CSV
</Button>
```

**Checklist:**
- [ ] Export button แสดง
- [ ] คลิกแล้วดาวน์โหลด CSV
- [ ] ไฟล์ CSV เปิดได้
- [ ] ข้อมูลถูกต้อง
- [ ] รองรับภาษาไทย (UTF-8 BOM)

---

### 🔄 Task A6: Test & Polish (10 นาที)

#### Test Flow
1. เปิดหน้า Audit Logs
2. ทดสอบ Date Range Filter
3. ทดสอบ User Filter
4. ทดสอบ Action Filter
5. ทดสอบ Pagination
6. ทดสอบ Export CSV
7. เปิดไฟล์ CSV ตรวจสอบ

**Checklist:**
- [ ] ทุก filter ทำงาน
- [ ] Pagination ถูกต้อง
- [ ] Export สำเร็จ
- [ ] UI สะอาด
- [ ] ไม่มี bugs

---

## 📊 Progress Tracking

### Time Tracking
| Task | Estimated | Actual | Status |
|------|-----------|--------|--------|
| M1: Restart Backend | 5 min | ___ min | ⏳ |
| M2: Test Endpoints | 15 min | ___ min | ⏳ |
| M3: Test Frontend | 30 min | ___ min | ⏳ |
| M4: Test Responsive | 20 min | ___ min | ⏳ |
| A1: Check AuditLog | 10 min | ___ min | ⏳ |
| A2: Date Filter | 30 min | ___ min | ⏳ |
| A3: User/Action Filter | 30 min | ___ min | ⏳ |
| A4: Pagination | 20 min | ___ min | ⏳ |
| A5: Export CSV | 20 min | ___ min | ⏳ |
| A6: Test & Polish | 10 min | ___ min | ⏳ |
| **Total** | **3 hours** | **___ hours** | |

---

## 🎯 Success Criteria

### Morning Success ✅
- [ ] Backend restart สำเร็จ
- [ ] ทุก endpoint ตอบกลับ 200 OK
- [ ] Admin Dashboard แสดง Health Cards
- [ ] Auto-refresh ทำงาน (30s)
- [ ] Responsive ทุก device
- [ ] ไม่มี console errors

### Afternoon Success ✅
- [ ] Audit Logs เปิดได้
- [ ] Date Range Filter ทำงาน
- [ ] User Filter ทำงาน
- [ ] Action Type Filter ทำงาน
- [ ] Pagination ทำงาน
- [ ] Export CSV สำเร็จ
- [ ] ไฟล์ CSV ถูกต้อง
- [ ] UI สะอาด ใช้งานง่าย

---

## 🐛 Common Issues & Solutions

### Issue 1: Backend won't start
**Error:** `Cannot find module './health/health.module'`

**Solution:**
```bash
# Check if files exist
ls backend/src/health/

# If missing, files are already created, just restart
```

### Issue 2: Frontend shows errors
**Error:** `Cannot find module '../../components/admin/HealthCheckCard'`

**Solution:**
```bash
# Check if files exist
ls frontend/src/components/admin/Health*.tsx

# Files are already created, just refresh browser
```

### Issue 3: API returns 404
**Error:** `GET /api/health 404`

**Solution:**
- HealthModule is already registered in app.module.ts
- Just restart backend server

### Issue 4: Database connection error
**Error:** `Database health check failed`

**Solution:**
```bash
# Check database is running
psql -U postgres -d guardian_route

# Check .env file
cat backend/.env | grep DATABASE_URL
```

---

## 📝 Daily Report Template

```markdown
# Phase 4 Day 1 - Daily Report

**วันที่:** 28 พฤศจิกายน 2568  
**ผู้รายงาน:** [ชื่อ]  
**เวลาเริ่ม:** 16:10 น.  
**เวลาเสร็จ:** __:__ น.

## ✅ งานที่เสร็จ
- [x] Task M1: Restart Backend
- [x] Task M2: Test Endpoints
- [x] Task M3: Test Frontend
- [x] Task M4: Test Responsive
- [x] Task A1: Check AuditLog
- [x] Task A2: Date Filter
- [x] Task A3: User/Action Filter
- [x] Task A4: Pagination
- [x] Task A5: Export CSV
- [x] Task A6: Test & Polish

## ⚠️ ปัญหาที่พบ
1. **ปัญหา:** [อธิบาย]
   **แก้ไข:** [วิธีแก้]
   **เวลาที่ใช้:** X นาที

## ❓ งานที่ยังขาด
- [ ] [ถ้ามี]

## ⏱️ เวลาที่ใช้
- Morning Tasks: ___ ชั่วโมง
- Afternoon Tasks: ___ ชั่วโมง
- **รวม:** ___ ชั่วโมง

## 📊 Progress
- **เป้าหมาย:** 76% → 85%
- **ผลจริง:** ___%

## 📸 Screenshots
[แนบ screenshots ถ้ามี]

## 💭 หมายเหตุ
[ข้อสังเกต / ข้อเสนอแนะ]
```

---

## 🚀 Ready to Start!

**สถานะ:** 🟢 100% Ready  
**เวลาที่เหลือ:** ~4 ชั่วโมง  
**Expected Completion:** 20:00 น.

**เริ่มได้เลยครับ!** 💪🔥

---

**Next Steps:**
1. ✅ Restart backend
2. ✅ Test endpoints
3. ✅ Test frontend
4. ✅ Enhance Audit Logs
5. ✅ Report progress
