import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

/**
 * Error response structure from backend
 */
interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

/**
 * Handle API errors and show appropriate messages
 */
export const handleApiError = (error: unknown): void => {
  if (error instanceof AxiosError) {
    const response = error.response;
    const data = response?.data as ErrorResponse;

    switch (response?.status) {
      case 400:
        toast.error(data?.message || 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง');
        break;

      case 401:
        toast.error('กรุณาเข้าสู่ระบบอีกครั้ง');
        // Handled by API client interceptor
        break;

      case 403:
        handleForbiddenError(data?.message);
        break;

      case 404:
        toast.error('ไม่พบข้อมูลที่ต้องการ');
        break;

      case 409:
        toast.error(data?.message || 'ข้อมูลซ้ำกัน');
        break;

      case 429:
        toast.error('คุณส่งคำขอบ่อยเกินไป กรุณารอสักครู่');
        break;

      case 500:
        toast.error('เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง');
        break;

      default:
        toast.error(data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    }
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
  }
};

/**
 * Handle 403 Forbidden errors with specific messages
 */
const handleForbiddenError = (message?: string): void => {
  if (!message) {
    toast.error('คุณไม่มีสิทธิ์เข้าถึงส่วนนี้');
    return;
  }

  // Check for specific error patterns
  if (message.includes('Required roles:')) {
    // Extract roles from message
    const rolesMatch = message.match(/Required roles: ([A-Z_, ]+)/);
    const roles = rolesMatch ? rolesMatch[1] : '';
    toast.error(`ต้องการบทบาท: ${roles}`, {
      duration: 5000,
    });
  } else if (message.includes('Required permissions:')) {
    // Extract permissions from message
    const permsMatch = message.match(/Required permissions: ([A-Z_, ]+)/);
    const perms = permsMatch ? permsMatch[1] : '';
    toast.error(`ต้องการสิทธิ์: ${perms}`, {
      duration: 5000,
    });
  } else if (message.includes('You can only access your own resources')) {
    toast.error('คุณสามารถเข้าถึงเฉพาะข้อมูลของคุณเองเท่านั้น');
  } else if (message.includes('User account is inactive')) {
    toast.error('บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ');
  } else {
    toast.error(message);
  }
};

/**
 * Handle validation errors (400)
 */
export const handleValidationError = (error: unknown): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (error instanceof AxiosError) {
    const data = error.response?.data;
    
    if (data?.message && Array.isArray(data.message)) {
      // NestJS validation errors
      data.message.forEach((msg: string) => {
        const [field, ...rest] = msg.split(' ');
        errors[field] = rest.join(' ');
      });
    } else if (data?.errors && typeof data.errors === 'object') {
      // Custom validation errors
      Object.assign(errors, data.errors);
    }
  }

  return errors;
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return !error.response && error.code === 'ERR_NETWORK';
  }
  return false;
};

/**
 * Check if error is a timeout error
 */
export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.code === 'ECONNABORTED';
  }
  return false;
};

/**
 * Get error message from error object
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ErrorResponse;
    return data?.message || error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  }
  return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
};

/**
 * Show success toast
 */
export const showSuccess = (message: string): void => {
  toast.success(message);
};

/**
 * Show error toast
 */
export const showError = (message: string): void => {
  toast.error(message);
};

/**
 * Show info toast
 */
export const showInfo = (message: string): void => {
  toast(message, {
    icon: 'ℹ️',
  });
};

/**
 * Show warning toast
 */
export const showWarning = (message: string): void => {
  toast(message, {
    icon: '⚠️',
    duration: 4000,
  });
};
