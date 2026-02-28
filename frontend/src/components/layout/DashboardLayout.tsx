import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: ReactNode;
  noPadding?: boolean;
}

export function DashboardLayout({ children, noPadding = false }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className={`dashboard-main ${noPadding ? 'no-padding' : ''}`}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
