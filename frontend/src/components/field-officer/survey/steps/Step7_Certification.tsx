import { type SurveyData } from '../../../../types/survey';
import { Info, AlertTriangle, LifeBuoy } from 'lucide-react';

interface Props {
    data: SurveyData;
    updateData: (data: Partial<SurveyData>) => void;
}

export default function Step7_Certification({ data, updateData }: Props) {
    const cardStyle = (type: 'INFO' | 'DISASTER_ZONE' | 'ASSISTANCE', isSelected: boolean) => {
        let baseColor = '#64748b';
        let activeColor = '#3b82f6';
        let bgActive = '#eff6ff';

        if (type === 'DISASTER_ZONE') { activeColor = '#ef4444'; bgActive = '#fef2f2'; }
        if (type === 'ASSISTANCE') { activeColor = '#f97316'; bgActive = '#fff7ed'; }

        return {
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '24px',
            borderRadius: '16px',
            border: isSelected ? `2px solid ${activeColor}` : '1px solid #e2e8f0',
            background: isSelected ? bgActive : 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '16px',
            position: 'relative' as const,
            boxShadow: isSelected ? `0 4px 12px ${activeColor}20` : 'none'
        };
    };

    const iconBoxStyle = (type: 'INFO' | 'DISASTER_ZONE' | 'ASSISTANCE', isSelected: boolean) => {
        let color = isSelected ? '#3b82f6' : '#94a3b8';
        let bg = isSelected ? '#3b82f620' : '#f1f5f9';

        if (type === 'DISASTER_ZONE') { color = isSelected ? '#ef4444' : '#94a3b8'; bg = isSelected ? '#ef444420' : '#f1f5f9'; }
        if (type === 'ASSISTANCE') { color = isSelected ? '#f97316' : '#94a3b8'; bg = isSelected ? '#f9731620' : '#f1f5f9'; }

        return {
            width: '56px', height: '56px',
            borderRadius: '14px',
            background: bg,
            color: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
        };
    };

    const titleStyle = (type: 'INFO' | 'DISASTER_ZONE' | 'ASSISTANCE', isSelected: boolean) => {
        let color = '#1e293b';
        if (isSelected) {
            if (type === 'INFO') color = '#1d4ed8';
            if (type === 'DISASTER_ZONE') color = '#b91c1c';
            if (type === 'ASSISTANCE') color = '#c2410c';
        }
        return {
            fontSize: '18px', fontWeight: '700', color: color, marginBottom: '4px'
        };
    };

    const radioStyle = (type: 'INFO' | 'DISASTER_ZONE' | 'ASSISTANCE', isSelected: boolean) => {
        let color = '#cbd5e1';
        if (isSelected) {
            if (type === 'INFO') color = '#3b82f6';
            if (type === 'DISASTER_ZONE') color = '#ef4444';
            if (type === 'ASSISTANCE') color = '#f97316';
        }
        return {
            width: '24px', height: '24px',
            borderRadius: '50%',
            border: isSelected ? `6px solid ${color}` : `2px solid ${color}`,
            background: 'white',
            marginLeft: 'auto',
            transition: 'all 0.2s',
            flexShrink: 0
        };
    };

    return (
        <div style={{ fontFamily: "'Sarabun', sans-serif" }}>
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
                    การรับรองรายงาน
                </h3>
                <p style={{ fontSize: '15px', color: '#64748b' }}>
                    โปรดระบุประเภทของรายงานเพื่อใช้ในการตัดสินใจของผู้บังคับบัญชา
                </p>
            </div>

            <div
                onClick={() => updateData({ reportType: 'INFO' })}
                style={cardStyle('INFO', data.reportType === 'INFO')}
            >
                <div style={iconBoxStyle('INFO', data.reportType === 'INFO')}>
                    <Info size={28} />
                </div>
                <div>
                    <div style={titleStyle('INFO', data.reportType === 'INFO')}>รายงานเพื่อทราบ</div>
                    <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
                        สถานการณ์ทั่วไป ไม่รุนแรง หรืออยู่ระหว่างการเฝ้าระวัง
                    </div>
                </div>
                <div style={radioStyle('INFO', data.reportType === 'INFO')} />
            </div>

            <div
                onClick={() => updateData({ reportType: 'DISASTER_ZONE' })}
                style={cardStyle('DISASTER_ZONE', data.reportType === 'DISASTER_ZONE')}
            >
                <div style={iconBoxStyle('DISASTER_ZONE', data.reportType === 'DISASTER_ZONE')}>
                    <AlertTriangle size={28} />
                </div>
                <div>
                    <div style={titleStyle('DISASTER_ZONE', data.reportType === 'DISASTER_ZONE')}>รายงานเพื่อประกาศเขตภัยพิบัติ</div>
                    <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
                        สถานการณ์รุนแรง เข้าเกณฑ์การประกาศเขตภัยพิบัติ ต้องการความช่วยเหลือทันที
                    </div>
                </div>
                <div style={radioStyle('DISASTER_ZONE', data.reportType === 'DISASTER_ZONE')} />
            </div>

            <div
                onClick={() => updateData({ reportType: 'ASSISTANCE' })}
                style={cardStyle('ASSISTANCE', data.reportType === 'ASSISTANCE')}
            >
                <div style={iconBoxStyle('ASSISTANCE', data.reportType === 'ASSISTANCE')}>
                    <LifeBuoy size={28} />
                </div>
                <div>
                    <div style={titleStyle('ASSISTANCE', data.reportType === 'ASSISTANCE')}>รายงานเพื่อขอความช่วยเหลือ</div>
                    <div style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
                        ต้องการการสนับสนุนทรัพยากร หรือเกินขีดความสามารถของท้องถิ่น
                    </div>
                </div>
                <div style={radioStyle('ASSISTANCE', data.reportType === 'ASSISTANCE')} />
            </div>

        </div>
    );
}
