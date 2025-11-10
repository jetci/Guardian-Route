import React, { useState } from 'react';
import { useBroadcast } from '../../../hooks/supervisor/useBroadcast';

interface BroadcastDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BroadcastDialog: React.FC<BroadcastDialogProps> = ({ isOpen, onClose }) => {
  const { sendBroadcast, isLoading, error } = useBroadcast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'URGENT' | 'NORMAL'>('NORMAL');
  const [targetRole, setTargetRole] = useState<'FIELD_OFFICER' | 'ALL'>('ALL');

  const isTitleValid = title.length >= 5;
  const isMessageValid = message.length >= 10;
  const isFormValid = isTitleValid && isMessageValid && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const result = await sendBroadcast({ title, message, priority, targetRole });
      alert(`Broadcast sent successfully to ${result.recipientCount} users!`);
      handleClose();
    } catch (err) {
      alert(`Failed to send broadcast: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleClose = () => {
    setTitle('');
    setMessage('');
    setPriority('NORMAL');
    setTargetRole('ALL');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={handleClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">📢 Send Broadcast</h2>
            <button type="button" onClick={handleClose} className="p-2 rounded-full hover:bg-gray-100" disabled={isLoading}>
              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 ${isTitleValid ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'}`}
                maxLength={100}
                placeholder="e.g., Urgent System Update"
                disabled={isLoading}
              />
              <p className={`text-xs mt-1 ${isTitleValid ? 'text-gray-500' : 'text-red-600'}`}>Min 5 characters</p>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 min-h-[120px] focus:ring-2 ${isMessageValid ? 'border-gray-300 focus:ring-blue-500' : 'border-red-500 focus:ring-red-500'}`}
                maxLength={500}
                placeholder="e.g., All field officers are required to update their app..."
                disabled={isLoading}
              />
              <p className={`text-xs mt-1 ${isMessageValid ? 'text-gray-500' : 'text-red-600'}`}>Min 10 characters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'URGENT' | 'NORMAL')}
                  className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="NORMAL">Normal</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Target Role */}
              <div>
                <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                <select
                  id="targetRole"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as 'FIELD_OFFICER' | 'ALL')}
                  className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="ALL">All Staff</option>
                  <option value="FIELD_OFFICER">Field Officers Only</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                <p><span className="font-semibold">Error:</span> {error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-6 border-t bg-gray-50 rounded-b-lg">
            <button type="button" onClick={handleClose} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 mr-4" disabled={isLoading}>
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={!isFormValid}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Sending...
                </>
              ) : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
