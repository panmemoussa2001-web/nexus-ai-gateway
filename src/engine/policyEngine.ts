import {
  ActionCategory,
  DemoAgent,
  EvaluationResult,
  PolicyConfig,
  SimulationInput,
  ValidationError,
} from '../types/nexus';

export const ACTION_CATEGORY_LIST: ActionCategory[] = [
  'read_reporting',
  'system_monitoring',
  'external_communication',
  'financial_transaction',
  'data_deletion',
  'confidential_access',
  'unclassified',
];

export function generateRequestId(sequenceNumber?: number): string {
  if (typeof sequenceNumber === 'number') {
    return `NX-REQ-${String(sequenceNumber).padStart(5, '0')}`;
  }
  const randomPart = Math.floor(10000 + Math.random() * 90000);
  return `NX-REQ-${randomPart}`;
}

export function generateAgentId(existingIds: string[]): string {
  let index = existingIds.length + 1;
  let candidate = `NX-AGT-${String(index).padStart(3, '0')}`;
  while (existingIds.includes(candidate)) {
    index += 1;
    candidate = `NX-AGT-${String(index).padStart(3, '0')}`;
  }
  return candidate;
}

export function validateSimulationInput(
  input: SimulationInput,
  options: { allowIncompleteForSafetyTest?: boolean } = {}
): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!input.agentId || !input.agentId.trim()) {
    errors.push({ field: 'agentId', code: 'AGENT_REQUIRED' });
  }

  if (!options.allowIncompleteForSafetyTest && (!input.requestedAction || !input.requestedAction.trim())) {
    errors.push({ field: 'requestedAction', code: 'ACTION_REQUIRED' });
  }

  if (typeof input.amount !== 'number' || Number.isNaN(input.amount) || input.amount < 0) {
    errors.push({ field: 'amount', code: 'AMOUNT_INVALID' });
  }

  if (
    !options.allowIncompleteForSafetyTest &&
    (!input.description || input.description.trim().length < 5)
  ) {
    errors.push({ field: 'description', code: 'DESCRIPTION_TOO_SHORT' });
  }

  return errors;
}

export function evaluateAction(
  input: SimulationInput,
  agents: DemoAgent[],
  policy: PolicyConfig,
  options: { requestId?: string; timestamp?: string } = {}
): EvaluationResult {
  const requestId = options.requestId ?? generateRequestId();
  const timestamp = options.timestamp ?? new Date().toISOString();
  const agent = agents.find((a) => a.id === input.agentId);
  const agentName = agent ? agent.name : 'Unknown Agent';
  const requestedAction = input.requestedAction.trim() || 'Unspecified Action';
  const amount = Number.isFinite(input.amount) ? input.amount : NaN;
  const description = input.description.trim();

  // Rule 1: Explicit prohibitions (disabled agent, blocked agent override, read-only violation, prohibited category)
  if (agent && agent.status === 'disabled') {
    return {
      requestId,
      decision: 'BLOCK',
      triggeredRule: 'RULE_1',
      ruleLabel: 'Rule 1 — Explicit Prohibition (Disabled Agent)',
      explanationEn: `Agent "${agent.name}" (${agent.id}) is currently disabled in the registry and cannot execute any actions.`,
      explanationFr: `L'agent « ${agent.name} » (${agent.id}) est actuellement désactivé dans le registre et ne peut exécuter aucune action.`,
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount: Number.isNaN(amount) ? 0 : amount,
      description,
    };
  }

  const agentOverride = agent ? policy.agentPermissions[agent.id] ?? 'inherit' : 'inherit';

  if (agent && agentOverride === 'blocked') {
    return {
      requestId,
      decision: 'BLOCK',
      triggeredRule: 'RULE_1',
      ruleLabel: 'Rule 1 — Explicit Prohibition (Agent Policy)',
      explanationEn: `Agent "${agent.name}" is explicitly blocked by agent-specific security permissions.`,
      explanationFr: `L'agent « ${agent.name} » est explicitement bloqué par les permissions spécifiques à l'agent.`,
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount: Number.isNaN(amount) ? 0 : amount,
      description,
    };
  }

  if (policy.prohibitedCategories.includes(input.category)) {
    return {
      requestId,
      decision: 'BLOCK',
      triggeredRule: 'RULE_1',
      ruleLabel: 'Rule 1 — Explicit Prohibition',
      explanationEn: `Action category "${input.category}" is explicitly prohibited under active security policy.`,
      explanationFr: `La catégorie d'action « ${input.category} » est explicitement interdite par la politique de sécurité active.`,
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount: Number.isNaN(amount) ? 0 : amount,
      description,
    };
  }

  if (
    agent &&
    agentOverride === 'read_only' &&
    input.category !== 'read_reporting' &&
    input.category !== 'system_monitoring'
  ) {
    return {
      requestId,
      decision: 'BLOCK',
      triggeredRule: 'RULE_1',
      ruleLabel: 'Rule 1 — Explicit Prohibition (Read-Only Scope)',
      explanationEn: `Agent "${agent.name}" is restricted to read-only scope and cannot perform "${input.category}" actions.`,
      explanationFr: `L'agent « ${agent.name} » est restreint au mode lecture seule et ne peut pas exécuter d'actions de type « ${input.category} ».`,
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount: Number.isNaN(amount) ? 0 : amount,
      description,
    };
  }

  // Rule 5 (Completeness / Safe evaluation check before approving or processing thresholds)
  const isIncomplete =
    !agent ||
    !input.requestedAction.trim() ||
    !description ||
    description.length < 5 ||
    input.category === 'unclassified' ||
    Number.isNaN(amount) ||
    amount < 0 ||
    (input.category === 'financial_transaction' && amount <= 0);

  if (isIncomplete) {
    return {
      requestId,
      decision: 'HUMAN APPROVAL REQUIRED',
      triggeredRule: 'RULE_5',
      ruleLabel: 'Rule 5 — Incomplete or Unclassified Request',
      explanationEn:
        'Request payload is incomplete, unclassified, or missing a valid transaction amount and cannot be evaluated safely without human review.',
      explanationFr:
        'La requête est incomplète, non classifiée ou ne contient pas de montant valide et ne peut pas être évaluée de façon sûre sans validation humaine.',
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount: Number.isNaN(amount) ? 0 : amount,
      description,
    };
  }

  // Rule 3: Amount exceeds configured maximum -> BLOCK
  if (amount > policy.maxTransactionAmount) {
    return {
      requestId,
      decision: 'BLOCK',
      triggeredRule: 'RULE_3',
      ruleLabel: 'Rule 3 — Maximum Amount Exceeded',
      explanationEn: `Simulated amount ($${amount.toLocaleString('en-US')}) exceeds the configured policy maximum ($${policy.maxTransactionAmount.toLocaleString('en-US')}).`,
      explanationFr: `Le montant simulé (${amount.toLocaleString('fr-FR')} $) dépasse le plafond configuré (${policy.maxTransactionAmount.toLocaleString('fr-FR')} $).`,
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount,
      description,
    };
  }

  // Rule 2: Action or agent requires human authorization -> HUMAN APPROVAL REQUIRED
  if (
    policy.approvalRequiredCategories.includes(input.category) ||
    agentOverride === 'require_approval'
  ) {
    const reasonSource =
      agentOverride === 'require_approval'
        ? `agent "${agent.name}" is configured to require human authorization`
        : `category "${input.category}" requires human authorization`;
    const reasonSourceFr =
      agentOverride === 'require_approval'
        ? `l'agent « ${agent.name} » est configuré pour exiger une validation humaine`
        : `la catégorie « ${input.category} » exige une autorisation humaine`;

    return {
      requestId,
      decision: 'HUMAN APPROVAL REQUIRED',
      triggeredRule: 'RULE_2',
      ruleLabel: 'Rule 2 — Human Authorization Required',
      explanationEn: `Action paused because ${reasonSource} prior to execution.`,
      explanationFr: `Action mise en attente car ${reasonSourceFr} avant exécution.`,
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount,
      description,
    };
  }

  // Rule 4: Action is in allowed categories and complies with all policies -> ALLOW
  if (policy.allowedCategories.includes(input.category)) {
    return {
      requestId,
      decision: 'ALLOW',
      triggeredRule: 'RULE_4',
      ruleLabel: 'Rule 4 — Policy Compliant (Allow)',
      explanationEn: `Action complies with all deterministic policy rules for category "${input.category}" and authorized agent "${agent.name}".`,
      explanationFr: `L'action est conforme à toutes les règles déterministes pour la catégorie « ${input.category} » et l'agent autorisé « ${agent.name} ».`,
      timestamp,
      agentId: input.agentId,
      agentName,
      requestedAction,
      category: input.category,
      amount,
      description,
    };
  }

  // Rule 5 fallback: Category is not in allowed/prohibited/approval lists
  return {
    requestId,
    decision: 'HUMAN APPROVAL REQUIRED',
    triggeredRule: 'RULE_5',
    ruleLabel: 'Rule 5 — Unmapped Policy Scope',
    explanationEn: `Action category "${input.category}" is not covered by an explicit allow rule and requires human review.`,
    explanationFr: `La catégorie « ${input.category} » n'est couverte par aucune règle d'autorisation explicite et nécessite une revue humaine.`,
    timestamp,
    agentId: input.agentId,
    agentName,
    requestedAction,
    category: input.category,
    amount,
    description,
  };
}
