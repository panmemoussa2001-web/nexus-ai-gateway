import React, { useEffect, useState } from 'react';
import { Building2, Check, RotateCcw, Save, UserCheck } from 'lucide-react';
import { useNexus } from '../state/NexusContext';
import { Language, ThemeMode } from '../types/nexus';

export const SettingsPage: React.FC = () => {
  const { settings, policy, workspaceMode, updateSettings, updatePolicy, resetDemoData, navigate, t } =
    useNexus();

  const [appName, setAppName] = useState(settings.appName);
  const [language, setLanguage] = useState<Language>(settings.language);
  const [theme, setTheme] = useState<ThemeMode>(settings.theme);
  const [quickCeiling, setQuickCeiling] = useState(String(policy.maxTransactionAmount));
  const [savedFlag, setSavedFlag] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    setAppName(settings.appName);
    setLanguage(settings.language);
    setTheme(settings.theme);
    setQuickCeiling(String(policy.maxTransactionAmount));
  }, [workspaceMode, settings.appName, settings.language, settings.theme, policy.maxTransactionAmount]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = appName.trim() || 'NEXUS AI GATEWAY';
    const parsedCeiling = Number(quickCeiling);
    const validCeiling =
      !Number.isNaN(parsedCeiling) && parsedCeiling >= 0
        ? parsedCeiling
        : policy.maxTransactionAmount;

    updateSettings({ appName: cleanedName, language, theme });
    if (validCeiling !== policy.maxTransactionAmount) {
      updatePolicy({ ...policy, maxTransactionAmount: validCeiling });
    }
    setAppName(cleanedName);
    setQuickCeiling(String(validCeiling));
    setSavedFlag(true);
    setResetDone(false);
  };

  const handleLanguageImmediate = (nextLang: Language) => {
    setLanguage(nextLang);
    updateSettings({ language: nextLang });
    setSavedFlag(false);
  };

  const handleThemeImmediate = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
    updateSettings({ theme: nextTheme });
    setSavedFlag(false);
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetDemoData();
    setAppName('NEXUS AI GATEWAY');
    setLanguage('en');
    setTheme('dark');
    setQuickCeiling('5000');
    setConfirmReset(false);
    setResetDone(true);
    setSavedFlag(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.settings.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.settings.subtitle}
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-5"
      >
        <div>
          <label
            htmlFor="settings-app-name"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {t.settings.appNameLabel}
          </label>
          <input
            id="settings-app-name"
            type="text"
            value={appName}
            onChange={(e) => {
              setAppName(e.target.value);
              setSavedFlag(false);
            }}
            className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="settings-language"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t.settings.languageLabel}
            </label>
            <select
              id="settings-language"
              value={language}
              onChange={(e) => handleLanguageImmediate(e.target.value as Language)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="settings-theme"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t.settings.themeLabel}
            </label>
            <select
              id="settings-theme"
              value={theme}
              onChange={(e) => handleThemeImmediate(e.target.value as ThemeMode)}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="dark">{t.settings.themeDark}</option>
              <option value="light">{t.settings.themeLight}</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="settings-ceiling"
            className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
          >
            {t.settings.policyQuickLabel}
          </label>
          <input
            id="settings-ceiling"
            type="number"
            min="0"
            step="100"
            value={quickCeiling}
            onChange={(e) => {
              setQuickCeiling(e.target.value);
              setSavedFlag(false);
            }}
            className="w-full max-w-xs rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 font-mono text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-1">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <Save className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.settings.saveSettings}</span>
          </button>

          {savedFlag && (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>{t.common.saved}</span>
            </span>
          )}
        </div>
      </form>

      {/* Company & Official Founder Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
            <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t.settings.companySectionTitle}</span>
          </div>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            <div className="flex items-center justify-between py-2">
              <dt className="text-slate-500 dark:text-slate-400">{t.settings.companyNameLabel}</dt>
              <dd className="font-semibold text-slate-900 dark:text-white">{t.company.name}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-slate-500 dark:text-slate-400">{t.settings.productNameLabel}</dt>
              <dd className="font-semibold text-slate-900 dark:text-white">{t.company.product}</dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
              <UserCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.settings.founderSectionTitle}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('about')}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t.nav.about}
            </button>
          </div>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            <div className="flex items-center justify-between py-2">
              <dt className="text-slate-500 dark:text-slate-400">{t.settings.founderNameLabel}</dt>
              <dd className="font-semibold text-slate-900 dark:text-white">{t.company.founderName}</dd>
            </div>
            <div className="flex items-center justify-between py-2">
              <dt className="text-slate-500 dark:text-slate-400">{t.settings.founderPositionLabel}</dt>
              <dd className="font-medium text-slate-900 dark:text-white text-right">
                {t.company.founderRole}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Reset Demo Data */}
      <section className="rounded-lg border border-rose-500/30 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-3">
        <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
          {t.settings.resetSectionTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          {t.settings.resetSectionBody}
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleReset}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors ${
              confirmReset
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/20'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{confirmReset ? t.settings.resetConfirmBtn : t.settings.resetBtn}</span>
          </button>

          {confirmReset && (
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="rounded-md border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t.common.cancel}
            </button>
          )}

          {resetDone && (
            <span
              role="status"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>{t.settings.resetDone}</span>
            </span>
          )}
        </div>
      </section>
    </div>
  );
};
