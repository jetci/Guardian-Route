import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function ExecutiveBudgetResources() {

  // Mock budget data
  const budgetData = {
    allocated: 5000000,
    used: 3250000,
    remaining: 1750000,
    percentUsed: 65
  };

  const costByType = [
    { type: 'อุทกภัย', cost: 1200000, percent: 37, color: '#3b82f6' },
    { type: 'วาตภัย', cost: 850000, percent: 26, color: '#f59e0b' },
    { type: 'ดินถล่ม', cost: 650000, percent: 20, color: '#ef4444' },
    { type: 'ไฟป่า', cost: 350000, percent: 11, color: '#dc2626' },
    { type: 'อื่นๆ', cost: 200000, percent: 6, color: '#6b7280' }
  ];

  const recentExpenses = [
    { id: 1, description: 'อุปกรณ์กู้ภัยน้ำท่วม', amount: 250000, date: '2025-11-10', category: 'อุปกรณ์' },
    { id: 2, description: 'ค่าล่วงเวลาทีมปฏิบัติการ', amount: 180000, date: '2025-11-08', category: 'บุคลากร' },
    { id: 3, description: 'เชื้อเพลิงรถยนต์ฉุกเฉิน', amount: 95000, date: '2025-11-05', category: 'ยานพาหนะ' },
    { id: 4, description: 'ซ่อมแซมเรือกู้ภัย', amount: 320000, date: '2025-11-03', category: 'ซ่อมบำรุง' },
    { id: 5, description: 'วัสดุสำรองฉุกเฉิน', amount: 150000, date: '2025-11-01', category: 'วัสดุสิ้นเปลือง' }
  ];

  const equipment = [
    { name: 'รถยนต์ฉุกเฉิน', total: 12, available: 10, inUse: 2, status: 'good' },
    { name: 'เรือกู้ภัย', total: 5, available: 4, inUse: 1, status: 'good' },
    { name: 'เครื่องสูบน้ำ', total: 8, available: 6, inUse: 2, status: 'warning' },
    { name: 'เครื่องกำเนิดไฟฟ้า', total: 6, available: 5, inUse: 1, status: 'good' }
  ];

  const maxCost = Math.max(...costByType.map(c => c.cost));

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', color: '#1a202c' }}>
            💰 ภาพรวมงบประมาณและทรัพยากร
          </h1>
          <p style={{ margin: 0, color: '#718096', fontSize: '16px' }}>
            การเงินและการจัดสรรทรัพยากรสำหรับการบริหารจัดการภัยพิบัติ
          </p>
        </div>

        {/* Budget Gauge & KPIs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          {/* Budget Gauge */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            gridColumn: 'span 2'
          }}>
            <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a202c' }}>
              📊 งบประมาณฉุกเฉิน
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              {/* Circular Gauge */}
              <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Background circle */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="20"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="90"
                    cy="90"
                    r="70"
                    fill="none"
                    stroke={budgetData.percentUsed > 80 ? '#ef4444' : budgetData.percentUsed > 60 ? '#f59e0b' : '#10b981'}
                    strokeWidth="20"
                    strokeDasharray={`${(budgetData.percentUsed / 100) * 440} 440`}
                    strokeLinecap="round"
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1a202c' }}>
                    {budgetData.percentUsed}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>ใช้ไปแล้ว</div>
                </div>
              </div>
              
              {/* Budget Details */}
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>งบประมาณที่ตั้งไว้</div>
                  <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a202c' }}>
                    ฿{budgetData.allocated.toLocaleString()}
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>ใช้ไปแล้ว</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                    ฿{budgetData.used.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#718096', marginBottom: '4px' }}>คงเหลือ</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    ฿{budgetData.remaining.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Average Cost per Incident */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💵</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
              ฿135,417
            </div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>ค่าใช้จ่ายเฉลี่ยต่อเหตุการณ์</div>
            <div style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>
              ลดลง 8% จากไตรมาสที่แล้ว
            </div>
          </div>

          {/* Total Overtime Hours */}
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⏰</div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a202c', marginBottom: '8px' }}>
              342 ชม.
            </div>
            <div style={{ color: '#718096', fontSize: '14px', marginBottom: '8px' }}>ชั่วโมงล่วงเวลาทั้งหมด</div>
            <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: '600' }}>
              +15% จากเดือนที่แล้ว
            </div>
          </div>
        </div>

        {/* Cost by Type Chart */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          border: '1px solid #e2e8f0',
          marginBottom: '30px'
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#1a202c' }}>
            📊 ค่าใช้จ่ายจำแนกตามประเภทภัย
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {costByType.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      background: item.color,
                      borderRadius: '4px'
                    }} />
                    <span style={{ fontSize: '15px', color: '#1a202c', fontWeight: '500' }}>{item.type}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#1a202c' }}>
                      ฿{item.cost.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#718096', minWidth: '50px', textAlign: 'right' }}>
                      {item.percent}%
                    </span>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: '#e2e8f0',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(item.cost / maxCost) * 100}%`,
                    height: '100%',
                    background: item.color,
                    transition: 'width 0.5s'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Status & Recent Expenses */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '20px'
        }}>
          {/* Equipment Status */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#1a202c' }}>
              🚗 สถานะอุปกรณ์หลัก
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {equipment.map((item, idx) => (
                <div key={idx} style={{
                  padding: '16px',
                  background: '#f7fafc',
                  borderRadius: '10px',
                  border: `2px solid ${item.status === 'good' ? '#d1fae5' : '#fed7aa'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '15px' }}>
                      {item.name}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      background: item.status === 'good' ? '#d1fae5' : '#fed7aa',
                      color: item.status === 'good' ? '#065f46' : '#9a3412',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {item.status === 'good' ? '✓ ปกติ' : '⚠ ต้องตรวจสอบ'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#4a5568' }}>
                    <span>ทั้งหมด: <strong>{item.total}</strong></span>
                    <span>พร้อมใช้: <strong style={{ color: '#10b981' }}>{item.available}</strong></span>
                    <span>ใช้งาน: <strong style={{ color: '#3b82f6' }}>{item.inUse}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Expenses */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#1a202c' }}>
              💳 รายจ่ายก้อนใหญ่ล่าสุด
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentExpenses.map(expense => (
                <div key={expense.id} style={{
                  padding: '16px',
                  background: '#f7fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '600', color: '#1a202c', fontSize: '14px' }}>
                      {expense.description}
                    </span>
                    <span style={{ fontWeight: 'bold', color: '#ef4444', fontSize: '15px' }}>
                      ฿{expense.amount.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#718096' }}>
                    <span>📅 {expense.date}</span>
                    <span>🏷️ {expense.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
