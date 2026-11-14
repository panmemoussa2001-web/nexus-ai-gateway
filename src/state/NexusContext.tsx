import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_POLICY,
  DEFAULT_SETTINGS,
  SEED_AGENTS,
  SEED_APPROVALS,
  SEED_AUDIT_LOGS,
} from '../data/seedData';
import { evaluateAction, generateAgentId, generateRequestId } from '../engine/policyEngine';
import { TRANSLATIONS, TranslationPack } from '../i18n/translations';
import {
  AgentCategory,
  AppSettings,
  AuditLogEntry,
  AuthUser,
  DemoAgent,
  EvaluationResult,
  HumanApprovalRequest,
  PageId,
  PolicyConfig,
  SimulationInput,
  WorkspaceMode,
} from '../types/nexus';

const DEMO_STORAGE_KEY = 'nexus_ai_gateway_demo_v1';

interface PersistedWorkspace {
  agents: DemoAgent[];
  policy: PolicyConfig;
  approvals: HumanApprovalRequest[];
  auditLogs: AuditLogEntry[];
  settings: AppSettings;
}

function loadDemoState(): PersistedWorkspace {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedWorkspace>;
      if (
        Array.isArray(parsed.agents) &&
        parsed.policy &&
        Array.isArray(parsed.approvals) &&
        Array.isArray(parsed.auditLogs) &&
        parsed.settings
      ) {
        return {
          agents: parsed.agents,
          policy: parsed.policy,
          approvals: parsed.approvals,
          auditLogs: parsed.auditLogs,
          settings: parsed.settings,
        };
      }
    }
  } catch {
    // Fall back to deterministic seed state
  }
  return {
    agents: SEED_AGENTS,
    policy: DEFAULT_POLICY,
    approvals: SEED_APPROVALS,
    auditLogs: SEED_AUDIT_LOGS,
    settings: DEFAULT_SETTINGS,
  };
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface NexusContextValue {
  currentPage: PageId;
  navigate: (page: PageId) => void;
  user: AuthUser | null;
  authReady: boolean;
  workspaceMode: WorkspaceMode;
  switchMode: (mode: WorkspaceMode) => void;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (input: {
    fullName: string;
    email: string;
    organization?: string;
    password: string;
  }) => Promise<AuthResult>;
  logout: () => Promise<void>;
  loadStarterTemplatesInAccount: () => void;
  agents: DemoAgent[];
  policy: PolicyConfig;
  approvals: HumanApprovalRequest[];
  auditLogs: AuditLogEntry[];
  settings: AppSettings;
  t: TranslationPack;
  registerAgent: (input: { name: string; purpose: string; category: AgentCategory }) => DemoAgent;
  toggleAgentStatus: (agentId: string) => void;
  updatePolicy: (nextPolicy: PolicyConfig) => void;
  resetDefaultPolicy: () => void;
  simulateAction: (input: SimulationInput) => EvaluationResult;
  approveRequest: (requestId: string) => void;
  rejectRequest: (requestId: string) => void;
  updateSettings: (nextSettings: Partial<AppSettings>) => void;
  resetDemoData: () => void;
}

const NexusContext = createContext<NexusContextValue | null>(null);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialDemo = useMemo(() => loadDemoState(), []);

  const [demoState, setDemoState] = useState<PersistedWorkspace>(initialDemo);
  const [accountState, setAccountState] = useState<PersistedWorkspace | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<WorkspaceMode>('demo');

  const skipNextAccountSyncRef = useRef(false);

  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'dashboard';
      }
      const pageParam = params.get('page') as PageId | null;
      const validPages: PageId[] = [
        'landing',
        'dashboard',
        'agents',
        'policies',
        'simulator',
        'approvals',
        'audit',
        'analytics',
        'settings',
        'documentation',
        'about',
        'account',
      ];
      if (pageParam && validPages.includes(pageParam)) {
        return pageParam;
      }
    }
    return 'landing';
  });

  const fetchAccountWorkspace = useCallback(async () => {
    const wsRes = await fetch('/api/workspace', { credentials: 'include' });
    if (wsRes.ok) {
      const data = (await wsRes.json()) as { workspace?: PersistedWorkspace };
      if (data.workspace) {
        skipNextAccountSyncRef.current = true;
        setAccountState({
          agents: data.workspace.agents ?? [],
          policy: data.workspace.policy ?? DEFAULT_POLICY,
          approvals: data.workspace.approvals ?? [],
          auditLogs: data.workspace.auditLogs ?? [],
          settings: data.workspace.settings ?? DEFAULT_SETTINGS,
        });
      }
    }
  }, []);

  // Bootstrap authentication state on load
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = (await res.json()) as { user: AuthUser | null };
          if (active && data.user) {
            setUser(data.user);
            await fetchAccountWorkspace();
            if (active) setWorkspaceMode('account');
          }
        }
      } catch {
        // Fallback silently to Demo Mode when offline
      } finally {
        if (active) setAuthReady(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchAccountWorkspace]);

  // Persist Demo Mode changes to browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoState));
    } catch {
      // Ignore storage errors
    }
  }, [demoState]);

  // Persist Personal Account workspace changes to backend API
  useEffect(() => {
    if (!user || workspaceMode !== 'account' || !accountState) return;
    if (skipNextAccountSyncRef.current) {
      skipNextAccountSyncRef.current = false;
      return;
    }

    fetch('/api/workspace', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      keepalive: true,
      body: JSON.stringify(accountState),
    }).catch(() => {
      // Keep UI responsive if transient network error
    });
  }, [accountState, user, workspaceMode]);

  const activeWorkspace: PersistedWorkspace =
    workspaceMode === 'account' && user && accountState ? accountState : demoState;

  const setActiveWorkspace = useCallback(
    (updater: (prev: PersistedWorkspace) => PersistedWorkspace) => {
      if (workspaceMode === 'account' && user) {
        setAccountState((prev) => updater(prev ?? {
          agents: [],
          policy: DEFAULT_POLICY,
          approvals: [],
          auditLogs: [],
          settings: DEFAULT_SETTINGS,
        }));
      } else {
        setDemoState((prev) => updater(prev));
      }
    },
    [workspaceMode, user]
  );

  // Sync theme, html lang, and document title
  useEffect(() => {
    const root = document.documentElement;
    if (activeWorkspace.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.lang = activeWorkspace.settings.language;
    document.title = `${activeWorkspace.settings.appName} — ${
      TRANSLATIONS[activeWorkspace.settings.language].tagline
    }`;
  }, [
    activeWorkspace.settings.theme,
    activeWorkspace.settings.language,
    activeWorkspace.settings.appName,
  ]);

  const navigate = (page: PageId) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      const nextUrl = page === 'landing' ? '/' : `?page=${encodeURIComponent(page)}`;
      window.history.replaceState(null, '', nextUrl);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const switchMode = (mode: WorkspaceMode) => {
    if (mode === 'account' && !user) {
      navigate('account');
      return;
    }
    setWorkspaceMode(mode);
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { user?: AuthUser; error?: string };
      if (!res.ok || !data.user) {
        return { ok: false, error: data.error || 'Authentication failed.' };
      }
      setUser(data.user);
      await fetchAccountWorkspace();
      setWorkspaceMode('account');
      return { ok: true };
    } catch {
      return { ok: false, error: 'Unable to reach authentication server.' };
    }
  };

  const register = async (input: {
    fullName: string;
    email: string;
    organization?: string;
    password: string;
  }): Promise<AuthResult> => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(input),
      });
      const data = (await res.json()) as { user?: AuthUser; error?: string };
      if (!res.ok || !data.user) {
        return { ok: false, error: data.error || 'Registration failed.' };
      }
      setUser(data.user);
      await fetchAccountWorkspace();
      setWorkspaceMode('account');
      return { ok: true };
    } catch {
      return { ok: false, error: 'Unable to reach registration server.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore
    }
    setUser(null);
    setAccountState(null);
    setWorkspaceMode('demo');
  };

  const loadStarterTemplatesInAccount = () => {
    if (workspaceMode !== 'account' || !user) return;
    setActiveWorkspace((prev) => ({
      ...prev,
      agents: SEED_AGENTS,
      policy: DEFAULT_POLICY,
      approvals: SEED_APPROVALS,
      auditLogs: SEED_AUDIT_LOGS,
    }));
  };

  const registerAgent = (input: {
    name: string;
    purpose: string;
    category: AgentCategory;
  }): DemoAgent => {
    const newAgent: DemoAgent = {
      id: generateAgentId(activeWorkspace.agents.map((a) => a.id)),
      name: input.name.trim(),
      purpose: input.purpose.trim(),
      category: input.category,
      status: 'enabled',
      createdAt: new Date().toISOString(),
    };
    setActiveWorkspace((prev) => ({
      ...prev,
      agents: [newAgent, ...prev.agents],
      policy: {
        ...prev.policy,
        agentPermissions: {
          ...prev.policy.agentPermissions,
          [newAgent.id]: 'inherit',
        },
      },
    }));
    return newAgent;
  };

  const toggleAgentStatus = (agentId: string) => {
    setActiveWorkspace((prev) => ({
      ...prev,
      agents: prev.agents.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'enabled' ? 'disabled' : 'enabled' }
          : a
      ),
    }));
  };

  const updatePolicy = (nextPolicy: PolicyConfig) => {
    setActiveWorkspace((prev) => ({ ...prev, policy: nextPolicy }));
  };

  const resetDefaultPolicy = () => {
    setActiveWorkspace((prev) => ({ ...prev, policy: DEFAULT_POLICY }));
  };

  const simulateAction = (input: SimulationInput): EvaluationResult => {
    const existingSeq = 10422 + activeWorkspace.auditLogs.length;
    const requestId = generateRequestId(existingSeq);
    const result = evaluateAction(input, activeWorkspace.agents, activeWorkspace.policy, {
      requestId,
      timestamp: new Date().toISOString(),
    });

    const newLog: AuditLogEntry = {
      id: `AUD-${String(activeWorkspace.auditLogs.length + 1).padStart(4, '0')}`,
      requestId: result.requestId,
      agentId: result.agentId,
      agentName: result.agentName,
      requestedAction: result.requestedAction,
      category: result.category,
      amount: result.amount,
      decision: result.decision,
      triggeredRule: result.triggeredRule,
      ruleLabel: result.ruleLabel,
      explanationEn: result.explanationEn,
      explanationFr: result.explanationFr,
      timestamp: result.timestamp,
      eventType: 'simulation',
    };

    setActiveWorkspace((prev) => {
      const nextApprovals =
        result.decision === 'HUMAN APPROVAL REQUIRED'
          ? [
              {
                requestId: result.requestId,
                agentId: result.agentId,
                agentName: result.agentName,
                requestedAction: result.requestedAction,
                category: result.category,
                amount: result.amount,
                description: result.description || 'Incomplete payload submitted for review.',
                reasonEn: result.explanationEn,
                reasonFr: result.explanationFr,
                triggeredRule: result.triggeredRule,
                createdAt: result.timestamp,
                status: 'pending' as const,
              },
              ...prev.approvals,
            ]
          : prev.approvals;

      return {
        ...prev,
        auditLogs: [newLog, ...prev.auditLogs],
        approvals: nextApprovals,
      };
    });

    return result;
  };

  const approveRequest = (requestId: string) => {
    const target = activeWorkspace.approvals.find((a) => a.requestId === requestId);
    if (!target || target.status !== 'pending') return;

    const now = new Date().toISOString();
    const logEntry: AuditLogEntry = {
      id: `AUD-${String(activeWorkspace.auditLogs.length + 1).padStart(4, '0')}`,
      requestId: target.requestId,
      agentId: target.agentId,
      agentName: target.agentName,
      requestedAction: target.requestedAction,
      category: target.category,
      amount: target.amount,
      decision: 'ALLOW',
      triggeredRule: target.triggeredRule,
      ruleLabel: 'Human Reviewer — Demo Request Approved',
      explanationEn: `Request ${target.requestId} was approved by human reviewer (simulated status update only).`,
      explanationFr: `La demande ${target.requestId} a été approuvée par un opérateur humain (statut simulé uniquement).`,
      timestamp: now,
      eventType: 'human_approval',
    };

    setActiveWorkspace((prev) => ({
      ...prev,
      approvals: prev.approvals.map((a) =>
        a.requestId === requestId ? { ...a, status: 'approved', reviewedAt: now } : a
      ),
      auditLogs: [logEntry, ...prev.auditLogs],
    }));
  };

  const rejectRequest = (requestId: string) => {
    const target = activeWorkspace.approvals.find((a) => a.requestId === requestId);
    if (!target || target.status !== 'pending') return;

    const now = new Date().toISOString();
    const logEntry: AuditLogEntry = {
      id: `AUD-${String(activeWorkspace.auditLogs.length + 1).padStart(4, '0')}`,
      requestId: target.requestId,
      agentId: target.agentId,
      agentName: target.agentName,
      requestedAction: target.requestedAction,
      category: target.category,
      amount: target.amount,
      decision: 'BLOCK',
      triggeredRule: target.triggeredRule,
      ruleLabel: 'Human Reviewer — Demo Request Rejected',
      explanationEn: `Request ${target.requestId} was rejected by human reviewer (simulated status update only).`,
      explanationFr: `La demande ${target.requestId} a été rejetée par un opérateur humain (statut simulé uniquement).`,
      timestamp: now,
      eventType: 'human_rejection',
    };

    setActiveWorkspace((prev) => ({
      ...prev,
      approvals: prev.approvals.map((a) =>
        a.requestId === requestId ? { ...a, status: 'rejected', reviewedAt: now } : a
      ),
      auditLogs: [logEntry, ...prev.auditLogs],
    }));
  };

  const updateSettings = (nextSettings: Partial<AppSettings>) => {
    setActiveWorkspace((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...nextSettings },
    }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    setDemoState({
      agents: SEED_AGENTS,
      policy: DEFAULT_POLICY,
      approvals: SEED_APPROVALS,
      auditLogs: SEED_AUDIT_LOGS,
      settings: DEFAULT_SETTINGS,
    });
  };

  const t = TRANSLATIONS[activeWorkspace.settings.language];

  return (
    <NexusContext.Provider
      value={{
        currentPage,
        navigate,
        user,
        authReady,
        workspaceMode,
        switchMode,
        login,
        register,
        logout,
        loadStarterTemplatesInAccount,
        agents: activeWorkspace.agents,
        policy: activeWorkspace.policy,
        approvals: activeWorkspace.approvals,
        auditLogs: activeWorkspace.auditLogs,
        settings: activeWorkspace.settings,
        t,
        registerAgent,
        toggleAgentStatus,
        updatePolicy,
        resetDefaultPolicy,
        simulateAction,
        approveRequest,
        rejectRequest,
        updateSettings,
        resetDemoData,
      }}
    >
      {children}
    </NexusContext.Provider>
  );
};

export function useNexus(): NexusContextValue {
  const ctx = useContext(NexusContext);
  if (!ctx) {
    throw new Error('useNexus must be used within NexusProvider');
  }
  return ctx;
}
