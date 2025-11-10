# Resource Management API

This document outlines the API endpoints for the Resource Management module.

## Base URL

`/api/resources`

## Authentication

All endpoints require a valid JWT token.

## Role Access

| Role | Access Level |
| :--- | :--- |
| ADMIN | Full access |
| EXECUTIVE | Read-only |
| SUPERVISOR | Read/Write (no delete/type management) |
| FIELD_OFFICER | No access |

## Endpoints

### Resource Types

#### `POST /types`

- **Description:** Create a new resource type.
- **Role:** ADMIN
- **Request Body:** `CreateResourceTypeDto`
- **Response:** `ResourceType`

#### `GET /types`

- **Description:** Get all resource types.
- **Role:** ADMIN, EXECUTIVE, SUPERVISOR
- **Response:** `ResourceType[]`

### Resources

#### `POST /`

- **Description:** Create a new resource.
- **Role:** ADMIN, SUPERVISOR
- **Request Body:** `CreateResourceDto`
- **Response:** `Resource`

#### `GET /`

- **Description:** Get all resources with filters.
- **Role:** ADMIN, EXECUTIVE, SUPERVISOR
- **Query Params:** `type`, `status`, `search`
- **Response:** `Resource[]`

#### `GET /:id`

- **Description:** Get a single resource by ID.
- **Role:** ADMIN, EXECUTIVE, SUPERVISOR
- **Response:** `Resource`

#### `PATCH /:id`

- **Description:** Update a resource.
- **Role:** ADMIN, SUPERVISOR
- **Request Body:** `UpdateResourceDto`
- **Response:** `Resource`

#### `DELETE /:id`

- **Description:** Delete a resource.
- **Role:** ADMIN
- **Response:** `Resource`

### Allocation

#### `POST /:id/allocate`

- **Description:** Allocate a resource to a task.
- **Role:** ADMIN, SUPERVISOR
- **Request Body:** `AllocateResourceDto`
- **Response:** `AllocationRecord`

#### `POST /reclaim/:allocationId`

- **Description:** Reclaim a resource from a task.
- **Role:** ADMIN, SUPERVISOR
- **Response:** `AllocationRecord`

#### `GET /:id/history`

- **Description:** Get the allocation history of a resource.
- **Role:** ADMIN, EXECUTIVE, SUPERVISOR
- **Response:** `AllocationRecord[]`
