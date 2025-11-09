import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';
import { MapView } from './pages/supervisor/MapView';
import { TasksPage } from './pages/supervisor/TasksPage';
import SurveyTemplateList from './pages/supervisor/SurveyTemplateList';
import SurveyFormBuilder from './pages/supervisor/SurveyFormBuilder';
import SurveyResponseForm from './pages/field_officer/SurveyResponseForm';
import ReportsPage from './pages/ReportsPage';
import CreateReportPage from './pages/CreateReportPage';
import ReportDetailsPage from './pages/ReportDetailsPage';
import EditReportPage from './pages/EditReportPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import { ExecutiveDashboardPage } from './pages/ExecutiveDashboardPage';
import { CreateFullReportPage } from './pages/reports/CreateFullReportPage';
import { OverlayMapPage } from './pages/analysis/OverlayMapPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/executive-dashboard"
            element={
              <ProtectedRoute>
                <ExecutiveDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/create-full/:taskId"
            element={
              <ProtectedRoute>
                <CreateFullReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor/survey-templates"
            element={
              <ProtectedRoute>
                <SurveyTemplateList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor/survey-templates/new"
            element={
              <ProtectedRoute>
                <SurveyFormBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor/survey-templates/edit/:id"
            element={
              <ProtectedRoute>
                <SurveyFormBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/survey/:surveyId/respond"
            element={
              <ProtectedRoute>
                <SurveyResponseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/new"
            element={
              <ProtectedRoute>
                <CreateReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <ProtectedRoute>
                <ReportDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports/:id/edit"
            element={
              <ProtectedRoute>
                <EditReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute>
                <AuditLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis/overlay"
            element={
              <ProtectedRoute>
                <OverlayMapPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/supervisor" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
