import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useHasRole, useHasAnyRole } from '../hooks/useAuth';
import { Role } from './guards/RoleGuard';
import { RoleBadge } from './RoleBadge';
import {
  Box,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Badge,
  useColorModeValue,
  Avatar,
  Icon,
} from '@chakra-ui/react';
import {
  FiHome,
  FiMap,
  FiClipboard,
  FiFileText,
  FiAlertCircle,
  FiCheckSquare,
  FiBarChart2,
  FiSettings,
  FiChevronDown,
  FiUser,
  FiLogOut,
} from 'react-icons/fi';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  icon?: React.ElementType;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Link to={to}>
      <Button
        leftIcon={icon ? <Icon as={icon} /> : undefined}
        variant="ghost"
        size="sm"
        bg={isActive ? activeBg : 'transparent'}
        color={isActive ? activeColor : 'inherit'}
        _hover={{ bg: hoverBg }}
        fontWeight={isActive ? 'bold' : 'normal'}
      >
        {children}
      </Button>
    </Link>
  );
};

/**
 * Navigation Component
 * 
 * Main navigation bar with role-based menu items
 */
export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  // Role checks
  const isAdmin = useHasRole(Role.ADMIN);
  const isExecutive = useHasAnyRole([Role.ADMIN, Role.EXECUTIVE]);
  const isSupervisor = useHasAnyRole([Role.ADMIN, Role.EXECUTIVE, Role.SUPERVISOR]);
  
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case Role.ADMIN:
        return 'red';
      case Role.EXECUTIVE:
        return 'purple';
      case Role.SUPERVISOR:
        return 'blue';
      case Role.FIELD_OFFICER:
        return 'green';
      default:
        return 'gray';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case Role.ADMIN:
        return 'ผู้ดูแลระบบ';
      case Role.EXECUTIVE:
        return 'ผู้บริหาร';
      case Role.SUPERVISOR:
        return 'หัวหน้างาน';
      case Role.FIELD_OFFICER:
        return 'เจ้าหน้าที่ภาคสนาม';
      default:
        return role;
    }
  };

  return (
    <Box bg={bg} borderBottom="1px" borderColor={borderColor} px={4} shadow="sm">
      <Flex h={16} alignItems="center" justifyContent="space-between" maxW="7xl" mx="auto">
        {/* Logo */}
        <Link to="/dashboard">
          <Text fontSize="xl" fontWeight="bold" color="blue.600">
            Guardian Route
          </Text>
        </Link>

        {/* Navigation Links */}
        <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
          {/* Dashboard - All roles */}
          <NavLink to="/dashboard" icon={FiHome}>
            หน้าหลัก
          </NavLink>

          {/* Incidents - All roles */}
          <NavLink to="/incidents" icon={FiAlertCircle}>
            เหตุการณ์
          </NavLink>

          {/* Tasks - All roles */}
          <NavLink to="/my-tasks" icon={FiCheckSquare}>
            งานของฉัน
          </NavLink>

          {/* Reports - All roles */}
          <NavLink to="/reports" icon={FiFileText}>
            รายงาน
          </NavLink>

          {/* Supervisor Menu */}
          {isSupervisor && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                variant="ghost"
                size="sm"
              >
                จัดการทีม
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiMap />} onClick={() => navigate('/supervisor')}>
                  แดชบอร์ดหัวหน้างาน
                </MenuItem>
                <MenuItem icon={<FiMap />} onClick={() => navigate('/map')}>
                  แผนที่
                </MenuItem>
                <MenuItem icon={<FiCheckSquare />} onClick={() => navigate('/tasks')}>
                  จัดการงาน
                </MenuItem>
                <MenuItem icon={<FiClipboard />} onClick={() => navigate('/supervisor/survey-templates')}>
                  แบบสำรวจ
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Executive Menu */}
          {isExecutive && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                variant="ghost"
                size="sm"
              >
                ผู้บริหาร
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiBarChart2 />} onClick={() => navigate('/executive-dashboard')}>
                  แดชบอร์ดผู้บริหาร
                </MenuItem>
                <MenuItem icon={<FiMap />} onClick={() => navigate('/analysis/overlay')}>
                  วิเคราะห์ข้อมูล
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Admin Menu */}
          {isAdmin && (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                variant="ghost"
                size="sm"
                colorScheme="red"
              >
                ผู้ดูแลระบบ
              </MenuButton>
              <MenuList>
                <MenuItem icon={<FiSettings />} onClick={() => navigate('/admin/dashboard')}>
                  จัดการระบบ
                </MenuItem>
                <MenuItem icon={<FiShield />} onClick={() => navigate('/admin/roles')}>
                  จัดการบทบาทและสิทธิ์
                </MenuItem>
                <MenuItem icon={<FiFileText />} onClick={() => navigate('/admin/audit-logs')}>
                  บันทึกการตรวจสอบ
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>

        {/* User Menu */}
        <Menu>
          <MenuButton
            as={Button}
            variant="ghost"
            rightIcon={<FiChevronDown />}
            size="sm"
          >
            <HStack spacing={2}>
              <Avatar size="xs" name={user?.fullName || user?.email} />
              <Box display={{ base: 'none', md: 'block' }} textAlign="left">
                <Text fontSize="sm" fontWeight="medium">
                  {user?.fullName || user?.email}
                </Text>
              </Box>
            </HStack>
          </MenuButton>
          <MenuList>
            <Box px={3} py={2}>
              <Text fontSize="sm" fontWeight="medium">
                {user?.fullName || user?.email}
              </Text>
              <Text fontSize="xs" color="gray.500">
                {user?.email}
              </Text>
              <RoleBadge role={user?.role || ''} size="sm" />
            </Box>
            <MenuDivider />
            <MenuItem icon={<FiUser />} onClick={() => navigate('/profile')}>
              โปรไฟล์
            </MenuItem>
            <MenuItem icon={<FiSettings />} onClick={() => navigate('/settings')}>
              ตั้งค่า
            </MenuItem>
            <MenuDivider />
            <MenuItem icon={<FiLogOut />} onClick={handleLogout} color="red.500">
              ออกจากระบบ
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Box>
  );
};

export default Navigation;
