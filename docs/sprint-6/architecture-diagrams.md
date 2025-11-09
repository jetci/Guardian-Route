# Sprint 6: Architecture Diagrams

**Document Version:** 1.0  
**Date:** Nov 09, 2025  
**Author:** Manus AI

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend (React)"
        A[User] --> B[FullReportWizardPage]
        B --> C[WizardContainer]
        C --> D[Step Components 1-10]
        D --> E[ImageUploader]
        D --> F[AIAnalysisCard]
    end
    
    subgraph "State Management"
        C --> G[WizardContext]
        G --> H[LocalStorage]
        G --> I[Audit Hook]
    end
    
    subgraph "Backend (NestJS)"
        J[API Gateway]
        K[ReportController]
        L[ReportService]
        M[GeminiService]
        N[AuditService]
        O[PrismaService]
    end
    
    subgraph "External Services"
        P[Gemini AI API]
        Q[Firebase Storage]
    end
    
    subgraph "Database"
        R[(PostgreSQL)]
    end
    
    C -->|API Calls| J
    J --> K
    K --> L
    L --> M
    L --> N
    L --> O
    M -->|Analyze Images| P
    E -->|Upload Images| Q
    O -->|CRUD| R
    I -->|Log Events| N
    
    style A fill:#e1f5ff
    style P fill:#fff4e1
    style Q fill:#fff4e1
    style R fill:#e8f5e9
```

---

## 2. Component Hierarchy

```mermaid
graph TD
    A[FullReportWizardPage] --> B[WizardProvider]
    B --> C[WizardContainer]
    C --> D[WizardProgress]
    C --> E[WizardNavigation]
    C --> F[Step Components]
    
    F --> G[Step1BasicInfo]
    F --> H[Step2DamageAssessment]
    F --> I[Step3AffectedArea]
    F --> J[Step4Infrastructure]
    F --> K[Step5Casualties]
    F --> L[Step6ResourcesNeeded]
    F --> M[Step7CurrentResponse]
    F --> N[Step8ImageUpload]
    F --> O[Step9AIAnalysis]
    F --> P[Step10Recommendations]
    
    N --> Q[ImageUploader]
    N --> R[ImagePreview]
    O --> S[AIAnalysisCard]
    O --> T[EditableAIContent]
    
    G --> U[FormField]
    H --> U
    I --> U
    J --> U
    K --> U
    L --> U
    M --> U
    P --> U
    
    style A fill:#4CAF50
    style B fill:#8BC34A
    style C fill:#CDDC39
    style F fill:#FFC107
```

---

## 3. Data Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant W as WizardContainer
    participant S as State Management
    participant A as Audit Hook
    participant API as Backend API
    participant G as Gemini AI
    participant DB as Database
    
    U->>W: Start wizard
    W->>S: Initialize state
    W->>A: Log wizard started
    A->>API: POST /audit
    API->>DB: Save audit log
    
    loop For each step
        U->>W: Fill form data
        W->>S: Update form data
        W->>A: Log field updates
        A->>API: POST /audit
    end
    
    U->>W: Upload images (Step 8)
    W->>API: POST /upload
    API->>DB: Save image URLs
    
    U->>W: Request AI analysis
    W->>API: POST /reports/analyze-images
    API->>G: Analyze images
    G-->>API: Return analysis
    API-->>W: Return AI result
    W->>S: Update AI analysis
    W->>A: Log AI analysis
    
    U->>W: Edit AI analysis (Step 9)
    W->>S: Update edited analysis
    W->>A: Log AI analysis edited
    A->>API: POST /audit
    
    U->>W: Submit report (Step 10)
    W->>API: POST /reports/full
    API->>DB: Create report
    API->>DB: Update task status
    API-->>W: Return report
    W->>A: Log report submitted
    A->>API: POST /audit
    W->>U: Show success message
```

---

## 4. Wizard State Flow

```mermaid
stateDiagram-v2
    [*] --> Step1: Start wizard
    Step1 --> Step2: Next (validated)
    Step2 --> Step3: Next (validated)
    Step3 --> Step4: Next (validated)
    Step4 --> Step5: Next (validated)
    Step5 --> Step6: Next (validated)
    Step6 --> Step7: Next (validated)
    Step7 --> Step8: Next (validated)
    Step8 --> Step9: Next (images uploaded)
    Step9 --> Step10: Next (AI reviewed)
    Step10 --> [*]: Submit (all validated)
    
    Step2 --> Step1: Previous
    Step3 --> Step2: Previous
    Step4 --> Step3: Previous
    Step5 --> Step4: Previous
    Step6 --> Step5: Previous
    Step7 --> Step6: Previous
    Step8 --> Step7: Previous
    Step9 --> Step8: Previous
    Step10 --> Step9: Previous
    
    Step1 --> Draft: Auto-save
    Step2 --> Draft: Auto-save
    Step3 --> Draft: Auto-save
    Step4 --> Draft: Auto-save
    Step5 --> Draft: Auto-save
    Step6 --> Draft: Auto-save
    Step7 --> Draft: Auto-save
    Step8 --> Draft: Auto-save
    Step9 --> Draft: Auto-save
    Step10 --> Draft: Auto-save
    
    Draft --> Step1: Resume
    Draft --> Step2: Resume
    Draft --> Step3: Resume
    Draft --> Step4: Resume
    Draft --> Step5: Resume
    Draft --> Step6: Resume
    Draft --> Step7: Resume
    Draft --> Step8: Resume
    Draft --> Step9: Resume
    Draft --> Step10: Resume
```

---

## 5. AI Analysis Flow

```mermaid
flowchart TD
    A[User uploads images] --> B{Images valid?}
    B -->|No| C[Show error]
    B -->|Yes| D[Upload to storage]
    D --> E[Get image URLs]
    E --> F[Call Gemini API]
    F --> G{API success?}
    G -->|No| H[Show error + retry option]
    G -->|Yes| I[Parse AI response]
    I --> J[Display analysis]
    J --> K{User satisfied?}
    K -->|No| L[User clicks 'Re-analyze']
    L --> F
    K -->|Yes| M[User proceeds to Step 9]
    M --> N[Review AI analysis]
    N --> O{User wants to edit?}
    O -->|Yes| P[Enable edit mode]
    P --> Q[User edits fields]
    Q --> R[Log AI analysis edited]
    R --> S[Save edited analysis]
    O -->|No| T[Proceed to Step 10]
    S --> T
    
    style A fill:#e3f2fd
    style F fill:#fff3e0
    style J fill:#e8f5e9
    style P fill:#fce4ec
    style R fill:#f3e5f5
```

---

## 6. Audit Trail Flow

```mermaid
flowchart LR
    subgraph "User Actions"
        A1[Start wizard]
        A2[Update field]
        A3[Upload image]
        A4[Request AI]
        A5[Edit AI result]
        A6[Submit report]
    end
    
    subgraph "Audit Hook"
        B[useAuditTrail]
    end
    
    subgraph "Backend"
        C[AuditController]
        D[AuditService]
    end
    
    subgraph "Database"
        E[(AuditLog Table)]
    end
    
    subgraph "Visualization"
        F[AuditTimeline]
    end
    
    A1 --> B
    A2 --> B
    A3 --> B
    A4 --> B
    A5 --> B
    A6 --> B
    
    B --> C
    C --> D
    D --> E
    
    E --> F
    
    style A5 fill:#ffebee
    style E fill:#e8f5e9
    style F fill:#e1f5fe
```

---

## 7. Database Schema Relationships

```mermaid
erDiagram
    User ||--o{ Report : creates
    User ||--o{ AuditLog : performs
    Report ||--o{ AuditLog : tracked_by
    Task ||--o| Report : has
    Incident ||--o| Report : references
    Village ||--o{ Task : assigned_to
    
    User {
        string id PK
        string email
        string name
        enum role
    }
    
    Report {
        string id PK
        string authorId FK
        string taskId FK
        string incidentId FK
        enum type
        enum status
        string title
        json details
        json aiAnalysis
        string[] photoUrls
        datetime createdAt
        datetime submittedAt
    }
    
    Task {
        string id PK
        string assignedToId FK
        string villageId FK
        enum status
        json surveyData
    }
    
    AuditLog {
        string id PK
        string entityType
        string entityId
        string action
        json details
        string userId FK
        datetime createdAt
    }
```

---

## 8. API Architecture

```mermaid
graph LR
    subgraph "Frontend"
        A[React App]
    end
    
    subgraph "API Layer"
        B[/api/reports/full]
        C[/api/reports/analyze-images]
        D[/api/reports/drafts]
        E[/api/tasks/:id/preliminary-data]
        F[/api/audit]
    end
    
    subgraph "Controllers"
        G[ReportController]
        H[TaskController]
        I[AuditController]
    end
    
    subgraph "Services"
        J[ReportService]
        K[GeminiService]
        L[AuditService]
        M[TaskService]
    end
    
    subgraph "External"
        N[Gemini AI API]
        O[Firebase Storage]
    end
    
    A -->|POST| B
    A -->|POST| C
    A -->|POST/GET| D
    A -->|GET| E
    A -->|POST| F
    
    B --> G
    C --> G
    D --> G
    E --> H
    F --> I
    
    G --> J
    G --> K
    H --> M
    I --> L
    
    K --> N
    J --> O
    
    style A fill:#e3f2fd
    style N fill:#fff3e0
    style O fill:#fff3e0
```

---

## 9. Deployment Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
    end
    
    subgraph "CDN"
        C[Static Assets]
    end
    
    subgraph "Application Layer"
        D[Next.js Frontend]
        E[NestJS Backend]
    end
    
    subgraph "Services Layer"
        F[Gemini AI API]
        G[Firebase Storage]
    end
    
    subgraph "Data Layer"
        H[(PostgreSQL)]
        I[(Redis Cache)]
    end
    
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G
    E --> H
    E --> I
    
    style A fill:#e3f2fd
    style B fill:#e3f2fd
    style C fill:#f3e5f5
    style D fill:#e8f5e9
    style E fill:#fff3e0
    style F fill:#ffebee
    style G fill:#ffebee
    style H fill:#e1f5fe
    style I fill:#e1f5fe
```

---

## 10. Security Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Guard
    participant R as Role Guard
    participant C as Controller
    participant S as Service
    participant D as Database
    
    U->>F: Access wizard
    F->>A: Check JWT token
    A->>A: Verify token
    A-->>F: Token valid
    F->>R: Check user role
    R->>R: Verify role = REPORT_TEAM
    R-->>F: Role authorized
    F->>C: POST /reports/full
    C->>A: Validate request
    A->>R: Check permissions
    R-->>C: Authorized
    C->>S: Create report
    S->>D: Save report
    D-->>S: Report created
    S-->>C: Return report
    C-->>F: Return response
    F-->>U: Show success
    
    Note over A,R: JWT + Role-based access control
    Note over C,S: Business logic validation
    Note over S,D: Data persistence with audit trail
```

---

## Summary

This document provides:
- **System architecture overview** showing all major components
- **Component hierarchy** for the wizard UI
- **Data flow diagrams** for user interactions
- **State management flow** with draft persistence
- **AI analysis flow** with error handling
- **Audit trail flow** for complete traceability
- **Database schema** with relationships
- **API architecture** showing endpoints and services
- **Deployment architecture** for production
- **Security flow** with authentication and authorization

All diagrams are in Mermaid format and can be rendered in Markdown viewers or documentation tools.
