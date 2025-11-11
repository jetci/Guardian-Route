import React, { useState } from 'react';
import IncidentSelector from '../components/overlay/IncidentSelector';
import OverlayMap from '../components/overlay/OverlayMap';
import ExportOverlayButton from '../components/overlay/ExportOverlayButton';
import OverlaySaveModal from '../components/overlay/OverlaySaveModal';

interface IncidentFeature extends GeoJSON.Feature<GeoJSON.Polygon> {
  properties: {
    id: string;
    title: string;
    type: string;
  };
}

interface IntersectionResult {
  geometry: GeoJSON.Polygon;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  incidentCount: number;
  area: number;
}

const OverlayAnalysisPage: React.FC = () => {
  const [selectedIncidents, setSelectedIncidents] = useState<IncidentFeature[]>([]);
  const [analysisResults, setAnalysisResults] = useState<IntersectionResult[]>([]);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

  const handleSelectionChange = (incidents: IncidentFeature[]) => {
    setSelectedIncidents(incidents);
  };

  const handleAnalysisComplete = (results: IntersectionResult[]) => {
    setAnalysisResults(results);
  };

  const handleSaveClick = () => {
    if (analysisResults.length === 0) {
      alert('ไม่มีผลการวิเคราะห์ให้บันทึก');
      return;
    }
    setIsSaveModalOpen(true);
  };

  const getSaveData = () => {
    if (analysisResults.length === 0) return null;
    
    const topResult = analysisResults[0];
    const totalArea = analysisResults.reduce((sum, r) => sum + r.area, 0);
    
    return {
      polygon: selectedIncidents.map(i => i.geometry),
      result: {
        riskLevel: topResult.riskLevel,
        area_km2: totalArea / 1000000,
        incidentCount: selectedIncidents.length,
      },
    };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            การวิเคราะห์ภัยซ้ำซาก (Overlay Map Analysis)
          </h1>
          <p className="text-gray-600 mt-2">
            เลือกเหตุการณ์หลายรายการเพื่อวิเคราะห์พื้นที่ที่มีภัยซ้ำซาก
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Incident Selector */}
          <div className="lg:col-span-1">
            <IncidentSelector onSelectionChange={handleSelectionChange} />
          </div>

          {/* Right Content - Map and Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Action Buttons */}
            {selectedIncidents.length > 0 && (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      จัดการผลการวิเคราะห์
                    </h3>
                    <p className="text-sm text-gray-600">
                      บันทึกหรือ Export ผลการวิเคราะห์
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSaveClick}
                      disabled={analysisResults.length === 0}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                        />
                      </svg>
                      <span>บันทึกผล</span>
                    </button>
                    <ExportOverlayButton
                      results={analysisResults}
                      analysisName="การวิเคราะห์ภัยซ้ำซาก"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            <OverlayMap
              selectedIncidents={selectedIncidents}
              onAnalysisComplete={handleAnalysisComplete}
            />

            {/* Instructions */}
            {selectedIncidents.length === 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                  วิธีการใช้งาน
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-700">
                  <li>เลือกเหตุการณ์จากรายการด้านซ้าย</li>
                  <li>ระบบจะแสดง Polygon ของแต่ละเหตุการณ์บนแผนที่</li>
                  <li>ระบบจะวิเคราะห์พื้นที่ที่มีภัยซ้ำซาก (Intersection)</li>
                  <li>พื้นที่เสี่ยงจะแสดงด้วยสีตามระดับความเสี่ยง</li>
                  <li>สามารถ Export รายงานเป็น Excel หรือ PDF ได้</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {getSaveData() && (
        <OverlaySaveModal
          isOpen={isSaveModalOpen}
          onClose={() => setIsSaveModalOpen(false)}
          polygon={getSaveData()!.polygon}
          result={getSaveData()!.result}
        />
      )}
    </div>
  );
};

export default OverlayAnalysisPage;
