import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import RoleManagementPage from './pages/admin/RoleManagementPage';
import { ExecutiveDashboardPage } from './pages/ExecutiveDashboardPage';
import { CreateFullReportPage } from './pages/reports/CreateFullReportPage';
import { OverlayMapPage } from './pages/analysis/OverlayMapPage';
import MyIncidentsPage from './pages/incidents/MyIncidentsPage';
import ReportIncidentPage from './pages/incidents/ReportIncidentPage';
import MyTasksPage from './pages/tasks/MyTasksPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { RoleProtectedRoute } from './components/RoleProtectedRoute';
import { Role } from './components/guards/RoleGuard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ADMIN Only Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <RoleProtectedRoute requiredRoles={[Role.ADMIN]}>
                <AdminDashboardPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <RoleProtectedRoute requiredRoles={[Role.ADMIN]}>
                <AuditLogsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/roles"
            element={
              <RoleProtectedRoute requiredRoles={[Role.ADMIN]}>
                <RoleManagementPage />
              </RoleProtectedRoute>
            }
          />

          {/* EXECUTIVE & Above Routes */}
          <Route
            path="/executive-dashboard"
            element={
              <RoleProtectedRoute requiredRoles={[Role.EXECUTIVE]}>
                <ExecutiveDashboardPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/analysis/overlay"
            element={
              <RoleProtectedRoute requiredRoles={[Role.EXECUTIVE]}>
                <OverlayMapPage />
              </RoleProtectedRoute>
            }
          />

          {/* SUPERVISOR & Above Routes */}
          <Route
            path="/supervisor"
            element={
              <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
                <SupervisorDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
                <MapView />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
                <TasksPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/supervisor/survey-templates"
            element={
              <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
                <SurveyTemplateList />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/supervisor/survey-templates/new"
            element={
              <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
                <SurveyFormBuilder />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/supervisor/survey-templates/edit/:id"
            element={
              <RoleProtectedRoute requiredRoles={[Role.SUPERVISOR]}>
                <SurveyFormBuilder />
              </RoleProtectedRoute>
            }
          />

          {/* FIELD_OFFICER & Above Routes (All authenticated users) */}
          <Route
            path="/dashboard"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <DashboardPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <ReportsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reports/new"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <CreateReportPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reports/:id"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <ReportDetailsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reports/:id/edit"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <EditReportPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/reports/create-full/:taskId"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <CreateFullReportPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/survey/:surveyId/respond"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <SurveyResponseForm />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/incidents"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <MyIncidentsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/incidents/report"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <ReportIncidentPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/my-tasks"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <MyTasksPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <RoleProtectedRoute requiredRoles={[Role.FIELD_OFFICER]}>
                <TaskDetailPage />
              </RoleProtectedRoute>
            }
          />

          {/* Default Redirect based on role */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>

    </QueryClientProvider>
  );
}

export default App;
