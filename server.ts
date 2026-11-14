import 'dotenv/config';
import express from 'express';
import crypto from 'node:crypto';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LocalAuthStore,
  parseCookies,
  signSessionToken,
  verifySessionToken,
} from './server/authStore.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function readCliArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag);
  if (idx !== -1 && idx + 1 < process.argv.length) {
    return process.argv[idx + 1];
  }
  const prefix = `${flag}=`;
  const eqArg = process.argv.find((arg) => arg.startsWith(prefix));
  return eqArg ? eqArg.slice(prefix.length) : undefined;
}

const IS_PROD = process.env.NODE_ENV === 'production';
const cliPort = Number(readCliArg('--port'));
const envPort = Number(process.env.PORT);
const PORT =
  Number.isFinite(cliPort) && cliPort > 0
    ? cliPort
    : !IS_PROD
      ? Number.isFinite(envPort) && envPort > 0 && envPort !== 8080
        ? envPort
        : 3000
      : Number.isFinite(envPort) && envPort > 0
        ? envPort
        : 3000;
const HOST = readCliArg('--host') || process.env.HOST || '0.0.0.0';
const SESSION_COOKIE = 'nexus_session';
const SESSION_SECRET =
  process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 16
    ? process.env.SESSION_SECRET
    : crypto
        .createHash('sha256')
        .update(`nexus-local-dev-secret:${process.cwd()}`)
        .digest('hex');

const dbPath = path.join(__dirname, 'data', 'nexus-auth-db.json');
const store = new LocalAuthStore(dbPath);

function isHttpsRequest(req: express.Request): boolean {
  const proto = req.headers['x-forwarded-proto'];
  if (typeof proto === 'string' && proto.split(',')[0].trim() === 'https') {
    return true;
  }
  return Boolean(req.secure || (IS_PROD && process.env.APP_URL?.startsWith('https://')));
}

function setSessionCookie(req: express.Request, res: express.Response, token: string): void {
  const secure = isHttpsRequest(req);
  const attrs = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    secure ? 'SameSite=None' : 'SameSite=Lax',
    `Max-Age=${60 * 60 * 24 * 7}`,
  ];
  if (secure) {
    attrs.push('Secure');
  }
  res.setHeader('Set-Cookie', attrs.join('; '));
}

function clearSessionCookie(req: express.Request, res: express.Response): void {
  const secure = isHttpsRequest(req);
  const attrs = [
    `${SESSION_COOKIE}=`,
    'Path=/',
    'HttpOnly',
    secure ? 'SameSite=None' : 'SameSite=Lax',
    'Max-Age=0',
  ];
  if (secure) {
    attrs.push('Secure');
  }
  res.setHeader('Set-Cookie', attrs.join('; '));
}

function getAuthenticatedUserId(req: express.Request): string | null {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE];
  if (!rawToken) return null;
  return verifySessionToken(rawToken, SESSION_SECRET);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'NEXUS AI GATEWAY' });
  });

  app.post('/api/auth/register', (req, res) => {
    const body = (req.body ?? {}) as {
      fullName?: string;
      email?: string;
      organization?: string;
      password?: string;
    };
    const result = store.registerUser({
      fullName: String(body.fullName ?? ''),
      email: String(body.email ?? ''),
      organization: String(body.organization ?? ''),
      password: String(body.password ?? ''),
    });

    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    const token = signSessionToken(result.user.id, SESSION_SECRET);
    setSessionCookie(req, res, token);
    res.status(201).json({ user: result.user });
  });

  app.post('/api/auth/login', (req, res) => {
    const body = (req.body ?? {}) as { email?: string; password?: string };
    const result = store.authenticateUser({
      email: String(body.email ?? ''),
      password: String(body.password ?? ''),
    });

    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }

    const token = signSessionToken(result.user.id, SESSION_SECRET);
    setSessionCookie(req, res, token);
    res.json({ user: result.user });
  });

  app.post('/api/auth/logout', (req, res) => {
    clearSessionCookie(req, res);
    res.json({ ok: true });
  });

  app.get('/api/auth/me', (req, res) => {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.json({ user: null });
      return;
    }
    const user = store.getUserById(userId);
    if (!user) {
      clearSessionCookie(req, res);
      res.json({ user: null });
      return;
    }
    res.json({ user });
  });

  app.get('/api/workspace', (req, res) => {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    const workspace = store.getWorkspace(userId);
    if (!workspace) {
      res.status(404).json({ error: 'Account workspace not found.' });
      return;
    }
    res.json({ workspace });
  });

  app.put('/api/workspace', (req, res) => {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    const body = req.body as Record<string, unknown>;
    if (!body || typeof body !== 'object') {
      res.status(400).json({ error: 'Invalid workspace payload.' });
      return;
    }
    const saved = store.saveWorkspace(userId, {
      agents: Array.isArray(body.agents) ? body.agents : [],
      policy: body.policy as never,
      approvals: Array.isArray(body.approvals) ? body.approvals : [],
      auditLogs: Array.isArray(body.auditLogs) ? body.auditLogs : [],
      settings: body.settings as never,
    });
    if (!saved) {
      res.status(404).json({ error: 'Account workspace not found.' });
      return;
    }
    res.json({ workspace: saved });
  });

  const httpServer = http.createServer(app);
  const disableHmr = process.env.DISABLE_HMR === 'true';

  if (!IS_PROD) {
    const vitePromise = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: {
          middlewareMode: disableHmr ? true : { server: httpServer },
          hmr: !disableHmr,
          ws: disableHmr ? false : undefined,
        },
        appType: 'spa',
      })
    );

    app.use((req, res, next) => {
      vitePromise
        .then((vite) => vite.middlewares(req, res, next))
        .catch(next);
    });
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, HOST, () => {
    console.log(`NEXUS AI GATEWAY server listening on http://${HOST}:${PORT}`);
  });
}

startServer();
