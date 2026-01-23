import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleBasedRedirect } from './components/RoleBasedRedirect';
import { NotificationProvider } from './contexts/NotificationContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy Load Pages
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const UnauthorizedPage = lazy(() => import('./pages/auth/UnauthorizedPage').then(module => ({ default: module.UnauthorizedPage })));
const AdminDashboardV2 = lazy(() => import('./pages/admin/AdminDashboardV2'));
const SupervisorDashboard = lazy(() => import('./pages/supervisor/SupervisorDashboard').then(module => ({ default: module.SupervisorDashboard })));
const SupervisorDashboardV5Test = lazy(() => import('./pages/supervisor/SupervisorDashboardV5_NO_LAYOUT'));
const FieldOfficerDashboardNew = lazy(() => import('./pages/field-officer/FieldOfficerDashboard'));
const ExecutiveDashboardNew = lazy(() => import('./pages/executive/ExecutiveDashboard'));
const ExecutiveAnalytics = lazy(() => import('./pages/executive/ExecutiveAnalytics'));
const ExecutiveBudgetResources = lazy(() => import('./pages/executive/ExecutiveBudgetResources'));
const ExecutiveGeospatialAnalysis = lazy(() => import('./pages/executive/ExecutiveGeospatialAnalysis'));
const UsersPage = lazy(() => import('./pages/UsersPage').then(module => ({ default: module.UsersPage })));
const SettingsPage = lazy(() => import('./pages/admin/SettingsPage'));
const TeamsPage = lazy(() => import('./pages/TeamsPage').then(module => ({ default: module.TeamsPage })));
const AnalyticsDashboard = lazy(() => import('./pages/analytics/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const InitialSurveyPage = lazy(() => import('./pages/field-officer/InitialSurveyPage').then(module => ({ default: module.InitialSurveyPage })));
const DetailedAssessmentPage = lazy(() => import('./pages/field-officer/DetailedAssessmentPage').then(module => ({ default: module.DetailedAssessmentPage })));
const ReportHistoryPage = lazy(() => import('./pages/field-officer/ReportHistoryPage').then(module => ({ default: module.ReportHistoryPage })));
const MapIncidentPage = lazy(() => import('./pages/field-officer/MapIncidentPage').then(module => ({ default: module.MapIncidentPage })));
const WorkflowGuidePage = lazy(() => import('./pages/field-officer/WorkflowGuidePage').then(module => ({ default: module.WorkflowGuidePage })));
const CreateIncidentReportPage = lazy(() => import('./pages/field-officer/CreateIncidentReportPage').then(module => ({ default: module.CreateIncidentReportPage })));
const TaskDetailPageNew = lazy(() => import('./pages/tasks/TaskDetailPageNew').then(module => ({ default: module.TaskDetailPageNew })));
const MapView = lazy(() => import('./pages/supervisor/MapView').then(module => ({ default: module.MapView })));
const TasksPage = lazy(() => import('./pages/supervisor/TasksPage').then(module => ({ default: module.TasksPage })));
const SurveyTemplateList = lazy(() => import('./pages/supervisor/SurveyTemplateList'));
const SurveyFormBuilder = lazy(() => import('./pages/supervisor/SurveyFormBuilder'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const CreateReportPage = lazy(() => import('./pages/CreateReportPage'));
const ReportDetailsPage = lazy(() => import('./pages/ReportDetailsPage'));
const EditReportPage = lazy(() => import('./pages/EditReportPage'));
const AuditLogsPage = lazy(() => import('./pages/admin/AuditLogsPage'));
const CreateFullReportPage = lazy(() => import('./pages/reports/CreateFullReportPage').then(module => ({ default: module.CreateFullReportPage })));
const OverlayMapPage = lazy(() => import('./pages/analysis/OverlayMapPage').then(module => ({ default: module.OverlayMapPage })));
const MyTasksPage = lazy(() => import('./pages/tasks/MyTasksPage').then(module => ({ default: module.MyTasksPage })));
const DeveloperHandbookPage = lazy(() => import('./pages/DeveloperHandbookPage'));
const DeveloperDashboard = lazy(() => import('./pages/developer/DeveloperDashboard'));
const ApiDocsPage = lazy(() => import('./pages/developer/ApiDocsPage'));
const TestCreateReportPage = lazy(() => import('./pages/developer/test/TestCreateReportPage'));
const TestSurveyFormPage = lazy(() => import('./pages/developer/test/TestSurveyFormPage'));
const DevFieldOfficerWorkflowPage = lazy(() => import('./pages/developer/field-officer/DevFieldOfficerWorkflowPage'));
const DevSupervisorTeamPage = lazy(() => import('./pages/developer/supervisor/DevSupervisorTeamPage'));
const DevExecutiveReportsPage = lazy(() => import('./pages/developer/executive/DevExecutiveReportsPage'));
const DevExecutiveBudgetPage = lazy(() => import('./pages/developer/executive/DevExecutiveBudgetPage'));
const DevAdminDataPage = lazy(() => import('./pages/developer/admin/DevAdminDataPage'));
const DevAdminSettingsPage = lazy(() => import('./pages/developer/admin/DevAdminSettingsPage'));
const ManageIncidentsPage = lazy(() => import('./pages/supervisor/ManageIncidentsPage'));
const TeamOverviewPage = lazy(() => import('./pages/supervisor/TeamOverviewPage'));
const OperationalReportsPage = lazy(() => import('./pages/supervisor/OperationalReportsPage'));
const ReportsStatisticsPage = lazy(() => import('./pages/executive/ReportsStatisticsPage'));
const ManageUsersPage = lazy(() => import('./pages/admin/ManageUsersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const ManageDataPage = lazy(() => import('./pages/admin/ManageDataPage'));
const ManageVillagesPage = lazy(() => import('./pages/admin/ManageVillagesPage'));
const VillageBoundariesPage = lazy(() => import('./pages/admin/VillageBoundariesPage'));
const SurveyLandingPage = lazy(() => import('./pages/field-officer/survey/SurveyLandingPage'));
const SurveyWizardPage = lazy(() => import('./pages/field-officer/survey/SurveyWizardPage'));
const SurveyHistoryPage = lazy(() => import('./pages/field-officer/SurveyHistoryPage'));
const SurveyReviewPage = lazy(() => import('./pages/field-officer/SurveyReviewPage'));
const SurveySuccessPage = lazy(() => import('./pages/field-officer/SurveySuccessPage'));
const SurveyAnalysisPage = lazy(() => import('./pages/analysis/SurveyAnalysisPage'));
const ThaiDatePickerDemo = lazy(() => import('./pages/ThaiDatePickerDemo'));

// Loading Fallback
const LoadingFallback = () => (
  <Center h="100vh">
    <Spinner size="xl" color="blue.500" thickness="4px" />
  </Center>
);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <ErrorBoundary>
          <NotificationProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
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
                        <SupervisorDashboard key="v5-2026-01-23" />
                      </ProtectedRoute>
                    }
                  />
                  {/* Legacy Officer Dashboard - Redirect or Keep for backward compatibility */}
                  <Route
                    path="/dashboard/officer"
                    element={
                      <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                        <FieldOfficerDashboardNew />
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
                  {/* Fallback for old route */}
                  <Route path="/initial-survey" element={<Navigate to="/field-survey/new" replace />} />
                  <Route path="/initial-survey/:taskId" element={<Navigate to="/field-survey/:taskId" replace />} />
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
                        <CreateIncidentReportPage />
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
                  {/* Supervisor Dashboard V5 - TEST ROUTE (NO LAYOUT) */}
                  <Route
                    path="/test-v5"
                    element={
                      <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                        <SupervisorDashboardV5Test />
                      </ProtectedRoute>
                    }
                  />
                  {/* Supervisor Dashboard V5 - TEST ROUTE */}
                  <Route
                    path="/supervisor-v5"
                    element={
                      <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                        <SupervisorDashboard key="v5-test" />
                      </ProtectedRoute>
                    }
                  />
                  {/* Supervisor Dashboard V5 - Alternative route (same as /dashboard/supervisor) */}
                  <Route
                    path="/supervisor"
                    element={
                      <ProtectedRoute allowedRoles={['DEVELOPER', 'SUPERVISOR']}>
                        <SupervisorDashboard key="v5-2026-01-23" />
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
                        <SurveyLandingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/survey-area/:taskId"
                    element={
                      <ProtectedRoute allowedRoles={['DEVELOPER', 'FIELD_OFFICER']}>
                        <SurveyWizardPage />
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
              </Suspense>
            </BrowserRouter>
            <Toaster position="top-right" />
          </NotificationProvider>
        </ErrorBoundary>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
