import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import NotificationDrawer from '../NotificationDrawer';
import { useNotificationEvents } from '../../hooks/useNotificationEvents';
import NotificationBell from '../notifications/NotificationBell';

interface AppLayoutProps {
  children: React.ReactNode;
}

// Mocking a state management or context for the token
const useAuthToken = () => {
  // Placeholder token - replace with actual token retrieval logic
  // This should be the actual JWT token from the auth store
  const token = useAuthStore((state) => state.accessToken);
  return token;
};

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const token = useAuthToken();
  
  // State for Notification Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Hook for real-time notifications
  const { notifications } = useNotificationEvents(token);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md border-b border-gray-200 z-30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-extrabold text-blue-600">Guardian Route Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notification Bell Icon with Badge Counter */}
              <NotificationBell 
                unreadCount={unreadCount}
                onClick={() => setIsDrawerOpen(true)}
              />

              <span className="text-sm text-gray-700">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Notification Drawer */}
      <NotificationDrawer 
        isOpen={isDrawerOpen} 
        onClose={handleDrawerClose} 
      />
    </div>
  );
}
