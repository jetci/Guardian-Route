import React, { useState } from 'react';
import { ResourceFilterBar } from '../../components/resources/ResourceFilterBar';
import { ResourceTable } from '../../components/resources/ResourceTable';
import { ResourceForm } from '../../components/resources/ResourceForm';
import { DeleteConfirmDialog } from '../../components/resources/DeleteConfirmDialog';
import { useResources } from '../../hooks/resources/useResources';
import { useResourceForm } from '../../hooks/resources/useResourceForm';
import type { Resource, ResourceFilters } from '../../types/resource';

const ResourceDashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<ResourceFilters>({});
  const { resources, isLoading, error, refetch } = useResources(filters);
  const { deleteResource, isSubmitting: isDeleting } = useResourceForm();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleFiltersChange = (newFilters: ResourceFilters) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleAddResource = () => {
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleDeleteResource = (resource: Resource) => {
    setResourceToDelete(resource);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;

    try {
      await deleteResource(resourceToDelete.id);
      setToast({ type: 'success', message: 'ลบทรัพยากรสำเร็จ' });
      setIsDeleteDialogOpen(false);
      setResourceToDelete(null);
      refetch();

      setTimeout(() => setToast(null), 3000);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleFormSuccess = () => {
    refetch();
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
                onClick={handleAddResource}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center"
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
        {/* Toast */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {toast.message}
          </div>
        )}

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
        <ResourceTable
          resources={resources}
          isLoading={isLoading}
          onEdit={handleEditResource}
          onDelete={handleDeleteResource}
        />
      </div>

      {/* Resource Form */}
      <ResourceForm
        resource={selectedResource}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        resourceName={resourceToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setResourceToDelete(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ResourceDashboardPage;
