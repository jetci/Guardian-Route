# Frontend Integration & UX Enhancements Guide

## Overview

This guide covers the Frontend Integration and UX Enhancements implemented in Sprint 3 Week 4, including role-based guards, menu access control, role indicators, dynamic UI behavior, and role management interface.

**Version:** 1.0.0  
**Sprint:** 3 Week 4  
**Date:** November 2025

---

## Table of Contents

1. [Role-Protected Routes](#role-protected-routes)
2. [Navigation & Menu Access Control](#navigation--menu-access-control)
3. [Role Indicators & Badges](#role-indicators--badges)
4. [Dynamic UI Behavior](#dynamic-ui-behavior)
5. [Role Management Page](#role-management-page)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

---

## Role-Protected Routes

### RoleProtectedRoute Component

The `RoleProtectedRoute` component protects routes based on authentication and role requirements with hierarchy support.

**Features:**
- Authentication check (redirect to /login if not authenticated)
- Role hierarchy enforcement (ADMIN > EXECUTIVE > SUPERVISOR > FIELD_OFFICER)
- Multiple role support
- Custom redirect path

**Usage:**

```tsx
import { RoleProtectedRoute } from '../components/RoleProtectedRoute';
import { Role } from '../components/guards/RoleGuard';

// Only ADMIN can access
<Route
  path="/admin/dashboard"
  element={
    <RoleProtectedRoute requiredRoles={[Role.ADMIN]}>
      <AdminDashboardPage />
    </RoleProtectedRoute>
  }
/>

// SUPERVISOR and above (SUPERVISOR, EXECUTIVE, ADMIN)
<Route
  path="/supervisor"
  element={
    <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
      <SupervisorDashboard />
    </RoleProtectedRoute>
  }
/>

// All authenticated users
<Route
  path="/dashboard"
  element={
    <RoleProtectedRoute>
      <DashboardPage />
    </RoleProtectedRoute>
  }
/>
```

### Route Structure

**Total Routes:** 25 routes (23 protected + 2 public)

**ADMIN Only (3 routes):**
- /admin/dashboard
- /admin/audit-logs
- /admin/roles

**EXECUTIVE & Above (2 routes):**
- /executive-dashboard
- /analysis/overlay

**SUPERVISOR & Above (6 routes):**
- /supervisor
- /map
- /tasks
- /supervisor/survey-templates
- /supervisor/survey-templates/new
- /supervisor/survey-templates/edit/:id

**FIELD_OFFICER & Above (11 routes):**
- /dashboard
- /reports
- /reports/new
- /reports/:id
- /reports/:id/edit
- /reports/create-full/:taskId
- /survey/:surveyId/respond
- /incidents
- /incidents/report
- /my-tasks
- /tasks/:id

**Public (2 routes):**
- /login
- /unauthorized

---

## Navigation & Menu Access Control

### Navigation Component

The `Navigation` component provides role-based menu rendering with dynamic navigation links.

**Features:**
- Role-based menu items (show/hide based on role)
- Active link highlighting
- Responsive design (desktop/mobile)
- User menu with profile info
- Role badge display
- Logout functionality

**Menu Structure:**

**All Roles:**
- หน้าหลัก (Dashboard)
- เหตุการณ์ (Incidents)
- งานของฉัน (My Tasks)
- รายงาน (Reports)

**SUPERVISOR & Above:**
- จัดการทีม (Dropdown)
  - แดชบอร์ดหัวหน้างาน
  - แผนที่
  - จัดการงาน
  - แบบสำรวจ

**EXECUTIVE & Above:**
- ผู้บริหาร (Dropdown)
  - แดชบอร์ดผู้บริหาร
  - วิเคราะห์ข้อมูล

**ADMIN Only:**
- ผู้ดูแลระบบ (Dropdown, red colorScheme)
  - จัดการระบบ
  - จัดการบทบาทและสิทธิ์
  - บันทึกการตรวจสอบ

**User Menu (All Roles):**
- Profile info display
- Role badge
- โปรไฟล์
- ตั้งค่า
- ออกจากระบบ

### Layout Component

The `Layout` component wraps pages with consistent navigation.

**Usage:**

```tsx
import { Layout } from '../components/Layout';

function DashboardPage() {
  return (
    <Layout>
      <Container maxW="7xl" py={8}>
        {/* Page content */}
      </Container>
    </Layout>
  );
}
```

---

## Role Indicators & Badges

### RoleBadge Component

Display user role with color-coded badge and optional icon.

**Features:**
- 4 role colors (ADMIN: red, EXECUTIVE: purple, SUPERVISOR: blue, FIELD_OFFICER: green)
- 3 sizes (sm, md, lg)
- Icon support
- Tooltip with role description

**Usage:**

```tsx
import { RoleBadge } from '../components/RoleBadge';

// Default (medium size with icon and tooltip)
<RoleBadge role={user.role} />

// Small size without icon
<RoleBadge role={Role.ADMIN} size="sm" showIcon={false} />

// Large size without tooltip
<RoleBadge role={Role.EXECUTIVE} size="lg" showTooltip={false} />
```

**Role Properties:**

| Role | Label | Color | Icon | Description |
|------|-------|-------|------|-------------|
| ADMIN | ผู้ดูแลระบบ | red | FiShield | มีสิทธิ์เข้าถึงทุกฟังก์ชันในระบบ |
| EXECUTIVE | ผู้บริหาร | purple | FiStar | สามารถดูรายงานและวิเคราะห์ข้อมูลระดับองค์กร |
| SUPERVISOR | หัวหน้างาน | blue | FiUsers | สามารถจัดการทีมและมอบหมายงาน |
| FIELD_OFFICER | เจ้าหน้าที่ภาคสนาม | green | FiUser | สามารถรายงานเหตุการณ์และทำงานที่ได้รับมอบหมาย |

### PermissionIndicator Component

Visual indicator showing if user has specific permission(s).

**Features:**
- Lock/Unlock icons (green/red)
- Single or multiple permissions
- Tooltip with permission labels
- ViewPermissionIndicator variant (Eye/EyeOff icons)

**Usage:**

```tsx
import { PermissionIndicator, ViewPermissionIndicator } from '../components/PermissionIndicator';
import { Permission } from '../hooks/useAuth';

// Single permission
<PermissionIndicator permission={Permission.CREATE_USER} />

// Multiple permissions (any)
<PermissionIndicator 
  permission={[Permission.UPDATE_USER, Permission.DELETE_USER]}
  requireAll={false}
  label="สามารถจัดการผู้ใช้"
/>

// View permission indicator
<ViewPermissionIndicator 
  hasPermission={canView}
  label="สามารถดูรายงานนี้"
/>
```

---

## Dynamic UI Behavior

### ConditionalButton Component

Button that shows/hides or enables/disables based on user role and permissions.

**Features:**
- Role-based visibility/state
- Permission-based visibility/state
- Hide or disable modes
- Custom disabled tooltip
- Full Button props support

**Usage:**

```tsx
import { ConditionalButton } from '../components/ConditionalButton';
import { Role } from '../components/guards/RoleGuard';
import { Permission } from '../hooks/useAuth';

// Hide button if no permission
<ConditionalButton 
  requiredPermission={Permission.DELETE_USER}
  hideIfNoAccess
  colorScheme="red"
  onClick={handleDelete}
>
  Delete User
</ConditionalButton>

// Disable button if not ADMIN
<ConditionalButton 
  requiredRole={Role.ADMIN}
  disabledTooltip="เฉพาะ ADMIN เท่านั้น"
  onClick={handleSettings}
>
  System Settings
</ConditionalButton>

// Multiple roles (any)
<ConditionalButton 
  requiredRole={[Role.ADMIN, Role.EXECUTIVE]}
  onClick={handleReport}
>
  View Report
</ConditionalButton>
```

### ConditionalContent Component

Conditionally render content based on user role and permissions.

**Features:**
- Role-based content rendering
- Permission-based content rendering
- Fallback content support
- Access denied message
- ConditionalSection variant

**Usage:**

```tsx
import { ConditionalContent, ConditionalSection } from '../components/ConditionalContent';

// Show content only for EXECUTIVE and above
<ConditionalContent requiredRole={Role.EXECUTIVE}>
  <AnalyticsDashboard />
</ConditionalContent>

// Show fallback if no permission
<ConditionalContent 
  requiredPermission={Permission.VIEW_ANALYTICS}
  fallback={<Text>คุณไม่มีสิทธิ์ดูสถิติ</Text>}
>
  <StatisticsPanel />
</ConditionalContent>

// Show access denied message
<ConditionalContent 
  requiredRole={Role.ADMIN}
  showAccessDenied
  accessDeniedMessage="เฉพาะผู้ดูแลระบบเท่านั้น"
>
  <AdminPanel />
</ConditionalContent>

// Section variant
<ConditionalSection requiredPermission={Permission.MANAGE_SYSTEM_SETTINGS}>
  <SystemSettingsForm />
</ConditionalSection>
```

### Custom Hooks

**useHasRole(role: Role): boolean**
- Check if user has specific role (with hierarchy)

**useHasAnyRole(roles: Role[]): boolean**
- Check if user has any of the specified roles

**useHasPermission(permission: Permission): boolean**
- Check if user has specific permission

**useHasAnyPermission(permissions: Permission[]): boolean**
- Check if user has any of the specified permissions

**useHasAllPermissions(permissions: Permission[]): boolean**
- Check if user has all of the specified permissions

**useIsResourceOwner(resourceOwnerId: string): boolean**
- Check if user is the owner of a resource

**useCanAccessResource(resourceOwnerId: string): boolean**
- Check if user can access resource (owner or higher role)

**Usage:**

```tsx
import { useHasRole, useHasPermission, useCanAccessResource } from '../hooks/useAuth';
import { Role } from '../components/guards/RoleGuard';
import { Permission } from '../hooks/useAuth';

function MyComponent() {
  const isAdmin = useHasRole(Role.ADMIN);
  const canCreateUser = useHasPermission(Permission.CREATE_USER);
  const canAccessReport = useCanAccessResource(report.authorId);

  return (
    <div>
      {isAdmin && <AdminPanel />}
      {canCreateUser && <CreateUserButton />}
      {canAccessReport && <ReportDetails />}
    </div>
  );
}
```

---

## Role Management Page

### Overview

The Role Management Page provides a UI for managing roles and permissions (UI only, no API integration yet).

**Route:** `/admin/roles` (ADMIN only)

**Features:**
- 3 tabs: Roles, Permissions, Role-Permission Assignment
- CRUD operations UI
- Mock data (4 roles, 25 permissions)
- Create/Edit modals

### Roles Tab

**Features:**
- Table with 4 default roles
- Display: Role badge, Description, User count, Permission count
- Actions: Edit, Delete (disabled for system roles)
- Create role button with modal

**Default Roles:**
- ADMIN (2 users, 25 permissions)
- EXECUTIVE (5 users, 21 permissions)
- SUPERVISOR (15 users, 14 permissions)
- FIELD_OFFICER (50 users, 7 permissions)

### Permissions Tab

**Features:**
- 6 permission groups with 25 total permissions
- Permission indicator icons
- Edit/Delete actions
- Create permission button with modal

**Permission Groups:**
1. **User Management** (5 permissions)
   - CREATE_USER, READ_USER, UPDATE_USER, DELETE_USER, MANAGE_ROLES

2. **Incident Management** (5 permissions)
   - CREATE_INCIDENT, READ_INCIDENT, UPDATE_INCIDENT, DELETE_INCIDENT, ASSIGN_INCIDENT

3. **Task Management** (5 permissions)
   - CREATE_TASK, READ_TASK, UPDATE_TASK, DELETE_TASK, ASSIGN_TASK

4. **Report Management** (5 permissions)
   - CREATE_REPORT, READ_REPORT, UPDATE_REPORT, DELETE_REPORT, APPROVE_REPORT

5. **Analytics** (3 permissions)
   - VIEW_ANALYTICS, VIEW_TEAM_ANALYTICS, VIEW_ALL_ANALYTICS

6. **Admin Functions** (4 permissions)
   - MANAGE_SYSTEM_SETTINGS, VIEW_AUDIT_LOGS, MANAGE_GEOJSON, MANAGE_CUSTOM_LAYERS

### Role-Permission Assignment Tab

**Features:**
- Card for each role
- Checkbox list grouped by category
- Save button per role
- Visual permission count

---

## Usage Examples

### Example 1: Protected Admin Page

```tsx
import { Layout } from '../components/Layout';
import { ConditionalButton } from '../components/ConditionalButton';
import { Permission } from '../hooks/useAuth';

function AdminUsersPage() {
  return (
    <Layout>
      <Container maxW="7xl" py={8}>
        <HStack justify="space-between" mb={4}>
          <Heading>จัดการผู้ใช้</Heading>
          <ConditionalButton
            requiredPermission={Permission.CREATE_USER}
            colorScheme="blue"
            onClick={handleCreateUser}
          >
            สร้างผู้ใช้ใหม่
          </ConditionalButton>
        </HStack>
        
        <UsersTable />
      </Container>
    </Layout>
  );
}
```

### Example 2: Role-based Dashboard

```tsx
import { Layout } from '../components/Layout';
import { ConditionalContent } from '../components/ConditionalContent';
import { useHasRole } from '../hooks/useAuth';
import { Role } from '../components/guards/RoleGuard';

function DashboardPage() {
  const isAdmin = useHasRole(Role.ADMIN);
  const isExecutive = useHasRole(Role.EXECUTIVE);
  const isSupervisor = useHasRole(Role.SUPERVISOR);

  return (
    <Layout>
      <Container maxW="7xl" py={8}>
        <Heading mb={6}>Dashboard</Heading>
        
        {/* Admin Section */}
        <ConditionalContent requiredRole={Role.ADMIN}>
          <AdminStatistics />
        </ConditionalContent>
        
        {/* Executive Section */}
        <ConditionalContent requiredRole={Role.EXECUTIVE}>
          <ExecutiveReports />
        </ConditionalContent>
        
        {/* Supervisor Section */}
        <ConditionalContent requiredRole={Role.SUPERVISOR}>
          <TeamManagement />
        </ConditionalContent>
        
        {/* All Users */}
        <MyTasks />
        <RecentIncidents />
      </Container>
    </Layout>
  );
}
```

### Example 3: Table with Action Buttons

```tsx
import { ConditionalButton } from '../components/ConditionalButton';
import { useCanAccessResource } from '../hooks/useAuth';
import { Permission } from '../hooks/useAuth';

function UsersTable({ users }) {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>ชื่อ</Th>
          <Th>อีเมล</Th>
          <Th>บทบาท</Th>
          <Th>การจัดการ</Th>
        </Tr>
      </Thead>
      <Tbody>
        {users.map((user) => (
          <Tr key={user.id}>
            <Td>{user.fullName}</Td>
            <Td>{user.email}</Td>
            <Td><RoleBadge role={user.role} size="sm" /></Td>
            <Td>
              <HStack spacing={2}>
                <ConditionalButton
                  requiredPermission={Permission.UPDATE_USER}
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  แก้ไข
                </ConditionalButton>
                <ConditionalButton
                  requiredPermission={Permission.DELETE_USER}
                  size="sm"
                  colorScheme="red"
                  hideIfNoAccess
                  onClick={() => handleDelete(user)}
                >
                  ลบ
                </ConditionalButton>
              </HStack>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
```

---

## Best Practices

### 1. Always Use Layout Component

Wrap all pages with the `Layout` component for consistent navigation:

```tsx
import { Layout } from '../components/Layout';

function MyPage() {
  return (
    <Layout>
      {/* Page content */}
    </Layout>
  );
}
```

### 2. Use RoleProtectedRoute for All Protected Routes

Always use `RoleProtectedRoute` instead of `ProtectedRoute` for role-based protection:

```tsx
// Good
<Route
  path="/admin/dashboard"
  element={
    <RoleProtectedRoute requiredRoles={[Role.ADMIN]}>
      <AdminDashboardPage />
    </RoleProtectedRoute>
  }
/>

// Bad
<Route
  path="/admin/dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboardPage />
    </ProtectedRoute>
  }
/>
```

### 3. Use ConditionalButton for Action Buttons

Use `ConditionalButton` instead of manual permission checks:

```tsx
// Good
<ConditionalButton
  requiredPermission={Permission.DELETE_USER}
  hideIfNoAccess
  colorScheme="red"
  onClick={handleDelete}
>
  Delete
</ConditionalButton>

// Bad
{hasPermission(Permission.DELETE_USER) && (
  <Button colorScheme="red" onClick={handleDelete}>
    Delete
  </Button>
)}
```

### 4. Use ConditionalContent for Sections

Use `ConditionalContent` for conditional rendering of sections:

```tsx
// Good
<ConditionalContent requiredRole={Role.ADMIN}>
  <AdminPanel />
</ConditionalContent>

// Bad
{isAdmin && <AdminPanel />}
```

### 5. Use RoleBadge for Consistent Role Display

Always use `RoleBadge` component for displaying roles:

```tsx
// Good
<RoleBadge role={user.role} />

// Bad
<Badge colorScheme="red">{user.role}</Badge>
```

### 6. Use Custom Hooks for Permission Checks

Use custom hooks for cleaner code:

```tsx
// Good
const canCreateUser = useHasPermission(Permission.CREATE_USER);
const canAccessReport = useCanAccessResource(report.authorId);

// Bad
const canCreateUser = user?.role === Role.ADMIN || user?.role === Role.EXECUTIVE;
const canAccessReport = user?.id === report.authorId || user?.role === Role.ADMIN;
```

### 7. Provide Fallback Content

Always provide fallback content for better UX:

```tsx
<ConditionalContent 
  requiredPermission={Permission.VIEW_ANALYTICS}
  fallback={
    <Alert status="info">
      <AlertIcon />
      คุณไม่มีสิทธิ์ดูสถิติ กรุณาติดต่อผู้ดูแลระบบ
    </Alert>
  }
>
  <AnalyticsDashboard />
</ConditionalContent>
```

### 8. Use hideIfNoAccess for Sensitive Actions

Use `hideIfNoAccess` for sensitive actions that shouldn't be visible:

```tsx
<ConditionalButton
  requiredPermission={Permission.DELETE_USER}
  hideIfNoAccess  // Hide completely instead of showing disabled
  colorScheme="red"
  onClick={handleDelete}
>
  Delete User
</ConditionalButton>
```

---

## Summary

The Frontend Integration & UX Enhancements provide a comprehensive solution for role-based access control in the Guardian Route application. Key features include:

- **Role-Protected Routes** with hierarchy support
- **Dynamic Navigation** with role-based menu items
- **Role Indicators** with color-coded badges
- **Dynamic UI Behavior** with conditional rendering
- **Role Management UI** for future API integration

All components are designed to be reusable, maintainable, and follow best practices for React and TypeScript development.

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Author:** Guardian Route Development Team
