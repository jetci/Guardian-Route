/**
 * Performer Card Component
 * แสดงรายการ top performers พร้อม ranking
 */

import React from 'react';

interface Performer {
  name: string;
  reports: number;
  rating: number;
}

interface PerformerCardProps {
  performers: Performer[];
  onViewAll?: () => void;
}

export const PerformerCard: React.FC<PerformerCardProps> = ({
  performers,
  onViewAll
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          🏆 Top Performers
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      {/* Performers List */}
      <div className="space-y-3">
        {performers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">ไม่มีข้อมูล</p>
          </div>
        ) : (
          performers.map((performer, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              {/* Rank Badge */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${
                index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                #{index + 1}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p 
                  className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors"
                  title={performer.name}
                >
                  {performer.name}
                </p>
                <p className="text-xs text-gray-500">
                  {performer.reports} reports
                </p>
              </div>

              {/* Rating */}
              <div className="flex-shrink-0">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-yellow-600">
                  <span>⭐</span>
                  <span>{performer.rating.toFixed(1)}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
