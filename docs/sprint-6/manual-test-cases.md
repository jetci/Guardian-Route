# Sprint 6: Full Report Wizard - Manual Test Cases

**Version:** 1.0
**Date:** 2025-11-10

---

## 1. Wizard Foundation & Navigation

| Test Case ID | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-WIZ-001 | **Navigate between steps** | 1. Open wizard. 2. Click "Next". 3. Click "Previous". | 1. Can move forward and backward. 2. Progress bar and step indicator update correctly. |
| TC-WIZ-002 | **Save and load draft** | 1. Fill data in Step 1. 2. Wait 30s. 3. Refresh page. 4. Re-open wizard. | 1. Data is auto-saved. 2. Data is loaded correctly from localStorage. |
| TC-WIZ-003 | **Manual save draft** | 1. Fill data. 2. Click "Save Draft". 3. Clear localStorage. 4. Refresh. | 1. Toast notification "Saved successfully". 2. Data is not loaded. |

## 2. Form Validation (Steps 1-10)

| Test Case ID | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-VAL-001 | **Required fields (Step 1)** | 1. Leave "Report Title" blank. 2. Click "Next". | 1. Error message shown. 2. Cannot proceed to next step. |
| TC-VAL-002 | **Min length (Step 1)** | 1. Enter "Test" in "Report Title". 2. Click "Next". | 1. Error message "Must be at least 10 characters". 2. Cannot proceed. |
| TC-VAL-003 | **Cross-field (Step 5)** | 1. Enter `Injuries > 0`. 2. Leave `Casualty Details` blank. | 1. Error message shown. 2. Cannot proceed. |
| TC-VAL-004 | **Dynamic fields (Step 6)** | 1. Click "Add Item". 2. Fill data. 3. Click "Remove". | 1. New fields appear. 2. Data is stored. 3. Fields are removed. |
| TC-VAL-005 | **Final recommendations (Step 10)** | 1. Leave "General Recommendations" blank. 2. Try to submit. | 1. Submit button is disabled. 2. Validation error message is shown. |

## 3. Image Upload & AI Analysis (Steps 8-9)

| Test Case ID | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-IMG-001 | **Upload valid images** | 1. Upload 3 valid images (<20MB). | 1. Previews shown. 2. Status changes: uploading -> success. 3. URLs stored in state. |
| TC-IMG-002 | **Upload invalid size** | 1. Upload 1 image > 20MB. | 1. Preview shown. 2. Status changes to "failed" with error message. |
| TC-IMG-003 | **Upload max images** | 1. Upload 5 images. 2. Try to upload a 6th. | 1. Upload area is hidden. 2. Cannot upload more. |
| TC-AI-001 | **Auto-trigger AI analysis** | 1. Upload images in Step 8. 2. Go to Step 9. | 1. AI analysis starts automatically. 2. Skeleton loader is shown. |
| TC-AI-002 | **AI analysis success** | 1. Wait for analysis to complete. | 1. AIAnalysisCard is shown with data. 2. Data is stored in wizard state. |
| TC-AI-003 | **Edit AI analysis** | 1. Click "Edit". 2. Change "Damage Level". 3. Click "Save". | 1. Fields become editable. 2. Data is updated. 3. Audit log is created (verify in console). |

## 4. Submission Flow

| Test Case ID | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| TC-SUB-001 | **Submit with valid data** | 1. Fill all required fields. 2. Go to Step 10. 3. Click "Submit". 4. Confirm. | 1. Submission successful. 2. Redirected to task page. 3. Toast notification shown. |
| TC-SUB-002 | **Submit with invalid data** | 1. Leave a required field blank. 2. Go to Step 10. | 1. Submit button is disabled. 2. Validation error is shown. |
| TC-SUB-003 | **Submit without AI analysis** | 1. Upload images. 2. Skip AI analysis (if possible). 3. Try to submit. | 1. Submit button is disabled. 2. Validation error "Please wait for AI analysis". |
