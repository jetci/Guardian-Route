import React, { useState, useEffect } from 'react';
import { Resource } from '../../types/resource';
import { useTasks } from '../../hooks/resources/useTasks';
import { useAllocation } from '../../hooks/resources/useAllocation';

interface AllocationDialogProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AllocationDialog: React.FC<AllocationDialogProps> = ({
  resource,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { allocate, isLoading: allocating } = useAllocation();

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedTaskId('');
      setToast(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTaskId) {
      setToast({ type: 'error', message: 'กรุณาเลือกภารกิจ' });
      return;
    }

    if (!resource) return;

    try {
      await allocate(resource.id, selectedTaskId);
      setToast({ type: 'success', message: 'มอบหมายทรัพยากรสำเร็จ' });

      setTimeout(() => {
        onSuccess();
        onClose();
        setToast(null);
      }, 1500);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message });
    }
  };

  if (!isOpen || !resource) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        {/* Dialog */}
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              มอบหมายทรัพยากร
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {resource.name}
            </p>
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                เลือกภารกิจ <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                disabled={tasksLoading || allocating}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">เลือกภารกิจ</option>
                {tasks.map((task) => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
              {tasksLoading && (
                <p className="text-sm text-gray-500 mt-2">กำลังโหลดภารกิจ...</p>
              )}
              {!tasksLoading && tasks.length === 0 && (
                <p className="text-sm text-orange-600 mt-2">
                  ไม่มีภารกิจที่พร้อมรับมอบหมาย
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={allocating}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={allocating || !selectedTaskId}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {allocating ? 'กำลังมอบหมาย...' : 'มอบหมาย'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
