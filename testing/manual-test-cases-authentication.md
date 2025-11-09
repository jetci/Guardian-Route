# Manual Test Cases: Authentication & Authorization Module

**Module:** Authentication & Authorization  
**Sprint:** Sprint 4 Week 2  
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
- **Admin:** admin@example.com / password123
- **Executive:** executive@example.com / password123
- **Supervisor:** supervisor@example.com / password123
- **Field Officer:** officer@example.com / password123
- **Invalid User:** invalid@example.com / wrongpassword

---

## Test Cases: Login Flow

### TC-AUTH-001: Successful Login
**Priority:** Critical  
**Precondition:** User account exists and is active

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/login` | Login page loads | | ⏳ |
| 2 | Enter email: "admin@example.com" | Input accepts text | | ⏳ |
| 3 | Enter password: "password123" | Input accepts text (masked) | | ⏳ |
| 4 | Click "เข้าสู่ระบบ" button | Loading spinner appears | | ⏳ |
| 5 | Wait for response | Success toast appears | | ⏳ |
| 6 | Verify redirect | Redirected to `/dashboard` | | ⏳ |
| 7 | Verify user data | User name displayed in header | | ⏳ |
| 8 | Check localStorage | `accessToken` and `refreshToken` stored | | ⏳ |

**Notes:**

---

### TC-AUTH-002: Login with Invalid Credentials
**Priority:** Critical  
**Precondition:** None

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/login` | Login page loads | | ⏳ |
| 2 | Enter email: "invalid@example.com" | Input accepts text | | ⏳ |
| 3 | Enter password: "wrongpassword" | Input accepts text | | ⏳ |
| 4 | Click "เข้าสู่ระบบ" button | Loading spinner appears | | ⏳ |
| 5 | Wait for response | Error toast appears | | ⏳ |
| 6 | Verify error message | "อีเมลหรือรหัสผ่านไม่ถูกต้อง" shown | | ⏳ |
| 7 | Verify redirect | Stays on login page | | ⏳ |
| 8 | Check localStorage | No tokens stored | | ⏳ |

**Notes:**

---

### TC-AUTH-003: Login with Empty Fields
**Priority:** High  
**Precondition:** None

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/login` | Login page loads | | ⏳ |
| 2 | Leave email field empty | Field is empty | | ⏳ |
| 3 | Leave password field empty | Field is empty | | ⏳ |
| 4 | Click "เข้าสู่ระบบ" button | Validation errors appear | | ⏳ |
| 5 | Verify error messages | "กรุณากรอกอีเมล" and "กรุณากรอกรหัสผ่าน" shown | | ⏳ |

**Notes:**

---

### TC-AUTH-004: Login with Invalid Email Format
**Priority:** Medium  
**Precondition:** None

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/login` | Login page loads | | ⏳ |
| 2 | Enter email: "notanemail" | Input accepts text | | ⏳ |
| 3 | Enter password: "password123" | Input accepts text | | ⏳ |
| 4 | Click "เข้าสู่ระบบ" button | Validation error appears | | ⏳ |
| 5 | Verify error message | "รูปแบบอีเมลไม่ถูกต้อง" shown | | ⏳ |

**Notes:**

---

### TC-AUTH-005: Quick Login Buttons
**Priority:** Medium  
**Precondition:** Test accounts exist

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/login` | Login page loads with quick login buttons | | ⏳ |
| 2 | Click "Admin" quick login button | Loading spinner appears | | ⏳ |
| 3 | Wait for response | Success toast appears | | ⏳ |
| 4 | Verify redirect | Redirected to `/dashboard` | | ⏳ |
| 5 | Verify user role | "ADMIN" role displayed | | ⏳ |

**Notes:**

---

### TC-AUTH-006: Disabled State During Login
**Priority:** Medium  
**Precondition:** None

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/login` | Login page loads | | ⏳ |
| 2 | Enter valid credentials | Inputs accept text | | ⏳ |
| 3 | Click "เข้าสู่ระบบ" button | Loading spinner appears | | ⏳ |
| 4 | Try to edit email field | Field is disabled | | ⏳ |
| 5 | Try to edit password field | Field is disabled | | ⏳ |
| 6 | Try to click quick login buttons | Buttons are disabled | | ⏳ |
| 7 | Wait for response | Inputs re-enabled after response | | ⏳ |

**Notes:**

---

## Test Cases: Logout Flow

### TC-AUTH-007: Successful Logout
**Priority:** Critical  
**Precondition:** User is logged in

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to any authenticated page | Page loads | | ⏳ |
| 2 | Click "ออกจากระบบ" button | Logout request sent | | ⏳ |
| 3 | Wait for response | Success (no toast needed) | | ⏳ |
| 4 | Verify redirect | Redirected to `/login` | | ⏳ |
| 5 | Check localStorage | Tokens removed | | ⏳ |
| 6 | Try to navigate back | Redirected to `/login` again | | ⏳ |

**Notes:**

---

## Test Cases: Token Refresh

### TC-AUTH-008: Automatic Token Refresh
**Priority:** Critical  
**Precondition:** User is logged in, access token is about to expire

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Login and wait for 14 minutes | User remains logged in | | ⏳ |
| 2 | Make an API request | Request triggers token refresh | | ⏳ |
| 3 | Check network tab | Refresh token request sent | | ⏳ |
| 4 | Verify response | New access token received | | ⏳ |
| 5 | Check localStorage | Access token updated | | ⏳ |
| 6 | Verify original request | Original request completed successfully | | ⏳ |

**Notes:**

---

### TC-AUTH-009: Token Refresh Failure
**Priority:** High  
**Precondition:** User is logged in, refresh token is invalid/expired

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Manually invalidate refresh token | Token is invalid | | ⏳ |
| 2 | Make an API request | Request triggers token refresh | | ⏳ |
| 3 | Check network tab | Refresh token request fails | | ⏳ |
| 4 | Verify behavior | User logged out automatically | | ⏳ |
| 5 | Verify redirect | Redirected to `/login` | | ⏳ |
| 6 | Verify toast | "Session หมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง" shown | | ⏳ |

**Notes:**

---

## Test Cases: Role-Based Routing

### TC-AUTH-010: Admin Access to Admin Pages
**Priority:** Critical  
**Precondition:** User is logged in as ADMIN

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/admin/role-management` | Page loads successfully | | ⏳ |
| 2 | Navigate to `/admin/audit-logs` | Page loads successfully | | ⏳ |
| 3 | Navigate to `/admin/dashboard` | Page loads successfully | | ⏳ |
| 4 | Verify no access errors | No "Unauthorized" messages | | ⏳ |

**Notes:**

---

### TC-AUTH-011: Field Officer Cannot Access Admin Pages
**Priority:** Critical  
**Precondition:** User is logged in as FIELD_OFFICER

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Try to navigate to `/admin/role-management` | Redirected to `/unauthorized` | | ⏳ |
| 2 | Verify error message | "คุณไม่มีสิทธิ์เข้าถึงหน้านี้" shown | | ⏳ |
| 3 | Try to navigate to `/admin/audit-logs` | Redirected to `/unauthorized` | | ⏳ |
| 4 | Verify redirect | Cannot access admin pages | | ⏳ |

**Notes:**

---

### TC-AUTH-012: Supervisor Access to Supervisor Pages
**Priority:** High  
**Precondition:** User is logged in as SUPERVISOR

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/supervisor/dashboard` | Page loads successfully | | ⏳ |
| 2 | Navigate to `/supervisor/map` | Page loads successfully | | ⏳ |
| 3 | Navigate to `/supervisor/tasks` | Page loads successfully | | ⏳ |
| 4 | Try to navigate to `/admin/role-management` | Redirected to `/unauthorized` | | ⏳ |

**Notes:**

---

### TC-AUTH-013: Executive Access to Executive Pages
**Priority:** High  
**Precondition:** User is logged in as EXECUTIVE

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Navigate to `/executive/dashboard` | Page loads successfully | | ⏳ |
| 2 | Navigate to `/reports` | Page loads successfully | | ⏳ |
| 3 | Try to navigate to `/admin/role-management` | Redirected to `/unauthorized` | | ⏳ |
| 4 | Try to navigate to `/supervisor/tasks` | Access depends on role hierarchy | | ⏳ |

**Notes:**

---

## Test Cases: Permission Guards

### TC-AUTH-014: Permission-Based UI Elements
**Priority:** High  
**Precondition:** User is logged in with specific permissions

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Login as user with "USER_CREATE" permission | Dashboard loads | | ⏳ |
| 2 | Navigate to users page | "Create User" button visible | | ⏳ |
| 3 | Logout and login as user without permission | Dashboard loads | | ⏳ |
| 4 | Navigate to users page | "Create User" button hidden | | ⏳ |

**Notes:**

---

### TC-AUTH-015: Permission-Based API Access
**Priority:** High  
**Precondition:** User is logged in with specific permissions

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Login as user with "INCIDENT_DELETE" permission | Dashboard loads | | ⏳ |
| 2 | Try to delete an incident | Request succeeds | | ⏳ |
| 3 | Logout and login as user without permission | Dashboard loads | | ⏳ |
| 4 | Try to delete an incident | Request fails with 403 error | | ⏳ |
| 5 | Verify error message | "คุณไม่มีสิทธิ์ดำเนินการนี้" shown | | ⏳ |

**Notes:**

---

## Test Cases: Session Management

### TC-AUTH-016: Concurrent Sessions
**Priority:** Medium  
**Precondition:** User account exists

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Login on Browser A | Login successful | | ⏳ |
| 2 | Login on Browser B with same account | Login successful | | ⏳ |
| 3 | Verify Browser A | Still logged in | | ⏳ |
| 4 | Verify Browser B | Logged in | | ⏳ |
| 5 | Logout on Browser A | Logged out | | ⏳ |
| 6 | Verify Browser B | Still logged in | | ⏳ |

**Notes:**

---

### TC-AUTH-017: Session Persistence After Page Refresh
**Priority:** High  
**Precondition:** User is logged in

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Login successfully | Dashboard loads | | ⏳ |
| 2 | Refresh the page (F5) | Page reloads | | ⏳ |
| 3 | Verify user state | Still logged in | | ⏳ |
| 4 | Verify user data | User info still displayed | | ⏳ |
| 5 | Navigate to another page | Navigation works | | ⏳ |

**Notes:**

---

### TC-AUTH-018: Session After Browser Close
**Priority:** Medium  
**Precondition:** User is logged in

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Login successfully | Dashboard loads | | ⏳ |
| 2 | Close browser completely | Browser closed | | ⏳ |
| 3 | Reopen browser | Browser opens | | ⏳ |
| 4 | Navigate to application URL | Redirected to `/login` | | ⏳ |
| 5 | Verify localStorage | Tokens may be cleared (depends on implementation) | | ⏳ |

**Notes:**

---

## Test Cases: Error Handling

### TC-AUTH-019: Network Error During Login
**Priority:** High  
**Precondition:** Backend is down or network is disconnected

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Disconnect network | Network offline | | ⏳ |
| 2 | Navigate to `/login` | Login page loads (cached) | | ⏳ |
| 3 | Enter valid credentials | Inputs accept text | | ⏳ |
| 4 | Click "เข้าสู่ระบบ" button | Loading spinner appears | | ⏳ |
| 5 | Wait for timeout | Error toast appears | | ⏳ |
| 6 | Verify error message | "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์" or similar | | ⏳ |

**Notes:**

---

### TC-AUTH-020: API Error Handling
**Priority:** High  
**Precondition:** Backend returns 500 error

| Step | Action | Expected Result | Actual Result | Status |
|------|--------|----------------|---------------|--------|
| 1 | Trigger 500 error from backend | Error occurs | | ⏳ |
| 2 | Verify error toast | Error toast appears | | ⏳ |
| 3 | Verify error message | "เกิดข้อผิดพลาดในระบบ" shown | | ⏳ |
| 4 | Verify user state | User remains logged in (if applicable) | | ⏳ |

**Notes:**

---

## Test Summary

### Total Test Cases: 20

**Login Flow:** 6 test cases  
**Logout Flow:** 1 test case  
**Token Refresh:** 2 test cases  
**Role-Based Routing:** 4 test cases  
**Permission Guards:** 2 test cases  
**Session Management:** 3 test cases  
**Error Handling:** 2 test cases

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
- Use different browsers for concurrent session testing
- Document any unexpected behavior
- Take screenshots for failed tests
- Test with different user roles

---

**Last Updated:** 2025-11-09  
**Next Review:** After manual testing completion
