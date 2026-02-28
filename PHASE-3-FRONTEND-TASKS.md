# Phase 3: Report Generation Module - Frontend Task Breakdown

**Document ID:** `PHASE-3-FRONTEND-TASKS.md`  
**Date:** 12 พฤศจิกายน 2025  
**Assigned to:** ทีม Manus
**รายงานจากทีม:** Manus

---

## 🔴 BLOCKER Tasks

*These tasks are the absolute minimum required to allow users to generate and download a PDF report. The focus is on functionality over form.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **API-01** | 🔴 BLOCKER | **Update API Client for Reports** | Create/update the API client (`/frontend/src/api/reports.ts`) to include functions for the new backend endpoints: `generateReportPdf`, `downloadReportPdf`, and all `/templates` endpoints. | Backend API-01, API-02, API-03 |
| **UI-01** | 🔴 BLOCKER | **Add "Generate PDF" Button** | In the `ReportsList` or `ReportDetails` component, add a button that calls the `generateReportPdf` API function. This button should be disabled if the report status is not appropriate (e.g., already `READY`). | API-01 |
| **UI-02** | 🔴 BLOCKER | **Add "Download PDF" Button** | Add a button that becomes active when `report.pdfUrl` is available. Clicking it should open the URL to download the file. | API-01 |
| **UI-03** | 🔴 BLOCKER | **Display PDF Generation Status** | In the `ReportsList` and `ReportDetails` pages, display the report's PDF status (`DRAFT`, `GENERATING`, `READY`, `ERROR`) using badges. This provides essential feedback to the user. | Backend DB-01 |

---

## 🟡 CORE Tasks

*These tasks implement the full user experience as specified in the technical documents, including template management and report previews.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **COMP-01**| 🟡 CORE | **Create `ReportViewer` Component** | Develop the `ReportViewer.tsx` component to render an HTML preview of the report based on the `report.content` JSON data. This allows users to see what they are generating. | - |
| **COMP-02**| 🟡 CORE | **Create Template-Specific Previews** | Create child components for `ReportViewer` (e.g., `IncidentSummaryPreview.tsx`, `SurveyResultsPreview.tsx`) to handle the rendering logic for different report types. | COMP-01 |
| **UI-04** | 🟡 CORE | **Integrate Template Selection in Form** | Modify the `ReportForm` to allow users to select a `ReportTemplate` when creating a new report. This will require fetching available templates from the API. | Backend API-03 |
| **PAGE-01**| 🟡 CORE | **Create Report Template Management Page** | Build a new page (`/pages/admin/ReportTemplatesPage.tsx`) that uses a `ReportTemplateManager` component for full CRUD operations on templates. | Backend API-03 |

---

## ⚪ OPTIONAL Tasks

*These are enhancements for a better user experience and for improving code quality.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **UI-05** | ⚪ OPTIONAL | **Add PDF Generation Loading State** | Implement a loading indicator or modal that appears after the user clicks "Generate PDF" and disappears when the status changes to `READY` or `ERROR`. | UI-01 |
| **UI-06** | ⚪ OPTIONAL | **Real-time Status Updates** | Use WebSocket or polling to automatically refresh the report status without requiring a manual page reload. | - |
| **COMP-03**| ⚪ OPTIONAL | **Create a Generic `ReportPreview` Component** | Refactor the template-specific components to use a single, more generic `ReportPreview.tsx` that can render various data structures, making the system more scalable. | COMP-02 |
| **TEST-02**| ⚪ OPTIONAL | **Write E2E Tests for Report Flow** | Use a framework like Cypress or Playwright to create end-to-end tests for the entire report generation and download process. | All Tasks |

---

### References:

1.  [GRD-WO-004-WEEK10-11-SPEC.md](/home/ubuntu/Guardian-Route/docs/work-orders/GRD-WO-004-WEEK10-11-SPEC.md)
2.  [system-completeness-report.md](/home/ubuntu/system-completeness-report.md)
