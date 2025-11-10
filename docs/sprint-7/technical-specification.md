# Sprint 7: Supervisor Dashboard - Technical Specification

**Version:** 1.0
**Date:** 2025-11-10
**Author:** Manus AI

---

## 1. Introduction

This document outlines the technical specification for the Supervisor Dashboard module (Sprint 7). The goal is to create a centralized system for supervisors to manage disaster response tasks, from initial assignment to final report approval.

## 2. Feature Breakdown

| Feature | Description | Priority |
| :--- | :--- | :--- |
| **Kanban Dashboard** | Visual overview of all tasks by status | High |
| **Event Map** | Geographical view of all tasks | High |
| **Officer Assignment** | Assign tasks to available field officers | High |
| **Report Review** | Approve or request revisions for full reports | High |
| **Broadcast System** | Send urgent notifications to field officers | Medium |

---


## 3. System Architecture

### 3.1. Kanban Board

The Kanban Board is the central component of the Supervisor Dashboard, providing a visual representation of all tasks organized by their status. It allows supervisors to quickly assess the current state of disaster response operations.

### 2.1. Board Structure

#### Columns (Task Statuses)

| Column | Status | Description |
| :--- | :--- | :--- |
| **รอมอบหมาย** | `PENDING_ASSIGNMENT` | Tasks that have been created but not yet assigned to a field officer |
| **กำลังดำเนินการ** | `IN_PROGRESS` | Tasks assigned to field officers who are actively working on them |
| **สำรวจเสร็จแล้ว** | `SURVEYED` | Tasks where preliminary survey has been completed, awaiting full report |
| **รายงานเสร็จแล้ว** | `COMPLETED` | Tasks with completed full reports, awaiting supervisor review |

#### Card Structure

Each card represents a single task and displays:

- **Task Title** (from incident title)
- **Incident Type** (icon + label)
- **Priority** (badge: High/Medium/Low)
- **Location** (village name)
- **Assigned Officer** (name + avatar, if assigned)
- **Last Updated** (relative time)
- **Quick Actions** (view details, assign, review)

### 2.2. State Management

#### Data Flow

```
API → useSupervisorTasks Hook → KanbanContext → KanbanBoard Component → TaskCard Components
```

#### KanbanContext

Provides centralized state for:
- **tasks**: Array of all tasks grouped by status
- **selectedTaskId**: Currently selected task (for map sync)
- **isLoading**: Loading state
- **error**: Error state
- **filters**: Active filters (priority, incident type, date range)

#### Actions

- `fetchTasks()`: Load all tasks from API
- `selectTask(taskId)`: Set selected task and trigger map zoom
- `assignOfficer(taskId, officerId)`: Assign officer to task
- `updateTaskStatus(taskId, newStatus)`: Update task status (if drag-and-drop is enabled)
- `applyFilters(filters)`: Filter tasks by criteria

### 2.3. Component Hierarchy

```
<KanbanBoard>
  <KanbanFilters />
  <KanbanColumns>
    <KanbanColumn status="PENDING_ASSIGNMENT">
      <TaskCard />
      <TaskCard />
      ...
    </KanbanColumn>
    <KanbanColumn status="IN_PROGRESS">
      ...
    </KanbanColumn>
    <KanbanColumn status="SURVEYED">
      ...
    </KanbanColumn>
    <KanbanColumn status="COMPLETED">
      ...
    </KanbanColumn>
  </KanbanColumns>
</KanbanBoard>
```

### 2.4. Drag-and-Drop (Optional)

Using `@hello-pangea/dnd` (formerly react-beautiful-dnd):

- Drag cards between columns to change status
- Optimistic UI updates
- Revert on API failure
- Audit log for status changes

**Note:** For MVP, drag-and-drop can be disabled and status changes done via modals only.

### 2.5. Performance Optimization

- **Virtualization**: Use `react-window` if >100 tasks per column
- **Memoization**: Memoize TaskCard components
- **Lazy Loading**: Load task details on demand
- **Debounced Filters**: Debounce filter changes to reduce API calls

### 2.6. Responsive Design

- **Desktop**: 4 columns side-by-side
- **Tablet**: 2 columns, scrollable
- **Mobile**: 1 column, tabs for status switching




### 3.2. Map Integration & Sync

The Supervisor Map provides a geographical view of all active tasks, allowing supervisors to understand the spatial distribution of incidents and quickly navigate to specific locations.

### 3.1. Map Features

#### Core Functionality

- **Display Markers**: Show all tasks as markers on the map
- **Color-Coded**: Markers colored by task status
  - 🔴 Red: `PENDING_ASSIGNMENT`
  - 🟡 Yellow: `IN_PROGRESS`
  - 🔵 Blue: `SURVEYED`
  - 🟢 Green: `COMPLETED`
- **Clustering**: Group nearby markers when zoomed out (using `react-leaflet-cluster
- **Popup**: Show task summary on marker click
- **Highlight**: Highlight selected marker when task is selected from Kanban

#### Advanced Features

- **Zoom to Task**: Automatically zoom and pan to a task's location when selected
- **Filter Sync**: Apply same filters as Kanban board
- **Heatmap Layer**: Optional heatmap showing incident density
- **Draw Tools**: Optional tools for supervisors to mark areas of concern

### 3.2. Sync Mechanism

#### Kanban → Map Sync

**Trigger:** User clicks a task card in Kanban

**Flow:**
1. User clicks task card
2. `selectTask(taskId)` is called in KanbanContext
3. `selectedTaskId` state is updated
4. Map component observes `selectedTaskId` change
5. Map finds marker with matching `taskId`
6. Map highlights marker (change icon/color)
7. Map zooms to marker location (with animation)

#### Map → Kanban Sync

**Trigger:** User clicks a marker on the map

**Flow:**
1. User clicks marker
2. Marker click handler calls `selectTask(taskId)`
3. `selectedTaskId` state is updated
4. Kanban component observes `selectedTaskId` change
5. Kanban scrolls to the task card
6. Task card is highlighted (border/shadow effect)

### 3.3. Component Structure

```tsx
<SupervisorMap>
  <MapContainer>
    <TileLayer />
    <MarkerClusterGroup>
      {tasks.map(task => (
        <TaskMarker
          key={task.id}
          task={task}
          isSelected={task.id === selectedTaskId}
          onClick={() => selectTask(task.id)}
        />
      ))}
    </MarkerClusterGroup>
    {selectedTask && (
      <MapController
        center={selectedTask.location}
        zoom={15}
      />
    )}
  </MapContainer>
</SupervisorMap>
```

### 3.4. Data Requirements

Each task must have:
- `location`: `{ lat: number, lng: number }`
- `status`: Task status for marker color
- `title`: For popup display
- `priority`: For marker icon variation

### 3.5. Performance Considerations

- **Lazy Rendering**: Only render markers in viewport
- **Clustering**: Reduce marker count at low zoom levels
- **Debounced Zoom**: Debounce zoom/pan events to reduce re-renders
- **Memoization**: Memoize marker components

### 3.6. User Experience

- **Smooth Animations**: Use Leaflet's built-in animations for zoom/pan
- **Loading States**: Show skeleton while map loads
- **Error Handling**: Gracefully handle missing location data
- **Mobile**: Touch-friendly markers and popups

## 4. Data Models & API Contracts

### 4.1. Data Models

#### SupervisorTaskView

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

#### AvailableOfficer

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

#### BroadcastMessage

```typescript
interface BroadcastMessage {
  title: string;
  message: string;
  priority: 'URGENT' | 'NORMAL';
  targetRole: 'FIELD_OFFICER' | 'ALL';
}
```

#### ReportReviewAction

```typescript
interface ReportReviewAction {
  action: 'APPROVE' | 'REQUEST_REVISION';
  comments?: string; // Required for REQUEST_REVISION
  reviewedBy: string; // Supervisor ID
}
```

### 4.2. API Endpoints

#### Task Management

##### GET /tasks/supervisor-view

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

##### PATCH /tasks/:taskId/assign

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

#### Officer Management

##### GET /users/available-officers

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

#### Report Review

##### PATCH /reports/:reportId/approve

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

##### PATCH /reports/:reportId/request-revision

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

#### Broadcast

##### POST /notifications/broadcast

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

### 4.3. Validation Schemas

#### AssignOfficerDto

```typescript
import { IsString, IsUUID } from 'class-validator';

export class AssignOfficerDto {
  @IsUUID()
  officerId: string;
}
```

#### ApproveReportDto

```typescript
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ApproveReportDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comments?: string;
}
```

#### RequestRevisionDto

```typescript
import { IsString, MinLength, MaxLength } from 'class-validator';

export class RequestRevisionDto {
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  comments: string;
}
```

#### CreateBroadcastDto

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

## 5. Implementation Timeline

| Day       | Focus                            | Key Deliverables                              |
| --------- | -------------------------------- | --------------------------------------------- |
| **Day 1** | Kanban Dashboard + Task APIs     | `/dashboard`, `useSupervisorTasks`, Kanban UI |
| **Day 2** | แผนที่ + การ Sync กับการ์ด       | Map integration, highlight/zoom               |
| **Day 3** | Assign Modal + มอบหมายงาน        | AssignOfficerModal, API integration           |
| **Day 4** | ตรวจสอบรายงาน + Approve / Reject | Drawer + Approve APIs                         |
| **Day 5** | Broadcast + Testing + Docs + PR  | Notification, Manual test cases, PR           |

## 6. Testing Strategy

### Unit Tests

- `useSupervisorTasks` hook logic
- `KanbanContext` state transitions
- `assignOfficer` validation
- `broadcastMessage` validation

### Integration Tests

- Kanban board rendering with API data
- Map and Kanban sync mechanism
- Full assignment flow (modal -> API -> UI update)
- Full report review flow (drawer -> API -> UI update)

### Manual Tests

- Create comprehensive test cases covering all features
- Test on different screen sizes (desktop, tablet, mobile)
- Test with various data scenarios (no tasks, many tasks, etc.)
- Test error handling and edge cases
