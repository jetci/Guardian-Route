# Phase 4: User Management & UI - Backend Task Breakdown

**Document ID:** `PHASE-4-BACKEND-TASKS.md`  
**Date:** 12 พฤศจิกายน 2025  
**Assigned to:** ทีม Manus
**รายงานจากทีม:** Manus

---

## 🔴 BLOCKER Tasks

*These tasks are the foundational elements for enhancing the user system. Without them, no meaningful user management features can be built.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **DB-05** | 🔴 BLOCKER | **Enhance User Model** | Add new fields to the `User` model in `schema.prisma` (`avatar`, `phone`, `position`, `lastLoginAt`, `emailVerified`, `passwordResetToken`, `passwordResetExpires`). | - |
| **DB-06** | 🔴 BLOCKER | **Run User Model Migration** | Apply the new `User` model schema to the database. | DB-05 |
| **API-04** | 🔴 BLOCKER | **Implement Profile Management API** | Create the `PATCH /api/users/me/profile` endpoint to allow users to update their own basic information (name, phone, etc.). | DB-06 |
| **API-05** | 🔴 BLOCKER | **Implement Password Change API** | Create the `PATCH /api/users/me/password` endpoint for authenticated users to change their own password. | DB-06 |

---

## 🟡 CORE Tasks

*These tasks constitute the main deliverables for the User Management System, including registration, password recovery, and session tracking.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **DEP-02** | 🟡 CORE | **Install Email Service Dependency** | Install a library for sending emails, such as `nodemailer`. | - |
| **SVC-06** | 🟡 CORE | **Create Email Service** | Implement a generic `EmailService` to handle sending transactional emails with templates (e.g., using Handlebars). | DEP-02 |
| **API-06** | 🟡 CORE | **Implement Password Reset Flow** | Create the public endpoints `POST /api/users/forgot-password` and `POST /api/users/reset-password` and integrate them with the `EmailService`. | SVC-06, DB-06 |
| **API-07** | 🟡 CORE | **Implement Admin User Management APIs** | Create the admin-only endpoints for user lifecycle management: `POST /register`, `POST /invite`, `POST /:id/activate`, `POST /:id/deactivate`. | SVC-06 |
| **DB-07** | 🟡 CORE | **Create LoginHistory Model** | Add the `LoginHistory` model to `schema.prisma` to track user sessions. | DB-05 |
| **SVC-07** | 🟡 CORE | **Implement Login History Tracking** | Automatically create a `LoginHistory` record upon successful user login. | DB-07 |
| **API-08** | 🟡 CORE | **Implement Session Management API** | Create endpoints for users to view and revoke their active sessions (`GET /me/sessions`, `DELETE /me/sessions/:id`). | SVC-07 |

---

## ⚪ OPTIONAL Tasks

*These are valuable features that complete the user experience but can be implemented after the core system is functional.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **API-09** | ⚪ OPTIONAL | **Implement Avatar Upload API** | Create `POST /me/avatar` and `DELETE /me/avatar` endpoints, including file validation, resizing (with Sharp), and storage. | DB-06 |
| **DB-08** | ⚪ OPTIONAL | **Create Notification Model** | Add the `Notification` model to `schema.prisma` to persist notifications in the database. | DB-05 |
| **SVC-08** | ⚪ OPTIONAL | **Enhance Notification Service** | Refactor the existing `NotificationsService` to store notifications in the database and manage read/unread states. | DB-08 |
| **API-10** | ⚪ OPTIONAL | **Implement Full Notification API** | Create full CRUD endpoints for managing user notifications. | SVC-08 |
| **TEST-03**| ⚪ OPTIONAL | **Write Unit & Integration Tests** | Add comprehensive tests for all the new user management services and API endpoints. | All Tasks |

---

### References:

1.  [GRD-WO-005-USER-SYSTEM-UI-SPEC.md](/home/ubuntu/Guardian-Route/docs/work-orders/GRD-WO-005-USER-SYSTEM-UI-SPEC.md)
2.  [system-completeness-report.md](/home/ubuntu/system-completeness-report.md)
