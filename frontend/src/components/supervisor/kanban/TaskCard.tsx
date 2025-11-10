import React, { useState } from 'react';
import { SupervisorTaskView } from '../../../types/supervisor';
import { useKanban } from '../../../context/supervisor/KanbanContext';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import AssignOfficerModal from '../modals/AssignOfficerModal';
import { ReviewReportDrawer } from '../drawers/ReviewReportDrawer';

interface TaskCardProps {
  task: SupervisorTaskView;
}

const PRIORITY_COLORS = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-green-500',
};

const PRIORITY_LABELS = {
  HIGH: 'สูง',
  MEDIUM: 'ปานกลาง',
  LOW: 'ต่ำ',
};

const DISASTER_ICONS: Record<string, string> = {
  FLOOD: '🌊',
  LANDSLIDE: '⛰️',
  FIRE: '🔥',
  STORM: '🌪️',
  EARTHQUAKE: '🏚️',
  OTHER: '⚠️',
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { selectTask, selectedTaskId, refreshTasks } = useKanban();
  const isSelected = selectedTaskId === task.id;
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

  const handleClick = () => {
    selectTask(task.id);
  };

  const handleAssignClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAssignModalOpen(true);
  };

  const handleAssignSuccess = () => {
    refreshTasks();
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsReviewDrawerOpen(true);
  };

  return (
    <div
      data-task-id={task.id}
      onClick={handleClick}
      className={`
        bg-white rounded-lg shadow p-4 cursor-pointer transition-all
        hover:shadow-md
        ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}
      `}
    >
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`${PRIORITY_COLORS[task.priority]} text-white text-xs px-2 py-1 rounded`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <span className="text-2xl">
          {DISASTER_ICONS[task.incident.type] || '⚠️'}
        </span>
      </div>

      {/* Task Title */}
      <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Location */}
      <p className="text-sm text-gray-600 mb-2 flex items-center">
        <span className="mr-1">📍</span>
        {task.incident.location.village}
      </p>

      {/* Assigned Officer */}
      {task.assignedTo && (
        <div className="flex items-center text-sm text-gray-700 mb-2">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
            {task.assignedTo.name.charAt(0)}
          </div>
          <span className="truncate">{task.assignedTo.name}</span>
        </div>
      )}

      {/* Last Updated */}
      <p className="text-xs text-gray-500 mt-2">
        {formatDistanceToNow(new Date(task.updatedAt), { 
          addSuffix: true,
          locale: th 
        })}
      </p>

      {/* Report Status & Review Button */}
      {task.hasReport && task.reportStatus && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded ${
              task.reportStatus === 'APPROVED' ? 'bg-green-100 text-green-800' :
              task.reportStatus === 'PENDING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {task.reportStatus === 'APPROVED' ? 'อนุมัติแล้ว' :
               task.reportStatus === 'PENDING_REVIEW' ? 'รอตรวจสอบ' :
               'ต้องแก้ไข'}
            </span>
            {task.reportStatus === 'PENDING_REVIEW' && (
              <button
                onClick={handleReviewClick}
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                📋 ตรวจสอบ
              </button>
            )}
          </div>
        </div>
      )}

      {/* Assign Button for PENDING_ASSIGNMENT */}
      {task.status === 'PENDING_ASSIGNMENT' && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <button
            onClick={handleAssignClick}
            className="w-full bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            👥 มอบหมายงาน
          </button>
        </div>
      )}

      {/* Assign Officer Modal */}
      <AssignOfficerModal
        task={task}
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={handleAssignSuccess}
      />

      {/* Review Report Drawer */}
      {task.hasReport && task.reportId && (
        <ReviewReportDrawer
          isOpen={isReviewDrawerOpen}
          onClose={() => setIsReviewDrawerOpen(false)}
          reportId={task.reportId}
          taskId={task.id}
        />
      )}
    </div>
  );
};

export default TaskCard;
