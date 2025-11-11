import React from 'react';
import type { Resource } from '../../types/resource';


interface ResourceSummaryCardsProps {
  resources: Resource[];
  loading?: boolean;
}

export const ResourceSummaryCards: React.FC<ResourceSummaryCardsProps> = ({
  resources,
  loading = false,
}) => {
  const getCountByStatus = (status: 'IN_USE' | 'AVAILABLE' | 'MAINTENANCE'): number => {
    return resources.filter((r) => r.status === status).length;
  };

  const getPercentage = (count: number): string => {
    if (resources.length === 0) return '0';
    return ((count / resources.length) * 100).toFixed(1);
  };

  const availableCount = getCountByStatus('AVAILABLE');
  const inUseCount = getCountByStatus('IN_USE');
  const maintenanceCount = getCountByStatus('MAINTENANCE');

  const cards = [
    {
      title: 'พร้อมใช้งาน',
      count: availableCount,
      percentage: getPercentage(availableCount),
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: '✅',
    },
    {
      title: 'กำลังใช้งาน',
      count: inUseCount,
      percentage: getPercentage(inUseCount),
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-orange-200',
      icon: '🔄',
    },
    {
      title: 'ซ่อมบำรุง',
      count: maintenanceCount,
      percentage: getPercentage(maintenanceCount),
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      icon: '🛠️',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.bgColor} rounded-lg shadow p-6 border ${card.borderColor}`}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${card.textColor}`}>
              {card.title}
            </h3>
            <span className="text-2xl">{card.icon}</span>
          </div>
          <p className={`text-3xl font-bold ${card.textColor} mb-1`}>
            {card.count}
          </p>
          <p className={`text-sm ${card.textColor}`}>
            {card.percentage}% ของทั้งหมด
          </p>
        </div>
      ))}
    </div>
  );
};
