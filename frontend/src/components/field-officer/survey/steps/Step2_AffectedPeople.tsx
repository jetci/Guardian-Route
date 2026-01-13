import { type SurveyData } from '../../../../types/survey';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step2_AffectedPeople({ data, updateData }: Props) {
    const handleChange = (field: keyof SurveyData, value: string) => {
        const numValue = parseInt(value) || 0;
        updateData({ [field]: numValue });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">ผู้ประสบภัย</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* General Affected */}
                <div className="bg-blue-50 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-blue-800">ผลกระทบโดยรวม</h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนครัวเรือนที่ได้รับผลกระทบ</label>
                        <input
                            type="number"
                            min="0"
                            value={data.affectedHouseholds || ''}
                            onChange={(e) => handleChange('affectedHouseholds', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนราษฎรที่ได้รับผลกระทบ (คน)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.affectedPeople || ''}
                            onChange={(e) => handleChange('affectedPeople', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Casualties */}
                <div className="bg-red-50 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-red-800">ผู้บาดเจ็บ / เสียชีวิต</h4>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ผู้บาดเจ็บ (คน)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.injuredCount || ''}
                            onChange={(e) => handleChange('injuredCount', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ผู้เสียชีวิต (คน)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.deadCount || ''}
                            onChange={(e) => handleChange('deadCount', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="0"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ผู้สูญหาย (คน)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.missingCount || ''}
                            onChange={(e) => handleChange('missingCount', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Evacuation */}
                <div className="bg-orange-50 p-4 rounded-xl space-y-4 md:col-span-2">
                    <h4 className="font-bold text-orange-800">การอพยพ</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนครัวเรือนที่อพยพ</label>
                            <input
                                type="number"
                                min="0"
                                value={data.evacuatedHouseholds || ''}
                                onChange={(e) => handleChange('evacuatedHouseholds', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนคนที่อพยพ (คน)</label>
                            <input
                                type="number"
                                min="0"
                                value={data.evacuatedPeople || ''}
                                onChange={(e) => handleChange('evacuatedPeople', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
