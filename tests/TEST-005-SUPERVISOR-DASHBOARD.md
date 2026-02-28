# 🧪 Test Report: Supervisor Dashboard

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: แดชบอร์ดหัวหน้างาน (Supervisor Dashboard)  
**Path**: `/supervisor`  
**Component**: `SupervisorDashboard`  
**Access Role**: SUPERVISOR  
**Priority**: 🔴 Critical

---

## 📝 Test Objectives

1. ตรวจสอบ Overview Stats แสดงข้อมูลถูกต้อง
2. ตรวจสอบ Incident Map แสดงและทำงานได้
3. ตรวจสอบ Team Performance metrics
4. ตรวจสอบ Active Tasks list
5. ตรวจสอบ Recent Reports
6. ตรวจสอบ Quick Actions ทำงานได้

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้
- [ ] Header "📊 Supervisor Dashboard" แสดงถูกต้อง
- [ ] Layout responsive และสวยงาม
- [ ] Sidebar แสดงถูกต้อง (1 ชั้น)
- [ ] All sections load properly

**Expected Sections**:
1. Overview Stats (4 cards)
2. Incident Map
3. Team Performance
4. Active Tasks
5. Recent Reports
6. Quick Actions

**Status**: ⚪ Not Tested Yet

---

### 2. Overview Stats Cards
- [ ] **Total Incidents** - แสดงจำนวนถูกต้อง
- [ ] **Active Tasks** - แสดงจำนวนถูกต้อง
- [ ] **Field Officers** - แสดงจำนวนถูกต้อง
- [ ] **Completion Rate** - แสดงเปอร์เซ็นต์ถูกต้อง

**Expected Data**:
- Real-time data (not hardcoded)
- Icons appropriate
- Colors match severity/status
- Click to drill-down (if applicable)

**Status**: ⚪ Not Tested Yet

---

### 3. Incident Map
- [ ] Map loads successfully
- [ ] Markers แสดงตำแหน่ง incidents
- [ ] Marker colors แสดง severity
- [ ] Click marker แสดง popup
- [ ] Popup มีข้อมูลครบถ้วน
- [ ] Zoom controls ทำงานได้
- [ ] Pan/drag ทำงานได้
- [ ] Fullscreen mode ทำงานได้

**Expected Markers**:
- 🔴 Critical incidents
- 🟡 High priority incidents
- 🟢 Normal incidents
- ⚪ Resolved incidents

**Status**: ⚪ Not Tested Yet

---

### 4. Team Performance
- [ ] แสดงรายชื่อ Field Officers
- [ ] แสดง tasks assigned
- [ ] แสดง tasks completed
- [ ] แสดง completion rate
- [ ] แสดง status (Active/Offline)
- [ ] Sort by performance ทำงานได้
- [ ] Click officer แสดง details

**Expected Columns**:
- Officer Name
- Tasks Assigned
- Tasks Completed
- Completion Rate (%)
- Status
- Actions

**Status**: ⚪ Not Tested Yet

---

### 5. Active Tasks List
- [ ] แสดง active tasks ทั้งหมด
- [ ] แสดง task details (title, assignee, due date)
- [ ] แสดง priority badges
- [ ] แสดง status indicators
- [ ] Filter by status ทำงานได้
- [ ] Filter by assignee ทำงานได้
- [ ] Click task แสดง details
- [ ] Reassign task ทำงานได้

**Expected Info per Task**:
- Task ID
- Title
- Assigned to
- Due date
- Priority
- Status
- Actions (View, Reassign, Complete)

**Status**: ⚪ Not Tested Yet

---

### 6. Recent Reports
- [ ] แสดง recent reports (10-20 items)
- [ ] แสดง report details
- [ ] แสดง timestamp
- [ ] แสดง author
- [ ] Click report เปิด details
- [ ] Download report ทำงานได้
- [ ] Filter by date ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 7. Quick Actions
- [ ] ปุ่ม "สร้าง Incident ใหม่" ทำงานได้
- [ ] ปุ่ม "มอบหมายงาน" ทำงานได้
- [ ] ปุ่ม "ดูรายงานทั้งหมด" ทำงานได้
- [ ] ปุ่ม "ส่งออกข้อมูล" ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 8. Real-time Updates
- [ ] Dashboard auto-refresh (if implemented)
- [ ] New incidents appear automatically
- [ ] Task status updates in real-time
- [ ] Notifications work properly

**Status**: ⚪ Not Tested Yet

---

### 9. Filters & Search
- [ ] Search incidents ทำงานได้
- [ ] Filter by date range ทำงานได้
- [ ] Filter by severity ทำงานได้
- [ ] Filter by status ทำงานได้
- [ ] Filter by assignee ทำงานได้
- [ ] Clear filters ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 10. Responsive Design
- [ ] Desktop (1920x1080) - ✅ / ❌
- [ ] Laptop (1366x768) - ✅ / ❌
- [ ] Tablet (768x1024) - ✅ / ❌
- [ ] Mobile (375x667) - ✅ / ❌

**Status**: ⚪ Not Tested Yet

---

## 🔌 API Testing Checklist

### Expected API Calls:

1. **GET /api/statistics/supervisor** - Dashboard stats
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Stats data complete

2. **GET /api/incidents?status=active** - Active incidents
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Incidents array returned

3. **GET /api/tasks?assignedBy=supervisor** - Tasks
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Tasks array returned

4. **GET /api/users?role=FIELD_OFFICER** - Field officers
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Officers array returned

5. **GET /api/reports?limit=20** - Recent reports
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Reports array returned

6. **POST /api/tasks/:id/reassign** - Reassign task
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Task reassigned

**Status**: ⚪ Not Tested Yet

---

## 🎯 Test Scenarios

### Scenario 1: View Dashboard Overview
1. Login as SUPERVISOR
2. Navigate to Supervisor Dashboard
3. Verify all sections load
4. Verify data is real (not hardcoded)

**Expected**: Dashboard shows real-time data

---

### Scenario 2: Monitor Incident on Map
1. View incident map
2. Click on incident marker
3. Verify popup shows correct info
4. Click "View Details" in popup

**Expected**: Navigate to incident details page

---

### Scenario 3: Reassign Task
1. Go to Active Tasks section
2. Select a task
3. Click "Reassign"
4. Select new field officer
5. Submit

**Expected**: Task reassigned successfully

---

### Scenario 4: Filter by Date Range
1. Use date range filter
2. Select last 7 days
3. Verify only recent incidents shown

**Expected**: Filtered results correct

---

## 📸 Screenshots

### Screenshot 1: Dashboard Overview
```
[แนบ screenshot ของหน้าเต็ม]
```

### Screenshot 2: Incident Map
```
[แนบ screenshot ของ map with markers]
```

### Screenshot 3: Team Performance
```
[แนบ screenshot ของ team metrics]
```

### Screenshot 4: Active Tasks
```
[แนบ screenshot ของ task list]
```

### Screenshot 5: Mobile View
```
[แนบ screenshot บน mobile]
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
**Priority**: 🔴 Critical  
**Estimate to Fix**: TBD

---

## ✅ Sign-off

**Tested by**: _______________  
**Date**: _______________  
**Status**: [ ] PASS  [ ] FAIL  [ ] PARTIAL

---

**Status**: 🟡 Ready to Test  
**Created**: 29 พฤศจิกายน 2568 12:20 น.
