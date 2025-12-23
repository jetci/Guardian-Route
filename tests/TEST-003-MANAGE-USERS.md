# 🧪 Test Report: Manage Users

**วันที่**: 29 พฤศจิกายน 2568  
**ผู้ทดสอบ**: Team W  
**Browser**: Chrome 120+  
**Screen Size**: 1920x1080

---

## 📋 Menu Information

**Menu Name**: จัดการผู้ใช้ (Manage Users)  
**Path**: `/manage-users`  
**Component**: `ManageUsersPage`  
**Access Role**: ADMIN  
**Priority**: 🔴 Critical

---

## 📝 Test Objectives

1. ตรวจสอบ User List แสดงครบถ้วน
2. ตรวจสอบ CRUD operations ทำงานได้
3. ตรวจสอบ Search & Filter ทำงานได้
4. ตรวจสอบ Role-based permissions
5. ตรวจสอบ Validation ครบถ้วน

---

## ✅ UI/UX Testing Checklist

### 1. Page Load & Layout
- [ ] หน้า UI โหลดได้
- [ ] Header "👥 จัดการผู้ใช้" แสดงถูกต้อง
- [ ] User table แสดงถูกต้อง
- [ ] ปุ่ม "เพิ่มผู้ใช้ใหม่" แสดงถูกต้อง
- [ ] Search bar แสดงถูกต้อง
- [ ] Filter dropdowns แสดงถูกต้อง

**Status**: ⚪ Not Tested Yet

---

### 2. User Table
- [ ] Table headers ครบถ้วน
- [ ] User data แสดงถูกต้อง
- [ ] Avatar/Icon แสดงถูกต้อง
- [ ] Role badges แสดงถูกต้อง
- [ ] Status indicators แสดงถูกต้อง
- [ ] Action buttons แสดงครบถ้วน

**Expected Columns**:
- Avatar/Icon
- Name (First + Last)
- Username
- Email
- Role
- Status
- Actions (Edit, Delete, Toggle)

**Status**: ⚪ Not Tested Yet

---

### 3. Create User
- [ ] คลิกปุ่ม "เพิ่มผู้ใช้ใหม่" เปิด modal/form
- [ ] Form fields ครบถ้วน
- [ ] Labels ชัดเจน
- [ ] Placeholders เหมาะสม
- [ ] Required fields มีเครื่องหมาย *
- [ ] Validation ทำงานได้

**Required Fields**:
- Username (unique)
- Email (unique, valid format)
- Password (min length, complexity)
- First Name
- Last Name
- Role
- Phone (optional)

**Validation Rules**:
- Username: alphanumeric, 3-20 characters
- Email: valid email format
- Password: min 8 characters, 1 uppercase, 1 lowercase, 1 number
- Phone: valid Thai phone format (optional)

**Status**: ⚪ Not Tested Yet

---

### 4. Edit User
- [ ] คลิกปุ่ม Edit เปิด modal/form
- [ ] Form pre-fill ด้วยข้อมูลเดิม
- [ ] แก้ไขข้อมูลได้
- [ ] Password field optional (ถ้าไม่ต้องการเปลี่ยน)
- [ ] Validation ทำงานได้
- [ ] Submit สำเร็จ

**Test**: แก้ไข user profile (name, email, role)

**Status**: ⚪ Not Tested Yet

---

### 5. Delete User
- [ ] คลิกปุ่ม Delete แสดง confirmation
- [ ] Confirmation message ชัดเจน
- [ ] แสดงชื่อ user ที่จะลบ
- [ ] Cancel ทำงานได้
- [ ] Confirm ลบสำเร็จ
- [ ] ไม่สามารถลบ user ตัวเองได้

**Test**: ลบ test user

**Status**: ⚪ Not Tested Yet

---

### 6. Toggle User Status
- [ ] คลิก toggle switch/button
- [ ] Status เปลี่ยนทันที
- [ ] แสดง success message
- [ ] User ที่ inactive ไม่สามารถ login ได้

**Test**: Toggle status ของ test user

**Status**: ⚪ Not Tested Yet

---

### 7. Search Functionality
- [ ] Search by username ทำงานได้
- [ ] Search by email ทำงานได้
- [ ] Search by name ทำงานได้
- [ ] Search แบบ real-time (ถ้ามี)
- [ ] Clear search ทำงานได้
- [ ] แสดง "No results" เมื่อไม่พบ

**Test Cases**:
1. Search: "admin"
2. Search: "supervisor@"
3. Search: "field"
4. Search: "xyz" (no results)

**Status**: ⚪ Not Tested Yet

---

### 8. Filter Functionality
- [ ] Filter by role ทำงานได้
- [ ] Filter by status ทำงานได้
- [ ] Combine filters ทำงานได้
- [ ] Clear filters ทำงานได้

**Test Cases**:
1. Filter: Role = ADMIN
2. Filter: Status = ACTIVE
3. Filter: Role = FIELD_OFFICER + Status = ACTIVE

**Status**: ⚪ Not Tested Yet

---

### 9. Pagination (ถ้ามี)
- [ ] Pagination controls แสดงถูกต้อง
- [ ] Page numbers ถูกต้อง
- [ ] Next/Previous ทำงานได้
- [ ] Jump to page ทำงานได้
- [ ] Items per page ทำงานได้

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
   - [ ] Users array returned
   - [ ] User objects complete

2. **POST /api/users** - Create user
   - [ ] Request with valid payload
   - [ ] Response status: 201 Created
   - [ ] User object returned with ID

3. **PUT /api/users/:id** - Update user
   - [ ] Request with valid payload
   - [ ] Response status: 200 OK
   - [ ] Updated user object returned

4. **DELETE /api/users/:id** - Delete user
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK or 204
   - [ ] User removed

5. **PATCH /api/users/:id/toggle-status** - Toggle status
   - [ ] Request sent successfully
   - [ ] Response status: 200 OK
   - [ ] Status toggled

**Status**: ⚪ Not Tested Yet

---

## 🎯 Test Scenarios

### Scenario 1: Create New User (Happy Path)
1. Click "เพิ่มผู้ใช้ใหม่"
2. Fill all required fields:
   - Username: testuser002
   - Email: testuser002@obtwiang.go.th
   - Password: Test@1234
   - First Name: Test
   - Last Name: User 002
   - Role: FIELD_OFFICER
3. Submit
4. Verify user appears in table
5. Verify success message

**Expected**: User created successfully

---

### Scenario 2: Validation - Duplicate Username
1. Try to create user with existing username
2. Submit

**Expected**: Error "Username already exists"

---

### Scenario 3: Validation - Invalid Email
1. Try to create user with invalid email (e.g., "notanemail")
2. Submit

**Expected**: Error "Invalid email format"

---

### Scenario 4: Validation - Weak Password
1. Try to create user with weak password (e.g., "123")
2. Submit

**Expected**: Error "Password must be at least 8 characters..."

---

### Scenario 5: Edit User Role
1. Select a FIELD_OFFICER user
2. Click Edit
3. Change role to SUPERVISOR
4. Submit
5. Verify role updated

**Expected**: Role changed successfully

---

### Scenario 6: Delete Protection
1. Try to delete currently logged-in user

**Expected**: Error or prevention

---

### Scenario 7: Search & Filter Combination
1. Search: "field"
2. Filter: Role = FIELD_OFFICER
3. Verify results match both criteria

**Expected**: Only field officers with "field" in name/email shown

---

## 📸 Screenshots

### Screenshot 1: User List
```
[แนบ screenshot ของ user table]
```

### Screenshot 2: Create User Form
```
[แนบ screenshot ของ create form]
```

### Screenshot 3: Edit User Form
```
[แนบ screenshot ของ edit form]
```

### Screenshot 4: Delete Confirmation
```
[แนบ screenshot ของ confirmation dialog]
```

### Screenshot 5: Search Results
```
[แนบ screenshot ของ search results]
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
**Created**: 29 พฤศจิกายน 2568 12:10 น.
