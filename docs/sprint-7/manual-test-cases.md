'''
# Sprint 7: Supervisor Dashboard - Manual Test Cases

**Test Objective:** To verify the functionality and integration of all features within the Supervisor Dashboard, ensuring a seamless and robust experience for the supervisor role.

**Tester:** Manus AI
**Date:** 2023-10-28

--- 

## 1. Kanban Board Functionality

| Test Case ID | Feature | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| KAN-001 | Load Tasks | Open the Supervisor Dashboard. | All tasks are fetched and displayed in the correct columns (PENDING_ASSIGNMENT, IN_PROGRESS, SURVEYED, COMPLETED). | PENDING |
| KAN-002 | Task Card Display | View a task card in any column. | The card correctly displays priority, disaster icon, title, location, and last updated time. | PENDING |
| KAN-003 | Task Selection | Click on a task card. | The card is highlighted with a blue ring. The map pans to the corresponding task marker. | PENDING |
| KAN-004 | Refresh Button | Click the "Refresh" button. | The Kanban board re-fetches and displays the latest task data without a full page reload. | PENDING |

---

## 2. Map Integration & 2-Way Sync

| Test Case ID | Feature | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| MAP-001 | Map Load | Open the Supervisor Dashboard. | The map loads with task markers clustered correctly. | PENDING |
| MAP-002 | Marker Colors | Observe markers on the map. | Markers are color-coded according to task status: Red (PENDING_ASSIGNMENT), Yellow (IN_PROGRESS), Blue (SURVEYED), Green (COMPLETED). | PENDING |
| MAP-003 | Marker Click (Map -> Kanban) | Click on a map marker or cluster. | The map zooms in. Clicking a single marker highlights it, and the corresponding task card in the Kanban board scrolls into view and is selected. | PENDING |
| MAP-004 | Kanban Click (Kanban -> Map) | Click on a task card in the Kanban board. | The map smoothly pans and zooms ("flyTo") to the corresponding marker, which becomes selected. | PENDING |
| MAP-005 | Marker Popup | Click on a single marker on the map. | A popup appears showing a summary of the task (Title, Status, Priority). | PENDING |

---

## 3. Officer Assignment

| Test Case ID | Feature | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| ASN-001 | Open Assign Modal | Click the "มอบหมายงาน" button on a `PENDING_ASSIGNMENT` task. | The "Assign Officer" modal opens. | PENDING |
| ASN-002 | Load Officers | View the officer list in the modal. | A list of available `FIELD_OFFICER`s is displayed, sorted by lowest workload first. | PENDING |
| ASN-003 | Search Officer | Use the search bar to type an officer's name. | The list filters to show only officers matching the search query. | PENDING |
| ASN-004 | Select Officer | Click on an officer from the list. | The officer is visually selected. The "Assign" button becomes enabled. | PENDING |
| ASN-005 | Assign Task | Select an officer and click "Assign". | The task is assigned. A success toast appears. The modal closes. The Kanban board refreshes, and the task card moves to the `IN_PROGRESS` column. | PENDING |
| ASN-006 | Assign Validation | Try to assign a task to an officer with 5 or more tasks. | The officer should be disabled or the API should return an error, and a failure toast should be displayed. | PENDING |

---

## 4. Report Review

| Test Case ID | Feature | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| REV-001 | Open Review Drawer | Click the "ตรวจสอบ" button on a `SURVEYED` task with a `PENDING_REVIEW` report. | The "Review Report" drawer slides in from the right, displaying full report details. | PENDING |
| REV-002 | Report Details | Inspect the content of the drawer. | All report sections (Basic Info, Damage, AI Analysis, Images, etc.) are displayed correctly and are well-formatted. | PENDING |
| REV-003 | Approve Report | Click "Approve Report" and confirm in the dialog. | A success toast appears. The drawer closes. The Kanban board refreshes, and the task card moves to the `COMPLETED` column with an "Approved" status badge. | PENDING |
| REV-004 | Request Revision | Click "Request Revision", enter a comment (>20 chars), and submit. | A success toast appears. The drawer closes. The Kanban board refreshes, and the task card stays in `SURVEYED` but shows a "Revision Required" status badge. | PENDING |
| REV-005 | Revision Validation | Try to submit a revision request with a comment < 20 characters. | The submit button is disabled, and a validation message is shown. | PENDING |

---

## 5. Broadcast System

| Test Case ID | Feature | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| BCT-001 | Open Broadcast Dialog | Click the "📢 Broadcast" button in the dashboard header. | The "Send Broadcast" dialog opens. | PENDING |
| BCT-002 | Form Validation | Try to submit the form with an empty title or message. | The submit button is disabled. Input fields show a red border and a validation message (e.g., "Min 5 characters"). | PENDING |
| BCT-003 | Send Broadcast (All) | Fill out all fields, select target "All Staff", and click "Send Broadcast". | A success alert/toast appears with the correct recipient count. The dialog closes and the form resets. | PENDING |
| BCT-004 | Send Broadcast (Field Officers) | Fill out all fields, select target "Field Officers Only", and click "Send Broadcast". | A success alert/toast appears with the correct recipient count (only field officers). The dialog closes and the form resets. | PENDING |
| BCT-005 | Cancel Dialog | Open the dialog, enter some text, and click "Cancel" or the backdrop. | The dialog closes, and the form fields are reset for the next time it opens. | PENDING |
'''
