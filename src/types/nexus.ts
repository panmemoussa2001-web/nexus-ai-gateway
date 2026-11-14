export type PageId =
  | 'landing'
  | 'dashboard'
  | 'agents'
  | 'policies'
  | 'simulator'
  | 'approvals'
  | 'audit'
  | 'analytics'
  | 'settings'
  | 'documentation'
  | 'about'
  | 'account';

export type WorkspaceMode = 'demo' | 'account';

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  createdAt: string;
}

export type Language = 'en' | 'fr';

export type ThemeMode = 'dark' | 'light';

export type DecisionType = 'ALLOW' | 'BLOCK' | 'HUMAN APPROVAL REQUIRED';

export type RuleId = 'RULE_1' | 'RULE_2' | 'RULE_3' | 'RULE_4' | 'RULE_5';

export type ActionCategory =
  | 'read_reporting'
  | 'system_monitoring'
  | 'external_communication'
  | 'financial_transaction'
  | 'data_deletion'
  | 'confidential_access'
  | 'unclassified';

export type AgentCategory =
  | 'Finance'
  | 'Operations'
  | 'Customer Support'
  | 'Security & Compliance'
  | 'Analytics';

export type AgentStatus = 'enabled' | 'disabled';

export type AgentPermissionOverride =
  | 'inherit'
  | 'require_approval'
  | 'read_only'
  | 'blocked';

export interface DemoAgent {
  id: string;
  name: string;
  purpose: string;
  category: AgentCategory;
  status: AgentStatus;
  createdAt: string;
}

export interface PolicyConfig {
  maxTransactionAmount: number;
  prohibitedCategories: ActionCategory[];
  approvalRequiredCategories: ActionCategory[];
  allowedCategories: ActionCategory[];
  agentPermissions: Record<string, AgentPermissionOverride>;
}

export interface SimulationInput {
  agentId: string;
  requestedAction: string;
  category: ActionCategory;
  amount: number;
  description: string;
}

export interface ValidationError {
  field: 'agentId' | 'requestedAction' | 'category' | 'amount' | 'description';
  code:
    | 'AGENT_REQUIRED'
    | 'ACTION_REQUIRED'
    | 'AMOUNT_INVALID'
    | 'DESCRIPTION_TOO_SHORT';
}

export interface EvaluationResult {
  requestId: string;
  decision: DecisionType;
  triggeredRule: RuleId;
  ruleLabel: string;
  explanationEn: string;
  explanationFr: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  requestedAction: string;
  category: ActionCategory;
  amount: number;
  description: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface HumanApprovalRequest {
  requestId: string;
  agentId: string;
  agentName: string;
  requestedAction: string;
  category: ActionCategory;
  amount: number;
  description: string;
  reasonEn: string;
  reasonFr: string;
  triggeredRule: RuleId;
  createdAt: string;
  status: ApprovalStatus;
  reviewedAt?: string;
}

export interface AuditLogEntry {
  id: string;
  requestId: string;
  agentId: string;
  agentName: string;
  requestedAction: string;
  category: ActionCategory;
  amount: number;
  decision: DecisionType;
  triggeredRule: RuleId;
  ruleLabel: string;
  explanationEn: string;
  explanationFr: string;
  timestamp: string;
  eventType: 'simulation' | 'human_approval' | 'human_rejection';
}

export interface AppSettings {
  appName: string;
  language: Language;
  theme: ThemeMode;
}
