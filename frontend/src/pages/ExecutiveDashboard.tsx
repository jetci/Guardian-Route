import React from 'react';
import MonthlyTrendChart from '../components/dashboard/MonthlyTrendChart';
import HazardTypeDonut from '../components/dashboard/HazardTypeDonut';
import SevereEventTable from '../components/dashboard/SevereEventTable';
import { RiskHeatmap } from '../components/dashboard/RiskHeatmap';
import { ExportButton } from '../components/dashboard/ExportButton';

const ExecutiveDashboard: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Executive Dashboard</h1>
        <p className="text-gray-600 mt-2">
          ภาพรวมเหตุการณ์และข้อมูลสำคัญสำหรับผู้บริหาร
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            แนวโน้มเหตุการณ์รายเดือน (6 เดือนล่าสุด)
          </h2>
          <MonthlyTrendChart />
        </div>

        {/* Hazard Type Donut Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            สัดส่วนประเภทภัย
          </h2>
          <HazardTypeDonut />
        </div>

        {/* Severe Events Table */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            เหตุการณ์รุนแรงล่าสุด (10 รายการ)
          </h2>
          <SevereEventTable />
        </div>

        {/* Risk Heatmap */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            แผนที่ความเสี่ยง (Heatmap)
          </h2>
          <RiskHeatmap />
        </div>
      </div>

      {/* Export Button */}
      <div className="mt-6 flex justify-end">
        <ExportButton />
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
