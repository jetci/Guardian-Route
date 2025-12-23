/**
 * Survey Status Constants
 * Standardized status values across the application
 */

export const SURVEY_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  REVIEWED: 'REVIEWED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
} as const;

export type SurveyStatus = typeof SURVEY_STATUS[keyof typeof SURVEY_STATUS];

/**
 * Thai labels for survey statuses
 */
export const SURVEY_STATUS_LABELS: Record<SurveyStatus, string> = {
  DRAFT: 'แบบร่าง',
  SUBMITTED: 'ส่งแล้ว',
  REVIEWED: 'ตรวจสอบแล้ว',
  APPROVED: 'อนุมัติแล้ว',
  REJECTED: 'ปฏิเสธ'
};

/**
 * Colors for survey statuses (Tailwind CSS classes)
 */
export const SURVEY_STATUS_COLORS: Record<SurveyStatus, string> = {
  DRAFT: 'gray',
  SUBMITTED: 'blue',
  REVIEWED: 'purple',
  APPROVED: 'green',
  REJECTED: 'red'
};

/**
 * Background colors for survey status badges
 */
export const SURVEY_STATUS_BG_COLORS: Record<SurveyStatus, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  REVIEWED: 'bg-purple-100 text-purple-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
};

/**
 * Icons for survey statuses
 */
export const SURVEY_STATUS_ICONS: Record<SurveyStatus, string> = {
  DRAFT: '📝',
  SUBMITTED: '📤',
  REVIEWED: '👁️',
  APPROVED: '✅',
  REJECTED: '❌'
};

/**
 * Helper function to get status label
 */
export function getSurveyStatusLabel(status: string): string {
  return SURVEY_STATUS_LABELS[status as SurveyStatus] || status;
}

/**
 * Helper function to get status color
 */
export function getSurveyStatusColor(status: string): string {
  return SURVEY_STATUS_COLORS[status as SurveyStatus] || 'gray';
}

/**
 * Helper function to get status icon
 */
export function getSurveyStatusIcon(status: string): string {
  return SURVEY_STATUS_ICONS[status as SurveyStatus] || '📋';
}

/**
 * Helper function to get status background color class
 */
export function getSurveyStatusBgColor(status: string): string {
  return SURVEY_STATUS_BG_COLORS[status as SurveyStatus] || 'bg-gray-100 text-gray-800';
}
