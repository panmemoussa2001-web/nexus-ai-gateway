import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateAction,
  generateAgentId,
  validateSimulationInput,
} from './policyEngine';
import {
  computeDailyActivity,
  computeDashboardMetrics,
  computeRuleTriggerStats,
} from './analytics';
import {
  DEFAULT_POLICY,
  SEED_AGENTS,
  SEED_APPROVALS,
  SEED_AUDIT_LOGS,
} from '../data/seedData';

test('Rule 1 blocks prohibited categories deterministically', () => {
  const result = evaluateAction(
    {
      agentId: 'NX-AGT-001',
      requestedAction: 'Delete a restricted file',
      category: 'data_deletion',
      amount: 0,
      description: 'Remove archived financial ledger snapshot',
    },
    SEED_AGENTS,
    DEFAULT_POLICY,
    { requestId: 'NX-REQ-TEST1', timestamp: '2026-11-13T10:00:00.000Z' }
  );

  assert.equal(result.decision, 'BLOCK');
  assert.equal(result.triggeredRule, 'RULE_1');
  assert.equal(result.requestId, 'NX-REQ-TEST1');
});

test('Rule 1 blocks disabled agents regardless of allowed category', () => {
  const agents = SEED_AGENTS.map((a) =>
    a.id === 'NX-AGT-004' ? { ...a, status: 'disabled' as const } : a
  );
  const result = evaluateAction(
    {
      agentId: 'NX-AGT-004',
      requestedAction: 'Read an authorized report',
      category: 'read_reporting',
      amount: 0,
      description: 'Monthly compliance readout',
    },
    agents,
    DEFAULT_POLICY
  );

  assert.equal(result.decision, 'BLOCK');
  assert.equal(result.triggeredRule, 'RULE_1');
});

test('Rule 2 requires human approval for external communication and within-cap payments', () => {
  const emailResult = evaluateAction(
    {
      agentId: 'NX-AGT-002',
      requestedAction: 'Send a simulated email',
      category: 'external_communication',
      amount: 0,
      description: 'Send partner advisory notice',
    },
    SEED_AGENTS,
    DEFAULT_POLICY
  );
  assert.equal(emailResult.decision, 'HUMAN APPROVAL REQUIRED');
  assert.equal(emailResult.triggeredRule, 'RULE_2');

  const paymentResult = evaluateAction(
    {
      agentId: 'NX-AGT-001',
      requestedAction: 'Request a simulated payment',
      category: 'financial_transaction',
      amount: 1500,
      description: 'Invoice #904 payment simulation',
    },
    SEED_AGENTS,
    DEFAULT_POLICY
  );
  assert.equal(paymentResult.decision, 'HUMAN APPROVAL REQUIRED');
  assert.equal(paymentResult.triggeredRule, 'RULE_2');
});

test('Rule 3 blocks transactions exceeding maximum configured amount', () => {
  const result = evaluateAction(
    {
      agentId: 'NX-AGT-001',
      requestedAction: 'Request a simulated payment',
      category: 'financial_transaction',
      amount: 12000,
      description: 'Large simulated vendor disbursement',
    },
    SEED_AGENTS,
    DEFAULT_POLICY
  );

  assert.equal(result.decision, 'BLOCK');
  assert.equal(result.triggeredRule, 'RULE_3');
});

test('Rule 4 allows compliant actions in allowed categories', () => {
  const result = evaluateAction(
    {
      agentId: 'NX-AGT-001',
      requestedAction: 'Read an authorized report',
      category: 'read_reporting',
      amount: 0,
      description: 'Fetch quarterly summary report',
    },
    SEED_AGENTS,
    DEFAULT_POLICY
  );

  assert.equal(result.decision, 'ALLOW');
  assert.equal(result.triggeredRule, 'RULE_4');
});

test('Rule 5 triggers HUMAN APPROVAL REQUIRED for incomplete or unclassified requests', () => {
  const unclassifiedResult = evaluateAction(
    {
      agentId: 'NX-AGT-001',
      requestedAction: 'Execute unknown action',
      category: 'unclassified',
      amount: 0,
      description: 'Unmapped external call',
    },
    SEED_AGENTS,
    DEFAULT_POLICY
  );

  assert.equal(unclassifiedResult.decision, 'HUMAN APPROVAL REQUIRED');
  assert.equal(unclassifiedResult.triggeredRule, 'RULE_5');

  const zeroPaymentResult = evaluateAction(
    {
      agentId: 'NX-AGT-001',
      requestedAction: 'Request a simulated payment',
      category: 'financial_transaction',
      amount: 0,
      description: 'Missing payment amount test',
    },
    SEED_AGENTS,
    DEFAULT_POLICY
  );

  assert.equal(zeroPaymentResult.decision, 'HUMAN APPROVAL REQUIRED');
  assert.equal(zeroPaymentResult.triggeredRule, 'RULE_5');
});

test('validateSimulationInput catches missing fields and negative amounts', () => {
  const errors = validateSimulationInput({
    agentId: '',
    requestedAction: '',
    category: 'read_reporting',
    amount: -50,
    description: 'hi',
  });
  assert.equal(errors.length, 4);
});

test('generateAgentId creates sequential unique IDs', () => {
  const nextId = generateAgentId(SEED_AGENTS.map((a) => a.id));
  assert.equal(nextId, 'NX-AGT-005');
});

test('analytics helpers compute consistent totals and daily buckets', () => {
  const metrics = computeDashboardMetrics(SEED_AUDIT_LOGS, SEED_APPROVALS, SEED_AGENTS);
  assert.equal(metrics.registeredAgents, 4);
  assert.equal(metrics.pendingApprovals, 2);
  assert.equal(metrics.totalRequests, 11);

  const daily = computeDailyActivity(SEED_AUDIT_LOGS, 7);
  assert.ok(daily.length > 0);
  const sumDaily = daily.reduce((acc, d) => acc + d.total, 0);
  assert.equal(sumDaily, 11);

  const ruleStats = computeRuleTriggerStats(SEED_AUDIT_LOGS);
  assert.equal(ruleStats.length, 5);
});
