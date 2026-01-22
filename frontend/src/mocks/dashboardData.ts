export const mockUsers = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', status: 'Active', lastLogin: '2023-10-01' },
    { id: 2, name: 'Supervisor User', email: 'supervisor@example.com', role: 'SUPERVISOR', status: 'Active', lastLogin: '2023-10-02' },
    { id: 3, name: 'Field Officer 1', email: 'officer1@example.com', role: 'FIELD_OFFICER', status: 'Active', lastLogin: '2023-10-03' },
    { id: 4, name: 'Field Officer 2', email: 'officer2@example.com', role: 'FIELD_OFFICER', status: 'Inactive', lastLogin: '2023-09-28' },
];

export const mockTasks = [
    { id: '1', title: 'Survey Village A', status: 'PENDING', priority: 'HIGH', dueDate: '2023-10-10' },
    { id: '2', title: 'Inspect Bridge B', status: 'IN_PROGRESS', priority: 'MEDIUM', dueDate: '2023-10-12' },
    { id: '3', title: 'Report Flood C', status: 'COMPLETED', priority: 'LOW', dueDate: '2023-10-05' },
];

export const mockKPIs = {
    supervisor: {
        teamSize: 12,
        assignedTasks: 45,
        completedToday: 8,
        overdueTasks: 3
    }
};
