# 🧪 Test Report: Audit Log Viewer

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: บันทึกการใช้งาน (Audit Log)  
**Path**: `/audit-log`  
**Component**: `AuditLogPage`  
**Access Role**: ADMIN  
**Priority**: 🟢 Medium

---

## 📝 Test Objectives

1. ตรวจสอบ Audit Log List แสดงครบถ้วน
2. ตรวจสอบ Log Details แสดงถูกต้อง
3. ตรวจสอบ Filter & Search ทำงานได้
4. ตรวจสอบ Export functionality
5. ตรวจสอบ Real-time updates (ถ้ามี)

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้
- [ ] Header "📜 บันทึกการใช้งาน" แสดงถูกต้อง
- [ ] Log table แสดงถูกต้อง
- [ ] Filter panel แสดงถูกต้อง
- [ ] Search bar แสดงถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 2. Audit Log Table
- [ ] Table headers ครบถ้วน
- [ ] Log entries แสดงถูกต้อง
- [ ] Timestamp แสดงถูกต้อง (format: dd/mm/yyyy HH:mm:ss)
- [ ] User info แสดงถูกต้อง
- [ ] Action badges แสดงถูกต้อง
- [ ] Resource info แสดงถูกต้อง

**Expected Columns**:
- Timestamp
- User (username + role)
- Action (CREATE, READ, UPDATE, DELETE, LOGIN, LOGOUT)
- Resource (Users, Incidents, Tasks, Reports, Settings)
- Details (brief description)
- IP Address
- Status (Success/Failed)
- Actions (View Details)

**Status**: ⚪ Not Tested Yet

---

### 3. Log Entry Details
- [ ] คลิก log entry เปิด details modal
- [ ] แสดงข้อมูลครบถ้วน:
  - Full timestamp
  - User details (ID, username, email, role)
  - Action type
  - Resource type & ID
  - Before/After values (for UPDATE)
  - Request payload (if applicable)
  - Response status
  - IP address
  - User agent
  - Session ID

**Status**: ⚪ Not Tested Yet

---

### 4. Action Type Badges
- [ ] CREATE - สีเขียว 🟢
- [ ] READ - สีน้ำเงิน 🔵
- [ ] UPDATE - สีเหลือง 🟡
- [ ] DELETE - สีแดง 🔴
- [ ] LOGIN - สีม่วง 🟣
- [ ] LOGOUT - สีเทา ⚪

**Status**: ⚪ Not Tested Yet

---

### 5. Filter by Action
- [ ] Filter: CREATE
- [ ] Filter: READ
- [ ] Filter: UPDATE
- [ ] Filter: DELETE
- [ ] Filter: LOGIN
- [ ] Filter: LOGOUT
- [ ] Multiple selection ทำงานได้
- [ ] Clear filter ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 6. Filter by Resource
- [ ] Filter: Users
- [ ] Filter: Incidents
- [ ] Filter: Tasks
- [ ] Filter: Reports
- [ ] Filter: Settings
- [ ] Multiple selection ทำงานได้
- [ ] Clear filter ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 7. Filter by User
- [ ] Dropdown แสดงรายชื่อ users
- [ ] Select user ทำงานได้
- [ ] แสดงเฉพาะ logs ของ user นั้น
- [ ] Clear filter ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 8. Filter by Date Range
- [ ] Date picker แสดงถูกต้อง
- [ ] Select start date ทำงานได้
- [ ] Select end date ทำงานได้
- [ ] Validation: end date >= start date
- [ ] Apply filter ทำงานได้
- [ ] Quick filters:
  - Today
  - Last 7 days
  - Last 30 days
  - This month
  - Custom range

**Status**: ⚪ Not Tested Yet

---

### 9. Search
- [ ] Search by username ทำงานได้
- [ ] Search by action ทำงานได้
- [ ] Search by resource ทำงานได้
- [ ] Search by IP address ทำงานได้
- [ ] Real-time search (ถ้ามี)
- [ ] Clear search ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 10. Pagination
- [ ] Pagination controls แสดงถูกต้อง
- [ ] Page numbers ถูกต้อง
- [ ] Next/Previous ทำงานได้
- [ ] Jump to page ทำงานได้
- [ ] Items per page (10, 25, 50, 100) ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 11. Sorting
- [ ] Sort by timestamp (asc/desc)
- [ ] Sort by user (asc/desc)
- [ ] Sort by action (asc/desc)
- [ ] Sort by resource (asc/desc)
- [ ] Default: timestamp desc (newest first)

**Status**: ⚪ Not Tested Yet

---

### 12. Export Logs
- [ ] ปุ่ม "Export" แสดง
- [ ] Export as CSV ทำงานได้
- [ ] Export as Excel ทำงานได้
- [ ] Export as PDF ทำงานได้
- [ ] Export respects current filters
- [ ] Downloaded file มีข้อมูลถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 13. Real-time Updates (ถ้ามี)
- [ ] New logs appear automatically
- [ ] Notification badge แสดงเมื่อมี new logs
- [ ] Auto-refresh interval (e.g., 30 seconds)
- [ ] Manual refresh button ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 14. Responsive Design
- [ ] Desktop (1920x1080) - ✅ / ❌
- [ ] Laptop (1366x768) - ✅ / ❌
- [ ] Tablet (768x1024) - ✅ / ❌
- [ ] Mobile (375x667) - ✅ / ❌

**Status**: ⚪ Not Tested Yet

---

## 🔌 API Testing Checklist

### Expected API Calls:

1. **GET /api/audit-logs** - Fetch audit logs
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Logs array returned
   - [ ] Pagination metadata included

2. **GET /api/audit-logs/:id** - Fetch log details
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Log object complete

3. **GET /api/audit-logs/export** - Export logs
   - [ ] Request with format parameter
   - [ ] Response status: 200 OK
   - [ ] File download initiated

**Query Parameters**:
- `action`: filter by action type
- `resource`: filter by resource type
- `userId`: filter by user
- `startDate`: filter by start date
- `endDate`: filter by end date
- `page`: pagination
- `limit`: items per page
- `sort`: sort field
- `order`: asc/desc

**Status**: ⚪ Not Tested Yet

---

## 🎯 Test Scenarios

### Scenario 1: View Recent Logs
1. Navigate to Audit Log
2. Verify logs load (default: last 100 entries)
3. Verify sorted by timestamp desc
4. Verify all columns show correct data

**Expected**: Recent logs displayed

---

### Scenario 2: Filter by Action Type
1. Select filter: Action = DELETE
2. Verify only DELETE actions shown
3. Verify count matches

**Expected**: Only delete actions visible

---

### Scenario 3: Search by User
1. Search: "admin"
2. Verify only admin's actions shown
3. Clear search
4. Verify all logs shown again

**Expected**: Search works correctly

---

### Scenario 4: Filter by Date Range
1. Select "Last 7 days"
2. Verify only logs from last 7 days shown
3. Select custom range: 01/11/2568 - 30/11/2568
4. Verify logs within range shown

**Expected**: Date filter works correctly

---

### Scenario 5: View Log Details
1. Click a log entry
2. Verify details modal opens
3. Verify all fields populated
4. For UPDATE action, verify before/after values shown

**Expected**: Details complete and accurate

---

### Scenario 6: Export Logs
1. Apply filter: Action = CREATE, Last 30 days
2. Click "Export"
3. Select CSV format
4. Download file
5. Open CSV and verify data matches filter

**Expected**: Exported CSV contains filtered data

---

## 📸 Screenshots

### Screenshot 1: Audit Log Table
```
[แนบ screenshot ของ log table]
```

### Screenshot 2: Log Details Modal
```
[แนบ screenshot ของ details modal]
```

### Screenshot 3: Filter Panel
```
[แนบ screenshot ของ filters]
```

### Screenshot 4: Search Results
```
[แนบ screenshot ของ search results]
```

### Screenshot 5: Export Dialog
```
[แนบ screenshot ของ export options]
```

---

## 🐛 Bugs Found

### Bug #1: [ถ้าพบ]
**Severity**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low

**Description**:
```
[รายละเอียด]
```

---

## 📈 Overall Assessment

**UI Status**: ⚪ Not Tested Yet  
**API Status**: ⚪ Not Tested Yet  
**Priority**: 🟢 Medium  
**Estimate to Fix**: TBD

### Important for Security:
- ✅ All user actions must be logged
- ✅ Logs must be tamper-proof
- ✅ Sensitive data should be masked
- ✅ Retention policy should be enforced

---

## ✅ Sign-off

**Tested by**: _______________  
**Date**: _______________  
**Status**: [ ] PASS  [ ] FAIL  [ ] PARTIAL

---

**Status**: 🟡 Ready to Test  
**Created**: 29 พฤศจิกายน 2568 12:40 น.

**Note**: Audit Log เป็นเครื่องมือสำคัญสำหรับ security และ compliance!
