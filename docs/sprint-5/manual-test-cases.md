# Sprint 5: "My Tasks" - Manual Test Cases

**Test Cycle:** 1  
**Tester:** Manus AI  
**Date:** Nov 09, 2025

---

## 1. Task List & View (MyTasksPage)

| Test Case ID | Description | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-01** | View "My Tasks" page with assigned tasks | 1. Login as Field Officer.<br>2. Navigate to `/tasks/my-tasks`. | Page loads successfully.<br>Tasks are displayed and grouped by status: "รอรับงาน", "กำลังดำเนินการ", "สำรวจแล้ว". | ☐ Pass |
| **MT-02** | View "My Tasks" page with no tasks | 1. Login as Field Officer with no assigned tasks. | Page displays an "ไม่มีงานในขณะนี้" (No tasks at the moment) message. | ☐ Pass |
| **MT-03** | Task card information | 1. View any task card in the list. | The card correctly displays: Title, Status, Priority, Village Name, and Due Date. | ☐ Pass |
| **MT-04** | Navigate to Task Detail | 1. Click on any task card. | The user is navigated to the correct `/tasks/:taskId` page. | ☐ Pass |

---

## 2. Task Acceptance & Status Change

| Test Case ID | Description | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-05** | View "Accept Task" button | 1. Navigate to a task detail page with `PENDING` status. | The "รับงาน" (Accept Task) button is visible and enabled. | ☐ Pass |
| **MT-06** | Hide "Accept Task" button for other statuses | 1. Navigate to a task with `IN_PROGRESS` or `SURVEYED` status. | The "รับงาน" button is not visible. | ☐ Pass |
| **MT-07** | Accept a task | 1. Click the "รับงาน" button. | A success toast appears.<br>The task status updates to `IN_PROGRESS` on the UI.<br>The "เริ่มการสำรวจ" (Start Survey) button appears. | ☐ Pass |

---

## 3. Field Survey Form & Map Interaction

| Test Case ID | Description | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-08** | Open Field Survey Form | 1. On an `IN_PROGRESS` task, click "เริ่มการสำรวจ". | The `FieldSurveyFormEnhanced` component is displayed. | ☐ Pass |
| **MT-09** | Map: Use GPS button | 1. On the map, click the "GPS" button. | The map centers on the user's current location (mocked).<br>A success toast appears. | ☐ Pass |
| **MT-10** | Map: Place a marker | 1. Click the "ปักหมุด" button.<br>2. Click on the map. | A marker is placed at the clicked location.<br>The coordinates are displayed below the map. | ☐ Pass |
| **MT-11** | Map: Draw a polygon | 1. Click the "วาดพื้นที่" button.<br>2. Click multiple points on the map.<br>3. Click "เสร็จสิ้น" (Complete). | A polygon is drawn connecting the points.<br>The number of points is displayed below the map. | ☐ Pass |
| **MT-12** | Map: Clear drawings | 1. Place a marker or draw a polygon.<br>2. Click the "ล้างทั้งหมด" (Clear All) button. | The marker and/or polygon are removed from the map. | ☐ Pass |

---

## 4. Form Submission & Validation

| Test Case ID | Description | Steps | Expected Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MT-13** | Submit with empty form | 1. Open the survey form.<br>2. Click "บันทึกข้อมูล" (Save Data) without filling anything. | A warning toast appears.<br>Error messages are displayed under each required field (Disaster Type, Village, Notes, Map). | ☐ Pass |
| **MT-14** | Submit with partial form (no map) | 1. Fill in Disaster Type, Village, and Notes.<br>2. Do not interact with the map.<br>3. Click "บันทึกข้อมูล". | A warning toast appears.<br>An error message is displayed for the map section. | ☐ Pass |
| **MT-15** | Submit with partial form (no text) | 1. Place a marker on the map.<br>2. Do not fill in the form fields.<br>3. Click "บันทึกข้อมูล". | A warning toast appears.<br>Error messages are displayed for the form fields. | ☐ Pass |
| **MT-16** | Successful submission | 1. Fill all required fields (Disaster Type, Village, Notes).<br>2. Place a marker or draw a polygon.<br>3. Click "บันทึกข้อมูล". | A success toast appears.<br>The user is navigated back to the `/tasks/my-tasks` page.<br>The task now appears under the "สำรวจแล้ว" (Surveyed) section. | ☐ Pass |
| **MT-17** | Cancel survey | 1. Open the survey form.<br>2. Click the "ยกเลิก" (Cancel) button. | The user is returned to the Task Detail view. | ☐ Pass |

