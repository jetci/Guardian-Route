import React, { useState, useEffect } from 'react';
import { Resource, ResourceStatus } from '../../types/resource';
import { useResourceTypes } from '../../hooks/resources/useResourceTypes';
import { useResourceForm } from '../../hooks/resources/useResourceForm';

interface ResourceFormProps {
  resource?: Resource | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ResourceForm: React.FC<ResourceFormProps> = ({
  resource,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { resourceTypes, isLoading: typesLoading } = useResourceTypes();
  const { createResource, updateResource, isSubmitting } = useResourceForm();

  const [formData, setFormData] = useState({
    name: '',
    resourceTypeId: '',
    status: ResourceStatus.AVAILABLE,
    location: '',
    registrationNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name,
        resourceTypeId: resource.resourceTypeId,
        status: resource.status,
        location: resource.location,
        registrationNumber: resource.registrationNumber || '',
      });
    } else {
      setFormData({
        name: '',
        resourceTypeId: '',
        status: ResourceStatus.AVAILABLE,
        location: '',
        registrationNumber: '',
      });
    }
    setErrors({});
  }, [resource, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'ชื่อทรัพยากรต้องมีอย่างน้อย 3 ตัวอักษร';
    }

    if (!formData.resourceTypeId) {
      newErrors.resourceTypeId = 'กรุณาเลือกประเภททรัพยากร';
    }

    if (!formData.location) {
      newErrors.location = 'กรุณาระบุสถานที่จัดเก็บ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (resource) {
        await updateResource(resource.id, formData);
        setToast({ type: 'success', message: 'แก้ไขทรัพยากรสำเร็จ' });
      } else {
        await createResource(formData);
        setToast({ type: 'success', message: 'สร้างทรัพยากรสำเร็จ' });
      }

      setTimeout(() => {
        onSuccess();
        onClose();
        setToast(null);
      }, 1500);
    } catch (error: any) {
      setToast({ type: 'error', message: error.message });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-1/2 lg:w-1/3 bg-white shadow-xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {resource ? 'แก้ไขทรัพยากร' : 'เพิ่มทรัพยากรใหม่'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mx-6 mt-4 p-4 rounded-lg ${
              toast.type === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อทรัพยากร <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="เช่น รถกระบะ Toyota Hilux"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Resource Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ประเภททรัพยากร <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.resourceTypeId}
              onChange={(e) => handleChange('resourceTypeId', e.target.value)}
              disabled={typesLoading}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.resourceTypeId ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">เลือกประเภท</option>
              {resourceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.resourceTypeId && (
              <p className="text-red-500 text-sm mt-1">{errors.resourceTypeId}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานะ <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={ResourceStatus.AVAILABLE}>พร้อมใช้งาน</option>
              <option value={ResourceStatus.IN_USE}>กำลังใช้งาน</option>
              <option value={ResourceStatus.MAINTENANCE}>ซ่อมบำรุง</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              สถานที่จัดเก็บ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="เช่น โรงเก็บอุปกรณ์ อาคาร A"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมายเลขทะเบียน
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={(e) => handleChange('registrationNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="เช่น กข 1234 กรุงเทพ"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'กำลังบันทึก...' : resource ? 'บันทึกการแก้ไข' : 'สร้างทรัพยากร'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
