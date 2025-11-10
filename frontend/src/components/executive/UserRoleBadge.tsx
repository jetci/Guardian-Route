import React from 'react';

interface UserRoleBadgeProps {
  userName?: string;
  userRole?: string;
}

const ROLE_LABELS: Record<string, string> = {
  EXECUTIVE: 'ผู้บริหาร',
  ADMIN: 'ผู้ดูแลระบบ',
  SUPERVISOR: 'หัวหน้างาน',
  FIELD_OFFICER: 'เจ้าหน้าที่ภาคสนาม',
};

const ROLE_COLORS: Record<string, string> = {
  EXECUTIVE: 'bg-purple-100 text-purple-800 border-purple-300',
  ADMIN: 'bg-red-100 text-red-800 border-red-300',
  SUPERVISOR: 'bg-blue-100 text-blue-800 border-blue-300',
  FIELD_OFFICER: 'bg-green-100 text-green-800 border-green-300',
};

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ userName, userRole }) => {
  if (!userRole) {
    return null;
  }

  const roleLabel = ROLE_LABELS[userRole] || userRole;
  const roleColor = ROLE_COLORS[userRole] || 'bg-gray-100 text-gray-800 border-gray-300';

  return (
    <div className="flex items-center space-x-3">
      {userName && (
        <span className="text-sm text-gray-700 font-medium">{userName}</span>
      )}
      <span
        className={`text-xs px-3 py-1 rounded-full border ${roleColor} font-medium`}
      >
        {roleLabel}
      </span>
    </div>
  );
};
