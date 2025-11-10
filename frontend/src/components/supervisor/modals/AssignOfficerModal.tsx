import React, { useState } from 'react';
import { SupervisorTaskView, AvailableOfficer } from '../../../types/supervisor';
import { useAvailableOfficers } from '../../../hooks/supervisor/useAvailableOfficers';
import { apiClient } from '../../../api/client';

interface AssignOfficerModalProps {
  task: SupervisorTaskView;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AssignOfficerModal: React.FC<AssignOfficerModalProps> = ({
  task,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { officers, isLoading, error } = useAvailableOfficers();
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredOfficers = officers.filter(officer =>
    officer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    officer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedOfficerId) return;

    setIsAssigning(true);
    setAssignError(null);

    try {
      await apiClient.patch(`/tasks/${task.id}/assign`, {
        officerId: selectedOfficerId,
      });

      // Show success toast
      alert('✅ มอบหมายงานสำเร็จ');
      
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign officer';
      setAssignError(errorMessage);
      alert(`❌ เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">มอบหมายเจ้าหน้าที่</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Task Info */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-800 mb-1">{task.title}</h3>
          <p className="text-sm text-gray-600">
            📍 {task.incident.location.village}
          </p>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b">
          <input
            type="text"
            placeholder="ค้นหาเจ้าหน้าที่..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Officers List */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">กำลังโหลด...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p>⚠️ {error}</p>
            </div>
          ) : filteredOfficers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>ไม่พบเจ้าหน้าที่ที่ว่าง</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOfficers.map(officer => (
                <div
                  key={officer.id}
                  onClick={() => setSelectedOfficerId(officer.id)}
                  className={`
                    p-4 border rounded-lg cursor-pointer transition-all
                    ${selectedOfficerId === officer.id
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }
                    ${!officer.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold mr-3">
                        {officer.name.charAt(0)}
                      </div>
                      
                      {/* Info */}
                      <div>
                        <h4 className="font-semibold text-gray-800">{officer.name}</h4>
                        <p className="text-sm text-gray-600">{officer.email}</p>
                        <p className="text-sm text-gray-600">📞 {officer.phone}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="text-right">
                      <div className={`text-xs px-2 py-1 rounded ${
                        officer.isAvailable
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {officer.isAvailable ? 'ว่าง' : 'ไม่ว่าง'}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        งานปัจจุบัน: {officer.currentTaskCount}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error Message */}
        {assignError && (
          <div className="px-6 py-2 bg-red-50 border-t border-red-200">
            <p className="text-red-800 text-sm">{assignError}</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isAssigning}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg disabled:opacity-50"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedOfficerId || isAssigning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAssigning ? 'กำลังมอบหมาย...' : 'มอบหมาย'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignOfficerModal;
