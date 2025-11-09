# Manual Testing Execution Report

**Project:** Guardian Route  
**Sprint:** Sprint 4 Week 3  
**Test Phase:** Manual Testing  
**Date:** 2025-11-09  
**Tester:** QA Team

---

## Executive Summary

**Testing Status:** 🟡 In Progress  
**Total Test Cases:** 40  
**Executed:** 0 / 40  
**Passed:** 0  
**Failed:** 0  
**Blocked:** 0  
**Pass Rate:** N/A

---

## Test Execution Progress

### Critical Priority (10 cases)

| ID | Test Case | Module | Status | Result | Defects | Notes |
|----|-----------|--------|--------|--------|---------|-------|
| TC-RM-001 | View All Roles | Role Management | ⏳ Pending | - | - | Ready to test |
| TC-RM-002 | Create New Role | Role Management | ⏳ Pending | - | - | Ready to test |
| TC-RM-006 | Delete Role | Role Management | ⏳ Pending | - | - | Ready to test |
| TC-PM-001 | View All Permissions | Permissions | ⏳ Pending | - | - | Ready to test |
| TC-PM-003 | Create New Permission | Permissions | ⏳ Pending | - | - | Ready to test |
| TC-RPA-001 | View Role Permissions | Assignment | ⏳ Pending | - | - | Ready to test |
| TC-RPA-002 | Assign Permissions to Role | Assignment | ⏳ Pending | - | - | Ready to test |
| TC-AUTH-001 | Successful Login | Authentication | ⏳ Pending | - | - | Ready to test |
| TC-AUTH-002 | Login with Invalid Credentials | Authentication | ⏳ Pending | - | - | Ready to test |
| TC-AUTH-007 | Successful Logout | Authentication | ⏳ Pending | - | - | Ready to test |

---

## Testing Environment

**Frontend:**
- URL: http://localhost:5173
- Status: ⚠️ Cannot start (EMFILE error)
- Note: Vite dev server has file descriptor limit issues

**Backend:**
- URL: http://localhost:3000
- Status: ❓ Not verified yet

**Database:**
- Type: PostgreSQL
- Environment: Development

**Browsers:**
- Chrome: Ready
- Firefox: Ready
- Safari: N/A (Linux environment)

---

## Prerequisites for Manual Testing

### 1. Start Backend Server

```bash
cd /home/ubuntu/Guardian-Route/backend
npm run start:dev
```

### 2. Start Frontend Server (Alternative Method)

**Option A: Fix EMFILE issue**
```bash
# Increase system file descriptor limit
sudo sysctl -w fs.inotify.max_user_watches=524288
sudo sysctl -w fs.file-max=2097152
```

**Option B: Use production build**
```bash
cd /home/ubuntu/Guardian-Route/frontend
npm run build
npm run preview
```

**Option C: Test on different machine**
- Deploy to staging environment
- Test on local development machine

### 3. Prepare Test Data

**Create Test Users:**
```sql
-- Admin user
INSERT INTO users (email, password, role) VALUES ('admin@example.com', '$hashed_password', 'ADMIN');

-- Test users for different roles
INSERT INTO users (email, password, role) VALUES ('executive@example.com', '$hashed_password', 'EXECUTIVE');
INSERT INTO users (email, password, role) VALUES ('supervisor@example.com', '$hashed_password', 'SUPERVISOR');
INSERT INTO users (email, password, role) VALUES ('officer@example.com', '$hashed_password', 'FIELD_OFFICER');
```

---

## Test Execution Instructions

### For Role Management Tests

**TC-RM-001: View All Roles**
1. Login as admin@example.com
2. Navigate to `/admin/role-management`
3. Click "บทบาท" tab
4. Verify table displays all roles with correct columns
5. Check that all 5 default roles are visible

**TC-RM-002: Create New Role**
1. On Roles tab, click "สร้างบทบาทใหม่"
2. Fill in:
   - Name: `TEST_ROLE_001`
   - Display Name: `ทดสอบบทบาท 001`
   - Description: `บทบาทสำหรับทดสอบ`
3. Click "สร้าง"
4. Verify success toast appears
5. Verify new role appears in list

**TC-RM-006: Delete Role**
1. Find TEST_ROLE_001 in list
2. Click action menu (⋮)
3. Click "ลบ"
4. Confirm deletion
5. Verify success toast
6. Verify role removed from list

### For Permission Tests

**TC-PM-001: View All Permissions**
1. Click "สิทธิ์" tab
2. Verify permissions table displays
3. Check columns: ชื่อแสดง, ชื่อ, คำอธิบาย, หมวดหมู่, จำนวนบทบาท
4. Verify permissions are grouped by category

**TC-PM-003: Create New Permission**
1. Click "สร้างสิทธิ์ใหม่"
2. Fill in:
   - Name: `TEST_PERMISSION_001`
   - Display Name: `ทดสอบสิทธิ์ 001`
   - Description: `สิทธิ์สำหรับทดสอบ`
   - Category: `Testing`
3. Click "สร้าง"
4. Verify success toast
5. Verify new permission appears

### For Role-Permission Assignment Tests

**TC-RPA-001: View Role Permissions**
1. Click "กำหนดสิทธิ์" tab
2. Select "ADMIN" from role dropdown
3. Verify permissions grouped by category
4. Check that checkboxes show current assignments

**TC-RPA-002: Assign Permissions to Role**
1. Select "TEST_ROLE_001" from dropdown
2. Check 3 permissions
3. Verify selected count badge updates
4. Click "บันทึก"
5. Verify success toast
6. Refresh and verify assignments persist

### For Authentication Tests

**TC-AUTH-001: Successful Login**
1. Navigate to `/login`
2. Enter email: admin@example.com
3. Enter password: password123
4. Click "เข้าสู่ระบบ"
5. Verify redirect to `/dashboard`
6. Check localStorage for tokens
7. Verify user menu displays

**TC-AUTH-002: Login with Invalid Credentials**
1. Navigate to `/login`
2. Enter email: invalid@example.com
3. Enter password: wrongpassword
4. Click "เข้าสู่ระบบ"
5. Verify error toast appears
6. Check that user stays on login page
7. Verify no tokens in localStorage

**TC-AUTH-007: Successful Logout**
1. While logged in, click "ออกจากระบบ"
2. Verify redirect to `/login`
3. Check that tokens are removed from localStorage
4. Try navigating back to dashboard
5. Verify redirect back to login

---

## Known Issues

### Issue 1: Frontend Dev Server Cannot Start
**Severity:** 🔴 Critical  
**Impact:** Blocks all manual testing  
**Status:** 🔍 In Review

**Description:**
Vite dev server fails to start with EMFILE error (too many open files)

**Workaround:**
1. Use production build (`npm run build && npm run preview`)
2. Test on different machine with higher file descriptor limits
3. Deploy to staging environment for testing

**Root Cause:**
Sandbox environment has low file descriptor limit that cannot be increased with ulimit

---

## Recommendations

### Immediate Actions
1. ✅ Deploy frontend to staging environment for manual testing
2. ✅ Use production build for local testing
3. ✅ Document all test results in this file

### Short-term Actions
1. 📝 Create automated API tests to cover critical flows
2. 📝 Set up CI/CD pipeline with proper test environment
3. 📝 Document environment setup requirements

### Long-term Actions
1. 🔄 Migrate to containerized testing environment (Docker)
2. 🔄 Set up dedicated QA environment with proper resources
3. 🔄 Implement comprehensive E2E testing suite

---

## Test Results (To be filled during execution)

### Critical Test Cases Results

**Role Management:**
- TC-RM-001: ⏳ Pending
- TC-RM-002: ⏳ Pending
- TC-RM-006: ⏳ Pending

**Permissions:**
- TC-PM-001: ⏳ Pending
- TC-PM-003: ⏳ Pending

**Role-Permission Assignment:**
- TC-RPA-001: ⏳ Pending
- TC-RPA-002: ⏳ Pending

**Authentication:**
- TC-AUTH-001: ⏳ Pending
- TC-AUTH-002: ⏳ Pending
- TC-AUTH-007: ⏳ Pending

---

## Defects Summary

**Total Defects Found:** 0

**By Severity:**
- 🔴 Critical: 0
- 🟠 Major: 0
- 🟡 Minor: 0
- 🟢 Trivial: 0

**Details:** See [defect-log.md](./defect-log.md)

---

## Next Steps

1. ⏳ **Resolve frontend dev server issue**
   - Try production build
   - Deploy to staging
   - Test on different machine

2. ⏳ **Execute Critical test cases** (10 cases)
   - Update results in this document
   - Log defects in defect-log.md
   - Take screenshots for evidence

3. ⏳ **Execute High priority test cases** (18 cases)
   - Continue systematic testing
   - Document all findings

4. ⏳ **Execute Medium priority test cases** (12 cases)
   - Complete full test coverage
   - Final defect summary

5. ⏳ **Prepare QA Report**
   - Summarize all findings
   - Provide recommendations
   - Sign off on testing phase

---

**Status:** 🟡 Blocked - Waiting for frontend environment  
**Last Updated:** 2025-11-09  
**Next Review:** After environment is ready
