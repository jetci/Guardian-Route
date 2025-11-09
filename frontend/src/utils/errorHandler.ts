import { AxiosError } from 'axios';
import { CreateToastFnReturn } from '@chakra-ui/react';

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
 * @param error - The error object
 * @param toast - Chakra UI toast function
 */
export const handleApiError = (error: unknown, toast: CreateToastFnReturn): void => {
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
          position: 'top-right',
        });
        break;

      case 401:
        toast({
          title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
          description: 'Session หมดอายุ',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        // Handled by API client interceptor
        break;

      case 403:
        handleForbiddenError(data?.message, toast);
        break;

      case 404:
        toast({
          title: 'ไม่พบข้อมูล',
          description: 'ไม่พบข้อมูลที่ต้องการ',
          status: 'error',
          duration: 4000,
          isClosable: true,
          position: 'top-right',
        });
        break;

      case 409:
        toast({
          title: 'ข้อมูลซ้ำกัน',
          description: data?.message || 'ข้อมูลนี้มีอยู่ในระบบแล้ว',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        break;

      case 429:
        toast({
          title: 'คำขอบ่อยเกินไป',
          description: 'กรุณารอสักครู่แล้วลองใหม่อีกครั้ง',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
        break;

      case 500:
        toast({
          title: 'เกิดข้อผิดพลาดในระบบ',
          description: 'กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ',
          status: 'error',
          duration: 6000,
          isClosable: true,
          position: 'top-right',
        });
        break;

      default:
        toast({
          title: 'เกิดข้อผิดพลาด',
          description: data?.message || 'กรุณาลองใหม่อีกครั้ง',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
        });
    }
  } else if (error instanceof Error) {
    toast({
      title: 'เกิดข้อผิดพลาด',
      description: error.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  } else {
    toast({
      title: 'เกิดข้อผิดพลาด',
      description: 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ',
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  }
};

/**
 * Handle 403 Forbidden errors with specific messages
 */
const handleForbiddenError = (message: string | undefined, toast: CreateToastFnReturn): void => {
  if (!message) {
    toast({
      title: 'ไม่มีสิทธิ์เข้าถึง',
      description: 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้',
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
    return;
  }

  // Check for specific error patterns
  if (message.includes('Required roles:')) {
    // Extract roles from message
    const rolesMatch = message.match(/Required roles: ([A-Z_, ]+)/);
    const roles = rolesMatch ? rolesMatch[1] : '';
    toast({
      title: 'ต้องการบทบาทที่สูงกว่า',
      description: `ต้องการบทบาท: ${roles}`,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  } else if (message.includes('Required permissions:')) {
    // Extract permissions from message
    const permsMatch = message.match(/Required permissions: ([A-Z_, ]+)/);
    const perms = permsMatch ? permsMatch[1] : '';
    toast({
      title: 'ต้องการสิทธิ์เพิ่มเติม',
      description: `ต้องการสิทธิ์: ${perms}`,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  } else if (message.includes('You can only access your own resources')) {
    toast({
      title: 'ไม่สามารถเข้าถึงได้',
      description: 'คุณสามารถเข้าถึงเฉพาะข้อมูลของคุณเองเท่านั้น',
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  } else if (message.includes('User account is inactive')) {
    toast({
      title: 'บัญชีถูกระงับ',
      description: 'บัญชีของคุณถูกระงับ กรุณาติดต่อผู้ดูแลระบบ',
      status: 'error',
      duration: 6000,
      isClosable: true,
      position: 'top-right',
    });
  } else {
    toast({
      title: 'ไม่มีสิทธิ์เข้าถึง',
      description: message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
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

/**
 * Show success toast
 */
export const showSuccess = (message: string, toast: CreateToastFnReturn): void => {
  toast({
    title: 'สำเร็จ',
    description: message,
    status: 'success',
    duration: 3000,
    isClosable: true,
    position: 'top-right',
  });
};

/**
 * Show error toast
 */
export const showError = (message: string, toast: CreateToastFnReturn): void => {
  toast({
    title: 'เกิดข้อผิดพลาด',
    description: message,
    status: 'error',
    duration: 5000,
    isClosable: true,
    position: 'top-right',
  });
};

/**
 * Show info toast
 */
export const showInfo = (message: string, toast: CreateToastFnReturn): void => {
  toast({
    title: 'แจ้งเตือน',
    description: message,
    status: 'info',
    duration: 4000,
    isClosable: true,
    position: 'top-right',
  });
};

/**
 * Show warning toast
 */
export const showWarning = (message: string, toast: CreateToastFnReturn): void => {
  toast({
    title: 'คำเตือน',
    description: message,
    status: 'warning',
    duration: 4000,
    isClosable: true,
    position: 'top-right',
  });
};
