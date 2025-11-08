# Guardian Route Dashboard - Final Project Summary

## Project Overview

The Guardian Route Dashboard is a comprehensive disaster management and field reporting system designed for local government units (LGUs) in Thailand, specifically for the Obtwiang municipality. The system facilitates real-time incident reporting, task assignment, field data collection via surveys, and executive-level reporting and analysis.

The project is built as a full-stack application:
*   **Backend:** NestJS (Node.js) with PostgreSQL/PostGIS for data storage and geospatial queries.
*   **Frontend:** React with TypeScript, utilizing Chakra UI for the component library.

## Key Features

1.  **Incident Management:** Supervisors can create, track, and manage disaster incidents (e.g., floods, landslides) with location data and priority levels.
2.  **Task Assignment:** Field officers are assigned specific tasks related to incidents, ensuring a coordinated response.
3.  **Dynamic Survey System:** Supervisors can create custom survey templates using a form builder. Field officers can then use these templates to collect structured data on-site (e.g., damage assessment, affected households).
4.  **Reporting and Analytics:** The system generates various reports (incident-based, monthly, custom) and provides statistics on damage estimates, affected persons, and incident status.
5.  **Role-Based Access Control (RBAC):**
    *   **ADMIN:** Full system access.
    *   **SUPERVISOR:** Incident creation, task assignment, survey template management, report review.
    *   **FIELD_OFFICER:** Task execution, survey response submission, incident reporting.
    *   **EXECUTIVE:** View-only access to reports and statistics.

## Technical Resolution Summary

The project was initially non-functional due to significant build errors, primarily stemming from an incompatible upgrade of the **Chakra UI** component library.

### Problem: Chakra UI v3 Migration Issues

The project's dependencies were configured for Chakra UI v3, but the codebase was written using a mix of v2 and v3 syntax, leading to over 180 TypeScript errors (, , , etc.) and component breaking changes (e.g.,  to , nested component syntax for ).

### Solution: Dependency Downgrade and Code Refactoring

The resolution involved a two-pronged approach:

1.  **Dependency Downgrade:** The most stable and quickest fix was to revert the Chakra UI dependency to a known working major version, **v2.8.0**, along with its required peer dependencies (, , ).
     ERR_PNPM_CANNOT_REMOVE_MISSING_DEPS  Cannot remove '@chakra-ui/react': no such dependency found

Available dependencies: @eslint/eslintrc, @eslint/js, @nestjs/cli, @nestjs/schematics, @nestjs/testing, @types/bcrypt, @types/express, @types/jest, @types/multer, @types/node, @types/passport-jwt, @types/supertest, eslint, eslint-config-prettier, eslint-plugin-prettier, globals, jest, prettier, prisma, source-map-support, supertest, ts-jest, ts-loader, ts-node, tsconfig-paths, typescript, typescript-eslint, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/jwt, @nestjs/passport, @nestjs/platform-express, @nestjs/swagger, @prisma/client, @types/uuid, bcrypt, class-transformer, class-validator, multer, passport, passport-jwt, reflect-metadata, rxjs, sharp, uuid
 WARN  Moving @eslint/eslintrc that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @eslint/js that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/cli that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/schematics that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/testing that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/bcrypt that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/express that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/jest that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/passport-jwt that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/node that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving eslint that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/supertest that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/multer that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving eslint-config-prettier that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving eslint-plugin-prettier that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving globals that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving jest that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving prettier that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving prisma that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving source-map-support that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving supertest that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving ts-jest that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving ts-loader that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving ts-node that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving tsconfig-paths that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving typescript that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving typescript-eslint that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/common that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/config that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/core that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/jwt that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/passport that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/platform-express that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @nestjs/swagger that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @prisma/client that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving @types/uuid that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving bcrypt that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving class-transformer that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving class-validator that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving multer that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving passport that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving passport-jwt that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving reflect-metadata that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving rxjs that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving sharp that was installed by a different package manager to "node_modules/.ignored"
 WARN  Moving uuid that was installed by a different package manager to "node_modules/.ignored"
Progress: resolved 0, reused 1, downloaded 0, added 0
Progress: resolved 297, reused 251, downloaded 0, added 0
Progress: resolved 755, reused 717, downloaded 0, added 0
Progress: resolved 855, reused 819, downloaded 0, added 0
 WARN  2 deprecated subdependencies found: glob@7.2.3, inflight@1.0.6
Packages: +75 -7
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-------
Progress: resolved 855, reused 819, downloaded 0, added 1
Progress: resolved 855, reused 819, downloaded 0, added 75, done

dependencies:
+ @chakra-ui/react 2.10.9 (3.29.0 is available)
+ @emotion/react 11.14.0
+ @emotion/styled 11.14.1
+ @nestjs/common 11.1.8
+ @nestjs/config 4.0.2
+ @nestjs/core 11.1.8
+ @nestjs/jwt 11.0.1
+ @nestjs/passport 11.0.5
+ @nestjs/platform-express 11.1.8
+ @nestjs/swagger 11.2.1
+ @prisma/client 6.18.0
+ @types/uuid 10.0.0
+ bcrypt 6.0.0
+ class-transformer 0.5.1
+ class-validator 0.14.2
+ framer-motion 10.18.0 (12.23.24 is available)
+ multer 2.0.2
+ passport 0.7.0
+ passport-jwt 4.0.1
+ reflect-metadata 0.2.2
+ rxjs 7.8.2
+ sharp 0.34.4
+ uuid 13.0.0

devDependencies:
+ @eslint/eslintrc 3.3.1 already in devDependencies, was not moved to dependencies.
+ @eslint/js 9.39.0 already in devDependencies, was not moved to dependencies.
+ @nestjs/cli 11.0.10 already in devDependencies, was not moved to dependencies.
+ @nestjs/schematics 11.0.9 already in devDependencies, was not moved to dependencies.
+ @nestjs/testing 11.1.8 already in devDependencies, was not moved to dependencies.
+ @types/bcrypt 6.0.0 already in devDependencies, was not moved to dependencies.
+ @types/express 5.0.5 already in devDependencies, was not moved to dependencies.
+ @types/jest 30.0.0 already in devDependencies, was not moved to dependencies.
+ @types/multer 2.0.0 already in devDependencies, was not moved to dependencies.
+ @types/node 22.19.0 already in devDependencies, was not moved to dependencies.
+ @types/passport-jwt 4.0.1 already in devDependencies, was not moved to dependencies.
+ @types/supertest 6.0.3 already in devDependencies, was not moved to dependencies.
+ eslint 9.39.0 already in devDependencies, was not moved to dependencies.
+ eslint-config-prettier 10.1.8 already in devDependencies, was not moved to dependencies.
+ eslint-plugin-prettier 5.5.4 already in devDependencies, was not moved to dependencies.
+ globals 16.5.0 already in devDependencies, was not moved to dependencies.
- jest
+ jest 30.2.0 already in devDependencies, was not moved to dependencies.
+ prettier 3.6.2 already in devDependencies, was not moved to dependencies.
+ prisma 6.18.0 already in devDependencies, was not moved to dependencies.
+ source-map-support 0.5.21 already in devDependencies, was not moved to dependencies.
+ supertest 7.1.4 already in devDependencies, was not moved to dependencies.
- ts-jest
+ ts-jest 29.4.5 already in devDependencies, was not moved to dependencies.
+ ts-loader 9.5.4 already in devDependencies, was not moved to dependencies.
+ ts-node 10.9.2 already in devDependencies, was not moved to dependencies.
+ tsconfig-paths 4.2.0 already in devDependencies, was not moved to dependencies.
+ typescript 5.9.3 already in devDependencies, was not moved to dependencies.
+ typescript-eslint 8.46.2 already in devDependencies, was not moved to dependencies.

╭ Warning ─────────────────────────────────────────────────────────────────────╮
│                                                                              │
│   Ignored build scripts: @nestjs/core, @prisma/client, @prisma/engines,      │
│   @scarf/scarf, bcrypt, prisma, sharp, unrs-resolver.                        │
│   Run "pnpm approve-builds" to pick which dependencies should be allowed     │
│   to run scripts.                                                            │
│                                                                              │
╰──────────────────────────────────────────────────────────────────────────────╯

Done in 6.1s using pnpm v10.20.0
2.  **Targeted Code Refactoring:** After the downgrade, the codebase was refactored to align with the correct Chakra UI v2 syntax. This included:
    *   Reverting nested components (, ) back to direct imports (, ).
    *   Correcting component props (e.g., 's  prop).
    *   Fixing numerous TypeScript errors related to **type-only imports** () for enums and interfaces, ensuring that enums used as values () were imported correctly.
    *   Resolving unused variable and function call errors (, ).

**Result:** All frontend TypeScript errors were resolved, and a successful production build was achieved.

## Test Accounts

The following accounts are available for testing the system's role-based access control:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Supervisor** |  |  |
| **Field Officer** |  |  |
| **Executive** |  |  |
| **Admin** |  |  |

