import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { incidentsApi, type Incident } from '../../api/incidents';
import { analysisApi, type OverlayAnalysisResult } from '../../api/analysis';
import { ExportAnalysisButton } from '../../components/analysis/ExportAnalysisButton';
import toast from 'react-hot-toast';
import { Layers, MapPin, AlertTriangle, TrendingUp, Download, RotateCcw, Play, CheckSquare, Square } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const riskColors = {
  LOW: '#38A169',
  MEDIUM: '#D69E2E',
  HIGH: '#DD6B20',
  CRITICAL: '#E53E3E',
};

export const OverlayMapPage = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<OverlayAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentsApi.getAll();
      setIncidents(data);
    } catch (error) {
      console.error('Error fetching incidents:', error);
      toast.error('ไม่สามารถโหลดข้อมูลเหตุการณ์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (selectedIds.length < 2) {
      toast.error('ต้องเลือกอย่างน้อย 2 เหตุการณ์เพื่อวิเคราะห์');
      return;
    }

    try {
      setAnalyzing(true);
      const result = await analysisApi.analyzeOverlay({ incidentIds: selectedIds });
      setAnalysisResult(result);
      toast.success(`วิเคราะห์สำเร็จ! พบพื้นที่ซ้ำซาก ${result.overlappingAreas.length} พื้นที่`);
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error('ไม่สามารถวิเคราะห์ข้อมูลได้');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedIds([]);
    setAnalysisResult(null);
  };

  const center: LatLngExpression = [19.9167, 99.2333]; // ตำบลเวียง อำเภอฝาง จังหวัดเชียงใหม่

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 -m-8">
        <div className="w-full space-y-6 p-4 sm:p-6">
          {/* Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 flex items-center gap-3 mb-2">
                  <Layers className="text-blue-600" size={32} />
                  วิเคราะห์ภัยซ้ำซาก
                </h1>
                <p className="text-gray-600 font-medium">วิเคราะห์พื้นที่เสี่ยงจากเหตุการณ์ที่เกิดซ้ำ</p>
              </div>
              <button
                onClick={fetchIncidents}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md text-sm"
              >
                <RotateCcw size={18} />
                รีเฟรช
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-80 flex-shrink-0 space-y-4">
              {/* Incident Selection */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
                    <MapPin size={20} />
                  </span>
                  เลือกเหตุการณ์
                </h2>
                <p className="text-sm text-gray-600 mb-3">เลือกแล้ว: <span className="font-bold text-blue-600">{selectedIds.length}</span> รายการ</p>
                
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {incidents.map((incident) => (
                    <label
                      key={incident.id}
                      className="flex items-start gap-3 p-3 bg-slate-50 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors border border-slate-200 hover:border-blue-300"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(incident.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds([...selectedIds, incident.id]);
                          } else {
                            setSelectedIds(selectedIds.filter(id => id !== incident.id));
                          }
                        }}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{incident.title}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
                          incident.priority === 'CRITICAL' 
                            ? 'bg-red-100 text-red-700'
                            : incident.priority === 'HIGH'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {incident.priority}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-5 space-y-3">
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || selectedIds.length < 2}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-violet-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      กำลังวิเคราะห์...
                    </>
                  ) : (
                    <>
                      <Play size={18} />
                      วิเคราะห์
                    </>
                  )}
                </button>

                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all"
                >
                  <RotateCcw size={18} />
                  รีเซ็ต
                </button>

                {analysisResult && (
                  <ExportAnalysisButton analysisResult={analysisResult} />
                )}
              </div>

              {/* Analysis Results */}
              {analysisResult && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <span className="bg-violet-100 p-2 rounded-lg text-violet-600">
                      <TrendingUp size={20} />
                    </span>
                    ผลการวิเคราะห์
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">จำนวนเหตุการณ์</span>
                      <span className="text-lg font-bold text-blue-600">{analysisResult.totalIncidents}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">พื้นที่ซ้ำซาก</span>
                      <span className="text-lg font-bold text-orange-600">{analysisResult.overlappingAreas.length}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">ระดับความเสี่ยง</span>
                      <span className={`text-lg font-bold ${
                        analysisResult.riskScore > 70 ? 'text-red-600' : 
                        analysisResult.riskScore > 50 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {analysisResult.riskScore}/100
                      </span>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                        <AlertTriangle size={16} />
                        คำแนะนำ
                      </h4>
                      <ul className="space-y-2">
                        {analysisResult.recommendations.map((rec, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="flex-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
              <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Draw overlapping areas */}
                {analysisResult?.overlappingAreas.map((area, index) => (
                  <Polygon
                    key={index}
                    positions={area.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngExpression)}
                    pathOptions={{
                      color: riskColors[area.riskLevel],
                      fillColor: riskColors[area.riskLevel],
                      fillOpacity: 0.3,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <p className="font-bold text-gray-900 mb-2">พื้นที่ซ้ำซาก</p>
                        <p className="text-sm text-gray-600">จำนวนเหตุการณ์: <strong>{area.incidentCount}</strong></p>
                        <p className="text-sm text-gray-600">พื้นที่: <strong>{area.area.toFixed(2)}</strong> ตร.กม.</p>
                        <p className="text-sm text-gray-600">ระดับ: <span className={`font-bold ${
                          area.riskLevel === 'CRITICAL' ? 'text-red-600' :
                          area.riskLevel === 'HIGH' ? 'text-orange-600' : 'text-yellow-600'
                        }`}>{area.riskLevel}</span></p>
                      </div>
                    </Popup>
                  </Polygon>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
  );
};
