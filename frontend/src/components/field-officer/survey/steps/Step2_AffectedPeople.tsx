import { type SurveyData } from '../../../../types/survey';
import { Users, Home, HeartPulse, Activity, AlertCircle } from 'lucide-react';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step2_AffectedPeople({ data, updateData }: Props) {
    const handleChange = (field: keyof SurveyData, value: string) => {
        const numValue = parseInt(value) || 0;
        updateData({ [field]: numValue });
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9'
    };

    const headerStyle = {
        fontSize: '16px',
        fontWeight: '700',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '14px',
        color: '#64748b',
        marginBottom: '8px',
        fontWeight: '500'
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 16px',
        borderRadius: '12px',
        border: '1px solid #cbd5e1',
        fontSize: '18px',
        fontWeight: '600',
        color: '#1e293b',
        outline: 'none',
        background: '#f8fafc',
        transition: 'all 0.2s'
    };

    // Helper to add focus ring via inline style (simulated with onFocus/onBlur if needed, or simple CSS class in parent if strictly inline is hard for pseudo-classes. 
    // But since we want pure inline, we can omit complex focus rings or use simple border color change.)
    // For simplicity and "ActionOS" feel, let's keep it simple.

    return (
        <div style={{ fontFamily: "'Sarabun', sans-serif", paddingBottom: '20px' }}>

            {/* General Affected */}
            <div style={cardStyle}>
                <div style={{ ...headerStyle, color: '#0f172a' }}>
                    <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '10px' }}>
                        <Home size={20} color="#3b82f6" />
                    </div>
                    ผลกระทบโดยรวม
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>จำนวนครัวเรือนที่ได้รับผลกระทบ</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={data.affectedHouseholds || ''}
                                onChange={(e) => handleChange('affectedHouseholds', e.target.value)}
                                style={inputStyle}
                                placeholder="0"
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}>ครัวเรือน</span>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>จำนวนราษฎรที่ได้รับผลกระทบ</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={data.affectedPeople || ''}
                                onChange={(e) => handleChange('affectedPeople', e.target.value)}
                                style={inputStyle}
                                placeholder="0"
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '14px' }}>คน</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Casualties */}
            <div style={cardStyle}>
                <div style={{ ...headerStyle, color: '#b91c1c' }}>
                    <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '10px' }}>
                        <HeartPulse size={20} color="#ef4444" />
                    </div>
                    ผู้บาดเจ็บ / เสียชีวิต
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>ผู้บาดเจ็บ</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={data.injuredCount || ''}
                                onChange={(e) => handleChange('injuredCount', e.target.value)}
                                style={{ ...inputStyle, background: '#fff1f2', color: '#be123c' }}
                                placeholder="0"
                                onFocus={(e) => e.target.style.borderColor = '#f43f5e'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#fda4af', fontSize: '14px' }}>คน</span>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <label style={labelStyle}>ผู้เสียชีวิต</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={data.deadCount || ''}
                                onChange={(e) => handleChange('deadCount', e.target.value)}
                                style={{ ...inputStyle, background: '#fff1f2', color: '#be123c' }}
                                placeholder="0"
                                onFocus={(e) => e.target.style.borderColor = '#f43f5e'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>ผู้สูญหาย</label>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={data.missingCount || ''}
                                onChange={(e) => handleChange('missingCount', e.target.value)}
                                style={{ ...inputStyle, background: '#fff1f2', color: '#be123c' }}
                                placeholder="0"
                                onFocus={(e) => e.target.style.borderColor = '#f43f5e'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Evacuation */}
            <div style={cardStyle}>
                <div style={{ ...headerStyle, color: '#c2410c' }}>
                    <div style={{ background: '#fff7ed', padding: '8px', borderRadius: '10px' }}>
                        <Activity size={20} color="#f97316" />
                    </div>
                    การอพยพ
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                    <div>
                        <label style={labelStyle}>จำนวนครัวเรือนที่อพยพ</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={data.evacuatedHouseholds || ''}
                                onChange={(e) => handleChange('evacuatedHouseholds', e.target.value)}
                                style={{ ...inputStyle, background: '#fff7ed', color: '#c2410c' }}
                                placeholder="0"
                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#fdba74', fontSize: '14px' }}>ครัวเรือน</span>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>จำนวนคนที่อพยพ</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                inputMode="numeric"
                                min="0"
                                value={data.evacuatedPeople || ''}
                                onChange={(e) => handleChange('evacuatedPeople', e.target.value)}
                                style={{ ...inputStyle, background: '#fff7ed', color: '#c2410c' }}
                                placeholder="0"
                                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: '#fdba74', fontSize: '14px' }}>คน</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                background: '#f1f5f9', borderRadius: '12px', padding: '16px',
                display: 'flex', gap: '12px', alignItems: 'start'
            }}>
                <AlertCircle size={20} color="#64748b" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                    กรุณากรอกข้อมูลตามความเป็นจริง หากไม่มีผู้ได้รับผลกระทบในหัวข้อใด ให้ระบุเป็น 0
                </p>
            </div>

        </div>
    );
}
