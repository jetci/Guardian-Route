import React, { useState } from 'react';
import { DashboardFilters } from '../../types/executive';

interface ExecutiveFilterBarProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  onReset: () => void;
}

const DISASTER_TYPES = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'FLOOD', label: 'น้ำท่วม' },
  { value: 'LANDSLIDE', label: 'ดินถล่ม' },
  { value: 'FIRE', label: 'ไฟไหม้' },
  { value: 'STORM', label: 'พายุ' },
  { value: 'EARTHQUAKE', label: 'แผ่นดินไหว' },
  { value: 'OTHER', label: 'อื่นๆ' },
];

const PRIORITIES = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'CRITICAL', label: 'วิกฤต' },
  { value: 'HIGH', label: 'สูง' },
  { value: 'MEDIUM', label: 'ปานกลาง' },
  { value: 'LOW', label: 'ต่ำ' },
];

export const ExecutiveFilterBar: React.FC<ExecutiveFilterBarProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const [localFilters, setLocalFilters] = useState<DashboardFilters>(filters);

  const handleChange = (key: keyof DashboardFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            วันที่เริ่มต้น
          </label>
          <input
            type="date"
            value={localFilters.startDate || ''}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            วันที่สิ้นสุด
          </label>
          <input
            type="date"
            value={localFilters.endDate || ''}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Disaster Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ประเภทภัย
          </label>
          <select
            value={localFilters.disasterType || ''}
            onChange={(e) => handleChange('disasterType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {DISASTER_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ความสำคัญ
          </label>
          <select
            value={localFilters.priority || ''}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            จังหวัด
          </label>
          <input
            type="text"
            value={localFilters.region || ''}
            onChange={(e) => handleChange('region', e.target.value)}
            placeholder="ระบุชื่อจังหวัด"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          ล้างตัวกรอง
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          ค้นหา
        </button>
      </div>
    </div>
  );
};
