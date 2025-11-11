import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface OverlaySaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  polygon: any;
  result: {
    riskLevel: string;
    area_km2: number;
    incidentCount: number;
  };
}

const OverlaySaveModal: React.FC<OverlaySaveModalProps> = ({
  isOpen,
  onClose,
  polygon,
  result,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('กรุณากรอกชื่อชุดวิเคราะห์');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

      await axios.post(
        `${apiUrl}/overlay/save-result`,
        {
          name: name.trim(),
          description: description.trim(),
          polygon,
          result,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('บันทึกแล้ว');
      setName('');
      setDescription('');
      onClose();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.message || 'ไม่สามารถบันทึกได้');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            บันทึกผลการวิเคราะห์
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ชื่อชุดวิเคราะห์ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="เช่น ชุดวิเคราะห์ไฟป่า Q4"
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  หมายเหตุเพิ่มเติม
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="เช่น ข้อมูลภาคเหนือ ต.ค.–ธ.ค."
                  disabled={saving}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 space-y-1">
                  <div>ระดับความเสี่ยง: <span className="font-semibold">{result.riskLevel}</span></div>
                  <div>พื้นที่: <span className="font-semibold">{result.area_km2.toFixed(2)} km²</span></div>
                  <div>จำนวนเหตุการณ์: <span className="font-semibold">{result.incidentCount}</span></div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึก'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OverlaySaveModal;
