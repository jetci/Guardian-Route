import React from 'react';

interface Log {
    id: number | string;
    timestamp: string;
    user: { email: string } | null;
    action: string;
    target: string;
    status: string;
}

interface ActivityLogsTableProps {
    logs: Log[];
    loading?: boolean;
}

export const ActivityLogsTable: React.FC<ActivityLogsTableProps> = ({ logs, loading }) => {
    return (
        <div className="activity-logs">
            <h3>📜 Recent Activity</h3>
            <div className="table-container">
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Target</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="empty-state">
                                    {loading ? 'Loading...' : 'No activity logs found'}
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{new Date(log.timestamp).toLocaleString('th-TH')}</td>
                                    <td>{log.user?.email || 'Unknown'}</td>
                                    <td><strong>{log.action}</strong></td>
                                    <td>{log.target || '-'}</td>
                                    <td>
                                        <span className={`status-badge ${log.status.toLowerCase()}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
