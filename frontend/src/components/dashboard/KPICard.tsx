/**
 * KPI Card Component
 * แสดงตัวเลข KPI พร้อม icon และ trend
 * รองรับ responsive และ text truncation
 */

import React from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
  subtitle?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'blue',
  subtitle
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600',
    gray: 'from-gray-500 to-gray-600',
  };

  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    stable: 'text-gray-600 bg-gray-50',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          {/* Title */}
          <p 
            className="text-xs sm:text-sm font-medium text-gray-600 truncate"
            title={title}
          >
            {title}
          </p>

          {/* Value */}
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            {value}
          </p>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-1 text-xs text-gray-500 truncate" title={subtitle}>
              {subtitle}
            </p>
          )}

          {/* Trend */}
          {trend && trendValue && (
            <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
              <span>{trendIcons[trend]}</span>
              <span className="truncate max-w-[100px]">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-2xl sm:text-3xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
