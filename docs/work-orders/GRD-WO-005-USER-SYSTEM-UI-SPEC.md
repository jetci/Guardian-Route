# Guardian Route Dashboard - Phase 4 Technical Specification
## User Management System & Role-Specific UI Completion

**Document ID:** GRD-WO-005-USER-SYSTEM-UI-SPEC  
**Version:** 1.0  
**Date:** 2025-11-04  
**Author:** Manus AI  
**Status:** Ready for Implementation  
**Priority:** 🔴 HIGH

---

## Executive Summary

This document provides a comprehensive technical specification for **Phase 4** of the Guardian Route Dashboard project, focusing on completing the User Management System and implementing role-specific user interfaces for all four user roles (ADMIN, EXECUTIVE, SUPERVISOR, FIELD_OFFICER). The specification builds upon the existing foundation established in Phases 1-3 and aims to deliver a complete, production-ready system with professional user management capabilities and tailored dashboards for each role.

**Estimated Duration:** 5 weeks (25 working days)  
**Complexity:** Medium-High  
**Dependencies:** Phase 1-3 completion

---

## Table of Contents

1. [Current Status Assessment](#current-status-assessment)
2. [Backend Enhancement](#backend-enhancement)
3. [Frontend User Management](#frontend-user-management)
4. [Role-Specific Dashboards](#role-specific-dashboards)
5. [Additional Features](#additional-features)
6. [Implementation Checklist](#implementation-checklist)
7. [Success Criteria](#success-criteria)
8. [Technical Guidelines](#technical-guidelines)

---

## 1. Current Status Assessment

### Existing Features

The Guardian Route Dashboard currently has the following user-related features implemented:

**Backend Components:**
- User model with 4 roles (ADMIN, EXECUTIVE, SUPERVISOR, FIELD_OFFICER)
- JWT-based authentication system
- Role-Based Access Control (RBAC) middleware
- Basic User CRUD API endpoints
- 4 test accounts for development

**Frontend Components:**
- Login page with authentication flow
- Basic dashboards for Supervisor and Field Officer roles
- Protected route system
- Authentication state management using Zustand

### Missing Features

The following features are required to complete the User Management System:

**User Management Capabilities:**
- User registration and invitation system
- Password reset and change functionality
- Profile management (view and edit)
- User settings and preferences
- Email verification workflow
- Session management and tracking
- Login history

**UI Components:**
- Complete dashboards for all four roles
- User profile page
- User settings page
- Admin user management interface
- Notifications system
- Help and documentation pages

---

## 2. Backend Enhancement

### 2.1 Enhanced User Model

The existing User model needs to be extended with additional fields to support comprehensive user management.

**Prisma Schema Changes:**

\`\`\`prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  firstName String
  lastName  String
  role      UserRole @default(FIELD_OFFICER)
  
  // New fields
  avatar              String?
  phone               String?
  position            String?   // ตำแหน่ง
  department          String?   // แผนก
  lastLoginAt         DateTime?
  isActive            Boolean   @default(true)
  emailVerified       Boolean   @default(false)
  passwordResetToken  String?
  passwordResetExpires DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  incidents       Incident[]
  tasks           Task[]
  surveys         Survey[]
  loginHistory    LoginHistory[]
  notifications   Notification[]
}

model LoginHistory {
  id         String    @id @default(uuid())
  userId     String
  ipAddress  String
  userAgent  String
  loginAt    DateTime  @default(now())
  logoutAt   DateTime?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
\`\`\`

**Migration Script:**

\`\`\`prisma
-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3),

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "department" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "LoginHistory_userId_idx" ON "LoginHistory"("userId");

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
\`\`\`

### 2.2 User Management API Endpoints

**File:** `backend/src/users/users.controller.ts`

#### 2.2.1 Registration and Invitation

\`\`\`typescript
// POST /api/users/register
// Admin only - Register new user
@Post('register')
@Roles(UserRole.ADMIN)
@ApiOperation({ summary: 'Register new user (Admin only)' })
@ApiResponse({ status: 201, description: 'User created successfully' })
async register(@Body() dto: RegisterUserDto): Promise<UserDto> {
  // Validate email uniqueness
  // Hash password
  // Create user with isActive=false
  // Send verification email
  // Return user data (without password)
}

// POST /api/users/invite
// Admin only - Invite user via email
@Post('invite')
@Roles(UserRole.ADMIN)
@ApiOperation({ summary: 'Invite user via email (Admin only)' })
@ApiResponse({ status: 200, description: 'Invitation sent successfully' })
async invite(@Body() dto: InviteUserDto): Promise<{ message: string }> {
  // Generate invitation token
  // Create user with temporary password
  // Send invitation email with setup link
  // Return success message
}
\`\`\`

#### 2.2.2 Account Activation/Deactivation

\`\`\`typescript
// POST /api/users/:id/activate
// Admin only - Activate user account
@Post(':id/activate')
@Roles(UserRole.ADMIN)
@ApiOperation({ summary: 'Activate user account' })
async activate(@Param('id') id: string): Promise<UserDto> {
  // Update isActive to true
  // Return updated user
}

// POST /api/users/:id/deactivate
// Admin only - Deactivate user account
@Post(':id/deactivate')
@Roles(UserRole.ADMIN)
@ApiOperation({ summary: 'Deactivate user account' })
async deactivate(@Param('id') id: string): Promise<UserDto> {
  // Update isActive to false
  // Invalidate all sessions
  // Return updated user
}
\`\`\`

#### 2.2.3 Password Management

\`\`\`typescript
// POST /api/users/:id/reset-password
// Admin only - Reset user password
@Post(':id/reset-password')
@Roles(UserRole.ADMIN)
@ApiOperation({ summary: 'Reset user password (Admin)' })
async resetPassword(
  @Param('id') id: string,
  @Body() dto: ResetPasswordDto
): Promise<{ message: string }> {
  // Generate new password or use provided
  // Hash password
  // Update user
  // Send email with new password
  // Return success message
}

// PATCH /api/users/me/password
// Change own password
@Patch('me/password')
@ApiOperation({ summary: 'Change own password' })
async changePassword(
  @CurrentUser() user: User,
  @Body() dto: ChangePasswordDto
): Promise<{ message: string }> {
  // Verify current password
  // Hash new password
  // Update user
  // Invalidate other sessions
  // Return success message
}

// POST /api/users/forgot-password
// Public - Request password reset
@Post('forgot-password')
@Public()
@ApiOperation({ summary: 'Request password reset' })
async forgotPassword(
  @Body() dto: ForgotPasswordDto
): Promise<{ message: string }> {
  // Find user by email
  // Generate reset token (valid 1 hour)
  // Save token and expiry
  // Send reset email with link
  // Return success message
}

// POST /api/users/reset-password
// Public - Reset password with token
@Post('reset-password')
@Public()
@ApiOperation({ summary: 'Reset password with token' })
async resetPasswordWithToken(
  @Body() dto: ResetPasswordWithTokenDto
): Promise<{ message: string }> {
  // Verify token and expiry
  // Hash new password
  // Update user and clear token
  // Return success message
}
\`\`\`

#### 2.2.4 Profile Management

\`\`\`typescript
// PATCH /api/users/me/profile
// Update own profile
@Patch('me/profile')
@ApiOperation({ summary: 'Update own profile' })
async updateProfile(
  @CurrentUser() user: User,
  @Body() dto: UpdateProfileDto
): Promise<UserDto> {
  // Update allowed fields (firstName, lastName, phone, position, department)
  // Return updated user
}

// POST /api/users/me/avatar
// Upload profile picture
@Post('me/avatar')
@UseInterceptors(FileInterceptor('avatar'))
@ApiOperation({ summary: 'Upload profile picture' })
async uploadAvatar(
  @CurrentUser() user: User,
  @UploadedFile() file: Express.Multer.File
): Promise<{ avatarUrl: string }> {
  // Validate file (JPEG/PNG, max 2MB)
  // Crop to square
  // Resize to 300x300
  // Compress to <200KB
  // Generate thumbnail (100x100)
  // Save to storage
  // Update user avatar URL
  // Return new avatar URL
}

// DELETE /api/users/me/avatar
// Remove profile picture
@Delete('me/avatar')
@ApiOperation({ summary: 'Remove profile picture' })
async removeAvatar(@CurrentUser() user: User): Promise<{ message: string }> {
  // Delete avatar file from storage
  // Update user avatar to null
  // Return success message
}
\`\`\`

#### 2.2.5 Session Management

\`\`\`typescript
// GET /api/users/me/sessions
// Get active sessions
@Get('me/sessions')
@ApiOperation({ summary: 'Get active sessions' })
async getSessions(@CurrentUser() user: User): Promise<LoginHistoryDto[]> {
  // Query LoginHistory where userId and logoutAt is null
  // Return list of active sessions
}

// DELETE /api/users/me/sessions/:id
// Terminate specific session
@Delete('me/sessions/:id')
@ApiOperation({ summary: 'Terminate session' })
async terminateSession(
  @CurrentUser() user: User,
  @Param('id') sessionId: string
): Promise<{ message: string }> {
  // Update logoutAt for the session
  // Invalidate JWT token (add to blacklist)
  // Return success message
}

// DELETE /api/users/me/sessions/all
// Terminate all sessions except current
@Delete('me/sessions/all')
@ApiOperation({ summary: 'Terminate all sessions' })
async terminateAllSessions(
  @CurrentUser() user: User,
  @Headers('authorization') currentToken: string
): Promise<{ message: string }> {
  // Update logoutAt for all sessions except current
  // Invalidate all JWT tokens except current
  // Return success message
}
\`\`\`

### 2.3 DTOs (Data Transfer Objects)

**File:** `backend/src/users/dto/`

\`\`\`typescript
// register-user.dto.ts
export class RegisterUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  position?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department?: string;
}

// invite-user.dto.ts
export class InviteUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  role: UserRole;
}

// update-profile.dto.ts
export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  firstName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  lastName?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  phone?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  position?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  department?: string;
}

// change-password.dto.ts
export class ChangePasswordDto {
  @IsString()
  @ApiProperty()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  newPassword: string;
}

// forgot-password.dto.ts
export class ForgotPasswordDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}

// reset-password-with-token.dto.ts
export class ResetPasswordWithTokenDto {
  @IsString()
  @ApiProperty()
  token: string;

  @IsString()
  @MinLength(8)
  @ApiProperty()
  newPassword: string;
}

// login-history.dto.ts
export class LoginHistoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  userAgent: string;

  @ApiProperty()
  loginAt: Date;

  @ApiProperty({ required: false })
  logoutAt?: Date;
}
\`\`\`

---

## 3. Frontend User Management

### 3.1 User Profile Page

**File:** `frontend/src/pages/common/ProfilePage.tsx`

**Purpose:** Allow users to view and edit their profile information, change password, upload avatar, and manage active sessions.

**Features:**
- Display user information with avatar
- Profile picture upload with preview
- Edit profile form with validation
- Change password form
- Active sessions list with termination capability
- Login history view

**Component Structure:**

\`\`\`typescript
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

interface ProfilePageProps {}

export const ProfilePage: React.FC<ProfilePageProps> = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    position: user?.position || '',
    department: user?.department || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Avatar upload
  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const response = await api.post('/users/me/avatar', formData);
      updateUser({ avatar: response.data.avatarUrl });
      toast.success('อัปโหลดรูปโปรไฟล์สำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถอัปโหลดรูปโปรไฟล์ได้');
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const response = await api.patch('/users/me/profile', profileForm);
      updateUser(response.data);
      setIsEditing(false);
      toast.success('อัปเดตโปรไฟล์สำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถอัปเดตโปรไฟล์ได้');
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }

    try {
      await api.patch('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setIsChangingPassword(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ');
    } catch (error) {
      toast.error('ไม่สามารถเปลี่ยนรหัสผ่านได้');
    }
  };

  // Load sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await api.get('/users/me/sessions');
        setSessions(response.data);
      } catch (error) {
        console.error('Failed to load sessions', error);
      }
    };
    loadSessions();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Avatar and Basic Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={user?.avatar || '/default-avatar.png'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
              <input
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => e.target.files && handleAvatarUpload(e.target.files[0])}
              />
              📷
            </label>
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">📝 ข้อมูลโปรไฟล์</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isEditing ? 'ยกเลิก' : 'แก้ไข'}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ</label>
                <input
                  type="text"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">นามสกุล</label>
                <input
                  type="text"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ตำแหน่ง</label>
              <input
                type="text"
                value={profileForm.position}
                onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">แผนก</label>
              <input
                type="text"
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              บันทึก
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ชื่อ-นามสกุล:</span>
              <span className="font-medium">{user?.firstName} {user?.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">เบอร์โทรศัพท์:</span>
              <span className="font-medium">{user?.phone || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ตำแหน่ง:</span>
              <span className="font-medium">{user?.position || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">แผนก:</span>
              <span className="font-medium">{user?.department || '-'}</span>
            </div>
          </div>
        )}
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">🔐 ความปลอดภัย</h3>
        
        {/* Change Password */}
        <div className="mb-6">
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            เปลี่ยนรหัสผ่าน
          </button>

          {isChangingPassword && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">รหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...profileForm, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <button
                onClick={handleChangePassword}
                className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                บันทึกรหัสผ่านใหม่
              </button>
            </div>
          )}
        </div>

        {/* Active Sessions */}
        <div>
          <h4 className="font-medium mb-2">เซสชันที่ใช้งานอยู่ ({sessions.length})</h4>
          <div className="space-y-2">
            {sessions.map((session: any) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="text-sm font-medium">{session.userAgent}</p>
                  <p className="text-xs text-gray-600">{session.ipAddress} • {new Date(session.loginAt).toLocaleString('th-TH')}</p>
                </div>
                <button
                  onClick={() => {/* terminate session */}}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                >
                  ยกเลิก
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
\`\`\`

### 3.2 User Settings Page

**File:** `frontend/src/pages/common/SettingsPage.tsx`

**Purpose:** Allow users to configure their preferences and settings.

**Features:**
- Notification preferences
- Language settings (Thai/English)
- Theme settings (Light/Dark)
- Display preferences
- Privacy settings

**Component Structure:**

\`\`\`typescript
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      incidentAlerts: true,
      taskAssignments: true,
      surveyReminders: true,
    },
    language: 'th',
    theme: 'light',
    display: {
      compactMode: false,
      showAvatars: true,
      itemsPerPage: 20,
    },
    privacy: {
      showOnlineStatus: true,
      showLastSeen: false,
    },
  });

  const handleSave = async () => {
    // Save settings to backend or localStorage
    toast.success('บันทึกการตั้งค่าสำเร็จ');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ การตั้งค่า</h1>

      {/* Notification Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">🔔 การแจ้งเตือน</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span>แจ้งเตือนทางอีเมล</span>
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email: e.target.checked }
              })}
              className="toggle"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>แจ้งเตือนเหตุการณ์</span>
            <input
              type="checkbox"
              checked={settings.notifications.incidentAlerts}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, incidentAlerts: e.target.checked }
              })}
              className="toggle"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>แจ้งเตือนงานที่ได้รับมอบหมาย</span>
            <input
              type="checkbox"
              checked={settings.notifications.taskAssignments}
              onChange={(e) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, taskAssignments: e.target.checked }
              })}
              className="toggle"
            />
          </label>
        </div>
      </div>

      {/* Language Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">🌐 ภาษา</h3>
        <select
          value={settings.language}
          onChange={(e) => setSettings({ ...settings, language: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="th">ไทย</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">🎨 ธีม</h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setSettings({ ...settings, theme: 'light' })}
            className={`px-4 py-2 rounded ${settings.theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            ☀️ สว่าง
          </button>
          <button
            onClick={() => setSettings({ ...settings, theme: 'dark' })}
            className={`px-4 py-2 rounded ${settings.theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            🌙 มืด
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        บันทึกการตั้งค่า
      </button>
    </div>
  );
};
\`\`\`

### 3.3 Admin User Management Page

**File:** `frontend/src/pages/admin/UsersManagementPage.tsx`

**Purpose:** Provide comprehensive user management interface for administrators.

**Features:**
- User list with search and filters
- Create new user
- Edit user information
- Activate/Deactivate users
- Reset user passwords
- Invite users via email
- Bulk actions
- Export user list

**Component Structure:**

\`\`\`typescript
import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { toast } from 'react-hot-toast';

export const UsersManagementPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error('ไม่สามารถโหลดข้อมูลผู้ใช้ได้');
    }
  };

  // Filter users
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((user: any) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== 'ALL') {
      filtered = filtered.filter((user: any) => user.role === roleFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((user: any) =>
        statusFilter === 'ACTIVE' ? user.isActive : !user.isActive
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  const handleActivate = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/activate`);
      toast.success('เปิดใช้งานผู้ใช้สำเร็จ');
      loadUsers();
    } catch (error) {
      toast.error('ไม่สามารถเปิดใช้งานผู้ใช้ได้');
    }
  };

  const handleDeactivate = async (userId: string) => {
    try {
      await api.post(`/users/${userId}/deactivate`);
      toast.success('ปิดใช้งานผู้ใช้สำเร็จ');
      loadUsers();
    } catch (error) {
      toast.error('ไม่สามารถปิดใช้งานผู้ใช้ได้');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 จัดการผู้ใช้</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + เพิ่มผู้ใช้
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            📧 เชิญผู้ใช้
          </button>
          <button
            onClick={() => {/* export users */}}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            📥 ส่งออก
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="ค้นหาชื่อ หรืออีเมล..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="ALL">ทุกบทบาท</option>
            <option value="ADMIN">ผู้ดูแลระบบ</option>
            <option value="EXECUTIVE">ผู้บริหาร</option>
            <option value="SUPERVISOR">หัวหน้างาน</option>
            <option value="FIELD_OFFICER">เจ้าหน้าที่ภาคสนาม</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="ALL">ทุกสถานะ</option>
            <option value="ACTIVE">ใช้งาน</option>
            <option value="INACTIVE">ไม่ใช้งาน</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ชื่อ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">อีเมล</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">บทบาท</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">สถานะ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user: any) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id.slice(0, 8)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.isActive ? 'ใช้งาน' : 'ไม่ใช้งาน'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">แก้ไข</button>
                    {user.isActive ? (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ปิดใช้งาน
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(user.id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        เปิดใช้งาน
                      </button>
                    )}
                    <button className="text-yellow-600 hover:text-yellow-800">รีเซ็ตรหัสผ่าน</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
\`\`\`

---

## 4. Role-Specific Dashboards

### 4.1 Field Officer Dashboard (Enhanced)

**File:** `frontend/src/pages/field-officer/DashboardPage.tsx`

**Purpose:** Provide a comprehensive dashboard for field officers to manage their tasks and surveys.

**Features:**
- Personal statistics (assigned tasks, completed today, pending, surveys)
- My tasks list with quick actions
- Assigned surveys list
- Quick action buttons (Report Incident, View Map)
- Task status badges and filters
- Survey response tracking

**Layout:**

\`\`\`
┌─────────────────────────────────────┐
│  🏠 Field Officer Dashboard         │
├─────────────────────────────────────┤
│  📊 My Statistics                   │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │   5    │ │   3    │ │   2    │  │
│  │Assigned│ │Complete│ │Pending │  │
│  │ Tasks  │ │ Today  │ │        │  │
│  └────────┘ └────────┘ └────────┘  │
├─────────────────────────────────────┤
│  ✅ My Tasks                        │
│  [Today] [This Week] [Overdue]     │
│  ┌─────────────────────────────┐   │
│  │ 🚨 Task 1                   │   │
│  │ Priority: High              │   │
│  │ Due: Today 5:00 PM          │   │
│  │ [View] [Complete]           │   │
│  └─────────────────────────────┘   │
│  [View All Tasks]                   │
├─────────────────────────────────────┤
│  📋 Assigned Surveys                │
│  ┌─────────────────────────────┐   │
│  │ Survey: Flood Assessment    │   │
│  │ Incident: #INC-001          │   │
│  │ Due: Nov 10, 2025           │   │
│  │ [Start Survey]              │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  🗺️ Quick Actions                  │
│  [Report Incident] [View Map]      │
└─────────────────────────────────────┘
\`\`\`

### 4.2 Supervisor Dashboard (Enhanced)

**File:** `frontend/src/pages/supervisor/DashboardPage.tsx`

**Purpose:** Provide a command center for supervisors to oversee incidents, tasks, and field officers.

**Features:**
- Overview statistics (total cases, active cases, tasks, field staff)
- Recent incidents with quick actions
- Task overview with progress chart
- Field officers status tracking
- Quick action buttons
- Real-time updates

**Layout:**

\`\`\`
┌─────────────────────────────────────────────────┐
│  📊 Supervisor Command Center                   │
│  [Overview] [Incidents] [Tasks] [Surveys] [Map]│
├─────────────────────────────────────────────────┤
│  📈 Statistics Cards                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ 12   │ │  8   │ │ 15   │ │  5   │          │
│  │Total │ │Active│ │Tasks │ │Field │          │
│  │Cases │ │Cases │ │      │ │Staff │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
├─────────────────────────────────────────────────┤
│  🚨 Recent Incidents                            │
│  ┌───────────────────────────────────────┐     │
│  │ #INC-012 Flood in Village 5           │     │
│  │ Status: In Progress • Priority: High  │     │
│  │ [View] [Assign Task] [Create Survey]  │     │
│  └───────────────────────────────────────┘     │
├─────────────────────────────────────────────────┤
│  📊 Task Overview                               │
│  [Progress Bar: 60% Complete]                   │
│  Pending: 5 • In Progress: 8 • Overdue: 2      │
├─────────────────────────────────────────────────┤
│  👥 Field Officers Status                       │
│  ┌─────────────────────────────────────┐       │
│  │ John Doe • 3 active tasks           │       │
│  │ Last seen: 5 min ago                │       │
│  └─────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
\`\`\`

### 4.3 Executive Dashboard (New)

**File:** `frontend/src/pages/executive/DashboardPage.tsx`

**Purpose:** Provide high-level analytics and reports for executives.

**Features:**
- Key Performance Indicators (KPIs)
- Incident trends chart (past 6 months)
- Incidents by village (heatmap or bar chart)
- Recent reports with download capability
- Team performance metrics
- Export functionality
- Date range filters

**Layout:**

\`\`\`
┌─────────────────────────────────────────────────┐
│  📊 Executive Dashboard                         │
│  [Overview] [Analytics] [Reports] [Performance] │
├─────────────────────────────────────────────────┤
│  📈 Key Performance Indicators                  │
│  ┌────────────┐ ┌────────────┐ ┌─────────────┐│
│  │ 47         │ │ 92%        │ │ 3.5 days    ││
│  │ Total      │ │ Resolution │ │ Avg Response││
│  │ Incidents  │ │ Rate       │ │ Time        ││
│  │ (This Month│ │            │ │             ││
│  └────────────┘ └────────────┘ └─────────────┘│
├─────────────────────────────────────────────────┤
│  📊 Incident Trends (Chart)                     │
│  [Line/Bar Chart - Past 6 Months]               │
│  [Filter: Last 6 Months ▼]                      │
├─────────────────────────────────────────────────┤
│  🗺️ Incidents by Village (Chart)               │
│  [Bar Chart showing incidents per village]      │
├─────────────────────────────────────────────────┤
│  📋 Recent Reports                              │
│  ┌───────────────────────────────────────┐     │
│  │ Monthly Report - October 2025         │     │
│  │ Generated: Nov 1, 2025                │     │
│  │ [Download PDF] [View]                 │     │
│  └───────────────────────────────────────┘     │
├─────────────────────────────────────────────────┤
│  👥 Team Performance                            │
│  [Performance Metrics by Officer]               │
│  Officer A: 95% • Officer B: 88% • Officer C: 92%│
└─────────────────────────────────────────────────┘
\`\`\`

**Charts Implementation:**

\`\`\`typescript
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Incident Trends Data
const incidentTrendsData = [
  { month: 'May', incidents: 12 },
  { month: 'Jun', incidents: 15 },
  { month: 'Jul', incidents: 18 },
  { month: 'Aug', incidents: 14 },
  { month: 'Sep', incidents: 20 },
  { month: 'Oct', incidents: 16 },
];

// Incidents by Village Data
const villageIncidentsData = [
  { village: 'Village 1', incidents: 8 },
  { village: 'Village 2', incidents: 12 },
  { village: 'Village 3', incidents: 6 },
  { village: 'Village 4', incidents: 10 },
  { village: 'Village 5', incidents: 15 },
];

// Incident Trends Chart
<LineChart width={800} height={300} data={incidentTrendsData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="month" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="incidents" stroke="#3B82F6" strokeWidth={2} />
</LineChart>

// Incidents by Village Chart
<BarChart width={800} height={300} data={villageIncidentsData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="village" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Bar dataKey="incidents" fill="#10B981" />
</BarChart>
\`\`\`

### 4.4 Admin Dashboard (New)

**File:** `frontend/src/pages/admin/DashboardPage.tsx`

**Purpose:** Provide system administration and monitoring capabilities.

**Features:**
- System health metrics
- User activity statistics
- Database statistics
- System logs (recent)
- Quick admin actions
- System settings access

**Layout:**

\`\`\`
┌─────────────────────────────────────────────────┐
│  ⚙️ Admin Dashboard                             │
│  [System] [Users] [Database] [Logs] [Settings] │
├─────────────────────────────────────────────────┤
│  💚 System Health                               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ 99%  │ │ 45ms │ │ 78%  │ │ 2.1GB│          │
│  │Uptime│ │Resp  │ │CPU   │ │Memory│          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
├─────────────────────────────────────────────────┤
│  👥 User Activity                               │
│  Active Users: 12                               │
│  New Users (This Month): 3                      │
│  Total Users: 45                                │
├─────────────────────────────────────────────────┤
│  💾 Database Statistics                         │
│  Total Records: 1,245                           │
│  Incidents: 47 • Tasks: 156 • Surveys: 89      │
│  Database Size: 124 MB                          │
├─────────────────────────────────────────────────┤
│  📋 Recent System Logs                          │
│  [2025-11-04 10:30] User login: admin@...      │
│  [2025-11-04 10:25] Incident created: #INC-012 │
│  [2025-11-04 10:20] Task assigned to John Doe  │
│  [View All Logs]                                │
├─────────────────────────────────────────────────┤
│  ⚡ Quick Admin Actions                         │
│  [Manage Users] [System Settings] [Backup DB]  │
└─────────────────────────────────────────────────┘
\`\`\`

---

## 5. Additional Features

### 5.1 Notification System

**Backend:**

**File:** `backend/src/notifications/notifications.service.ts`

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async createNotification(data: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
  }) {
    return this.prisma.notification.create({
      data,
    });
  }

  async getNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
\`\`\`

**Prisma Schema:**

\`\`\`prisma
model Notification {
  id        String           @id @default(uuid())
  userId    String
  title     String
  message   String
  type      NotificationType
  link      String?
  isRead    Boolean          @default(false)
  createdAt DateTime         @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

enum NotificationType {
  INCIDENT_CREATED
  TASK_ASSIGNED
  SURVEY_ASSIGNED
  REPORT_GENERATED
  SYSTEM_ALERT
}
\`\`\`

**Frontend:**

**File:** `frontend/src/components/notifications/NotificationBell.tsx`

\`\`\`typescript
import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Failed to load notifications', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      loadNotifications();
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold">การแจ้งเตือน</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">ไม่มีการแจ้งเตือน</div>
            ) : (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <p className="font-medium">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('th-TH')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
\`\`\`

### 5.2 Enhanced Navigation

**File:** `frontend/src/components/layout/Navigation.tsx`

\`\`\`typescript
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { NotificationBell } from '../notifications/NotificationBell';

export const Navigation: React.FC = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  const getNavItems = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/admin/users', label: 'Users', icon: '👥' },
          { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
        ];
      case 'EXECUTIVE':
        return [
          { path: '/executive/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/executive/analytics', label: 'Analytics', icon: '📈' },
          { path: '/executive/reports', label: 'Reports', icon: '📋' },
        ];
      case 'SUPERVISOR':
        return [
          { path: '/supervisor/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/supervisor/incidents', label: 'Incidents', icon: '🚨' },
          { path: '/supervisor/tasks', label: 'Tasks', icon: '✅' },
          { path: '/supervisor/surveys', label: 'Surveys', icon: '📋' },
          { path: '/supervisor/map', label: 'Map', icon: '🗺️' },
        ];
      case 'FIELD_OFFICER':
        return [
          { path: '/field-officer/dashboard', label: 'Dashboard', icon: '🏠' },
          { path: '/field-officer/tasks', label: 'My Tasks', icon: '✅' },
          { path: '/field-officer/surveys', label: 'Surveys', icon: '📋' },
          { path: '/field-officer/map', label: 'Map', icon: '🗺️' },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Guardian Route
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {getNavItems().map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon} {item.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <Link to="/profile" className="flex items-center space-x-2">
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt="Avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">{user?.firstName}</span>
            </Link>
            <button
              onClick={logout}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
\`\`\`

### 5.3 Help Page

**File:** `frontend/src/pages/common/HelpPage.tsx`

\`\`\`typescript
import React from 'react';

export const HelpPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">❓ ความช่วยเหลือ</h1>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">🚀 เริ่มต้นใช้งาน</h2>
        <div className="space-y-3">
          <div>
            <h3 className="font-medium">1. เข้าสู่ระบบ</h3>
            <p className="text-gray-600">ใช้อีเมลและรหัสผ่านที่ได้รับจากผู้ดูแลระบบ</p>
          </div>
          <div>
            <h3 className="font-medium">2. ตั้งค่าโปรไฟล์</h3>
            <p className="text-gray-600">อัปเดตข้อมูลส่วนตัวและอัปโหลดรูปโปรไฟล์</p>
          </div>
          <div>
            <h3 className="font-medium">3. เริ่มใช้งาน</h3>
            <p className="text-gray-600">เข้าสู่ Dashboard และเริ่มจัดการงานของคุณ</p>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">💬 คำถามที่พบบ่อย</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">ฉันจะเปลี่ยนรหัสผ่านได้อย่างไร?</h3>
            <p className="text-gray-600">ไปที่หน้าโปรไฟล์ &gt; ความปลอดภัย &gt; เปลี่ยนรหัสผ่าน</p>
          </div>
          <div>
            <h3 className="font-medium">ฉันจะรายงานเหตุการณ์ได้อย่างไร?</h3>
            <p className="text-gray-600">คลิกปุ่ม "รายงานเหตุการณ์" ใน Dashboard หรือหน้าแผนที่</p>
          </div>
          <div>
            <h3 className="font-medium">ฉันจะดูงานที่ได้รับมอบหมายได้ที่ไหน?</h3>
            <p className="text-gray-600">ไปที่ Dashboard หรือหน้า "งานของฉัน"</p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">📞 ติดต่อฝ่ายสนับสนุน</h2>
        <p className="text-gray-600 mb-2">หากคุณต้องการความช่วยเหลือเพิ่มเติม กรุณาติดต่อ:</p>
        <p className="text-gray-600">📧 Email: support@guardianroute.com</p>
        <p className="text-gray-600">📱 Tel: 053-XXX-XXXX</p>
      </div>
    </div>
  );
};
\`\`\`

---

## 6. Implementation Checklist

### Week 13: Backend Enhancement (5 days)

- [ ] **Day 1-2: Database Schema**
  - [ ] Update User model with new fields
  - [ ] Create LoginHistory model
  - [ ] Create Notification model
  - [ ] Write and test migration script
  - [ ] Apply migration to development database

- [ ] **Day 3: User Management APIs**
  - [ ] Implement registration endpoint
  - [ ] Implement invitation endpoint
  - [ ] Implement activate/deactivate endpoints
  - [ ] Create all DTOs

- [ ] **Day 4: Password & Profile APIs**
  - [ ] Implement password reset flow
  - [ ] Implement change password endpoint
  - [ ] Implement profile update endpoint
  - [ ] Implement avatar upload endpoint

- [ ] **Day 5: Session Management & Testing**
  - [ ] Implement session tracking
  - [ ] Implement session termination endpoints
  - [ ] Test all endpoints with Swagger
  - [ ] Write unit tests

### Week 14: User Management UI (5 days)

- [ ] **Day 1-2: Profile Page**
  - [ ] Create ProfilePage component
  - [ ] Implement avatar upload UI
  - [ ] Implement profile edit form
  - [ ] Implement change password form
  - [ ] Implement sessions list

- [ ] **Day 3: Settings Page**
  - [ ] Create SettingsPage component
  - [ ] Implement notification preferences
  - [ ] Implement language settings
  - [ ] Implement theme settings

- [ ] **Day 4-5: Admin User Management**
  - [ ] Create UsersManagementPage component
  - [ ] Implement user list with filters
  - [ ] Implement create user modal
  - [ ] Implement invite user modal
  - [ ] Implement activate/deactivate actions
  - [ ] Test all functionality

### Week 15: Role Dashboards Part 1 (5 days)

- [ ] **Day 1-2: Field Officer Dashboard**
  - [ ] Create enhanced DashboardPage
  - [ ] Implement statistics cards
  - [ ] Implement tasks list with filters
  - [ ] Implement surveys list
  - [ ] Implement quick actions

- [ ] **Day 3-4: Supervisor Dashboard**
  - [ ] Create enhanced DashboardPage
  - [ ] Implement statistics cards
  - [ ] Implement recent incidents section
  - [ ] Implement task overview with chart
  - [ ] Implement field officers status

- [ ] **Day 5: Testing**
  - [ ] Test Field Officer dashboard
  - [ ] Test Supervisor dashboard
  - [ ] Fix bugs and refine UI

### Week 16: Role Dashboards Part 2 (5 days)

- [ ] **Day 1-3: Executive Dashboard**
  - [ ] Create DashboardPage component
  - [ ] Implement KPI cards
  - [ ] Install and configure recharts
  - [ ] Implement incident trends chart
  - [ ] Implement incidents by village chart
  - [ ] Implement recent reports section
  - [ ] Implement team performance section

- [ ] **Day 4-5: Admin Dashboard**
  - [ ] Create DashboardPage component
  - [ ] Implement system health metrics
  - [ ] Implement user activity statistics
  - [ ] Implement database statistics
  - [ ] Implement system logs section
  - [ ] Implement quick admin actions

### Week 17: Polish & Testing (5 days)

- [ ] **Day 1: Enhanced Navigation**
  - [ ] Update Navigation component
  - [ ] Implement role-based menu items
  - [ ] Add NotificationBell component
  - [ ] Test navigation across all roles

- [ ] **Day 2: Notification System**
  - [ ] Implement notifications backend
  - [ ] Implement NotificationBell frontend
  - [ ] Test notification creation and display
  - [ ] Implement polling mechanism

- [ ] **Day 3: Help Page & Documentation**
  - [ ] Create HelpPage component
  - [ ] Write quick start guide
  - [ ] Write FAQs
  - [ ] Add contact support information

- [ ] **Day 4: Mobile Responsiveness**
  - [ ] Test all pages on mobile devices
  - [ ] Fix responsive issues
  - [ ] Optimize for tablets
  - [ ] Test on different screen sizes

- [ ] **Day 5: Final Testing & Documentation**
  - [ ] Comprehensive testing of all features
  - [ ] Fix remaining bugs
  - [ ] Update project documentation
  - [ ] Prepare deployment guide

---

## 7. Success Criteria

### Functional Requirements

- [ ] ✅ Users can view and edit their profile
- [ ] ✅ Users can change password
- [ ] ✅ Users can upload and remove avatar
- [ ] ✅ Admin can create new users
- [ ] ✅ Admin can invite users via email
- [ ] ✅ Admin can activate/deactivate users
- [ ] ✅ Admin can reset user passwords
- [ ] ✅ Each role has a complete, tailored dashboard
- [ ] ✅ Notifications system works correctly
- [ ] ✅ Navigation is intuitive and role-appropriate
- [ ] ✅ Help documentation is available and comprehensive

### Quality Requirements

- [ ] ✅ All pages are responsive (mobile/tablet/desktop)
- [ ] ✅ Page load times are under 2 seconds
- [ ] ✅ No console errors or warnings
- [ ] ✅ Consistent UI/UX across all pages
- [ ] ✅ Full Thai language support
- [ ] ✅ Accessible (WCAG 2.0 AA compliance)
- [ ] ✅ All forms have proper validation
- [ ] ✅ Error messages are clear and helpful

### Security Requirements

- [ ] ✅ Password reset tokens expire after 1 hour
- [ ] ✅ Passwords are hashed using bcrypt
- [ ] ✅ JWT tokens are properly validated
- [ ] ✅ RBAC is enforced on all endpoints
- [ ] ✅ File uploads are validated (type, size)
- [ ] ✅ Session management is secure
- [ ] ✅ SQL injection prevention
- [ ] ✅ XSS prevention

---

## 8. Technical Guidelines

### 8.1 UI/UX Design System

**Color Palette:**

\`\`\`css
/* Primary Colors */
--primary-blue: #3B82F6;
--primary-dark: #1E40AF;

/* Status Colors */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #06B6D4;

/* Role Colors */
--admin: #7C3AED;
--executive: #EC4899;
--supervisor: #3B82F6;
--field: #10B981;

/* Neutrals */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;
\`\`\`

**Typography:**

\`\`\`css
/* Fonts */
--font-primary: 'Sarabun', sans-serif;  /* Thai support */

/* Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
\`\`\`

**Component Styles:**

\`\`\`css
/* Cards */
.card {
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1.5rem;
  background: white;
}

/* Buttons */
.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
}

.btn-secondary {
  background: var(--gray-200);
  color: var(--gray-800);
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

.btn-danger {
  background: var(--error);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}

/* Badges */
.badge {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.badge-success {
  background: #D1FAE5;
  color: #065F46;
}

.badge-warning {
  background: #FEF3C7;
  color: #92400E;
}

.badge-error {
  background: #FEE2E2;
  color: #991B1B;
}
\`\`\`

### 8.2 Avatar Upload Configuration

\`\`\`typescript
// backend/src/upload/upload.config.ts
export const avatarUploadConfig = {
  maxSize: 2 * 1024 * 1024, // 2MB
  allowedTypes: ['image/jpeg', 'image/png'],
  dimensions: {
    avatar: { width: 300, height: 300 },
    thumbnail: { width: 100, height: 100 },
  },
  quality: 80,
  format: 'jpeg',
};
\`\`\`

### 8.3 Charts Library Installation

\`\`\`bash
# Install recharts
cd frontend
pnpm install recharts

# Or install chart.js (alternative)
pnpm install chart.js react-chartjs-2
\`\`\`

### 8.4 Notification Polling Configuration

\`\`\`typescript
// frontend/src/hooks/useNotifications.ts
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n: any) => !n.isRead).length);
      } catch (error) {
        console.error('Failed to load notifications', error);
      }
    };

    // Initial load
    loadNotifications();

    // Poll every 30 seconds
    const interval = setInterval(loadNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  return { notifications, unreadCount };
};
\`\`\`

### 8.5 Session Management Configuration

\`\`\`typescript
// backend/src/auth/auth.config.ts
export const sessionConfig = {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '8h',
  refreshTokenExpiresIn: '7d',
  maxActiveSessions: 5,
  sessionTimeout: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
};
\`\`\`

---

## 9. Estimated Timeline

\`\`\`
Week 13: Backend Enhancement        ████████████ 5 days
Week 14: User Management UI         ████████████ 5 days
Week 15: Role Dashboards (Part 1)   ████████████ 5 days
Week 16: Role Dashboards (Part 2)   ████████████ 5 days
Week 17: Polish & Testing           ████████████ 5 days

Total: 25 days (5 weeks)
Complexity: Medium-High
Priority: High
\`\`\`

---

## 10. Conclusion

This technical specification provides a comprehensive guide for implementing Phase 4 of the Guardian Route Dashboard. By following this document, developers can create a complete, production-ready User Management System with tailored dashboards for all four user roles.

The specification includes:
- Detailed database schema changes
- Complete API endpoint specifications
- Frontend component designs and layouts
- Implementation checklists
- Success criteria
- Technical guidelines

All components are designed to integrate seamlessly with the existing Phase 1-3 infrastructure and maintain the high quality standards established in previous phases.

**Status:** Ready for Implementation  
**Quality:** Professional Grade  
**Estimated Completion:** 5 weeks from start date

---

**Document prepared by:** Manus AI  
**Date:** November 4, 2025  
**Version:** 1.0
