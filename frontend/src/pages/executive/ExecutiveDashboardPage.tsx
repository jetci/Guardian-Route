import React, { useState } from 'react';
import { useExecutiveDashboard } from '../../hooks/executive/useExecutiveDashboard';
import { SummaryCard } from '../../components/executive/SummaryCard';
import { DashboardFilters } from '../../types/executive';

const ExecutiveDashboardPage: React.FC = () => {
  const [filters, setFilters] = useState<DashboardFilters>({});
  const { summary, isLoading, error, refetch } = useExecutiveDashboard(filters);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Executive Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                ภาพรวมข้อมูลและการวิเคราะห์ระบบจัดการภัยพิบัติ
              </p>
            </div>
            <button
              onClick={refetch}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span className="mr-2">🔄</span>
              {isLoading ? 'กำลังโหลด...' : 'รีเฟรช'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary Cards Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">สรุปภาพรวม</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
              title="งานทั้งหมด"
              value={summary?.totalTasks || 0}
              icon="📋"
              color="blue"
              isLoading={isLoading}
            />
            <SummaryCard
              title="เหตุการณ์ทั้งหมด"
              value={summary?.totalIncidents || 0}
              icon="🚨"
              color="red"
              isLoading={isLoading}
            />
            <SummaryCard
              title="รายงานที่อนุมัติ"
              value={summary?.reportsByStatus.APPROVED || 0}
              icon="✅"
              color="green"
              isLoading={isLoading}
            />
            <SummaryCard
              title="เจ้าหน้าที่ปฏิบัติงาน"
              value={summary?.activeFieldOfficers || 0}
              icon="👥"
              color="purple"
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Task Status Breakdown */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">สถานะงาน</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <SummaryCard
              title="รอมอบหมาย"
              value={summary?.tasksByStatus.PENDING_ASSIGNMENT || 0}
              icon="⏳"
              color="yellow"
              isLoading={isLoading}
            />
            <SummaryCard
              title="กำลังดำเนินการ"
              value={summary?.tasksByStatus.IN_PROGRESS || 0}
              icon="🔄"
              color="blue"
              isLoading={isLoading}
            />
            <SummaryCard
              title="สำรวจแล้ว"
              value={summary?.tasksByStatus.SURVEYED || 0}
              icon="📝"
              color="purple"
              isLoading={isLoading}
            />
            <SummaryCard
              title="เสร็จสมบูรณ์"
              value={summary?.tasksByStatus.COMPLETED || 0}
              icon="✅"
              color="green"
              isLoading={isLoading}
            />
            <SummaryCard
              title="ยกเลิก"
              value={summary?.tasksByStatus.CANCELLED || 0}
              icon="❌"
              color="red"
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Impact Summary */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">ผลกระทบ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              title="ครัวเรือนที่ได้รับผลกระทบ"
              value={summary?.totalAffectedHouseholds || 0}
              icon="🏠"
              color="yellow"
              isLoading={isLoading}
            />
            <SummaryCard
              title="ประชากรที่ได้รับผลกระทบ"
              value={summary?.totalAffectedPopulation || 0}
              icon="👨‍👩‍👧‍👦"
              color="red"
              isLoading={isLoading}
            />
            <SummaryCard
              title="ความเสียหายโดยประมาณ (บาท)"
              value={summary?.totalEstimatedDamage || 0}
              icon="💰"
              color="purple"
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* Chart Placeholders */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">การวิเคราะห์</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Placeholder for Trend Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                แนวโน้มงานรายวัน
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">📊 Chart will be added in Day 2</p>
              </div>
            </div>

            {/* Placeholder for Distribution Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                การกระจายตามประเภทภัย
              </h3>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                <p className="text-gray-500">📊 Chart will be added in Day 2</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ExecutiveDashboardPage;
