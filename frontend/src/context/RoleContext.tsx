import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Available user roles in the system
 */
export type UserRole = 
  | 'ADMIN'
  | 'SUPERVISOR'
  | 'FIELD_OFFICER'
  | 'EXECUTIVE'
  | 'DEVELOPER'
  | 'GUEST';

/**
 * User information interface
 */
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  fullName: string;
}

/**
 * Role context value interface
 */
interface RoleContextValue {
  user: User | null;
  currentRole: UserRole | null;
  isMockMode: boolean;
  setMockRole: (role: UserRole) => void;
  clearMockRole: () => void;
  setUser: (user: User | null) => void;
  isDeveloper: boolean;
}

/**
 * Role context provider props
 */
interface RoleProviderProps {
  children: ReactNode;
}

// Create context
const RoleContext = createContext<RoleContextValue | undefined>(undefined);

// LocalStorage keys
const MOCK_ROLE_KEY = 'dev_mock_role';
const USER_KEY = 'user_data';

/**
 * Role Context Provider
 * Manages user role and mock role for development
 */
export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [mockRole, setMockRoleState] = useState<UserRole | null>(null);

  // Load user and mock role from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    const storedMockRole = localStorage.getItem(MOCK_ROLE_KEY);

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
      }
    }

    if (storedMockRole) {
      setMockRoleState(storedMockRole as UserRole);
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  /**
   * Set mock role for development
   * Only available for DEVELOPER role
   */
  const setMockRole = (role: UserRole) => {
    if (user?.role !== 'DEVELOPER') {
      console.warn('Mock role can only be set by DEVELOPER role');
      return;
    }

    setMockRoleState(role);
    localStorage.setItem(MOCK_ROLE_KEY, role);
  };

  /**
   * Clear mock role and return to actual user role
   */
  const clearMockRole = () => {
    setMockRoleState(null);
    localStorage.removeItem(MOCK_ROLE_KEY);
  };

  // Determine current effective role (mock role takes precedence)
  const currentRole = mockRole || user?.role || null;
  const isMockMode = mockRole !== null;
  const isDeveloper = user?.role === 'DEVELOPER';

  const value: RoleContextValue = {
    user,
    currentRole,
    isMockMode,
    setMockRole,
    clearMockRole,
    setUser,
    isDeveloper,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

/**
 * Hook to access role context
 * @throws Error if used outside RoleProvider
 */
export const useRole = (): RoleContextValue => {
  const context = useContext(RoleContext);
  
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  
  return context;
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (role: UserRole | UserRole[]): boolean => {
  const { currentRole } = useRole();
  
  if (!currentRole) {
    return false;
  }
  
  if (Array.isArray(role)) {
    return role.includes(currentRole);
  }
  
  return currentRole === role;
};

/**
 * Hook to check if user is in mock mode
 */
export const useIsMockMode = (): boolean => {
  const { isMockMode } = useRole();
  return isMockMode;
};

/**
 * Hook to check if user is developer
 */
export const useIsDeveloper = (): boolean => {
  const { isDeveloper } = useRole();
  return isDeveloper;
};
