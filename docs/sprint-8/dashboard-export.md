# Executive Dashboard Export Structure

**Version:** 1.0
**Date:** 2025-11-10

This document outlines the structure and content of the PDF and Excel export functionalities for the Executive Dashboard.

---

## 1. PDF Export (`executive-dashboard-YYYY-MM-DD.pdf`)

The PDF export is designed for reporting and presentation purposes. It provides a high-level overview of the dashboard with visual elements.

### 1.1. Content Sections

| Section | Content | Details |
| :--- | :--- | :--- |
| **Header** | Report Title & Date | "Executive Dashboard Report" and the export timestamp (Thai locale). |
| **Summary** | Key Statistics | A table of 7 key metrics and 5 task status counts. |
| **Charts** | Visualizations | All 3 charts (Task Trends, Incident Distribution, Tasks by Region) are captured as high-resolution images. |
| **Tasks List** | Top 20 Tasks | A list of the first 20 tasks matching the current filters, with a note indicating the total number of remaining tasks. |

### 1.2. Technical Implementation

- **Libraries:** `jspdf`, `html2canvas`
- **Process:**
  1. A new `jsPDF` instance is created (A4, portrait).
  2. The header and summary sections are rendered as text.
  3. `html2canvas` captures the `.charts-section` div as a PNG image (scale: 2).
  4. The image is added to the PDF, with auto-scaling to fit the page width.
  5. The tasks list is rendered as text.
  6. Auto page breaks are handled to prevent content overflow.
  7. The PDF is saved with a date-stamped filename.

---

## 2. Excel Export (`executive-dashboard-YYYY-MM-DD.xlsx`)

The Excel export is designed for raw data analysis and provides detailed information in a multi-sheet workbook.

### 2.1. Workbook Sheets

| Sheet Name | Columns | Description |
| :--- | :--- | :--- |
| **Summary** | `Metric`, `Value` | Key metrics and task status breakdowns. |
| **Task Trends** | `date`, `total`, `completed`, `inProgress`, `pending` | Daily task trend data. |
| **Incident Distribution** | `type`, `count`, `percentage` | Disaster type distribution data. |
| **Tasks by Region** | `region`, `count` | Top 10 regions by task count. |
| **Tasks** | 7 columns | A full list of all tasks matching the filters, with detailed information. |

### 2.2. Technical Implementation

- **Library:** `xlsx`
- **Process:**
  1. A new workbook is created.
  2. Data for each sheet is prepared in JSON format.
  3. `XLSX.utils.json_to_sheet()` converts the JSON data to a worksheet.
  4. Each worksheet is appended to the workbook with a specific name.
  5. `XLSX.writeFile()` saves the workbook with a date-stamped filename.

---

### 3. Data Flow

1. The `ExportButton` component receives all necessary data from the `ExecutiveDashboardPage` (summary, trends, distribution, regions, tasks).
2. When an export option is selected, the corresponding method in the `useExport` hook is called.
3. The hook processes the data and generates the file (PDF or Excel).
4. The file is automatically downloaded by the browser.
5. A toast notification indicates the success or failure of the export.
