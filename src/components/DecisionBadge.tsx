import React from 'react';
import { CheckCircle2, ShieldAlert, Clock } from 'lucide-react';
import { DecisionType } from '../types/nexus';

interface DecisionBadgeProps {
  decision: DecisionType;
  compact?: boolean;
}

export const DecisionBadge: React.FC<DecisionBadgeProps> = ({ decision, compact = false }) => {
  if (decision === 'ALLOW') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 font-mono font-medium text-emerald-700 dark:text-emerald-300 whitespace-nowrap shrink-0 ${
          compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>ALLOW</span>
      </span>
    );
  }

  if (decision === 'BLOCK') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 font-mono font-medium text-rose-700 dark:text-rose-300 whitespace-nowrap shrink-0 ${
          compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <ShieldAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>BLOCK</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 font-mono font-medium text-amber-700 dark:text-amber-300 whitespace-nowrap shrink-0 ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{compact ? 'APPROVAL REQ.' : 'HUMAN APPROVAL REQUIRED'}</span>
    </span>
  );
};
