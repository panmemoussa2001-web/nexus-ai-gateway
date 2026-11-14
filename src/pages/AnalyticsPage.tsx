import React, { useMemo } from 'react';
import { Info } from 'lucide-react';
import {
  DailyActivityChart,
  DecisionDistributionChart,
  RuleFrequencyChart,
} from '../components/Charts';
import {
  computeDailyActivity,
  computeDashboardMetrics,
  computeRuleTriggerStats,
} from '../engine/analytics';
import { useNexus } from '../state/NexusContext';

export const AnalyticsPage: React.FC = () => {
  const { agents, approvals, auditLogs, t } = useNexus();

  const metrics = useMemo(
    () => computeDashboardMetrics(auditLogs, approvals, agents),
    [auditLogs, approvals, agents]
  );

  const dailyActivity = useMemo(() => computeDailyActivity(auditLogs, 7), [auditLogs]);

  const ruleStats = useMemo(() => computeRuleTriggerStats(auditLogs), [auditLogs]);

  const simCounts = useMemo(() => {
    const sims = auditLogs.filter((l) => l.eventType === 'simulation');
    return {
      allow: sims.filter((l) => l.decision === 'ALLOW').length,
      block: sims.filter((l) => l.decision === 'BLOCK').length,
      approval: sims.filter((l) => l.decision === 'HUMAN APPROVAL REQUIRED').length,
    };
  }, [auditLogs]);

  const approvalBreakdown = useMemo(() => {
    return {
      pending: approvals.filter((a) => a.status === 'pending').length,
      approved: approvals.filter((a) => a.status === 'approved').length,
      rejected: approvals.filter((a) => a.status === 'rejected').length,
    };
  }, [approvals]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.analytics.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.analytics.subtitle}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Info className="h-3.5 w-3.5 shrink-0 text-blue-500" aria-hidden="true" />
          <span>{t.analytics.sampleNotice}</span>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.kpiTotal}</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-slate-900 dark:text-white tabular-nums">
            {metrics.totalRequests}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.kpiApproved}</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
            {metrics.approvedActions}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.kpiBlocked}</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
            {metrics.blockedActions}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400">{t.dashboard.kpiPending}</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
            {metrics.pendingApprovals}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <section className="lg:col-span-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">
            {t.analytics.requestsOverTime}
          </h2>
          <DailyActivityChart
            data={dailyActivity}
            labels={{
              allow: t.common.allow,
              block: t.common.block,
              approval: t.common.humanApprovalRequired,
            }}
          />
        </section>

        <section className="lg:col-span-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">
            {t.analytics.approvalVsBlock}
          </h2>
          <DecisionDistributionChart
            allow={simCounts.allow}
            block={simCounts.block}
            approval={simCounts.approval}
            labels={{
              allow: t.common.allow,
              block: t.common.block,
              approval: t.common.humanApprovalRequired,
            }}
          />
        </section>

        <section className="lg:col-span-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">
            {t.analytics.topRulesTitle}
          </h2>
          <RuleFrequencyChart stats={ruleStats} t={t} />
        </section>

        <section className="lg:col-span-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white mb-4">
            {t.analytics.pendingRatio}
          </h2>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            <div className="flex items-center justify-between py-3">
              <dt className="text-slate-600 dark:text-slate-400">{t.common.pending}</dt>
              <dd className="font-mono font-semibold text-amber-600 dark:text-amber-400 tabular-nums">
                {approvalBreakdown.pending}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-slate-600 dark:text-slate-400">{t.common.approved}</dt>
              <dd className="font-mono font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {approvalBreakdown.approved}
              </dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-slate-600 dark:text-slate-400">{t.common.rejected}</dt>
              <dd className="font-mono font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                {approvalBreakdown.rejected}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
};
