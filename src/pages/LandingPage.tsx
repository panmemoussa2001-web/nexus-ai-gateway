import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Info, ShieldCheck, UserCheck } from 'lucide-react';
import { NexusLogo } from '../components/NexusLogo';
import { useNexus } from '../state/NexusContext';

const HERO_IMAGE_PATH = '/src/assets/images/nexus_gateway_hero_1794580824725.jpg';

export const LandingPage: React.FC = () => {
  const { navigate, settings, user, t } = useNexus();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-[#070D1A] dark:text-slate-100">
      {/* Hero Section */}
      <section className="border-b border-slate-200 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="flex flex-col justify-center lg:col-span-6 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono tracking-wide text-blue-600 dark:text-blue-400">
                <NexusLogo size={22} />
                <span>{t.landing.eyebrow}</span>
                <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
                <span className="font-sans font-medium text-slate-600 dark:text-slate-300">
                  {t.company.foundedBy}
                </span>
              </div>

              <div className="space-y-3">
                <p className="font-display text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300">
                  {t.tagline}
                </p>
                <h1 className="font-display text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12] [text-wrap:balance]">
                  {t.landing.headline}
                </h1>
              </div>

              <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                {t.landing.intro}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('dashboard')}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap"
                >
                  <span>{t.landing.ctaPrimary}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('account')}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1729] px-5 py-3 text-sm font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                >
                  <span>{user ? user.fullName : t.landing.ctaAccount}</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('simulator')}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                >
                  <span>{t.landing.ctaSecondary}</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-full min-h-[260px] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-[#0B1325]">
                {!imgError ? (
                  <img
                    src={HERO_IMAGE_PATH}
                    alt="NEXUS AI GATEWAY deterministic routing architecture"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full min-h-[300px] flex-col items-center justify-center bg-gradient-to-br from-[#0B1325] via-[#0F1E3A] to-[#070D1A] p-8 text-center">
                    <ShieldCheck className="h-12 w-12 text-blue-400 mb-3" aria-hidden="true" />
                    <div className="font-display text-lg font-semibold text-white">
                      {settings.appName}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{t.tagline}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How NEXUS Works */}
      <section className="border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0A1120]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl [text-wrap:balance]">
              {t.landing.howTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.howSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.landing.steps.map((step) => (
              <div
                key={step.num}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0E1729] p-6 space-y-3"
              >
                <div className="font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {step.num}
                </div>
                <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="border-b border-slate-200 dark:border-slate-800/80">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-2 mb-10">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl [text-wrap:balance]">
              {t.landing.featuresTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              {t.landing.featuresSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {t.landing.features.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    0{index + 1} · {t.company.name}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {feature.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder & Company Leadership */}
      <section className="border-b border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0A1120]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E1729] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <UserCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t.landing.founderSectionTitle}</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t.company.founderShort}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {t.company.founderBioParagraph1}
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {t.company.founderBioParagraph2}
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => navigate('about')}
                className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#070D1A] px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
              >
                <span>{t.landing.founderProfileBtn}</span>
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Prototype Disclosure */}
      <section className="bg-slate-50 dark:bg-[#070D1A]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  <Info className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{t.landing.prototypeTitle}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {t.landing.prototypeBody}
                </p>
                <ul className="space-y-2 pt-2">
                  {t.landing.prototypeBullets.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => navigate('dashboard')}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors whitespace-nowrap"
                >
                  <span>{t.common.openDashboard}</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <NexusLogo size={18} />
            <span>{t.landing.footerMission}</span>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={() => navigate('about')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.about}
            </button>
            <button
              type="button"
              onClick={() => navigate('account')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.account}
            </button>
            <button
              type="button"
              onClick={() => navigate('documentation')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.documentation}
            </button>
            <button
              type="button"
              onClick={() => navigate('settings')}
              className="hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t.nav.settings}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
