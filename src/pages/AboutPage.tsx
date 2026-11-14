import React from 'react';
import { ArrowRight, Building2, UserCheck } from 'lucide-react';
import { NexusLogo } from '../components/NexusLogo';
import { useNexus } from '../state/NexusContext';

export const AboutPage: React.FC = () => {
  const { navigate, t } = useNexus();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.about.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.about.subtitle}
        </p>
      </div>

      {/* Company Overview */}
      <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-6 space-y-4">
        <div className="flex items-center gap-3">
          <NexusLogo size={32} />
          <div>
            <div className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {t.company.name} · {t.company.product}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              {t.tagline}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Building2 className="h-4 w-4 text-blue-500 shrink-0" aria-hidden="true" />
            <span>{t.about.visionLabel}</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
            {t.company.vision}
          </p>
        </div>
      </section>

      {/* Official Founder Profile */}
      <section
        aria-label={t.about.founderCardTitle}
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-6 sm:p-8 space-y-5"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <UserCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{t.about.founderCardTitle}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div
            aria-hidden="true"
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-600/15 font-display text-xl font-bold text-blue-600 dark:text-blue-300"
          >
            AW
          </div>
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {t.company.founderName}
            </h2>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {t.company.founderRole}
            </p>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {t.company.product} · {t.company.name}
            </p>
          </div>
        </div>

        <div className="space-y-3 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-300">
          <p>{t.company.founderBioParagraph1}</p>
          <p>{t.company.founderBioParagraph2}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('dashboard')}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <span>{t.about.openDashboardBtn}</span>
            <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => navigate('account')}
            className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span>{t.about.openAccountBtn}</span>
          </button>
        </div>
      </section>
    </div>
  );
};
