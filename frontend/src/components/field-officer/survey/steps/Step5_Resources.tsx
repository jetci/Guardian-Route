import { type SurveyData } from '../../../../types/survey';
import { Truck, Users, Droplets, Ambulance, Ship, Car, Wrench, Construction, Hammer, Key } from 'lucide-react';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step5_Resources({ data, updateData }: Props) {
    const handleChange = (field: keyof SurveyData, value: string) => {
        const numValue = parseInt(value) || 0;
        updateData({ [field]: numValue });
    };

    const cardStyle = {
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        border: '1px solid #f1f5f9'
    };

    const headerStyle = (color: string) => ({
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
        color: color, fontSize: '18px', fontWeight: '700'
    });

    const itemStyle = {
        background: '#f8fafc',
        borderRadius: '16px',
        padding: '16px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '8px'
    };

    const labelStyle = {
        fontSize: '13px',
        color: '#64748b',
        fontWeight: '500'
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '10px',
        border: '1px solid #cbd5e1',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b',
        outline: 'none',
        background: 'white',
        transition: 'all 0.2s',
        textAlign: 'center' as const
    };

    const iconBoxStyle = (bg: string, color: string) => ({
        width: '32px', height: '32px', borderRadius: '8px',
        background: bg, color: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: '4px'
    });

    return (
        <div style={{ fontFamily: "'Sarabun', sans-serif", paddingBottom: '20px' }}>

            {/* Vehicles */}
            <div style={cardStyle}>
                <div style={headerStyle('#0f172a')}>
                    <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '12px' }}>
                        <Truck size={24} color="#475569" />
                    </div>
                    ยานพาหนะ และ เครื่องจักรกล
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' }}>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>รถบรรทุกน้ำ</span>
                            <div style={iconBoxStyle('#eff6ff', '#3b82f6')}><Droplets size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.waterTrucks || ''}
                            onChange={(e) => handleChange('waterTrucks', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>รถกู้ภัย</span>
                            <div style={iconBoxStyle('#fef2f2', '#ef4444')}><Ambulance size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.rescueTrucks || ''}
                            onChange={(e) => handleChange('rescueTrucks', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>เรือท้องแบน</span>
                            <div style={iconBoxStyle('#fff7ed', '#f97316')}><Ship size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.boats || ''}
                            onChange={(e) => handleChange('boats', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>รถยนต์</span>
                            <div style={iconBoxStyle('#f0f9ff', '#0ea5e9')}><Car size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.cars || ''}
                            onChange={(e) => handleChange('cars', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    {/* Add icons to others similarly, for brevity using simple style for rest but consistent layout */}
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>เครื่องสูบน้ำ</span>
                            <div style={iconBoxStyle('#e0f2fe', '#0369a1')}><Wrench size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.pumps || ''}
                            onChange={(e) => handleChange('pumps', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>รถแบคโฮ</span>
                            <div style={iconBoxStyle('#fffbeb', '#d97706')}><Construction size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.backhoes || ''}
                            onChange={(e) => handleChange('backhoes', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>รถบรรทุก 6 ล้อ</span>
                            <div style={iconBoxStyle('#f3f4f6', '#4b5563')}><Truck size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.trucks6Wheel || ''}
                            onChange={(e) => handleChange('trucks6Wheel', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>รถตัก</span>
                            <div style={iconBoxStyle('#f3f4f6', '#4b5563')}><Construction size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.loaders || ''}
                            onChange={(e) => handleChange('loaders', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>เลื่อยยนต์</span>
                            <div style={iconBoxStyle('#f3f4f6', '#4b5563')}><Hammer size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.chainsaws || ''}
                            onChange={(e) => handleChange('chainsaws', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={itemStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <span style={labelStyle}>รถเครน</span>
                            <div style={iconBoxStyle('#f3f4f6', '#4b5563')}><Key size={16} /></div>
                        </div>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.cranes || ''}
                            onChange={(e) => handleChange('cranes', e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                </div>
            </div>

            {/* Manpower */}
            <div style={cardStyle}>
                <div style={headerStyle('#1e40af')}>
                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '12px' }}>
                        <Users size={24} color="#3b82f6" />
                    </div>
                    กำลังพล
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>หน่วยงานราชการ (แห่ง)</span>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.govtAgenciesCount || ''}
                            onChange={(e) => handleChange('govtAgenciesCount', e.target.value)}
                            style={{ ...inputStyle, width: '100px', background: 'white' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#334155' }}>ภาคเอกชน/มูลนิธิ (แห่ง)</span>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.privateGroupsCount || ''}
                            onChange={(e) => handleChange('privateGroupsCount', e.target.value)}
                            style={{ ...inputStyle, width: '100px', background: 'white' }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#eff6ff', padding: '16px', borderRadius: '16px', border: '1px solid #dbeafe' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: '#1e40af' }}>อาสาสมัคร/ประชาชน (คน)</span>
                        <input
                            type="number" min="0" placeholder="0"
                            value={data.volunteersCount || ''}
                            onChange={(e) => handleChange('volunteersCount', e.target.value)}
                            style={{ ...inputStyle, width: '100px', background: 'white', color: '#1e40af', fontWeight: '700', borderColor: '#bfdbfe' }}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
