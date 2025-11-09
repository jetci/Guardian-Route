import React from 'react';
import { Badge, Tooltip, Icon, HStack } from '@chakra-ui/react';
import { FiShield, FiStar, FiUsers, FiUser } from 'react-icons/fi';
import { Role } from './guards/RoleGuard';

interface RoleBadgeProps {
  /**
   * User role
   */
  role: string;
  
  /**
   * Size of the badge
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show icon
   * @default true
   */
  showIcon?: boolean;
  
  /**
   * Show tooltip with role description
   * @default true
   */
  showTooltip?: boolean;
}

/**
 * Get role display properties
 */
const getRoleProps = (role: string) => {
  switch (role) {
    case Role.ADMIN:
      return {
        label: 'ผู้ดูแลระบบ',
        colorScheme: 'red',
        icon: FiShield,
        description: 'มีสิทธิ์เข้าถึงทุกฟังก์ชันในระบบ',
      };
    case Role.EXECUTIVE:
      return {
        label: 'ผู้บริหาร',
        colorScheme: 'purple',
        icon: FiStar,
        description: 'สามารถดูรายงานและวิเคราะห์ข้อมูลระดับองค์กร',
      };
    case Role.SUPERVISOR:
      return {
        label: 'หัวหน้างาน',
        colorScheme: 'blue',
        icon: FiUsers,
        description: 'สามารถจัดการทีมและมอบหมายงาน',
      };
    case Role.FIELD_OFFICER:
      return {
        label: 'เจ้าหน้าที่ภาคสนาม',
        colorScheme: 'green',
        icon: FiUser,
        description: 'สามารถรายงานเหตุการณ์และทำงานที่ได้รับมอบหมาย',
      };
    default:
      return {
        label: role,
        colorScheme: 'gray',
        icon: FiUser,
        description: 'บทบาทในระบบ',
      };
  }
};

/**
 * Get badge size props
 */
const getSizeProps = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        fontSize: 'xs',
        px: 2,
        py: 0.5,
        iconSize: 3,
      };
    case 'lg':
      return {
        fontSize: 'md',
        px: 4,
        py: 1.5,
        iconSize: 5,
      };
    default: // md
      return {
        fontSize: 'sm',
        px: 3,
        py: 1,
        iconSize: 4,
      };
  }
};

/**
 * RoleBadge Component
 * 
 * Display user role with color-coded badge and optional icon
 * 
 * @example
 * <RoleBadge role={user.role} />
 * 
 * @example
 * <RoleBadge role={Role.ADMIN} size="lg" showIcon={true} />
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'md',
  showIcon = true,
  showTooltip = true,
}) => {
  const roleProps = getRoleProps(role);
  const sizeProps = getSizeProps(size);

  const badgeContent = (
    <Badge
      colorScheme={roleProps.colorScheme}
      fontSize={sizeProps.fontSize}
      px={sizeProps.px}
      py={sizeProps.py}
      borderRadius="full"
      fontWeight="medium"
      display="inline-flex"
      alignItems="center"
    >
      {showIcon && (
        <HStack spacing={1}>
          <Icon as={roleProps.icon} boxSize={sizeProps.iconSize} />
          <span>{roleProps.label}</span>
        </HStack>
      )}
      {!showIcon && roleProps.label}
    </Badge>
  );

  if (showTooltip) {
    return (
      <Tooltip label={roleProps.description} placement="bottom">
        {badgeContent}
      </Tooltip>
    );
  }

  return badgeContent;
};

export default RoleBadge;
