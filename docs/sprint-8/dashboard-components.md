> # Executive Dashboard: Component & Hook Architecture

**Version:** 1.0
**Date:** 2025-11-10

This document provides an overview of the React components and hooks created for the Executive Dashboard in Sprint 8.

---

## 1. Page Component

| Component | Description |
| :--- | :--- |
| `ExecutiveDashboardPage` | The main container for the dashboard. It manages the filter state and orchestrates data fetching and rendering for all child components. |

---

## 2. Core Components

| Component | Description |
| :--- | :--- |
| `SummaryCard` | A reusable card component to display a single statistic (e.g., "Total Tasks"). Includes a title, value, and icon. |
| `ExecutiveFilterBar` | A form component with 5 filter fields (date range, disaster type, priority, region) and action buttons (Apply, Reset). |
| `ExportButton` | A dropdown button for exporting the dashboard data to PDF or Excel. Manages the export process and loading states. |
| `UserRoleBadge` | A small component to display the current user's name and color-coded role badge. |

---

## 3. Chart Components

All chart components are built with `recharts` and include responsive containers, loading states, and empty states.

| Component | Chart Type | Description |
| :--- | :--- | :--- |
| `TaskTrendsChart` | Line Chart | Displays daily task trends with 4 lines (total, completed, in progress, pending). |
| `IncidentDistributionChart` | Pie Chart | Shows the distribution of incidents by disaster type, with percentages. |
| `TasksByRegionChart` | Bar Chart | Displays the top 10 regions by task count. |

---

## 4. Map Components

| Component | Description |
| :--- | :--- |
| `ExecutiveMap` | A Leaflet map container that displays all tasks. It uses `react-leaflet-cluster` for marker clustering. |
| `ExecutiveTaskMarker` | A custom marker component that displays a task on the map with a status-based color and a detailed popup. |

---

## 5. Hooks (Data Fetching & Logic)

| Hook | Description |
| :--- | :--- |
| `useExecutiveDashboard` | Fetches the main summary statistics from the `/executive/dashboard/summary` endpoint. |
| `useChartData` | A collection of 3 specialized hooks (`useTaskTrends`, `useIncidentDistribution`, `useTasksByRegion`) for fetching chart-specific data. |
| `useExecutiveTasks` | Fetches the full list of tasks from `/tasks/supervisor-view` to be displayed on the map. |
| `useExport` | Contains the logic for exporting the dashboard to PDF (`exportToPDF`) and Excel (`exportToExcel`). |

---

## 6. Data Flow & State Management

1.  **Filter State:** The `filters` state is managed by `useState` in `ExecutiveDashboardPage`.
2.  **Filter Application:** The `ExecutiveFilterBar` updates the `filters` state via callback props (`onFiltersChange`, `onReset`).
3.  **Data Fetching:** All data-fetching hooks (`useExecutiveDashboard`, `useChartData`, `useExecutiveTasks`) receive the `filters` object and automatically refetch data when it changes.
4.  **Component Rendering:** Child components receive the fetched data as props and re-render accordingly.
5.  **Export:** The `ExportButton` receives all fetched data as props and passes it to the `useExport` hook for processing.
