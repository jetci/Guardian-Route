/**
 * Chart Card Component
 * Container สำหรับ charts พร้อม header และ actions
 * รองรับ responsive height
 */

import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  height?: 'sm' | 'md' | 'lg' | 'xl';
  subtitle?: string;
  fullWidth?: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  action,
  height = 'md',
  subtitle,
  fullWidth = false
}) => {
  const heightClasses = {
    sm: 'h-48 sm:h-56',
    md: 'h-56 sm:h-64 md:h-72',
    lg: 'h-64 sm:h-72 md:h-80',
    xl: 'h-72 sm:h-80 md:h-96',
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 ${fullWidth ? 'col-span-full' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <h3 
            className="text-base sm:text-lg font-semibold text-gray-900 truncate"
            title={title}
          >
            {title}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500 line-clamp-2">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex-shrink-0">
            {action}
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className={heightClasses[height]}>
        {children}
      </div>
    </div>
  );
};
