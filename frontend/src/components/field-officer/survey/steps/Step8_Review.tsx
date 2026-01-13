import { type SurveyData } from '../../../../types/survey';

interface Props {
    data: SurveyData;
}

export default function Step8_Review({ data }: Props) {
    return (
        <div className="space-y-8">
            <div className="text-center border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800">ตรวจสอบข้อมูล</h3>
                <p className="text-gray-500">กรุณาตรวจสอบความถูกต้องก่อนยืนยันการส่งรายงาน</p>
            </div>

            {/* 1. Incident Info */}
            <section className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 border-b pb-1">1. ข้อมูลเหตุการณ์</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500">หมู่บ้าน:</span> <span className="font-medium">{data.villageName}</span></div>
                    <div><span className="text-gray-500">ประเภทภัย:</span> <span className="font-medium">{data.disasterType}</span></div>
                    <div><span className="text-gray-500">วันที่สำรวจ:</span> <span className="font-medium">{new Date(data.surveyDate).toLocaleDateString('th-TH')}</span></div>
                    <div><span className="text-gray-500">พิกัด GPS:</span> <span className="font-medium">{data.gpsLocation ? `${data.gpsLocation.lat.toFixed(6)}, ${data.gpsLocation.lng.toFixed(6)}` : '-'}</span></div>
                </div>
            </section>

            {/* 2. Affected People */}
            <section className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-200 pb-1">2. ผู้ประสบภัย</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-gray-500 block">ครัวเรือนที่ได้รับผลกระทบ</span> <span className="font-bold text-lg">{data.affectedHouseholds}</span></div>
                    <div><span className="text-gray-500 block">ราษฎรที่ได้รับผลกระทบ</span> <span className="font-bold text-lg">{data.affectedPeople}</span></div>
                    <div><span className="text-gray-500 block">ผู้เสียชีวิต</span> <span className="font-bold text-lg text-red-600">{data.deadCount}</span></div>
                    <div><span className="text-gray-500 block">ผู้สูญหาย</span> <span className="font-bold text-lg text-red-600">{data.missingCount}</span></div>
                </div>
            </section>

            {/* 3. Damage Assessment */}
            <section className="bg-red-50 p-4 rounded-xl border border-red-100">
                <h4 className="font-bold text-red-800 mb-3 border-b border-red-200 pb-1">3. ความเสียหาย</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>บ้านเสียหายบางส่วน:</span> <span className="font-medium">{data.damagedHousesPartial} หลัง</span></div>
                    <div className="flex justify-between"><span>บ้านเสียหายทั้งหลัง:</span> <span className="font-medium">{data.damagedHousesFull} หลัง</span></div>
                    <div className="flex justify-between"><span>พื้นที่เกษตรเสียหาย:</span> <span className="font-medium">{data.cropRai + data.riceRai + data.orchardRai} ไร่</span></div>
                    <div className="flex justify-between"><span>ถนนเสียหาย:</span> <span className="font-medium">{data.roadsAgri} สาย</span></div>
                    <div className="pt-2 border-t border-red-200 flex justify-between font-bold text-red-900">
                        <span>มูลค่าความเสียหายรวม (ประมาณการ):</span>
                        <span>{(data.estimatedBuildingDamage + data.estimatedAgriDamage + data.estimatedUtilityDamage).toLocaleString()} บาท</span>
                    </div>
                </div>
            </section>

            {/* 4. Relief & Resources */}
            <section className="bg-green-50 p-4 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-800 mb-3 border-b border-green-200 pb-1">4. การช่วยเหลือ & ทรัพยากร</h4>
                <div className="text-sm space-y-2">
                    <p><span className="font-bold">การปฏิบัติงาน:</span> {data.reliefOperations || '-'}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div><span className="text-gray-500">รถบรรทุกน้ำ:</span> {data.waterTrucks}</div>
                        <div><span className="text-gray-500">เรือท้องแบน:</span> {data.boats}</div>
                        <div><span className="text-gray-500">อาสาสมัคร:</span> {data.volunteersCount} คน</div>
                    </div>
                </div>
            </section>

            {/* 5. Certification */}
            <section className="bg-orange-50 p-4 rounded-xl border border-orange-100 text-center">
                <h4 className="font-bold text-orange-800 mb-2">ประเภทรายงาน</h4>
                <span className={`inline-block px-4 py-2 rounded-full font-bold text-white ${data.reportType === 'DISASTER_ZONE' ? 'bg-red-500' :
                    data.reportType === 'ASSISTANCE' ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                    {data.reportType === 'DISASTER_ZONE' ? 'ประกาศเขตภัยพิบัติ' :
                        data.reportType === 'ASSISTANCE' ? 'ขอความช่วยเหลือ' : 'รายงานเพื่อทราบ'}
                </span>
            </section>
        </div>
    );
}
