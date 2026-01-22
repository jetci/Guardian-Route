import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupervisorDashboardV2 from '../SupervisorDashboardV2';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import * as reportsApi from '../../api/reports';
import * as usersApi from '../../api/users';
import * as tasksApi from '../../api/tasks';
import * as incidentsApi from '../../api/incidents';

// Mock the API calls
vi.mock('../../api/reports');
vi.mock('../../api/users');
vi.mock('../../api/tasks');
vi.mock('../../api/incidents');
vi.mock('react-hot-toast');

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('SupervisorDashboardV2', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Setup default mock returns
        (reportsApi.getReports as any).mockResolvedValue({
            data: [
                { id: '1', title: 'Test Report', status: 'SUBMITTED', createdAt: new Date().toISOString(), author: { firstName: 'John', lastName: 'Doe' } }
            ],
            meta: { total: 1 }
        });

        (usersApi.usersApi.getFieldOfficers as any).mockResolvedValue([
            { id: '1', firstName: 'Officer', lastName: 'One', email: 'officer@test.com', isActive: true }
        ]);

        (tasksApi.tasksApi.getStatistics as any).mockResolvedValue({
            byStatus: { IN_PROGRESS: 5, COMPLETED: 10 }
        });

        (incidentsApi.incidentsApi.getAll as any).mockResolvedValue([
            { id: '1', title: 'Test Incident' }
        ]);
    });

    it('renders the dashboard with premium header', async () => {
        render(
            <BrowserRouter>
                <SupervisorDashboardV2 />
            </BrowserRouter>
        );

        expect(screen.getByText('Supervisor Dashboard')).toBeInTheDocument();
        expect(screen.getByText('ภาพรวมประสิทธิภาพทีมและการจัดการเหตุการณ์')).toBeInTheDocument();
    });

    it('loads and displays statistics', async () => {
        render(
            <BrowserRouter>
                <SupervisorDashboardV2 />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('สมาชิกในทีม')).toBeInTheDocument();
            expect(screen.getByText('งานที่กำลังดำเนินการ')).toBeInTheDocument();
        });
    });

    it('opens assign task modal when clicking the button', async () => {
        render(
            <BrowserRouter>
                <SupervisorDashboardV2 />
            </BrowserRouter>
        );

        const assignButton = screen.getByText('มอบหมายงานใหม่');
        fireEvent.click(assignButton);

        await waitFor(() => {
            expect(screen.getByText('หัวข้อภารกิจ')).toBeInTheDocument();
        });
    });
});
