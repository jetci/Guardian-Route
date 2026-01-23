/**
 * Metric Card Component
 * แสดง metric เดี่ยวพร้อม icon และ description
 */

import React from 'react';

interface MetricCardProps {
  icon: string;
  value: string | number;
  label: string;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  description,
  color = 'blue'
}) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    red: 'text-red-600 bg-red-50',
    gray: 'text-gray-600 bg-gray-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-xl sm:text-2xl`}>
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 truncate">
            {value}
          </p>
          <p 
            className="mt-1 text-xs sm:text-sm font-medium text-gray-600 truncate"
            title={label}
          >
            {label}
          </p>
          {description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
