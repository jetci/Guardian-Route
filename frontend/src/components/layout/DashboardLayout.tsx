import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function DashboardLayout({ children, noPadding = false }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout" style={{ display: 'flex', minHeight: '100vh', background: '#f7fafc' }}>
      <Sidebar />
      <main 
        className={`dashboard-main ${noPadding ? 'no-padding' : ''}`}
        style={{
          flex: 1,
          padding: noPadding ? '0' : '32px',
          overflowY: noPadding ? 'hidden' : 'auto',
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
