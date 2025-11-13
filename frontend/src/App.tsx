import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './pages/LoginPage';
import { SimpleDashboard } from './pages/SimpleDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import AdminDashboardV2 from './pages/admin/AdminDashboardV2';
import { SupervisorDashboard as SupervisorDashboardNew } from './pages/dashboards/SupervisorDashboard';
import { FieldOfficerDashboard } from './pages/dashboards/FieldOfficerDashboard';
import { ExecutiveDashboard } from './pages/dashboards/ExecutiveDashboard';
import ExecutiveDashboardV2 from './pages/executive/ExecutiveDashboardV2';
import { UsersPage } from './pages/UsersPage';
import { SettingsPage } from './pages/SettingsPage';
import { TeamsPage } from './pages/TeamsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SubmitReportPage } from './pages/SubmitReportPage';
import { InitialSurveyPage } from './pages/field-officer/InitialSurveyPage';
import { DetailedAssessmentPage } from './pages/field-officer/DetailedAssessmentPage';
import { ReportHistoryPage } from './pages/field-officer/ReportHistoryPage';
import { MapIncidentPage } from './pages/field-officer/MapIncidentPage';
import { WorkflowGuidePage } from './pages/field-officer/WorkflowGuidePage';
import { CreateIncidentReportPage } from './pages/field-officer/CreateIncidentReportPage';
// import { DashboardPage } from './pages/DashboardPage';
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';
import SupervisorDashboardV2 from './pages/supervisor/SupervisorDashboardV2';
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
import { MyTasksPage } from './pages/tasks/MyTasksPage';
import { TaskDetailPage } from './pages/tasks/TaskDetailPage';
import DeveloperHandbookPage from './pages/DeveloperHandbookPage';
import DeveloperDashboard from './pages/developer/DeveloperDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public Routes */}
          <Route path="/developer-handbook" element={<DeveloperHandbookPage />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            }
          />
          {/* Role-specific dashboards */}
          <Route
            path="/dashboard/developer"
            element={
              <ProtectedRoute allowedRoles={['DEVELOPER']}>
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboardV2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/supervisor"
            element={
              <ProtectedRoute allowedRoles={['SUPERVISOR']}>
                <SupervisorDashboardV2 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/officer"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <FieldOfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/executive"
            element={
              <ProtectedRoute allowedRoles={['EXECUTIVE']}>
                <ExecutiveDashboardV2 />
              </ProtectedRoute>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          {/* Supervisor Routes */}
          <Route
            path="/teams"
            element={
              <ProtectedRoute allowedRoles={['SUPERVISOR']}>
                <TeamsPage />
              </ProtectedRoute>
            }
          />
          {/* Executive Routes */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['EXECUTIVE']}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          {/* Field Officer Routes */}
          <Route
            path="/field-survey/:taskId"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <InitialSurveyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detailed-assessment/:taskId"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <DetailedAssessmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-history"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <ReportHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map-incidents"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <MapIncidentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workflow-guide"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <WorkflowGuidePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-incident"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <CreateIncidentReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-report"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER']}>
                <SubmitReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/my-tasks"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'SUPERVISOR', 'ADMIN']}>
                <MyTasksPage />
              </ProtectedRoute>
            }
          />
          {/* Temporarily disabled - needs Chakra UI */}
          {/* <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'SUPERVISOR', 'ADMIN']}>
                <TaskDetailPage />
              </ProtectedRoute>
            }
          /> */}
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
          {/* Role-based redirect */}
          <Route path="/" element={<RoleBasedRedirect />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
