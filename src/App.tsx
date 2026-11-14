import React from 'react';
import { AppShell } from './components/AppShell';
import { AboutPage } from './pages/AboutPage';
import { AccountPage } from './pages/AccountPage';
import { AgentsPage } from './pages/AgentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { DashboardPage } from './pages/DashboardPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { LandingPage } from './pages/LandingPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { SettingsPage } from './pages/SettingsPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { NexusProvider, useNexus } from './state/NexusContext';

const ActivePageRouter: React.FC = () => {
  const { currentPage } = useNexus();

  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'agents':
      return <AgentsPage />;
    case 'policies':
      return <PoliciesPage />;
    case 'simulator':
      return <SimulatorPage />;
    case 'approvals':
      return <ApprovalsPage />;
    case 'audit':
      return <AuditLogsPage />;
    case 'analytics':
      return <AnalyticsPage />;
    case 'settings':
      return <SettingsPage />;
    case 'documentation':
      return <DocumentationPage />;
    case 'about':
      return <AboutPage />;
    case 'account':
      return <AccountPage />;
    default:
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <NexusProvider>
      <AppShell>
        <ActivePageRouter />
      </AppShell>
    </NexusProvider>
  );
}
