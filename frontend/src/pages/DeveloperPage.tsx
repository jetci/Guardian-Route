import React from 'react';
import { DevSidebarSwitcher } from '../components/dev/DevSidebarSwitcher';
import { useRole } from '../context/RoleContext';
import { useMockRole, getRoleDisplayName } from '../hooks/useMockRole';
import {
  getDeveloperAccessLogs,
  clearDeveloperAccessLogs,
  isDeveloperModeEnabled,
} from '../middleware/dev.guard';

/**
 * Developer Page
 * 
 * Dedicated page for developer tools and features.
 * Only accessible with DEVELOPER role.
 */
export const DeveloperPage: React.FC = () => {
  const { user, currentRole, isMockMode } = useRole();
  const { actualRole } = useMockRole();
  const [accessLogs, setAccessLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadAccessLogs();
  }, []);

  const loadAccessLogs = () => {
    setAccessLogs(getDeveloperAccessLogs());
  };

  const handleClearLogs = () => {
    clearDeveloperAccessLogs();
    loadAccessLogs();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <span className="text-4xl">👨‍💻</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Developer Mode</h1>
              <p className="text-yellow-100 mt-1">
                Advanced tools for development and testing
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Role Switcher */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Role Switcher
              </h2>
              <DevSidebarSwitcher />
            </div>
          </div>

          {/* Right Column: Info & Logs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Current Status
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">User</div>
                  <div className="font-medium text-gray-900">
                    {user?.username || 'Not logged in'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Email</div>
                  <div className="font-medium text-gray-900">
                    {user?.email || '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Actual Role</div>
                  <div className="font-medium text-gray-900">
                    {actualRole ? getRoleDisplayName(actualRole) : '-'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Current Role</div>
                  <div className="font-medium text-gray-900">
                    {currentRole ? getRoleDisplayName(currentRole) : '-'}
                    {isMockMode && (
                      <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded">
                        MOCK
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Dev Mode</div>
                  <div className="font-medium text-gray-900">
                    {isDeveloperModeEnabled() ? (
                      <span className="text-green-600">✓ Enabled</span>
                    ) : (
                      <span className="text-red-600">✗ Disabled</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Environment</div>
                  <div className="font-medium text-gray-900">
                    {import.meta.env.DEV ? 'Development' : 'Production'}
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Developer Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🐛</span>
                    <h3 className="font-semibold text-gray-800">Debug Panel</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Monitor API requests and responses in real-time
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Click the floating button in bottom-right corner
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">📚</span>
                    <h3 className="font-semibold text-gray-800">Handbook</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Complete development documentation and guides
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Click the handbook button in bottom-right corner
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔄</span>
                    <h3 className="font-semibold text-gray-800">Role Switcher</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Test different user roles without re-login
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Use the switcher on the left panel
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">🔒</span>
                    <h3 className="font-semibold text-gray-800">Access Guard</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Protected routes and features for developers only
                  </p>
                  <div className="mt-3 text-xs text-gray-500">
                    Automatic access control based on role
                  </div>
                </div>
              </div>
            </div>

            {/* Access Logs */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Access Logs ({accessLogs.length})
                </h2>
                <button
                  onClick={handleClearLogs}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Clear Logs
                </button>
              </div>

              {accessLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📭</div>
                  <div>No access logs yet</div>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {accessLogs.slice().reverse().map((log, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded p-3 text-sm"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">
                          {log.feature}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            log.allowed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {log.allowed ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Role: {log.role || 'None'} •{' '}
                        {new Date(log.timestamp).toLocaleString('th-TH')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPage;
