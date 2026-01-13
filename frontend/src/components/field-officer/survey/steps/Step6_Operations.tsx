import { type SurveyData } from '../../../../types/survey';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step6_Operations({ data, updateData }: Props) {
    const toggleAgency = (key: keyof typeof data.involvedAgencies) => {
        if (key === 'other') return;
        updateData({
            involvedAgencies: {
                ...data.involvedAgencies,
                [key]: !data.involvedAgencies[key]
            }
        });
    };

    const handleOtherChange = (value: string) => {
        updateData({
            involvedAgencies: {
                ...data.involvedAgencies,
                other: value
            }
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">หน่วยงานที่เข้าดำเนินการ</h3>

            <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                        type="checkbox"
                        checked={data.involvedAgencies.localGovt}
                        onChange={() => toggleAgency('localGovt')}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">องค์กรปกครองส่วนท้องถิ่น (อปท.)</span>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                        type="checkbox"
                        checked={data.involvedAgencies.privateSector}
                        onChange={() => toggleAgency('privateSector')}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">ภาคเอกชน / มูลนิธิ</span>
                </label>

                <div className="p-4 border rounded-xl bg-gray-50">
                    <label className="block font-bold text-gray-700 mb-2">หน่วยงานอื่นๆ (ระบุ)</label>
                    <input
                        type="text"
                        value={data.involvedAgencies.other}
                        onChange={(e) => handleOtherChange(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="เช่น กรมชลประทาน, การไฟฟ้า..."
                    />
                </div>
            </div>
        </div>
    );
}
