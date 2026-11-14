import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  BookOpen,
  Bot,
  Building2,
  CheckSquare,
  FileText,
  Home,
  LayoutDashboard,
  Menu,
  Play,
  Settings as SettingsIcon,
  Shield,
  UserCircle2,
  X,
} from 'lucide-react';
import { useNexus } from '../state/NexusContext';
import { PageId } from '../types/nexus';
import { NexusLogo } from './NexusLogo';

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPage, navigate, approvals, settings, user, workspaceMode, t } = useNexus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = approvals.filter((a) => a.status === 'pending').length;

  const navGroups: Array<{ label: string; items: NavItem[] }> = [
    {
      label: t.nav.overviewGroup,
      items: [
        { id: 'landing', label: t.nav.landing, icon: Home },
        { id: 'dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { id: 'analytics', label: t.nav.analytics, icon: BarChart3 },
      ],
    },
    {
      label: t.nav.governanceGroup,
      items: [
        { id: 'agents', label: t.nav.agents, icon: Bot },
        { id: 'policies', label: t.nav.policies, icon: Shield },
        { id: 'simulator', label: t.nav.simulator, icon: Play },
        {
          id: 'approvals',
          label: t.nav.approvals,
          icon: CheckSquare,
          badge: pendingCount > 0 ? pendingCount : undefined,
        },
        { id: 'audit', label: t.nav.audit, icon: FileText },
      ],
    },
    {
      label: t.nav.systemGroup,
      items: [
        { id: 'account', label: t.nav.account, icon: UserCircle2 },
        { id: 'about', label: t.nav.about, icon: Building2 },
        { id: 'settings', label: t.nav.settings, icon: SettingsIcon },
        { id: 'documentation', label: t.nav.documentation, icon: BookOpen },
      ],
    },
  ];

  const handleSelectPage = (page: PageId) => {
    navigate(page);
    setMobileMenuOpen(false);
  };

  const activeTitle =
    navGroups.flatMap((g) => g.items).find((item) => item.id === currentPage)?.label ??
    settings.appName;

  if (currentPage === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070D1A] dark:text-slate-100 flex flex-col">
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#070D1A]/95 backdrop-blur-sm">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            {/* Zone 1: Brand Wordmark */}
            <button
              type="button"
              onClick={() => handleSelectPage('landing')}
              className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md whitespace-nowrap shrink-0"
            >
              <NexusLogo size={26} />
              <span className="font-display text-sm sm:text-base font-semibold tracking-normal text-slate-900 dark:text-white">
                {settings.appName}
              </span>
            </button>

            {/* Zone 2: 5 concise single-line text links on desktop */}
            <nav
              aria-label="Primary"
              className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <button
                type="button"
                onClick={() => handleSelectPage('dashboard')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.dashboard}
              </button>
              <button
                type="button"
                onClick={() => handleSelectPage('policies')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.policies}
              </button>
              <button
                type="button"
                onClick={() => handleSelectPage('simulator')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.simulator}
              </button>
              <button
                type="button"
                onClick={() => handleSelectPage('about')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t.nav.about}
              </button>
              <button
                type="button"
                onClick={() => handleSelectPage('account')}
                className="hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {user ? user.fullName : t.common.signIn}
              </button>
            </nav>

            {/* Zone 3: 1 primary CTA + mobile menu toggle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleSelectPage('dashboard')}
                className="rounded-md bg-blue-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap shrink-0"
              >
                {t.common.openDashboard}
              </button>
              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
                className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav
              aria-label="Mobile Navigation"
              className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1325] px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto"
            >
              {navGroups.flatMap((g) => g.items).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPage(item.id)}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px] ${
                      currentPage === item.id
                        ? 'bg-blue-600/15 text-blue-600 dark:text-blue-400'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </span>
                    {typeof item.badge === 'number' && (
                      <span className="font-mono text-xs font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}
        </header>

        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#070D1A] dark:text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200 dark:border-slate-800/90 bg-white dark:bg-[#0B1325]">
        <div className="flex h-14 items-center gap-2.5 px-5 border-b border-slate-200 dark:border-slate-800/90">
          <button
            type="button"
            onClick={() => handleSelectPage('landing')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
          >
            <NexusLogo size={26} />
            <span className="font-display text-sm font-semibold tracking-normal text-slate-900 dark:text-white truncate max-w-[175px]">
              {settings.appName}
            </span>
          </button>
        </div>

        <nav aria-label="Sidebar Navigation" className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="px-3 pb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                {group.label}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectPage(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {typeof item.badge === 'number' && (
                      <span
                        className={`font-mono text-xs font-semibold tabular-nums ${
                          isActive ? 'text-blue-100' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="border-t border-slate-200 dark:border-slate-800/90 px-4 py-3 text-xs space-y-1">
          <button
            type="button"
            onClick={() => handleSelectPage('account')}
            className="w-full text-left font-medium text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 truncate transition-colors"
          >
            {workspaceMode === 'account' && user
              ? `${t.common.accountModeLabel}: ${user.fullName}`
              : t.common.demoNoticeShort}
          </button>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {t.company.foundedBy}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Bar (Strictly 1 row, <= 56px high for <= 15% mobile sticky cap) */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/90 bg-white/95 dark:bg-[#070D1A]/95 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="hidden sm:inline text-slate-500 dark:text-slate-400 truncate">
                {settings.appName}
              </span>
              <span className="hidden sm:inline text-slate-400 dark:text-slate-600" aria-hidden="true">
                /
              </span>
              <h2 className="font-display font-semibold text-slate-900 dark:text-white truncate">
                {activeTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {currentPage !== 'simulator' && (
              <button
                type="button"
                onClick={() => handleSelectPage('simulator')}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3.5 py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap shrink-0"
              >
                <Activity className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.common.openSimulator}</span>
              </button>
            )}
          </div>
        </header>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <aside className="relative z-50 flex w-72 max-w-[82vw] flex-col bg-white dark:bg-[#0B1325] border-r border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex h-14 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
                <span className="flex items-center gap-2.5 font-display text-sm font-semibold text-slate-900 dark:text-white">
                  <NexusLogo size={24} />
                  <span>{settings.appName}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav aria-label="Mobile Sidebar" className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
                {navGroups.map((group) => (
                  <div key={group.label} className="space-y-1">
                    <div className="px-3 pb-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                      {group.label}
                    </div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentPage === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectPage(item.id)}
                          className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium min-h-[44px] transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                            <span>{item.label}</span>
                          </span>
                          {typeof item.badge === 'number' && (
                            <span
                              className={`font-mono text-xs font-semibold tabular-nums ${
                                isActive ? 'text-blue-100' : 'text-amber-500'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Workspace Content */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
