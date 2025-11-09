import React from 'react';
import { Tooltip, Icon, Box } from '@chakra-ui/react';
import { FiLock, FiUnlock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useHasPermission, useHasAnyPermission } from '../hooks/useAuth';
import { Permission } from '../hooks/useAuth';

interface PermissionIndicatorProps {
  /**
   * Required permission(s)
   */
  permission: Permission | Permission[];
  
  /**
   * Show indicator for all permissions or any permission
   * @default 'all'
   */
  requireAll?: boolean;
  
  /**
   * Custom label for tooltip
   */
  label?: string;
  
  /**
   * Size of the icon
   * @default 4
   */
  size?: number;
}

/**
 * PermissionIndicator Component
 * 
 * Visual indicator showing if user has specific permission(s)
 * 
 * @example
 * <PermissionIndicator permission={Permission.CREATE_USER} />
 * 
 * @example
 * <PermissionIndicator 
 *   permission={[Permission.UPDATE_USER, Permission.DELETE_USER]}
 *   requireAll={false}
 *   label="สามารถจัดการผู้ใช้"
 * />
 */
export const PermissionIndicator: React.FC<PermissionIndicatorProps> = ({
  permission,
  requireAll = true,
  label,
  size = 4,
}) => {
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  const hasSinglePermission = useHasPermission(permissions[0]);
  const hasAnyPerm = useHasAnyPermission(permissions);
  
  const hasPermission = permissions.length === 1 
    ? hasSinglePermission 
    : hasAnyPerm;

  const getPermissionLabel = (perm: Permission): string => {
    const labels: Record<Permission, string> = {
      // User Management
      [Permission.CREATE_USER]: 'สร้างผู้ใช้',
      [Permission.READ_USER]: 'ดูข้อมูลผู้ใช้',
      [Permission.UPDATE_USER]: 'แก้ไขผู้ใช้',
      [Permission.DELETE_USER]: 'ลบผู้ใช้',
      [Permission.MANAGE_ROLES]: 'จัดการบทบาท',
      
      // Incident Management
      [Permission.CREATE_INCIDENT]: 'สร้างเหตุการณ์',
      [Permission.READ_INCIDENT]: 'ดูเหตุการณ์',
      [Permission.UPDATE_INCIDENT]: 'แก้ไขเหตุการณ์',
      [Permission.DELETE_INCIDENT]: 'ลบเหตุการณ์',
      [Permission.ASSIGN_INCIDENT]: 'มอบหมายเหตุการณ์',
      
      // Task Management
      [Permission.CREATE_TASK]: 'สร้างงาน',
      [Permission.READ_TASK]: 'ดูงาน',
      [Permission.UPDATE_TASK]: 'แก้ไขงาน',
      [Permission.DELETE_TASK]: 'ลบงาน',
      [Permission.ASSIGN_TASK]: 'มอบหมายงาน',
      
      // Report Management
      [Permission.CREATE_REPORT]: 'สร้างรายงาน',
      [Permission.READ_REPORT]: 'ดูรายงาน',
      [Permission.UPDATE_REPORT]: 'แก้ไขรายงาน',
      [Permission.DELETE_REPORT]: 'ลบรายงาน',
      [Permission.APPROVE_REPORT]: 'อนุมัติรายงาน',
      
      // Analytics
      [Permission.VIEW_ANALYTICS]: 'ดูสถิติ',
      [Permission.VIEW_TEAM_ANALYTICS]: 'ดูสถิติทีม',
      [Permission.VIEW_ALL_ANALYTICS]: 'ดูสถิติทั้งหมด',
      
      // Admin Functions
      [Permission.MANAGE_SYSTEM_SETTINGS]: 'จัดการการตั้งค่าระบบ',
      [Permission.VIEW_AUDIT_LOGS]: 'ดูบันทึกการตรวจสอบ',
      [Permission.MANAGE_GEOJSON]: 'จัดการ GeoJSON',
      [Permission.MANAGE_CUSTOM_LAYERS]: 'จัดการ Custom Layers',
    };
    
    return labels[perm] || perm;
  };

  const tooltipLabel = label || (
    permissions.length === 1
      ? `สิทธิ์: ${getPermissionLabel(permissions[0])}`
      : `สิทธิ์: ${permissions.map(getPermissionLabel).join(', ')}`
  );

  const icon = hasPermission ? FiUnlock : FiLock;
  const color = hasPermission ? 'green.500' : 'red.500';

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <Box display="inline-flex" alignItems="center">
        <Icon as={icon} boxSize={size} color={color} />
      </Box>
    </Tooltip>
  );
};

/**
 * ViewPermissionIndicator Component
 * 
 * Simplified indicator for view/read permissions
 */
export const ViewPermissionIndicator: React.FC<{
  hasPermission: boolean;
  label?: string;
  size?: number;
}> = ({ hasPermission, label, size = 4 }) => {
  const icon = hasPermission ? FiEye : FiEyeOff;
  const color = hasPermission ? 'blue.500' : 'gray.400';
  const tooltipLabel = label || (hasPermission ? 'สามารถดูได้' : 'ไม่สามารถดูได้');

  return (
    <Tooltip label={tooltipLabel} placement="top">
      <Box display="inline-flex" alignItems="center">
        <Icon as={icon} boxSize={size} color={color} />
      </Box>
    </Tooltip>
  );
};

export default PermissionIndicator;
