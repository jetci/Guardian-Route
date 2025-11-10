import React, { useEffect, useState } from 'react';
import { Resource } from '../../types/resource';
import { useAllocation } from '../../hooks/resources/useAllocation';

interface AllocationRecord {
  id: string;
  resourceId: string;
  taskId: string;
  allocatedById: string;
  allocatedAt: string;
  reclaimedAt: string | null;
  resource: {
    id: string;
    name: string;
    resourceType: {
      id: string;
      name: string;
    };
  };
  task: {
    id: string;
    title: string;
  };
  allocatedBy: {
    id: string;
    fullName: string;
  };
}

interface HistoryDrawerProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  resource,
  isOpen,
  onClose,
  onRefresh,
}) => {
  const { fetchHistory, reclaim, isLoading } = useAllocation();
  const [history, setHistory] = useState<AllocationRecord[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen && resource) {
      loadHistory();
    }
  }, [isOpen, resource]);

  const loadHistory = async () => {
    if (!resource) return;

    try {
      const data = await fetchHistory(resource.id);
      setHistory(data);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleReclaim = async (allocationId: string) => {
    try {
      await reclaim(allocationId);
      setToast({ type: 'success', message: 'คืนทรัพยากรสำเร็จ' });
      loadHistory();
      onRefresh();

      setTimeout(() => setToast(null), 3000);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen || !resource) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">ประวัติการใช้งาน</h2>
            <p className="text-sm text-blue-100 mt-1">{resource.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mx-6 mt-4 p-4 rounded-lg ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">กำลังโหลดประวัติ...</p>
            </div>
          )}

          {!isLoading && history.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                ไม่มีประวัติการใช้งาน
              </h3>
              <p className="text-gray-500">
                ทรัพยากรนี้ยังไม่เคยถูกมอบหมายให้กับภารกิจใด
              </p>
            </div>
          )}

          {!isLoading && history.length > 0 && (
            <div className="space-y-4">
              {history.map((record, index) => (
                <div
                  key={record.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {/* Timeline indicator */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          record.reclaimedAt
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        {record.reclaimedAt ? '✓' : '⏱'}
                      </div>
                    </div>

                    <div className="ml-4 flex-grow">
                      {/* Task title */}
                      <h4 className="text-lg font-semibold text-gray-900">
                        {record.task.title}
                      </h4>

                      {/* Allocated info */}
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">มอบหมายโดย:</span>{' '}
                          {record.allocatedBy.fullName}
                        </p>
                        <p>
                          <span className="font-medium">วันที่มอบหมาย:</span>{' '}
                          {formatDate(record.allocatedAt)}
                        </p>
                        {record.reclaimedAt && (
                          <p>
                            <span className="font-medium">วันที่คืน:</span>{' '}
                            {formatDate(record.reclaimedAt)}
                          </p>
                        )}
                      </div>

                      {/* Status badge */}
                      <div className="mt-3">
                        {record.reclaimedAt ? (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700 border border-gray-300">
                            คืนแล้ว
                          </span>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 border border-blue-300">
                              กำลังใช้งาน
                            </span>
                            <button
                              onClick={() => handleReclaim(record.id)}
                              disabled={isLoading}
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50"
                            >
                              คืนทรัพยากร
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Connector line (except last item) */}
                  {index < history.length - 1 && (
                    <div className="ml-5 mt-2 border-l-2 border-gray-200 h-4"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
