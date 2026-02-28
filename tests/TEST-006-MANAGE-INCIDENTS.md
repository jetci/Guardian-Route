# 🧪 Test Report: Manage Incidents

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: จัดการเหตุการณ์ (Manage Incidents)  
**Path**: `/manage-incidents`  
**Component**: `ManageIncidentsPage`  
**Access Role**: ADMIN, SUPERVISOR  
**Priority**: 🔴 Critical

---

## 📝 Test Objectives

1. ตรวจสอบ Incident List แสดงครบถ้วน
2. ตรวจสอบ CRUD operations ทำงานได้
3. ตรวจสอบ Status workflow (New → In Progress → Resolved)
4. ตรวจสอบ Assignment system
5. ตรวจสอบ Search & Filter
6. ตรวจสอบ Map integration

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้
- [ ] Header "🚨 จัดการเหตุการณ์" แสดงถูกต้อง
- [ ] Incident table แสดงถูกต้อง
- [ ] ปุ่ม "สร้างเหตุการณ์ใหม่" แสดงถูกต้อง
- [ ] Search & Filter bar แสดงถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 2. Incident Table
- [ ] Table headers ครบถ้วน
- [ ] Incident data แสดงถูกต้อง
- [ ] Severity badges แสดงถูกต้อง
- [ ] Status indicators แสดงถูกต้อง
- [ ] Action buttons แสดงครบถ้วน

**Expected Columns**:
- ID
- Title
- Type (Flood, Fire, Landslide, etc.)
- Severity (Critical, High, Medium, Low)
- Status (New, In Progress, Resolved, Closed)
- Location
- Assigned To
- Created Date
- Actions (View, Edit, Delete, Assign)

**Status**: ⚪ Not Tested Yet

---

### 3. Create Incident
- [ ] คลิกปุ่ม "สร้างเหตุการณ์ใหม่" เปิด form
- [ ] Form fields ครบถ้วน
- [ ] Validation ทำงานได้
- [ ] Map picker ทำงานได้ (select location)
- [ ] Upload images ทำงานได้
- [ ] Submit สำเร็จ

**Required Fields**:
- Title
- Type (dropdown)
- Severity (dropdown)
- Location (map picker or lat/lng)
- Description
- Images (optional, max 5)

**Status**: ⚪ Not Tested Yet

---

### 4. View Incident Details
- [ ] คลิก incident เปิด details page
- [ ] แสดงข้อมูลครบถ้วน
- [ ] แสดง location บน map
- [ ] แสดง images gallery
- [ ] แสดง timeline/history
- [ ] แสดง assigned tasks
- [ ] แสดง related reports

**Status**: ⚪ Not Tested Yet

---

### 5. Edit Incident
- [ ] คลิกปุ่ม Edit เปิด form
- [ ] Form pre-fill ด้วยข้อมูลเดิม
- [ ] แก้ไขข้อมูลได้
- [ ] Validation ทำงานได้
- [ ] Submit สำเร็จ

**Status**: ⚪ Not Tested Yet

---

### 6. Delete Incident
- [ ] คลิกปุ่ม Delete แสดง confirmation
- [ ] Confirmation message ชัดเจน
- [ ] แสดง warning (จะลบ tasks และ reports ที่เกี่ยวข้อง)
- [ ] Cancel ทำงานได้
- [ ] Confirm ลบสำเร็จ

**Status**: ⚪ Not Tested Yet

---

### 7. Assign Incident
- [ ] คลิกปุ่ม "Assign" เปิด modal
- [ ] แสดงรายชื่อ Field Officers
- [ ] Select officer ได้
- [ ] Set due date ได้
- [ ] Add instructions ได้
- [ ] Submit สำเร็จ
- [ ] Officer ได้รับ notification

**Status**: ⚪ Not Tested Yet

---

### 8. Status Workflow
- [ ] Change status: New → In Progress
- [ ] Change status: In Progress → Resolved
- [ ] Change status: Resolved → Closed
- [ ] Cannot skip steps (validation)
- [ ] Status history recorded

**Expected Workflow**:
```
New → In Progress → Resolved → Closed
     ↓
  Cancelled (optional)
```

**Status**: ⚪ Not Tested Yet

---

### 9. Search & Filter
- [ ] Search by title ทำงานได้
- [ ] Search by ID ทำงานได้
- [ ] Filter by type ทำงานได้
- [ ] Filter by severity ทำงานได้
- [ ] Filter by status ทำงานได้
- [ ] Filter by date range ทำงานได้
- [ ] Filter by assignee ทำงานได้
- [ ] Combine filters ทำงานได้

**Test Cases**:
1. Search: "น้ำท่วม"
2. Filter: Type = FLOOD
3. Filter: Severity = CRITICAL
4. Filter: Status = IN_PROGRESS
5. Filter: Date = Last 7 days

**Status**: ⚪ Not Tested Yet

---

### 10. Map Integration
- [ ] Map view toggle ทำงานได้
- [ ] Incidents แสดงบน map
- [ ] Markers แสดง severity colors
- [ ] Click marker แสดง popup
- [ ] Popup มีข้อมูลครบถ้วน
- [ ] Click "View Details" navigate ถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 11. Pagination & Sorting
- [ ] Pagination ทำงานได้
- [ ] Sort by date ทำงานได้
- [ ] Sort by severity ทำงานได้
- [ ] Sort by status ทำงานได้
- [ ] Items per page ทำงานได้

**Status**: ⚪ Not Tested Yet

---

### 12. Responsive Design
- [ ] Desktop (1920x1080) - ✅ / ❌
- [ ] Laptop (1366x768) - ✅ / ❌
- [ ] Tablet (768x1024) - ✅ / ❌
- [ ] Mobile (375x667) - ✅ / ❌

**Status**: ⚪ Not Tested Yet

---

## 🔌 API Testing Checklist

### Expected API Calls:

1. **GET /api/incidents** - Fetch all incidents
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Incidents array returned

2. **GET /api/incidents/:id** - Fetch incident details
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Incident object complete

3. **POST /api/incidents** - Create incident
   - [ ] Request with valid payload
   - [ ] Response status: 201 Created
   - [ ] Incident object returned with ID

4. **PUT /api/incidents/:id** - Update incident
   - [ ] Request with valid payload
   - [ ] Response status: 200 OK
   - [ ] Updated incident returned

5. **DELETE /api/incidents/:id** - Delete incident
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK or 204
   - [ ] Incident removed

6. **PATCH /api/incidents/:id/status** - Update status
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Status updated

7. **POST /api/incidents/:id/assign** - Assign to officer
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Assignment created

**Status**: ⚪ Not Tested Yet

---

## 🎯 Test Scenarios

### Scenario 1: Create New Incident (Happy Path)
1. Click "สร้างเหตุการณ์ใหม่"
2. Fill all required fields:
   - Title: "น้ำท่วมบ้านหมู่ 5"
   - Type: FLOOD
   - Severity: HIGH
   - Location: Select on map
   - Description: "น้ำท่วมสูง 50 ซม."
3. Upload 2 images
4. Submit
5. Verify incident appears in list

**Expected**: Incident created successfully

---

### Scenario 2: Assign Incident to Field Officer
1. Select an incident
2. Click "Assign"
3. Select field officer
4. Set due date: tomorrow
5. Add instructions
6. Submit
7. Verify officer receives notification

**Expected**: Assignment successful

---

### Scenario 3: Update Incident Status
1. Select incident with status "New"
2. Change status to "In Progress"
3. Verify status updated
4. Try to change to "Closed" directly

**Expected**: Cannot skip "Resolved" status

---

### Scenario 4: Search Critical Incidents
1. Filter: Severity = CRITICAL
2. Filter: Status = IN_PROGRESS
3. Verify only critical in-progress incidents shown

**Expected**: Filtered results correct

---

## 📸 Screenshots

### Screenshot 1: Incident List
```
[แนบ screenshot ของ incident table]
```

### Screenshot 2: Create Incident Form
```
[แนบ screenshot ของ create form with map]
```

### Screenshot 3: Incident Details
```
[แนบ screenshot ของ details page]
```

### Screenshot 4: Assign Modal
```
[แนบ screenshot ของ assignment modal]
```

### Screenshot 5: Map View
```
[แนบ screenshot ของ map with incident markers]
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
**Created**: 29 พฤศจิกายน 2568 12:25 น.
