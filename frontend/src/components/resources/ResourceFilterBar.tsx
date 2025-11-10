import React, { useState } from 'react';
import { ResourceStatus, type ResourceFilters } from '../../types/resource';
import { useResourceTypes } from '../../hooks/resources/useResourceTypes';

interface ResourceFilterBarProps {
  onFiltersChange: (filters: ResourceFilters) => void;
  onReset: () => void;
}

export const ResourceFilterBar: React.FC<ResourceFilterBarProps> = ({
  onFiltersChange,
  onReset,
}) => {
  const { resourceTypes, isLoading: typesLoading } = useResourceTypes();
  const [localFilters, setLocalFilters] = useState<ResourceFilters>({});

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    setLocalFilters({});
    onReset();
  };

  const handleChange = (field: keyof ResourceFilters, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [field]: value || undefined,
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">ตัวกรอง</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ค้นหา
          </label>
          <input
            type="text"
            placeholder="ชื่อทรัพยากร หรือ หมายเลขทะเบียน"
            value={localFilters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Resource Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ประเภททรัพยากร
          </label>
          <select
            value={localFilters.resourceTypeId || ''}
            onChange={(e) => handleChange('resourceTypeId', e.target.value)}
            disabled={typesLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          >
            <option value="">ทั้งหมด</option>
            {resourceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            สถานะ
          </label>
          <select
            value={localFilters.status || ''}
            onChange={(e) => handleChange('status', e.target.value as ResourceStatus)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">ทั้งหมด</option>
            <option value={ResourceStatus.AVAILABLE}>พร้อมใช้งาน</option>
            <option value={ResourceStatus.IN_USE}>กำลังใช้งาน</option>
            <option value={ResourceStatus.MAINTENANCE}>ซ่อมบำรุง</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ล้างตัวกรอง
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ค้นหา
        </button>
      </div>
    </div>
  );
};
