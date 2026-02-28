# 🔴 Backend Integration Checklist

**Phase:** 2.5 → 3 Transition  
**Priority:** CRITICAL  
**ETA:** วันนี้ (ก่อน 23:59 น.)  
**Team:** w

---

## 📋 Pre-Integration Checklist

### Backend Requirements

- [ ] **Backend Server Running**
  - Port: 3001
  - URL: http://localhost:3001
  - Health Check: http://localhost:3001/api/health

- [ ] **Database Ready**
  - PostgreSQL running
  - PostGIS extension installed
  - Migrations applied
  - Seed data loaded

- [ ] **TypeScript Compilation**
  - No compilation errors
  - `analytics.controller.ts` fixed
  - All modules building successfully

- [ ] **API Endpoints Available**
  - `POST /api/auth/login`
  - `POST /api/auth/refresh`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`

---

## 🔧 Integration Steps

### Step 1: Switch from Mock to Real API

**File:** `frontend/src/pages/LoginPage.tsx`

```typescript
// BEFORE (Mock)
import { mockAuthApi as authApi } from '../api/mockAuth';

// AFTER (Real)
import { authApi } from '../api/auth';
```

**Status:** ⏳ Pending Backend

---

### Step 2: Verify API Client Configuration

**File:** `frontend/src/api/client.ts`

**Check:**
- ✅ Base URL: `http://localhost:3001/api`
- ✅ Authorization header interceptor
- ✅ Token refresh logic
- ✅ Error handling

**Status:** ✅ Already configured

---

### Step 3: Update Auth Store

**File:** `frontend/src/stores/authStore.ts`

**Verify:**
- ✅ `setAuth(user, accessToken, refreshToken)`
- ✅ `updateTokens(accessToken, refreshToken)`
- ✅ `logout()`
- ✅ `isAuthenticated()`

**Status:** ✅ Already implemented

---

### Step 4: Test Login Flow

**Test Cases:**

#### Admin Login
```
Email: admin@obtwiang.go.th
Password: password123
Expected: Redirect to /dashboard
Expected Role: ADMIN
```

#### Supervisor Login
```
Email: supervisor@obtwiang.go.th
Password: password123
Expected: Redirect to /dashboard
Expected Role: SUPERVISOR
```

#### Executive Login
```
Email: executive@obtwiang.go.th
Password: password123
Expected: Redirect to /dashboard
Expected Role: EXECUTIVE
```

#### Field Officer Login
```
Email: field@obtwiang.go.th
Password: password123
Expected: Redirect to /dashboard
Expected Role: FIELD_OFFICER
```

#### Invalid Login
```
Email: invalid@test.com
Password: wrong
Expected: Error message
Expected: Stay on /login
```

**Status:** ⏳ Pending Backend

---

### Step 5: Verify RBAC

**Protected Routes:**

```typescript
/dashboard → All authenticated users
/tasks/my-tasks → FIELD_OFFICER, SUPERVISOR, ADMIN
/tasks/:id → FIELD_OFFICER, SUPERVISOR, ADMIN
/supervisor → SUPERVISOR, ADMIN
/admin/* → ADMIN only
```

**Test:**
- [ ] FIELD_OFFICER cannot access /admin/*
- [ ] FIELD_OFFICER cannot access /supervisor
- [ ] SUPERVISOR cannot access /admin/*
- [ ] ADMIN can access all routes

**Status:** ⏳ Pending Backend

---

### Step 6: Test Token Refresh

**Scenario:**
1. Login successfully
2. Wait for token expiration (or force expire)
3. Make API request
4. Verify auto-refresh
5. Verify request retry

**Status:** ⏳ Pending Backend

---

### Step 7: Test Logout

**Scenario:**
1. Login successfully
2. Click logout button
3. Verify redirect to /login
4. Verify tokens cleared
5. Verify cannot access protected routes

**Status:** ⏳ Pending Backend

---

## 🐛 Known Issues to Fix

### Backend Issues

1. **TypeScript Compilation Errors**
   - File: `backend/src/analytics/analytics.controller.ts`
   - Lines: 42, 51, 60, 69
   - Error: Declaration expected

2. **Port Not Responding**
   - Port 3001 not accessible
   - Need to verify backend is running

---

## 📊 Integration Progress

```
Pre-Integration:     ████████░░ 80%
Backend Ready:       ░░░░░░░░░░  0% (Waiting)
Frontend Ready:      ██████████ 100%
Integration:         ░░░░░░░░░░  0% (Pending)
Testing:             ░░░░░░░░░░  0% (Pending)

Overall:             ████░░░░░░ 40%
```

---

## 🚀 Next Steps After Integration

### Immediate (Tonight)

1. **Remove Mock API**
   - Delete or archive `mockAuth.ts`
   - Update all imports
   - Verify no mock references

2. **Test All Flows**
   - Login (4 roles)
   - Logout
   - Token refresh
   - RBAC
   - Error handling

3. **Update Documentation**
   - Update README
   - Update API docs
   - Update testing guide

### Tomorrow Morning (Phase 3 Kickoff)

1. **Role-Based Dashboards**
   - Admin Dashboard
   - Supervisor Dashboard
   - Field Officer Dashboard

2. **MyTasksPage (No Chakra UI)**
   - Task list
   - Filters
   - Actions

3. **API Integration**
   - Tasks API
   - Incidents API
   - Reports API

---

## 📝 Rollback Plan

**If Backend Integration Fails:**

1. Revert to Mock API
   ```typescript
   import { mockAuthApi as authApi } from '../api/mockAuth';
   ```

2. Continue with Mock for testing

3. Fix Backend issues separately

4. Retry integration when ready

---

## ✅ Success Criteria

**Integration Complete When:**

- ✅ Login works with real Backend
- ✅ All 4 roles tested
- ✅ RBAC working correctly
- ✅ Token refresh working
- ✅ Logout working
- ✅ Error handling working
- ✅ No console errors
- ✅ Mock API removed/archived

---

## 🎯 Team w Commitment

**ETA:** วันนี้ (ก่อน 23:59 น.)  
**Status:** Standby - Waiting for Backend  
**Ready:** 100%

---

**Created:** 12 Nov 2025, 20:35 น.  
**Team:** w  
**Phase:** 2.5 → 3 Transition  
**Priority:** 🔴 CRITICAL
