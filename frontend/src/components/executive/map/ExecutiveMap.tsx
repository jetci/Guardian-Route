import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { ExecutiveTaskMarker } from './ExecutiveTaskMarker';
import { SupervisorTask } from '../../../types/supervisor';
import 'leaflet/dist/leaflet.css';

interface ExecutiveMapProps {
  tasks: SupervisorTask[];
  isLoading?: boolean;
  error?: string | null;
}

export const ExecutiveMap: React.FC<ExecutiveMapProps> = ({ tasks, isLoading, error }) => {
  const mapRef = useRef<any>(null);

  // Calculate center based on all tasks
  const center = useMemo(() => {
    if (tasks.length === 0) {
      return { lat: 13.7563, lng: 100.5018 }; // Default: Bangkok
    }

    const validTasks = tasks.filter(
      (t) => t.incident?.location?.lat && t.incident?.location?.lng
    );
    if (validTasks.length === 0) {
      return { lat: 13.7563, lng: 100.5018 };
    }

    const avgLat =
      validTasks.reduce((sum, t) => sum + t.incident.location.lat, 0) / validTasks.length;
    const avgLng =
      validTasks.reduce((sum, t) => sum + t.incident.location.lng, 0) / validTasks.length;

    return { lat: avgLat, lng: avgLng };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded animate-pulse">
        <p className="text-gray-600">กำลังโหลดแผนที่...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded border border-red-200">
        <p className="text-red-600">เกิดข้อผิดพลาด: {error}</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500">ไม่มีข้อมูลงานที่จะแสดงบนแผนที่</p>
      </div>
    );
  }

  return (
    <div className="h-96 rounded overflow-hidden shadow">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
          {tasks
            .filter((task) => task.incident?.location?.lat && task.incident?.location?.lng)
            .map((task) => (
              <ExecutiveTaskMarker key={task.id} task={task} />
            ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};
