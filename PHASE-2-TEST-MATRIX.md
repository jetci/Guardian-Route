# 📋 PHASE 2: UI Integration Testing Matrix

**รายงานจาก ทีม W**  
**Date:** 2025-11-12  
**Status:** 🚀 ACTIVE

---

## 🎯 Testing Objectives

1. Verify authentication flow for all 4 roles
2. Validate RBAC permissions and redirects
3. Test core features and UI components
4. Document bugs and issues
5. Confirm frontend-backend integration

---

## 🔐 Test Accounts

| Role | Email | Password | Expected Access |
|------|-------|----------|-----------------|
| **ADMIN** | admin@obtwiang.go.th | password123 | Full system access |
| **EXECUTIVE** | executive@obtwiang.go.th | password123 | Analytics, reports (read-only) |
| **SUPERVISOR** | supervisor@obtwiang.go.th | password123 | Incidents, tasks, surveys management |
| **FIELD_OFFICER** | field@obtwiang.go.th | password123 | Task execution, survey submission |

---

## 📊 Test Categories

### 1. Authentication & Authorization

#### 1.1 Login Flow
- [ ] **Test:** Login with ADMIN account
  - **Expected:** Redirect to admin dashboard
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Login with EXECUTIVE account
  - **Expected:** Redirect to analytics/reports view
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Login with SUPERVISOR account
  - **Expected:** Redirect to incidents/tasks dashboard
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Login with FIELD_OFFICER account
  - **Expected:** Redirect to my tasks view
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Invalid credentials
  - **Expected:** Error message displayed
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 1.2 Token Management
- [ ] **Test:** JWT token stored in localStorage/cookie
  - **Expected:** Token persists across page refresh
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Token expiry handling
  - **Expected:** Redirect to login after expiry
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Logout functionality
  - **Expected:** Token cleared, redirect to login
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 1.3 RBAC Enforcement
- [ ] **Test:** ADMIN accessing all routes
  - **Expected:** No restrictions
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** FIELD_OFFICER accessing admin routes
  - **Expected:** Access denied / redirect
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** EXECUTIVE accessing user management
  - **Expected:** Access denied / redirect
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 2. Dashboard & Navigation

#### 2.1 Dashboard Rendering
- [ ] **Test:** Admin dashboard loads
  - **Expected:** User stats, system overview visible
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Executive dashboard loads
  - **Expected:** Analytics charts, KPI summary visible
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Supervisor dashboard loads
  - **Expected:** Incident summary, task overview visible
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Field Officer dashboard loads
  - **Expected:** Assigned tasks list visible
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 2.2 Navigation Menu
- [ ] **Test:** Menu items match role permissions
  - **Expected:** Only authorized menu items shown
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Active route highlighting
  - **Expected:** Current page highlighted in menu
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Mobile responsive menu
  - **Expected:** Hamburger menu on mobile
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 3. Map Integration

#### 3.1 Map Rendering
- [ ] **Test:** Map loads on incidents page
  - **Expected:** Leaflet map renders with default center
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Village boundaries display
  - **Expected:** 20 villages shown on map
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Map controls functional
  - **Expected:** Zoom, pan, layer controls work
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 3.2 Incident Markers
- [ ] **Test:** Incident markers display
  - **Expected:** Markers show incident locations
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Marker click shows popup
  - **Expected:** Incident details in popup
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Marker clustering
  - **Expected:** Clusters form when zoomed out
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 4. Incident Management

#### 4.1 Incident List
- [ ] **Test:** Incident list loads
  - **Expected:** Table/grid of incidents displayed
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Filtering by status
  - **Expected:** Filter dropdown works correctly
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Search functionality
  - **Expected:** Search by title/description works
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Pagination
  - **Expected:** Navigate through pages
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 4.2 Create Incident
- [ ] **Test:** Create incident form (SUPERVISOR)
  - **Expected:** Form validation, successful creation
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Map location picker
  - **Expected:** Click map to set location
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Image upload
  - **Expected:** Upload and preview images
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 4.3 Incident Details
- [ ] **Test:** View incident details
  - **Expected:** All fields displayed correctly
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Update incident status (SUPERVISOR)
  - **Expected:** Status changes successfully
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Assign to field officer (SUPERVISOR)
  - **Expected:** Assignment successful, officer notified
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 5. Task Management

#### 5.1 Task List
- [ ] **Test:** My tasks view (FIELD_OFFICER)
  - **Expected:** Only assigned tasks shown
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** All tasks view (SUPERVISOR)
  - **Expected:** All tasks visible with filters
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Task status filtering
  - **Expected:** Filter by PENDING/IN_PROGRESS/COMPLETED
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 5.2 Create Task
- [ ] **Test:** Create task form (SUPERVISOR)
  - **Expected:** Form validation, successful creation
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Assign to field officer
  - **Expected:** Dropdown shows available officers
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Link to incident
  - **Expected:** Can select related incident
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 5.3 Task Execution
- [ ] **Test:** Accept task (FIELD_OFFICER)
  - **Expected:** Status changes to IN_PROGRESS
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Submit survey data
  - **Expected:** Survey form appears, submission works
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Complete task
  - **Expected:** Status changes to COMPLETED
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 6. Survey Management

#### 6.1 Survey Templates
- [ ] **Test:** View survey templates (SUPERVISOR)
  - **Expected:** List of templates displayed
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Create survey template (SUPERVISOR)
  - **Expected:** Dynamic form builder works
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Edit survey template
  - **Expected:** Template updates successfully
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 6.2 Survey Responses
- [ ] **Test:** Submit survey (FIELD_OFFICER)
  - **Expected:** Form renders, submission works
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** View responses (SUPERVISOR)
  - **Expected:** Response data displayed
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Export responses
  - **Expected:** CSV/Excel download works
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 7. Report Management

#### 7.1 Report List
- [ ] **Test:** View reports (EXECUTIVE)
  - **Expected:** List of reports displayed
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Filter by date range
  - **Expected:** Date picker filters results
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Filter by type
  - **Expected:** Report type filter works
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 7.2 Report Generation
- [ ] **Test:** Generate incident report (SUPERVISOR)
  - **Expected:** Report created successfully
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Generate task report
  - **Expected:** Report includes task statistics
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 7.3 Report Preview
- [ ] **Test:** Preview report
  - **Expected:** Report content displayed
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Download report (PDF)
  - **Expected:** PDF download works
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Share report
  - **Expected:** Share functionality works
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 8. User Management (ADMIN)

#### 8.1 User List
- [ ] **Test:** View all users
  - **Expected:** User table with all fields
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Filter by role
  - **Expected:** Role filter works correctly
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Search users
  - **Expected:** Search by name/email works
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 8.2 User CRUD
- [ ] **Test:** Create new user
  - **Expected:** User created with hashed password
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Edit user details
  - **Expected:** User updated successfully
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Change user role
  - **Expected:** Role updated, permissions change
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Suspend user
  - **Expected:** User cannot login when suspended
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Delete user
  - **Expected:** User removed from system
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 9. Village Management

#### 9.1 Village List
- [ ] **Test:** View all villages
  - **Expected:** 20 villages displayed
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Village details
  - **Expected:** Population, area, coordinates shown
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 9.2 Village Map
- [ ] **Test:** Village boundaries on map
  - **Expected:** Polygons render correctly
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Click village shows info
  - **Expected:** Popup with village details
  - **Status:** ⏳ Pending
  - **Notes:** 

---

### 10. UI/UX Quality

#### 10.1 Responsive Design
- [ ] **Test:** Desktop view (1920x1080)
  - **Expected:** Layout optimal
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Tablet view (768x1024)
  - **Expected:** Layout adapts correctly
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Mobile view (375x667)
  - **Expected:** Mobile-friendly layout
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 10.2 Loading States
- [ ] **Test:** Loading spinners display
  - **Expected:** Spinner shows during API calls
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Skeleton screens
  - **Expected:** Skeleton UI during data load
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 10.3 Error Handling
- [ ] **Test:** Network error handling
  - **Expected:** User-friendly error message
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Form validation errors
  - **Expected:** Clear error messages on fields
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** 404 page
  - **Expected:** Custom 404 page displays
  - **Status:** ⏳ Pending
  - **Notes:** 

#### 10.4 Accessibility
- [ ] **Test:** Keyboard navigation
  - **Expected:** Tab through all interactive elements
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Screen reader compatibility
  - **Expected:** ARIA labels present
  - **Status:** ⏳ Pending
  - **Notes:** 

- [ ] **Test:** Color contrast
  - **Expected:** WCAG AA compliance
  - **Status:** ⏳ Pending
  - **Notes:** 

---

## 🐛 Bug Tracking

### Critical Bugs
| ID | Description | Severity | Status | Assigned To |
|----|-------------|----------|--------|-------------|
| - | - | - | - | - |

### Major Bugs
| ID | Description | Severity | Status | Assigned To |
|----|-------------|----------|--------|-------------|
| - | - | - | - | - |

### Minor Bugs
| ID | Description | Severity | Status | Assigned To |
|----|-------------|----------|--------|-------------|
| - | - | - | - | - |

---

## 📊 Test Progress

### Overall Progress
- **Total Tests:** 100+
- **Completed:** 0
- **Passed:** 0
- **Failed:** 0
- **Blocked:** 0
- **Progress:** 0%

### By Category
| Category | Total | Completed | Pass Rate |
|----------|-------|-----------|-----------|
| Authentication | 11 | 0 | 0% |
| Dashboard | 7 | 0 | 0% |
| Map Integration | 6 | 0 | 0% |
| Incidents | 9 | 0 | 0% |
| Tasks | 9 | 0 | 0% |
| Surveys | 6 | 0 | 0% |
| Reports | 8 | 0 | 0% |
| User Management | 8 | 0 | 0% |
| Villages | 4 | 0 | 0% |
| UI/UX | 12 | 0 | 0% |

---

## 🎯 Testing Priority

### High Priority (P0)
1. Login flow for all roles
2. RBAC enforcement
3. Dashboard rendering
4. Incident list and creation
5. Task assignment and execution

### Medium Priority (P1)
1. Map integration
2. Survey functionality
3. Report generation
4. User management
5. Village display

### Low Priority (P2)
1. Advanced filters
2. Export functionality
3. Mobile responsiveness
4. Accessibility features

---

## 📝 Testing Guidelines

### Test Execution Process
1. **Setup:** Login with appropriate test account
2. **Execute:** Follow test steps exactly
3. **Verify:** Check expected results
4. **Document:** Record actual results and screenshots
5. **Report:** Log bugs with reproduction steps

### Bug Reporting Format
```markdown
**Bug ID:** BUG-XXX
**Title:** [Component] Brief description
**Severity:** Critical/Major/Minor
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** What should happen
**Actual Result:** What actually happened
**Screenshots:** [Attach if applicable]
**Environment:** Browser, OS, Screen size
**Assigned To:** Team member
**Status:** Open/In Progress/Fixed/Closed
```

---

## 🔄 Test Cycle Schedule

### Cycle 1: Core Functionality (Day 1-2)
- Authentication & Authorization
- Dashboard & Navigation
- Basic CRUD operations

### Cycle 2: Advanced Features (Day 3-4)
- Map integration
- Task workflow
- Survey system
- Report generation

### Cycle 3: Polish & Edge Cases (Day 5)
- UI/UX refinement
- Error handling
- Edge cases
- Performance testing

---

## ✅ Sign-off Criteria

### Phase 2 Complete When:
- [ ] All P0 tests passed
- [ ] All P1 tests passed
- [ ] Critical bugs fixed
- [ ] Major bugs documented
- [ ] Test report generated
- [ ] QA sign-off obtained

---

**รายงานจาก ทีม W**  
**Guardian Route - Phase 2 Testing Matrix**

**Status:** 🚀 ACTIVE  
**Last Updated:** 2025-11-12 14:58 UTC+7

---

**Ready for comprehensive testing. Let's ensure quality delivery.** 🛡️
