# Sprint 5: "My Tasks" Module - Technical Specification

**Document Version:** 1.0  
**Date:** Nov 09, 2025  
**Author:** Manus AI

---

## 1. Overview

This document outlines the technical plan for developing the **"งานของฉัน" (My Tasks)** module for Field Officers as part of Sprint 5. The goal is to create a functional interface for officers to manage assigned tasks, including viewing details, accepting jobs, and submitting preliminary field data using an interactive map.

---

## 2. Feature Breakdown & Implementation Plan

### 2.1. Task List & Acceptance (Day 1)

-   **Feature:** Display a list of tasks assigned to the logged-in Field Officer. Allow the officer to accept a task.
-   **Implementation Details:**
    -   A new page at `/tasks/my-tasks` will be created.
    -   Use React Query's `useQuery` to fetch data from a new API endpoint: `GET /api/tasks/assigned-to/me`.
    -   The list will display essential task information: ID, Title, Status, and Village Name.
    -   Each task item will be a link to the task detail page: `/tasks/:taskId`.
    -   On the detail page, a "รับงาน" (Accept Task) button will be present if the task status is `PENDING_ASSIGNMENT`.
    -   Clicking the button will trigger a `useMutation` hook to call `PATCH /api/tasks/:taskId/accept`, updating the status to `IN_PROGRESS`.

### 2.2. Map Integration & Drawing Tools (Day 2)

-   **Feature:** Integrate an interactive Leaflet map showing the task's location, allowing the officer to draw a disaster area (polygon) and place markers.
-   **Implementation Details:**
    -   Install `leaflet`, `react-leaflet`, `leaflet.pm`, and their corresponding type definitions (`@types/...`).
    -   Create a reusable `<LeafletMap>` component.
    -   The map will be centered on the task's initial GPS coordinates.
    -   Integrate `Leaflet.pm` to provide UI controls for drawing polygons and adding markers.
    -   A button will use the browser's Geolocation API to center the map on the user's current location.
    -   The component will manage the state of drawn polygons and markers (in GeoJSON format) and provide it to the parent component via callbacks.

### 2.3. Preliminary Data Form (Day 3)

-   **Feature:** A form for the officer to record preliminary findings.
-   **Implementation Details:**
    -   Create a `<PreliminaryReportForm>` component.
    -   The form will contain:
        -   `disasterType`: A dropdown populated from `GET /api/disaster-types`.
        -   `village`: A dropdown populated from `GET /api/villages`.
        -   `description`: A multi-line textarea.
    -   Use `react-hook-form` for efficient form state management and validation.
    -   Implement client-side validation to ensure all fields are filled before submission.

### 2.4. Submission Flow & Status Change (Day 4)

-   **Feature:** Submit the collected field data (form inputs, polygon, markers) to the backend and update the task status.
-   **Implementation Details:**
    -   The "บันทึก" (Save) button will be the trigger.
    -   On click, a `useMutation` hook will be called to send a `POST` request to a new endpoint: `POST /api/tasks/:taskId/preliminary-report`.
    -   The request payload will include:
        -   Form data (`disasterType`, `village`, `description`).
        -   Map data (`polygonCoordinates`, `markerCoordinates` in GeoJSON format).
    -   Upon successful API response, the task status will be updated to `SURVEY_COMPLETED`.
    -   A Chakra UI toast notification will be displayed to confirm successful submission.

### 2.5. Testing & Documentation (Day 5)

-   **Feature:** Ensure the module is robust and well-documented.
-   **Implementation Details:**
    -   **Manual Testing:** Create a checklist in `/docs/sprint-5/manual-test-cases.md` covering all user flows.
    -   **Unit Testing:** Write Vitest unit tests for critical logic, such as form validation and state transitions.
    -   **Documentation:** Update the project's documentation with details about the new components, API endpoints, and user flows.

---

## 3. Technical Architecture

### 3.1. Component Structure

```
/src
├── pages
│   └── tasks
│       ├── MyTasksPage.tsx
│       └── TaskDetailPage.tsx
├── components
│   ├── tasks
│   │   ├── TaskList.tsx
│   │   └── TaskListItem.tsx
│   ├── map
│   │   └── LeafletMap.tsx
│   └── forms
│       └── PreliminaryReportForm.tsx
└── hooks
    ├── useTaskMutations.ts
    └── useTaskQueries.ts
```

### 3.2. API Endpoints (Required from Backend)

| Method | Endpoint                               |
| :----- | :------------------------------------- |
| `GET`    | `/api/tasks/assigned-to/me`            |
| `GET`    | `/api/tasks/:taskId`                   |
| `PATCH`  | `/api/tasks/:taskId/accept`            |
| `POST`   | `/api/tasks/:taskId/preliminary-report`|
| `GET`    | `/api/disaster-types`                  |
| `GET`    | `/api/villages`                        |

### 3.3. Data Models (Frontend Interfaces)

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'PENDING_ASSIGNMENT' | 'IN_PROGRESS' | 'SURVEY_COMPLETED' | 'REPORT_COMPLETED';
  location: { lat: number; lng: number };
  village: { id: string; name: string };
  createdAt: string;
}

interface PreliminaryReportPayload {
  disasterTypeId: string;
  villageId: string;
  description: string;
  area: GeoJSON.Polygon;
  pointsOfInterest: GeoJSON.FeatureCollection<GeoJSON.Point>;
}
```

---

## 4. Timeline & Milestones

| Day   | Milestone                                      |
| :---- | :--------------------------------------------- |
| **1** | Task list and acceptance flow functional.        |
| **2** | Leaflet map with drawing tools integrated.     |
| **3** | Data form is built and validated.              |
| **4** | Full submission flow is working end-to-end.    |
| **5** | All manual tests pass; documentation complete. |

This specification will serve as the guiding document for the development of the "My Tasks" module. Any deviations or required changes will be documented and approved by the SA.
