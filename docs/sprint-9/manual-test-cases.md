# Resource Management Manual Test Cases

| Test Case | Steps | Expected Result | Actual Result |
| :--- | :--- | :--- | :--- |
| **CRUD** | | | |
| Create Resource | 1. Click "Add Resource" 2. Fill form 3. Click "Save" | Resource created, table updates | Pass |
| Update Resource | 1. Click "Edit" 2. Change data 3. Click "Save" | Resource updated, table updates | Pass |
| Delete Resource | 1. Click "Delete" 2. Confirm | Resource deleted, table updates | Pass |
| **Allocation** | | | |
| Allocate AVAILABLE | 1. Click "Allocate" on AVAILABLE resource 2. Select task 3. Click "Allocate" | Allocation successful, status -> IN_USE | Pass |
| Allocate IN_USE | 1. Click "Allocate" on IN_USE resource | Button disabled | Pass |
| Reclaim Active | 1. View history 2. Click "Reclaim" on active allocation | Reclaim successful, status -> AVAILABLE | Pass |
| **Roles** | | | |
| EXECUTIVE Access | 1. Login as EXECUTIVE 2. View Resource Dashboard | Can view, cannot edit/delete/allocate | Pass |
| FIELD_OFFICER Access | 1. Login as FIELD_OFFICER 2. Access /resources | Redirected, no access | Pass |
| **Export** | | | |
| Export PDF | 1. Click "Export" -> "PDF" | PDF downloaded | Pass |
| Export Excel | 1. Click "Export" -> "Excel" | Excel downloaded | Pass |
