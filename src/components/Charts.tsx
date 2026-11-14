import React, { useState } from 'react';
import { DailyActivityPoint, PolicyTriggerStat } from '../engine/analytics';
import { TranslationPack } from '../i18n/translations';

export const DailyActivityChart: React.FC<{
  data: DailyActivityPoint[];
  labels: { allow: string; block: string; approval: string };
}> = ({ data, labels }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxVal = Math.max(1, ...data.map((d) => d.total));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 dark:text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden="true" />
          <span>{labels.allow}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-amber-500" aria-hidden="true" />
          <span>{labels.approval}</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" aria-hidden="true" />
          <span>{labels.block}</span>
        </span>
      </div>

      <div className="relative flex h-52 items-end gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-2 pt-6">
        {data.map((point, idx) => {
          const allowH = Math.round((point.allow / maxVal) * 148);
          const approvalH = Math.round((point.approval / maxVal) * 148);
          const blockH = Math.round((point.block / maxVal) * 148);
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={point.dateKey}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex flex-1 flex-col items-center justify-end h-full"
            >
              {isHovered && (
                <div className="absolute -top-2 z-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-[11px] shadow-md whitespace-nowrap pointer-events-none">
                  <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                    {point.dateKey} · {point.total}
                  </div>
                  <div className="font-mono text-slate-600 dark:text-slate-400">
                    A:{point.allow} / H:{point.approval} / B:{point.block}
                  </div>
                </div>
              )}
              <div className="flex w-full max-w-[42px] flex-col-reverse overflow-hidden rounded-t-sm bg-slate-100 dark:bg-slate-800/40">
                {point.allow > 0 && (
                  <div
                    style={{ height: `${Math.max(4, allowH)}px` }}
                    className="w-full bg-emerald-500 transition-opacity group-hover:opacity-90"
                  />
                )}
                {point.approval > 0 && (
                  <div
                    style={{ height: `${Math.max(4, approvalH)}px` }}
                    className="w-full bg-amber-500 transition-opacity group-hover:opacity-90"
                  />
                )}
                {point.block > 0 && (
                  <div
                    style={{ height: `${Math.max(4, blockH)}px` }}
                    className="w-full bg-rose-500 transition-opacity group-hover:opacity-90"
                  />
                )}
              </div>
              <span className="mt-2 font-mono text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const DecisionDistributionChart: React.FC<{
  allow: number;
  block: number;
  approval: number;
  labels: { allow: string; block: string; approval: string };
}> = ({ allow, block, approval, labels }) => {
  const total = Math.max(1, allow + block + approval);
  const items = [
    { label: labels.allow, count: allow, pct: Math.round((allow / total) * 100), color: 'bg-emerald-500' },
    { label: labels.approval, count: approval, pct: Math.round((approval / total) * 100), color: 'bg-amber-500' },
    { label: labels.block, count: block, pct: Math.round((block / total) * 100), color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex h-3 w-full overflow-hidden rounded-sm bg-slate-200 dark:bg-slate-800">
        {items.map((item) =>
          item.count > 0 ? (
            <div
              key={item.label}
              style={{ width: `${(item.count / total) * 100}%` }}
              className={`${item.color} transition-all duration-200`}
            />
          ) : null
        )}
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between py-2.5 text-sm">
            <div className="flex items-center gap-2.5">
              <span className={`h-2.5 w-2.5 rounded-sm ${item.color}`} aria-hidden="true" />
              <span className="text-slate-700 dark:text-slate-200">{item.label}</span>
            </div>
            <div className="flex items-center gap-3 font-mono tabular-nums">
              <span className="font-semibold text-slate-900 dark:text-white">{item.count}</span>
              <span className="w-10 text-right text-xs text-slate-500 dark:text-slate-400">
                {item.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const RuleFrequencyChart: React.FC<{
  stats: PolicyTriggerStat[];
  t: TranslationPack;
}> = ({ stats, t }) => {
  const maxCount = Math.max(1, ...stats.map((s) => s.count));

  return (
    <div className="space-y-3.5">
      {stats.map((stat) => {
        const ruleInfo = t.rules[stat.ruleId];
        const widthPct = Math.round((stat.count / maxCount) * 100);
        return (
          <div key={stat.ruleId} className="space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {ruleInfo.title}
              </span>
              <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                {stat.count} ({stat.percentage}%)
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-sm bg-slate-200 dark:bg-slate-800">
              <div
                style={{ width: `${widthPct}%` }}
                className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
