import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { OverlayMapPage } from './OverlayMapPage';

export default function SurveyAnalysisPage() {
  return (
    <DashboardLayout>
      {/* ใช้คอมโพเนนต์ OverlayMapPage ที่มีแผนที่และผลการวิเคราะห์ซ้อนทับ */}
      <OverlayMapPage />
    </DashboardLayout>
  );
}
