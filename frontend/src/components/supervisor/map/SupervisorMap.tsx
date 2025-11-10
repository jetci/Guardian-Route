import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useKanban } from '../../../context/supervisor/KanbanContext';
import TaskMarker from './TaskMarker';
import 'leaflet/dist/leaflet.css';

// Component to handle map zoom/pan based on selected task
const MapController: React.FC<{ selectedTaskId: string | null }> = ({ selectedTaskId }) => {
  const map = useMap();
  const { tasks } = useKanban();

  useEffect(() => {
    if (selectedTaskId) {
      const selectedTask = tasks.find(t => t.id === selectedTaskId);
      if (selectedTask?.incident?.location) {
        const { lat, lng } = selectedTask.incident.location;
        map.flyTo([lat, lng], 15, {
          duration: 1.5,
        });
      }
    }
  }, [selectedTaskId, tasks, map]);

  return null;
};

const SupervisorMap: React.FC = () => {
  const { tasks, selectedTaskId, isLoading, error } = useKanban();
  const mapRef = useRef<any>(null);

  // Calculate center based on all tasks
  const center = React.useMemo(() => {
    if (tasks.length === 0) {
      return { lat: 13.7563, lng: 100.5018 }; // Default: Bangkok
    }

    const validTasks = tasks.filter(t => t.incident?.location?.lat && t.incident?.location?.lng);
    if (validTasks.length === 0) {
      return { lat: 13.7563, lng: 100.5018 };
    }

    const avgLat = validTasks.reduce((sum, t) => sum + t.incident.location.lat, 0) / validTasks.length;
    const avgLng = validTasks.reduce((sum, t) => sum + t.incident.location.lng, 0) / validTasks.length;

    return { lat: avgLat, lng: avgLng };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="h-full bg-gray-200 rounded flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดแผนที่...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-red-50 rounded flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">⚠️ เกิดข้อผิดพลาด</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      ref={mapRef}
      center={[center.lat, center.lng]}
      zoom={12}
      style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapController selectedTaskId={selectedTaskId} />

      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
      >
        {tasks
          .filter(task => task.incident?.location?.lat && task.incident?.location?.lng)
          .map(task => (
            <TaskMarker key={task.id} task={task} />
          ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default SupervisorMap;
