import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import ResourceMarker from './ResourceMarker';
import './ResourceMap.css';
import { Observable } from 'rxjs';

// Define the Resource type (matching the placeholder in ResourceMarker.tsx)
interface Resource {
  id: string;
  name: string;
  type: 'VEHICLE' | 'EQUIPMENT' | 'PERSONNEL' | 'MEDICAL' | 'SHELTER';
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  allocatedTo?: string;
}

// Define the SSE Event Data structure
interface ResourceEventData {
  message: string;
  resourceId?: string;
  location?: Resource['location'];
  status?: Resource['status'];
  timestamp: number;
}

// --- Custom Hook for SSE ---
const useResourceEvents = (token: string, onEvent: (data: ResourceEventData) => void) => {
  useEffect(() => {
    if (!token) return;

    // NOTE: EventSource does not support custom headers like Authorization directly.
    // This is a common limitation. For this demo, we will rely on the backend's
    // @UseGuards(JwtAuthGuard) to be temporarily disabled or to rely on a cookie/query param
    // which is not ideal. Since the backend is running locally, we will proceed 
    // assuming the guard is bypassed for local testing or the token is passed via query param 
    // (which is not implemented in the backend).
    // For now, we will use a simple fetch/EventSource without the header, 
    // relying on the backend's mock to be accessible.

    const eventSource = new EventSource(`http://localhost:3001/api/events/resources?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        // The event data from the mock is sent as JSON string in the 'data' field
        const data: ResourceEventData = JSON.parse(event.data);
        onEvent(data);
      } catch (e) {
        console.error('Error parsing SSE data:', e);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      // eventSource.close(); // Do not close on error, let it try to reconnect
    };

    return () => {
      eventSource.close();
    };
  }, [token, onEvent]);
};

// --- Main Component ---
const ResourceMap: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // NOTE: Using a hardcoded mock token for local testing. 
  // The actual implementation should retrieve this from a secure context.
  const [token] = useState<string>('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTUxNjIzOTAyMn0.s_r9_s_r9_s_r9_s_r9_s_r9_s_r9_s_r9_s_r9_s_r9_s_r9'); 

  // 1. Fetch initial resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/resources', {
          headers: {
            // NOTE: Authorization header is required for REST endpoints
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Resource[] = await response.json();
        // Initialize resources with a single resource for the mock to update
        if (data.length === 0) {
            setResources([{
                id: 'mock-id-0',
                name: 'Mock Vehicle',
                type: 'VEHICLE',
                status: 'AVAILABLE',
                location: { type: 'Point', coordinates: [100.5018, 13.7563] },
            }]);
        } else {
            setResources(data);
        }
      } catch (e) {
        setError('Failed to fetch initial resources.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchResources();
    }
  }, [token]);

  // 2. Handle real-time updates from SSE
  const handleResourceEvent = useCallback((eventData: ResourceEventData) => {
    if (eventData.message === 'Connected to resource events (MOCK)') {
      console.log('SSE Connected (Mock)');
      return;
    }

    // Update the state based on the event
    setResources(prevResources => {
      const { resourceId, location, status } = eventData;
      if (!resourceId) return prevResources;

      // For the mock, we only update the first resource (mock-id-0)
      const resourceIndex = prevResources.findIndex(r => r.id === 'mock-id-0');

      if (resourceIndex !== -1) {
        // Resource exists, update it
        const updatedResources = [...prevResources];
        const updatedResource = { ...updatedResources[resourceIndex] };

        if (location) {
          updatedResource.location = location;
        }
        if (status) {
          updatedResource.status = status;
        }
        
        updatedResources[resourceIndex] = updatedResource;
        return updatedResources;
      } 
      
      return prevResources;
    });
  }, []);

  useResourceEvents(token, handleResourceEvent);

  if (loading) {
    return <div className="resource-map-container">Loading Map...</div>;
  }

  if (error) {
    return <div className="resource-map-container">Error: {error}</div>;
  }

  // Default center: Bangkok (13.7563° N, 100.5018° E)
  const defaultCenter: [number, number] = [13.7563, 100.5018];

  return (
    <div className="resource-map-container">
      <MapContainer 
        center={defaultCenter} 
        zoom={10} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup chunkedLoading>
          {resources.map(resource => (
            <ResourceMarker key={resource.id} resource={resource} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default ResourceMap;
