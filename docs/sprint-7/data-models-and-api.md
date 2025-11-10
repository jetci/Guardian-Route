# Sprint 7: Data Models & API Contracts

**Version:** 1.0
**Date:** 2025-11-10

---

## 1. Data Models

### SupervisorTaskView

Extended task model for supervisor dashboard:

```typescript
interface SupervisorTaskView {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: Date;
  updatedAt: Date;
  
  // Incident details
  incident: {
    id: string;
    type: DisasterType;
    location: {
      lat: number;
      lng: number;
      address: string;
      village: string;
    };
  };
  
  // Assignment details
  assignedTo: {
    id: string;
    name: string;
    avatar?: string;
    phone: string;
  } | null;
  
  // Progress tracking
  surveyedAt?: Date;
  completedAt?: Date;
  
  // Report status
  hasReport: boolean;
  reportStatus?: 'PENDING_REVIEW' | 'APPROVED' | 'REVISION_REQUESTED';
}
```

### AvailableOfficer

```typescript
interface AvailableOfficer {
  id: string;
  name: string;
  avatar?: string;
  phone: string;
  email: string;
  currentTaskCount: number;
  isAvailable: boolean;
  lastActive: Date;
}
```

### BroadcastMessage

```typescript
interface BroadcastMessage {
  title: string;
  message: string;
  priority: 'URGENT' | 'NORMAL';
  targetRole: 'FIELD_OFFICER' | 'ALL';
}
```

### ReportReviewAction

```typescript
interface ReportReviewAction {
  action: 'APPROVE' | 'REQUEST_REVISION';
  comments?: string; // Required for REQUEST_REVISION
  reviewedBy: string; // Supervisor ID
}
```

---

## 2. API Endpoints

### Task Management

#### GET /tasks/supervisor-view

**Description:** Get all tasks with extended details for supervisor dashboard

**Query Parameters:**
- `status`: Filter by task status
- `priority`: Filter by priority
- `incidentType`: Filter by disaster type
- `dateFrom`: Filter by created date (ISO string)
- `dateTo`: Filter by created date (ISO string)

**Response:**
```json
{
  "tasks": [SupervisorTaskView],
  "summary": {
    "total": number,
    "byStatus": {
      "PENDING_ASSIGNMENT": number,
      "IN_PROGRESS": number,
      "SURVEYED": number,
      "COMPLETED": number
    },
    "byPriority": {
      "HIGH": number,
      "MEDIUM": number,
      "LOW": number
    }
  }
}
```

#### PATCH /tasks/:taskId/assign

**Description:** Assign a field officer to a task

**Request Body:**
```json
{
  "officerId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "task": SupervisorTaskView,
  "message": "Officer assigned successfully"
}
```

**Validation:**
- Task must be in `PENDING_ASSIGNMENT` status
- Officer must exist and have `FIELD_OFFICER` role
- Officer must be available (not overloaded with tasks)

**Side Effects:**
- Task status changes to `IN_PROGRESS`
- Notification sent to assigned officer
- Audit log created

### Officer Management

#### GET /users/available-officers

**Description:** Get list of field officers available for assignment

**Response:**
```json
{
  "officers": [AvailableOfficer]
}
```

**Business Logic:**
- Filter users with role `FIELD_OFFICER`
- Include current task count
- Mark as unavailable if task count > threshold (e.g., 5)

### Report Review

#### PATCH /reports/:reportId/approve

**Description:** Approve a full report

**Request Body:**
```json
{
  "comments": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "string",
    "status": "APPROVED",
    "approvedAt": "ISO date",
    "approvedBy": "string"
  }
}
```

**Side Effects:**
- Report status changes to `APPROVED`
- Task status changes to `COMPLETED`
- Notification sent to report author
- Audit log created

#### PATCH /reports/:reportId/request-revision

**Description:** Request revision for a full report

**Request Body:**
```json
{
  "comments": "string (required, min 20 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "id": "string",
    "status": "REVISION_REQUESTED",
    "revisionRequestedAt": "ISO date",
    "revisionComments": "string"
  }
}
```

**Side Effects:**
- Report status changes to `REVISION_REQUESTED`
- Task status reverts to `SURVEYED`
- Notification sent to report author
- Audit log created

### Broadcast

#### POST /notifications/broadcast

**Description:** Send broadcast message to field officers

**Request Body:**
```json
{
  "title": "string (required, max 100 chars)",
  "message": "string (required, max 500 chars)",
  "priority": "URGENT" | "NORMAL",
  "targetRole": "FIELD_OFFICER" | "ALL"
}
```

**Response:**
```json
{
  "success": true,
  "recipientCount": number,
  "message": "Broadcast sent successfully"
}
```

**Side Effects:**
- Notification created for each target user
- Push notification sent (if enabled)
- Audit log created

---

## 3. Validation Schemas

### AssignOfficerDto

```typescript
import { IsString, IsUUID } from 'class-validator';

export class AssignOfficerDto {
  @IsUUID()
  officerId: string;
}
```

### ApproveReportDto

```typescript
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ApproveReportDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comments?: string;
}
```

### RequestRevisionDto

```typescript
import { IsString, MinLength, MaxLength } from 'class-validator';

export class RequestRevisionDto {
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  comments: string;
}
```

### CreateBroadcastDto

```typescript
import { IsString, IsEnum, MaxLength, MinLength } from 'class-validator';

export class CreateBroadcastDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string;

  @IsString()
  @MinLength(10)
  @MaxLength(500)
  message: string;

  @IsEnum(['URGENT', 'NORMAL'])
  priority: 'URGENT' | 'NORMAL';

  @IsEnum(['FIELD_OFFICER', 'ALL'])
  targetRole: 'FIELD_OFFICER' | 'ALL';
}
```
