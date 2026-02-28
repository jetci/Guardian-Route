import { type SurveyData } from '../../../../types/survey';
import { HeartHandshake } from 'lucide-react';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step4_Relief({ data, updateData }: Props) {
    return (
        <div style={{ fontFamily: "'Sarabun', sans-serif" }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9'
            }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
                    color: '#1e40af', fontSize: '18px', fontWeight: '700'
                }}>
                    <div style={{
                        background: '#eff6ff', padding: '10px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <HeartHandshake size={24} color="#2563eb" />
                    </div>
                    การให้ความช่วยเหลือ
                </div>

                <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                    <label style={{
                        display: 'block', fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '12px',
                        lineHeight: 1.6
                    }}>
                        การปฏิบัติงานช่วยเหลือ <span style={{ fontWeight: '400', color: '#64748b', fontSize: '13px' }}>(ระบุรายละเอียดการแจกจ่ายถุงยังชีพ, การอพยพ, การรักษาพยาบาล ฯลฯ)</span>
                    </label>
                    <textarea
                        value={data.reliefOperations || ''}
                        onChange={(e) => updateData({ reliefOperations: e.target.value })}
                        style={{
                            width: '100%',
                            minHeight: '240px',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid #cbd5e1',
                            fontSize: '16px',
                            lineHeight: 1.6,
                            color: '#1e293b',
                            outline: 'none',
                            background: 'white',
                            resize: 'vertical',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'border-color 0.2s',
                            fontFamily: 'inherit'
                        }}
                        placeholder="ตัวอย่าง: ได้ดำเนินการแจกจ่ายถุงยังชีพจำนวน 50 ชุด, อพยพผู้ป่วยติดเตียง 2 ราย ไปยังศูนย์พักพิง..."
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                </div>
            </div>
        </div>
    );
}
