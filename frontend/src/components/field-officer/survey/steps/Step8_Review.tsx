import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type SurveyData } from '../../../../types/survey';
import { comprehensiveSurveyApi } from '../../../../api/comprehensiveSurvey';
import toast from 'react-hot-toast';
import {
    MapPin, Calendar, HeartPulse, Building2, Trees, Zap,
    FileText, Send, Users, Info, AlertTriangle, LifeBuoy,
    Truck, Activity, HardHat, Camera, Image as ImageIcon,
    CheckCircle2
} from 'lucide-react';

interface Props {
    data: SurveyData;
    updateData: (updates: Partial<SurveyData>) => void;
}

export default function Step8_Review({ data }: Props) {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!data.villageId || !data.disasterType) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await comprehensiveSurveyApi.submitSurvey(data);
            toast.success('✅ บันทึกข้อมูลการสำรวจสำเร็จ!');
            navigate('/survey-success', {
                state: { surveyData: response }
            });
        } catch (error: any) {
            console.error('❌ Error submitting survey:', error);
            const errorMessage = error.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const sectionStyle = {
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        border: '1px solid #f1f5f9',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        marginBottom: '24px'
    };

    const sectionHeaderStyle = (color: string) => ({
        display: 'flex', alignItems: 'center', gap: '10px',
        fontSize: '16px', fontWeight: '800', color: color,
        marginBottom: '20px', borderBottom: `1px solid ${color}15`, paddingBottom: '12px'
    });

    const DataRow = ({ label, value, unit = '', color = '#1e293b' }: { label: string, value: any, unit?: string, color?: string }) => {
        if (value === 0 || value === '0' || !value) return null;
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>{label}</span>
                <span style={{ fontWeight: '600', color: color }}>{value} {unit}</span>
            </div>
        );
    };

    const labelStyle = { color: '#64748b' };
    const valueStyle = { fontWeight: '600', color: '#1e293b' };

    const totalDamage = (data.estimatedBuildingDamage || 0) + (data.estimatedAgriDamage || 0) + (data.estimatedUtilityDamage || 0);

    return (
        <div style={{ fontFamily: "'Sarabun', sans-serif", paddingBottom: '60px', maxWidth: '800px', margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{
                    width: '80px', height: '80px', background: '#eff6ff', borderRadius: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
                    color: '#3b82f6', transform: 'rotate(-5deg)', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.15)'
                }}>
                    <FileText size={40} />
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
                    สรุปผลการสำรวจ
                </h3>
                <p style={{ color: '#64748b', fontSize: '16px' }}>
                    โปรดตรวจสอบข้อมูลทั้งหมดให้ครบถ้วนก่อนยืนยันการบันทึก
                </p>
            </div>

            {/* 1. Header Card - Big Status */}
            <div style={{
                background: data.reportType === 'DISASTER_ZONE' ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' :
                    data.reportType === 'ASSISTANCE' ? 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)' :
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '24px', padding: '32px', color: 'white', marginBottom: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                        <div style={{ fontSize: '14px', opacity: 0.8, marginBottom: '4px' }}>รายงานประเภท</div>
                        <div style={{ fontSize: '22px', fontWeight: '800' }}>
                            {data.reportType === 'DISASTER_ZONE' ? 'ประกาศเขตภัยพิบัติ' :
                                data.reportType === 'ASSISTANCE' ? 'รายงานขอความช่วยเหลือ' : 'รายงานสถานการณ์เพื่อทราบ'}
                        </div>
                    </div>
                    {data.reportType === 'DISASTER_ZONE' ? <AlertTriangle size={36} /> :
                        data.reportType === 'ASSISTANCE' ? <LifeBuoy size={36} /> : <Info size={36} />}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '16px' }}>
                    <div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>พื้นที่</div>
                        <div style={{ fontWeight: '700' }}>{data.villageName}</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>ประเภทภัย</div>
                        <div style={{ fontWeight: '700' }}>{data.disasterType}</div>
                    </div>
                </div>
            </div>

            {/* 2. Photo & GPS Summary */}
            <div style={sectionStyle}>
                <div style={sectionHeaderStyle('#64748b')}>
                    <Camera size={20} /> รูปภาพและพิกัด
                </div>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ flex: 1, background: '#f8fafc', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ImageIcon size={20} color="#3b82f6" />
                        <div>
                            <div style={{ fontSize: '18px', fontWeight: '700' }}>{data.photoUrls?.length || 0}</div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>รูปภาพที่แนบ</div>
                        </div>
                    </div>
                    <div style={{ flex: 2, background: '#f8fafc', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <MapPin size={20} color="#ef4444" />
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: '600' }}>
                                {data.gpsLocation ? `${data.gpsLocation.lat.toFixed(6)}, ${data.gpsLocation.lng.toFixed(6)}` : 'ไม่ระบุพิกัด'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>พิกัดบันทึกสำเร็จ</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Affected People Detail */}
            <div style={sectionStyle}>
                <div style={sectionHeaderStyle('#3b82f6')}>
                    <Users size={20} /> ข้อมูลผู้ประสบภัย
                </div>
                <DataRow label="จำนวนครัวเรือนที่ได้รับผลกระทบ" value={data.affectedHouseholds} unit="ครัวเรือน" />
                <DataRow label="จำนวนราษฎรที่ได้รับผลกระทบ" value={data.affectedPeople} unit="คน" />
                <DataRow label="จำนวนผู้บาดเจ็บ" value={data.injuredCount} unit="คน" color="#f59e0b" />
                <DataRow label="จำนวนผู้เสียชีวิต" value={data.deadCount} unit="คน" color="#ef4444" />
                <DataRow label="จำนวนผู้สูญหาย" value={data.missingCount} unit="คน" color="#ef4444" />
                <DataRow label="จำนวนครัวเรือนที่อพยพ" value={data.evacuatedHouseholds} unit="ครัวเรือน" color="#f97316" />
                <DataRow label="จำนวนราษฎรที่อพยพ" value={data.evacuatedPeople} unit="คน" color="#f97316" />
            </div>

            {/* 4. Buildings & Housing */}
            <div style={sectionStyle}>
                <div style={sectionHeaderStyle('#1e40af')}>
                    <Building2 size={20} /> ความเสียหายสิ่งปลูกสร้าง
                </div>
                <DataRow label="บ้านเรือนเสียหายบางส่วน" value={data.damagedHousesPartial} unit="หลัง" />
                <DataRow label="บ้านเรือนเสียหายทั้งหลัง" value={data.damagedHousesFull} unit="หลัง" />
                <DataRow label="อาคารสูง/คอนโด" value={data.damagedHighRise} unit="แห่ง" />
                <DataRow label="โรงงาน/บริษัท" value={data.damagedFactories} unit="แห่ง" />
                <DataRow label="วัด/ศาสนสถาน" value={data.damagedTemples} unit="แห่ง" />
                <DataRow label="สถานที่ราชการ" value={data.damagedGovtPlaces} unit="แห่ง" />
                {data.damagedOther && (
                    <div style={{ marginBottom: '16px' }}>
                        <span style={labelStyle}>ข้อมูลความเสียหายอื่นๆ:</span>
                        <p style={{ ...valueStyle, marginTop: '4px', background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
                            {data.damagedOther}
                        </p>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
                    <span style={{ fontWeight: '700' }}>มูลค่าความเสียหาย (สิ่งปลูกสร้าง)</span>
                    <span style={{ fontWeight: '800', color: '#1e40af' }}>{(data.estimatedBuildingDamage || 0).toLocaleString()} บาท</span>
                </div>
            </div>

            {/* 5. Agriculture & Livestock */}
            <div style={sectionStyle}>
                <div style={sectionHeaderStyle('#16a34a')}>
                    <Trees size={20} /> ความเสียหายเกษตรกรรม
                </div>
                <DataRow label="พืชไร่" value={data.cropRai} unit="ไร่" />
                <DataRow label="นาข้าว" value={data.riceRai} unit="ไร่" />
                <DataRow label="สวนผลไม้/ไม้ยืนต้น" value={data.orchardRai} unit="ไร่" />
                <DataRow label="บ่อปลา" value={data.fishPonds} unit="บ่อ" />
                <DataRow label="บ่อกุ้ง" value={data.shrimpPonds} unit="บ่อ" />
                <DataRow label="โค/กระบือ" value={data.livestockCows} unit="ตัว" />
                <DataRow label="สุกร" value={data.livestockPigs} unit="ตัว" />
                <DataRow label="สัตว์ปีก" value={data.livestockPoultry} unit="ตัว" />
                {data.livestockOther && (
                    <div style={{ marginBottom: '16px' }}>
                        <span style={labelStyle}>ปศุสัตว์อื่นๆ:</span>
                        <p style={{ ...valueStyle, marginTop: '4px', background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
                            {data.livestockOther}
                        </p>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
                    <span style={{ fontWeight: '700' }}>มูลค่าความเสียหาย (เกษตรกรรม)</span>
                    <span style={{ fontWeight: '800', color: '#16a34a' }}>{(data.estimatedAgriDamage || 0).toLocaleString()} บาท</span>
                </div>
            </div>

            {/* 6. Public Utilities */}
            <div style={sectionStyle}>
                <div style={sectionHeaderStyle('#ea580c')}>
                    <Zap size={20} /> ความเสียหายสาสาธารณูปโภค
                </div>
                <DataRow label="ถนน" value={data.roadsAgri} unit="สาย" />
                <DataRow label="สะพาน" value={data.bridges} unit="แห่ง" />
                <DataRow label="คอสะพาน" value={data.bridgeNecks} unit="แห่ง" />
                <DataRow label="ฝาย" value={data.weirs} unit="แห่ง" />
                <DataRow label="เขื่อน/อ่างเก็บน้ำ" value={data.dams} unit="แห่ง" />
                <DataRow label="พนังกั้นน้ำ" value={data.dikes} unit="แห่ง" />
                <DataRow label="ดินสไลด์" value={data.landslides} unit="จุด" />
                {data.utilityOther && (
                    <div style={{ marginBottom: '16px' }}>
                        <span style={labelStyle}>สาธารณูปโภคอื่นๆ:</span>
                        <p style={{ ...valueStyle, marginTop: '4px', background: '#f8fafc', padding: '10px', borderRadius: '8px', fontSize: '13px' }}>
                            {data.utilityOther}
                        </p>
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e2e8f0' }}>
                    <span style={{ fontWeight: '700' }}>มูลค่าความเสียหาย (สาธารณูปโภค)</span>
                    <span style={{ fontWeight: '800', color: '#ea580c' }}>{(data.estimatedUtilityDamage || 0).toLocaleString()} บาท</span>
                </div>
            </div>

            {/* 7. Relief & Resources */}
            <div style={sectionStyle}>
                <div style={sectionHeaderStyle('#0f172a')}>
                    <Activity size={20} /> การช่วยเหลือและทรัพยากร
                </div>
                {data.reliefOperations && (
                    <div style={{ marginBottom: '20px' }}>
                        <span style={{ ...labelStyle, display: 'block', marginBottom: '8px' }}>การปฏิบัติงานช่วยเหลือ:</span>
                        <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '16px', fontSize: '14px', color: '#1e3a8a', lineHeight: 1.6, border: '1px solid #dbeafe' }}>
                            {data.reliefOperations}
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                    <DataRow label="รถบรรทุกน้ำ" value={data.waterTrucks} unit="คัน" />
                    <DataRow label="รถกู้ภัย" value={data.rescueTrucks} unit="คัน" />
                    <DataRow label="เรือท้องแบน" value={data.boats} unit="ลำ" />
                    <DataRow label="รถยนต์" value={data.cars} unit="คัน" />
                    <DataRow label="เครื่องสูบน้ำ" value={data.pumps} unit="เครื่อง" />
                    <DataRow label="รถแบคโฮ" value={data.backhoes} unit="คัน" />
                    <DataRow label="รถ 6 ล้อ" value={data.trucks6Wheel} unit="คัน" />
                    <DataRow label="อาสาสมัคร" value={data.volunteersCount} unit="คน" />
                </div>

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '700', display: 'block', marginBottom: '8px' }}>หน่วยงานที่เกี่ยวข้อง</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {data.involvedAgencies.localGovt && <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>อปท.</span>}
                        {data.involvedAgencies.privateSector && <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>เอกชน/มูลนิธิ</span>}
                        {data.involvedAgencies.other && <span style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{data.involvedAgencies.other}</span>}
                        {!data.involvedAgencies.localGovt && !data.involvedAgencies.privateSector && !data.involvedAgencies.other && <span style={{ color: '#94a3b8', fontSize: '12px' }}>ไม่ระบุ</span>}
                    </div>
                </div>
            </div>

            {/* Final Total Area */}
            <div style={{
                background: '#0f172a', borderRadius: '24px', padding: '32px', color: 'white', marginBottom: '40px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)'
            }}>
                <div>
                    <div style={{ fontSize: '14px', opacity: 0.7, marginBottom: '4px' }}>ประมาณการมูลค่าความเสียหายรวมทั้งสิ้น</div>
                    <div style={{ fontSize: '32px', fontWeight: '900', color: '#fbbf24' }}>
                        {totalDamage.toLocaleString()} <span style={{ fontSize: '18px', fontWeight: '500', color: 'white', opacity: 0.8 }}>บาท</span>
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '12px', borderRadius: '16px' }}>
                    <CheckCircle2 size={40} color="#34d399" />
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                    width: '100%',
                    padding: '24px',
                    borderRadius: '20px',
                    background: isSubmitting ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    fontSize: '20px',
                    fontWeight: '800',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 12px 24px rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.3s',
                    position: 'relative' as const,
                    overflow: 'hidden'
                }}
            >
                {isSubmitting ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <svg style={{ animation: 'spin 1s linear infinite', width: '24px', height: '24px' }} viewBox="0 0 24 24">
                            <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        กำลังส่งรายงาน...
                    </div>
                ) : (
                    <>
                        <Send size={24} /> ยืนยันข้อมูลและส่งรายงาน
                    </>
                )}
            </button>
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '13px', marginTop: '16px' }}>
                เมื่อกดส่งแล้ว ข้อมูลจะถูกบันทึกเข้าระบบและไม่สามารถแก้ไขได้ในขั้นตอนนี้
            </p>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
