import React from 'react';
import { useKanban } from '../../../context/supervisor/KanbanContext';
import { TaskStatus } from '../../../types/supervisor';
import KanbanColumn from './KanbanColumn';

const COLUMNS: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'PENDING_ASSIGNMENT', title: 'รอมอบหมาย', color: 'bg-red-100' },
  { status: 'IN_PROGRESS', title: 'กำลังดำเนินการ', color: 'bg-yellow-100' },
  { status: 'SURVEYED', title: 'สำรวจเสร็จแล้ว', color: 'bg-blue-100' },
  { status: 'COMPLETED', title: 'รายงานเสร็จแล้ว', color: 'bg-green-100' },
];

const KanbanBoard: React.FC = () => {
  const { tasks, isLoading } = useKanban();

  // Group tasks by status
  const tasksByStatus = React.useMemo(() => {
    const grouped: Record<TaskStatus, typeof tasks> = {
      PENDING_ASSIGNMENT: [],
      IN_PROGRESS: [],
      SURVEYED: [],
      COMPLETED: [],
      CANCELLED: [],
    };

    tasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {COLUMNS.map(column => (
          <div key={column.status} className="bg-gray-50 rounded-lg p-4">
            <div className="h-8 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white rounded shadow animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {COLUMNS.map(column => (
        <KanbanColumn
          key={column.status}
          status={column.status}
          title={column.title}
          color={column.color}
          tasks={tasksByStatus[column.status]}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
