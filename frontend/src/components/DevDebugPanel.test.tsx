import { render, screen, fireEvent } from '@testing-library/react';
import { DevDebugPanel } from './DevDebugPanel';
import { ApiLogContext } from '../context/ApiLogContext';
import { vi } from 'vitest';

const mockLogs = [
  { id: 1, method: 'GET', url: '/api/users', status: 200, duration: 50, timestamp: Date.now(), type: 'request' },
  { id: 2, method: 'POST', url: '/api/incidents', status: 400, duration: 120, timestamp: Date.now(), type: 'error' },
  { id: 3, method: 'GET', url: '/api/kpis', status: 200, duration: 30, timestamp: Date.now(), type: 'request' },
];

const mockApiLogContext = {
  logs: mockLogs,
  addLog: vi.fn(),
  clearLogs: vi.fn(),
};

const renderWithContext = (ui: React.ReactElement, contextValue = mockApiLogContext) => {
  return render(
    <ApiLogContext.Provider value={contextValue as any}>
      {ui}
    </ApiLogContext.Provider>
  );
};

describe('DevDebugPanel', () => {
  it('should render the panel and display logs', () => {
    renderWithContext(<DevDebugPanel />);
    expect(screen.getByText('API Debug Panel')).toBeInTheDocument();
    expect(screen.getByText('/api/users')).toBeInTheDocument();
    expect(screen.getByText('/api/incidents')).toBeInTheDocument();
  });

  it('should filter logs by status 200', () => {
    renderWithContext(<DevDebugPanel />);
    const filterInput = screen.getByPlaceholderText('Filter by URL or Status');
    fireEvent.change(filterInput, { target: { value: '200' } });
    expect(screen.getByText('/api/users')).toBeInTheDocument();
    expect(screen.queryByText('/api/incidents')).not.toBeInTheDocument();
  });

  it('should filter logs by URL', () => {
    renderWithContext(<DevDebugPanel />);
    const filterInput = screen.getByPlaceholderText('Filter by URL or Status');
    fireEvent.change(filterInput, { target: { value: 'incidents' } });
    expect(screen.queryByText('/api/users')).not.toBeInTheDocument();
    expect(screen.getByText('/api/incidents')).toBeInTheDocument();
  });

  it('should call clearLogs when Clear button is clicked', () => {
    renderWithContext(<DevDebugPanel />);
    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);
    expect(mockApiLogContext.clearLogs).toHaveBeenCalled();
  });
});
