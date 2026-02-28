import React from 'react';

interface KPICardsProps {
    stats: {
        totalUsers: number;
        activeIncidents: number;
        pendingReports: number;
        systemHealth: number | string;
    };
    loading: boolean;
}

export const KPICards: React.FC<KPICardsProps> = ({ stats, loading }) => {
    return (
        <div className="kpi-grid">
            <div className="kpi-card purple">
                <div className="kpi-icon">👥</div>
                <div className="kpi-content">
                    <h3>{loading ? '...' : (stats.totalUsers || 0)}</h3>
                    <p>Total Users</p>
                </div>
            </div>

            <div className="kpi-card blue">
                <div className="kpi-icon">🚨</div>
                <div className="kpi-content">
                    <h3>{loading ? '...' : (stats.activeIncidents || 0)}</h3>
                    <p>Active Incidents</p>
                </div>
            </div>

            <div className="kpi-card orange">
                <div className="kpi-icon">📋</div>
                <div className="kpi-content">
                    <h3>{loading ? '...' : (stats.pendingReports || 0)}</h3>
                    <p>Pending Reports</p>
                </div>
            </div>

            <div className="kpi-card green">
                <div className="kpi-icon">💚</div>
                <div className="kpi-content">
                    <h3>{loading ? '...' : `${stats.systemHealth}%`}</h3>
                    <p>System Health</p>
                </div>
            </div>
        </div>
    );
};
