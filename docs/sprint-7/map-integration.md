# Sprint 7: Map Integration & Sync Mechanism

**Version:** 1.0
**Date:** 2025-11-10

---

## 1. Overview

The Supervisor Map provides a geographical view of all active tasks, allowing supervisors to understand the spatial distribution of incidents and quickly navigate to specific locations.

## 2. Map Features

### Core Functionality

- **Display Markers**: Show all tasks as markers on the map
- **Color-Coded**: Markers colored by task status
  - 🔴 Red: `PENDING_ASSIGNMENT`
  - 🟡 Yellow: `IN_PROGRESS`
  - 🔵 Blue: `SURVEYED`
  - 🟢 Green: `COMPLETED`
- **Clustering**: Group nearby markers when zoomed out (using `react-leaflet-cluster`)
- **Popup**: Show task summary on marker click
- **Highlight**: Highlight selected marker when task is selected from Kanban

### Advanced Features

- **Zoom to Task**: Automatically zoom and pan to a task's location when selected
- **Filter Sync**: Apply same filters as Kanban board
- **Heatmap Layer**: Optional heatmap showing incident density
- **Draw Tools**: Optional tools for supervisors to mark areas of concern

## 3. Sync Mechanism

### Kanban → Map Sync

**Trigger:** User clicks a task card in Kanban

**Flow:**
1. User clicks task card
2. `selectTask(taskId)` is called in KanbanContext
3. `selectedTaskId` state is updated
4. Map component observes `selectedTaskId` change
5. Map finds marker with matching `taskId`
6. Map highlights marker (change icon/color)
7. Map zooms to marker location (with animation)

### Map → Kanban Sync

**Trigger:** User clicks a marker on the map

**Flow:**
1. User clicks marker
2. Marker click handler calls `selectTask(taskId)`
3. `selectedTaskId` state is updated
4. Kanban component observes `selectedTaskId` change
5. Kanban scrolls to the task card
6. Task card is highlighted (border/shadow effect)

## 4. Component Structure

```tsx
<SupervisorMap>
  <MapContainer>
    <TileLayer />
    <MarkerClusterGroup>
      {tasks.map(task => (
        <TaskMarker
          key={task.id}
          task={task}
          isSelected={task.id === selectedTaskId}
          onClick={() => selectTask(task.id)}
        />
      ))}
    </MarkerClusterGroup>
    {selectedTask && (
      <MapController
        center={selectedTask.location}
        zoom={15}
      />
    )}
  </MapContainer>
</SupervisorMap>
```

## 5. Data Requirements

Each task must have:
- `location`: `{ lat: number, lng: number }`
- `status`: Task status for marker color
- `title`: For popup display
- `priority`: For marker icon variation

## 6. Performance Considerations

- **Lazy Rendering**: Only render markers in viewport
- **Clustering**: Reduce marker count at low zoom levels
- **Debounced Zoom**: Debounce zoom/pan events to reduce re-renders
- **Memoization**: Memoize marker components

## 7. User Experience

- **Smooth Animations**: Use Leaflet's built-in animations for zoom/pan
- **Loading States**: Show skeleton while map loads
- **Error Handling**: Gracefully handle missing location data
- **Mobile**: Touch-friendly markers and popups
