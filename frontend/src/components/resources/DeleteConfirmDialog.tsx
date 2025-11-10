import React from 'react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  resourceName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  resourceName,
  onConfirm,
  onCancel,
  isDeleting,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        onClick={onCancel}
      >
        {/* Dialog */}
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              ยืนยันการลบทรัพยากร
            </h3>
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <p className="text-gray-700">
              คุณแน่ใจหรือไม่ว่าต้องการลบทรัพยากร{' '}
              <span className="font-semibold">"{resourceName}"</span>?
            </p>
            <p className="text-sm text-red-600 mt-2">
              ⚠️ การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'กำลังลบ...' : 'ลบทรัพยากร'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
