import { type SurveyData } from '../../../../types/survey';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step7_Certification({ data, updateData }: Props) {
    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">การรับรองรายงาน</h3>

            <div className="space-y-4">
                <p className="text-gray-600">โปรดระบุประเภทของรายงานเพื่อใช้ในการตัดสินใจของผู้บังคับบัญชา</p>

                <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${data.reportType === 'INFO' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="reportType"
                            value="INFO"
                            checked={data.reportType === 'INFO'}
                            onChange={() => updateData({ reportType: 'INFO' })}
                            className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                            <span className="font-bold text-gray-800 block">รายงานเพื่อทราบ</span>
                            <span className="text-sm text-gray-500">สถานการณ์ทั่วไป ไม่รุนแรง หรืออยู่ระหว่างการเฝ้าระวัง</span>
                        </div>
                    </div>
                </label>

                <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${data.reportType === 'DISASTER_ZONE' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}>
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="reportType"
                            value="DISASTER_ZONE"
                            checked={data.reportType === 'DISASTER_ZONE'}
                            onChange={() => updateData({ reportType: 'DISASTER_ZONE' })}
                            className="w-5 h-5 text-red-600 focus:ring-red-500"
                        />
                        <div>
                            <span className="font-bold text-red-800 block">รายงานเพื่อประกาศเขตภัยพิบัติ</span>
                            <span className="text-sm text-gray-500">สถานการณ์รุนแรง เข้าเกณฑ์การประกาศเขตภัยพิบัติ</span>
                        </div>
                    </div>
                </label>

                <label className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${data.reportType === 'ASSISTANCE' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}>
                    <div className="flex items-center gap-3">
                        <input
                            type="radio"
                            name="reportType"
                            value="ASSISTANCE"
                            checked={data.reportType === 'ASSISTANCE'}
                            onChange={() => updateData({ reportType: 'ASSISTANCE' })}
                            className="w-5 h-5 text-orange-600 focus:ring-orange-500"
                        />
                        <div>
                            <span className="font-bold text-orange-800 block">รายงานเพื่อขอความช่วยเหลือ</span>
                            <span className="text-sm text-gray-500">ต้องการความช่วยเหลือเร่งด่วน หรือเกินขีดความสามารถของท้องถิ่น</span>
                        </div>
                    </div>
                </label>
            </div>
        </div>
    );
}
