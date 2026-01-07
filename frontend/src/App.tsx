import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ChakraProvider } from '@chakra-ui/react';
import { LoginPage } from './pages/LoginPage';
import { UnauthorizedPage } from './pages/auth/UnauthorizedPage';
import { SimpleDashboard } from './pages/SimpleDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';
import AdminDashboardV2 from './pages/admin/AdminDashboardV2';
import { SupervisorDashboard as SupervisorDashboardNew } from './pages/dashboards/SupervisorDashboard';
import { FieldOfficerDashboard } from './pages/dashboards/FieldOfficerDashboard';
import FieldOfficerDashboardNew from './pages/field-officer/FieldOfficerDashboard';
import { ExecutiveDashboard } from './pages/dashboards/ExecutiveDashboard';
import ExecutiveDashboardV2 from './pages/executive/ExecutiveDashboardV2';
import ExecutiveDashboardNew from './pages/executive/ExecutiveDashboard';
import ExecutiveAnalytics from './pages/executive/ExecutiveAnalytics';
import ExecutiveBudgetResources from './pages/executive/ExecutiveBudgetResources';
import ExecutiveGeospatialAnalysis from './pages/executive/ExecutiveGeospatialAnalysis';
import ThaiDatePickerDemo from './pages/ThaiDatePickerDemo';
import { UsersPage } from './pages/UsersPage';
import SettingsPage from './pages/admin/SettingsPage';
import { TeamsPage } from './pages/TeamsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AnalyticsDashboard } from './pages/analytics/AnalyticsDashboard';
import { SubmitReportPage } from './pages/SubmitReportPage';
import { InitialSurveyPage } from './pages/field-officer/InitialSurveyPage';
import { DetailedAssessmentPage } from './pages/field-officer/DetailedAssessmentPage';
import { ReportHistoryPage } from './pages/field-officer/ReportHistoryPage';
import { MapIncidentPage } from './pages/field-officer/MapIncidentPage';
import { WorkflowGuidePage } from './pages/field-officer/WorkflowGuidePage';
import { CreateIncidentReportPage } from './pages/field-officer/CreateIncidentReportPage';
import { TaskDetailPageNew } from './pages/tasks/TaskDetailPageNew';
// import { DashboardPage } from './pages/DashboardPage';
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';
import SupervisorDashboardV2 from './pages/supervisor/SupervisorDashboardV2';
import SupervisorDashboardStandalone from './pages/supervisor/SupervisorDashboardStandalone';
import SupervisorDashboardSimple from './pages/supervisor/SupervisorDashboardSimple';
import SupervisorDashboardModern from './pages/supervisor/SupervisorDashboardModern';
import { MapView } from './pages/supervisor/MapView';
import { TasksPage } from './pages/supervisor/TasksPage';
import SurveyTemplateList from './pages/supervisor/SurveyTemplateList';
import SurveyFormBuilder from './pages/supervisor/SurveyFormBuilder';
// import SurveyResponseForm from './pages/field_officer/SurveyResponseForm'; // Temporarily disabled - requires Chakra UI
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
import ApiDocsPage from './pages/developer/ApiDocsPage';

// Developer Testing Pages
import TestCreateReportPage from './pages/developer/test/TestCreateReportPage';
import TestSurveyFormPage from './pages/developer/test/TestSurveyFormPage';

// Developer View Pages
import DevFieldOfficerWorkflowPage from './pages/developer/field-officer/DevFieldOfficerWorkflowPage';
import DevSupervisorTeamPage from './pages/developer/supervisor/DevSupervisorTeamPage';
import DevExecutiveReportsPage from './pages/developer/executive/DevExecutiveReportsPage';
import DevExecutiveBudgetPage from './pages/developer/executive/DevExecutiveBudgetPage';
import DevAdminDataPage from './pages/developer/admin/DevAdminDataPage';
import DevAdminSettingsPage from './pages/developer/admin/DevAdminSettingsPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// New Placeholder Pages
import ManageIncidentsPage from './pages/supervisor/ManageIncidentsPage';
import TeamOverviewPage from './pages/supervisor/TeamOverviewPage';
import OperationalReportsPage from './pages/supervisor/OperationalReportsPage';
import ReportsStatisticsPage from './pages/executive/ReportsStatisticsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ProfilePage from './pages/ProfilePage';
import ManageDataPage from './pages/admin/ManageDataPage';
import ManageVillagesPage from './pages/admin/ManageVillagesPage';
import VillageBoundariesPage from './pages/admin/VillageBoundariesPage';
import SurveyAreaPage from './pages/field-officer/SurveyAreaPage';
import SurveyHistoryPage from './pages/field-officer/SurveyHistoryPage';
import SurveyReviewPage from './pages/field-officer/SurveyReviewPage';
import SurveySuccessPage from './pages/field-officer/SurveySuccessPage';
import SurveyAnalysisPage from './pages/analysis/SurveyAnalysisPage';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <ErrorBoundary>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />

                {/* Public Routes */}
                <Route path="/demo/thai-datepicker" element={<ThaiDatePickerDemo />} />
                <Route path="/developer-handbook" element={<DeveloperHandbookPage />} />

                {/* Developer Routes */}
                <Route
                  path="/developer"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DeveloperDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/developer/api-docs"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <ApiDocsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Developer Testing Forms */}
                <Route
                  path="/developer/test/create-report"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <TestCreateReportPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/developer/test/survey-form"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <TestSurveyFormPage />
                    </ProtectedRoute>
                  }
                />

                {/* Developer Field Officer Views */}
                <Route
                  path="/developer/field-officer/workflow"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DevFieldOfficerWorkflowPage />
                    </ProtectedRoute>
                  }
                />

                {/* Developer Supervisor Views */}
                <Route
                  path="/developer/supervisor/team"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DevSupervisorTeamPage />
                    </ProtectedRoute>
                  }
                />

                {/* Developer Executive Views */}
                <Route
                  path="/developer/executive/reports"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DevExecutiveReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/developer/executive/budget"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DevExecutiveBudgetPage />
                    </ProtectedRoute>
                  }
                />

                {/* Developer Admin Views */}
                <Route
                  path="/developer/admin/data"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DevAdminDataPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/developer/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER']}>
                      <DevAdminSettingsPage />
                    </ProtectedRoute>
                  }
                />

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
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <AdminDashboardV2 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <AdminDashboardV2 />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/supervisor"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                      <SupervisorDashboardModern />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/officer"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                      <FieldOfficerDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/field-officer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                      <FieldOfficerDashboardNew />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/executive"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'EXECUTIVE']}>
                      <ExecutiveDashboardNew />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/executive/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'EXECUTIVE']}>
                      <ExecutiveAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/executive/budget-resources"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'EXECUTIVE']}>
                      <ExecutiveBudgetResources />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/executive/geospatial-analysis"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'EXECUTIVE']}>
                      <ExecutiveGeospatialAnalysis />
                    </ProtectedRoute>
                  }
                />
                {/* Admin Routes */}
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <UsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
                {/* Supervisor Routes */}
                <Route
                  path="/teams"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                      <TeamsPage />
                    </ProtectedRoute>
                  }
                />
                {/* Analytics - Old */}
                <Route
                  path="/analytics-old"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'EXECUTIVE']}>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Analytics Dashboard - New */}
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN', 'EXECUTIVE', 'SUPERVISOR', 'FIELD_OFFICER']}>
                      <AnalyticsDashboard />
                    </ProtectedRoute>
                  }
                />
                {/* Field Officer Routes */}
                <Route
                  path="/field-survey/new"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                      <InitialSurveyPage />
                    </ProtectedRoute>
                  }
                />
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
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER', 'SUPERVISOR', 'ADMIN']}>
                      <MyTasksPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/field-officer/tasks"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER', 'SUPERVISOR', 'ADMIN']}>
                      <MyTasksPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tasks/:id"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'SUPERVISOR', 'ADMIN']}>
                      <TaskDetailPageNew />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/executive-dashboard"
                  element={
                    <ProtectedRoute>
                      <ExecutiveDashboardNew />
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
                  path="/reports/:id"
                  element={
                    <ProtectedRoute>
                      <ReportDetailsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/supervisor"
                  element={
                    <ProtectedRoute>
                      <SupervisorDashboardModern />
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
                  path="/supervisor/map"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR', 'ADMIN']}>
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
                {/* Temporarily disabled - SurveyResponseForm requires Chakra UI */}
                {/* <Route
            path="/survey/:surveyId/respond"
            element={
              <ProtectedRoute>
                <SurveyResponseForm />
              </ProtectedRoute>
            }
          /> */}
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

                {/* NEW ROUTES - Supervisor */}
                <Route
                  path="/manage-incidents"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                      <ManageIncidentsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/team-overview"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                      <TeamOverviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/operational-reports"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                      <OperationalReportsPage />
                    </ProtectedRoute>
                  }
                />

                {/* NEW ROUTES - Executive */}
                <Route
                  path="/reports-statistics"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'EXECUTIVE']}>
                      <ReportsStatisticsPage />
                    </ProtectedRoute>
                  }
                />

                {/* NEW ROUTES - Admin */}
                <Route
                  path="/manage-users"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <ManageUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-data"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <ManageDataPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/manage-villages"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <ManageVillagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/village-boundaries"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <VillageBoundariesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/audit-log"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'ADMIN']}>
                      <AuditLogsPage />
                    </ProtectedRoute>
                  }
                />

                {/* NEW ROUTES - Field Officer */}
                <Route
                  path="/survey-area"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                      <SurveyAreaPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/survey-history"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                      <SurveyHistoryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/survey-review"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                      <SurveyReviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/survey-success"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                      <SurveySuccessPage />
                    </ProtectedRoute>
                  }
                />

                {/* NEW ROUTES - Shared (Supervisor & Executive) */}
                <Route
                  path="/survey-analysis"
                  element={
                    <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR', 'EXECUTIVE']}>
                      <SurveyAnalysisPage />
                    </ProtectedRoute>
                  }
                />

                {/* Role-based redirect */}
                <Route path="/" element={<RoleBasedRedirect />} />
              </Routes>
            </BrowserRouter>
            <Toaster position="top-right" />
          </NotificationProvider>
        </ErrorBoundary>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
