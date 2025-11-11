import React, { useState } from 'react';
import { useMockRole, getRoleDisplayName, getRoleColor, getRoleIcon } from '../../hooks/useMockRole';
import type { UserRole } from '../../context/RoleContext';

/**
 * Developer Sidebar Switcher Component
 * 
 * Allows developers to switch between different user roles for testing purposes.
 * Only visible when user has DEVELOPER role.
 */
export const DevSidebarSwitcher: React.FC = () => {
  const {
    currentRole,
    actualRole,
    isMockMode,

    setMockRole,
    clearMockRole,
    availableRoles,
    canUseMockMode,
  } = useMockRole();

  const [isOpen, setIsOpen] = useState(false);

  // Don't render if not a developer
  if (!canUseMockMode) {
    return null;
  }

  const handleRoleSelect = (role: UserRole) => {
    setMockRole(role);
    setIsOpen(false);
  };

  const handleClearMock = () => {
    clearMockRole();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Developer Mode Indicator */}
      <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">👨‍💻</span>
              <span className="text-sm font-semibold text-yellow-800">
                Developer Mode
              </span>
            </div>
            {isMockMode && (
              <div className="mt-1 text-xs text-yellow-700">
                Mock: {getRoleIcon(currentRole!)} {getRoleDisplayName(currentRole!)}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded hover:bg-yellow-200 transition-colors"
          >
            {isOpen ? 'ปิด' : 'สลับบทบาท'}
          </button>
        </div>
      </div>

      {/* Role Switcher Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700">
              เลือกบทบาทสำหรับทดสอบ
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              บทบาทจริง: {getRoleIcon(actualRole!)} {getRoleDisplayName(actualRole!)}
            </p>
          </div>

          <div className="p-2">
            {/* Clear Mock Button */}
            {isMockMode && (
              <button
                onClick={handleClearMock}
                className="w-full px-3 py-2 mb-2 text-left text-sm font-medium text-red-700 bg-red-50 rounded hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <span>🔄</span>
                <span>ล้างการจำลอง (กลับสู่บทบาทจริง)</span>
              </button>
            )}

            {/* Role Options */}
            {availableRoles.map((role) => {
              const isActive = currentRole === role;
              const isActual = actualRole === role;

              return (
                <button
                  key={role}
                  onClick={() => handleRoleSelect(role)}
                  disabled={isActual && !isMockMode}
                  className={`
                    w-full px-3 py-2 mb-1 text-left text-sm rounded transition-colors
                    flex items-center justify-between gap-2
                    ${isActive
                      ? 'bg-blue-100 text-blue-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                    ${isActual && !isMockMode
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRoleIcon(role)}</span>
                    <span>{getRoleDisplayName(role)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {isActive && (
                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                        ปัจจุบัน
                      </span>
                    )}
                    {isActual && (
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                        บทบาทจริง
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Info Footer */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-600">
              💡 การเปลี่ยนบทบาทจะมีผลทันทีและจะถูกบันทึกใน LocalStorage
            </p>
          </div>
        </div>
      )}

      {/* Current Role Display */}
      <div className="mt-4 p-3 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500 mb-1">บทบาทปัจจุบัน</div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${getRoleColor(currentRole!)}`}></span>
              <span className="text-sm font-medium text-gray-800">
                {getRoleIcon(currentRole!)} {getRoleDisplayName(currentRole!)}
              </span>
            </div>
          </div>
          {isMockMode && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">
              MOCK
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevSidebarSwitcher;
