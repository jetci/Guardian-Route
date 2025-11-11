# 🚀 Guardian Route: Technical Roadmap (30 Days)

**เป้าหมาย:** Production-Ready 100%  
**วันที่เริ่ม:** 12 พฤศจิกายน 2025  
**วันที่สิ้นสุด:** 11 ธันวาคม 2025  
**ทีมรับผิดชอบ:** w + All Teams  
**SA Approved:** ✅

---

## 🧭 Vision & Strategic Goals

### เป้าหมายหลักของแผน 30 วัน

ระบบ Guardian Route พร้อมใช้งานระดับ Production ภายใน 30 วัน โดยเน้น:

1. **🔒 Security First** - ระบบปลอดภัย มี Authentication และ Authorization ที่แข็งแกร่ง
2. **🧪 Quality Assurance** - Test Coverage ≥ 80% พร้อม E2E Testing ครบถ้วน
3. **⚡ Performance** - Response time < 500ms, Load time < 3s
4. **📚 Documentation** - เอกสารครบถ้วน ทั้ง Technical และ User Guide
5. **🚀 DevOps Ready** - CI/CD Pipeline อัตโนมัติ พร้อม Monitoring
6. **👥 User-Centric** - UX/UI ที่ใช้งานง่าย รองรับทุก Role

---

## 📊 Current Status (Day 0 - 12 พ.ย. 2025)

| Category | Progress | Status | Priority |
|----------|----------|--------|----------|
| Backend | 93% | ✅ พร้อมใช้งาน | Maintenance |
| Frontend | 20% | 🔄 กำลังพัฒนา | 🔴 สูง |
| Testing | 10% | 🔄 เริ่มต้น | 🔴 สูง |
| Security | 40% | 🔄 ต้องปรับปรุง | 🔴 สูง |
| DevOps | 10% | 🔄 เริ่มต้น | 🟡 กลาง |
| Documentation | 80% | ✅ ใกล้เสร็จ | 🟢 ต่ำ |
| **Overall** | **42%** | 🔄 **In Progress** | - |

---

## 🎯 หลักการออกแบบ Roadmap

### Design Principles

1. **Incremental Delivery** - ส่งมอบทีละส่วน ทดสอบได้ทันที
2. **Risk Mitigation** - ระบุความเสี่ยงและแผนสำรอง
3. **Quality Gates** - มี Checkpoint ทุกสัปดาห์
4. **Team Collaboration** - ทุกทีมทำงานแบบ Parallel
5. **Documentation First** - เอกสารทันสมัยตลอดเวลา

### Success Metrics

| Metric | Target | Current | Gap |
|--------|--------|---------|-----|
| Backend Coverage | 80% | 0% | 80% |
| Frontend Coverage | 70% | 0% | 70% |
| API Response Time | < 500ms | ~300ms | ✅ |
| Page Load Time | < 3s | ~5s | 2s |
| Security Score | > 90% | 40% | 50% |
| Bug Count (P0/P1) | 0 | 3 | 3 |

---

## 📆 Sprint 22 (Week 1): Integration & Core Features

**วันที่:** 12-18 พฤศจิกายน 2025  
**Focus:** Frontend-Backend Integration และ Core Features Testing  
**Owner:** ทีม w + Frontend Team

### Day 1-2 (12-13 พ.ย.) - Priority 1 Pages

#### LoginPage
- [ ] API integration (`POST /api/auth/login`)
- [ ] Token management (localStorage + secure)
- [ ] Error handling (network, validation, server)
- [ ] Redirect logic (role-based)
- [ ] Test ทุก 4 roles (FIELD_OFFICER, SUPERVISOR, EXECUTIVE, ADMIN)

#### MyTasksPage
- [ ] API integration (`GET /api/tasks/my-tasks`)
- [ ] Task list display (pagination, sorting)
- [ ] Accept Task function
- [ ] Submit Survey function
- [ ] Status updates (real-time)

#### Dashboard
- [ ] KPI Summary display
- [ ] Charts rendering (Chart.js/Recharts)
- [ ] Analytics integration
- [ ] Role-based data filtering

#### ReportDetailPage
- [ ] Report display (full details)
- [ ] AI Analysis view
- [ ] Submit function
- [ ] Edit function (draft only)

**Deliverables:**
- ✅ 4 pages functional
- ✅ Frontend Debug Log (Day 1-2)
- ✅ Bug list with priorities

---

### Day 3-4 (14-15 พ.ย.) - CRUD Operations

#### IncidentsPage
- [ ] List incidents (with filters)
- [ ] Create incident (with validation)
- [ ] Update incident (status, assignment)
- [ ] Delete incident (soft delete)
- [ ] Assign incident (to FIELD_OFFICER)
- [ ] **⚠️ Critical:** Image upload using `images` field (not `photos`)

#### UsersPage (ADMIN only)
- [ ] List users (with search, filter)
- [ ] Create user (with username, fullName)
- [ ] Update user (profile, role)
- [ ] Deactivate user (soft delete)
- [ ] RBAC enforcement (403 for non-ADMIN)

#### VillagesPage
- [ ] List villages (with map view)
- [ ] Create village (with GeoJSON)
- [ ] Update village (boundaries, info)
- [ ] Delete village (soft delete)
- [ ] GeoJSON validation

**Deliverables:**
- ✅ CRUD operations working
- ✅ Image upload tested
- ✅ RBAC verified

---

### Day 5 (16 พ.ย.) - Image Upload & File Handling

#### Image Upload Verification
- [ ] Test upload endpoint (`POST /api/incidents/:id/images`)
- [ ] Verify `images` field usage (Prisma schema)
- [ ] Test image gallery (display, zoom)
- [ ] Test delete images (soft delete)
- [ ] Performance testing (multiple files, large files)
- [ ] Security testing (file type validation, size limit)

**Technical Details:**
```typescript
// Correct field usage
incident.images // ✅ Correct
incident.photos // ❌ Wrong (old field)

// Upload endpoint
POST /api/incidents/:id/images
Content-Type: multipart/form-data
Body: { files: File[] }
```

**Deliverables:**
- ✅ Image upload functional
- ✅ Performance benchmarks
- ✅ Security validation

---

### Day 6 (17 พ.ย.) - Advanced Features & Bug Fixes

#### Advanced Features Testing
- [ ] **SurveyPage** - Dynamic form rendering
- [ ] **SurveyPage** - Survey submission
- [ ] **SurveyPage** - Response validation
- [ ] **AnalyticsPage** - Risk areas map
- [ ] **AnalyticsPage** - Incident statistics
- [ ] **AnalyticsPage** - Chart visualizations

#### API Integration Fixes
- [ ] Fix CORS issues (if any)
- [ ] Fix authentication issues
- [ ] Fix data mapping issues
- [ ] Fix error handling
- [ ] Optimize API calls (reduce redundant calls)

**Deliverables:**
- ✅ Advanced features working
- ✅ API issues resolved
- ✅ Performance optimized

---

### Day 7 (18 พ.ย.) - QA & Retrospective

#### QA Smoke Test
- [ ] Test all core workflows
  - [ ] Login → Dashboard → Logout
  - [ ] Create Incident → Upload Image → Assign
  - [ ] Create Task → Accept → Submit Survey
  - [ ] Create Report → Submit → Review
- [ ] Test RBAC for all roles
- [ ] Test error scenarios
- [ ] Test edge cases
- [ ] Document bugs found

#### Sprint 22 Retrospective
- [ ] What went well
- [ ] What can be improved
- [ ] Blockers encountered
- [ ] Action items for Sprint 23
- [ ] Team feedback

**Deliverables:**
- ✅ QA test report
- ✅ Bug list (prioritized)
- ✅ Retrospective document
- ✅ Sprint 23 planning

---

## 📊 Sprint 22 Success Criteria

Sprint 22 ถือว่าสำเร็จเมื่อ:

- [ ] ✅ ทุก Core Pages ทำงานได้
- [ ] ✅ CRUD operations ครบถ้วน
- [ ] ✅ Image upload ใช้งานได้
- [ ] ✅ RBAC ทำงานถูกต้อง
- [ ] ✅ No P0/P1 bugs
- [ ] ✅ Frontend Debug Log อัปเดตทุกวัน
- [ ] ✅ QA sign-off

---

## 📆 Sprint 23 (Week 2): Notification Module & Testing

**วันที่:** 19-25 พฤศจิกายน 2025  
**Focus:** Notification Module Implementation และ Unit Testing  
**Owner:** ทีม w + Dev Team

### Day 8-9 (19-20 พ.ย.) - Notification Module

#### Prisma Schema & Migration
- [ ] Create Notification models
  - [ ] `Notification` model
  - [ ] `UserNotification` model
  - [ ] `NotificationType` enum
  - [ ] `NotificationPriority` enum
- [ ] Create migration file
- [ ] Run migration on dev database
- [ ] Test migration rollback
- [ ] Seed notification data

#### Backend Implementation
- [ ] NotificationService
  - [ ] `create()` - สร้าง notification
  - [ ] `findAll()` - ดึง notifications ของ user
  - [ ] `markAsRead()` - ทำเครื่องหมายว่าอ่านแล้ว
  - [ ] `delete()` - ลบ notification
- [ ] NotificationController
  - [ ] `GET /api/notifications` - ดึงรายการ
  - [ ] `PATCH /api/notifications/:id/read` - ทำเครื่องหมาย
  - [ ] `DELETE /api/notifications/:id` - ลบ

<details>
<summary>📋 Notification Schema (คลิกเพื่อดู)</summary>

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
</details>

**Deliverables:**
- ✅ Notification Module functional
- ✅ API endpoints tested
- ✅ Database migration successful

---

### Day 10-11 (21-22 พ.ย.) - Unit Testing (Backend)

#### Test Infrastructure Setup
- [ ] Configure Jest
- [ ] Setup test database
- [ ] Create test utilities
- [ ] Configure coverage reporting

#### Module Testing (Target: 50% Coverage)
- [ ] **Auth Module** (90%)
  - [ ] auth.service.spec.ts
  - [ ] auth.controller.spec.ts
  - [ ] jwt.strategy.spec.ts
- [ ] **Users Module** (85%)
  - [ ] users.service.spec.ts
  - [ ] users.controller.spec.ts
- [ ] **Tasks Module** (80%)
  - [ ] tasks.service.spec.ts
  - [ ] tasks.controller.spec.ts

**Test Coverage Goals:**
```
Auth Module:    ████████████████████ 90%
Users Module:   ███████████████████░ 85%
Tasks Module:   ████████████████░░░░ 80%
Overall:        ██████████░░░░░░░░░░ 50%
```

**Deliverables:**
- ✅ Test infrastructure ready
- ✅ 50% backend coverage
- ✅ Coverage report

---

### Day 12-13 (23-24 พ.ย.) - Unit Testing (Frontend)

#### Test Infrastructure Setup
- [ ] Configure Vitest
- [ ] Setup React Testing Library
- [ ] Create test utilities
- [ ] Configure coverage reporting

#### Page Testing (Target: 30% Coverage)
- [ ] **LoginPage** (90%)
  - [ ] Render test
  - [ ] Form validation
  - [ ] API call test
  - [ ] Error handling
- [ ] **Dashboard** (80%)
  - [ ] Render test
  - [ ] Data fetching
  - [ ] Chart rendering
- [ ] **MyTasksPage** (80%)
  - [ ] Render test
  - [ ] Task list display
  - [ ] Accept task function

**Deliverables:**
- ✅ Test infrastructure ready
- ✅ 30% frontend coverage
- ✅ Coverage report

---

### Day 14 (25 พ.ย.) - CI/CD Pipeline (Staging)

#### GitHub Actions Setup
- [ ] Create workflow files
  - [ ] `.github/workflows/backend-ci.yml`
  - [ ] `.github/workflows/frontend-ci.yml`
- [ ] Configure jobs
  - [ ] Lint
  - [ ] Test
  - [ ] Build
  - [ ] Deploy (staging)
- [ ] Configure secrets
- [ ] Test workflows

#### Staging Environment
- [ ] Setup staging server
- [ ] Configure environment variables
- [ ] Deploy backend to staging
- [ ] Deploy frontend to staging
- [ ] Test staging deployment

**Deliverables:**
- ✅ CI/CD pipeline functional
- ✅ Staging environment ready
- ✅ Automated deployment working

---

## 📊 Sprint 23 Success Criteria

Sprint 23 ถือว่าสำเร็จเมื่อ:

- [ ] ✅ Notification Module ทำงานได้
- [ ] ✅ Backend test coverage ≥ 50%
- [ ] ✅ Frontend test coverage ≥ 30%
- [ ] ✅ CI/CD pipeline functional
- [ ] ✅ Staging environment stable
- [ ] ✅ No P0/P1 bugs

---

## 🎯 Week 1-2 Milestones

| Milestone | Date | Status | Owner |
|-----------|------|--------|-------|
| Core Pages Functional | Day 7 | ⏳ | Frontend + w |
| CRUD Operations Complete | Day 7 | ⏳ | Frontend + w |
| Notification Module Ready | Day 9 | ⏳ | w |
| Test Coverage 50% (BE) | Day 11 | ⏳ | Dev Team |
| Test Coverage 30% (FE) | Day 13 | ⏳ | Frontend |
| CI/CD Pipeline Live | Day 14 | ⏳ | DevOps + w |

---

## 🚨 Risk Management (Week 1-2)

### Identified Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Frontend Integration Delays | 🔴 High | 🟡 Medium | Daily standup, clear priorities |
| Image Upload Issues | 🟡 Medium | 🟢 Low | Use `images` field, test early |
| Notification Schema Conflicts | 🟡 Medium | 🟡 Medium | Review schema, test migration |
| Test Coverage Target Miss | 🔴 High | 🟡 Medium | Start early, focus on critical paths |
| CI/CD Setup Complexity | 🟡 Medium | 🟢 Low | Use templates, test incrementally |

### Contingency Plans

<details>
<summary>🧨 Prisma Migration Fail</summary>

**แผนสำรอง:**
1. Database snapshot ก่อน migrate
2. Test migration บน dev database ก่อน
3. เตรียม rollback script
4. Backup data ก่อน production migration
</details>

<details>
<summary>🔐 OAuth/Auth Delay</summary>

**แผนสำรอง:**
1. ใช้ JWT authentication ปัจจุบันต่อ
2. Mock OAuth server สำหรับ testing
3. เตรียม Auth0 integration (optional)
</details>

<details>
<summary>💻 Dev Environment Issues</summary>

**แผนสำรอง:**
1. ใช้ VM กลางสำหรับ Dev Fast-Track
2. Docker containers สำหรับ consistent environment
3. Cloud development environment (GitHub Codespaces)
</details>

---

## 📝 Daily Standup Format

### Template
```markdown
## Daily Standup - [DATE]

### Yesterday
- ✅ Completed: [Task]
- 🔄 In Progress: [Task] - X%

### Today
- 🎯 Plan: [Task]
- 🔴 Priority: [Critical Item]

### Blockers
- ⚠️ [Issue] - Need help from [Team/Person]

### Metrics
- Frontend Debug Log: Updated ✅/❌
- Test Coverage: X%
- Bugs Found: X (P0: X, P1: X)
- Bugs Fixed: X
```

---

## 📚 Documentation Updates

### Required Documents (Week 1-2)

- [x] SA-CHECKLIST.md
- [x] TECHNICAL-ROADMAP-30-DAYS.md
- [ ] FRONTEND-DEBUG-LOG.md (daily updates)
- [ ] SPRINT-22-RETROSPECTIVE.md
- [ ] NOTIFICATION-MODULE-SPEC.md
- [ ] TEST-COVERAGE-REPORT.md
- [ ] CI-CD-SETUP-GUIDE.md

---

## 🎓 Team Collaboration

### Communication Channels

| Channel | Purpose | Frequency |
|---------|---------|-----------|
| Daily Standup | Progress updates | ทุกวัน 9:00 |
| Slack #guardian-route | Quick questions | Real-time |
| GitHub Issues | Bug tracking | As needed |
| GitHub PRs | Code review | As needed |
| Weekly Review | Sprint review | ทุกศุกร์ 16:00 |

### Code Review Guidelines

- ✅ All PRs require 1 approval
- ✅ Run tests before PR
- ✅ Update documentation
- ✅ Follow code style guide
- ✅ Add meaningful commit messages

---

**รายงานจาก w**  
**เอกสาร:** TECHNICAL-ROADMAP-30-DAYS.md (Week 1-2)  
**สถานะ:** ✅ พร้อมใช้งาน  
**ขั้นตอนถัดไป:** สร้าง TECHNICAL-ROADMAP-WEEK-3-4.md
