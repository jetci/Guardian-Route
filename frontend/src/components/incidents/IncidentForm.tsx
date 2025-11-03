import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { incidentsApi } from '../../api/incidents';
import toast from 'react-hot-toast';
import type { DisasterType, Priority } from '../../types';

interface IncidentFormData {
  title: string;
  description?: string;
  disasterType: DisasterType;
  priority: Priority;
  villageId?: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface IncidentFormProps {
  onSuccess?: () => void;
}

export const IncidentForm = ({ onSuccess }: IncidentFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<IncidentFormData>({
    defaultValues: {
      priority: 'MEDIUM' as Priority,
    }
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: IncidentFormData) => {
    setLoading(true);
    try {
      await incidentsApi.create({
        title: data.title,
        description: data.description,
        disasterType: data.disasterType,
        priority: data.priority,
        villageId: data.villageId,
        location: {
          type: 'Point',
          coordinates: [data.longitude, data.latitude]
        },
        address: data.address,
      });
      
      toast.success('สร้างเหตุการณ์สำเร็จ!');
      onSuccess?.();
    } catch (error: any) {
      console.error('Error creating incident:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ชื่อเหตุการณ์ <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title', { required: 'กรุณากรอกชื่อเหตุการณ์' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="เช่น น้ำท่วมบ้านหนองตุ้ม"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          รายละเอียด
        </label>
        <textarea
          {...register('description')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="รายละเอียดเพิ่มเติม..."
        />
      </div>

      {/* Disaster Type & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ประเภทภัย <span className="text-red-500">*</span>
          </label>
          <select
            {...register('disasterType', { required: 'กรุณาเลือกประเภทภัย' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">เลือกประเภทภัย</option>
            <option value="FLOOD">น้ำท่วม</option>
            <option value="LANDSLIDE">ดินถล่ม</option>
            <option value="FIRE">ไฟไหม้</option>
            <option value="STORM">พายุ</option>
            <option value="EARTHQUAKE">แผ่นดินไหว</option>
            <option value="OTHER">อื่นๆ</option>
          </select>
          {errors.disasterType && (
            <p className="text-red-500 text-sm mt-1">{errors.disasterType.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ระดับความสำคัญ <span className="text-red-500">*</span>
          </label>
          <select
            {...register('priority', { required: 'กรุณาเลือกระดับความสำคัญ' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="LOW">ต่ำ</option>
            <option value="MEDIUM">ปานกลาง</option>
            <option value="HIGH">สูง</option>
            <option value="CRITICAL">วิกฤต</option>
          </select>
          {errors.priority && (
            <p className="text-red-500 text-sm mt-1">{errors.priority.message}</p>
          )}
        </div>
      </div>

      {/* Village */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          หมู่บ้าน
        </label>
        <select
          {...register('villageId')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">เลือกหมู่บ้าน (ถ้ามี)</option>
          {/* VillageSelector will be integrated later */}
        </select>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ละติจูด <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.000001"
            {...register('latitude', { 
              required: 'กรุณากรอกละติจูด',
              min: { value: -90, message: 'ละติจูดต้องอยู่ระหว่าง -90 ถึง 90' },
              max: { value: 90, message: 'ละติจูดต้องอยู่ระหว่าง -90 ถึง 90' },
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="19.9263"
          />
          {errors.latitude && (
            <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ลองจิจูด <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.000001"
            {...register('longitude', { 
              required: 'กรุณากรอกลองจิจูด',
              min: { value: -180, message: 'ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180' },
              max: { value: 180, message: 'ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180' },
              valueAsNumber: true,
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="99.8832"
          />
          {errors.longitude && (
            <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          ที่อยู่
        </label>
        <input
          {...register('address')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="เช่น 123 หมู่ 1 บ้านหนองตุ้ม"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'กำลังสร้าง...' : 'สร้างเหตุการณ์'}
      </button>
    </form>
  );
};
