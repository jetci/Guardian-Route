/**
 * Task Status Constants
 * Centralized status definitions for tasks
 */

export const TASK_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    PENDING: 'รอดำเนินการ',
    IN_PROGRESS: 'กำลังดำเนินการ',
    COMPLETED: 'เสร็จสิ้น',
    CANCELLED: 'ยกเลิก'
};

export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
    PENDING: 'orange',
    IN_PROGRESS: 'blue',
    COMPLETED: 'green',
    CANCELLED: 'gray'
};

export const TASK_STATUS_ICONS: Record<TaskStatus, string> = {
    PENDING: '⏳',
    IN_PROGRESS: '🔄',
    COMPLETED: '✅',
    CANCELLED: '❌'
};
