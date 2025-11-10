import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { SupervisorTask } from '../../../types/supervisor';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface ExecutiveTaskMarkerProps {
  task: SupervisorTask;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#ef4444', // red
  IN_PROGRESS: '#eab308', // yellow
  SURVEYED: '#3b82f6', // blue
  COMPLETED: '#22c55e', // green
  CANCELLED: '#6b7280', // gray
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'รอมอบหมาย',
  IN_PROGRESS: 'กำลังดำเนินการ',
  SURVEYED: 'สำรวจเสร็จแล้ว',
  COMPLETED: 'เสร็จสมบูรณ์',
  CANCELLED: 'ยกเลิก',
};

const PRIORITY_LABELS: Record<string, string> = {
  CRITICAL: 'วิกฤต',
  HIGH: 'สูง',
  MEDIUM: 'ปานกลาง',
  LOW: 'ต่ำ',
};

const createCustomIcon = (status: string) => {
  const color = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
  const size = 30;

  return new DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: all 0.3s ease;
      ">
        📍
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

export const ExecutiveTaskMarker: React.FC<ExecutiveTaskMarkerProps> = ({ task }) => {
  if (!task.incident?.location?.lat || !task.incident?.location?.lng) {
    return null;
  }

  return (
    <Marker
      position={[task.incident.location.lat, task.incident.location.lng]}
      icon={createCustomIcon(task.status)}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2">{task.title}</h3>

          {/* Status Badge */}
          <div className="mb-2">
            <span
              className="text-xs px-2 py-1 rounded text-white"
              style={{ backgroundColor: STATUS_COLORS[task.status] }}
            >
              {STATUS_LABELS[task.status] || task.status}
            </span>
          </div>

          {/* Priority */}
          <p className="text-sm text-gray-700 mb-1">
            <strong>ความสำคัญ:</strong> {PRIORITY_LABELS[task.priority] || task.priority}
          </p>

          {/* Location */}
          {task.incident?.location && (
            <p className="text-sm text-gray-700 mb-1">
              <strong>สถานที่:</strong>{' '}
              {task.incident.location.village || task.incident.location.district || 'N/A'}
            </p>
          )}

          {/* Assigned Officer */}
          {task.assignedTo && (
            <p className="text-sm text-gray-700 mb-1">
              <strong>เจ้าหน้าที่:</strong> {task.assignedTo.name}
            </p>
          )}

          {/* Last Updated */}
          <p className="text-xs text-gray-500 mt-2">
            {formatDistanceToNow(new Date(task.updatedAt), {
              addSuffix: true,
              locale: th,
            })}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};
