import React, { useEffect, useState } from 'react';
import { useNotificationEvents } from '../hooks/useNotificationEvents';
import type { Resource } from '../types/resource';

// Mocking a state management or context for the token
const useAuthToken = () => {
  // Placeholder token - replace with actual token retrieval logic
  return 'MOCK_JWT_TOKEN_FOR_SSE';
};

/**
 * Mock component to demonstrate real-time resource tracking on a map.
 * In a real application, this would use a library like Leaflet or Mapbox GL JS.
 */
const ResourceMapTracker: React.FC = () => {
  const token = useAuthToken();
  const { latestResourceUpdate } = useNotificationEvents(token);
  const [resources, setResources] = useState<Resource[]>([]);

  useEffect(() => {
    if (latestResourceUpdate) {
      const updatedResource = latestResourceUpdate.resource;

      // 1. Update the resource list state
      setResources(prevResources => {
        const existingIndex = prevResources.findIndex(r => r.id === updatedResource.id);

        if (existingIndex > -1) {
          // Resource exists, update it
          const newResources = [...prevResources];
          newResources[existingIndex] = updatedResource;
          return newResources;
        } else {
          // New resource, add it
          return [...prevResources, updatedResource];
        }
      });

      // 2. Mock Map Update Logic (using console log)
      const [lon, lat] = updatedResource.location.coordinates;
      console.log(
        `📍 MAP UPDATE: Resource ${updatedResource.name} (${updatedResource.id}) moved to [Lat: ${lat}, Lon: ${lon}]`,
      );
      // In a real app:
      // map.updateMarker(updatedResource.id, [lat, lon], updatedResource.status);
    }
  }, [latestResourceUpdate]);

  // Filter for resources that are 'IN_USE' to display on the dashboard
  const activeResources = resources.filter(r => r.status === 'IN_USE');

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800">Real-Time Resource Tracker (Mock)</h3>
      <p className="text-sm text-gray-500">
        Receiving updates from SSE: `resource.updated`
      </p>
      <div className="mt-3 space-y-2">
        {activeResources.length === 0 ? (
          <p className="text-gray-400">No active resources currently tracked.</p>
        ) : (
          activeResources.map(resource => (
            <div key={resource.id} className="p-2 border rounded flex justify-between items-center">
              <span className="font-medium">{resource.name}</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                {resource.status}
              </span>
              <span className="text-xs text-gray-500">
                Lat: {resource.location.coordinates[1].toFixed(4)}, Lon: {resource.location.coordinates[0].toFixed(4)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResourceMapTracker;
