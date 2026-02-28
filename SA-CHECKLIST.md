# ✅ SA CHECKLIST - Guardian Route

## วันที่อัปเดตล่าสุด: 12 พฤศจิกายน 2025 เวลา 00:01 น.

**SA Approved:** ✅ อย่างเป็นทางการ  
**Sprint Goal:** "ให้ทุก Feature พร้อมใช้งานระดับ Production พร้อม Test และ Documentation"

---

## 📊 สถานะการดำเนินการ

| รายการ | ความสำคัญ | สถานะ | ผู้รับผิดชอบ | หมายเหตุ |
|--------|-----------|--------|----------------|----------|
| Frontend Debug Log | 🔴 สูง | ⏳ กำลังดำเนินการ | ทีม w | เริ่มจาก LoginPage วันนี้ |
| RBAC Final Review | 🟡 กลาง | ⏳ รอทดสอบ QA | ทีม QA | 4 Roles ครบแล้ว (FIELD_OFFICER, SUPERVISOR, EXECUTIVE, ADMIN) |
| Notification Module Plan | 🔴 สูง | ⏳ เตรียม Prisma Models | ทีม w | Prisma schema ออกแบบเสร็จ, ทำใน Sprint 23 |
| Auth/Session Expiry UX | 🟡 กลาง | ❌ ยังไม่เริ่ม | UX Team | รอ Feedback และ Design |
| Unit Test Coverage ≥ 80% | 🔴 สูง | ⏳ เริ่มเขียน | ทีม Dev | ตั้งเป้า Backend 80%, Frontend 70% |
| Sentry/Log Service | 🟡 กลาง | ❌ ยังไม่เริ่ม | DevOps | Sprint 23 Week 2 |

---

## 📋 รายละเอียดแต่ละรายการ

### 1. Frontend Debug Log (🔴 สูง)

**ผู้รับผิดชอบ:** ทีม w  
**สถานะ:** ⏳ กำลังดำเนินการ  
**Deadline:** อัปเดตทุกวัน 17:00 น.

**Tasks:**
- [ ] สร้างไฟล์ `FRONTEND-DEBUG-LOG.md`
- [ ] ทดสอบ LoginPage
- [ ] ทดสอบ MyTasksPage
- [ ] ทดสอบ Dashboard
- [ ] ทดสอบ ReportDetailPage
- [ ] บันทึก Issues ที่พบ
- [ ] บันทึกการแก้ไข

**Progress:**
```
Day 4: LoginPage, MyTasksPage (เป้าหมายวันนี้)
Day 5: IncidentsPage, UsersPage, VillagesPage
Day 6: SurveyPage, AnalyticsPage
Day 7: Bug fixes, Retrospective
```

**Template:**
```markdown
# Frontend Debug Log - Day X

## LoginPage
- [x] API Call สำเร็จ
- [x] Token storage ทำงาน
- [ ] Error handling ต้องปรับปรุง
- **Issues:** [BUG-001] Error message ไม่ชัดเจน
- **Status:** ⚠️ Has Issues
```

---

### 2. RBAC Final Review (🟡 กลาง)

**ผู้รับผิดชอบ:** ทีม QA  
**สถานะ:** ⏳ รอทดสอบ QA  
**Deadline:** Day 5 (13 พฤศจิกายน 2025)

**Tasks:**
- [ ] ทดสอบ FIELD_OFFICER permissions
  - [ ] `/tasks/my-tasks` - ✅ Allow
  - [ ] `/incidents/my-incidents` - ✅ Allow
  - [ ] `/users` - ❌ Deny
  - [ ] `/settings` - ❌ Deny

- [ ] ทดสอบ SUPERVISOR permissions
  - [ ] `/incidents/unassigned` - ✅ Allow
  - [ ] `/tasks/assign` - ✅ Allow
  - [ ] `/reports/review` - ✅ Allow
  - [ ] `/users` - ❌ Deny

- [ ] ทดสอบ EXECUTIVE permissions
  - [ ] `/analytics` - ✅ Allow
  - [ ] `/dashboard` - ✅ Allow
  - [ ] `/reports` (read-only) - ✅ Allow
  - [ ] `/users` - ❌ Deny

- [ ] ทดสอบ ADMIN permissions
  - [ ] `/users` - ✅ Allow
  - [ ] `/settings` - ✅ Allow
  - [ ] All pages - ✅ Allow

- [ ] ทดสอบ unauthorized access
- [ ] ทดสอบ role switching
- [ ] สร้าง RBAC test report

**Test Matrix:**
| Role | Page | Expected | Actual | Status |
|------|------|----------|--------|--------|
| FIELD_OFFICER | /users | ❌ Denied | - | ⏳ |
| FIELD_OFFICER | /tasks/my-tasks | ✅ Allow | - | ⏳ |
| SUPERVISOR | /incidents/unassigned | ✅ Allow | - | ⏳ |
| EXECUTIVE | /analytics | ✅ Allow | - | ⏳ |
| ADMIN | /users | ✅ Allow | - | ⏳ |

---

### 3. Notification Module Plan (🔴 สูง)

**ผู้รับผิดชอบ:** ทีม w  
**สถานะ:** ⏳ เตรียม Prisma Models  
**Deadline:** Sprint 23 Week 1

**Tasks:**
- [x] ออกแบบ Prisma Schema
- [ ] สร้าง Migration files
- [ ] Implement NotificationService
- [ ] Implement NotificationController
- [ ] เพิ่ม WebSocket support (optional)
- [ ] ทดสอบ notification delivery
- [ ] เขียน Documentation

**Prisma Schema (ออกแบบเสร็จแล้ว):**
```prisma
model Notification {
  id        String   @id @default(uuid())
  title     String
  message   String
  type      NotificationType
  priority  NotificationPriority @default(NORMAL)
  data      Json?
  createdAt DateTime @default(now()) @map("created_at")
  
  userNotifications UserNotification[]
  
  @@map("notifications")
}

model UserNotification {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  notificationId String   @map("notification_id")
  isRead         Boolean  @default(false) @map("is_read")
  readAt         DateTime? @map("read_at")
  createdAt      DateTime @default(now()) @map("created_at")
  
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  notification Notification @relation(fields: [notificationId], references: [id], onDelete: Cascade)
  
  @@unique([userId, notificationId])
  @@index([userId])
  @@index([notificationId])
  @@map("user_notifications")
}

enum NotificationType {
  INCIDENT_CREATED
  INCIDENT_ASSIGNED
  INCIDENT_UPDATED
  TASK_ASSIGNED
  TASK_COMPLETED
  REPORT_SUBMITTED
  SYSTEM_ALERT
}

enum NotificationPriority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

**Implementation Plan:**
1. Week 1: Prisma migration
2. Week 1: Backend service & controller
3. Week 2: Frontend notification bell
4. Week 2: WebSocket integration (optional)
5. Week 2: Testing & documentation

---

### 4. Auth/Session Expiry UX (🟡 กลาง)

**ผู้รับผิดชอบ:** UX Team  
**สถานะ:** ❌ ยังไม่เริ่ม  
**Deadline:** Day 6 (14 พฤศจิกายน 2025)

**Tasks:**
- [ ] ออกแบบ Session expiry warning modal
- [ ] ออกแบบ Auto-logout notification
- [ ] ออกแบบ Re-login flow
- [ ] Implement warning modal (5 min before expiry)
- [ ] Implement auto-logout
- [ ] Implement session extension
- [ ] ทดสอบ UX flow

**User Flow:**
```
1. User logged in
2. Token expires in 5 minutes
   → Show warning modal: "Your session will expire in 5 minutes"
   → Options: [Extend Session] [Logout Now]
3. If no action → Auto logout at expiry
   → Show notification: "Session expired. Please login again."
   → Redirect to /login
4. If [Extend Session] → Refresh token
   → Continue working
```

**Design Requirements:**
- Modal ต้องไม่บังหน้าจอทำงาน
- มี countdown timer แสดงเวลาที่เหลือ
- สามารถปิด modal และจะแสดงอีกครั้งใน 2 นาที
- Auto-logout ต้อง save draft ก่อน (ถ้ามี)

---

### 5. Unit Test Coverage ≥ 80% (🔴 สูง)

**ผู้รับผิดชอบ:** ทีม Dev (All)  
**สถานะ:** ⏳ เริ่มเขียน  
**Deadline:** Sprint 23 Week 3-4

**Current Coverage:** 0%  
**Target Coverage:** Backend 80%, Frontend 70%

**Priority Modules:**

#### Backend (Target: 80%)
- [ ] **Auth Module** - 90%
  - [ ] auth.service.spec.ts
  - [ ] auth.controller.spec.ts
  - [ ] jwt.strategy.spec.ts
  
- [ ] **Users Module** - 85%
  - [ ] users.service.spec.ts
  - [ ] users.controller.spec.ts
  
- [ ] **Tasks Module** - 80%
  - [ ] tasks.service.spec.ts
  - [ ] tasks.controller.spec.ts
  
- [ ] **Incidents Module** - 80%
  - [ ] incidents.service.spec.ts
  - [ ] incidents.controller.spec.ts
  - [ ] photos.service.spec.ts
  
- [ ] **Reports Module** - 75%
  - [ ] report.service.spec.ts
  - [ ] report.controller.spec.ts

#### Frontend (Target: 70%)
- [ ] **LoginPage** - 90%
- [ ] **Dashboard** - 80%
- [ ] **MyTasksPage** - 80%
- [ ] **IncidentsPage** - 75%
- [ ] **ReportsPage** - 70%

**Tools:**
- Backend: Jest + Supertest
- Frontend: Vitest + React Testing Library
- Coverage Report: Istanbul/NYC

**Commands:**
```bash
# Backend
cd backend
npm run test:cov

# Frontend
cd frontend
npm run test:coverage
```

**Weekly Targets:**
- Week 1: Setup test infrastructure
- Week 2: Backend 50% coverage
- Week 3: Backend 80%, Frontend 40%
- Week 4: Frontend 70%, E2E tests

---

### 6. Sentry/Log Service (🟡 กลาง)

**ผู้รับผิดชอบ:** DevOps  
**สถานะ:** ❌ ยังไม่เริ่ม  
**Deadline:** Sprint 23 Week 2

**Tasks:**
- [ ] เลือก Log Service (Sentry / Datadog / New Relic)
- [ ] Setup Sentry account
- [ ] Integrate Sentry SDK - Backend
- [ ] Integrate Sentry SDK - Frontend
- [ ] Configure error tracking
- [ ] Configure performance monitoring
- [ ] Setup alerts
- [ ] Test error reporting

**Sentry Integration Plan:**

**Backend:**
```typescript
// backend/src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

**Frontend:**
```typescript
// frontend/src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
});
```

**Alert Configuration:**
- Error rate > 5% → Notify team
- Response time > 2s → Notify DevOps
- Memory usage > 90% → Critical alert
- Database connection fail → Critical alert

---

## 📈 Progress Dashboard

```
Overall Progress: ████████░░░░░░░░░░░░ 40%

Frontend Debug Log:     ████░░░░░░░░░░░░░░░░ 20%
RBAC Final Review:      ██░░░░░░░░░░░░░░░░░░ 10%
Notification Module:    ████████░░░░░░░░░░░░ 40%
Auth/Session UX:        ░░░░░░░░░░░░░░░░░░░░  0%
Unit Test Coverage:     ██░░░░░░░░░░░░░░░░░░ 10%
Sentry Integration:     ░░░░░░░░░░░░░░░░░░░░  0%
```

---

## 🎯 Weekly Goals

### Week 1 (Day 1-7): Integration & Core Features
- [ ] Frontend Debug Log complete
- [ ] Core pages functional
- [ ] RBAC tested
- [ ] Image upload working

### Week 2 (Day 8-14): Security & Testing
- [ ] RBAC Final Review complete
- [ ] Unit tests 50% coverage
- [ ] Notification Module design complete
- [ ] Sentry integration started

### Week 3 (Day 15-21): Quality & Documentation
- [ ] Unit tests 80% coverage
- [ ] Auth/Session UX complete
- [ ] E2E tests passing
- [ ] Documentation updated

### Week 4 (Day 22-28): Production Ready
- [ ] All checklist items complete
- [ ] UAT passed
- [ ] Performance optimized
- [ ] Ready for deployment

---

## 🚨 Blockers & Issues

**Current Blockers:** None

**Potential Risks:**
1. **Frontend Integration Delays** - Mitigation: Daily standup, clear priorities
2. **Test Coverage Target** - Mitigation: Start early, focus on critical paths
3. **UX Team Availability** - Mitigation: Provide clear requirements, async communication

---

## 📝 Daily Update Log

### Day 4 (12 พฤศจิกายน 2025)
- ✅ SA Checklist created
- ⏳ Frontend Debug Log started
- ⏳ LoginPage testing in progress
- ⏳ MyTasksPage testing in progress

### Day 5 (13 พฤศจิกายน 2025)
- [ ] CRUD pages testing
- [ ] Image upload verification
- [ ] RBAC testing started

### Day 6 (14 พฤศจิกายน 2025)
- [ ] Advanced features testing
- [ ] Auth/Session UX design
- [ ] Bug fixes

### Day 7 (15 พฤศจิกายน 2025)
- [ ] Sprint 22 retrospective
- [ ] Sprint 23 planning
- [ ] Documentation update

---

## 📞 Escalation & Support

**หาก Task ใดติดขัด:**

1. **Technical Issues** → ทีม w
2. **Resource Issues** → Project Manager
3. **Critical Blockers** → SA (24/7)

**SA Support Available:**
- 🔧 Debug Architecture
- ⚙️ Build Optimization
- 📋 Security Threat Modeling
- 🧪 End-to-End Test Plan
- 🧬 Design System Audit

---

## 🎓 หมายเหตุจาก SA

> **ให้ทีมอัปเดตสถานะนี้ทุก 1 วันในช่วง Sprint**  
> **เน้นการติดตามแบบ ✅/⏳/❌ พร้อมผู้รับผิดชอบเสมอ**

**Sprint Goal Reminder:**
> "ให้ทุก Feature ที่มี อยู่ในสภาพพร้อมใช้งานระดับ Production พร้อม Test และ Documentation"

---

## ✅ Success Criteria

SA Checklist ถือว่าสำเร็จเมื่อ:

- [ ] ✅ Frontend Debug Log มีการอัปเดตทุกวัน
- [ ] ✅ RBAC ผ่านการทดสอบทุก role
- [ ] ✅ Notification Module พร้อมใช้งาน
- [ ] ✅ Auth/Session UX ทำงานถูกต้อง
- [ ] ✅ Unit Test Coverage ≥ 80%
- [ ] ✅ Sentry/Log Service ทำงาน
- [ ] ✅ ทุก Task มี Documentation
- [ ] ✅ SA Final Review ผ่าน

---

**รายงานจาก w**  
**อัปเดตล่าสุด:** 12 พฤศจิกายน 2025 เวลา 00:01 น.  
**สถานะ:** 📋 SA Checklist พร้อมใช้งาน  
**ขั้นตอนถัดไป:** เริ่มดำเนินการตาม Checklist
