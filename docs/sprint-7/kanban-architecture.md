# Sprint 7: Kanban Board Architecture

**Version:** 1.0
**Date:** 2025-11-10

---

## 1. Overview

The Kanban Board is the central component of the Supervisor Dashboard, providing a visual representation of all tasks organized by their status. It allows supervisors to quickly assess the current state of disaster response operations.

## 2. Board Structure

### Columns (Task Statuses)

| Column | Status | Description |
| :--- | :--- | :--- |
| **รอมอบหมาย** | `PENDING_ASSIGNMENT` | Tasks that have been created but not yet assigned to a field officer |
| **กำลังดำเนินการ** | `IN_PROGRESS` | Tasks assigned to field officers who are actively working on them |
| **สำรวจเสร็จแล้ว** | `SURVEYED` | Tasks where preliminary survey has been completed, awaiting full report |
| **รายงานเสร็จแล้ว** | `COMPLETED` | Tasks with completed full reports, awaiting supervisor review |

### Card Structure

Each card represents a single task and displays:

- **Task Title** (from incident title)
- **Incident Type** (icon + label)
- **Priority** (badge: High/Medium/Low)
- **Location** (village name)
- **Assigned Officer** (name + avatar, if assigned)
- **Last Updated** (relative time)
- **Quick Actions** (view details, assign, review)

## 3. State Management

### Data Flow

```
API → useSupervisorTasks Hook → KanbanContext → KanbanBoard Component → TaskCard Components
```

### KanbanContext

Provides centralized state for:
- **tasks**: Array of all tasks grouped by status
- **selectedTaskId**: Currently selected task (for map sync)
- **isLoading**: Loading state
- **error**: Error state
- **filters**: Active filters (priority, incident type, date range)

### Actions

- `fetchTasks()`: Load all tasks from API
- `selectTask(taskId)`: Set selected task and trigger map zoom
- `assignOfficer(taskId, officerId)`: Assign officer to task
- `updateTaskStatus(taskId, newStatus)`: Update task status (if drag-and-drop is enabled)
- `applyFilters(filters)`: Filter tasks by criteria

## 4. Component Hierarchy

```
<KanbanBoard>
  <KanbanFilters />
  <KanbanColumns>
    <KanbanColumn status="PENDING_ASSIGNMENT">
      <TaskCard />
      <TaskCard />
      ...
    </KanbanColumn>
    <KanbanColumn status="IN_PROGRESS">
      ...
    </KanbanColumn>
    <KanbanColumn status="SURVEYED">
      ...
    </KanbanColumn>
    <KanbanColumn status="COMPLETED">
      ...
    </KanbanColumn>
  </KanbanColumns>
</KanbanBoard>
```

## 5. Drag-and-Drop (Optional)

Using `@hello-pangea/dnd` (formerly react-beautiful-dnd):

- Drag cards between columns to change status
- Optimistic UI updates
- Revert on API failure
- Audit log for status changes

**Note:** For MVP, drag-and-drop can be disabled and status changes done via modals only.

## 6. Performance Optimization

- **Virtualization**: Use `react-window` if >100 tasks per column
- **Memoization**: Memoize TaskCard components
- **Lazy Loading**: Load task details on demand
- **Debounced Filters**: Debounce filter changes to reduce API calls

## 7. Responsive Design

- **Desktop**: 4 columns side-by-side
- **Tablet**: 2 columns, scrollable
- **Mobile**: 1 column, tabs for status switching
