import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { KPICard } from '../../components/KPICard';
import { mockKPIs, mockTasks } from '../../mocks/dashboardData';
import './SupervisorDashboard.css';

export function SupervisorDashboard() {
  const kpis = mockKPIs.supervisor;

  return (
    <DashboardLayout>
      <div className="dashboard-header">
        <h1>Supervisor Dashboard</h1>
        <div className="dashboard-actions">
          <button className="btn btn-primary">+ Assign Task</button>
          <button className="btn-secondary">View Map</button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard
          title="Team Size"
          value={kpis.teamSize}
          icon="👨‍👩‍👧‍👦"
          color="blue"
        />
        <KPICard
          title="Assigned Tasks"
          value={kpis.assignedTasks}
          icon="📋"
          color="purple"
        />
        <KPICard
          title="Completed Today"
          value={kpis.completedToday}
          icon="✅"
          color="green"
          trend="up"
        />
        <KPICard
          title="Overdue Tasks"
          value={kpis.overdueTasks}
          icon="⚠️"
          color="red"
        />
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Team Tasks</h2>
            <div className="task-filters">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">In Progress</button>
              <button className="filter-btn">Pending</button>
              <button className="filter-btn">Completed</button>
            </div>
          </div>
          <div className="tasks-list">
            {mockTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-header">
                  <div className="task-title-section">
                    <h3>{task.title}</h3>
                    <p className="task-description">{task.description}</p>
                  </div>
                  <div className="task-badges">
                    <span className={`priority priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className={`status status-${task.status.toLowerCase()}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <div className="task-footer">
                  <span className="task-assignee">👤 {task.assignee}</span>
                  <span className="task-due">📅 {task.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-grid">
            <button className="action-card">
              <span className="action-icon">📋</span>
              <span className="action-label">Create Task</span>
            </button>
            <button className="action-card">
              <span className="action-icon">👥</span>
              <span className="action-label">Manage Team</span>
            </button>
            <button className="action-card">
              <span className="action-icon">📊</span>
              <span className="action-label">View Reports</span>
            </button>
            <button className="action-card">
              <span className="action-icon">🗺️</span>
              <span className="action-label">Incident Map</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
