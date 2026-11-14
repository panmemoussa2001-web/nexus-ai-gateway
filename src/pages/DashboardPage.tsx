import React, { useMemo } from 'react';
import { ArrowRight, Info, Sparkles, UserCheck } from 'lucide-react';
import { DailyActivityChart, DecisionDistributionChart } from '../components/Charts';
import { DecisionBadge } from '../components/DecisionBadge';
import { computeDailyActivity, computeDashboardMetrics } from '../engine/analytics';
import { useNexus } from '../state/NexusContext';

export const DashboardPage: React.FC = () => {
  const {
    agents,
    approvals,
    auditLogs,
    policy,
    user,
    workspaceMode,
    switchMode,
    loadStarterTemplatesInAccount,
    navigate,
    t,
  } = useNexus();

  const metrics = useMemo(
    () => computeDashboardMetrics(auditLogs, approvals, agents),
    [auditLogs, approvals, agents]
  );

  const dailyActivity = useMemo(() => computeDailyActivity(auditLogs, 7), [auditLogs]);

  const simulationCounts = useMemo(() => {
    const sims = auditLogs.filter((l) => l.eventType === 'simulation');
    return {
      allow: sims.filter((l) => l.decision === 'ALLOW').length,
      block: sims.filter((l) => l.decision === 'BLOCK').length,
      approval: sims.filter((l) => l.decision === 'HUMAN APPROVAL REQUIRED').length,
    };
  }, [auditLogs]);

  const recentLogs = auditLogs.slice(0, 6);

  const kpiCards = [
    { label: t.dashboard.kpiTotal, value: metrics.totalRequests, accent: 'text-slate-900 dark:text-white' },
    { label: t.dashboard.kpiApproved, value: metrics.approvedActions, accent: 'text-emerald-600 dark:text-emerald-400' },
    { label: t.dashboard.kpiBlocked, value: metrics.blockedActions, accent: 'text-rose-600 dark:text-rose-400' },
    { label: t.dashboard.kpiPending, value: metrics.pendingApprovals, accent: 'text-amber-600 dark:text-amber-400' },
    { label: t.dashboard.kpiAgents, value: metrics.registeredAgents, accent: 'text-blue-600 dark:text-blue-400' },
  ];

  const isAccount = workspaceMode === 'account' && Boolean(user);

  return (
    <div className="space-y-6">
      {/* Header & Workspace Mode Notice */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isAccount ? `${t.dashboard.personalTitle} · ${user?.fullName}` : t.dashboard.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.dashboard.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400">
            {isAccount ? (
              <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
            ) : (
              <Info className="h-3.5 w-3.5 shrink-0 text-blue-500" aria-hidden="true" />
            )}
            <span>{isAccount ? t.dashboard.accountNotice : t.dashboard.sampleNotice}</span>
          </div>

          {user ? (
            <button
              type="button"
              onClick={() => switchMode(isAccount ? 'demo' : 'account')}
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              {isAccount ? t.dashboard.switchToDemo : t.dashboard.switchToAccount}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('account')}
              className="font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              {t.common.signIn}
            </button>
          )}
        </div>
      </div>

      {/* 5 Core KPI Statistics */}
      <section aria-label="Key Metrics" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpiCards.map((kpi, idx) => (
          <div
            key={kpi.label}
            className={`rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-4 sm:p-5 ${
              idx === kpiCards.length - 1 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {kpi.label}
            </div>
            <div className={`mt-2 font-mono text-2xl sm:text-3xl font-semibold tabular-nums ${kpi.accent}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </section>

      {/* Clean Personal Workspace Empty State Banner when newly registered */}
      {isAccount && metrics.totalRequests === 0 && metrics.registeredAgents === 0 && (
        <section className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              {t.dashboard.emptyAccountTitle}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {t.dashboard.emptyAccountBody}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => navigate('agents')}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap"
            >
              {t.agents.registerBtn}
            </button>
            <button
              type="button"
              onClick={loadStarterTemplatesInAccount}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1729] px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-500 shrink-0" aria-hidden="true" />
              <span>{t.dashboard.loadTemplatesBtn}</span>
            </button>
          </div>
        </section>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.dashboard.dailyChartTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.dashboard.dailyChartSub}
              </p>
            </div>
          </div>
          {dailyActivity.length > 0 ? (
            <DailyActivityChart
              data={dailyActivity}
              labels={{
                allow: t.common.allow,
                block: t.common.block,
                approval: t.common.humanApprovalRequired,
              }}
            />
          ) : (
            <div className="flex h-48 items-center justify-center rounded-md border border-dashed border-slate-300 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
              {t.common.noResults}
            </div>
          )}
        </section>

        <div className="lg:col-span-5 space-y-6">
          <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6">
            <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">
              {t.dashboard.distributionTitle}
            </h3>
            <DecisionDistributionChart
              allow={simulationCounts.allow}
              block={simulationCounts.block}
              approval={simulationCounts.approval}
              labels={{
                allow: t.common.allow,
                block: t.common.block,
                approval: t.common.humanApprovalRequired,
              }}
            />
          </section>

          <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.dashboard.securityOverviewTitle}
              </h3>
              <button
                type="button"
                onClick={() => navigate('policies')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                {t.nav.policies}
              </button>
            </div>
            <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-600 dark:text-slate-400">{t.dashboard.maxCapLabel}</dt>
                <dd className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                  ${policy.maxTransactionAmount.toLocaleString('en-US')}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-600 dark:text-slate-400">{t.dashboard.prohibitedCountLabel}</dt>
                <dd className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                  {policy.prohibitedCategories.length}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2.5">
                <dt className="text-slate-600 dark:text-slate-400">{t.dashboard.approvalCountLabel}</dt>
                <dd className="font-mono font-semibold text-slate-900 dark:text-white tabular-nums">
                  {policy.approvalRequiredCategories.length}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      {/* Recent Activity Table */}
      <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {t.dashboard.recentActivityTitle}
          </h3>
          <div className="flex items-center gap-4">
            {metrics.pendingApprovals > 0 && (
              <button
                type="button"
                onClick={() => navigate('approvals')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline whitespace-nowrap"
              >
                <span>{t.dashboard.reviewPending} ({metrics.pendingApprovals})</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('audit')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
            >
              <span>{t.dashboard.viewAllLogs}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {recentLogs.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {t.common.noResults}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1325] text-xs font-medium text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-3">{t.common.requestId}</th>
                  <th className="px-5 py-3">{t.common.agent}</th>
                  <th className="px-5 py-3">{t.common.action}</th>
                  <th className="px-5 py-3">{t.common.decision}</th>
                  <th className="px-5 py-3 text-right">{t.common.timestamp}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {recentLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {log.requestId}
                    </td>
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {log.agentName}
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300 max-w-[240px] truncate">
                      {log.requestedAction}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <DecisionBadge decision={log.decision} compact />
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {log.timestamp.slice(0, 16).replace('T', ' ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
