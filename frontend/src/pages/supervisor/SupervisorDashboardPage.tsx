import React, { useState } from 'react';
import { KanbanProvider } from '../../context/supervisor/KanbanContext';
import { useSupervisorTasks } from '../../hooks/supervisor/useSupervisorTasks';
import KanbanBoard from '../../components/supervisor/kanban/KanbanBoard';
import SupervisorMap from '../../components/supervisor/map/SupervisorMap';
import { BroadcastDialog } from '../../components/supervisor/modals/BroadcastDialog';

const SupervisorDashboardPage: React.FC = () => {
  const { tasks, isLoading, error, refreshTasks } = useSupervisorTasks();
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                หน้าหัวหน้างาน
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                จัดการและติดตามงานทั้งหมด
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <button
                onClick={() => setIsBroadcastOpen(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center"
              >
                <span className="mr-2">📢</span>
                Broadcast
              </button>
              <button
                onClick={refreshTasks}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span className="mr-2">🔄</span>
                {isLoading ? 'กำลังโหลด...' : 'รีเฟรช'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <KanbanProvider onRefresh={refreshTasks}>
          <KanbanBoard />
        </KanbanProvider>
      </div>

      {/* Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            แผนที่ภาพรวม
          </h2>
          <div className="h-96">
            <KanbanProvider onRefresh={refreshTasks}>
              <SupervisorMap />
            </KanbanProvider>
          </div>
        </div>
      </div>
    </div>

      <BroadcastDialog
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
      />
    </div>
  );
};

export default SupervisorDashboardPage;
