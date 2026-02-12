import { useState } from 'react';
import { type SurveyData } from '../../../../types/survey';
import { Home, Sprout, Zap, Building2, Warehouse, School, Factory, Trees, Droplets, Fish, Navigation, ShieldCheck } from 'lucide-react';

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

    const tabButtonStyle = (isActive: boolean, color: string) => ({
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        border: 'none',
        background: isActive ? 'white' : 'transparent',
        color: isActive ? color : '#64748b',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    });

    const sectionTitleStyle = (color: string) => ({
        fontSize: '16px',
        fontWeight: '700',
        color: color,
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    });

    const inputGroupStyle = {
        marginBottom: '16px'
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13px',
        color: '#64748b',
        marginBottom: '6px',
        fontWeight: '500'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        fontSize: '16px',
        color: '#1e293b',
        outline: 'none',
        background: '#f8fafc',
        transition: 'all 0.2s'
    };

    const totalInputStyle = (color: string, bg: string, borderColor: string) => ({
        width: '100%',
        padding: '16px',
        borderRadius: '12px',
        border: `1px solid ${borderColor}`,
        fontSize: '20px',
        fontWeight: '700',
        color: color,
        outline: 'none',
        background: bg,
        textAlign: 'right' as const
    });

    return (
        <div style={{ fontFamily: "'Sarabun', sans-serif" }}>
            <div style={{
                background: '#f1f5f9', padding: '6px', borderRadius: '16px',
                display: 'flex', gap: '4px', marginBottom: '24px'
            }}>
                <button
                    onClick={() => setActiveTab('building')}
                    style={tabButtonStyle(activeTab === 'building', '#2563eb')}
                >
                    <Home size={18} /> สิ่งปลูกสร้าง
                </button>
                <button
                    onClick={() => setActiveTab('agriculture')}
                    style={tabButtonStyle(activeTab === 'agriculture', '#16a34a')}
                >
                    <Sprout size={18} /> เกษตรกรรม
                </button>
                <button
                    onClick={() => setActiveTab('utility')}
                    style={tabButtonStyle(activeTab === 'utility', '#ea580c')}
                >
                    <Zap size={18} /> สาธารณูปโภค
                </button>
            </div>

            {/* Building Damage */}
            {activeTab === 'building' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '20px', border: '1px solid #dbeafe' }}>
                            <div style={sectionTitleStyle('#1e40af')}>
                                <Building2 size={20} /> ที่อยู่อาศัย
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>เสียหายบางส่วน (หลัง)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.damagedHousesPartial || ''}
                                    onChange={(e) => handleChange('damagedHousesPartial', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>เสียหายทั้งหลัง (หลัง)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.damagedHousesFull || ''}
                                    onChange={(e) => handleChange('damagedHousesFull', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>อาคารสูง/คอนโด (แห่ง)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.damagedHighRise || ''}
                                    onChange={(e) => handleChange('damagedHighRise', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <div style={sectionTitleStyle('#334155')}>
                                <Warehouse size={20} /> สถานที่อื่นๆ
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>โรงงาน/บริษัท</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Factory size={16} color="#64748b" />
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.damagedFactories || ''}
                                        onChange={(e) => handleChange('damagedFactories', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>วัด/ศาสนสถาน</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.damagedTemples || ''}
                                    onChange={(e) => handleChange('damagedTemples', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>สถานที่ราชการ</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <School size={16} color="#64748b" />
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.damagedGovtPlaces || ''}
                                        onChange={(e) => handleChange('damagedGovtPlaces', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                            อื่นๆ ระบุ
                        </label>
                        <textarea
                            value={data.damagedOther || ''}
                            onChange={(e) => handleTextChange('damagedOther', e.target.value)}
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            placeholder="ระบุรายละเอียดเพิ่มเติม..."
                        />
                    </div>

                    <div style={{ background: '#e0f2fe', padding: '20px', borderRadius: '20px', border: '1px solid #bae6fd' }}>
                        <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#0369a1', marginBottom: '8px' }}>
                            มูลค่าความเสียหายเบื้องต้น (บาท)
                        </label>
                        <input
                            type="number" min="0" placeholder="0.00"
                            value={data.estimatedBuildingDamage || ''}
                            onChange={(e) => handleChange('estimatedBuildingDamage', e.target.value)}
                            style={totalInputStyle('#0284c7', 'white', '#7dd3fc')}
                        />
                    </div>
                </div>
            )}

            {/* Agriculture Damage */}
            {activeTab === 'agriculture' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '20px', border: '1px solid #dcfce7' }}>
                            <div style={sectionTitleStyle('#15803d')}>
                                <Trees size={20} /> พืชสวน/ไร่นา
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>พืชไร่ (ไร่)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.cropRai || ''}
                                    onChange={(e) => handleChange('cropRai', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>นาข้าว (ไร่)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.riceRai || ''}
                                    onChange={(e) => handleChange('riceRai', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>สวนผลไม้/ไม้ยืนต้น (ไร่)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.orchardRai || ''}
                                    onChange={(e) => handleChange('orchardRai', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ background: '#fefce8', padding: '20px', borderRadius: '20px', border: '1px solid #fef9c3' }}>
                            <div style={sectionTitleStyle('#a16207')}>
                                <Fish size={20} /> ปศุสัตว์/ประมง
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>บ่อปลา (บ่อ/ไร่)</label>
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.fishPonds || ''}
                                        onChange={(e) => handleChange('fishPonds', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>บ่อกุ้ง (บ่อ/ไร่)</label>
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.shrimpPonds || ''}
                                        onChange={(e) => handleChange('shrimpPonds', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>โค/กระบือ (ตัว)</label>
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.livestockCows || ''}
                                        onChange={(e) => handleChange('livestockCows', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>สุกร (ตัว)</label>
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.livestockPigs || ''}
                                        onChange={(e) => handleChange('livestockPigs', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <label style={labelStyle}>สัตว์ปีก (ตัว)</label>
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.livestockPoultry || ''}
                                        onChange={(e) => handleChange('livestockPoultry', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                            อื่นๆ ระบุ
                        </label>
                        <textarea
                            value={data.livestockOther || ''}
                            onChange={(e) => handleTextChange('livestockOther', e.target.value)}
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            placeholder="ระบุรายละเอียดเพิ่มเติม..."
                        />
                    </div>

                    <div style={{ background: '#dcfce7', padding: '20px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
                        <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#15803d', marginBottom: '8px' }}>
                            มูลค่าความเสียหายด้านเกษตร (บาท)
                        </label>
                        <input
                            type="number" min="0" placeholder="0.00"
                            value={data.estimatedAgriDamage || ''}
                            onChange={(e) => handleChange('estimatedAgriDamage', e.target.value)}
                            style={totalInputStyle('#16a34a', 'white', '#86efac')}
                        />
                    </div>
                </div>
            )}

            {/* Utility Damage */}
            {activeTab === 'utility' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '20px', border: '1px solid #ffedd5' }}>
                            <div style={sectionTitleStyle('#c2410c')}>
                                <Navigation size={20} /> เส้นทางคมนาคม
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>ถนน (สาย)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.roadsAgri || ''}
                                    onChange={(e) => handleChange('roadsAgri', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>สะพาน (แห่ง)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.bridges || ''}
                                    onChange={(e) => handleChange('bridges', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>คอสะพาน (แห่ง)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.bridgeNecks || ''}
                                    onChange={(e) => handleChange('bridgeNecks', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                            <div style={sectionTitleStyle('#334155')}>
                                <Droplets size={20} /> แหล่งน้ำ/อื่นๆ
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>ฝาย (แห่ง)</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.weirs || ''}
                                    onChange={(e) => handleChange('weirs', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>เขื่อน/อ่างเก็บน้ำ</label>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.dams || ''}
                                    onChange={(e) => handleChange('dams', e.target.value)}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>พนังกั้นน้ำ</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ShieldCheck size={16} color="#64748b" />
                                    <input
                                        type="number" min="0" placeholder="0"
                                        value={data.dikes || ''}
                                        onChange={(e) => handleChange('dikes', e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                            อื่นๆ ระบุ
                        </label>
                        <textarea
                            value={data.utilityOther || ''}
                            onChange={(e) => handleTextChange('utilityOther', e.target.value)}
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            placeholder="ระบุรายละเอียดเพิ่มเติม..."
                        />
                    </div>

                    <div style={{ background: '#ffedd5', padding: '20px', borderRadius: '20px', border: '1px solid #fed7aa' }}>
                        <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: '#c2410c', marginBottom: '8px' }}>
                            มูลค่าความเสียหายด้านสาธารณูปโภค (บาท)
                        </label>
                        <input
                            type="number" min="0" placeholder="0.00"
                            value={data.estimatedUtilityDamage || ''}
                            onChange={(e) => handleChange('estimatedUtilityDamage', e.target.value)}
                            style={totalInputStyle('#ea580c', 'white', '#fdba74')}
                        />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
