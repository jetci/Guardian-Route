import { type SurveyData } from '../../../../types/survey';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step4_Relief({ data, updateData }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">การให้ความช่วยเหลือ</h3>

            <div className="bg-blue-50 p-4 rounded-xl space-y-4">
                <label className="block font-bold text-blue-800 mb-2">
                    การปฏิบัติงานช่วยเหลือ (ระบุรายละเอียดการแจกจ่ายถุงยังชีพ, การอพยพ, การรักษาพยาบาล ฯลฯ)
                </label>
                <textarea
                    value={data.reliefOperations || ''}
                    onChange={(e) => updateData({ reliefOperations: e.target.value })}
                    className="w-full p-4 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[200px]"
                    placeholder="ระบุรายละเอียดการช่วยเหลือ..."
                />
            </div>
        </div>
    );
}
