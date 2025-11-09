import { AxiosError } from 'axios';

/**
 * Error response structure from backend
 */
interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
}

/**
 * Chakra UI Toast function type
 */
interface ToastFunction {
  (options: {
    title: string;
    description?: string;
    status: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    isClosable?: boolean;
  }): void;
}

/**
 * Handle API errors and show appropriate messages using Chakra UI toast
 */
export const handleApiError = (error: unknown, toast?: ToastFunction): void => {
  // If no toast function provided, just log the error
  if (!toast) {
    console.error('API Error:', error);
    return;
  }

  if (error instanceof AxiosError) {
    const response = error.response;
    const data = response?.data as ErrorResponse;

    switch (response?.status) {
      case 400:
        toast({
          title: 'ข้อมูลไม่ถูกต้อง',
          description: data?.message || 'กรุณาตรวจสอบข้อมูลอีกครั้ง',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        break;

      case 401:
        toast({
          title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        break;

      case 403:
        handleForbiddenError(data?.message, toast);
        break;

      case 404:
        toast({
          title: 'ไม่พบข้อมูลที่ต้องการ',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        break;

      case 409:
        toast({
          title: 'ข้อมูลซ้ำกัน',
          description: data?.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        break;

      case 429:
        toast({
          title: 'คุณส่งคำขอบ่อยเกินไป',
          description: 'กรุณารอสักครู่',
          status: 'warning',
          duration: 5000,
          isClosable: true,
        });
        break;

      case 500:
        toast({
          title: 'เกิดข้อผิดพลาดในระบบ',
          description: 'กรุณาลองใหม่อีกครั้ง',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        break;

      default:
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: data?.message || 'กรุณาลองใหม่อีกครั้ง',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
    }
  } else if (error instanceof Error) {
    toast({
      title: 'เกิดข้อผิดพลาด',
      description: error.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } else {
    toast({
      title: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  }
};

/**
 * Handle 403 Forbidden errors with specific messages
 */
const handleForbiddenError = (message: string | undefined, toast: ToastFunction): void => {
  if (!message) {
    toast({
      title: 'ไม่มีสิทธิ์เข้าถึง',
      description: 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
    return;
  }

  // Check for specific error patterns
  if (message.includes('Required roles:')) {
    const rolesMatch = message.match(/Required roles: ([A-Z_, ]+)/);
    const roles = rolesMatch ? rolesMatch[1] : '';
    toast({
      title: 'ไม่มีสิทธิ์เข้าถึง',
      description: `ต้องการบทบาท: ${roles}`,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } else if (message.includes('Required permissions:')) {
    const permsMatch = message.match(/Required permissions: ([A-Z_, ]+)/);
    const perms = permsMatch ? permsMatch[1] : '';
    toast({
      title: 'ไม่มีสิทธิ์เข้าถึง',
      description: `ต้องการสิทธิ์: ${perms}`,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } else if (message.includes('You can only access your own resources')) {
    toast({
      title: 'ไม่มีสิทธิ์เข้าถึง',
      description: 'คุณสามารถเข้าถึงเฉพาะข้อมูลของคุณเองเท่านั้น',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } else if (message.includes('User account is inactive')) {
    toast({
      title: 'บัญชีถูกระงับ',
      description: 'กรุณาติดต่อผู้ดูแลระบบ',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } else {
    toast({
      title: 'ไม่มีสิทธิ์เข้าถึง',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
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
