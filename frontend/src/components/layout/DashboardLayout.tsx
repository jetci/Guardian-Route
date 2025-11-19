import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f7fafc' }}>
      <Sidebar />
      <main 
        className="dashboard-main"
        style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
          minHeight: '100vh',
          position: 'relative',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </main>
    </div>
  );
}
