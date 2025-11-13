# 🧪 Phase 3 - QA Checklist
**Guardian Route Project**  
**Date:** November 13, 2025  
**Version:** 1.0  
**Status:** Ready for Testing

---

## 📋 Test Categories

1. **Functional Testing** - Core features and workflows
2. **UI/UX Testing** - User interface and experience
3. **Security Testing** - Authentication and authorization
4. **Integration Testing** - API and service integration
5. **Performance Testing** - Load and response times
6. **Compatibility Testing** - Browser and device support

---

## 🔐 1. FUNCTIONAL TESTING

### 1.1 Authentication & Authorization

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| F-001 | Login with valid credentials | User enters correct email/password | Redirect to role-based dashboard | Critical | ⏳ Pending |
| F-002 | Login with invalid credentials | User enters wrong password | Error message displayed | Critical | ⏳ Pending |
| F-003 | Login with non-existent user | User enters email not in system | Error message displayed | High | ⏳ Pending |
| F-004 | Logout functionality | User clicks logout button | Clear session, redirect to login | Critical | ⏳ Pending |
| F-005 | Token expiration handling | Token expires during session | Auto logout, redirect to login | Critical | ⏳ Pending |
| F-006 | Role-based access - Admin | Admin user logs in | Redirect to /admin dashboard | Critical | ⏳ Pending |
| F-007 | Role-based access - Executive | Executive user logs in | Redirect to /executive dashboard | Critical | ⏳ Pending |
| F-008 | Role-based access - Supervisor | Supervisor user logs in | Redirect to /supervisor dashboard | Critical | ⏳ Pending |
| F-009 | Role-based access - Field Officer | Field officer logs in | Redirect to /field-officer dashboard | Critical | ⏳ Pending |
| F-010 | Protected route access | Unauthenticated user tries to access dashboard | Redirect to login | Critical | ⏳ Pending |

### 1.2 Incident Management

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| F-011 | Create new incident | Field officer creates incident with all required fields | Incident created successfully | Critical | ⏳ Pending |
| F-012 | Create incident without GPS | Try to create incident without location | Validation error shown | High | ⏳ Pending |
| F-013 | Create incident without polygon | Try to create incident without affected area | Validation error shown | High | ⏳ Pending |
| F-014 | Upload photos with incident | Add photos to incident report | Photos uploaded successfully | Medium | ⏳ Pending |
| F-015 | View incident list | User views all incidents | List displayed with correct data | High | ⏳ Pending |
| F-016 | View incident details | User clicks on incident | Details page shows all information | High | ⏳ Pending |
| F-017 | Update incident status | Supervisor updates incident status | Status changed successfully | High | ⏳ Pending |
| F-018 | Delete incident | Admin deletes incident | Incident removed from system | Medium | ⏳ Pending |
| F-019 | Filter incidents by type | User filters by disaster type | Only matching incidents shown | Medium | ⏳ Pending |
| F-020 | Search incidents | User searches by keyword | Relevant incidents displayed | Medium | ⏳ Pending |

### 1.3 Report Management

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| F-021 | View my reports | Field officer views their reports | List of own reports displayed | High | ⏳ Pending |
| F-022 | Filter reports by status | User filters by report status | Filtered results shown | Medium | ⏳ Pending |
| F-023 | Filter reports by date range | User selects date range | Reports within range shown | Medium | ⏳ Pending |
| F-024 | View report details | User clicks on report | Full report details displayed | High | ⏳ Pending |
| F-025 | Submit report for review | Field officer submits report | Report status changes to PENDING_REVIEW | High | ⏳ Pending |
| F-026 | Approve report | Supervisor approves report | Report status changes to APPROVED | Critical | ⏳ Pending |
| F-027 | Reject report | Supervisor rejects report | Report status changes to REJECTED | Critical | ⏳ Pending |
| F-028 | Request revision | Supervisor requests changes | Report status changes to REVISION_REQUIRED | High | ⏳ Pending |
| F-029 | Download report PDF | User downloads report | PDF file generated and downloaded | Medium | ⏳ Pending |
| F-030 | View report history | User views all past reports | Complete history displayed | Medium | ⏳ Pending |

### 1.4 Task Management

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| F-031 | View assigned tasks | Field officer views tasks | List of assigned tasks shown | High | ⏳ Pending |
| F-032 | Accept task | Field officer accepts task | Task status changes to IN_PROGRESS | Critical | ⏳ Pending |
| F-033 | Complete task | Field officer completes task | Task status changes to COMPLETED | Critical | ⏳ Pending |
| F-034 | View task details | User clicks on task | Full task details displayed | High | ⏳ Pending |
| F-035 | Filter tasks by status | User filters by task status | Filtered tasks shown | Medium | ⏳ Pending |
| F-036 | Filter tasks by priority | User filters by priority | Filtered tasks shown | Medium | ⏳ Pending |
| F-037 | Create new task | Supervisor creates task | Task created and assigned | High | ⏳ Pending |
| F-038 | Assign task to officer | Supervisor assigns task | Officer receives task | High | ⏳ Pending |
| F-039 | Update task details | Supervisor updates task | Changes saved successfully | Medium | ⏳ Pending |
| F-040 | Cancel task | Supervisor cancels task | Task status changes to CANCELLED | Medium | ⏳ Pending |

### 1.5 Dashboard Features

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| F-041 | View Field Officer dashboard | Field officer logs in | Dashboard shows tasks, incidents, reports | High | ⏳ Pending |
| F-042 | View Supervisor dashboard | Supervisor logs in | Dashboard shows team stats, pending reviews | High | ⏳ Pending |
| F-043 | View Admin dashboard | Admin logs in | Dashboard shows user management, system stats | High | ⏳ Pending |
| F-044 | View Executive dashboard | Executive logs in | Dashboard shows KPIs, charts, analytics | High | ⏳ Pending |
| F-045 | Dashboard KPI accuracy | Check KPI calculations | Numbers match database | High | ⏳ Pending |
| F-046 | Dashboard charts display | View charts on dashboard | Charts render correctly | Medium | ⏳ Pending |
| F-047 | Dashboard real-time updates | Data changes in system | Dashboard updates accordingly | Medium | ⏳ Pending |
| F-048 | Quick actions functionality | User clicks quick action buttons | Actions execute correctly | Medium | ⏳ Pending |

### 1.6 User Management (Admin)

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| F-049 | View all users | Admin views user list | All users displayed | High | ⏳ Pending |
| F-050 | Create new user | Admin creates user | User added to system | High | ⏳ Pending |
| F-051 | Edit user details | Admin updates user info | Changes saved successfully | High | ⏳ Pending |
| F-052 | Delete user | Admin deletes user | User removed from system | High | ⏳ Pending |
| F-053 | Change user role | Admin changes user role | Role updated successfully | High | ⏳ Pending |
| F-054 | Activate/deactivate user | Admin toggles user status | Status changed successfully | Medium | ⏳ Pending |
| F-055 | Search users | Admin searches by name/email | Matching users shown | Medium | ⏳ Pending |
| F-056 | Filter users by role | Admin filters by role | Filtered users shown | Medium | ⏳ Pending |

---

## 🎨 2. UI/UX TESTING

### 2.1 Visual Design

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| U-001 | Color scheme consistency | Check colors across pages | Consistent color palette | Medium | ⏳ Pending |
| U-002 | Typography consistency | Check fonts and sizes | Consistent typography | Medium | ⏳ Pending |
| U-003 | Button styles | Check all buttons | Consistent button styling | Medium | ⏳ Pending |
| U-004 | Form field styles | Check all input fields | Consistent form styling | Medium | ⏳ Pending |
| U-005 | Icon usage | Check all icons | Icons clear and consistent | Low | ⏳ Pending |
| U-006 | Spacing and alignment | Check layout spacing | Proper spacing throughout | Medium | ⏳ Pending |
| U-007 | Loading indicators | Check loading states | Clear loading feedback | High | ⏳ Pending |
| U-008 | Error message styling | Check error displays | Clear and visible errors | High | ⏳ Pending |

### 2.2 User Experience

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| U-009 | Navigation clarity | User navigates between pages | Clear navigation path | High | ⏳ Pending |
| U-010 | Breadcrumb navigation | Check breadcrumbs | Shows current location | Medium | ⏳ Pending |
| U-011 | Form validation feedback | Submit invalid form | Clear validation messages | High | ⏳ Pending |
| U-012 | Success feedback | Complete action successfully | Clear success message | High | ⏳ Pending |
| U-013 | Error feedback | Action fails | Clear error message | High | ⏳ Pending |
| U-014 | Loading feedback | Long operation | Loading indicator shown | High | ⏳ Pending |
| U-015 | Empty state handling | View empty list | Helpful empty state message | Medium | ⏳ Pending |
| U-016 | Confirmation dialogs | Delete/critical action | Confirmation dialog shown | High | ⏳ Pending |
| U-017 | Keyboard navigation | Navigate using keyboard | All elements accessible | Medium | ⏳ Pending |
| U-018 | Focus management | Tab through form | Logical focus order | Medium | ⏳ Pending |

### 2.3 Responsive Design

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| U-019 | Desktop view (1920x1080) | Test on large screen | Layout looks good | High | ⏳ Pending |
| U-020 | Laptop view (1366x768) | Test on laptop screen | Layout adapts properly | High | ⏳ Pending |
| U-021 | Tablet view (768x1024) | Test on tablet | Mobile-friendly layout | Medium | ⏳ Pending |
| U-022 | Mobile view (375x667) | Test on mobile | Fully responsive | Medium | ⏳ Pending |
| U-023 | Navigation on mobile | Test mobile menu | Menu works correctly | Medium | ⏳ Pending |
| U-024 | Forms on mobile | Fill form on mobile | Forms usable on mobile | Medium | ⏳ Pending |
| U-025 | Tables on mobile | View tables on mobile | Tables scroll or stack | Medium | ⏳ Pending |
| U-026 | Charts on mobile | View charts on mobile | Charts resize properly | Low | ⏳ Pending |

---

## 🔒 3. SECURITY TESTING

### 3.1 Authentication Security

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| S-001 | Password encryption | Check password storage | Passwords hashed in DB | Critical | ⏳ Pending |
| S-002 | Token security | Check token storage | Token stored securely | Critical | ⏳ Pending |
| S-003 | Token expiration | Wait for token to expire | Auto logout occurs | Critical | ⏳ Pending |
| S-004 | Session timeout | Idle for extended period | Session expires | High | ⏳ Pending |
| S-005 | Brute force protection | Multiple failed logins | Account locked/delayed | High | ⏳ Pending |
| S-006 | SQL injection prevention | Try SQL injection in forms | Input sanitized | Critical | ⏳ Pending |
| S-007 | XSS prevention | Try XSS attack | Script not executed | Critical | ⏳ Pending |
| S-008 | CSRF protection | Check CSRF tokens | Tokens validated | High | ⏳ Pending |

### 3.2 Authorization Security

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| S-009 | Role-based access control | Try to access unauthorized page | Access denied | Critical | ⏳ Pending |
| S-010 | API endpoint protection | Call API without token | 401 Unauthorized | Critical | ⏳ Pending |
| S-011 | Data isolation | User tries to access others' data | Access denied | Critical | ⏳ Pending |
| S-012 | Admin-only functions | Non-admin tries admin function | Access denied | Critical | ⏳ Pending |
| S-013 | Supervisor-only functions | Non-supervisor tries function | Access denied | High | ⏳ Pending |
| S-014 | Token manipulation | Modify token manually | Token rejected | Critical | ⏳ Pending |

### 3.3 Data Security

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| S-015 | Sensitive data exposure | Check API responses | No sensitive data leaked | Critical | ⏳ Pending |
| S-016 | File upload security | Upload malicious file | File rejected | High | ⏳ Pending |
| S-017 | Data validation | Submit invalid data | Data rejected | High | ⏳ Pending |
| S-018 | HTTPS enforcement | Try HTTP connection | Redirect to HTTPS | High | ⏳ Pending |

---

## 🔗 4. INTEGRATION TESTING

### 4.1 API Integration

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| I-001 | Login API call | Test POST /auth/login | Returns token and user | Critical | ⏳ Pending |
| I-002 | Get user profile | Test GET /users/me | Returns current user | High | ⏳ Pending |
| I-003 | Create incident API | Test POST /incidents | Incident created | Critical | ⏳ Pending |
| I-004 | Get incidents API | Test GET /incidents | Returns incident list | High | ⏳ Pending |
| I-005 | Get my reports API | Test GET /reports/me | Returns user's reports | High | ⏳ Pending |
| I-006 | Update report status API | Test PUT /reports/:id/status | Status updated | High | ⏳ Pending |
| I-007 | Get my tasks API | Test GET /tasks/assigned | Returns assigned tasks | High | ⏳ Pending |
| I-008 | Update task status API | Test PUT /tasks/:id/status | Status updated | High | ⏳ Pending |
| I-009 | Error handling | Test API error responses | Errors handled gracefully | High | ⏳ Pending |
| I-010 | Network error handling | Simulate network failure | User notified appropriately | High | ⏳ Pending |

### 4.2 State Management

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| I-011 | Auth state persistence | Refresh page after login | User stays logged in | Critical | ⏳ Pending |
| I-012 | Auth state clearing | Logout user | All auth data cleared | Critical | ⏳ Pending |
| I-013 | State updates | Change data in one component | Other components update | High | ⏳ Pending |
| I-014 | Local storage | Check localStorage usage | Data persisted correctly | High | ⏳ Pending |

### 4.3 Third-Party Integration

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| I-015 | Map integration | Display map on incident page | Map loads correctly | High | ⏳ Pending |
| I-016 | GPS functionality | Get current location | Location retrieved | High | ⏳ Pending |
| I-017 | Drawing tools | Draw polygon on map | Polygon created | High | ⏳ Pending |
| I-018 | Chart.js integration | Display charts | Charts render correctly | Medium | ⏳ Pending |

---

## ⚡ 5. PERFORMANCE TESTING

### 5.1 Load Time

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| P-001 | Initial page load | Measure first load time | < 3 seconds | High | ⏳ Pending |
| P-002 | Dashboard load | Measure dashboard load | < 2 seconds | High | ⏳ Pending |
| P-003 | API response time | Measure API calls | < 1 second | High | ⏳ Pending |
| P-004 | Large list rendering | Load 100+ items | Renders smoothly | Medium | ⏳ Pending |
| P-005 | Map rendering | Load map with markers | Loads within 2 seconds | Medium | ⏳ Pending |
| P-006 | Chart rendering | Load multiple charts | Renders within 1 second | Medium | ⏳ Pending |

### 5.2 Resource Usage

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| P-007 | Memory usage | Monitor memory during use | No memory leaks | Medium | ⏳ Pending |
| P-008 | CPU usage | Monitor CPU during use | Reasonable CPU usage | Medium | ⏳ Pending |
| P-009 | Network usage | Monitor network calls | Minimal redundant calls | Medium | ⏳ Pending |
| P-010 | Bundle size | Check production build | Optimized bundle size | Medium | ⏳ Pending |

---

## 🌐 6. COMPATIBILITY TESTING

### 6.1 Browser Compatibility

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| C-001 | Chrome (latest) | Test on Chrome | Full functionality | Critical | ⏳ Pending |
| C-002 | Firefox (latest) | Test on Firefox | Full functionality | High | ⏳ Pending |
| C-003 | Edge (latest) | Test on Edge | Full functionality | High | ⏳ Pending |
| C-004 | Safari (latest) | Test on Safari | Full functionality | Medium | ⏳ Pending |
| C-005 | Mobile Chrome | Test on mobile Chrome | Full functionality | High | ⏳ Pending |
| C-006 | Mobile Safari | Test on mobile Safari | Full functionality | Medium | ⏳ Pending |

### 6.2 Device Compatibility

| ID | Test Case | Description | Expected Result | Priority | Status |
|----|-----------|-------------|-----------------|----------|--------|
| C-007 | Windows 10/11 | Test on Windows | Works correctly | High | ⏳ Pending |
| C-008 | macOS | Test on macOS | Works correctly | Medium | ⏳ Pending |
| C-009 | Android | Test on Android | Works correctly | Medium | ⏳ Pending |
| C-010 | iOS | Test on iOS | Works correctly | Medium | ⏳ Pending |

---

## 📊 Test Summary

### By Priority

| Priority | Total | Pending | Pass | Fail |
|----------|-------|---------|------|------|
| Critical | 35 | 35 | 0 | 0 |
| High | 65 | 65 | 0 | 0 |
| Medium | 45 | 45 | 0 | 0 |
| Low | 2 | 2 | 0 | 0 |
| **TOTAL** | **147** | **147** | **0** | **0** |

### By Category

| Category | Total | Pending | Pass | Fail |
|----------|-------|---------|------|------|
| Functional | 56 | 56 | 0 | 0 |
| UI/UX | 26 | 26 | 0 | 0 |
| Security | 18 | 18 | 0 | 0 |
| Integration | 18 | 18 | 0 | 0 |
| Performance | 10 | 10 | 0 | 0 |
| Compatibility | 10 | 10 | 0 | 0 |
| **TOTAL** | **147** | **147** | **0** | **0** |

---

## 🎯 Testing Guidelines

### Test Execution Order
1. **Phase 1:** Security & Authentication (Critical)
2. **Phase 2:** Core Functional Features (Critical & High)
3. **Phase 3:** UI/UX & Integration (High & Medium)
4. **Phase 4:** Performance & Compatibility (Medium & Low)

### Bug Reporting
- Use BUG-TRACKER-TEMPLATE.md for all bugs
- Include screenshots/videos when applicable
- Provide steps to reproduce
- Assign severity level

### Pass Criteria
- All Critical tests must pass
- 95%+ of High priority tests must pass
- 90%+ of Medium priority tests must pass
- 80%+ of Low priority tests must pass

---

**Checklist Version:** 1.0  
**Created:** November 13, 2025  
**Created By:** Team W  
**Status:** Ready for Phase 3 Testing
