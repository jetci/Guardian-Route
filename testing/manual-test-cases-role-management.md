# Manual Test Cases: Role Management Module

**Module:** Role Management  
**Sprint:** Sprint 4 Week 1  
**Test Date:** 2025-11-09  
**Tester:** QA Team  
**Status:** In Progress

---

## Test Environment

- **Frontend URL:** http://localhost:5173
- **Backend URL:** http://localhost:3000
- **Database:** PostgreSQL (Development)
- **Browser:** Chrome, Firefox, Safari

---

## Test Data

### Test Users
- **Admin User:** admin@example.com / password123
- **Executive User:** executive@example.com / password123
- **Supervisor User:** supervisor@example.com / password123
- **Field Officer User:** officer@example.com / password123

### Test Roles
- ADMIN
- EXECUTIVE
- SUPERVISOR
- FIELD_OFFICER
- DEVELOPER

---

## Test Cases: Roles CRUD

### TC-RM-001: View All Roles
**Priority:** High  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/admin/role-management` | Role Management page loads | | ⏳ |
| 2 | Click on "บทบาท" tab | Roles list is displayed | | ⏳ |
| 3 | Verify roles table | Table shows columns: ชื่อบทบาท, รหัส, จำนวนผู้ใช้, จำนวนสิทธิ์, การจัดการ | | ⏳ |
| 4 | Verify roles data | All 5 roles are displayed | | ⏳ |

**Notes:**

---

### TC-RM-002: Create New Role
**Priority:** High  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Roles tab | Roles list is displayed | | ⏳ |
| 2 | Click "สร้างบทบาทใหม่" button | Create role modal opens | | ⏳ |
| 3 | Fill in role name: "TEST_ROLE" | Input accepts text | | ⏳ |
| 4 | Fill in display name: "ทดสอบบทบาท" | Input accepts text | | ⏳ |
| 5 | Fill in description: "บทบาทสำหรับทดสอบ" | Input accepts text | | ⏳ |
| 6 | Click "สร้าง" button | Modal closes, success toast appears | | ⏳ |
| 7 | Verify roles list | New role "TEST_ROLE" appears in the list | | ⏳ |

**Notes:**

---

### TC-RM-003: Create Role with Empty Fields
**Priority:** Medium  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Click "สร้างบทบาทใหม่" button | Create role modal opens | | ⏳ |
| 2 | Leave all fields empty | Fields remain empty | | ⏳ |
| 3 | Click "สร้าง" button | Validation errors appear | | ⏳ |
| 4 | Verify error messages | "กรุณากรอกข้อมูล" messages shown | | ⏳ |

**Notes:**

---

### TC-RM-004: Create Role with Duplicate Name
**Priority:** Medium  
**Precondition:** User is logged in as ADMIN, Role "ADMIN" exists

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Click "สร้างบทบาทใหม่" button | Create role modal opens | | ⏳ |
| 2 | Fill in role name: "ADMIN" | Input accepts text | | ⏳ |
| 3 | Fill in display name: "ผู้ดูแลระบบ" | Input accepts text | | ⏳ |
| 4 | Fill in description: "ทดสอบ" | Input accepts text | | ⏳ |
| 5 | Click "สร้าง" button | Error toast appears | | ⏳ |
| 6 | Verify error message | "ชื่อบทบาทนี้มีอยู่แล้ว" or similar | | ⏳ |

**Notes:**

---

### TC-RM-005: Edit Existing Role
**Priority:** High  
**Precondition:** User is logged in as ADMIN, Role "TEST_ROLE" exists

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Find "TEST_ROLE" in roles list | Role is visible | | ⏳ |
| 2 | Click action menu (⋮) | Menu opens | | ⏳ |
| 3 | Click "แก้ไข" | Edit role modal opens | | ⏳ |
| 4 | Verify pre-filled data | All fields contain existing data | | ⏳ |
| 5 | Change display name to "ทดสอบบทบาท (แก้ไข)" | Input accepts change | | ⏳ |
| 6 | Click "บันทึก" button | Modal closes, success toast appears | | ⏳ |
| 7 | Verify roles list | Display name is updated | | ⏳ |

**Notes:**

---

### TC-RM-006: Delete Role
**Priority:** High  
**Precondition:** User is logged in as ADMIN, Role "TEST_ROLE" exists with 0 users

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Find "TEST_ROLE" in roles list | Role is visible | | ⏳ |
| 2 | Click action menu (⋮) | Menu opens | | ⏳ |
| 3 | Click "ลบ" | Confirmation dialog appears | | ⏳ |
| 4 | Verify warning message | "คุณแน่ใจหรือไม่ที่จะลบบทบาทนี้?" | | ⏳ |
| 5 | Click "ลบ" button | Dialog closes, success toast appears | | ⏳ |
| 6 | Verify roles list | "TEST_ROLE" is removed from list | | ⏳ |

**Notes:**

---

### TC-RM-007: Delete Role with Users
**Priority:** High  
**Precondition:** User is logged in as ADMIN, Role "ADMIN" exists with users assigned

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Find "ADMIN" in roles list | Role is visible | | ⏳ |
| 2 | Click action menu (⋮) | Menu opens | | ⏳ |
| 3 | Click "ลบ" | Confirmation dialog appears | | ⏳ |
| 4 | Click "ลบ" button | Error toast appears | | ⏳ |
| 5 | Verify error message | "ไม่สามารถลบบทบาทที่มีผู้ใช้อยู่" or similar | | ⏳ |
| 6 | Verify roles list | "ADMIN" still exists in list | | ⏳ |

**Notes:**

---

## Test Cases: Permissions CRUD

### TC-PM-001: View All Permissions
**Priority:** High  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Role Management page | Page loads | | ⏳ |
| 2 | Click on "สิทธิ์" tab | Permissions list is displayed | | ⏳ |
| 3 | Verify permissions table | Table shows columns: ชื่อแสดง, ชื่อ, คำอธิบาย, หมวดหมู่, จำนวนบทบาท, การจัดการ | | ⏳ |
| 4 | Verify permissions data | Permissions are displayed | | ⏳ |

**Notes:**

---

### TC-PM-002: Filter Permissions by Category
**Priority:** Medium  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Permissions tab | Permissions list is displayed | | ⏳ |
| 2 | Click category filter dropdown | Dropdown opens | | ⏳ |
| 3 | Select "User Management" | Dropdown closes | | ⏳ |
| 4 | Verify filtered list | Only "User Management" permissions shown | | ⏳ |
| 5 | Select "ทุกหมวดหมู่" | All permissions shown again | | ⏳ |

**Notes:**

---

### TC-PM-003: Create New Permission
**Priority:** High  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Permissions tab | Permissions list is displayed | | ⏳ |
| 2 | Click "สร้างสิทธิ์ใหม่" button | Create permission modal opens | | ⏳ |
| 3 | Fill in name: "TEST_PERMISSION" | Input accepts text | | ⏳ |
| 4 | Fill in display name: "ทดสอบสิทธิ์" | Input accepts text | | ⏳ |
| 5 | Fill in description: "สิทธิ์สำหรับทดสอบ" | Input accepts text | | ⏳ |
| 6 | Select category: "Testing" | Dropdown accepts selection | | ⏳ |
| 7 | Click "สร้าง" button | Modal closes, success toast appears | | ⏳ |
| 8 | Verify permissions list | New permission appears | | ⏳ |

**Notes:**

---

### TC-PM-004: Create Permission with Empty Fields
**Priority:** Medium  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Click "สร้างสิทธิ์ใหม่" button | Create permission modal opens | | ⏳ |
| 2 | Leave all fields empty | Fields remain empty | | ⏳ |
| 3 | Click "สร้าง" button | Validation errors appear | | ⏳ |
| 4 | Verify error messages | "กรุณากรอกข้อมูล" messages shown | | ⏳ |

**Notes:**

---

### TC-PM-005: Edit Existing Permission
**Priority:** High  
**Precondition:** User is logged in as ADMIN, Permission "TEST_PERMISSION" exists

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Find "TEST_PERMISSION" in list | Permission is visible | | ⏳ |
| 2 | Click action menu (⋮) | Menu opens | | ⏳ |
| 3 | Click "แก้ไข" | Edit permission modal opens | | ⏳ |
| 4 | Verify pre-filled data | All fields contain existing data | | ⏳ |
| 5 | Change display name to "ทดสอบสิทธิ์ (แก้ไข)" | Input accepts change | | ⏳ |
| 6 | Click "บันทึก" button | Modal closes, success toast appears | | ⏳ |
| 7 | Verify permissions list | Display name is updated | | ⏳ |

**Notes:**

---

### TC-PM-006: Delete Permission
**Priority:** High  
**Precondition:** User is logged in as ADMIN, Permission "TEST_PERMISSION" exists with 0 roles

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Find "TEST_PERMISSION" in list | Permission is visible | | ⏳ |
| 2 | Click action menu (⋮) | Menu opens | | ⏳ |
| 3 | Click "ลบ" | Confirmation dialog appears | | ⏳ |
| 4 | Verify warning message | "คุณแน่ใจหรือไม่ที่จะลบสิทธิ์นี้?" | | ⏳ |
| 5 | Click "ลบ" button | Dialog closes, success toast appears | | ⏳ |
| 6 | Verify permissions list | "TEST_PERMISSION" is removed | | ⏳ |

**Notes:**

---

## Test Cases: Role-Permission Assignment

### TC-RPA-001: View Role Permissions
**Priority:** High  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Role Management page | Page loads | | ⏳ |
| 2 | Click on "กำหนดสิทธิ์" tab | Assignment page is displayed | | ⏳ |
| 3 | Verify role selector | Dropdown shows all roles | | ⏳ |
| 4 | Select "ADMIN" role | Permissions grouped by category shown | | ⏳ |
| 5 | Verify permissions display | Checkboxes show current assignments | | ⏳ |

**Notes:**

---

### TC-RPA-002: Assign Permissions to Role
**Priority:** High  
**Precondition:** User is logged in as ADMIN, "TEST_ROLE" exists

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Assignment tab | Assignment page is displayed | | ⏳ |
| 2 | Select "TEST_ROLE" from dropdown | Permissions shown (all unchecked) | | ⏳ |
| 3 | Check 3 permissions | Checkboxes are checked | | ⏳ |
| 4 | Verify selected count | Badge shows "3 selected" | | ⏳ |
| 5 | Click "บันทึก" button | Success toast appears | | ⏳ |
| 6 | Refresh page and select "TEST_ROLE" | 3 permissions remain checked | | ⏳ |

**Notes:**

---

### TC-RPA-003: Remove Permissions from Role
**Priority:** High  
**Precondition:** User is logged in as ADMIN, "TEST_ROLE" has 3 permissions

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Assignment tab | Assignment page is displayed | | ⏳ |
| 2 | Select "TEST_ROLE" from dropdown | 3 permissions are checked | | ⏳ |
| 3 | Uncheck 2 permissions | Checkboxes are unchecked | | ⏳ |
| 4 | Verify selected count | Badge shows "1 selected" | | ⏳ |
| 5 | Click "บันทึก" button | Success toast appears | | ⏳ |
| 6 | Refresh page and select "TEST_ROLE" | Only 1 permission remains checked | | ⏳ |

**Notes:**

---

### TC-RPA-004: Cancel Changes
**Priority:** Medium  
**Precondition:** User is logged in as ADMIN, "TEST_ROLE" has 1 permission

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Assignment tab | Assignment page is displayed | | ⏳ |
| 2 | Select "TEST_ROLE" from dropdown | 1 permission is checked | | ⏳ |
| 3 | Check 2 more permissions | Checkboxes are checked | | ⏳ |
| 4 | Verify warning alert | "มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก" shown | | ⏳ |
| 5 | Click "ยกเลิก" button | Checkboxes reset to original state | | ⏳ |
| 6 | Verify warning alert | Warning disappears | | ⏳ |

**Notes:**

---

### TC-RPA-005: Switch Role with Unsaved Changes
**Priority:** Medium  
**Precondition:** User is logged in as ADMIN, "TEST_ROLE" has 1 permission

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to Assignment tab | Assignment page is displayed | | ⏳ |
| 2 | Select "TEST_ROLE" from dropdown | 1 permission is checked | | ⏳ |
| 3 | Check 2 more permissions | Checkboxes are checked | | ⏳ |
| 4 | Select "ADMIN" from dropdown | Warning alert shown | | ⏳ |
| 5 | Verify warning message | "มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก" | | ⏳ |

**Notes:**

---

## Test Summary

### Total Test Cases: 20

**Roles CRUD:** 7 test cases  
**Permissions CRUD:** 6 test cases  
**Role-Permission Assignment:** 5 test cases  
**General:** 2 test cases

### Status Summary

- ⏳ Pending: 20
- ✅ Passed: 0
- ❌ Failed: 0
- ⚠️ Blocked: 0

### Defects Found

(To be filled during testing)

---

## Notes

- Test cases should be executed in order
- Create test data before running tests
- Clean up test data after testing
- Document any unexpected behavior
- Take screenshots for failed tests

---

**Last Updated:** 2025-11-09  
**Next Review:** After manual testing completion
