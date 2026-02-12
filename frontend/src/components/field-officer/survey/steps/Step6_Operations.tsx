import { type SurveyData } from '../../../../types/survey';
import { Building2, Users2, Briefcase } from 'lucide-react';

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

    const cardStyle = (isSelected: boolean) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        borderRadius: '16px',
        border: isSelected ? '2px solid #3b82f6' : '1px solid #e2e8f0',
        background: isSelected ? '#eff6ff' : 'white',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '16px',
        position: 'relative' as const
    });

    const iconBoxStyle = (isSelected: boolean) => ({
        width: '48px', height: '48px',
        borderRadius: '12px',
        background: isSelected ? '#3b82f6' : '#f1f5f9',
        color: isSelected ? 'white' : '#64748b',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s'
    });

    const radioStyle = (isSelected: boolean) => ({
        width: '24px', height: '24px',
        borderRadius: '50%',
        border: isSelected ? '6px solid #3b82f6' : '2px solid #cbd5e1',
        background: 'white',
        marginLeft: 'auto',
        transition: 'all 0.2s'
    });

    return (
        <div style={{ fontFamily: "'Sarabun', sans-serif" }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '24px' }}>
                หน่วยงานที่เข้าดำเนินการช่วยเหลือ
            </h3>

            <div
                onClick={() => toggleAgency('localGovt')}
                style={cardStyle(data.involvedAgencies.localGovt)}
            >
                <div style={iconBoxStyle(data.involvedAgencies.localGovt)}>
                    <Building2 size={24} />
                </div>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: data.involvedAgencies.localGovt ? '#1e3a8a' : '#334155' }}>
                        องค์กรปกครองส่วนท้องถิ่น (อปท.)
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        เช่น อบต., เทศบาล, อบจ.
                    </div>
                </div>
                <div style={radioStyle(data.involvedAgencies.localGovt)} />
            </div>

            <div
                onClick={() => toggleAgency('privateSector')}
                style={cardStyle(data.involvedAgencies.privateSector)}
            >
                <div style={iconBoxStyle(data.involvedAgencies.privateSector)}>
                    <Users2 size={24} />
                </div>
                <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: data.involvedAgencies.privateSector ? '#1e3a8a' : '#334155' }}>
                        ภาคเอกชน / มูลนิธิ
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                        เช่น มูลนิธิกู้ภัย, สมาคมการกุศล, บริษัทเอกชน
                    </div>
                </div>
                <div style={radioStyle(data.involvedAgencies.privateSector)} />
            </div>

            <div style={{
                background: '#f8fafc', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0',
                marginTop: '8px'
            }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '15px', fontWeight: '700', color: '#334155' }}>
                    <Briefcase size={18} color="#64748b" /> หน่วยงานอื่นๆ (ระบุ)
                </label>
                <input
                    type="text"
                    value={data.involvedAgencies.other}
                    onChange={(e) => handleOtherChange(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '12px',
                        border: '1px solid #cbd5e1',
                        fontSize: '16px',
                        color: '#1e293b',
                        outline: 'none',
                        background: 'white'
                    }}
                    placeholder="เช่น กรมชลประทาน, การไฟฟ้า, กรมทางหลวง..."
                />
            </div>
        </div>
    );
}
