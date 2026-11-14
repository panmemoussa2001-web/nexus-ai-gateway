import {
  AuditLogEntry,
  DemoAgent,
  HumanApprovalRequest,
  RuleId,
} from '../types/nexus';

export interface DashboardMetrics {
  totalRequests: number;
  approvedActions: number;
  blockedActions: number;
  pendingApprovals: number;
  registeredAgents: number;
  activeAgents: number;
}

export interface DailyActivityPoint {
  dateKey: string;
  label: string;
  allow: number;
  block: number;
  approval: number;
  total: number;
}

export interface PolicyTriggerStat {
  ruleId: RuleId;
  count: number;
  percentage: number;
}

export function computeDashboardMetrics(
  auditLogs: AuditLogEntry[],
  approvals: HumanApprovalRequest[],
  agents: DemoAgent[]
): DashboardMetrics {
  const simulationEvents = auditLogs.filter((l) => l.eventType === 'simulation');
  const approvedFromSim = simulationEvents.filter((l) => l.decision === 'ALLOW').length;
  const approvedFromHuman = auditLogs.filter((l) => l.eventType === 'human_approval').length;
  const blockedFromSim = simulationEvents.filter((l) => l.decision === 'BLOCK').length;
  const rejectedFromHuman = auditLogs.filter((l) => l.eventType === 'human_rejection').length;

  return {
    totalRequests: simulationEvents.length,
    approvedActions: approvedFromSim + approvedFromHuman,
    blockedActions: blockedFromSim + rejectedFromHuman,
    pendingApprovals: approvals.filter((a) => a.status === 'pending').length,
    registeredAgents: agents.length,
    activeAgents: agents.filter((a) => a.status === 'enabled').length,
  };
}

export function computeDailyActivity(
  auditLogs: AuditLogEntry[],
  days = 7
): DailyActivityPoint[] {
  const simulationLogs = auditLogs.filter((l) => l.eventType === 'simulation');
  const grouped = new Map<string, { allow: number; block: number; approval: number }>();

  for (const log of simulationLogs) {
    const dateKey = log.timestamp.slice(0, 10);
    const bucket = grouped.get(dateKey) ?? { allow: 0, block: 0, approval: 0 };
    if (log.decision === 'ALLOW') bucket.allow += 1;
    else if (log.decision === 'BLOCK') bucket.block += 1;
    else bucket.approval += 1;
    grouped.set(dateKey, bucket);
  }

  const sortedKeys = Array.from(grouped.keys()).sort();
  const recentKeys = sortedKeys.slice(-days);

  return recentKeys.map((dateKey) => {
    const bucket = grouped.get(dateKey)!;
    const [, month, day] = dateKey.split('-');
    return {
      dateKey,
      label: `${month}/${day}`,
      allow: bucket.allow,
      block: bucket.block,
      approval: bucket.approval,
      total: bucket.allow + bucket.block + bucket.approval,
    };
  });
}

export function computeRuleTriggerStats(auditLogs: AuditLogEntry[]): PolicyTriggerStat[] {
  const simulationLogs = auditLogs.filter((l) => l.eventType === 'simulation');
  const rules: RuleId[] = ['RULE_1', 'RULE_2', 'RULE_3', 'RULE_4', 'RULE_5'];
  const counts = new Map<RuleId, number>();
  for (const r of rules) counts.set(r, 0);

  for (const log of simulationLogs) {
    counts.set(log.triggeredRule, (counts.get(log.triggeredRule) ?? 0) + 1);
  }

  const total = simulationLogs.length || 1;
  return rules
    .map((ruleId) => {
      const count = counts.get(ruleId) ?? 0;
      return {
        ruleId,
        count,
        percentage: Math.round((count / total) * 100),
      };
    })
    .sort((a, b) => b.count - a.count);
}
