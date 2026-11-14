import React, { useState } from 'react';
import { Check, RotateCcw, Shield } from 'lucide-react';
import { useNexus } from '../state/NexusContext';
import { ActionCategory, AgentPermissionOverride, PolicyConfig, RuleId } from '../types/nexus';

const CONFIGURABLE_CATEGORIES: ActionCategory[] = [
  'read_reporting',
  'system_monitoring',
  'external_communication',
  'financial_transaction',
  'data_deletion',
  'confidential_access',
];

type CategoryMode = 'allow' | 'approval' | 'block' | 'unmapped';

function getCategoryMode(policy: PolicyConfig, cat: ActionCategory): CategoryMode {
  if (policy.prohibitedCategories.includes(cat)) return 'block';
  if (policy.approvalRequiredCategories.includes(cat)) return 'approval';
  if (policy.allowedCategories.includes(cat)) return 'allow';
  return 'unmapped';
}

export const PoliciesPage: React.FC = () => {
  const { agents, policy, updatePolicy, resetDefaultPolicy, t } = useNexus();
  const [draft, setDraft] = useState<PolicyConfig>(policy);
  const [amountInput, setAmountInput] = useState<string>(String(policy.maxTransactionAmount));
  const [amountError, setAmountError] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleCategoryModeChange = (cat: ActionCategory, mode: CategoryMode) => {
    setSavedBanner(false);
    setDraft((prev) => {
      const nextProhibited = prev.prohibitedCategories.filter((c) => c !== cat);
      const nextApproval = prev.approvalRequiredCategories.filter((c) => c !== cat);
      const nextAllowed = prev.allowedCategories.filter((c) => c !== cat);

      if (mode === 'block') nextProhibited.push(cat);
      else if (mode === 'approval') nextApproval.push(cat);
      else if (mode === 'allow') nextAllowed.push(cat);

      return {
        ...prev,
        prohibitedCategories: nextProhibited,
        approvalRequiredCategories: nextApproval,
        allowedCategories: nextAllowed,
      };
    });
  };

  const handleAgentOverrideChange = (agentId: string, override: AgentPermissionOverride) => {
    setSavedBanner(false);
    setDraft((prev) => ({
      ...prev,
      agentPermissions: {
        ...prev.agentPermissions,
        [agentId]: override,
      },
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amountInput);
    if (amountInput.trim() === '' || Number.isNaN(parsed) || parsed < 0) {
      setAmountError(t.policies.errAmount);
      return;
    }
    setAmountError(null);
    const updated: PolicyConfig = { ...draft, maxTransactionAmount: parsed };
    setDraft(updated);
    updatePolicy(updated);
    setSavedBanner(true);
  };

  const handleReset = () => {
    resetDefaultPolicy();
    setDraft({
      maxTransactionAmount: 5000,
      prohibitedCategories: ['data_deletion', 'confidential_access'],
      approvalRequiredCategories: ['external_communication', 'financial_transaction'],
      allowedCategories: ['read_reporting', 'system_monitoring'],
      agentPermissions: {
        'NX-AGT-001': 'inherit',
        'NX-AGT-002': 'inherit',
        'NX-AGT-003': 'require_approval',
        'NX-AGT-004': 'read_only',
      },
    });
    setAmountInput('5000');
    setAmountError(null);
    setSavedBanner(true);
  };

  const ruleOrder: RuleId[] = ['RULE_1', 'RULE_2', 'RULE_3', 'RULE_4', 'RULE_5'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t.policies.title}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.policies.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1729] px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{t.policies.resetPolicy}</span>
        </button>
      </div>

      <form onSubmit={handleSave} noValidate className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          {/* Max Simulated Amount */}
          <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-3">
            <label
              htmlFor="max-transaction-amount"
              className="block font-display text-base font-semibold text-slate-900 dark:text-white"
            >
              {t.policies.maxAmountLabel}
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.policies.maxAmountHelp}
            </p>
            <div className="max-w-xs">
              <input
                id="max-transaction-amount"
                type="number"
                min="0"
                step="100"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value);
                  setAmountError(null);
                  setSavedBanner(false);
                }}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 font-mono text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {amountError && (
                <p role="alert" className="mt-1.5 text-xs text-rose-600 dark:text-rose-400">
                  {amountError}
                </p>
              )}
            </div>
          </section>

          {/* Category Matrix */}
          <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.policies.categoryMatrixTitle}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t.policies.categoryMatrixHelp}
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {CONFIGURABLE_CATEGORIES.map((cat) => {
                const mode = getCategoryMode(draft, cat);
                return (
                  <div
                    key={cat}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {t.categories[cat]}
                      </div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {cat}
                      </div>
                    </div>

                    <select
                      aria-label={`Policy for ${t.categories[cat]}`}
                      value={mode}
                      onChange={(e) => handleCategoryModeChange(cat, e.target.value as CategoryMode)}
                      className="rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="allow">{t.policies.modeAllow}</option>
                      <option value="approval">{t.policies.modeApproval}</option>
                      <option value="block">{t.policies.modeBlock}</option>
                      <option value="unmapped">{t.policies.modeUnmapped}</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Agent-Specific Permissions */}
          <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-4">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.policies.agentOverridesTitle}
              </h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {t.policies.agentOverridesHelp}
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {agents.map((agent) => {
                const currentOverride = draft.agentPermissions[agent.id] ?? 'inherit';
                return (
                  <div
                    key={agent.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {agent.name}
                      </div>
                      <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {agent.id} · {agent.category}
                      </div>
                    </div>

                    <select
                      aria-label={`Override for ${agent.name}`}
                      value={currentOverride}
                      onChange={(e) =>
                        handleAgentOverrideChange(
                          agent.id,
                          e.target.value as AgentPermissionOverride
                        )
                      }
                      className="rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="inherit">{t.policies.overrideInherit}</option>
                      <option value="require_approval">{t.policies.overrideApproval}</option>
                      <option value="read_only">{t.policies.overrideReadOnly}</option>
                      <option value="blocked">{t.policies.overrideBlocked}</option>
                    </select>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.policies.savePolicy}</span>
            </button>
            {savedBanner && (
              <span
                role="status"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>{t.common.saved}</span>
              </span>
            )}
          </div>
        </div>

        {/* Fixed Evaluation Order Reference */}
        <aside className="lg:col-span-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 self-start space-y-4">
          <div>
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              {t.policies.evalOrderTitle}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t.policies.orderNotice}
            </p>
          </div>

          <div className="space-y-3">
            {ruleOrder.map((ruleId) => {
              const info = t.rules[ruleId];
              return (
                <div
                  key={ruleId}
                  className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070D1A] p-3.5 space-y-1"
                >
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {info.title}
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {info.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </aside>
      </form>
    </div>
  );
};
