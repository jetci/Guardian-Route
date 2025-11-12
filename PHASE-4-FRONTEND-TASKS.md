# Phase 4: User Management & UI - Frontend Task Breakdown

**Document ID:** `PHASE-4-FRONTEND-TASKS.md`  
**Date:** 12 พฤศจิกายน 2025  
**รายงานจากทีม:** Manus

---

## 🔴 BLOCKER Tasks

*These are the essential UI components for basic user self-service. Without these, the new backend endpoints for profile management are unusable.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **API-04** | 🔴 BLOCKER | **Update API Client for Users** | Add functions to `/frontend/src/api/users.ts` for all the new user management endpoints (profile, password, etc.). | Backend API-04, API-05 |
| **PAGE-02**| 🔴 BLOCKER | **Create User Profile Page** | Create a new page (`/pages/profile/ProfilePage.tsx`) where users can view their own information. | API-04 |
| **COMP-04**| 🔴 BLOCKER | **Create Profile Edit Form** | Build a form component (`ProfileEditForm.tsx`) to allow users to update their profile information via the `PATCH /me/profile` endpoint. | PAGE-02 |
| **COMP-05**| 🔴 BLOCKER | **Create Password Change Form** | Build a form component (`PasswordChangeForm.tsx`) for users to change their own password via the `PATCH /me/password` endpoint. | PAGE-02 |

---

## 🟡 CORE Tasks

*These tasks implement the full user management experience for both regular users and admins, including password recovery and enhanced admin controls.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **PAGE-03**| 🟡 CORE | **Create Password Reset Pages** | Build the UI for the forgot password flow: a page to request a reset link and a page to enter a new password using the token from the email. | Backend API-06 |
| **COMP-06**| 🟡 CORE | **Enhance Admin User Management UI** | Add UI controls to the existing `UserManagement.tsx` component for inviting, activating, and deactivating users. This will involve creating new modals (`InviteUserModal.tsx`, etc.). | Backend API-07 |
| **PAGE-04**| 🟡 CORE | **Create Session Management Page** | Build a page (`/pages/profile/SessionsPage.tsx`) where users can view their active login sessions and revoke them. | Backend API-08 |
| **UI-07** | 🟡 CORE | **Complete Role-Specific Dashboards** | Flesh out the dashboards for all roles (especially Field Officer and Executive) with relevant widgets and data visualizations as specified in the design documents. | - |

---

## ⚪ OPTIONAL Tasks

*These are "nice-to-have" features that improve the user experience and provide additional functionality.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **COMP-07**| ⚪ OPTIONAL | **Create Avatar Upload Component** | Build a component (`AvatarUpload.tsx`) that allows users to upload, crop, and save a profile picture. | Backend API-09 |
| **PAGE-05**| ⚪ OPTIONAL | **Create Help & Documentation Pages** | Build static pages for user guides, FAQs, and support information. | - |
| **COMP-08**| ⚪ OPTIONAL | **Implement Full Notification UI** | Create a dedicated page or dropdown (`NotificationList.tsx`) to show a history of notifications with read/unread states. | Backend API-10 |
| **TEST-04**| ⚪ OPTIONAL | **Write E2E Tests for User Flows** | Create end-to-end tests for the profile update, password reset, and admin management user journeys. | All Tasks |

---

### References:

1.  [GRD-WO-005-USER-SYSTEM-UI-SPEC.md](/home/ubuntu/Guardian-Route/docs/work-orders/GRD-WO-005-USER-SYSTEM-UI-SPEC.md)
2.  [system-completeness-report.md](/home/ubuntu/system-completeness-report.md)
