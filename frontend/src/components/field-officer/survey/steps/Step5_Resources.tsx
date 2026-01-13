import { type SurveyData } from '../../../../types/survey';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step5_Resources({ data, updateData }: Props) {
    const handleChange = (field: keyof SurveyData, value: string) => {
        const numValue = parseInt(value) || 0;
        updateData({ [field]: numValue });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">ทรัพยากรที่ใช้ปฏิบัติงาน</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vehicles */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-gray-800">ยานพาหนะ/เครื่องจักรกล</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">รถบรรทุกน้ำ (คัน)</label>
                            <input type="number" min="0" value={data.waterTrucks || ''} onChange={(e) => handleChange('waterTrucks', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">รถกู้ภัย (คัน)</label>
                            <input type="number" min="0" value={data.rescueTrucks || ''} onChange={(e) => handleChange('rescueTrucks', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">เรือท้องแบน (ลำ)</label>
                            <input type="number" min="0" value={data.boats || ''} onChange={(e) => handleChange('boats', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">รถยนต์ (คัน)</label>
                            <input type="number" min="0" value={data.cars || ''} onChange={(e) => handleChange('cars', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">เครื่องสูบน้ำ (เครื่อง)</label>
                            <input type="number" min="0" value={data.pumps || ''} onChange={(e) => handleChange('pumps', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">รถแบคโฮ (คัน)</label>
                            <input type="number" min="0" value={data.backhoes || ''} onChange={(e) => handleChange('backhoes', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">รถบรรทุก 6 ล้อ (คัน)</label>
                            <input type="number" min="0" value={data.trucks6Wheel || ''} onChange={(e) => handleChange('trucks6Wheel', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">รถตัก (คัน)</label>
                            <input type="number" min="0" value={data.loaders || ''} onChange={(e) => handleChange('loaders', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">เลื่อยยนต์ (เครื่อง)</label>
                            <input type="number" min="0" value={data.chainsaws || ''} onChange={(e) => handleChange('chainsaws', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-600 mb-1">รถเครน (คัน)</label>
                            <input type="number" min="0" value={data.cranes || ''} onChange={(e) => handleChange('cranes', e.target.value)} className="w-full p-2 border rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Manpower */}
                <div className="bg-blue-50 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-blue-800">กำลังพล</h4>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">หน่วยงานราชการ (แห่ง)</label>
                        <input type="number" min="0" value={data.govtAgenciesCount || ''} onChange={(e) => handleChange('govtAgenciesCount', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">ภาคเอกชน/มูลนิธิ (แห่ง)</label>
                        <input type="number" min="0" value={data.privateGroupsCount || ''} onChange={(e) => handleChange('privateGroupsCount', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600 mb-1">อาสาสมัคร/ประชาชน (คน)</label>
                        <input type="number" min="0" value={data.volunteersCount || ''} onChange={(e) => handleChange('volunteersCount', e.target.value)} className="w-full p-2 border rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
