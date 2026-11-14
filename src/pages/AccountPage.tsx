import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  Database,
  LogIn,
  LogOut,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { computeDashboardMetrics } from '../engine/analytics';
import { useNexus } from '../state/NexusContext';

type AuthTab = 'login' | 'register';

export const AccountPage: React.FC = () => {
  const {
    user,
    workspaceMode,
    switchMode,
    login,
    register,
    logout,
    loadStarterTemplatesInAccount,
    agents,
    approvals,
    auditLogs,
    policy,
    navigate,
    t,
  } = useNexus();

  const [tab, setTab] = useState<AuthTab>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [seededNotice, setSeededNotice] = useState(false);

  const metrics = useMemo(
    () => computeDashboardMetrics(auditLogs, approvals, agents),
    [auditLogs, approvals, agents]
  );

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg(t.account.errEmail);
      return;
    }
    if (password.length < 8) {
      setErrorMsg(t.account.errPassword);
      return;
    }

    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.error ?? 'Authentication failed.');
      return;
    }
    setPassword('');
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (fullName.trim().length < 2) {
      setErrorMsg(t.account.errFullName);
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg(t.account.errEmail);
      return;
    }
    if (password.length < 8) {
      setErrorMsg(t.account.errPassword);
      return;
    }

    setSubmitting(true);
    const res = await register({ fullName, email, organization, password });
    setSubmitting(false);
    if (!res.ok) {
      setErrorMsg(res.error ?? 'Registration failed.');
      return;
    }
    setPassword('');
  };

  const handleSeedAccount = () => {
    loadStarterTemplatesInAccount();
    setSeededNotice(true);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.account.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.account.subtitle}
        </p>
      </div>

      {!user ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Login / Registration Card */}
          <section className="lg:col-span-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1A] p-1">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 rounded px-3 py-2 text-xs font-semibold transition-colors ${
                  tab === 'login'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.account.signInTab}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setErrorMsg(null);
                }}
                className={`flex-1 rounded px-3 py-2 text-xs font-semibold transition-colors ${
                  tab === 'register'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.account.registerTab}
              </button>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-700 dark:text-rose-300"
              >
                {errorMsg}
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {t.account.emailLabel}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.account.emailPlaceholder}
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {t.account.passwordLabel}
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
                >
                  <LogIn className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.account.submitSignIn}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="reg-fullname"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {t.account.fullNameLabel}
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t.account.fullNamePlaceholder}
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {t.account.emailLabel}
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.account.emailPlaceholder}
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-org"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {t.account.orgLabel}
                  </label>
                  <input
                    id="reg-org"
                    type="text"
                    autoComplete="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder={t.account.orgPlaceholder}
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    {t.account.passwordLabel}
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {t.account.passwordHint}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
                >
                  <UserPlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.account.submitRegister}</span>
                </button>
              </form>
            )}

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                type="button"
                onClick={() => {
                  switchMode('demo');
                  navigate('dashboard');
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-4 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{t.account.continueDemoBtn}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </section>

          {/* Backend Architecture Disclosure */}
          <aside className="lg:col-span-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-3 self-start">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              <Database className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.account.backendTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {t.account.backendBody}
            </p>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
              {t.account.backendBullets.map((item) => (
                <li key={item} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Personal Account Dashboard */}
          <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.account.personalDashboardTitle}</span>
                </div>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                  {user.fullName}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors self-start"
              >
                <LogOut className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{t.common.signOut}</span>
              </button>
            </div>

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-4 text-sm">
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  {t.account.accountIdLabel}
                </dt>
                <dd className="mt-1 font-mono text-xs font-semibold text-slate-900 dark:text-white">
                  {user.id}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  {t.account.organizationLabel}
                </dt>
                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                  {user.organization || '—'}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  {t.account.memberSinceLabel}
                </dt>
                <dd className="mt-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                  {user.createdAt.slice(0, 10)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500 dark:text-slate-400">
                  {t.account.activeModeLabel}
                </dt>
                <dd
                  className={`mt-1 text-xs font-semibold ${
                    workspaceMode === 'account'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {workspaceMode === 'account'
                    ? t.common.accountModeLabel
                    : t.common.demoModeLabel}
                </dd>
              </div>
            </dl>

            {/* Live Active Workspace Snapshot */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-slate-200 dark:border-slate-800 pt-5">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t.dashboard.kpiAgents}
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-blue-600 dark:text-blue-400 tabular-nums">
                  {metrics.registeredAgents}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t.dashboard.kpiTotal}
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  {metrics.totalRequests}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t.dashboard.kpiPending}
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                  {metrics.pendingApprovals}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t.dashboard.maxCapLabel}
                </div>
                <div className="mt-1 font-mono text-xl font-semibold text-slate-900 dark:text-white tabular-nums">
                  ${policy.maxTransactionAmount.toLocaleString('en-US')}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-slate-800 pt-5">
              <button
                type="button"
                onClick={() => navigate('dashboard')}
                className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                <span>{t.account.openPersonalDashboard}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>

              {workspaceMode === 'account' ? (
                <button
                  type="button"
                  onClick={() => switchMode('demo')}
                  className="rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3.5 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t.account.useDemoBtn}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => switchMode('account')}
                  className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors"
                >
                  {t.account.usePersonalBtn}
                </button>
              )}

              {workspaceMode === 'account' && agents.length === 0 && (
                <button
                  type="button"
                  onClick={handleSeedAccount}
                  className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/40 bg-blue-500/10 px-3.5 py-2.5 text-xs font-medium text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{t.account.seedTemplatesBtn}</span>
                </button>
              )}

              {seededNotice && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{t.account.seedDone}</span>
                </span>
              )}
            </div>
          </section>

          {/* Backend Disclosure */}
          <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              <Database className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.account.backendTitle}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              {t.account.backendBody}
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 list-disc pl-4">
              {t.account.backendBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
};
