# 🧪 Test Report: Admin Dashboard

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: แดชบอร์ดระบบ (System Dashboard)  
**Path**: `/dashboard/admin`  
**Component**: `AdminDashboardV2`  
**Access Role**: ADMIN  
**Priority**: 🔴 Critical

---

## 📝 Test Objectives

1. ตรวจสอบ Stats Cards แสดงข้อมูลถูกต้อง
2. ตรวจสอบ User Management Table ทำงานได้
3. ตรวจสอบ CRUD operations (Create, Read, Update, Delete)
4. ตรวจสอบ Activity Logs แสดงถูกต้อง
5. ตรวจสอบ Responsive design

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้ (ไม่มี white screen)
- [ ] Layout ถูกต้อง (ไม่เบี้ยว, ไม่ซ้อนกัน)
- [ ] Header "🛡️ Admin Dashboard" แสดงถูกต้อง
- [ ] Sidebar แสดงถูกต้อง (1 ชั้นเท่านั้น)
- [ ] Stats cards แสดงครบ 4 cards

**Expected Stats Cards**:
1. Total Users
2. Active Incidents
3. Pending Reports
4. System Health

**Status**: ⚪ Not Tested Yet

---

### 2. Stats Cards Testing
- [ ] Total Users แสดงจำนวนถูกต้อง
- [ ] Active Incidents แสดงจำนวนถูกต้อง
- [ ] Pending Reports แสดงจำนวนถูกต้อง
- [ ] System Health แสดงเปอร์เซ็นต์ (ควรเป็น real data, ไม่ใช่ hardcoded 98)
- [ ] Icons แสดงถูกต้อง
- [ ] Colors สอดคล้องกับ design system

**Status**: ⚪ Not Tested Yet

---

### 3. User Management Table
- [ ] Table headers แสดงครบถ้วน (Username, Email, Role, Status, Actions)
- [ ] User data โหลดและแสดงถูกต้อง
- [ ] Search bar ทำงานได้
- [ ] Role filter ทำงานได้
- [ ] Status filter ทำงานได้
- [ ] Pagination ทำงานได้ (ถ้ามี)

**Expected Columns**:
- Username
- Email
- Role (ADMIN, EXECUTIVE, SUPERVISOR, FIELD_OFFICER)
- Status (Active/Inactive)
- Actions (Edit, Delete, Toggle Status)

**Status**: ⚪ Not Tested Yet

---

### 4. Create User (CRUD - Create)
- [ ] คลิกปุ่ม "เพิ่มผู้ใช้ใหม่" เปิด modal
- [ ] Form fields ครบถ้วน (Username, Email, Password, Role, etc.)
- [ ] Validation ทำงานได้ (required fields)
- [ ] Email validation ทำงานได้
- [ ] Password validation ทำงานได้
- [ ] Role dropdown แสดงครบถ้วน
- [ ] Submit สำเร็จ แสดง success message
- [ ] User ใหม่แสดงใน table
- [ ] Modal ปิดหลัง submit สำเร็จ

**Test Data**:
```
Username: testuser001
Email: testuser001@obtwiang.go.th
Password: Test@1234
Role: FIELD_OFFICER
```

**Status**: ⚪ Not Tested Yet

---

### 5. Edit User (CRUD - Update)
- [ ] คลิกปุ่ม Edit เปิด modal
- [ ] Form pre-fill ด้วยข้อมูลเดิม
- [ ] แก้ไขข้อมูลได้
- [ ] Validation ทำงานได้
- [ ] Submit สำเร็จ แสดง success message
- [ ] ข้อมูลอัพเดทใน table
- [ ] Modal ปิดหลัง submit สำเร็จ

**Test**: แก้ไข Role จาก FIELD_OFFICER → SUPERVISOR

**Status**: ⚪ Not Tested Yet

---

### 6. Delete User (CRUD - Delete)
- [ ] คลิกปุ่ม Delete แสดง confirmation dialog
- [ ] Confirmation message ชัดเจน
- [ ] Cancel ทำงานได้ (ไม่ลบ)
- [ ] Confirm ลบสำเร็จ
- [ ] แสดง success message
- [ ] User หายจาก table
- [ ] ไม่สามารถลบ user ตัวเองได้ (ถ้ามี protection)

**Test**: ลบ testuser001 ที่สร้างไว้

**Status**: ⚪ Not Tested Yet

---

### 7. Toggle User Status
- [ ] คลิกปุ่ม Toggle Status
- [ ] Status เปลี่ยนจาก Active → Inactive หรือ Inactive → Active
- [ ] แสดง success message
- [ ] Status อัพเดทใน table
- [ ] User ที่ Inactive ไม่สามารถ login ได้

**Test**: Toggle status ของ field1@obtwiang.go.th

**Status**: ⚪ Not Tested Yet

---

### 8. Activity Logs
- [ ] Activity logs section แสดง
- [ ] แสดงกิจกรรมล่าสุด (20 items)
- [ ] แสดง timestamp ถูกต้อง
- [ ] แสดง user name ถูกต้อง
- [ ] แสดง action ถูกต้อง
- [ ] Format อ่านง่าย

**Status**: ⚪ Not Tested Yet

---

### 9. Search & Filter
- [ ] Search by username ทำงานได้
- [ ] Search by email ทำงานได้
- [ ] Filter by role ทำงานได้
- [ ] Filter by status ทำงานได้
- [ ] Combine search + filter ทำงานได้
- [ ] Clear filters ทำงานได้

**Test Cases**:
1. Search: "supervisor"
2. Filter: Role = SUPERVISOR
3. Filter: Status = ACTIVE
4. Search "field" + Filter Role = FIELD_OFFICER

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

1. **GET /api/users** - Fetch all users
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Data format correct
   - [ ] Users array returned

2. **GET /api/statistics/incidents** - Fetch incident statistics
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Statistics data correct

3. **GET /api/statistics/reports** - Fetch report statistics
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Statistics data correct

4. **GET /api/statistics/activity-logs?limit=20** - Fetch activity logs
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Logs array returned (max 20 items)

5. **POST /api/users** - Create user
   - [ ] Request sent with correct payload
   - [ ] Response status: 201 Created
   - [ ] User object returned
   - [ ] User appears in list

6. **PUT /api/users/:id** - Update user
   - [ ] Request sent with correct payload
   - [ ] Response status: 200 OK
   - [ ] Updated user object returned
   - [ ] Changes reflected in list

7. **DELETE /api/users/:id** - Delete user
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK or 204 No Content
   - [ ] User removed from list

8. **PATCH /api/users/:id/toggle-status** - Toggle user status
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Status toggled correctly

**Status**: ⚪ Not Tested Yet

---

## 📊 Performance Testing

### Load Time:
- **First Load**: _____ ms
- **Subsequent Load**: _____ ms
- **API Response Time**: _____ ms

### Performance Metrics:
- [ ] Page load < 3 seconds
- [ ] API response < 1 second
- [ ] No memory leaks
- [ ] No console errors
- [ ] No console warnings

**Status**: ⚪ Not Tested Yet

---

## 🐛 Known Issues (From Code Analysis)

### Potential Issues:
1. **System Health Hardcoded**
   - Line 212: `systemHealth: 98 // TODO: Get from health endpoint`
   - Should fetch from real API

2. **DEVELOPER Users Hidden**
   - Lines 234-236: Admin cannot see DEVELOPER role users
   - This is intentional but should be documented

3. **Error Handling**
   - Need to verify error messages are user-friendly
   - Need to verify network error handling

---

## 🎯 Test Scenarios

### Scenario 1: Happy Path - Create New User
1. Login as ADMIN
2. Navigate to Admin Dashboard
3. Click "เพิ่มผู้ใช้ใหม่"
4. Fill form with valid data
5. Submit
6. Verify user appears in table
7. Verify success message

**Expected**: User created successfully

---

### Scenario 2: Validation - Duplicate Email
1. Try to create user with existing email
2. Submit form

**Expected**: Error message "Email already exists"

---

### Scenario 3: Search & Filter
1. Search for "supervisor"
2. Verify only supervisors shown
3. Change filter to Role = FIELD_OFFICER
4. Verify only field officers shown

**Expected**: Search and filter work correctly

---

### Scenario 4: Delete Protection
1. Try to delete currently logged-in user

**Expected**: Error or warning (cannot delete self)

---

## 📸 Screenshots

### Screenshot 1: Dashboard Overview
```
[แนบ screenshot ของหน้าเต็ม]
- Stats cards
- User table
- Activity logs
```

### Screenshot 2: Create User Modal
```
[แนบ screenshot ของ modal]
- Form fields
- Validation
```

### Screenshot 3: Edit User Modal
```
[แนบ screenshot ของ modal]
- Pre-filled data
```

### Screenshot 4: Delete Confirmation
```
[แนบ screenshot ของ confirmation dialog]
```

### Screenshot 5: Mobile View
```
[แนบ screenshot บน mobile]
```

---

## 📝 Network Logs

### Sample Request/Response:

#### GET /api/users
```json
Request Headers:
{
  "Authorization": "Bearer eyJhbGc...",
  "Content-Type": "application/json"
}

Response (200 OK):
{
  "data": [
    {
      "id": "1",
      "username": "admin",
      "email": "admin@obtwiang.go.th",
      "role": "ADMIN",
      "isActive": true,
      ...
    }
  ]
}
```

#### POST /api/users
```json
Request Body:
{
  "username": "testuser001",
  "email": "testuser001@obtwiang.go.th",
  "password": "Test@1234",
  "role": "FIELD_OFFICER",
  "firstName": "Test",
  "lastName": "User"
}

Response (201 Created):
{
  "id": "123",
  "username": "testuser001",
  ...
}
```

---

## 🐛 Bugs Found

### Bug #1: [ถ้าพบ]
**Severity**: 🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low

**Description**:
```
[รายละเอียดของ bug]
```

**Steps to Reproduce**:
1. [ขั้นตอนที่ 1]
2. [ขั้นตอนที่ 2]
3. [ขั้นตอนที่ 3]

**Expected Result**:
```
[ผลลัพธ์ที่คาดหวัง]
```

**Actual Result**:
```
[ผลลัพธ์ที่เกิดขึ้นจริง]
```

**Screenshot**:
```
[แนบ screenshot]
```

**Console Log**:
```
[แนบ console log]
```

---

## 📈 Overall Assessment

**UI Status**: ⚪ Not Tested Yet  
**API Status**: ⚪ Not Tested Yet  
**Priority**: 🔴 Critical  
**Estimate to Fix**: TBD after testing

### Summary:
```
[สรุปผลการทดสอบ]
```

### Recommendations:
```
[คำแนะนำ]
```

---

## ✅ Sign-off

**Tested by**: _______________  
**Date**: _______________  
**Status**: [ ] PASS  [ ] FAIL  [ ] PARTIAL

**Reviewer**: _______________  
**Date**: _______________

---

**Status**: 🟡 Ready to Test  
**Created**: 29 พฤศจิกายน 2568 12:10 น.
