import React, { useState } from 'react';
import { Activity, Bot, Plus, Power, X } from 'lucide-react';
import { DecisionBadge } from '../components/DecisionBadge';
import { useNexus } from '../state/NexusContext';
import { AgentCategory, DemoAgent } from '../types/nexus';

const AGENT_CATEGORIES: AgentCategory[] = [
  'Finance',
  'Operations',
  'Customer Support',
  'Security & Compliance',
  'Analytics',
];

export const AgentsPage: React.FC = () => {
  const { agents, auditLogs, registerAgent, toggleAgentStatus, t } = useNexus();

  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState<AgentCategory>('Operations');
  const [errors, setErrors] = useState<{ name?: string; purpose?: string }>({});
  const [selectedAgent, setSelectedAgent] = useState<DemoAgent | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { name?: string; purpose?: string } = {};
    if (name.trim().length < 3) {
      nextErrors.name = t.agents.errName;
    }
    if (purpose.trim().length < 10) {
      nextErrors.purpose = t.agents.errPurpose;
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    registerAgent({ name, purpose, category });
    setName('');
    setPurpose('');
    setErrors({});
  };

  const agentLogs = selectedAgent
    ? auditLogs.filter((log) => log.agentId === selectedAgent.id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {t.agents.title}
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {t.agents.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Registration Form */}
        <section className="lg:col-span-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5 sm:p-6 self-start">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              {t.agents.registerTitle}
            </h2>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label
                htmlFor="agent-name"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.agents.nameLabel}
              </label>
              <input
                id="agent-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                placeholder={t.agents.namePlaceholder}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.name && (
                <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="agent-category"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.agents.categoryLabel}
              </label>
              <select
                id="agent-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as AgentCategory)}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {AGENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="agent-purpose"
                className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5"
              >
                {t.agents.purposeLabel}
              </label>
              <textarea
                id="agent-purpose"
                rows={3}
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  if (errors.purpose) setErrors((prev) => ({ ...prev, purpose: undefined }));
                }}
                placeholder={t.agents.purposePlaceholder}
                className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.purpose && (
                <p role="alert" className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                  {errors.purpose}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{t.agents.registerBtn}</span>
            </button>
          </form>
        </section>

        {/* Registered Agents Registry */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-white">
              {t.agents.registryTitle} ({agents.length})
            </h2>
          </div>

          <div className="space-y-3">
            {agents.map((agent) => {
              const isEnabled = agent.status === 'enabled';
              const actionCount = auditLogs.filter(
                (l) => l.agentId === agent.id && l.eventType === 'simulation'
              ).length;

              return (
                <div
                  key={agent.id}
                  className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E1729] p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-mono font-medium text-blue-600 dark:text-blue-400">
                          {agent.id}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{agent.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {t.agents.created}: {agent.createdAt.slice(0, 10)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`font-medium ${
                            isEnabled
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {isEnabled ? t.common.enabled : t.common.disabled}
                        </span>
                      </div>
                      <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                        {agent.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {agent.purpose}
                      </p>
                    </div>

                    <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleAgentStatus(agent.id)}
                        aria-label={`${isEnabled ? t.agents.toggleDisable : t.agents.toggleEnable} ${agent.name}`}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap min-h-[38px] ${
                          isEnabled
                            ? 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                      >
                        <Power className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{isEnabled ? t.agents.toggleDisable : t.agents.toggleEnable}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedAgent(agent)}
                        aria-label={`${t.agents.viewActivity} ${agent.name}`}
                        className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#070D1A] px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap min-h-[38px]"
                      >
                        <Activity className="h-3.5 w-3.5 shrink-0 text-blue-500" aria-hidden="true" />
                        <span>
                          {t.agents.viewActivity} ({actionCount})
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Agent Activity Drawer / Panel */}
      {selectedAgent && (
        <section
          aria-label={`${t.agents.activityFor} ${selectedAgent.name}`}
          className="rounded-lg border border-blue-500/40 bg-white dark:bg-[#0E1729] p-5 sm:p-6 space-y-4"
        >
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <div className="font-mono text-xs text-blue-600 dark:text-blue-400">
                {selectedAgent.id}
              </div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-white">
                {t.agents.activityFor} {selectedAgent.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setSelectedAgent(null)}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t.agents.closePanel}</span>
            </button>
          </div>

          {agentLogs.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t.agents.noActivityForAgent}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2 pr-4">{t.common.requestId}</th>
                    <th className="py-2 pr-4">{t.common.action}</th>
                    <th className="py-2 pr-4">{t.common.decision}</th>
                    <th className="py-2 pr-4">{t.common.rule}</th>
                    <th className="py-2 text-right">{t.common.timestamp}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {agentLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="py-2.5 pr-4 font-mono text-xs whitespace-nowrap">
                        {log.requestId}
                      </td>
                      <td className="py-2.5 pr-4">{log.requestedAction}</td>
                      <td className="py-2.5 pr-4 whitespace-nowrap">
                        <DecisionBadge decision={log.decision} compact />
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-slate-500 dark:text-slate-400">
                        {log.ruleLabel}
                      </td>
                      <td className="py-2.5 text-right font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {log.timestamp.slice(0, 16).replace('T', ' ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
