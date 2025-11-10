import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { SupervisorTaskView, TaskStatus } from '../../../types/supervisor';
import { useKanban } from '../../../context/supervisor/KanbanContext';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

interface TaskMarkerProps {
  task: SupervisorTaskView;
}

const STATUS_COLORS: Record<TaskStatus, string> = {
  PENDING_ASSIGNMENT: '#ef4444', // red
  IN_PROGRESS: '#eab308', // yellow
  SURVEYED: '#3b82f6', // blue
  COMPLETED: '#22c55e', // green
  CANCELLED: '#6b7280', // gray
};

const PRIORITY_LABELS = {
  HIGH: 'สูง',
  MEDIUM: 'ปานกลาง',
  LOW: 'ต่ำ',
};

const createCustomIcon = (status: TaskStatus, isSelected: boolean) => {
  const color = STATUS_COLORS[status];
  const size = isSelected ? 40 : 30;
  
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
        ${isSelected ? 'transform: scale(1.2); box-shadow: 0 4px 12px rgba(0,0,0,0.5);' : ''}
      ">
        📍
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const TaskMarker: React.FC<TaskMarkerProps> = ({ task }) => {
  const { selectTask, selectedTaskId } = useKanban();
  const isSelected = selectedTaskId === task.id;

  if (!task.incident?.location?.lat || !task.incident?.location?.lng) {
    return null;
  }

  const handleMarkerClick = () => {
    selectTask(task.id);
    
    // Scroll to card in Kanban
    setTimeout(() => {
      const cardElement = document.querySelector(`[data-task-id="${task.id}"]`);
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
  };

  return (
    <Marker
      position={[task.incident.location.lat, task.incident.location.lng]}
      icon={createCustomIcon(task.status, isSelected)}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <Popup>
        <div className="p-2 min-w-[200px]">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2">
            {task.title}
          </h3>

          {/* Status Badge */}
          <div className="mb-2">
            <span 
              className="text-xs px-2 py-1 rounded text-white"
              style={{ backgroundColor: STATUS_COLORS[task.status] }}
            >
              {task.status === 'PENDING_ASSIGNMENT' ? 'รอมอบหมาย' :
               task.status === 'IN_PROGRESS' ? 'กำลังดำเนินการ' :
               task.status === 'SURVEYED' ? 'สำรวจเสร็จแล้ว' :
               'รายงานเสร็จแล้ว'}
            </span>
          </div>

          {/* Priority */}
          <p className="text-sm text-gray-700 mb-1">
            <strong>ความสำคัญ:</strong> {PRIORITY_LABELS[task.priority]}
          </p>

          {/* Location */}
          <p className="text-sm text-gray-700 mb-1">
            <strong>สถานที่:</strong> {task.incident.location.village}
          </p>

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

          {/* View Details Button */}
          <button
            onClick={() => selectTask(task.id)}
            className="mt-2 w-full bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700"
          >
            ดูรายละเอียด
          </button>
        </div>
      </Popup>
    </Marker>
  );
};

export default TaskMarker;
