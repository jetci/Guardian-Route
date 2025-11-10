import React from 'react';
import { SupervisorTaskView, TaskStatus } from '../../../types/supervisor';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  color: string;
  tasks: SupervisorTaskView[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, color, tasks }) => {
  return (
    <div className={`${color} rounded-lg p-4 min-h-[600px]`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-700">
          {tasks.length}
        </span>
      </div>

      {/* Task Cards */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">ไม่มีงานในขณะนี้</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
