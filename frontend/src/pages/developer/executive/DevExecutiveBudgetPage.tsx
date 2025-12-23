import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import toast from 'react-hot-toast';
import './DevExecutiveBudgetPage.css';

type BudgetPeriod = 'monthly' | 'quarterly' | 'yearly';

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  percentage: number;
  status: 'safe' | 'warning' | 'critical';
}

interface ExpenseItem {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected';
}

/**
 * Developer View: Executive Budget
 * ภาพรวมงบประมาณและค่าใช้จ่าย พร้อม Tracking และ Alerts
 */
export default function DevExecutiveBudgetPage() {
  const [period, setPeriod] = useState<BudgetPeriod>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock data - จะเชื่อมกับ API จริงภายหลัง
  const budgetCategories: BudgetCategory[] = [
    { name: 'การบรรเทาภัย', allocated: 500000, spent: 420000, percentage: 84, status: 'warning' },
    { name: 'อุปกรณ์และวัสดุ', allocated: 300000, spent: 180000, percentage: 60, status: 'safe' },
    { name: 'บุคลากร', allocated: 200000, spent: 150000, percentage: 75, status: 'safe' },
    { name: 'ยานพาหนะ', allocated: 150000, spent: 145000, percentage: 97, status: 'critical' },
    { name: 'อื่นๆ', allocated: 100000, spent: 45000, percentage: 45, status: 'safe' },
  ];

  const monthlyExpenses = [
    { month: 'ม.ค.', budget: 1250000, actual: 940000 },
    { month: 'ก.พ.', budget: 1250000, actual: 1100000 },
    { month: 'มี.ค.', budget: 1250000, actual: 1050000 },
    { month: 'เม.ย.', budget: 1250000, actual: 980000 },
    { month: 'พ.ค.', budget: 1250000, actual: 1150000 },
    { month: 'มิ.ย.', budget: 1250000, actual: 1200000 },
  ];

  const recentExpenses: ExpenseItem[] = [
    { id: '1', date: '2024-11-25', category: 'การบรรเทาภัย', description: 'ซื้ออุปกรณ์กู้ภัย', amount: 50000, status: 'approved' },
    { id: '2', date: '2024-11-24', category: 'ยานพาหนะ', description: 'น้ำมันรถปฏิบัติการ', amount: 15000, status: 'approved' },
    { id: '3', date: '2024-11-23', category: 'อุปกรณ์และวัสดุ', description: 'ชุดป้องกันภัย', amount: 25000, status: 'pending' },
    { id: '4', date: '2024-11-22', category: 'บุคลากร', description: 'เงินเดือนพฤศจิกายน', amount: 30000, status: 'approved' },
    { id: '5', date: '2024-11-21', category: 'อื่นๆ', description: 'ค่าซ่อมอุปกรณ์', amount: 8000, status: 'approved' },
  ];

  const COLORS = ['#3182CE', '#38A169', '#DD6B20', '#E53E3E', '#805AD5'];

  const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
  const totalSpent = budgetCategories.reduce((sum, cat) => sum + cat.spent, 0);
  const totalRemaining = totalAllocated - totalSpent;
  const overallPercentage = Math.round((totalSpent / totalAllocated) * 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return '#38a169';
      case 'warning': return '#dd6b20';
      case 'critical': return '#e53e3e';
      default: return '#718096';
    }
  };

  const handleExportBudget = () => {
    toast.success('📥 ส่งออกรายงานงบประมาณสำเร็จ');
  };

  return (
    <DashboardLayout>
      <div className="executive-budget-page">
        {/* Header */}
        <div className="budget-header">
          <div className="header-content">
            <h1>💰 Executive Budget Overview</h1>
            <p className="subtitle">ภาพรวมงบประมาณและการติดตามค่าใช้จ่าย</p>
          </div>
          <div className="header-actions">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as BudgetPeriod)}
              className="period-select"
            >
              <option value="monthly">รายเดือน</option>
              <option value="quarterly">รายไตรมาส</option>
              <option value="yearly">รายปี</option>
            </select>
            <button className="btn-export" onClick={handleExportBudget}>
              📥 Export
            </button>
          </div>
        </div>

        {/* Overall Budget Summary */}
        <div className="budget-summary">
          <div className="summary-card total">
            <div className="summary-icon">💵</div>
            <div className="summary-content">
              <h3>งบประมาณทั้งหมด</h3>
              <p className="summary-value">฿{totalAllocated.toLocaleString()}</p>
            </div>
          </div>
          <div className="summary-card spent">
            <div className="summary-icon">💸</div>
            <div className="summary-content">
              <h3>ใช้ไปแล้ว</h3>
              <p className="summary-value">฿{totalSpent.toLocaleString()}</p>
              <span className="summary-percentage">{overallPercentage}%</span>
            </div>
          </div>
          <div className="summary-card remaining">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <h3>คงเหลือ</h3>
              <p className="summary-value">฿{totalRemaining.toLocaleString()}</p>
              <span className="summary-percentage">{100 - overallPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Budget Alerts */}
        <div className="budget-alerts">
          <h2 className="section-title">⚠️ การเตือนงบประมาณ</h2>
          <div className="alerts-grid">
            {budgetCategories
              .filter(cat => cat.status === 'critical' || cat.status === 'warning')
              .map((cat, index) => (
                <div key={index} className={`alert-card ${cat.status}`}>
                  <div className="alert-icon">
                    {cat.status === 'critical' ? '🚨' : '⚠️'}
                  </div>
                  <div className="alert-content">
                    <h3>{cat.name}</h3>
                    <p>ใช้ไปแล้ว {cat.percentage}% ของงบประมาณ</p>
                    <div className="alert-progress">
                      <div
                        className="alert-progress-bar"
                        style={{
                          width: `${cat.percentage}%`,
                          background: getStatusColor(cat.status)
                        }}
                      />
                    </div>
                  </div>
                  <div className="alert-amount">
                    <span className="spent">฿{cat.spent.toLocaleString()}</span>
                    <span className="allocated">/ ฿{cat.allocated.toLocaleString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Budget by Category */}
        <div className="budget-categories">
          <div className="categories-chart">
            <h2 className="section-title">📈 งบประมาณตามหมวดหมู่</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={budgetCategories as any}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }: any) => `${name}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="spent"
                >
                  {budgetCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="categories-list">
            <h2 className="section-title">📊 รายละเอียดงบประมาณ</h2>
            <div className="category-items">
              {budgetCategories.map((cat, index) => (
                <div key={index} className="category-item">
                  <div className="category-header">
                    <h3>{cat.name}</h3>
                    <span
                      className="category-status"
                      style={{ color: getStatusColor(cat.status) }}
                    >
                      {cat.status === 'safe' && '✅ ปลอดภัย'}
                      {cat.status === 'warning' && '⚠️ ใกล้เกิน'}
                      {cat.status === 'critical' && '🚨 เกินงบประมาณ'}
                    </span>
                  </div>
                  <div className="category-amounts">
                    <span className="spent">ใช้: ฿{cat.spent.toLocaleString()}</span>
                    <span className="allocated">งบ: ฿{cat.allocated.toLocaleString()}</span>
                  </div>
                  <div className="category-progress">
                    <div
                      className="category-progress-bar"
                      style={{
                        width: `${cat.percentage}%`,
                        background: getStatusColor(cat.status)
                      }}
                    />
                  </div>
                  <span className="category-percentage">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Comparison */}
        <div className="monthly-comparison">
          <h2 className="section-title">📅 เปรียบเทียบงบประมาณ vs ค่าใช้จ่ายจริง</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#3182CE" name="งบประมาณ" />
              <Bar dataKey="actual" fill="#38A169" name="ค่าใช้จ่ายจริง" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Expenses */}
        <div className="recent-expenses">
          <h2 className="section-title">📝 รายการค่าใช้จ่ายล่าสุด</h2>
          <div className="expenses-table">
            <table>
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>หมวดหมู่</th>
                  <th>รายละเอียด</th>
                  <th>จำนวนเงิน</th>
                  <th>สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{new Date(expense.date).toLocaleDateString('th-TH')}</td>
                    <td>{expense.category}</td>
                    <td>{expense.description}</td>
                    <td className="amount">฿{expense.amount.toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${expense.status}`}>
                        {expense.status === 'approved' && '✅ อนุมัติ'}
                        {expense.status === 'pending' && '⏳ รออนุมัติ'}
                        {expense.status === 'rejected' && '❌ ไม่อนุมัติ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
