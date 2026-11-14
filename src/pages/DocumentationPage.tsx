import React from 'react';
import { BookOpen, ShieldAlert } from 'lucide-react';
import { useNexus } from '../state/NexusContext';

export const DocumentationPage: React.FC = () => {
  const { t } = useNexus();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.docs.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.docs.subtitle}
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-xs sm:text-sm text-blue-900 dark:text-blue-200">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <span>{t.prototypeBanner}</span>
      </div>

      <div className="space-y-5">
        {t.docs.sections.map((section) => (
          <section
            key={section.title}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-3"
          >
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 shrink-0 text-blue-500" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {section.body}
            </p>
            {section.items && (
              <ul className="space-y-2 pt-1 text-sm text-slate-700 dark:text-slate-300 list-disc pl-5">
                {section.items.map((item) => (
                  <li key={item} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};
