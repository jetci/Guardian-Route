# Sprint 6: Full Report Wizard - Technical & User Documentation

**Version:** 1.0
**Date:** 2025-11-10

---

## 1. Overview

The Full Report Wizard is a 10-step form designed to guide users from the Report Team in creating comprehensive disaster reports. It leverages data from preliminary surveys, integrates AI-powered image analysis, and ensures data integrity through multi-layered validation.

## 2. Key Features

- **10-Step Wizard:** A guided, step-by-step process to ensure all necessary information is captured.
- **State Management:** Uses React Context (`WizardContext`) for robust state management across all steps.
- **Auto-Save & Drafts:** Automatically saves progress to `localStorage` every 30 seconds and allows manual saving to a backend.
- **AI-Powered Image Analysis:** Integrates with Gemini Vision API to analyze uploaded images and provide structured data on damage, hazards, and recommendations.
- **Editable AI Suggestions:** Users can review and edit AI-generated data, with all changes tracked in an audit log.
- **Comprehensive Validation:** Multi-layered validation using Zod (frontend), DTOs (backend), and service-layer checks.
- **Audit Trail:** Logs critical actions, including AI data edits and final submission, for transparency and accountability.
- **Dynamic Fields:** Supports dynamic addition and removal of fields for resources and responding agencies.

## 3. Architecture

### Frontend

- **WizardContainer:** Main component that manages step navigation, progress bar, and the submit button.
- **WizardContext:** A React Context that holds the entire form state, current step, and functions for navigation and data updates.
- **Step Components:** Each of the 10 steps is a separate component, responsible for its own layout and inputs.
- **Validation Schemas:** Zod schemas are defined for each step to ensure data integrity.
- **Hooks:**
  - `useSubmitFullReport`: Encapsulates all logic for final validation and submission.
  - `useAuditTrail`: Provides functions to log user actions.

### Backend

- **ReportController:** Exposes endpoints for creating drafts, analyzing images, and submitting the full report.
- **ReportService:** Contains the core business logic for creating and managing reports.
- **GeminiService:** A dedicated service to interact with the Gemini Vision API.
- **Prisma Models:** `Report`, `Task`, and `AuditLog` models are used to store data.

## 4. User Guide

1.  **Start Wizard:** Navigate to a task with status `SURVEYED` and click "Create Full Report".
2.  **Fill Data:** Proceed through the 10 steps, filling in all required information. Your progress is saved automatically.
3.  **Upload Images (Step 8):** Upload up to 5 images. The system will show a preview and upload status.
4.  **Review AI Analysis (Step 9):** The system will automatically analyze the images. Review the AI-generated data and click "Edit" to make corrections.
5.  **Submit Report (Step 10):** After filling in the final recommendations, click the "Submit Report" button. A confirmation dialog will appear. Confirm to send the report for review.

## 5. Audit Trail Specification

The audit trail is crucial for accountability. The following actions are logged:

| Action | Trigger | Data Logged |
| :--- | :--- | :--- |
| **AI_EDIT** | User saves changes to AI-generated data | `field`, `oldValue`, `newValue`, `timestamp` |
| **SUBMIT_REPORT** | User submits the full report | `reportId`, `taskId`, `timestamp` |
| **CREATE_DRAFT** | User manually saves a draft | `draftId`, `timestamp` |

This data is stored in the `AuditLog` table in the database.
