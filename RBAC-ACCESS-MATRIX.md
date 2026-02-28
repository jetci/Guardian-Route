# RBAC Access Matrix
**Guardian Route Dashboard - Role-Based Access Control**

---

## 📊 Role Hierarchy

```
ADMIN (Highest)
  └── EXECUTIVE
      └── SUPERVISOR
          └── FIELD_OFFICER (Lowest)
```

---

## 👥 Role Definitions

| Role | Description | Primary Responsibilities |
|------|-------------|-------------------------|
| **ADMIN** | System Administrator | Full system access, user management, system configuration |
| **EXECUTIVE** | Executive/Management | Reporting, oversight, high-level decision making |
| **SUPERVISOR** | Field Supervisor | Incident management, task assignment, team coordination |
| **FIELD_OFFICER** | Field Officer | On-site operations, task execution, data collection |

---

## 🔐 API Endpoint Access Matrix

### Authentication (`/auth`)

| Endpoint | Method | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER | Public |
|----------|--------|-------|-----------|------------|---------------|--------|
| `/auth/register` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/register-by-admin` | POST | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/auth/login` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/refresh` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/auth/logout` | POST | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/auth/me` | GET | ✅ | ✅ | ✅ | ✅ | ❌ |
| `/auth/verify` | POST | ✅ | ✅ | ✅ | ✅ | ✅ |

---

### Users (`/users`)

| Endpoint | Method | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER | Notes |
|----------|--------|-------|-----------|------------|---------------|-------|
| `/users` | POST | ✅ | ❌ | ❌ | ❌ | Create user |
| `/users` | GET | ✅ | ❌ | ✅ | ❌ | List all users |
| `/users/:id` | GET | ✅ | ✅ | ✅ | ✅ | Get user by ID |
| `/users/:id` | PATCH | ✅ | ❌ | ❌ | ❌ | Update user |
| `/users/:id` | DELETE | ✅ | ❌ | ❌ | ❌ | Deactivate user |

---

### Incidents (`/incidents`)

| Endpoint | Method | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER | Notes |
|----------|--------|-------|-----------|------------|---------------|-------|
| `/incidents` | POST | ✅ | ✅ | ✅ | ✅ | Create incident |
| `/incidents` | GET | ✅ | ✅ | ✅ | ✅ | List all incidents |
| `/incidents/my` | GET | ✅ | ✅ | ✅ | ✅ | My incidents |
| `/incidents/unassigned` | GET | ✅ | ✅ | ✅ | ❌ | Unassigned only |
| `/incidents/:id` | GET | ✅ | ✅ | ✅ | ✅ | Get incident |
| `/incidents/:id` | PATCH | ✅ | ✅ | ✅ | ✅ | Update incident |
| `/incidents/:id/assign` | PATCH | ✅ | ✅ | ✅ | ❌ | Assign to officer |
| `/incidents/:id/review` | PATCH | ✅ | ✅ | ✅ | ❌ | Review incident |
| `/incidents/:id` | DELETE | ✅ | ❌ | ❌ | ❌ | Delete incident |

---

### Tasks (`/tasks`)

| Endpoint | Method | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER | Notes |
|----------|--------|-------|-----------|------------|---------------|-------|
| `/tasks` | POST | ✅ | ✅ | ✅ | ❌ | Create task |
| `/tasks` | GET | ✅ | ✅ | ✅ | ✅ | List all tasks |
| `/tasks/my-tasks` | GET | ✅ | ✅ | ✅ | ✅ | My assigned tasks |
| `/tasks/statistics` | GET | ✅ | ✅ | ✅ | ✅ | Task statistics |
| `/tasks/:id` | GET | ✅ | ✅ | ✅ | ✅ | Get task |
| `/tasks/:id/accept` | POST | ✅ | ✅ | ❌ | ✅ | Accept task |
| `/tasks/:id/survey` | POST | ✅ | ✅ | ❌ | ✅ | Submit survey data |
| `/tasks/:id` | PATCH | ✅ | ✅ | ✅ | ✅ | Update task |
| `/tasks/:id` | DELETE | ✅ | ❌ | ❌ | ❌ | Delete task |

---

### Survey Templates (`/survey-templates`)

| Endpoint | Method | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER | Notes |
|----------|--------|-------|-----------|------------|---------------|-------|
| `/survey-templates` | POST | ✅ | ❌ | ✅ | ❌ | Create template |
| `/survey-templates` | GET | ✅ | ❌ | ✅ | ✅ | List templates |
| `/survey-templates/:id` | GET | ✅ | ❌ | ✅ | ✅ | Get template |
| `/survey-templates/:id` | PATCH | ✅ | ❌ | ✅ | ❌ | Update template |
| `/survey-templates/:id` | DELETE | ✅ | ❌ | ❌ | ❌ | Delete template |

---

### Surveys (`/surveys`)

| Endpoint | Method | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER | Notes |
|----------|--------|-------|-----------|------------|---------------|-------|
| `/surveys` | POST | ✅ | ❌ | ✅ | ❌ | Create survey |
| `/surveys/incident/:incidentId` | GET | ✅ | ❌ | ✅ | ✅ | Surveys by incident |
| `/surveys/:id` | GET | ✅ | ❌ | ✅ | ✅ | Get survey |
| `/surveys/:surveyId/response` | POST | ✅ | ✅ | ✅ | ✅ | Submit response |
| `/surveys/:surveyId/responses` | GET | ✅ | ❌ | ✅ | ❌ | View responses |
| `/surveys/:surveyId/complete` | PATCH | ✅ | ❌ | ✅ | ❌ | Mark complete |

---

### Admin (`/api/admin`)

| Endpoint | Method | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER | Notes |
|----------|--------|-------|-----------|------------|---------------|-------|
| `/api/admin/users` | POST | ✅ | ❌ | ❌ | ❌ | Create user |
| `/api/admin/users` | GET | ✅ | ❌ | ❌ | ❌ | List all users |
| `/api/admin/users/:id` | GET | ✅ | ❌ | ❌ | ❌ | Get user |
| `/api/admin/users/:id` | PATCH | ✅ | ❌ | ❌ | ❌ | Update user |
| `/api/admin/users/:id` | DELETE | ✅ | ❌ | ❌ | ❌ | Delete user |
| `/api/admin/users/:id/suspend` | PATCH | ✅ | ❌ | ❌ | ❌ | Suspend user |
| `/api/admin/users/:id/activate` | PATCH | ✅ | ❌ | ❌ | ❌ | Activate user |
| `/api/admin/geojson` | POST | ✅ | ❌ | ❌ | ❌ | Upload GeoJSON |
| `/api/admin/geojson` | GET | ✅ | ❌ | ❌ | ❌ | List GeoJSON |
| `/api/admin/settings` | GET | ✅ | ❌ | ❌ | ❌ | Get settings |
| `/api/admin/settings` | PATCH | ✅ | ❌ | ❌ | ❌ | Update settings |

---

## 📋 Permission Summary by Role

### 🔴 ADMIN (Full Access)
**Can do everything:**
- ✅ All user management (create, update, delete, suspend)
- ✅ All incident operations
- ✅ All task operations
- ✅ All survey operations
- ✅ System configuration
- ✅ GeoJSON management
- ✅ Audit logs access

**Primary Use Cases:**
- System administration
- User account management
- System configuration
- Emergency overrides

---

### 🟠 EXECUTIVE (Reporting & Oversight)
**Can:**
- ✅ View all incidents
- ✅ View unassigned incidents
- ✅ Assign incidents
- ✅ Review incidents
- ✅ Create tasks
- ✅ Submit survey responses
- ✅ View reports

**Cannot:**
- ❌ User management
- ❌ Delete incidents/tasks
- ❌ Create survey templates
- ❌ System configuration

**Primary Use Cases:**
- High-level oversight
- Report generation
- Strategic decision making
- Resource allocation

---

### 🟡 SUPERVISOR (Team Management)
**Can:**
- ✅ View all users (limited)
- ✅ View all incidents
- ✅ View unassigned incidents
- ✅ Assign incidents to field officers
- ✅ Review incidents
- ✅ Create and assign tasks
- ✅ Create survey templates
- ✅ Create surveys
- ✅ View survey responses
- ✅ Mark surveys complete

**Cannot:**
- ❌ Create/delete users
- ❌ Delete incidents
- ❌ Delete tasks
- ❌ System configuration
- ❌ Accept tasks (not field work)
- ❌ Submit field surveys

**Primary Use Cases:**
- Incident coordination
- Task assignment
- Team supervision
- Survey management
- Quality control

---

### 🟢 FIELD_OFFICER (Field Operations)
**Can:**
- ✅ Create incidents
- ✅ View incidents
- ✅ Update own incidents
- ✅ View assigned tasks
- ✅ Accept tasks
- ✅ Submit field survey data
- ✅ View survey templates
- ✅ Submit survey responses

**Cannot:**
- ❌ User management
- ❌ Assign incidents
- ❌ Create tasks
- ❌ Delete anything
- ❌ Create survey templates
- ❌ View other users' data (restricted)

**Primary Use Cases:**
- Field data collection
- Incident reporting
- Task execution
- Survey submissions
- On-site operations

---

## 🔒 Security Implementation

### Guards Used
1. **JwtAuthGuard** - Validates JWT token
2. **RolesGuard** - Checks user role permissions

### Decorators
- `@Roles(Role.ADMIN)` - Restrict to ADMIN only
- `@Roles(Role.SUPERVISOR, Role.ADMIN)` - Multiple roles allowed
- `@UseGuards(JwtAuthGuard, RolesGuard)` - Apply both guards

### Example Implementation
```typescript
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  
  @Post()
  @Roles(Role.SUPERVISOR, Role.EXECUTIVE, Role.ADMIN)
  create(@Body() dto: CreateTaskDto) {
    // Only SUPERVISOR, EXECUTIVE, ADMIN can create tasks
  }
  
  @Post(':id/accept')
  @Roles(Role.FIELD_OFFICER, Role.SUPERVISOR, Role.ADMIN)
  acceptTask(@Param('id') id: string) {
    // Only FIELD_OFFICER, SUPERVISOR, ADMIN can accept tasks
  }
}
```

---

## 📊 Access Level Comparison

| Feature | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER |
|---------|-------|-----------|------------|---------------|
| **User Management** | Full | None | View only | None |
| **Incident Creation** | ✅ | ✅ | ✅ | ✅ |
| **Incident Assignment** | ✅ | ✅ | ✅ | ❌ |
| **Task Creation** | ✅ | ✅ | ✅ | ❌ |
| **Task Execution** | ✅ | ✅ | ✅ | ✅ |
| **Survey Template** | ✅ | ❌ | ✅ | View only |
| **Survey Response** | ✅ | ✅ | ✅ | ✅ |
| **Report Generation** | ✅ | ✅ | ✅ | ❌ |
| **System Config** | ✅ | ❌ | ❌ | ❌ |
| **GeoJSON Upload** | ✅ | ❌ | ❌ | ❌ |
| **Delete Operations** | ✅ | ❌ | ❌ | ❌ |

---

## 🎯 Recommended Workflows

### Incident Response Workflow
1. **FIELD_OFFICER** - Reports incident in the field
2. **SUPERVISOR** - Reviews and assigns to appropriate officer
3. **FIELD_OFFICER** - Accepts task and collects data
4. **SUPERVISOR** - Reviews completed work
5. **EXECUTIVE** - Reviews reports and makes decisions
6. **ADMIN** - System oversight and configuration

### Survey Workflow
1. **SUPERVISOR/ADMIN** - Creates survey template
2. **SUPERVISOR** - Creates survey instance for incident
3. **FIELD_OFFICER** - Submits survey responses
4. **SUPERVISOR** - Reviews responses and marks complete
5. **EXECUTIVE** - Views aggregated data

---

## 📝 Notes

### Test Accounts
```
ADMIN:         admin@obtwiang.go.th / password123
EXECUTIVE:     executive@obtwiang.go.th / password123
SUPERVISOR:    supervisor@obtwiang.go.th / password123
FIELD_OFFICER: field@obtwiang.go.th / password123
```

### JWT Configuration
- Access Token: 8 hours
- Refresh Token: 7 days
- CORS Origin: http://localhost:5173

### Security Best Practices
- ✅ All passwords bcrypt hashed (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Role-based guards on all protected routes
- ✅ Activity logging for audit trail
- ✅ Separate audit logs for admin actions

---

**Last Updated:** 2025-11-12 12:45 UTC+7  
**Status:** Complete - Ready for Phase 2 Testing
