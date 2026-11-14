import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, Play, ShieldCheck } from 'lucide-react';
import { DecisionBadge } from '../components/DecisionBadge';
import { ACTION_CATEGORY_LIST, validateSimulationInput } from '../engine/policyEngine';
import { useNexus } from '../state/NexusContext';
import { ActionCategory, EvaluationResult } from '../types/nexus';

interface DemoPreset {
  labelEn: string;
  labelFr: string;
  actionEn: string;
  actionFr: string;
  category: ActionCategory;
  amount: number;
  descriptionEn: string;
  descriptionFr: string;
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    labelEn: 'Read an authorized report',
    labelFr: 'Lire un rapport autorisé',
    actionEn: 'Read an authorized report',
    actionFr: 'Lire un rapport autorisé',
    category: 'read_reporting',
    amount: 0,
    descriptionEn: 'Retrieve monthly operational governance summary for internal review.',
    descriptionFr: 'Consulter le rapport mensuel de gouvernance opérationnelle interne.',
  },
  {
    labelEn: 'Send a simulated email',
    labelFr: 'Envoyer un e-mail simulé',
    actionEn: 'Send a simulated email',
    actionFr: 'Envoyer un e-mail simulé',
    category: 'external_communication',
    amount: 0,
    descriptionEn: 'Send simulated quarterly compliance briefing to partner contacts.',
    descriptionFr: 'Envoyer une note de conformité trimestrielle simulée aux partenaires.',
  },
  {
    labelEn: 'Request a simulated payment',
    labelFr: 'Demander un paiement simulé',
    actionEn: 'Request a simulated payment',
    actionFr: 'Demander un paiement simulé',
    category: 'financial_transaction',
    amount: 1850,
    descriptionEn: 'Simulated settlement transfer for approved software vendor invoice.',
    descriptionFr: 'Virement de règlement simulé pour une facture fournisseur approuvée.',
  },
  {
    labelEn: 'Delete a restricted file',
    labelFr: 'Supprimer un fichier restreint',
    actionEn: 'Delete a restricted file',
    actionFr: 'Supprimer un fichier restreint',
    category: 'data_deletion',
    amount: 0,
    descriptionEn: 'Attempt to delete restricted archive ledger in protected storage.',
    descriptionFr: 'Tentative de suppression d’un registre archivé dans un stockage protégé.',
  },
  {
    labelEn: 'Access confidential information',
    labelFr: 'Accéder à des informations confidentielles',
    actionEn: 'Access confidential information',
    actionFr: 'Accéder à des informations confidentielles',
    category: 'confidential_access',
    amount: 0,
    descriptionEn: 'Query confidential executive compensation records.',
    descriptionFr: 'Interroger des dossiers confidentiels de rémunération.',
  },
];

export const SimulatorPage: React.FC = () => {
  const { agents, simulateAction, settings, navigate, t } = useNexus();
  const isFr = settings.language === 'fr';

  const [agentId, setAgentId] = useState<string>(agents[0]?.id ?? '');
  const [requestedAction, setRequestedAction] = useState<string>(
    isFr ? DEMO_PRESETS[0].actionFr : DEMO_PRESETS[0].actionEn
  );
  const [category, setCategory] = useState<ActionCategory>('read_reporting');
  const [amountInput, setAmountInput] = useState<string>('0');
  const [description, setDescription] = useState<string>(
    isFr ? DEMO_PRESETS[0].descriptionFr : DEMO_PRESETS[0].descriptionEn
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);

  const applyPreset = (preset: DemoPreset) => {
    setRequestedAction(isFr ? preset.actionFr : preset.actionEn);
    setCategory(preset.category);
    setAmountInput(String(preset.amount));
    setDescription(isFr ? preset.descriptionFr : preset.descriptionEn);
    setErrors({});
  };

  const handleCheckAction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = amountInput.trim() === '' ? NaN : Number(amountInput);

    const validationErrors = validateSimulationInput({
      agentId,
      requestedAction,
      category,
      amount: parsedAmount,
      description,
    });

    if (validationErrors.length > 0) {
      const mapped: Record<string, string> = {};
      for (const err of validationErrors) {
        if (err.code === 'AGENT_REQUIRED') mapped.agentId = t.simulator.errAgent;
        if (err.code === 'ACTION_REQUIRED') mapped.requestedAction = t.simulator.errAction;
        if (err.code === 'AMOUNT_INVALID') mapped.amount = t.simulator.errAmount;
        if (err.code === 'DESCRIPTION_TOO_SHORT') mapped.description = t.simulator.errDescription;
      }
      setErrors(mapped);
      return;
    }

    setErrors({});
    const evaluation = simulateAction({
      agentId,
      requestedAction,
      category,
      amount: parsedAmount,
      description,
    });
    setResult(evaluation);
  };

  const handleTestIncomplete = () => {
    const selectedId = agentId || agents[0]?.id || '';
    if (!selectedId) {
      setErrors({ agentId: t.simulator.errAgent });
      return;
    }
    const actionText = isFr
      ? 'Exécuter un webhook externe non classifié'
      : 'Execute unclassified external webhook';
    const descText = isFr ? 'Requête de test non classifiée' : 'Unclassified test payload';

    setErrors({});
    setCategory('unclassified');
    setRequestedAction(actionText);
    setDescription(descText);
    setAmountInput('0');

    const evaluation = simulateAction({
      agentId: selectedId,
      requestedAction: actionText,
      category: 'unclassified',
      amount: 0,
      description: descText,
    });
    setResult(evaluation);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.simulator.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.simulator.subtitle}
        </p>
      </div>

      {/* Simulation Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-xs sm:text-sm text-blue-900 dark:text-blue-200">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
        <span>{t.simulator.disclaimer}</span>
      </div>

      {/* Quick Demo Presets */}
      <section className="space-y-2">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t.simulator.presetsTitle}
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset) => {
            const presetLabel = isFr ? preset.labelFr : preset.labelEn;
            const presetAction = isFr ? preset.actionFr : preset.actionEn;
            return (
              <button
                key={preset.labelEn}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  requestedAction === presetAction && category === preset.category
                    ? 'border-blue-500 bg-blue-600/15 text-blue-700 dark:text-blue-300'
                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0E1729] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {presetLabel}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Input Form */}
        <form
          onSubmit={handleCheckAction}
          noValidate
          className="lg:col-span-7 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="sim-agent"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.simulator.agentLabel}
              </label>
              <select
                id="sim-agent"
                value={agentId}
                onChange={(e) => {
                  setAgentId(e.target.value);
                  setErrors((prev) => ({ ...prev, agentId: '' }));
                }}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">{t.simulator.selectAgent}</option>
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.status === 'enabled' ? t.common.enabled : t.common.disabled})
                  </option>
                ))}
              </select>
              {errors.agentId && (
                <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.agentId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sim-category"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.simulator.categoryLabel}
              </label>
              <select
                id="sim-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as ActionCategory)}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ACTION_CATEGORY_LIST.map((cat) => (
                  <option key={cat} value={cat}>
                    {t.categories[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label
                htmlFor="sim-action"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.simulator.actionLabel}
              </label>
              <input
                id="sim-action"
                type="text"
                value={requestedAction}
                onChange={(e) => {
                  setRequestedAction(e.target.value);
                  setErrors((prev) => ({ ...prev, requestedAction: '' }));
                }}
                placeholder={t.simulator.actionPlaceholder}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.requestedAction && (
                <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.requestedAction}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="sim-amount"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.simulator.amountLabel}
              </label>
              <input
                id="sim-amount"
                type="number"
                min="0"
                step="1"
                value={amountInput}
                onChange={(e) => {
                  setAmountInput(e.target.value);
                  setErrors((prev) => ({ ...prev, amount: '' }));
                }}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 font-mono text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.amount && (
                <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="sim-description"
              className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              {t.simulator.descriptionLabel}
            </label>
            <textarea
              id="sim-description"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors((prev) => ({ ...prev, description: '' }));
              }}
              placeholder={t.simulator.descriptionPlaceholder}
              className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.description && (
              <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                {errors.description}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 whitespace-nowrap"
            >
              <Play className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.simulator.checkActionBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleTestIncomplete}
              className="inline-flex items-center gap-2 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3.5 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" aria-hidden="true" />
              <span>{t.simulator.testIncompleteBtn}</span>
            </button>
          </div>
        </form>

        {/* Evaluation Output */}
        <section
          aria-live="polite"
          className="lg:col-span-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              {t.simulator.resultTitle}
            </h2>

            {!result ? (
              <div className="rounded-md border border-dashed border-slate-300 dark:border-slate-700 p-6 text-sm text-slate-500 dark:text-slate-400">
                {t.simulator.emptyResult}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <DecisionBadge decision={result.decision} />
                  <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                    {result.requestId}
                  </span>
                </div>

                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t.simulator.triggeredRuleLabel}
                    </dt>
                    <dd className="mt-1 font-medium text-blue-600 dark:text-blue-400">
                      {t.rules[result.triggeredRule].title}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {t.simulator.explanationLabel}
                    </dt>
                    <dd className="mt-1 text-slate-700 dark:text-slate-200 leading-relaxed">
                      {settings.language === 'fr' ? result.explanationFr : result.explanationEn}
                    </dd>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">{t.common.agent}</dt>
                      <dd className="mt-0.5 font-medium text-slate-900 dark:text-white truncate">
                        {result.agentName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500 dark:text-slate-400">{t.common.timestamp}</dt>
                      <dd className="mt-0.5 font-mono text-slate-700 dark:text-slate-300">
                        {result.timestamp.slice(0, 19).replace('T', ' ')}
                      </dd>
                    </div>
                  </div>
                </dl>

                {result.decision === 'HUMAN APPROVAL REQUIRED' && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => navigate('approvals')}
                      className="inline-flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
                    >
                      <span>{t.simulator.goToApprovals}</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
