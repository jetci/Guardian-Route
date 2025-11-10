// Resource Management Types

export enum ResourceStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
}

export interface ResourceType {
  id: string;
  name: string;
  description?: string;
}

export interface Resource {
  id: string;
  name: string;
  resourceType: ResourceType;
  resourceTypeId: string;
  status: ResourceStatus;
  location: string;
  registrationNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllocationRecord {
  id: string;
  resourceId: string;
  resource?: Resource;
  taskId: string;
  task?: {
    id: string;
    title: string;
  };
  allocatedById: string;
  allocatedBy?: {
    id: string;
    name: string;
  };
  allocatedAt: string;
  reclaimedAt?: string;
}

export interface ResourceFilters {
  search?: string;
  resourceTypeId?: string;
  status?: ResourceStatus;
}
