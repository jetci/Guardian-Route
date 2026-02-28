import React from 'react';
import {
  getSurveyStatusLabel,
  getSurveyStatusIcon,
  getSurveyStatusBgColor,
  type SurveyStatus
} from '../constants/surveyStatus';

interface SurveyStatusBadgeProps {
  status: string | SurveyStatus;
  showIcon?: boolean;
  className?: string;
}

/**
 * Survey Status Badge Component
 * Displays a consistent status badge across the application
 * 
 * @example
 * <SurveyStatusBadge status="SUBMITTED" />
 * <SurveyStatusBadge status="APPROVED" showIcon={false} />
 */
export function SurveyStatusBadge({ 
  status, 
  showIcon = true,
  className = ''
}: SurveyStatusBadgeProps) {
  const label = getSurveyStatusLabel(status);
  const icon = getSurveyStatusIcon(status);
  const bgColor = getSurveyStatusBgColor(status);

  return (
    <span 
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${bgColor} ${className}`}
    >
      {showIcon && <span>{icon}</span>}
      <span>{label}</span>
    </span>
  );
}

export default SurveyStatusBadge;
