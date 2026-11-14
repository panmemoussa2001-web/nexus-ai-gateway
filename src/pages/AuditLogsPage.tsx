import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Info, Search } from 'lucide-react';
import { DecisionBadge } from '../components/DecisionBadge';
import { useNexus } from '../state/NexusContext';
import { DecisionType } from '../types/nexus';

type DecisionFilter = 'ALL' | DecisionType;

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, settings, t } = useNexus();
  const [filter, setFilter] = useState<DecisionFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return auditLogs.filter((entry) => {
      if (filter !== 'ALL' && entry.decision !== filter) return false;
      if (!q) return true;
      return (
        entry.requestId.toLowerCase().includes(q) ||
        entry.agentName.toLowerCase().includes(q) ||
        entry.requestedAction.toLowerCase().includes(q) ||
        entry.ruleLabel.toLowerCase().includes(q)
      );
    });
  }, [auditLogs, filter, searchQuery]);

  const filterButtons: Array<{ value: DecisionFilter; label: string }> = [
    { value: 'ALL', label: t.common.all },
    { value: 'ALLOW', label: t.common.allow },
    { value: 'BLOCK', label: t.common.block },
    { value: 'HUMAN APPROVAL REQUIRED', label: t.common.humanApprovalRequired },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.audit.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.audit.subtitle}
        </p>
      </div>

      {/* Explicit Non-Tamper-Proof Disclosure */}
      <div className="flex items-start gap-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#0E1729] px-4 py-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
        <span>{t.audit.disclaimer}</span>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-1">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => setFilter(btn.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                filter === btn.value
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            aria-label={t.common.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.audit.searchPlaceholder}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1729] py-2 pl-9 pr-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
        {t.audit.showingCount}: {filteredLogs.length} / {auditLogs.length}
      </div>

      {/* Audit Table */}
      <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] overflow-hidden">
        {filteredLogs.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            {t.common.noResults}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1325] text-xs font-medium text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">{t.common.requestId}</th>
                  <th className="px-4 py-3">{t.common.agent}</th>
                  <th className="px-4 py-3">{t.common.action}</th>
                  <th className="px-4 py-3">{t.common.decision}</th>
                  <th className="px-4 py-3">{t.common.rule}</th>
                  <th className="px-4 py-3 text-right">{t.common.timestamp}</th>
                  <th className="px-4 py-3 text-right">
                    <span className="sr-only">{t.audit.detailsLabel}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredLogs.map((entry) => {
                  const isExpanded = expandedId === entry.id;
                  const explanation =
                    settings.language === 'fr' ? entry.explanationFr : entry.explanationEn;

                  return (
                    <React.Fragment key={entry.id}>
                      <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {entry.requestId}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                          {entry.agentName}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-[240px] truncate">
                          {entry.requestedAction}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <DecisionBadge decision={entry.decision} compact />
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {t.rules[entry.triggeredRule].title}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {entry.timestamp.slice(0, 16).replace('T', ' ')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                            aria-expanded={isExpanded}
                            aria-label={`${t.audit.detailsLabel} ${entry.requestId}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-slate-50/70 dark:bg-[#0B1325]/60">
                          <td colSpan={7} className="px-4 py-3 text-xs text-slate-600 dark:text-slate-300">
                            <div className="flex flex-wrap items-center gap-4">
                              <span>
                                <strong className="text-slate-900 dark:text-white">
                                  {t.common.category}:
                                </strong>{' '}
                                {t.categories[entry.category]}
                              </span>
                              {entry.amount > 0 && (
                                <span className="font-mono">
                                  <strong className="font-sans text-slate-900 dark:text-white">
                                    {t.common.amount}:
                                  </strong>{' '}
                                  ${entry.amount.toLocaleString('en-US')}
                                </span>
                              )}
                              <span>
                                <strong className="text-slate-900 dark:text-white">
                                  {t.audit.detailsLabel}:
                                </strong>{' '}
                                {explanation}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
