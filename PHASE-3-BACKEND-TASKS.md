# Phase 3: Report Generation Module - Backend Task Breakdown

**Document ID:** `PHASE-3-BACKEND-TASKS.md`  
**Date:** 12 พฤศจิกายน 2025  
**Assigned to:** ทีม Manus
**รายงานจากทีม:** Manus

---

## 🔴 BLOCKER Tasks

*These tasks are critical and must be completed first to unblock core functionality. The PDF generation is the main goal of this phase.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **DB-01** | 🔴 BLOCKER | **Extend Database Schema for Reports** | Modify `schema.prisma` to support the full report generation lifecycle. This is the foundational step for all other backend tasks. | - |
| **DB-02** | 🔴 BLOCKER | **Run Database Migration** | Apply the schema changes to the database using `prisma migrate dev`. | DB-01 |
| **DEP-01**| 🔴 BLOCKER | **Install PDF Generation Dependency** | Install `puppeteer` for server-side PDF rendering from HTML. | - |
| **SVC-01**| 🔴 BLOCKER | **Create PDF Generation Service** | Implement `PdfGeneratorService` to convert HTML content into a PDF file. This service will use Puppeteer. | DEP-01 |
| **API-01**| 🔴 BLOCKER | **Implement PDF Generation Endpoint** | Create the `POST /api/reports/:id/generate` endpoint to trigger the PDF creation process. | SVC-01, DB-01 |
| **API-02**| 🔴 BLOCKER | **Implement PDF Download Endpoint** | Create the `GET /api/reports/:id/pdf` endpoint to allow users to download the generated PDF file. | API-01 |

---

## 🟡 CORE Tasks

*These tasks are essential for the full functionality of the Report Generation Module, enabling dynamic and template-driven reports.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **DB-03** | 🟡 CORE | **Create Report Template Schema** | Add the `ReportTemplate` model to `schema.prisma` to store reusable report structures. | DB-01 |
| **DB-04** | 🟡 CORE | **Run Report Template Migration** | Apply the `ReportTemplate` schema changes to the database. | DB-03 |
| **SVC-02**| 🟡 CORE | **Create Report Template Service** | Implement `ReportTemplateService` for full CRUD (Create, Read, Update, Delete) operations on report templates. | DB-04 |
| **SVC-03**| 🟡 CORE | **Create HTML Template Rendering Service** | Implement a service to populate HTML templates with dynamic data from the `Report` model's `content` field. | SVC-01 |
| **API-03**| 🟡 CORE | **Implement Report Template API Endpoints** | Create all necessary endpoints for managing templates (`GET`, `POST`, `PATCH`, `DELETE` under `/api/reports/templates`). | SVC-02 |

---

## ⚪ OPTIONAL Tasks

*These tasks are enhancements that improve the system's usability and robustness but are not required for the initial release.*

| Task ID | Priority | Task Description | Details | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **SVC-04**| ⚪ OPTIONAL | **Implement PDF Caching** | Add a caching layer to store generated PDFs to reduce redundant processing. The `forceRegenerate` flag will bypass the cache. | SVC-01 |
| **SVC-05**| ⚪ OPTIONAL | **Implement Asynchronous PDF Generation** | Move PDF generation to a background job queue (e.g., using BullMQ) to prevent blocking the main thread for large reports. | SVC-01 |
| **LOG-01**| ⚪ OPTIONAL | **Add Detailed Logging for PDF Generation** | Implement comprehensive logging for the PDF generation process to track errors (`GENERATING`, `READY`, `ERROR` statuses). | SVC-01 |
| **TEST-01**| ⚪ OPTIONAL | **Write Unit & Integration Tests** | Create tests for all new services and endpoints to ensure reliability. | All Tasks |

---

### References:

1.  [GRD-WO-004-WEEK10-11-SPEC.md](/home/ubuntu/Guardian-Route/docs/work-orders/GRD-WO-004-WEEK10-11-SPEC.md)
2.  [system-completeness-report.md](/home/ubuntu/system-completeness-report.md)
