import React from 'react';
import { Button, ButtonProps, Tooltip } from '@chakra-ui/react';
import { useHasRole, useHasPermission, useHasAnyRole, useHasAnyPermission } from '../hooks/useAuth';
import { Role } from './guards/RoleGuard';
import { Permission } from '../hooks/useAuth';

interface ConditionalButtonProps extends ButtonProps {
  /**
   * Required role(s) to show/enable the button
   */
  requiredRole?: Role | Role[];
  
  /**
   * Required permission(s) to show/enable the button
   */
  requiredPermission?: Permission | Permission[];
  
  /**
   * If true, button will be hidden instead of disabled
   * @default false
   */
  hideIfNoAccess?: boolean;
  
  /**
   * Custom tooltip message when disabled
   */
  disabledTooltip?: string;
  
  /**
   * Children/button content
   */
  children: React.ReactNode;
}

/**
 * ConditionalButton Component
 * 
 * Button that shows/hides or enables/disables based on user role and permissions
 * 
 * @example
 * // Only ADMIN can see and use
 * <ConditionalButton requiredRole={Role.ADMIN} hideIfNoAccess>
 *   Delete User
 * </ConditionalButton>
 * 
 * @example
 * // Button disabled if no permission
 * <ConditionalButton 
 *   requiredPermission={Permission.CREATE_USER}
 *   disabledTooltip="คุณไม่มีสิทธิ์สร้างผู้ใช้"
 * >
 *   Create User
 * </ConditionalButton>
 */
export const ConditionalButton: React.FC<ConditionalButtonProps> = ({
  requiredRole,
  requiredPermission,
  hideIfNoAccess = false,
  disabledTooltip = 'คุณไม่มีสิทธิ์ใช้งานฟังก์ชันนี้',
  children,
  ...buttonProps
}) => {
  // Check role access
  let hasRoleAccess = true;
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    hasRoleAccess = useHasAnyRole(roles);
  }

  // Check permission access
  let hasPermissionAccess = true;
  if (requiredPermission) {
    const permissions = Array.isArray(requiredPermission) ? requiredPermission : [requiredPermission];
    hasPermissionAccess = useHasAnyPermission(permissions);
  }

  const hasAccess = hasRoleAccess && hasPermissionAccess;

  // Hide button if no access and hideIfNoAccess is true
  if (!hasAccess && hideIfNoAccess) {
    return null;
  }

  // Disable button if no access
  if (!hasAccess) {
    return (
      <Tooltip label={disabledTooltip} placement="top">
        <Button {...buttonProps} isDisabled>
          {children}
        </Button>
      </Tooltip>
    );
  }

  // Show normal button
  return <Button {...buttonProps}>{children}</Button>;
};

export default ConditionalButton;
