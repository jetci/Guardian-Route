# RBAC Implementation Guide

**Guardian Route - Role-Based Access Control (RBAC) System**  
**Version:** 1.0.0  
**Sprint:** 3 Week 3  
**Last Updated:** November 9, 2025

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Backend Implementation](#backend-implementation)
4. [Frontend Implementation](#frontend-implementation)
5. [Usage Examples](#usage-examples)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

RBAC (Role-Based Access Control) System ของ Guardian Route เป็นระบบควบคุมการเข้าถึงที่ครอบคลุมและยืดหยุ่น รองรับทั้ง Role Hierarchy และ Permission-based Access Control

### Key Features

**Role Hierarchy:**
- 4 ระดับ: ADMIN > EXECUTIVE > SUPERVISOR > FIELD_OFFICER
- Role ที่สูงกว่าสามารถทำทุกอย่างที่ role ต่ำกว่าทำได้
- Automatic inheritance of permissions

**Permission-based Access:**
- 25 permissions แบ่งเป็น 6 categories
- Fine-grained access control
- Flexible permission assignment

**Resource Ownership:**
- Users can access their own resources
- Higher roles can access lower roles' resources
- ADMIN and EXECUTIVE can access all resources

**Security Features:**
- JWT authentication
- Token refresh mechanism
- Rate limiting
- Active status check
- Audit logging

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
├─────────────────────────────────────────────────────────────┤
│  Guards              │  Hooks              │  Error Handler │
│  - RoleGuard         │  - useHasRole       │  - handleApiError│
│  - PermissionGuard   │  - useHasPermission │  - showToast    │
│  - ConditionalRender │  - useIsOwner       │                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
├─────────────────────────────────────────────────────────────┤
│  Guards              │  Config             │  Decorators     │
│  - JwtAuthGuard      │  - RoleHierarchy    │  - @Roles       │
│  - EnhancedRolesGuard│  - Permissions      │  - @RequirePerms│
│  - PermissionsGuard  │                     │  - @CheckOwner  │
│  - ResourceOwnerGuard│                     │  - @Public      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
┌─────────────────────────────────────────────────────────────┐
│                        Database                             │
├─────────────────────────────────────────────────────────────┤
│  User Model          │  AuditLog Model     │                │
│  - id, email         │  - action           │                │
│  - role, isActive    │  - userId           │                │
│  - refreshToken      │  - timestamp        │                │
└─────────────────────────────────────────────────────────────┘
```

### Role Hierarchy

```
ADMIN (Level 4)
  ├── All Permissions (25)
  └── Can manage system settings
      │
      └── EXECUTIVE (Level 3)
          ├── 21 Permissions
          └── Can manage operations
              │
              └── SUPERVISOR (Level 2)
                  ├── 14 Permissions
                  └── Can manage team
                      │
                      └── FIELD_OFFICER (Level 1)
                          ├── 7 Permissions
                          └── Can manage own resources
```

---

## 🔧 Backend Implementation

### 1. Guards

#### JwtAuthGuard
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return user;
}
```

#### EnhancedRolesGuard
```typescript
@UseGuards(JwtAuthGuard, EnhancedRolesGuard)
@Roles(Role.SUPERVISOR)
@Get('team')
async getTeam() {
  // Only SUPERVISOR, EXECUTIVE, and ADMIN can access
}
```

#### PermissionsGuard
```typescript
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.CREATE_USER)
@Post('users')
async createUser(@Body() dto: CreateUserDto) {
  // Only users with CREATE_USER permission can access
}
```

#### ResourceOwnerGuard
```typescript
@UseGuards(JwtAuthGuard, ResourceOwnerGuard)
@CheckOwnership('userId')
@Patch('users/:userId/profile')
async updateProfile(
  @Param('userId') userId: string,
  @Body() dto: UpdateProfileDto,
) {
  // User can only update their own profile
  // ADMIN and EXECUTIVE can update any profile
}
```

### 2. Decorators

#### @Public()
```typescript
@Public()
@Post('auth/login')
async login(@Body() dto: LoginDto) {
  // Public endpoint, no authentication required
}
```

#### @Roles(...roles)
```typescript
@Roles(Role.ADMIN, Role.EXECUTIVE)
@Get('reports')
async getReports() {
  // Only ADMIN and EXECUTIVE can access
}
```

#### @RequirePermissions(...permissions)
```typescript
@RequirePermissions(Permission.APPROVE_REPORT, Permission.DELETE_REPORT)
@Post('reports/:id/approve')
async approveReport(@Param('id') id: string) {
  // Requires both permissions
}
```

#### @CheckOwnership(param)
```typescript
@CheckOwnership('incidentId')
@Patch('incidents/:incidentId')
async updateIncident(
  @Param('incidentId') incidentId: string,
  @Body() dto: UpdateIncidentDto,
) {
  // Check if user is the owner or has higher role
}
```

### 3. Role Hierarchy Configuration

```typescript
// backend/src/auth/config/role-hierarchy.config.ts
export const ROLE_HIERARCHY: Record<Role, RoleHierarchy> = {
  [Role.ADMIN]: {
    level: 4,
    inherits: [Role.EXECUTIVE, Role.SUPERVISOR, Role.FIELD_OFFICER],
  },
  [Role.EXECUTIVE]: {
    level: 3,
    inherits: [Role.SUPERVISOR, Role.FIELD_OFFICER],
  },
  [Role.SUPERVISOR]: {
    level: 2,
    inherits: [Role.FIELD_OFFICER],
  },
  [Role.FIELD_OFFICER]: {
    level: 1,
    inherits: [],
  },
};
```

### 4. Permissions Configuration

```typescript
// backend/src/auth/guards/permissions.guard.ts
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // All permissions
  [Role.EXECUTIVE]: [
    Permission.READ_USER,
    Permission.CREATE_INCIDENT,
    // ... 21 permissions total
  ],
  [Role.SUPERVISOR]: [
    Permission.READ_USER,
    Permission.CREATE_INCIDENT,
    // ... 14 permissions total
  ],
  [Role.FIELD_OFFICER]: [
    Permission.CREATE_INCIDENT,
    Permission.READ_INCIDENT,
    // ... 7 permissions total
  ],
};
```

---

## 🎨 Frontend Implementation

### 1. Guard Components

#### RoleGuard
```tsx
import { RoleGuard, Role } from '@/components/guards/RoleGuard';

// Only ADMIN can see this
<RoleGuard requiredRoles={[Role.ADMIN]}>
  <AdminPanel />
</RoleGuard>

// SUPERVISOR and above can see this
<RoleGuard requiredRoles={[Role.SUPERVISOR]}>
  <TeamDashboard />
</RoleGuard>

// Show fallback instead of redirect
<RoleGuard 
  requiredRoles={[Role.EXECUTIVE]} 
  showFallback
  fallback={<Text>คุณไม่มีสิทธิ์เข้าถึง</Text>}
>
  <ExecutiveReport />
</RoleGuard>
```

#### PermissionGuard
```tsx
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { Permission } from '@/hooks/useAuth';

// Require CREATE_USER permission
<PermissionGuard requiredPermissions={[Permission.CREATE_USER]}>
  <CreateUserButton />
</PermissionGuard>

// Require any of the permissions
<PermissionGuard 
  requiredPermissions={[
    Permission.UPDATE_INCIDENT,
    Permission.DELETE_INCIDENT
  ]}
  requireAll={false}
>
  <IncidentActions />
</PermissionGuard>
```

#### ConditionalRender
```tsx
import { ConditionalRender } from '@/components/guards/PermissionGuard';

// Conditionally render without redirect
<ConditionalRender permission={Permission.DELETE_USER}>
  <DeleteButton />
</ConditionalRender>
```

### 2. Custom Hooks

#### useHasRole
```tsx
import { useHasRole, useHasAnyRole } from '@/hooks/useAuth';
import { Role } from '@/components/guards/RoleGuard';

function MyComponent() {
  const isAdmin = useHasRole(Role.ADMIN);
  const canManageTeam = useHasAnyRole([Role.SUPERVISOR, Role.EXECUTIVE]);

  return (
    <div>
      {isAdmin && <AdminButton />}
      {canManageTeam && <TeamManagementButton />}
    </div>
  );
}
```

#### useHasPermission
```tsx
import { useHasPermission, useHasAnyPermission } from '@/hooks/useAuth';
import { Permission } from '@/hooks/useAuth';

function IncidentActions() {
  const canCreate = useHasPermission(Permission.CREATE_INCIDENT);
  const canDelete = useHasPermission(Permission.DELETE_INCIDENT);
  const canManage = useHasAnyPermission([
    Permission.UPDATE_INCIDENT,
    Permission.ASSIGN_INCIDENT,
  ]);

  return (
    <div>
      {canCreate && <CreateButton />}
      {canDelete && <DeleteButton />}
      {canManage && <ManageButton />}
    </div>
  );
}
```

#### useIsResourceOwner
```tsx
import { useIsResourceOwner, useCanAccessResource } from '@/hooks/useAuth';

function ProfileCard({ profile }) {
  const isOwner = useIsResourceOwner(profile.userId);
  const canAccess = useCanAccessResource(profile.userId);

  return (
    <div>
      {isOwner && <EditButton />}
      {canAccess && <ViewDetailsButton />}
    </div>
  );
}
```

### 3. Error Handling

```tsx
import { handleApiError, showSuccess } from '@/utils/errorHandler';

async function createUser(data) {
  try {
    await api.post('/admin/users', data);
    showSuccess('สร้างผู้ใช้สำเร็จ');
  } catch (error) {
    handleApiError(error); // Auto-show toast with appropriate message
  }
}
```

### 4. Token Management

Token management is handled automatically by API client:

```typescript
// frontend/src/api/client.ts
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Auto-refresh token
      // Queue requests during refresh
      // Retry original request
      // Redirect to login if refresh fails
    }
    return Promise.reject(error);
  },
);
```

---

## 💡 Usage Examples

### Example 1: Admin-only Endpoint

**Backend:**
```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, EnhancedRolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  @Get('users')
  async getUsers() {
    // Only ADMIN can access
  }
}
```

**Frontend:**
```tsx
<RoleGuard requiredRoles={[Role.ADMIN]}>
  <AdminDashboard />
</RoleGuard>
```

### Example 2: Permission-based Feature

**Backend:**
```typescript
@Post('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions(Permission.CREATE_USER)
async createUser(@Body() dto: CreateUserDto) {
  // Only users with CREATE_USER permission
}
```

**Frontend:**
```tsx
<PermissionGuard requiredPermissions={[Permission.CREATE_USER]}>
  <CreateUserButton />
</PermissionGuard>

// Or with hook
const canCreateUser = useHasPermission(Permission.CREATE_USER);
{canCreateUser && <CreateUserButton />}
```

### Example 3: Resource Ownership

**Backend:**
```typescript
@Patch('incidents/:id')
@UseGuards(JwtAuthGuard, ResourceOwnerGuard)
@CheckOwnership('reportedById')
async updateIncident(
  @Param('id') id: string,
  @Body() dto: UpdateIncidentDto,
  @CurrentUser() user: User,
) {
  // User can only update their own incidents
  // ADMIN and EXECUTIVE can update any incident
}
```

**Frontend:**
```tsx
const isOwner = useIsResourceOwner(incident.reportedById);
const canAccess = useCanAccessResource(incident.reportedById);

{canAccess && <EditButton />}
{isOwner && <DeleteButton />}
```

### Example 4: Combined Guards

**Backend:**
```typescript
@Post('reports/:id/approve')
@UseGuards(JwtAuthGuard, EnhancedRolesGuard, PermissionsGuard)
@Roles(Role.SUPERVISOR)
@RequirePermissions(Permission.APPROVE_REPORT)
async approveReport(@Param('id') id: string) {
  // Require both role AND permission
}
```

**Frontend:**
```tsx
const isSupervisor = useHasRole(Role.SUPERVISOR);
const canApprove = useHasPermission(Permission.APPROVE_REPORT);

{isSupervisor && canApprove && <ApproveButton />}
```

---

## 🧪 Testing

### Backend Unit Tests

Run tests:
```bash
cd backend
npm test

# Run specific test file
npm test enhanced-roles.guard.spec.ts

# Run with coverage
npm test -- --coverage
```

Test files:
- `enhanced-roles.guard.spec.ts` (14 tests)
- `permissions.guard.spec.ts` (16 tests)
- `resource-owner.guard.spec.ts` (14 tests)
- `role-hierarchy.config.spec.ts` (28 tests)

**Total:** 72 test cases

### Frontend Testing

```tsx
import { render, screen } from '@testing-library/react';
import { RoleGuard } from '@/components/guards/RoleGuard';

test('should show content for authorized user', () => {
  // Mock auth store with ADMIN role
  render(
    <RoleGuard requiredRoles={[Role.ADMIN]}>
      <div>Admin Content</div>
    </RoleGuard>
  );
  
  expect(screen.getByText('Admin Content')).toBeInTheDocument();
});
```

### Integration Testing

Test complete flow:
1. Login as different roles
2. Try accessing protected endpoints
3. Verify correct responses (200, 403)
4. Check error messages

---

## 🚀 Deployment

### 1. Database Migration

```bash
cd backend
npx prisma migrate deploy
```

### 2. Seed Default Users

```bash
cd backend
./scripts/seed-users.sh
```

Default users:
- admin@guardianroute.com (ADMIN)
- executive@guardianroute.com (EXECUTIVE)
- supervisor@guardianroute.com (SUPERVISOR)
- officer@guardianroute.com (FIELD_OFFICER)

Password for all: `Password123!`

### 3. Environment Variables

```env
# Backend
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=8h
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend
VITE_API_URL=https://api.guardianroute.com
```

### 4. Build & Deploy

**Backend:**
```bash
cd backend
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd frontend
npm run build
# Deploy dist/ to hosting
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. 401 Unauthorized
**Problem:** Token expired or invalid  
**Solution:** Check if token refresh is working, verify JWT_SECRET

#### 2. 403 Forbidden
**Problem:** User doesn't have required role/permission  
**Solution:** Check user role in database, verify role hierarchy

#### 3. Token not refreshing
**Problem:** Refresh token expired or invalid  
**Solution:** Check REFRESH_TOKEN_EXPIRES_IN, verify refresh endpoint

#### 4. Guards not working
**Problem:** Guards not applied to endpoints  
**Solution:** Verify @UseGuards() decorator, check guard order

### Debug Tips

**Backend:**
```typescript
// Add logging to guards
console.log('User role:', user.role);
console.log('Required roles:', requiredRoles);
console.log('Has access:', hasAccess);
```

**Frontend:**
```tsx
// Check auth state
const { user, accessToken } = useAuthStore();
console.log('User:', user);
console.log('Token:', accessToken);

// Check permissions
const permissions = useUserPermissions();
console.log('User permissions:', permissions);
```

### Performance Optimization

1. **Cache role hierarchy calculations**
2. **Use memoization for permission checks**
3. **Implement request caching**
4. **Optimize database queries**

---

## 📚 References

**Backend Files:**
- `/backend/src/auth/guards/` - Guard implementations
- `/backend/src/auth/config/` - Configuration files
- `/backend/src/auth/decorators/` - Decorator implementations

**Frontend Files:**
- `/frontend/src/components/guards/` - Guard components
- `/frontend/src/hooks/useAuth.ts` - Auth hooks
- `/frontend/src/utils/errorHandler.ts` - Error handling

**Documentation:**
- `ACCESS_CONTROL_MATRIX.md` - Detailed access control matrix
- `AUTHENTICATION_SYSTEM_GUIDE.md` - Authentication guide

---

## 📞 Support

**Issues:** https://github.com/jetci/Guardian-Route/issues  
**Documentation:** `/docs/`  
**Contact:** Guardian Route Development Team

---

**© 2025 Guardian Route - RBAC Implementation Guide v1.0.0**
