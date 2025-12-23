# 🧪 Test Report: Field Officer Tasks

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: งานของฉัน (My Tasks)  
**Path**: `/field-officer/tasks`  
**Component**: `FieldOfficerTasksPage`  
**Access Role**: FIELD_OFFICER  
**Priority**: 🔴 Critical

---

## 📝 Test Objectives

1. ตรวจสอบ Task List แสดงงานที่ได้รับมอบหมาย
2. ตรวจสอบ Task Details และ Instructions
3. ตรวจสอบ Status Update workflow
4. ตรวจสอบ Check-in/Check-out system
5. ตรวจสอบ Photo upload และ Report submission
6. ตรวจสอบ Map navigation

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้
- [ ] Header "📋 งานของฉัน" แสดงถูกต้อง
- [ ] Task list แสดงถูกต้อง
- [ ] Filter tabs แสดงถูกต้อง (All, Pending, In Progress, Completed)
- [ ] Search bar แสดงถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 2. Task List
- [ ] แสดง tasks ที่ assigned ให้ field officer
- [ ] แสดง task cards พร้อมข้อมูลสำคัญ
- [ ] Priority badges แสดงถูกต้อง
- [ ] Due date indicators แสดงถูกต้อง
- [ ] Overdue tasks แสดงเป็นสีแดง
- [ ] Status indicators แสดงถูกต้อง

**Expected Info per Task Card**:
- Task ID
- Title
- Incident type & severity
- Location
- Due date
- Priority
- Status
- Actions (View, Start, Complete)

**Status**: ⚪ Not Tested Yet

---

### 3. Task Details
- [ ] คลิก task เปิด details page
- [ ] แสดง task information ครบถ้วน
- [ ] แสดง incident details
- [ ] แสดง location บน map
- [ ] แสดง instructions จาก supervisor
- [ ] แสดง attached files/images
- [ ] แสดง timeline/history

**Status**: ⚪ Not Tested Yet

---

### 4. Check-in System
- [ ] ปุ่ม "Check-in" แสดงเมื่อ task status = PENDING
- [ ] คลิก Check-in ขอ GPS location
- [ ] Verify location ใกล้ incident location (ถ้ามี validation)
- [ ] Check-in สำเร็จ แสดง timestamp
- [ ] Status เปลี่ยนเป็น IN_PROGRESS
- [ ] ปุ่ม "Check-out" แสดง

**Status**: ⚪ Not Tested Yet

---

### 5. Work Progress Update
- [ ] Form สำหรับ update progress แสดง
- [ ] Input fields ครบถ้วน:
  - Progress percentage (slider)
  - Status notes (textarea)
  - Photos (upload, max 5)
  - Issues encountered (optional)
- [ ] Upload photos ทำงานได้
- [ ] Preview photos ทำงานได้
- [ ] Submit update สำเร็จ
- [ ] Update แสดงใน timeline

**Status**: ⚪ Not Tested Yet

---

### 6. Check-out & Complete Task
- [ ] ปุ่ม "Check-out" ทำงานได้
- [ ] Verify location (ถ้ามี validation)
- [ ] Check-out สำเร็จ แสดง timestamp
- [ ] Form "Complete Task" แสดง
- [ ] Required fields:
  - Final report (textarea)
  - Photos (min 1, max 10)
  - Affected households (number)
  - Severity assessment
- [ ] Submit สำเร็จ
- [ ] Status เปลี่ยนเป็น COMPLETED
- [ ] Task หายจาก "In Progress" list

**Status**: ⚪ Not Tested Yet

---

### 7. Map Navigation
- [ ] ปุ่ม "Navigate" แสดง
- [ ] คลิก Navigate เปิด map
- [ ] แสดง current location
- [ ] แสดง destination (incident location)
- [ ] แสดง route (ถ้ามี)
- [ ] ปุ่ม "Open in Google Maps" ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 8. Filter & Search
- [ ] Tab "All Tasks" แสดงทั้งหมด
- [ ] Tab "Pending" แสดงเฉพาะ pending
- [ ] Tab "In Progress" แสดงเฉพาะ in progress
- [ ] Tab "Completed" แสดงเฉพาะ completed
- [ ] Search by title ทำงานได้
- [ ] Filter by priority ทำงานได้
- [ ] Filter by due date ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 9. Notifications
- [ ] แสดง notification badge เมื่อมี new tasks
- [ ] แสดง notification เมื่อ task overdue
- [ ] แสดง notification เมื่อ supervisor comment
- [ ] Click notification navigate ถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 10. Offline Support (ถ้ามี)
- [ ] App ทำงานได้ offline
- [ ] Cache task data
- [ ] Queue updates เมื่อ offline
- [ ] Sync เมื่อ online กลับมา

**Status**: ⚪ Not Tested Yet

---

### 11. Responsive Design
- [ ] Desktop (1920x1080) - ✅ / ❌
- [ ] Laptop (1366x768) - ✅ / ❌
- [ ] Tablet (768x1024) - ✅ / ❌
- [ ] Mobile (375x667) - ✅ / ❌ (สำคัญมาก!)

**Status**: ⚪ Not Tested Yet

---

## 🔌 API Testing Checklist

### Expected API Calls:

1. **GET /api/tasks?assignedTo=:userId** - Fetch my tasks
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Tasks array returned

2. **GET /api/tasks/:id** - Fetch task details
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Task object complete

3. **POST /api/tasks/:id/check-in** - Check-in
   - [ ] Request with GPS location
   - [ ] Response status: 200 OK
   - [ ] Check-in timestamp recorded

4. **POST /api/tasks/:id/check-out** - Check-out
   - [ ] Request with GPS location
   - [ ] Response status: 200 OK
   - [ ] Check-out timestamp recorded

5. **PATCH /api/tasks/:id/progress** - Update progress
   - [ ] Request with progress data
   - [ ] Response status: 200 OK
   - [ ] Progress updated

6. **POST /api/tasks/:id/complete** - Complete task
   - [ ] Request with final report
   - [ ] Response status: 200 OK
   - [ ] Task status = COMPLETED

7. **POST /api/tasks/:id/photos** - Upload photos
   - [ ] Request with multipart/form-data
   - [ ] Response status: 201 Created
   - [ ] Photo URLs returned

**Status**: ⚪ Not Tested Yet

---

## 🎯 Test Scenarios

### Scenario 1: Complete Task Workflow (Happy Path)
1. Login as FIELD_OFFICER
2. Navigate to "งานของฉัน"
3. Select a PENDING task
4. Click "Check-in"
5. Allow GPS location
6. Verify check-in successful
7. Update progress to 50%
8. Upload 2 photos
9. Add status notes
10. Submit update
11. Click "Check-out"
12. Fill final report
13. Upload 3 photos
14. Submit completion
15. Verify task status = COMPLETED

**Expected**: Task completed successfully

---

### Scenario 2: GPS Validation
1. Select a task
2. Try to check-in from wrong location (far from incident)

**Expected**: Warning or error (ถ้ามี validation)

---

### Scenario 3: Overdue Task Alert
1. View task list
2. Verify overdue tasks show in red
3. Verify notification badge

**Expected**: Overdue tasks highlighted

---

### Scenario 4: Photo Upload Limit
1. Try to upload more than 10 photos

**Expected**: Error "Maximum 10 photos allowed"

---

### Scenario 5: Mobile Usage
1. Test on mobile device
2. Check-in using mobile GPS
3. Take photo using camera
4. Upload photo
5. Complete task

**Expected**: All features work on mobile

---

## 📸 Screenshots

### Screenshot 1: Task List
```
[แนบ screenshot ของ task list]
```

### Screenshot 2: Task Details
```
[แนบ screenshot ของ task details with map]
```

### Screenshot 3: Check-in Success
```
[แนบ screenshot ของ check-in confirmation]
```

### Screenshot 4: Progress Update Form
```
[แนบ screenshot ของ progress form]
```

### Screenshot 5: Complete Task Form
```
[แนบ screenshot ของ completion form]
```

### Screenshot 6: Mobile View
```
[แนบ screenshot บน mobile - สำคัญมาก!]
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

### Critical for Field Operations:
- ✅ Must work on mobile
- ✅ GPS must be accurate
- ✅ Photo upload must work
- ✅ Offline support (nice to have)

---

## ✅ Sign-off

**Tested by**: _______________  
**Date**: _______________  
**Status**: [ ] PASS  [ ] FAIL  [ ] PARTIAL

---

**Status**: 🟡 Ready to Test  
**Created**: 29 พฤศจิกายน 2568 12:30 น.

**Note**: หน้านี้สำคัญมาก! Field officers ใช้งานจริงในพื้นที่!
