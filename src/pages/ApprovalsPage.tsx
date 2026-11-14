import React from 'react';
import { CheckCircle2, Info, XCircle } from 'lucide-react';
import { useNexus } from '../state/NexusContext';

export const ApprovalsPage: React.FC = () => {
  const { approvals, approveRequest, rejectRequest, settings, t } = useNexus();

  const statusLabel = (status: 'pending' | 'approved' | 'rejected') => {
    if (status === 'pending') return t.common.pending;
    if (status === 'approved') return t.common.approved;
    return t.common.rejected;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.approvals.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.approvals.subtitle}
        </p>
      </div>

      {/* Prototype Warning */}
      <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
        <span>{t.approvals.disclaimer}</span>
      </div>

      {approvals.length === 0 ? (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-10 text-center space-y-2">
          <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
            {t.approvals.emptyTitle}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.approvals.emptyBody}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((req) => {
            const isPending = req.status === 'pending';
            const reason = settings.language === 'fr' ? req.reasonFr : req.reasonEn;

            return (
              <article
                key={req.requestId}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="space-y-2.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {req.requestId}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{req.createdAt.slice(0, 16).replace('T', ' ')}</span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={`font-semibold ${
                          req.status === 'pending'
                            ? 'text-amber-600 dark:text-amber-400'
                            : req.status === 'approved'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {statusLabel(req.status)}
                      </span>
                      {req.amount > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                            ${req.amount.toLocaleString('en-US')}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                        {req.requestedAction}
                      </h2>
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {t.common.agent}: <span className="font-medium">{req.agentName}</span> ({req.agentId})
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300">{req.description}</p>

                    <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1A] px-3.5 py-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {t.approvals.reasonLabel}:{' '}
                      </span>
                      <span>{reason}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => approveRequest(req.requestId)}
                          aria-label={`${t.approvals.approveBtn} ${req.requestId}`}
                          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors whitespace-nowrap min-h-[40px]"
                        >
                          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{t.approvals.approveBtn}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectRequest(req.requestId)}
                          aria-label={`${t.approvals.rejectBtn} ${req.requestId}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-rose-500/40 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-500/20 transition-colors whitespace-nowrap min-h-[40px]"
                        >
                          <XCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{t.approvals.rejectBtn}</span>
                        </button>
                      </>
                    ) : (
                      <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {t.approvals.reviewedAt}: {req.reviewedAt?.slice(0, 16).replace('T', ' ')}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
