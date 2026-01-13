import { useState } from 'react';
import { type SurveyData } from '../../../../types/survey';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step3_DamageAssessment({ data, updateData }: Props) {
    const [activeTab, setActiveTab] = useState<'building' | 'agriculture' | 'utility'>('building');

    const handleChange = (field: keyof SurveyData, value: string) => {
        const numValue = parseFloat(value) || 0;
        updateData({ [field]: numValue });
    };

    const handleTextChange = (field: keyof SurveyData, value: string) => {
        updateData({ [field]: value });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">การประเมินความเสียหาย</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('building')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'building' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        สิ่งปลูกสร้าง
                    </button>
                    <button
                        onClick={() => setActiveTab('agriculture')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'agriculture' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        เกษตรกรรม
                    </button>
                    <button
                        onClick={() => setActiveTab('utility')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'utility' ? 'bg-white shadow text-orange-600' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        สาธารณูปโภค
                    </button>
                </div>
            </div>

            {/* Building Damage */}
            {activeTab === 'building' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-xl space-y-3">
                            <h4 className="font-bold text-blue-800">ที่อยู่อาศัย</h4>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เสียหายบางส่วน (หลัง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.damagedHousesPartial || ''}
                                    onChange={(e) => handleChange('damagedHousesPartial', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เสียหายทั้งหลัง (หลัง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.damagedHousesFull || ''}
                                    onChange={(e) => handleChange('damagedHousesFull', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">อาคารสูง/คอนโด (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.damagedHighRise || ''}
                                    onChange={(e) => handleChange('damagedHighRise', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                            <h4 className="font-bold text-gray-800">สถานที่อื่นๆ</h4>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">โรงงาน/บริษัท (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.damagedFactories || ''}
                                    onChange={(e) => handleChange('damagedFactories', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">วัด/ศาสนสถาน (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.damagedTemples || ''}
                                    onChange={(e) => handleChange('damagedTemples', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">สถานที่ราชการ (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.damagedGovtPlaces || ''}
                                    onChange={(e) => handleChange('damagedGovtPlaces', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-bold text-gray-700">อื่นๆ ระบุ</label>
                        <textarea
                            value={data.damagedOther || ''}
                            onChange={(e) => handleTextChange('damagedOther', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows={2}
                        />
                    </div>

                    <div className="bg-blue-100 p-4 rounded-xl">
                        <label className="block font-bold text-blue-900 mb-1">มูลค่าความเสียหายเบื้องต้น (บาท)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.estimatedBuildingDamage || ''}
                            onChange={(e) => handleChange('estimatedBuildingDamage', e.target.value)}
                            className="w-full p-3 border border-blue-300 rounded-lg text-lg font-bold text-blue-900"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            )}

            {/* Agriculture Damage */}
            {activeTab === 'agriculture' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-xl space-y-3">
                            <h4 className="font-bold text-green-800">พืชสวน/ไร่นา</h4>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">พืชไร่ (ไร่)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.cropRai || ''}
                                    onChange={(e) => handleChange('cropRai', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">นาข้าว (ไร่)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.riceRai || ''}
                                    onChange={(e) => handleChange('riceRai', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">สวนผลไม้/ไม้ยืนต้น (ไร่)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.orchardRai || ''}
                                    onChange={(e) => handleChange('orchardRai', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-xl space-y-3">
                            <h4 className="font-bold text-yellow-800">ปศุสัตว์/ประมง</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">บ่อปลา (บ่อ/ไร่)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.fishPonds || ''}
                                        onChange={(e) => handleChange('fishPonds', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">บ่อกุ้ง (บ่อ/ไร่)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.shrimpPonds || ''}
                                        onChange={(e) => handleChange('shrimpPonds', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">โค/กระบือ (ตัว)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.livestockCows || ''}
                                        onChange={(e) => handleChange('livestockCows', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">สุกร (ตัว)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.livestockPigs || ''}
                                        onChange={(e) => handleChange('livestockPigs', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs text-gray-600 mb-1">สัตว์ปีก (ตัว)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={data.livestockPoultry || ''}
                                        onChange={(e) => handleChange('livestockPoultry', e.target.value)}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-bold text-gray-700">อื่นๆ ระบุ</label>
                        <textarea
                            value={data.livestockOther || ''}
                            onChange={(e) => handleTextChange('livestockOther', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows={2}
                        />
                    </div>

                    <div className="bg-green-100 p-4 rounded-xl">
                        <label className="block font-bold text-green-900 mb-1">มูลค่าความเสียหายด้านเกษตร (บาท)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.estimatedAgriDamage || ''}
                            onChange={(e) => handleChange('estimatedAgriDamage', e.target.value)}
                            className="w-full p-3 border border-green-300 rounded-lg text-lg font-bold text-green-900"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            )}

            {/* Utility Damage */}
            {activeTab === 'utility' && (
                <div className="space-y-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-4 rounded-xl space-y-3">
                            <h4 className="font-bold text-orange-800">เส้นทางคมนาคม</h4>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ถนน (สาย)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.roadsAgri || ''}
                                    onChange={(e) => handleChange('roadsAgri', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">สะพาน (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.bridges || ''}
                                    onChange={(e) => handleChange('bridges', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">คอสะพาน (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.bridgeNecks || ''}
                                    onChange={(e) => handleChange('bridgeNecks', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                            <h4 className="font-bold text-gray-800">แหล่งน้ำ/อื่นๆ</h4>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">ฝาย (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.weirs || ''}
                                    onChange={(e) => handleChange('weirs', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">เขื่อน/อ่างเก็บน้ำ (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.dams || ''}
                                    onChange={(e) => handleChange('dams', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">พนังกั้นน้ำ (แห่ง)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.dikes || ''}
                                    onChange={(e) => handleChange('dikes', e.target.value)}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-bold text-gray-700">อื่นๆ ระบุ</label>
                        <textarea
                            value={data.utilityOther || ''}
                            onChange={(e) => handleTextChange('utilityOther', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            rows={2}
                        />
                    </div>

                    <div className="bg-orange-100 p-4 rounded-xl">
                        <label className="block font-bold text-orange-900 mb-1">มูลค่าความเสียหายด้านสาธารณูปโภค (บาท)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.estimatedUtilityDamage || ''}
                            onChange={(e) => handleChange('estimatedUtilityDamage', e.target.value)}
                            className="w-full p-3 border border-orange-300 rounded-lg text-lg font-bold text-orange-900"
                            placeholder="0.00"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
