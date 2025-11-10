# Resource Management Export Structure

This document outlines the structure of the exported files from the Resource Management module.

## PDF Export

- **Library:** `jspdf`, `html2canvas`
- **Filename:** `resources-YYYY-MM-DD.pdf`
- **Content:**
  - Header: "Resource Report", Export Date
  - Table: 6 columns (ID, Name, Type, Status, Location, Registration)
  - Signature: "Exported by: Guardian-Route System"

## Excel Export

- **Library:** `xlsx`
- **Filename:** `resources-YYYY-MM-DD.xlsx`
- **Sheet:** "Resources"
- **Columns:** ID, Name, Type, Status, Location, Registration Number, Created At, Updated At
