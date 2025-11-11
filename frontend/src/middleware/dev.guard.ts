import type { UserRole } from '../context/RoleContext';

/**
 * Developer Guard
 * 
 * Middleware to protect developer-only features and routes.
 * Checks if the current user has DEVELOPER role.
 */

/**
 * Check if user has developer role
 */
export const isDeveloperRole = (role: UserRole | null): boolean => {
  return role === 'DEVELOPER';
};

/**
 * Check if developer mode is enabled
 * Checks both user role and localStorage flag
 */
export const isDeveloperModeEnabled = (): boolean => {
  // Check localStorage flag (can be set manually for testing)
  const devModeFlag = localStorage.getItem('dev_mode');
  if (devModeFlag === 'true') {
    return true;
  }

  // Check if running in development environment
  if (import.meta.env.DEV) {
    return true;
  }

  return false;
};

/**
 * Guard function for developer-only features
 * Returns true if access is allowed, false otherwise
 */
export const canAccessDeveloperFeatures = (role: UserRole | null): boolean => {
  // Must be DEVELOPER role
  if (!isDeveloperRole(role)) {
    return false;
  }

  // Additional check: developer mode must be enabled
  if (!isDeveloperModeEnabled()) {
    return false;
  }

  return true;
};

/**
 * Developer-only route guard
 * Use this in route configurations to protect developer routes
 */
export const requireDeveloperRole = (
  role: UserRole | null,
  onUnauthorized?: () => void
): boolean => {
  const hasAccess = canAccessDeveloperFeatures(role);

  if (!hasAccess && onUnauthorized) {
    onUnauthorized();
  }

  return hasAccess;
};

/**
 * Enable developer mode
 * Sets localStorage flag and returns true
 */
export const enableDeveloperMode = (): void => {
  localStorage.setItem('dev_mode', 'true');
  console.log('[DEV] Developer mode enabled');
};

/**
 * Disable developer mode
 * Removes localStorage flag
 */
export const disableDeveloperMode = (): void => {
  localStorage.removeItem('dev_mode');
  console.log('[DEV] Developer mode disabled');
};

/**
 * Toggle developer mode
 */
export const toggleDeveloperMode = (): boolean => {
  const isEnabled = isDeveloperModeEnabled();
  
  if (isEnabled) {
    disableDeveloperMode();
    return false;
  } else {
    enableDeveloperMode();
    return true;
  }
};

/**
 * Log access attempt for auditing
 */
export const logDeveloperAccess = (
  feature: string,
  role: UserRole | null,
  allowed: boolean
): void => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    feature,
    role,
    allowed,
    userAgent: navigator.userAgent,
  };

  console.log('[DEV GUARD]', logEntry);

  // Store in localStorage for debugging
  const logs = JSON.parse(localStorage.getItem('dev_access_logs') || '[]');
  logs.push(logEntry);
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.shift();
  }
  
  localStorage.setItem('dev_access_logs', JSON.stringify(logs));
};

/**
 * Get developer access logs
 */
export const getDeveloperAccessLogs = (): any[] => {
  return JSON.parse(localStorage.getItem('dev_access_logs') || '[]');
};

/**
 * Clear developer access logs
 */
export const clearDeveloperAccessLogs = (): void => {
  localStorage.removeItem('dev_access_logs');
  console.log('[DEV GUARD] Access logs cleared');
};
