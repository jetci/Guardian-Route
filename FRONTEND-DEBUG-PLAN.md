# 🎨 แผนการ Debug Frontend - Guardian Route

**ทีมรับผิดชอb:** w  
**Sprint:** 22 - Day 4  
**วันที่:** 11-12 พฤศจิกายน 2025  
**สถานะ Backend:** ✅ 93% พร้อมใช้งาน

---

## 🎯 เป้าหมาย

ตรวจสอบและแก้ไข Frontend ให้เชื่อมต่อกับ Backend API ที่พร้อมใช้งานแล้ว โดยเน้น:
1. ✅ Authentication Flow
2. ✅ Role-Based Access Control (RBAC)
3. ✅ API Integration
4. ✅ State Management
5. ✅ Error Handling

---

## 📊 Backend API ที่พร้อมใช้งาน

### 🔐 Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/refresh
GET  /api/auth/profile
POST /api/auth/logout
```

### 👥 Users Endpoints
```
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
GET    /api/users/me
```

### 📋 Tasks Endpoints
```
GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
GET    /api/tasks/my-tasks
POST   /api/tasks/:id/accept
POST   /api/tasks/:id/submit-survey
```

### 🚨 Incidents Endpoints
```
GET    /api/incidents
POST   /api/incidents
GET    /api/incidents/:id
PATCH  /api/incidents/:id
DELETE /api/incidents/:id
GET    /api/incidents/my-incidents
GET    /api/incidents/unassigned
POST   /api/incidents/:id/assign
POST   /api/incidents/:id/photos
GET    /api/incidents/:id/photos
DELETE /api/incidents/:id/photos/:photoId
```

### 📝 Reports Endpoints
```
GET    /api/reports
POST   /api/reports
GET    /api/reports/:id
PATCH  /api/reports/:id
DELETE /api/reports/:id
POST   /api/reports/full
POST   /api/reports/:id/submit
```

### 🏘️ Villages Endpoints
```
GET    /api/villages
POST   /api/villages
GET    /api/villages/:id
PATCH  /api/villages/:id
DELETE /api/villages/:id
```

### 📊 Analytics Endpoints
```
GET    /api/analytics/kpi-summary
GET    /api/analytics/incidents-by-status
GET    /api/analytics/trend-data
GET    /api/analytics/incidents-by-type
GET    /api/analytics/critical-incidents
GET    /api/analytics/risk-areas
```

---

## 🔍 Frontend Pages ที่ต้องตรวจสอบ

### Priority 1: Core Pages (ต้องทำก่อน)

#### 1. 🔐 LoginPage (`/login`)
**ไฟล์:** `frontend/src/pages/LoginPage.tsx`

**Checklist:**
- [ ] ตรวจสอบ API endpoint: `POST /api/auth/login`
- [ ] ตรวจสอบ request body format:
  ```json
  {
    "email": "user@obtwiang.go.th",
    "password": "password123"
  }
  ```
- [ ] ตรวจสอบ response handling (token, user data)
- [ ] ตรวจสอบ error handling (401, 400)
- [ ] ตรวจสอบ redirect หลัง login สำเร็จ
- [ ] ทดสอบกับ 4 roles:
  - FIELD_OFFICER
  - SUPERVISOR
  - EXECUTIVE
  - ADMIN

**Expected Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@obtwiang.go.th",
    "firstName": "John",
    "lastName": "Doe",
    "role": "FIELD_OFFICER"
  }
}
```

---

#### 2. 📋 MyTasksPage (`/tasks/my-tasks`)
**ไฟล์:** `frontend/src/pages/tasks/MyTasksPage.tsx`

**Checklist:**
- [ ] ตรวจสอบ API endpoint: `GET /api/tasks/my-tasks`
- [ ] ตรวจสอบ query params: `?status=PENDING`
- [ ] ตรวจสอบ Authorization header
- [ ] ตรวจสอบการแสดงผล task list
- [ ] ตรวจสอบ Accept Task: `POST /api/tasks/:id/accept`
- [ ] ตรวจสอบ Submit Survey: `POST /api/tasks/:id/submit-survey`
- [ ] ทดสอบ filter by status
- [ ] ทดสอบ pagination (ถ้ามี)

**Expected Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "ตรวจสอบพื้นที่น้ำท่วม",
      "status": "PENDING",
      "priority": "HIGH",
      "dueDate": "2025-11-15T00:00:00Z",
      "incident": {
        "id": "uuid",
        "title": "น้ำท่วมหมู่ 5"
      }
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

---

#### 3. 📊 Dashboard (`/dashboard`)
**ไฟล์:** `frontend/src/pages/DashboardPage.tsx`

**Checklist:**
- [ ] ตรวจสอบ API endpoint: `GET /api/analytics/kpi-summary`
- [ ] ตรวจสอบ: `GET /api/analytics/incidents-by-status`
- [ ] ตรวจสอบ: `GET /api/analytics/trend-data`
- [ ] ตรวจสอบ: `GET /api/analytics/critical-incidents`
- [ ] ตรวจสอบการแสดงผล charts
- [ ] ตรวจสอบ real-time updates (ถ้ามี)
- [ ] ทดสอบ role-based data visibility

---

#### 4. 📝 ReportDetailPage (`/reports/:id`)
**ไฟล์:** `frontend/src/pages/reports/ReportDetailPage.tsx`

**Checklist:**
- [ ] ตรวจสอบ API endpoint: `GET /api/reports/:id`
- [ ] ตรวจสอบการแสดงผล report details
- [ ] ตรวจสอบ AI Analysis section
- [ ] ตรวจสอบ Submit Report: `POST /api/reports/:id/submit`
- [ ] ตรวจสอบ Edit Report: `PATCH /api/reports/:id`
- [ ] ทดสอบ role permissions (FIELD_OFFICER, SUPERVISOR)

---

### Priority 2: CRUD Pages

#### 5. 🚨 IncidentsPage (`/incidents`)
**Checklist:**
- [ ] GET /api/incidents
- [ ] POST /api/incidents (Create)
- [ ] PATCH /api/incidents/:id (Update)
- [ ] DELETE /api/incidents/:id (Delete)
- [ ] Photo upload: POST /api/incidents/:id/photos
- [ ] ตรวจสอบ field: `images` (ไม่ใช่ `photos`)

---

#### 6. 👥 UsersPage (`/users`) - ADMIN only
**Checklist:**
- [ ] GET /api/users
- [ ] POST /api/users (Create)
- [ ] PATCH /api/users/:id (Update)
- [ ] DELETE /api/users/:id (Deactivate)
- [ ] ตรวจสอบ RBAC - เฉพาะ ADMIN เข้าถึงได้

---

#### 7. 🏘️ VillagesPage (`/villages`)
**Checklist:**
- [ ] GET /api/villages
- [ ] POST /api/villages
- [ ] PATCH /api/villages/:id
- [ ] DELETE /api/villages/:id
- [ ] ตรวจสอบ GeoJSON data

---

### Priority 3: Advanced Features

#### 8. 📋 SurveyPage (`/surveys`)
**Checklist:**
- [ ] GET /api/survey/templates
- [ ] POST /api/survey/responses
- [ ] Dynamic form rendering
- [ ] File uploads

---

#### 9. 📊 AnalyticsPage (`/analytics`)
**Checklist:**
- [ ] GET /api/analytics/risk-areas
- [ ] GET /api/analytics/incidents-by-type
- [ ] Map visualization
- [ ] Chart rendering

---

## 🔧 Frontend Technical Checks

### 1. State Management (Zustand)
**ไฟล์:** `frontend/src/stores/`

**Checklist:**
- [ ] `authStore.ts` - Authentication state
  - [ ] login action
  - [ ] logout action
  - [ ] token management
  - [ ] user data
- [ ] `taskStore.ts` - Tasks state
- [ ] `incidentStore.ts` - Incidents state
- [ ] ตรวจสอบ persistence (localStorage)

---

### 2. API Client (React Query)
**ไฟล์:** `frontend/src/api/` หรือ `frontend/src/services/`

**Checklist:**
- [ ] Base URL: `http://localhost:3001/api`
- [ ] Authorization header: `Bearer ${token}`
- [ ] Error interceptor
- [ ] Response interceptor
- [ ] Retry logic
- [ ] Cache configuration

**ตัวอย่าง API Client:**
```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### 3. Role-Based Access Control (RBAC)
**ไฟล์:** `frontend/src/components/ProtectedRoute.tsx`

**Checklist:**
- [ ] ตรวจสอบ role checking logic
- [ ] ตรวจสอบ redirect สำหรับ unauthorized access
- [ ] ทดสอบทุก role:
  - FIELD_OFFICER: `/tasks/my-tasks`, `/incidents/my-incidents`
  - SUPERVISOR: `/incidents/unassigned`, `/tasks/assign`
  - EXECUTIVE: `/analytics`, `/reports`
  - ADMIN: `/users`, `/settings`

**ตัวอย่าง ProtectedRoute:**
```typescript
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

---

### 4. Environment Variables
**ไฟล์:** `frontend/.env`

**Checklist:**
- [ ] `VITE_API_URL=http://localhost:3001/api`
- [ ] `VITE_APP_NAME=Guardian Route Dashboard`
- [ ] `VITE_MAP_CENTER_LAT=18.7883`
- [ ] `VITE_MAP_CENTER_LNG=98.9853`
- [ ] `VITE_MAP_DEFAULT_ZOOM=13`

---

## 🧪 Testing Strategy

### Manual Testing Checklist

#### Test Case 1: Login Flow
```
1. เปิด http://localhost:5173/login
2. กรอก email: supervisor@obtwiang.go.th
3. กรอก password: password123
4. คลิก Login
5. ✅ ควร redirect ไป /dashboard
6. ✅ ควรเห็น user info ที่ navbar
7. ✅ Token ควรถูกเก็บใน localStorage
```

#### Test Case 2: My Tasks (FIELD_OFFICER)
```
1. Login ด้วย FIELD_OFFICER account
2. ไป /tasks/my-tasks
3. ✅ ควรเห็น task list ที่ assigned ให้ตัวเอง
4. คลิก "Accept Task"
5. ✅ Task status ควรเปลี่ยนเป็น IN_PROGRESS
6. คลิก "Submit Survey"
7. กรอก survey data
8. ✅ Task status ควรเปลี่ยนเป็น SURVEYED
```

#### Test Case 3: RBAC
```
1. Login ด้วย FIELD_OFFICER account
2. พยายามเข้า /users
3. ✅ ควร redirect ไป /unauthorized หรือ /dashboard
4. Logout
5. Login ด้วย ADMIN account
6. เข้า /users
7. ✅ ควรเข้าได้และเห็น user list
```

#### Test Case 4: Image Upload
```
1. ไป /incidents/new
2. กรอกข้อมูล incident
3. อัพโหลดรูปภาพ
4. Submit
5. ✅ รูปภาพควรถูกเก็บใน incident.images (ไม่ใช่ photos)
6. ตรวจสอบที่ /incidents/:id
7. ✅ รูปภาพควรแสดงผลถูกต้อง
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**อาการ:**
```
Access to XMLHttpRequest at 'http://localhost:3001/api/auth/login' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**วิธีแก้:**
Backend `main.ts` มี CORS config แล้ว:
```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
});
```

ตรวจสอบ `backend/.env`:
```
CORS_ORIGIN=http://localhost:5173
```

---

### Issue 2: 401 Unauthorized
**อาการ:** ทุก API call ได้ 401

**วิธีแก้:**
1. ตรวจสอบ token ใน localStorage
2. ตรวจสอบ Authorization header
3. ตรวจสอบ token expiry
4. ลอง refresh token

---

### Issue 3: Field Name Mismatch
**อาการ:** Frontend ส่ง `photos` แต่ Backend ต้องการ `images`

**วิธีแก้:**
แก้ไข Frontend code:
```typescript
// ❌ เก่า
const incident = {
  photos: uploadedFiles
};

// ✅ ใหม่
const incident = {
  images: uploadedFiles
};
```

---

### Issue 4: Role Name Mismatch
**อาการ:** Frontend ใช้ `REPORTER` แต่ Backend มีแค่ `FIELD_OFFICER`

**วิธีแก้:**
แก้ไข Frontend constants:
```typescript
// ❌ เก่า
export const ROLES = {
  REPORTER: 'REPORTER',
  // ...
};

// ✅ ใหม่
export const ROLES = {
  FIELD_OFFICER: 'FIELD_OFFICER',
  SUPERVISOR: 'SUPERVISOR',
  EXECUTIVE: 'EXECUTIVE',
  ADMIN: 'ADMIN',
};
```

---

## 📝 Debug Log Template

สร้างไฟล์ `FRONTEND-DEBUG-LOG.md` เพื่อบันทึกผลการทดสอบ:

```markdown
# Frontend Debug Log

## วันที่: [DATE]
## ผู้ทดสอบ: [NAME]

### Page: LoginPage
- [ ] API Call สำเร็จ
- [ ] Response ถูกต้อง
- [ ] Redirect ทำงาน
- [ ] Error handling ทำงาน
- **Issues:** [ระบุปัญหาที่พบ]
- **Status:** ✅ / ⚠️ / ❌

### Page: MyTasksPage
- [ ] API Call สำเร็จ
- [ ] Data แสดงผลถูกต้อง
- [ ] Accept Task ทำงาน
- [ ] Submit Survey ทำงาน
- **Issues:** [ระบุปัญหาที่พบ]
- **Status:** ✅ / ⚠️ / ❌

[... ต่อไปสำหรับทุก page]
```

---

## 🎯 Success Criteria

Frontend ถือว่าพร้อมใช้งานเมื่อ:

- [ ] ✅ Login/Logout ทำงานถูกต้อง
- [ ] ✅ RBAC ทำงานครบทุก role
- [ ] ✅ ทุก CRUD operations ทำงาน
- [ ] ✅ Image upload ทำงาน (ใช้ `images` field)
- [ ] ✅ Error handling ครบถ้วน
- [ ] ✅ Loading states แสดงผลถูกต้อง
- [ ] ✅ ไม่มี console errors
- [ ] ✅ API calls ใช้ endpoint ที่ถูกต้อง
- [ ] ✅ State management ทำงานถูกต้อง
- [ ] ✅ Responsive design ทำงานบนทุก screen size

---

## 📊 Progress Tracking

| Page | Status | Issues | Assigned To | Completed |
|------|--------|--------|-------------|-----------|
| LoginPage | 🔄 | - | - | - |
| MyTasksPage | 🔄 | - | - | - |
| Dashboard | 🔄 | - | - | - |
| ReportDetailPage | 🔄 | - | - | - |
| IncidentsPage | 🔄 | - | - | - |
| UsersPage | 🔄 | - | - | - |
| VillagesPage | 🔄 | - | - | - |
| SurveyPage | 🔄 | - | - | - |
| AnalyticsPage | 🔄 | - | - | - |

**Legend:**
- 🔄 In Progress
- ✅ Completed
- ⚠️ Has Issues
- ❌ Blocked

---

## 🚀 Next Steps

1. **Day 4 (Today):**
   - ตรวจสอบ Priority 1 pages (Login, MyTasks, Dashboard, ReportDetail)
   - แก้ไข critical issues

2. **Day 5:**
   - ตรวจสอบ Priority 2 pages (CRUD pages)
   - แก้ไข API integration issues

3. **Day 6:**
   - ตรวจสอบ Priority 3 pages (Advanced features)
   - Integration testing

4. **Day 7:**
   - Bug fixes
   - Performance optimization
   - Final testing

---

**รายงานจาก w**  
**สถานะ:** 📋 แผนงานพร้อมใช้งาน  
**ขั้นตอนถัดไป:** เริ่ม Debug Frontend ตาม Priority
