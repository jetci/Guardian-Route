/**
 * Incident Card Component
 * แสดงข้อมูลเหตุการณ์แบบ card
 */

import React from 'react';
import type { Incident, IncidentStatus, Priority } from '../../types';

interface IncidentCardProps {
  incident: Incident;
  onViewDetails: (incident: Incident) => void;
  onAssign: (incident: Incident) => void;
  onClose: (incident: Incident) => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onViewDetails,
  onAssign,
  onClose
}) => {
  const getPriorityConfig = (priority: Priority) => {
    const configs = {
      CRITICAL: { color: 'border-red-500', bg: 'bg-red-50', text: 'text-red-700', label: 'สูงมาก' },
      HIGH: { color: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', label: 'สูง' },
      MEDIUM: { color: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', label: 'ปานกลาง' },
      LOW: { color: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', label: 'ต่ำ' },
    };
    return configs[priority] || configs.MEDIUM;
  };

  const getStatusConfig = (status: IncidentStatus) => {
    const configs = {
      PENDING: { bg: 'bg-red-100', text: 'text-red-700', label: 'ใหม่' },
      IN_PROGRESS: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'กำลังดำเนินการ' },
      RESOLVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'แก้ไขแล้ว' },
      CLOSED: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'เสร็จสิ้น' },
    };
    return configs[status] || configs.PENDING;
  };

  const getDisasterTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FLOOD: 'น้ำท่วม',
      LANDSLIDE: 'ดินถล่ม',
      FIRE: 'ไฟไหม้',
      STORM: 'พายุ',
      EARTHQUAKE: 'แผ่นดินไหว',
      OTHER: 'อื่นๆ',
    };
    return labels[type] || type;
  };

  const priorityConfig = getPriorityConfig(incident.priority);
  const statusConfig = getStatusConfig(incident.status);

  return (
    <div 
      className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border-l-4 ${priorityConfig.color} hover:shadow-md transition-all`}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex-1 min-w-0">
          <h3 
            className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors cursor-pointer"
            onClick={() => onViewDetails(incident)}
            title={incident.title}
          >
            {incident.title}
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* Status Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
              {statusConfig.label}
            </span>
            {/* Priority Badge */}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${priorityConfig.bg} ${priorityConfig.text}`}>
              {priorityConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Village */}
        {incident.village && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg min-w-0">
            <span className="text-base flex-shrink-0">📍</span>
            <span className="truncate" title={incident.village.name}>
              {incident.village.name}
            </span>
          </div>
        )}

        {/* Disaster Type */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg min-w-0">
          <span className="text-base flex-shrink-0">⚠️</span>
          <span className="truncate">
            {getDisasterTypeLabel(incident.disasterType)}
          </span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg min-w-0">
          <span className="text-base flex-shrink-0">📅</span>
          <span className="truncate">
            {new Date(incident.createdAt).toLocaleDateString('th-TH')}
          </span>
        </div>
      </div>

      {/* Description */}
      {incident.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2" title={incident.description}>
          {incident.description}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails(incident)}
          className="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-colors whitespace-nowrap"
        >
          ดูรายละเอียด
        </button>
        
        {incident.status === 'PENDING' && (
          <button
            onClick={() => onAssign(incident)}
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors whitespace-nowrap"
          >
            มอบหมาย
          </button>
        )}
        
        {(incident.status === 'IN_PROGRESS' || incident.status === 'RESOLVED') && (
          <button
            onClick={() => onClose(incident)}
            className="flex-1 sm:flex-none px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors whitespace-nowrap"
          >
            ปิดงาน
          </button>
        )}
      </div>
    </div>
  );
};
