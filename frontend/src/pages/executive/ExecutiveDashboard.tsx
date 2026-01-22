/**
 * Executive Dashboard
 * Standardized with DashboardLayout
 */

import { useState, Suspense, lazy } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Map,
  BarChart3,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download
} from 'lucide-react';

// Lazy load HeatmapVisualization to avoid blocking initial render
const HeatmapVisualization = lazy(() => import('../../components/HeatmapVisualization'));

export default function ExecutiveDashboard() {
  const [showMap, setShowMap] = useState(false);

  // Mock data with comparisons (ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่)
  const kpiData = {
    monthlyIncidents: 24,
    monthlyChange: '5%',
    monthlyChangePositive: false, // More incidents is negative
    avgResponseTime: '2.5 ชม.',
    responseTimeChange: '0.3 ชม.',
    responseTimePositive: true, // Faster is positive
    activeOfficers: 12,
    totalOfficers: 15,
    officerUtilization: '80%',
    utilizationPositive: true,
    completionRate: '85%',
    completionChange: '3%',
    completionPositive: true
  };

  const incidentsByType = [
    { type: 'น้ำท่วม', count: 8, percentage: 33, color: 'bg-blue-500' },
    { type: 'ดินถล่ม', count: 6, percentage: 25, color: 'bg-amber-600' },
    { type: 'ไฟไหม้ป่า', count: 5, percentage: 21, color: 'bg-red-500' },
    { type: 'แผ่นดินไหว', count: 3, percentage: 13, color: 'bg-orange-500' },
    { type: 'อื่นๆ', count: 2, percentage: 8, color: 'bg-gray-400' }
  ];

  const villageStats = [
    { village: 'หมู่ 3 - บ้านหนองบัว', incidents: 5, status: 'HIGH' },
    { village: 'หมู่ 5 - ดินถล่ม', incidents: 4, status: 'HIGH' },
    { village: 'หมู่ 8 - เขาใหญ่', incidents: 3, status: 'MEDIUM' },
    { village: 'หมู่ 12 - ตำบลเวียง', incidents: 3, status: 'MEDIUM' },
    { village: 'หมู่ 2 - ป่าบง', incidents: 2, status: 'LOW' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50/50 p-6 font-sarabun">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="max-w-7xl mx-auto space-y-8"
          {...({} as any)}
        >
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                  <Activity size={28} />
                </span>
                Executive Command Center
              </h1>
              <p className="text-gray-500 mt-1 ml-14">
                ภาพรวมสถานการณ์และการวิเคราะห์เชิงลึก | Last Updated: {new Date().toLocaleString('th-TH')}
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                <Filter size={18} />
                ตัวกรองข้อมูล
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center gap-2">
                <Download size={18} />
                Export Report
              </button>
            </div>
          </header>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Incident Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group" {...({} as any)}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <AlertTriangle size={80} className="text-indigo-600" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                  <BarChart3 size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${!kpiData.monthlyChangePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {!kpiData.monthlyChangePositive ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                  {kpiData.monthlyChange}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpiData.monthlyIncidents}</h3>
              <p className="text-gray-500 font-medium">เหตุการณ์เดือนนี้</p>
            </motion.div>

            {/* Response Time Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group" {...({} as any)}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Clock size={80} className="text-blue-600" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <Clock size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.responseTimePositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpiData.responseTimePositive ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                  {kpiData.responseTimeChange}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpiData.avgResponseTime}</h3>
              <p className="text-gray-500 font-medium">เวลาตอบสนองเฉลี่ย</p>
            </motion.div>

            {/* Active Officers Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group" {...({} as any)}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Users size={80} className="text-emerald-600" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                  <Users size={24} />
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
                  <TrendingUp size={16} />
                  {kpiData.officerUtilization} Util.
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpiData.activeOfficers}/{kpiData.totalOfficers}</h3>
              <p className="text-gray-500 font-medium">เจ้าหน้าที่ปฏิบัติงาน</p>
            </motion.div>

            {/* Completion Rate Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all relative overflow-hidden group" {...({} as any)}>
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CheckCircle size={80} className="text-orange-600" />
              </div>
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                  <CheckCircle size={24} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${kpiData.completionPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpiData.completionPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  {kpiData.completionChange}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{kpiData.completionRate}</h3>
              <p className="text-gray-500 font-medium">อัตราการแก้ไขสำเร็จ</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Incident Types Chart */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100" {...({} as any)}>
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="text-indigo-600" size={20} />
                สถิติเหตุการณ์แยกตามประเภท
              </h3>
              <div className="space-y-5">
                {incidentsByType.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.type}</span>
                      <span className="text-sm font-bold text-gray-900">{item.count} ครั้ง ({item.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full rounded-full ${item.color}`}
                        {...({} as any)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Risk Map Section */}
            <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col" {...({} as any)}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Map className="text-indigo-600" size={20} />
                  แผนที่ความเสี่ยง (Risk Heatmap)
                </h3>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showMap
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                >
                  {showMap ? 'ซ่อนแผนที่' : 'แสดงแผนที่'}
                </button>
              </div>

              <div className="flex-1 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 min-h-[300px] relative">
                <AnimatePresence mode="wait">
                  {showMap ? (
                    <motion.div
                      key="map"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                      {...({} as any)}
                    >
                      <Suspense fallback={
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <span className="text-sm">กำลังโหลดข้อมูลแผนที่...</span>
                        </div>
                      }>
                        <HeatmapVisualization height="100%" />
                      </Suspense>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4"
                      {...({} as any)}
                    >
                      <div className="bg-white p-4 rounded-full shadow-sm">
                        <Map size={48} className="text-gray-300" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-600 font-medium">แผนที่ถูกซ่อนอยู่</p>
                        <p className="text-sm text-gray-400 mt-1">คลิกปุ่ม "แสดงแผนที่" เพื่อดูข้อมูลความเสี่ยงในพื้นที่</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Village Statistics */}
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" {...({} as any)}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="text-indigo-600" size={20} />
                พื้นที่เฝ้าระวัง (Top 5 หมู่บ้าน)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">หมู่บ้าน / ชุมชน</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">จำนวนเหตุการณ์</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">ระดับความเสี่ยง</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {villageStats.map((village, index) => (
                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{village.village}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-gray-900">{village.incidents}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${village.status === 'HIGH'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : village.status === 'MEDIUM'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}>
                          {village.status === 'HIGH' ? 'สูง' : village.status === 'MEDIUM' ? 'ปานกลาง' : 'ต่ำ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                          ดูรายละเอียด
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
