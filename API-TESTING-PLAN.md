# 🧪 API Testing Plan - Phase 2

**เวลาเริ่ม**: 29 พฤศจิกายน 2568 เวลา 13:00 น.  
**เวลาส่งรายงาน**: 17:00 น. (4 ชั่วโมง)  
**ผู้ทดสอบ**: Team W - Cascade AI Developer  
**สถานะ**: 🔴 **กำลังดำเนินการ**

---

## 🎯 เป้าหมาย Phase 2

### ต้องทดสอบ:
- ✅ **Request** → ส่ง payload ถูกต้อง
- ✅ **Response** → status, data correctness, error handling
- ✅ **Edge cases** → empty data, invalid input, permission error, network failure
- ✅ **บันทึกผล** → passed/failed, response log, screenshot

### เป้าหมาย:
- 🎯 **90%+ ของเมนู** มี UI + API + UX ใช้งานได้จริง
- 🎯 **ไม่มี broken flow** / critical bug
- 🎯 **รายงานผล** ภายใน 17:00 น.

---

## 📋 API Testing Checklist

### สำหรับแต่ละเมนู:

#### 1. Request Testing
- [ ] HTTP Method ถูกต้อง (GET, POST, PUT, DELETE)
- [ ] Endpoint URL ถูกต้อง
- [ ] Headers ครบถ้วน (Authorization, Content-Type)
- [ ] Payload structure ถูกต้อง
- [ ] Query parameters ถูกต้อง

#### 2. Response Testing
- [ ] Status code ถูกต้อง (200, 201, 400, 401, 404, 500)
- [ ] Response data structure ถูกต้อง
- [ ] Data correctness (ข้อมูลถูกต้อง)
- [ ] Error messages ชัดเจน
- [ ] Loading states แสดงถูกต้อง

#### 3. Edge Cases Testing
- [ ] Empty data (ไม่มีข้อมูล)
- [ ] Invalid input (ข้อมูลผิดรูปแบบ)
- [ ] Permission error (ไม่มีสิทธิ์)
- [ ] Network failure (เครือข่ายขัดข้อง)
- [ ] Timeout (ใช้เวลานาน)

#### 4. Documentation
- [ ] Screenshot UI
- [ ] Network log (Request/Response)
- [ ] Console log (Errors)
- [ ] Test result (Passed/Failed)
- [ ] Bug report (ถ้าพบ)

---

## 🔴 Priority 1: Critical Menus (10 เมนู) - 2 ชั่วโมง

### 1. Admin Dashboard (`/dashboard/admin`)

**Component**: `AdminDashboardV2.tsx`

**API Endpoints ที่ต้องทดสอบ**:
```typescript
GET /api/admin/stats          // Dashboard statistics
GET /api/users/count          // User count
GET /api/incidents/count      // Incident count
GET /api/reports/count        // Report count
GET /api/tasks/count          // Task count
```

**Test Cases**:
1. ✅ Load dashboard → แสดง stats ถูกต้อง
2. ✅ Empty data → แสดง 0 หรือ empty state
3. ✅ Permission error → redirect to unauthorized
4. ✅ Network error → แสดง error message

**Expected Results**:
- Status: 200 OK
- Data: { users: number, incidents: number, reports: number, tasks: number }
- Loading: แสดง skeleton/spinner
- Error: แสดง error message + retry button

---

### 2. Manage Users (`/manage-users`)

**Component**: `ManageUsersPage.tsx`

**API Endpoints**:
```typescript
GET    /api/users              // List users
POST   /api/users              // Create user
PUT    /api/users/:id          // Update user
DELETE /api/users/:id          // Delete user
GET    /api/users/:id          // Get user details
```

**Test Cases**:
1. ✅ List users → แสดงรายการผู้ใช้
2. ✅ Create user → สร้างผู้ใช้ใหม่สำเร็จ
3. ✅ Update user → แก้ไขข้อมูลสำเร็จ
4. ✅ Delete user → ลบผู้ใช้สำเร็จ
5. ✅ Invalid input → แสดง validation error
6. ✅ Duplicate email → แสดง error message
7. ✅ Permission denied → แสดง 403 error

**Expected Results**:
- GET: 200 OK + user list
- POST: 201 Created + new user
- PUT: 200 OK + updated user
- DELETE: 204 No Content
- Errors: 400/403/404/500 + error message

---

### 3. Settings Page (`/settings`)

**Component**: `SettingsPage.tsx`

**API Endpoints** (6 tabs):
```typescript
// Tab 1: General
GET  /api/settings/general
PUT  /api/settings/general

// Tab 2: Security
GET  /api/settings/security
PUT  /api/settings/security

// Tab 3: Map
GET  /api/settings/map
PUT  /api/settings/map

// Tab 4: Notifications
GET  /api/settings/notifications
PUT  /api/settings/notifications

// Tab 5: API
GET  /api/settings/api
PUT  /api/settings/api

// Tab 6: Data
GET  /api/settings/data
PUT  /api/settings/data
POST /api/settings/backup        // Trigger backup
GET  /api/settings/backups       // List backups
GET  /api/settings/backups/:file // Download backup
```

**Test Cases**:
1. ✅ Load settings (6 tabs) → แสดงข้อมูลถูกต้อง
2. ✅ Save settings → บันทึกสำเร็จ
3. ✅ Invalid input → แสดง validation error
4. ✅ Trigger backup → สร้าง backup สำเร็จ
5. ✅ Download backup → ดาวน์โหลดสำเร็จ
6. ✅ Permission denied → แสดง 403 error

**Expected Results**:
- GET: 200 OK + settings data
- PUT: 200 OK + updated settings
- POST backup: 201 Created + backup info
- Errors: 400/403/500 + error message

---

### 4. Supervisor Dashboard (`/supervisor`)

**Component**: `SupervisorDashboardModern.tsx`

**API Endpoints**:
```typescript
GET /api/supervisor/stats         // Dashboard stats
GET /api/incidents/active         // Active incidents
GET /api/tasks/active             // Active tasks
GET /api/reports/recent           // Recent reports
GET /api/team/performance         // Team performance
```

**Test Cases**:
1. ✅ Load dashboard → แสดง stats + map + charts
2. ✅ Empty data → แสดง empty state
3. ✅ Real-time updates → data refresh
4. ✅ Network error → แสดง error + retry

**Expected Results**:
- Status: 200 OK
- Data: stats, incidents, tasks, reports, team
- Loading: skeleton/spinner
- Error: error message + retry

---

### 5. Manage Incidents (`/manage-incidents`)

**Component**: `ManageIncidentsPage.tsx`

**API Endpoints**:
```typescript
GET    /api/incidents              // List incidents
POST   /api/incidents              // Create incident
PUT    /api/incidents/:id          // Update incident
DELETE /api/incidents/:id          // Delete incident
GET    /api/incidents/:id          // Get incident details
PUT    /api/incidents/:id/status   // Update status
PUT    /api/incidents/:id/assign   // Assign to user
```

**Test Cases**:
1. ✅ List incidents → แสดงรายการ + filter + search
2. ✅ Create incident → สร้างสำเร็จ
3. ✅ Update incident → แก้ไขสำเร็จ
4. ✅ Delete incident → ลบสำเร็จ
5. ✅ Update status → เปลี่ยนสถานะสำเร็จ
6. ✅ Assign user → มอบหมายสำเร็จ
7. ✅ Filter/Search → ผลลัพธ์ถูกต้อง
8. ✅ Map integration → แสดงตำแหน่งถูกต้อง

**Expected Results**:
- CRUD operations: 200/201/204
- Status update: 200 OK
- Assign: 200 OK
- Errors: 400/403/404/500

---

### 6. Field Officer Tasks (`/field-officer/tasks`)

**Component**: `MyTasksPage.tsx`

**API Endpoints**:
```typescript
GET    /api/tasks/my-tasks         // My tasks
GET    /api/tasks/:id              // Task details
PUT    /api/tasks/:id/status       // Update status
POST   /api/tasks/:id/checkin      // Check-in
POST   /api/tasks/:id/checkout     // Check-out
POST   /api/tasks/:id/photos       // Upload photos
POST   /api/tasks/:id/report       // Submit report
```

**Test Cases**:
1. ✅ List my tasks → แสดงงานของฉัน
2. ✅ Task details → แสดงรายละเอียด
3. ✅ Update status → เปลี่ยนสถานะสำเร็จ
4. ✅ Check-in → บันทึก GPS สำเร็จ
5. ✅ Check-out → บันทึกเวลาสำเร็จ
6. ✅ Upload photos → อัพโหลดสำเร็จ
7. ✅ Submit report → ส่งรายงานสำเร็จ
8. ✅ Mobile responsive → ใช้งานบนมือถือได้

**Expected Results**:
- GET: 200 OK + tasks
- PUT: 200 OK + updated task
- POST: 201 Created + result
- Errors: 400/403/404/500

---

### 7. Field Officer Dashboard (`/field-officer/dashboard`)

**Component**: `FieldOfficerDashboardNew.tsx`

**API Endpoints**:
```typescript
GET /api/field-officer/stats      // Dashboard stats
GET /api/tasks/my-tasks           // My tasks
GET /api/tasks/pending            // Pending tasks
GET /api/reports/my-reports       // My reports
```

**Test Cases**:
1. ✅ Load dashboard → แสดง stats + tasks
2. ✅ Empty tasks → แสดง empty state
3. ✅ Quick actions → ทำงานได้
4. ✅ Mobile responsive → ใช้งานได้

**Expected Results**:
- Status: 200 OK
- Data: stats, tasks, reports
- Mobile: responsive layout

---

### 8. Map & Reports (`/supervisor/map`)

**Component**: `MapView.tsx`

**API Endpoints**:
```typescript
GET /api/map/incidents            // Incident markers
GET /api/map/tasks                // Task markers
GET /api/map/reports              // Report markers
GET /api/map/layers               // Map layers
POST /api/reports/generate        // Generate report
POST /api/reports/export          // Export report
```

**Test Cases**:
1. ✅ Load map → แสดงแผนที่ + markers
2. ✅ Incident markers → แสดงถูกต้อง
3. ✅ Task markers → แสดงถูกต้อง
4. ✅ Layer controls → เปลี่ยน layer ได้
5. ✅ Generate report → สร้างรายงานสำเร็จ
6. ✅ Export report → ส่งออกสำเร็จ
7. ✅ Filter → กรองข้อมูลได้

**Expected Results**:
- GET: 200 OK + markers data
- POST: 201 Created + report
- Map: interactive + responsive

---

### 9. Audit Log (`/audit-log`)

**Component**: `AuditLogsPage.tsx`

**API Endpoints**:
```typescript
GET /api/audit-logs               // List logs
GET /api/audit-logs/:id           // Log details
GET /api/audit-logs/export        // Export logs
GET /api/audit-logs/filter        // Filter logs
```

**Test Cases**:
1. ✅ List logs → แสดงรายการ log
2. ✅ Log details → แสดงรายละเอียด
3. ✅ Filter → กรองตาม user/action/date
4. ✅ Search → ค้นหาได้
5. ✅ Export → ส่งออกสำเร็จ
6. ✅ Pagination → แบ่งหน้าได้

**Expected Results**:
- GET: 200 OK + logs
- Filter: 200 OK + filtered logs
- Export: file download

---

### 10. Survey Area (`/survey-area`)

**Component**: `SurveyAreaPage.tsx`

**API Endpoints**:
```typescript
GET  /api/surveys/:id             // Survey details
POST /api/surveys/:id/response    // Submit response
POST /api/surveys/:id/photos      // Upload photos
POST /api/surveys/:id/location    // Save location
```

**Test Cases**:
1. ✅ Load survey form → แสดงฟอร์ม
2. ✅ Draw on map → บันทึก polygon
3. ✅ Upload photos → อัพโหลดสำเร็จ
4. ✅ Submit response → ส่งสำเร็จ
5. ✅ GPS location → บันทึกตำแหน่ง
6. ✅ Mobile responsive → ใช้งานได้

**Expected Results**:
- GET: 200 OK + survey
- POST: 201 Created + response
- Mobile: responsive + GPS

---

## 🟡 Priority 2: High Priority (5 เมนู) - 1 ชั่วโมง

### 11. Workflow Guide (`/workflow-guide`)
- GET /api/workflow/steps
- Simple content page

### 12. Report History (`/report-history`)
- GET /api/reports/history
- List + filter + search

### 13. Team Overview (`/team-overview`)
- GET /api/team/overview
- Stats + charts

### 14. Manage Data (`/manage-data`)
- GET /api/data/list
- CRUD operations

### 15. Village Boundaries (`/village-boundaries`)
- GET /api/villages
- Map + boundaries

---

## 🟢 Priority 3: Medium Priority (6 เมนู) - 30 นาที

### 16-21. Executive, Developer, Docs
- Basic GET requests
- Content display
- Charts/Stats

---

## 📊 Test Result Template

### สำหรับแต่ละเมนู:

```markdown
## Menu: [ชื่อเมนู]
**Path**: [URL]
**Component**: [Component Name]
**Tested**: [วันที่/เวลา]
**Tester**: Team W

### API Endpoints Tested:
1. [Endpoint 1] - ✅ Passed / ❌ Failed
2. [Endpoint 2] - ✅ Passed / ❌ Failed

### Test Results:
- Request: ✅ Passed
- Response: ✅ Passed
- Edge Cases: ✅ Passed
- Overall: ✅ Passed / ❌ Failed

### Screenshots:
[แนบ screenshot]

### Network Logs:
[แนบ network log]

### Issues Found:
[รายการ bugs ที่พบ - ถ้ามี]
```

---

## 🐛 Bug Report Template

### ถ้าพบ bug:

```markdown
# ISSUE-XXX: [ชื่อ Bug]

**Priority**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low
**Impact**: [ผลกระทบต่อระบบ]
**Menu**: [เมนูที่พบ]
**Component**: [Component ที่มีปัญหา]

## Problem:
[อธิบายปัญหา]

## Steps to Reproduce:
1. [ขั้นตอนที่ 1]
2. [ขั้นตอนที่ 2]
3. [ขั้นตอนที่ 3]

## Expected:
[ผลลัพธ์ที่คาดหวัง]

## Actual:
[ผลลัพธ์ที่เกิดขึ้นจริง]

## Screenshots:
[แนบ screenshot]

## Logs:
[แนบ error log]

## Proposed Solution:
[แนวทางแก้ไข]
```

---

## ⏰ Timeline

| เวลา | กิจกรรม | สถานะ |
|------|---------|-------|
| 13:00-15:00 | Test Critical (10 เมนู) | 🔴 In Progress |
| 15:00-16:00 | Test High Priority (5 เมนู) | ⏳ Pending |
| 16:00-16:30 | Test Medium Priority (6 เมนู) | ⏳ Pending |
| 16:30-17:00 | สรุปผล + สร้างรายงาน | ⏳ Pending |
| 17:00 | ส่ง Progress Report #2 | ⏳ Pending |

---

## ✅ Success Criteria

### ต้องผ่านทั้งหมด:
- ✅ API endpoints ทำงานได้
- ✅ Response data ถูกต้อง
- ✅ Error handling ทำงานได้
- ✅ Edge cases ทดสอบแล้ว
- ✅ ไม่มี critical bugs
- ✅ บันทึกผลครบถ้วน

---

**ลงชื่อ**: Team W - Cascade AI Developer  
**วันที่**: 29 พฤศจิกายน 2568 เวลา 13:00 น.  
**สถานะ**: 🔴 **เริ่มทดสอบทันที!**

---

**"Let's Test Everything! API Testing Starts Now!"** 🧪🚀💪
