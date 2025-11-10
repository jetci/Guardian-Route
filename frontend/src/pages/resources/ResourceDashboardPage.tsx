import React, { useState } from 'react';
import { ResourceFilterBar } from '../../components/resources/ResourceFilterBar';
import { ResourceTable } from '../../components/resources/ResourceTable';
import { useResources } from '../../hooks/resources/useResources';
import type { ResourceFilters } from '../../types/resource';

const ResourceDashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<ResourceFilters>({});
  const { resources, isLoading, error, refetch } = useResources(filters);

  const handleFiltersChange = (newFilters: ResourceFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                จัดการทรัพยากร
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ระบบติดตามและจัดการทรัพยากรในภาวะฉุกเฉิน
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={refetch}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <span className="mr-2">🔄</span>
                {isLoading ? 'กำลังโหลด...' : 'รีเฟรช'}
              </button>
              <button
                disabled
                className="bg-green-600 text-white px-4 py-2 rounded-lg opacity-50 cursor-not-allowed flex items-center"
              >
                <span className="mr-2">➕</span>
                เพิ่มทรัพยากร
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-red-600 text-xl mr-3">⚠️</span>
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  เกิดข้อผิดพลาด
                </h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <ResourceFilterBar
          onFiltersChange={handleFiltersChange}
          onReset={handleResetFilters}
        />

        {/* Summary Stats */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                พบทรัพยากรทั้งหมด{' '}
                <span className="font-semibold text-gray-900">
                  {resources.length}
                </span>{' '}
                รายการ
              </div>
            </div>
          </div>
        )}

        {/* Resource Table */}
        <ResourceTable resources={resources} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ResourceDashboardPage;
