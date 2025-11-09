# Access Control Matrix

**Guardian Route - Role-based Access Control (RBAC)**  
**Version:** 1.0.0  
**Last Updated:** November 9, 2025

---

## 🎯 Overview

Access Control Matrix กำหนดสิทธิ์การเข้าถึงของแต่ละ Role ในระบบ Guardian Route โดยใช้ Role Hierarchy และ Permission-based Access Control

---

## 📊 Role Hierarchy

```
ADMIN (Level 4) - สูงสุด
  └── EXECUTIVE (Level 3)
      └── SUPERVISOR (Level 2)
          └── FIELD_OFFICER (Level 1) - ต่ำสุด
```

**หลักการ:**
- Role ที่สูงกว่าสามารถทำทุกอย่างที่ role ต่ำกว่าทำได้
- ADMIN มีสิทธิ์เต็มทุกอย่าง
- FIELD_OFFICER มีสิทธิ์จำกัดเฉพาะงานของตนเอง

---

## 🔐 Permissions Matrix

### User Management

| Permission | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER |
|------------|-------|-----------|------------|---------------|
| CREATE_USER | ✅ | ❌ | ❌ | ❌ |
| READ_USER | ✅ | ✅ | ✅ | ❌ |
| UPDATE_USER | ✅ | ❌ | ❌ | ❌ |
| DELETE_USER | ✅ | ❌ | ❌ | ❌ |
| MANAGE_ROLES | ✅ | ❌ | ❌ | ❌ |

---

### Incident Management

| Permission | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER |
|------------|-------|-----------|------------|---------------|
| CREATE_INCIDENT | ✅ | ✅ | ✅ | ✅ |
| READ_INCIDENT | ✅ | ✅ | ✅ | ✅ (own) |
| UPDATE_INCIDENT | ✅ | ✅ | ✅ | ✅ (own) |
| DELETE_INCIDENT | ✅ | ✅ | ❌ | ❌ |
| ASSIGN_INCIDENT | ✅ | ✅ | ❌ | ❌ |

---

### Task Management

| Permission | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER |
|------------|-------|-----------|------------|---------------|
| CREATE_TASK | ✅ | ✅ | ✅ | ❌ |
| READ_TASK | ✅ | ✅ | ✅ | ✅ (assigned) |
| UPDATE_TASK | ✅ | ✅ | ✅ | ✅ (assigned) |
| DELETE_TASK | ✅ | ✅ | ❌ | ❌ |
| ASSIGN_TASK | ✅ | ✅ | ✅ | ❌ |

---

### Report Management

| Permission | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER |
|------------|-------|-----------|------------|---------------|
| CREATE_REPORT | ✅ | ✅ | ✅ | ✅ |
| READ_REPORT | ✅ | ✅ | ✅ | ✅ (own) |
| UPDATE_REPORT | ✅ | ✅ | ✅ | ❌ |
| DELETE_REPORT | ✅ | ✅ | ❌ | ❌ |
| APPROVE_REPORT | ✅ | ✅ | ✅ | ❌ |

---

### Analytics

| Permission | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER |
|------------|-------|-----------|------------|---------------|
| VIEW_ANALYTICS | ✅ | ✅ | ✅ | ✅ (own) |
| VIEW_TEAM_ANALYTICS | ✅ | ✅ | ✅ | ❌ |
| VIEW_ALL_ANALYTICS | ✅ | ✅ | ❌ | ❌ |

---

### Admin Functions

| Permission | ADMIN | EXECUTIVE | SUPERVISOR | FIELD_OFFICER |
|------------|-------|-----------|------------|---------------|
| MANAGE_SYSTEM_SETTINGS | ✅ | ❌ | ❌ | ❌ |
| VIEW_AUDIT_LOGS | ✅ | ❌ | ❌ | ❌ |
| MANAGE_GEOJSON | ✅ | ❌ | ❌ | ❌ |
| MANAGE_CUSTOM_LAYERS | ✅ | ❌ | ❌ | ❌ |

---

## 🛡️ Protected Endpoints

### Authentication Endpoints (Public)

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| /api/auth/register | POST | Public | ลงทะเบียนผู้ใช้ใหม่ |
| /api/auth/login | POST | Public | เข้าสู่ระบบ |
| /api/auth/refresh | POST | Public | Refresh token |
| /api/auth/verify | POST | Public | ตรวจสอบ token |
| /api/auth/register-by-admin | POST | ADMIN | ลงทะเบียนโดย ADMIN |
| /api/auth/logout | POST | Authenticated | ออกจากระบบ |
| /api/auth/me | GET | Authenticated | ดูโปรไฟล์ |

---

### User Management Endpoints

| Endpoint | Method | Required Role | Required Permission |
|----------|--------|---------------|---------------------|
| POST /api/admin/users | POST | ADMIN | CREATE_USER |
| GET /api/admin/users | GET | ADMIN | READ_USER |
| GET /api/admin/users/:id | GET | ADMIN | READ_USER |
| PATCH /api/admin/users/:id | PATCH | ADMIN | UPDATE_USER |
| DELETE /api/admin/users/:id | DELETE | ADMIN | DELETE_USER |
| PATCH /api/admin/users/:id/role | PATCH | ADMIN | MANAGE_ROLES |
| PATCH /api/admin/users/:id/toggle-status | PATCH | ADMIN | UPDATE_USER |

---

### Incident Management Endpoints

| Endpoint | Method | Required Role | Required Permission |
|----------|--------|---------------|---------------------|
| POST /api/incidents | POST | All | CREATE_INCIDENT |
| GET /api/incidents | GET | All | READ_INCIDENT |
| GET /api/incidents/:id | GET | All | READ_INCIDENT |
| PATCH /api/incidents/:id | PATCH | SUPERVISOR+ | UPDATE_INCIDENT |
| DELETE /api/incidents/:id | DELETE | EXECUTIVE+ | DELETE_INCIDENT |
| POST /api/incidents/:id/assign | POST | EXECUTIVE+ | ASSIGN_INCIDENT |

---

### Task Management Endpoints

| Endpoint | Method | Required Role | Required Permission |
|----------|--------|---------------|---------------------|
| POST /api/tasks | POST | SUPERVISOR+ | CREATE_TASK |
| GET /api/tasks | GET | All | READ_TASK |
| GET /api/tasks/:id | GET | All | READ_TASK |
| PATCH /api/tasks/:id | PATCH | SUPERVISOR+ | UPDATE_TASK |
| DELETE /api/tasks/:id | DELETE | EXECUTIVE+ | DELETE_TASK |
| POST /api/tasks/:id/assign | POST | SUPERVISOR+ | ASSIGN_TASK |

---

### Report Management Endpoints

| Endpoint | Method | Required Role | Required Permission |
|----------|--------|---------------|---------------------|
| POST /api/reports | POST | All | CREATE_REPORT |
| GET /api/reports | GET | All | READ_REPORT |
| GET /api/reports/:id | GET | All | READ_REPORT |
| PATCH /api/reports/:id | PATCH | SUPERVISOR+ | UPDATE_REPORT |
| DELETE /api/reports/:id | DELETE | EXECUTIVE+ | DELETE_REPORT |
| POST /api/reports/:id/approve | POST | SUPERVISOR+ | APPROVE_REPORT |

---

### Analytics Endpoints

| Endpoint | Method | Required Role | Required Permission |
|----------|--------|---------------|---------------------|
| GET /api/analytics/my | GET | All | VIEW_ANALYTICS |
| GET /api/analytics/team | GET | SUPERVISOR+ | VIEW_TEAM_ANALYTICS |
| GET /api/analytics/all | GET | EXECUTIVE+ | VIEW_ALL_ANALYTICS |

---

### Admin Endpoints

| Endpoint | Method | Required Role | Required Permission |
|----------|--------|---------------|---------------------|
| GET /api/admin/settings | GET | ADMIN | MANAGE_SYSTEM_SETTINGS |
| PATCH /api/admin/settings | PATCH | ADMIN | MANAGE_SYSTEM_SETTINGS |
| GET /api/admin/audit-logs | GET | ADMIN | VIEW_AUDIT_LOGS |
| POST /api/admin/geojson | POST | ADMIN | MANAGE_GEOJSON |
| POST /api/admin/layers | POST | ADMIN | MANAGE_CUSTOM_LAYERS |

---

## 💡 Usage Examples

### Example 1: Role-based Protection

```typescript
@Controller('incidents')
export class IncidentsController {
  // All authenticated users can create incidents
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateIncidentDto) {
    // ...
  }

  // Only EXECUTIVE and ADMIN can delete
  @Delete(':id')
  @UseGuards(JwtAuthGuard, EnhancedRolesGuard)
  @Roles(Role.EXECUTIVE)
  async delete(@Param('id') id: string) {
    // ...
  }
}
```

---

### Example 2: Permission-based Protection

```typescript
@Controller('users')
export class UsersController {
  // Require specific permission
  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.CREATE_USER)
  async create(@Body() dto: CreateUserDto) {
    // ...
  }

  // Require multiple permissions
  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions(Permission.UPDATE_USER, Permission.MANAGE_ROLES)
  async changeRole(@Param('id') id: string, @Body() dto: ChangeRoleDto) {
    // ...
  }
}
```

---

### Example 3: Resource Ownership Protection

```typescript
@Controller('profile')
export class ProfileController {
  // Users can only update their own profile
  // ADMIN and EXECUTIVE can update any profile
  @Patch(':userId')
  @UseGuards(JwtAuthGuard, ResourceOwnerGuard)
  @CheckOwnership('userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    // ...
  }
}
```

---

### Example 4: Combined Guards

```typescript
@Controller('reports')
export class ReportsController {
  // Require role AND permission
  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, EnhancedRolesGuard, PermissionsGuard)
  @Roles(Role.SUPERVISOR)
  @RequirePermissions(Permission.APPROVE_REPORT)
  async approve(@Param('id') id: string) {
    // ...
  }
}
```

---

## 🔍 Access Control Rules

### Rule 1: Role Hierarchy
- Higher roles inherit all permissions from lower roles
- ADMIN can do everything
- EXECUTIVE can do everything except ADMIN functions
- SUPERVISOR can manage team but not system
- FIELD_OFFICER can only manage own resources

### Rule 2: Resource Ownership
- Users can always access their own resources
- Higher roles can access lower roles' resources
- ADMIN and EXECUTIVE can access all resources

### Rule 3: Permission Inheritance
- Roles inherit permissions based on hierarchy
- Custom permissions can be added per role
- Permissions are checked before role hierarchy

### Rule 4: Active Status
- Only active users can access protected endpoints
- Inactive users are denied even with valid tokens
- ADMIN can activate/deactivate users

---

## 🚨 Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token. Please log in again."
}
```

### 403 Forbidden (Role)
```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: ADMIN. Your role: FIELD_OFFICER"
}
```

### 403 Forbidden (Permission)
```json
{
  "statusCode": 403,
  "message": "Access denied. Required permissions: CREATE_USER"
}
```

### 403 Forbidden (Ownership)
```json
{
  "statusCode": 403,
  "message": "Access denied. You can only access your own resources."
}
```

### 403 Forbidden (Inactive)
```json
{
  "statusCode": 403,
  "message": "User account is inactive"
}
```

---

## 📚 References

**Configuration Files:**
- `/backend/src/auth/config/role-hierarchy.config.ts`
- `/backend/src/auth/guards/permissions.guard.ts`

**Guards:**
- `JwtAuthGuard` - Authentication
- `EnhancedRolesGuard` - Role hierarchy
- `PermissionsGuard` - Fine-grained permissions
- `ResourceOwnerGuard` - Ownership validation

**Decorators:**
- `@Public()` - Make endpoint public
- `@Roles(...roles)` - Require specific roles
- `@RequirePermissions(...permissions)` - Require permissions
- `@CheckOwnership(param)` - Check resource ownership
- `@CurrentUser()` - Get current user

---

**© 2025 Guardian Route - Access Control Matrix v1.0.0**
