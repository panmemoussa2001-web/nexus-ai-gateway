import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import type {
  AppSettings,
  AuditLogEntry,
  DemoAgent,
  HumanApprovalRequest,
  PolicyConfig,
} from '../src/types/nexus.ts';

export interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  passwordHash: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  fullName: string;
  email: string;
  organization: string;
  createdAt: string;
}

export interface UserWorkspaceData {
  agents: DemoAgent[];
  policy: PolicyConfig;
  approvals: HumanApprovalRequest[];
  auditLogs: AuditLogEntry[];
  settings: AppSettings;
  updatedAt: string;
}

interface AuthDatabase {
  users: StoredUser[];
  workspaces: Record<string, UserWorkspaceData>;
}

const DEFAULT_PERSONAL_POLICY: PolicyConfig = {
  maxTransactionAmount: 5000,
  prohibitedCategories: ['data_deletion', 'confidential_access'],
  approvalRequiredCategories: ['external_communication', 'financial_transaction'],
  allowedCategories: ['read_reporting', 'system_monitoring'],
  agentPermissions: {},
};

const DEFAULT_PERSONAL_SETTINGS: AppSettings = {
  appName: 'NEXUS AI GATEWAY',
  language: 'en',
  theme: 'dark',
};

export function createEmptyPersonalWorkspace(): UserWorkspaceData {
  return {
    agents: [],
    policy: {
      ...DEFAULT_PERSONAL_POLICY,
      prohibitedCategories: [...DEFAULT_PERSONAL_POLICY.prohibitedCategories],
      approvalRequiredCategories: [...DEFAULT_PERSONAL_POLICY.approvalRequiredCategories],
      allowedCategories: [...DEFAULT_PERSONAL_POLICY.allowedCategories],
      agentPermissions: {},
    },
    approvals: [],
    auditLogs: [],
    settings: { ...DEFAULT_PERSONAL_SETTINGS },
    updatedAt: new Date().toISOString(),
  };
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, expectedHex] = parts;
  if (!salt || !expectedHex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  if (derived.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(derived, expectedBuf);
}

export function signSessionToken(userId: string, secret: string, ttlSeconds = 60 * 60 * 24 * 7): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = Buffer.from(JSON.stringify({ sub: userId, exp }), 'utf8').toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifySessionToken(token: string, secret: string): string | null {
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return null;
  const payload = token.slice(0, dotIdx);
  const providedSig = token.slice(dotIdx + 1);
  if (!payload || !providedSig) return null;

  const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const a = Buffer.from(providedSig, 'utf8');
  const b = Buffer.from(expectedSig, 'utf8');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub?: string;
      exp?: number;
    };
    if (!decoded.sub || typeof decoded.exp !== 'number') return null;
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded.sub;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;
  for (const part of cookieHeader.split(';')) {
    const eqIdx = part.indexOf('=');
    if (eqIdx <= 0) continue;
    const key = part.slice(0, eqIdx).trim();
    const val = decodeURIComponent(part.slice(eqIdx + 1).trim());
    result[key] = val;
  }
  return result;
}

export function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    organization: user.organization,
    createdAt: user.createdAt,
  };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export class LocalAuthStore {
  private readonly filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  private readDb(): AuthDatabase {
    try {
      if (!fs.existsSync(this.filePath)) {
        return { users: [], workspaces: {} };
      }
      const raw = fs.readFileSync(this.filePath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<AuthDatabase>;
      return {
        users: Array.isArray(parsed.users) ? parsed.users : [],
        workspaces: parsed.workspaces && typeof parsed.workspaces === 'object' ? parsed.workspaces : {},
      };
    } catch {
      return { users: [], workspaces: {} };
    }
  }

  private writeDb(db: AuthDatabase): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tmpPath = `${this.filePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tmpPath, this.filePath);
  }

  registerUser(input: {
    fullName: string;
    email: string;
    organization?: string;
    password: string;
  }): { ok: true; user: PublicUser } | { ok: false; status: number; error: string } {
    const fullName = input.fullName.trim();
    const email = input.email.trim().toLowerCase();
    const organization = (input.organization ?? '').trim();
    const password = input.password;

    if (fullName.length < 2) {
      return { ok: false, status: 400, error: 'Full name must be at least 2 characters.' };
    }
    if (!isValidEmail(email)) {
      return { ok: false, status: 400, error: 'Please provide a valid email address.' };
    }
    if (password.length < 8) {
      return { ok: false, status: 400, error: 'Password must be at least 8 characters.' };
    }

    const db = this.readDb();
    if (db.users.some((u) => u.email === email)) {
      return { ok: false, status: 409, error: 'An account with this email already exists.' };
    }

    const user: StoredUser = {
      id: `NX-USR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      fullName,
      email,
      organization,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    db.users.push(user);
    db.workspaces[user.id] = createEmptyPersonalWorkspace();
    this.writeDb(db);

    return { ok: true, user: toPublicUser(user) };
  }

  authenticateUser(input: {
    email: string;
    password: string;
  }): { ok: true; user: PublicUser } | { ok: false; status: number; error: string } {
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!isValidEmail(email) || !password) {
      return { ok: false, status: 400, error: 'Valid email and password are required.' };
    }

    const db = this.readDb();
    const found = db.users.find((u) => u.email === email);
    if (!found || !verifyPassword(password, found.passwordHash)) {
      return { ok: false, status: 401, error: 'Invalid email or password.' };
    }

    return { ok: true, user: toPublicUser(found) };
  }

  getUserById(userId: string): PublicUser | null {
    const db = this.readDb();
    const found = db.users.find((u) => u.id === userId);
    return found ? toPublicUser(found) : null;
  }

  getWorkspace(userId: string): UserWorkspaceData | null {
    const db = this.readDb();
    if (!db.users.some((u) => u.id === userId)) return null;
    if (!db.workspaces[userId]) {
      db.workspaces[userId] = createEmptyPersonalWorkspace();
      this.writeDb(db);
    }
    return db.workspaces[userId];
  }

  saveWorkspace(userId: string, nextData: Omit<UserWorkspaceData, 'updatedAt'>): UserWorkspaceData | null {
    const db = this.readDb();
    if (!db.users.some((u) => u.id === userId)) return null;

    const saved: UserWorkspaceData = {
      agents: Array.isArray(nextData.agents) ? nextData.agents : [],
      policy: nextData.policy ?? createEmptyPersonalWorkspace().policy,
      approvals: Array.isArray(nextData.approvals) ? nextData.approvals : [],
      auditLogs: Array.isArray(nextData.auditLogs) ? nextData.auditLogs : [],
      settings: nextData.settings ?? createEmptyPersonalWorkspace().settings,
      updatedAt: new Date().toISOString(),
    };
    db.workspaces[userId] = saved;
    this.writeDb(db);
    return saved;
  }
}
