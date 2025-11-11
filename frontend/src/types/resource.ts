export interface Resource {
  id: string;
  name: string;
  status: 'IN_USE' | 'AVAILABLE' | 'MAINTENANCE';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  lastUpdated: string;
}

export type ResourceStatus = 'IN_USE' | 'AVAILABLE' | 'MAINTENANCE';

export interface AllocationRecord {
  id: string;
  resourceId: string;
  taskId: string;
  startTime: string;
  endTime: string | null;
}

export interface ResourceUpdateEvent {
  resource: Resource;
}
