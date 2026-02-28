# 🔗 Phase 2: Integration Checklist

**Project:** Guardian Route  
**Date:** November 13, 2025  
**Time:** 11:30-13:00 (90 นาที)  
**Phase:** 2 - Frontend ↔ Backend Integration

---

## 📋 Integration Tasks

### ✅ Task 1: Login Integration (15 min)

**File:** `frontend/src/pages/LoginPage.tsx`

**Changes Required:**
```typescript
// Replace mock login with real API call
import { authService } from '../services/authService';

const handleLogin = async (email: string, password: string) => {
  try {
    const response = await authService.login(email, password);
    authStore.setUser(response.user);
    authStore.setToken(response.access_token);
    // Redirect based on role
  } catch (error) {
    toast.error('Login failed: ' + error.message);
  }
};
```

**API Endpoint:** `POST /auth/login`

**Test:**
- [ ] Login with admin@obtwiang.go.th
- [ ] Login with supervisor@obtwiang.go.th
- [ ] Login with field@obtwiang.go.th
- [ ] Login with executive@obtwiang.go.th
- [ ] Wrong password shows error
- [ ] Token stored in authStore
- [ ] Redirect to correct dashboard

---

### ✅ Task 2: Dashboard Layout Integration (10 min)

**File:** `frontend/src/components/layout/DashboardLayout.tsx`

**Changes Required:**
```typescript
// Fetch real user info
import { userService } from '../../services/userService';

useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const user = await userService.getMe();
      authStore.setUser(user);
    } catch (error) {
      // Token expired, redirect to login
      authStore.logout();
      navigate('/login');
    }
  };
  fetchUserInfo();
}, []);
```

**API Endpoint:** `GET /users/me`

**Test:**
- [ ] User info displays correctly
- [ ] Avatar shows (if available)
- [ ] Role displays correctly
- [ ] Logout works

---

### ✅ Task 3: Create Incident Integration (15 min)

**File:** `frontend/src/pages/field-officer/CreateIncidentReportPage.tsx`

**Changes Required:**
```typescript
// Use real incident service
import { incidentService } from '../../services/incidentService';

const handleSubmit = async (formData) => {
  try {
    const incident = await incidentService.create(formData);
    toast.success('Incident created successfully!');
    navigate('/field-officer/map');
  } catch (error) {
    toast.error('Failed to create incident: ' + error.message);
  }
};
```

**API Endpoint:** `POST /incidents`

**Test:**
- [ ] Create incident with all fields
- [ ] Upload photos
- [ ] GPS location saved
- [ ] Incident appears on map
- [ ] Validation errors shown

---

### ✅ Task 4: Report History Integration (10 min)

**File:** `frontend/src/pages/field-officer/ReportHistoryPage.tsx`

**Changes Required:**
```typescript
// Fetch real reports
import { reportService } from '../../services/reportService';

useEffect(() => {
  const fetchReports = async () => {
    try {
      const reports = await reportService.getMyReports();
      setReports(reports);
    } catch (error) {
      toast.error('Failed to load reports');
    }
  };
  fetchReports();
}, []);
```

**API Endpoint:** `GET /reports/me`

**Test:**
- [ ] Reports load from database
- [ ] Filter by status works
- [ ] Search works
- [ ] Pagination works (if implemented)
- [ ] View report details

---

### ✅ Task 5: Tasks Integration (10 min)

**File:** `frontend/src/pages/tasks/MyTasksPage.tsx`

**Changes Required:**
```typescript
// Fetch real tasks
import { taskService } from '../../services/taskService';

useEffect(() => {
  const fetchTasks = async () => {
    try {
      const tasks = await taskService.getAssignedTasks();
      setTasks(tasks);
    } catch (error) {
      toast.error('Failed to load tasks');
    }
  };
  fetchTasks();
}, []);
```

**API Endpoint:** `GET /tasks/assigned`

**Test:**
- [ ] Tasks load from database
- [ ] Tab switching works (Assigned/In Progress/Completed)
- [ ] Task counts correct
- [ ] Update task status works

---

### ✅ Task 6: Report Approval Integration (15 min)

**File:** `frontend/src/pages/supervisor/SupervisorDashboardV2.tsx`

**Changes Required:**
```typescript
// Approve/Reject reports
import { reportService } from '../../services/reportService';

const handleApprove = async (reportId: string) => {
  try {
    await reportService.updateStatus(reportId, 'APPROVED');
    toast.success('Report approved!');
    refreshReports();
  } catch (error) {
    toast.error('Failed to approve report');
  }
};

const handleReject = async (reportId: string, comment: string) => {
  try {
    await reportService.updateStatus(reportId, 'REJECTED', comment);
    toast.success('Report rejected!');
    refreshReports();
  } catch (error) {
    toast.error('Failed to reject report');
  }
};
```

**API Endpoint:** `PUT /reports/:id/status`

**Test:**
- [ ] Approve report works
- [ ] Reject report works
- [ ] Request revision works
- [ ] Status updates in real-time
- [ ] Notifications sent

---

### ✅ Task 7: User Management Integration (15 min)

**File:** `frontend/src/pages/admin/AdminDashboardV2.tsx`

**Changes Required:**
```typescript
// CRUD operations for users
import { userService } from '../../services/userService';

const handleCreateUser = async (userData) => {
  try {
    await userService.create(userData);
    toast.success('User created!');
    refreshUsers();
  } catch (error) {
    toast.error('Failed to create user');
  }
};

const handleUpdateUser = async (userId, userData) => {
  try {
    await userService.update(userId, userData);
    toast.success('User updated!');
    refreshUsers();
  } catch (error) {
    toast.error('Failed to update user');
  }
};

const handleDeleteUser = async (userId) => {
  try {
    await userService.delete(userId);
    toast.success('User deleted!');
    refreshUsers();
  } catch (error) {
    toast.error('Failed to delete user');
  }
};
```

**API Endpoints:**
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users` - Get all users

**Test:**
- [ ] Create user works
- [ ] Edit user works
- [ ] Delete user works
- [ ] Search users works
- [ ] Filter by role works

---

## 🔧 API Service Files to Update

### 1. authService.ts
```typescript
import api from './api';

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  }
};
```

### 2. userService.ts
```typescript
import api from './api';

export const userService = {
  getMe: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  create: async (userData: any) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  update: async (id: string, userData: any) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
```

### 3. incidentService.ts
```typescript
import api from './api';

export const incidentService = {
  getAll: async () => {
    const response = await api.get('/incidents');
    return response.data;
  },
  
  create: async (incidentData: any) => {
    const response = await api.post('/incidents', incidentData);
    return response.data;
  },
  
  update: async (id: string, incidentData: any) => {
    const response = await api.put(`/incidents/${id}`, incidentData);
    return response.data;
  }
};
```

### 4. reportService.ts
```typescript
import api from './api';

export const reportService = {
  getMyReports: async () => {
    const response = await api.get('/reports/me');
    return response.data;
  },
  
  create: async (reportData: any) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
  
  updateStatus: async (id: string, status: string, comment?: string) => {
    const response = await api.put(`/reports/${id}/status`, { status, comment });
    return response.data;
  }
};
```

### 5. taskService.ts
```typescript
import api from './api';

export const taskService = {
  getAssignedTasks: async () => {
    const response = await api.get('/tasks/assigned');
    return response.data;
  },
  
  updateStatus: async (id: string, status: string) => {
    const response = await api.put(`/tasks/${id}/status`, { status });
    return response.data;
  }
};
```

---

## 🔒 Authentication Rules

### Every API Call Must Include Token

**Update `api.ts`:**
```typescript
import axios from 'axios';
import { authStore } from '../stores/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, logout
      authStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## ✅ Integration Checklist

```
Setup:
☐ Backend server running on port 3001
☐ Frontend server running on port 5173
☐ Database connected and seeded
☐ CORS configured correctly

Authentication:
☐ Login with real API
☐ Token stored in authStore
☐ Token sent with every request
☐ 401 handling redirects to login
☐ Logout clears token

Field Officer:
☐ Create incident → Real API
☐ View incidents → Real data
☐ Report history → Real data
☐ Tasks → Real data

Supervisor:
☐ Pending reviews → Real data
☐ Approve report → Real API
☐ Reject report → Real API
☐ Assign task → Real API
☐ Team performance → Real data

Admin:
☐ User list → Real data
☐ Create user → Real API
☐ Edit user → Real API
☐ Delete user → Real API
☐ Activity logs → Real data

Executive:
☐ KPIs → Real data
☐ Charts → Real data
☐ Reports → Real data
☐ Metrics → Real data

Error Handling:
☐ Network errors show toast
☐ Validation errors show in form
☐ 401/403 redirect to login
☐ 500 errors show friendly message
☐ Loading states during API calls
```

---

## 📊 Progress Tracking

- **Total Tasks:** 7
- **Completed:** 0
- **In Progress:** 0
- **Pending:** 7
- **Estimated Time:** 90 minutes

---

## 📞 Report to SA

When Phase 2 is complete, report:

```
✅ Phase 2 Complete!

Integration Status:
- Login: ✅ Connected to API
- User Management: ✅ CRUD working
- Incidents: ✅ Create/View working
- Reports: ✅ Fetch/Update working
- Tasks: ✅ Fetch/Update working
- Approval Flow: ✅ Working
- Error Handling: ✅ Implemented

All dashboards now using REAL data!
Mock data REMOVED!

Ready for Phase 3: Integration Testing!
```

---

**Created by:** Team W  
**For:** SA - Guardian Route Project  
**Status:** 🟡 Ready to Execute
