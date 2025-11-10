import React from 'react';
import { Resource, ResourceStatus } from '../../types/resource';

interface ResourceTableProps {
  resources: Resource[];
  isLoading: boolean;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}

const STATUS_CONFIG = {
  [ResourceStatus.AVAILABLE]: {
    label: 'พร้อมใช้งาน',
    className: 'bg-green-100 text-green-800 border-green-300',
  },
  [ResourceStatus.IN_USE]: {
    label: 'กำลังใช้งาน',
    className: 'bg-orange-100 text-orange-800 border-orange-300',
  },
  [ResourceStatus.MAINTENANCE]: {
    label: 'ซ่อมบำรุง',
    className: 'bg-red-100 text-red-800 border-red-300',
  },
};

export const ResourceTable: React.FC<ResourceTableProps> = ({
  resources,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          ไม่พบทรัพยากร
        </h3>
        <p className="text-gray-500">
          ไม่มีทรัพยากรที่ตรงกับเงื่อนไขการค้นหา
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                รหัส
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ชื่อทรัพยากร
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ประเภท
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานะ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                สถานที่
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                หมายเลขทะเบียน
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                การจัดการ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map((resource) => {
              const statusConfig = STATUS_CONFIG[resource.status];
              return (
                <tr
                  key={resource.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {resource.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {resource.resourceType.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full border ${statusConfig.className}`}
                    >
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {resource.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.registrationNumber || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onEdit(resource)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => onDelete(resource)}
                      className="text-red-600 hover:text-red-900"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
