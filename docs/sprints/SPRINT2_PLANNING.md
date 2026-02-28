# Sprint 2 Planning & Kickoff Materials

**Project:** Guardian Route - Disaster Management System  
**Sprint:** 2  
**Topic:** Executive Dashboard & Analytics  
**Document Version:** 1.0 (Draft)  
**Date:** November 9, 2025

---

## 1. Sprint 2 Goal

> To design, develop, and deploy a functional **Executive Dashboard** that provides a high-level, visual overview of operational metrics, enabling data-driven decision-making for executives, supervisors, and administrators.

---

## 2. Sprint Timeline

- **Duration:** 4 Weeks
- **Start Date:** November 10, 2025
- **End Date:** December 5, 2025
- **Deployment Date:** December 8, 2025 (Target)

---

## 3. Key Features & Deliverables

The primary deliverable is a new, role-restricted page at `/dashboard` containing the following widgets:

| Feature ID | Feature Name | Description | Status |
|---|---|---|---|
| **DB-01** | KPI Summary Bar | Displays key metrics: Total Incidents, Pending, Investigating, Resolved, Avg. Resolution Time. | `Not Started` |
| **DB-02** | Incidents by Status | Donut chart showing the proportion of incidents by status. | `Not Started` |
| **DB-03** | Incidents by Priority | Bar chart showing the count of incidents by priority level. | `Not Started` |
| **DB-04** | Incident Hotspots Map | A map with clustered markers showing incident locations. | `Not Started` |
| **DB-05** | Incident Trend Over Time | Line chart showing new incidents created over a selected period. | `Not Started` |
| **DB-06** | Field Officer Workload | A sortable table displaying team performance metrics. | `Not Started` |
| **DB-07** | Export to PDF | A button to export the current dashboard view as a PDF. | `Not Started` |

---

## 4. Task Breakdown & High-Level Estimates

### Week 1: Foundation & Design

| Task ID | Team | Task Description | Estimate (Days) |
|---|---|---|---|
| **BE-01** | Backend | Develop Analytics API Endpoints (`/kpi-summary`, `/by-status`, `/by-priority`). | 2 |
| **FE-01** | Frontend | Set up new dashboard page, layout, and routing. | 1 |
| **FE-02** | Frontend | Integrate charting and map libraries (Recharts, Leaflet). | 1 |
| **UX-01** | UX/UI | Finalize mockups and style guide for all dashboard widgets. | 1 |

### Week 2: Core Feature Development

| Task ID | Team | Task Description | Estimate (Days) |
|---|---|---|---|
| **BE-02** | Backend | Develop remaining Analytics API Endpoints (`/trend`, `/officer-workload`, `/locations`). | 2 |
| **BE-03** | Backend | Implement caching strategy for analytics endpoints. | 1 |
| **FE-03** | Frontend | Develop KPI Bar, Status Chart, and Priority Chart widgets. Integrate with APIs. | 3 |
| **FE-04** | Frontend | Develop Incident Hotspots Map widget. Integrate with API. | 2 |

### Week 3: Finalization & Integration

| Task ID | Team | Task Description | Estimate (Days) |
|---|---|---|---|
| **FE-05** | Frontend | Develop Trend Chart and Workload Table widgets. Integrate with APIs. | 3 |
| **FE-06** | Frontend | Implement "Export to PDF" functionality. | 1 |
| **INT-01** | All | Full-stack integration testing and bug fixing. | 1 |
| **QA-01** | QA | Write detailed test cases for all dashboard features. | 1 |

### Week 4: Testing & Deployment

| Task ID | Team | Task Description | Estimate (Days) |
|---|---|---|---|
| **QA-02** | QA | Execute manual and automated tests. Report bugs. | 2 |
| **DEV-01**| Dev | Bug fixing and final UX polishing based on QA feedback. | 2 |
| **UAT-01**| All | Conduct User Acceptance Testing with stakeholders. | 1 |
| **DEP-01**| DevOps | Prepare for and execute deployment to production. | 1 |

---

## 5. Dependencies & Risk Management

### 5.1. Dependencies Tracking

| Dependency ID | Description | Owner | Required By | Status | Impact if Delayed |
|---|---|---|---|---|---|
| **DEP-01** | UX Final Design & Style Guide for Dashboard Widgets | UX/UI Team | Week 1 (Nov 15) | `Pending` | Frontend development may need to use placeholder styles |
| **DEP-02** | QA Test Data (100+ incidents with varied statuses/priorities) | QA Team | Week 2 (Nov 22) | `Pending` | Cannot properly test performance and data visualization |
| **DEP-03** | Database Performance Optimization (for 100K+ records) | Backend Team | Week 2 (Nov 22) | `Pending` | Analytics queries may be slow, affecting user experience |
| **DEP-04** | Recharts Library Integration & Configuration | Frontend Team | Week 1 (Nov 15) | `Pending` | Chart widgets cannot be developed |
| **DEP-05** | Leaflet Map Configuration & Clustering Setup | Frontend Team | Week 2 (Nov 22) | `Pending` | Incident Hotspots Map cannot be developed |

### 5.2. Risk Areas

| Risk ID | Risk Description | Probability | Impact | Mitigation Strategy |
|---|---|---|---|---|
| **RISK-01** | Data volume > 100K records may cause API latency > 500ms | Medium | High | Implement caching (Redis), database indexing, and query optimization early in Week 2 |
| **RISK-02** | Chart library (Recharts) may not support all required customizations | Low | Medium | Evaluate alternative libraries (Chart.js, Victory) in Week 1 if issues arise |
| **RISK-03** | Map clustering performance degrades with 1000+ markers | Medium | Medium | Implement server-side clustering or limit visible markers based on zoom level |
| **RISK-04** | Export to PDF may not capture all chart elements correctly | Medium | Low | Use dedicated library (jsPDF + html2canvas) and test early in Week 3 |
| **RISK-05** | Stakeholders may request additional widgets during UAT | High | Medium | Set clear scope boundaries in Kickoff; additional widgets go to Sprint 3 backlog |
| **RISK-06** | Backend team capacity may be limited due to ongoing maintenance | Medium | High | Prioritize analytics API development in Week 1; defer non-critical optimizations |

---

## 6. Sprint Kickoff Meeting Agenda

**Meeting:** Sprint 2 Kickoff: Executive Dashboard
**Date:** November 10, 2025
**Time:** 10:00 AM
**Attendees:** Product Owner, System Analyst, Dev Team, QA Lead

| # | Topic | Presenter | Time (Mins) |
|---|---|---|---|
| 1 | **Sprint 1 Recap & Successes** | System Analyst | 5 |
| 2 | **Introduction to Sprint 2 Goal** | Product Owner | 5 |
| 3 | **Problem Statement & User Personas** | System Analyst | 10 |
| 4 | **Feature Deep Dive (PRD Review)** | System Analyst | 15 |
| 5 | **Technical Spec & Architecture Review** | Lead Developer | 10 |
| 6 | **Task Breakdown & Timeline** | System Analyst | 5 |
| 7 | **Q&A and Open Discussion** | All | 10 |
| 8 | **Confirm Sprint Commitment** | All | 5 |

---

## 7. Required Documents for Kickoff

1.  **Product Requirements Document (PRD):** `EXECUTIVE_DASHBOARD_PRD.md`
2.  **Feature Specification:** `EXECUTIVE_DASHBOARD_SPEC.md`
3.  **Sprint 2 Planning (This Document):** `SPRINT2_PLANNING.md`
4.  **Kickoff Presentation Slides** (To be generated)

---

---

## 8. Post-Kickoff Actions

| Action ID | Action | Owner | Deadline |
|---|---|---|---|
| **POST-01** | Update Task Breakdown with assigned team members | System Analyst | Nov 10, 2025 (EOD) |
| **POST-02** | Create SPRINT2_KICKOFF_SLIDES.md or .pptx | System Analyst | Nov 10, 2025 (EOD) |
| **POST-03** | Share Kickoff recording and notes with team | Product Owner | Nov 11, 2025 |
| **POST-04** | Set up Sprint 2 tracking board (Jira/GitHub Projects) | Scrum Master | Nov 11, 2025 |
| **POST-05** | Schedule daily standups (10:00 AM, 15 mins) | Scrum Master | Nov 10, 2025 |

---

**Document Version:** 1.1 (Updated per SA Review)  
**Status:** ✅ **Approved** - Ready for Kickoff Meeting  
**Last Updated:** November 9, 2025
