# Executive Dashboard: Manual Test Cases

**Version:** 1.0
**Date:** 2025-11-10

This document outlines the manual test cases executed for the Executive Dashboard to ensure all features are working as expected.

**Overall Result:** ✅ **PASS** (All test cases passed)

---

## 1. Summary Cards & Layout

| Test Case | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| **TC-01: Load Dashboard** | 1. Log in as an EXECUTIVE. <br> 2. Navigate to `/executive/dashboard`. | The dashboard loads correctly with the header, 12 summary cards, and chart/map placeholders. | ✅ Pass |
| **TC-02: Data Display** | 1. Check the values in the summary cards. | All 12 cards display numerical data. Loading skeletons appear initially. | ✅ Pass |
| **TC-03: Responsive Design** | 1. Resize the browser window to mobile, tablet, and desktop sizes. | The layout adjusts correctly. Cards and charts stack vertically on mobile. | ✅ Pass |

---

## 2. Charts

| Test Case | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| **TC-04: Load Charts** | 1. Observe the chart section. | All 3 charts (Line, Pie, Bar) load with data. Loading skeletons appear initially. | ✅ Pass |
| **TC-05: Chart Tooltips** | 1. Hover over each chart. | Tooltips appear with relevant data (date, count, percentage). | ✅ Pass |
| **TC-06: Chart Legends** | 1. Check the legends for each chart. | Legends are visible and correctly label the data series. | ✅ Pass |

---

## 3. Filter System

| Test Case | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| **TC-07: Apply Date Filter** | 1. Select a date range. <br> 2. Click "ค้นหา". | All components (cards, charts, map) update to reflect the new date range. | ✅ Pass |
| **TC-08: Apply Type Filter** | 1. Select a disaster type. <br> 2. Click "ค้นหา". | All components update. The pie chart may show 100% for the selected type. | ✅ Pass |
| **TC-09: Apply Region Filter** | 1. Enter a province name. <br> 2. Click "ค้นหา". | All components update. The map zooms to the selected region. | ✅ Pass |
| **TC-10: Reset Filters** | 1. Apply any filter. <br> 2. Click "ล้างตัวกรอง". | All filters are cleared, and all components revert to the default state. | ✅ Pass |

---

## 4. Map

| Test Case | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| **TC-11: Load Map** | 1. Scroll to the map section. | The map loads with task markers. Markers are clustered. | ✅ Pass |
| **TC-12: Marker Popup** | 1. Click on a marker or cluster. | A popup appears with task details (title, status, etc.). | ✅ Pass |
| **TC-13: Map Filter Sync** | 1. Apply a filter (e.g., region). | The map updates to show only the tasks that match the filter. | ✅ Pass |

---

## 5. Export Functionality

| Test Case | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| **TC-14: Export to PDF** | 1. Click "ส่งออก" -> "Export as PDF". | A PDF file is downloaded. The file contains the summary, charts, and tasks list. | ✅ Pass |
| **TC-15: Export to Excel** | 1. Click "ส่งออก" -> "Export as Excel". | An Excel file is downloaded. The file contains 5 sheets with the correct data. | ✅ Pass |
| **TC-16: Export with Filters** | 1. Apply a filter. <br> 2. Export to PDF and Excel. | The exported files contain data that reflects the applied filters. | ✅ Pass |

---

## 6. Permissions

| Test Case | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| **TC-17: Role Display** | 1. Observe the header. | The user's name and role ("ผู้บริหาร") are displayed correctly. | ✅ Pass |
| **TC-18: Access Control** | 1. Log in as a SUPERVISOR or FIELD_OFFICER. <br> 2. Try to navigate to `/executive/dashboard`. | Access is denied, and the user is redirected. | ✅ Pass |
