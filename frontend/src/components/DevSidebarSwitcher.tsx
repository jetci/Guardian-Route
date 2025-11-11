import React from 'react';
import { useRole, UserRole } from '../context/RoleContext';
import { getRoleDisplayName, getRoleColor, getRoleIcon } from '../hooks/useMockRole'; // Reusing helper functions from the existing mock role hook
import { LogOut, UserCheck } from 'lucide-react';

// Available roles for mocking (excluding DEVELOPER and GUEST for a typical switch)
const MOCKABLE_ROLES: UserRole[] = [
  'ADMIN',
  'SUPERVISOR',
  'FIELD_OFFICER',
  'EXECUTIVE',
  'USER', // Assuming USER is a valid role
];

/**
 * UI Component for switching mock user roles in the Developer Sidebar.
 * This component is only visible when the current user is a DEVELOPER.
 */
const DevSidebarSwitcher: React.FC = () => {
  const {
    user,
    currentRole,
    isMockMode,
    isDeveloper,
    setMockRole,
    clearMockRole,
  } = useRole();

  // Component should only render for developers
  if (!isDeveloper) {
    return null;
  }

  const actualRole = user?.role || 'GUEST';

  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">
        Developer Mode
      </h3>
      <div className="text-sm mb-3">
        <p className="font-medium text-gray-700 flex items-center">
          <UserCheck className="w-4 h-4 mr-2 text-blue-500" />
          บทบาทจริง: <span className="ml-1 font-bold">{getRoleDisplayName(actualRole)}</span>
        </p>
        {isMockMode && (
          <p className="text-xs text-red-500 mt-1">
            (กำลังจำลองบทบาท: {getRoleDisplayName(currentRole as UserRole)})
          </p>
        )}
      </div>

      <div className="space-y-2">
        {MOCKABLE_ROLES.map((role) => (
          <button
            key={role}
            onClick={() => setMockRole(role)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentRole === role
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
            }`}
            disabled={currentRole === role}
          >
            <span className="flex items-center">
              <span className="mr-2">{getRoleIcon(role)}</span>
              {getRoleDisplayName(role)}
            </span>
            {currentRole === role && (
              <span className="text-xs font-bold">ACTIVE</span>
            )}
          </button>
        ))}

        {isMockMode && (
          <button
            onClick={clearMockRole}
            className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            ยกเลิกการจำลองบทบาท
          </button>
        )}
      </div>
    </div>
  );
};

export default DevSidebarSwitcher;
