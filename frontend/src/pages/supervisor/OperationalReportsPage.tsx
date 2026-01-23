/**
 * Operational Reports Page - Supervisor
 * รายงานการปฏิบัติงาน
 */

import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import ThaiDatePicker from '../../components/ThaiDatePicker';
import { analyticsApi } from '../../api/analytics';
import toast from 'react-hot-toast';
import { FileText, Calendar, TrendingUp, Users, CheckCircle, Download, Printer, FileSpreadsheet, BarChart3, Activity } from 'lucide-react';


export default function OperationalReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const [stats, setStats] = useState({
    totalIncidents: 0,
    urgentIncidents: 0, // Note: Backend currently returns resolutionRate instead of urgent count in overview
    resolvedIncidents: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Set default dates based on report type
    const now = new Date();
    if (reportType === 'daily') {
      setStartDate(now);
      setEndDate(now);
    } else if (reportType === 'weekly') {
      const start = new Date(now);
      start.setDate(now.getDate() - 7);
      setStartDate(start);
      setEndDate(now);
    } else if (reportType === 'monthly') {
      const start = new Date(now);
      start.setMonth(now.getMonth() - 1);
      setStartDate(start);
      setEndDate(now);
    }
  }, [reportType]);

  useEffect(() => {
    if (startDate && endDate) {
      fetchReportData();
    }
  }, [startDate, endDate]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await analyticsApi.getIncidentOverview({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      });

      // Calculate derived stats or use what's available
      // Note: Backend returns totalIncidents, resolutionRate, activeUsers
      // We might need to fetch more detailed stats if we want urgent count

      setStats({
        totalIncidents: response.totalIncidents,
        urgentIncidents: 0, // TODO: Add endpoint for urgent count by date range
        resolvedIncidents: Math.round(response.totalIncidents * (response.resolutionRate / 100)),
        activeUsers: response.activeUsers
      });
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      toast.error('ไม่สามารถโหลดข้อมูลรายงานได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-8">
        <div className="w-full space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 flex items-center gap-3 mb-2">
                  <FileText className="text-blue-600" size={32} />
                  รายงานการปฏิบัติงาน
                </h1>
                <p className="text-gray-600 font-medium">สร้างและดาวน์โหลดรายงานสรุปการปฏิบัติงาน</p>
              </div>
              <button
                onClick={fetchReportData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Activity size={18} />
                {loading ? 'กำลังโหลด...' : 'รีเฟรช'}
              </button>
            </div>
          </div>

          {/* Report Type Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Calendar size={20} />
              </span>
              เลือกประเภทรายงาน
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm flex flex-col items-center gap-2 ${
                  reportType === 'daily'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => setReportType('daily')}
              >
                <Calendar size={20} />
                รายงานประจำวัน
              </button>
              <button
                className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm flex flex-col items-center gap-2 ${
                  reportType === 'weekly'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => setReportType('weekly')}
              >
                <BarChart3 size={20} />
                รายงานประจำสัปดาห์
              </button>
              <button
                className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm flex flex-col items-center gap-2 ${
                  reportType === 'monthly'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => setReportType('monthly')}
              >
                <TrendingUp size={20} />
                รายงานประจำเดือน
              </button>
              <button
                className={`p-4 rounded-xl border-2 transition-all font-semibold text-sm flex flex-col items-center gap-2 ${
                  reportType === 'custom'
                    ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
                onClick={() => setReportType('custom')}
              >
                <FileText size={20} />
                กำหนดเอง
              </button>
            </div>
          </div>

          {/* Report Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
              <span className="bg-violet-100 p-2 rounded-lg text-violet-600">
                <BarChart3 size={20} />
              </span>
              รายงาน{reportType === 'daily' ? 'ประจำวัน' : reportType === 'weekly' ? 'ประจำสัปดาห์' : reportType === 'monthly' ? 'ประจำเดือน' : 'กำหนดเอง'}
            </h2>

            {/* Date Range Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  วันที่เริ่มต้น
                </label>
                <ThaiDatePicker
                  id="report-start-date"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="เลือกวันที่เริ่มต้น"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  วันที่สิ้นสุด
                </label>
                <ThaiDatePicker
                  id="report-end-date"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="เลือกวันที่สิ้นสุด"
                />
              </div>
            </div>

            {/* Report Summary */}
            <div className="relative bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-xl p-6 mb-6 border border-slate-200">
              {loading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
                    <p className="text-sm font-medium text-gray-600">กำลังโหลดข้อมูล...</p>
                  </div>
                </div>
              )}

              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                สรุปรายงาน
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 font-medium">เหตุการณ์ทั้งหมด</div>
                      <div className="text-2xl font-bold text-gray-900">{stats.totalIncidents}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="text-emerald-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 font-medium">เสร็จสิ้น</div>
                      <div className="text-2xl font-bold text-emerald-600">{stats.resolvedIncidents}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Users className="text-violet-600" size={20} />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 font-medium">เจ้าหน้าที่ปฏิบัติงาน</div>
                      <div className="text-2xl font-bold text-violet-600">{stats.activeUsers}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Sections */}
            <div className="mb-6">
              <h4 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={18} className="text-gray-600" />
                รายการในรายงาน
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">รายงานสรุปเหตุการณ์ทั้งหมด</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">รายงานประสิทธิภาพทีมงาน</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">รายงานเวลาตอบสนองเฉลี่ย</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">รายงานความเสียหายและค่าใช้จ่าย</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg sm:col-span-2">
                  <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                  <span className="text-sm font-medium text-gray-700">กราฟและแผนภูมิสถิติ</span>
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => toast.success('กำลังสร้างรายงาน PDF... (Coming Soon)')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <Download size={18} />
                ดาวน์โหลด PDF
              </button>
              <button
                onClick={() => toast.success('กำลังสร้างรายงาน Excel... (Coming Soon)')}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <FileSpreadsheet size={18} />
                ดาวน์โหลด Excel
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl font-semibold hover:from-slate-600 hover:to-slate-700 transition-all shadow-md hover:shadow-lg text-sm"
              >
                <Printer size={18} />
                พิมพ์รายงาน
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
