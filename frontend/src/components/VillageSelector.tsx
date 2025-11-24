import { useEffect, useState } from 'react';
import { villagesApi } from '../api/villages';
import type { Village } from '../types';

interface VillageSelectorProps {
  value?: string;
  onChange: (villageId: string) => void;
  className?: string;
}

export function VillageSelector({ value, onChange, className = '' }: VillageSelectorProps) {
  const [villages, setVillages] = useState<Village[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadVillages();
  }, []);

  const loadVillages = async () => {
    try {
      const data = await villagesApi.getAll();
      setVillages(data);
      console.log('✅ VillageSelector loaded villages:', data.length);
    } catch (err: any) {
      setError('ไม่สามารถโหลดข้อมูลหมู่บ้านได้');
      console.error('❌ VillageSelector error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <select disabled className={`${className} bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}>
        <option>กำลังโหลด...</option>
      </select>
    );
  }

  if (error) {
    return (
      <select disabled className={`${className} bg-red-50 border-red-400 text-red-800 w-full px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors`}>
        <option>{error}</option>
      </select>
    );
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`${className} w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
    >
      <option value="">-- เลือกหมู่บ้าน --</option>
      {villages.map((village) => (
        <option key={village.id} value={village.id}>
          หมู่ {village.villageNo}: {village.name}
          {village.alternateNames.length > 0 && ` (${village.alternateNames.join(', ')})`}
        </option>
      ))}
    </select>
  );
}
