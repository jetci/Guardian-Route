import React, { useState, useCallback } from 'react';
import type { Notification } from '../types/notification';
import { useNotificationEvents } from '../hooks/useNotificationEvents';

// Mocking a state management or context for the token
// In a real app, this would come from an AuthContext or similar
const useAuthToken = () => {
  // Placeholder token - replace with actual token retrieval logic
  return 'MOCK_JWT_TOKEN_FOR_SSE';
};

// Helper function to get badge color based on notification type
const getBadgeColor = (type: Notification['type']) => {
  switch (type) {
    case 'notification.alert':
      return 'bg-red-500 text-white';
    case 'notification.broadcast':
      return 'bg-blue-500 text-white';
    case 'notification.system':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-300 text-gray-800';
  }
};

// Helper function to format the type string
const formatType = (type: Notification['type']) => {
  return type.split('.')[1].toUpperCase();
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const token = useAuthToken();
  const { notifications, markAsRead, isConnected, error } = useNotificationEvents(token);
  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen);
  const [filter, setFilter] = useState("ALL");

  const filteredNotifications = notifications.filter(n => {
    if (filter === "ALL") return true;
    return n.type.includes(filter.toLowerCase());
  });

  React.useEffect(() => {
    setIsDrawerOpen(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsDrawerOpen(false);
    onClose();
  }, [onClose]);

  const handleMarkAsRead = useCallback((id: string) => {
    markAsRead(id);
  }, [markAsRead]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={handleClose}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-4 text-sm text-gray-600 border-b">
          {isConnected ? (
            <span className="text-green-600">Connected to SSE</span>
          ) : (
            <span className="text-red-600">
              {error || 'Disconnected. Attempting to reconnect...'}
            </span>
          )}
        </div>

        <div className="p-2 border-b">
          <div className="flex justify-around bg-gray-100 rounded-md p-1">
            <button onClick={() => setFilter("ALL")} className={`px-3 py-1 text-sm font-medium rounded-md ${filter === "ALL" ? "bg-white shadow" : "text-gray-600"}`}>All</button>
            <button onClick={() => setFilter("alert")} className={`px-3 py-1 text-sm font-medium rounded-md ${filter === "alert" ? "bg-white shadow" : "text-gray-600"}`}>Alerts</button>
            <button onClick={() => setFilter("broadcast")} className={`px-3 py-1 text-sm font-medium rounded-md ${filter === "broadcast" ? "bg-white shadow" : "text-gray-600"}`}>Broadcasts</button>
            <button onClick={() => setFilter("system")} className={`px-3 py-1 text-sm font-medium rounded-md ${filter === "system" ? "bg-white shadow" : "text-gray-600"}`}>System</button>
          </div>
        </div>

        <div className="h-full overflow-y-auto pb-20">
          {filteredNotifications.length === 0 ? (
            <p className="p-4 text-gray-500">No notifications yet.</p>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 transition-colors duration-150 ${
                  notification.isRead ? 'bg-white text-gray-500' : 'bg-blue-50 text-gray-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getBadgeColor(
                        notification.type,
                      )}`}
                    >
                      {formatType(notification.type)}
                    </span>
                    <h3 className={`font-bold ${notification.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                  </div>
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs text-blue-500 hover:text-blue-700 font-medium whitespace-nowrap"
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
                <p className="mt-1 text-sm">{notification.message}</p>
                <p className="mt-2 text-xs text-gray-400">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDrawer;
