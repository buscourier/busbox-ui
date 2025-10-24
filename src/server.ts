import { randomBytes, timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';

import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import cookieParser from 'cookie-parser';
import express, { json } from 'express';

// eslint-disable-next-line import/no-internal-modules
import { apiRateLimit, createApiProxy } from './server/proxy.middleware';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.set('trust proxy', 1);
app.use(cookieParser());

const isProd = process.env['NODE_ENV'] === 'production';
const cookieBase = { httpOnly: true, sameSite: 'lax' as const, secure: isProd, path: '/' };

// ─── CSRF Token Setup (double-submit cookie) ─────────────
app.use((req, res, next) => {
  const token = req.cookies?.['XSRF-TOKEN'];
  if (!token) {
    const newToken = randomBytes(32).toString('hex');
    res.cookie('XSRF-TOKEN', newToken, {
      secure: isProd,
      sameSite: 'lax',
      httpOnly: false, // Must be readable by Angular
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/',
    });
  }
  next();
});

// ─── CSRF Validation ─────────────────────────────────────
const CSRF_EXEMPT_PATHS = ['/auth/', '/api/calc/', '/api/site/'];

app.use((req, res, next) => {
  const method = req.method;

  // Skip safe HTTP methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return next();

  // Skip explicitly exempted paths
  if (CSRF_EXEMPT_PATHS.some((p) => req.path.startsWith(p))) return next();

  // Origin/Referer check for same-origin requests
  const host = req.get('host') || '';
  const origin = req.get('origin') || '';
  const referer = req.get('referer') || '';

  if (origin && !origin.includes(host)) {
    return res.status(403).json({ error: 'invalid origin' });
  }

  if (!origin && referer && !referer.includes(host)) {
    return res.status(403).json({ error: 'invalid referer' });
  }

  // CSRF token validation with timing-safe comparison
  const csrfCookie = req.cookies?.['XSRF-TOKEN'];
  const csrfHeader = req.header('X-XSRF-TOKEN');

  if (!csrfCookie || !csrfHeader) {
    return res.status(403).json({ error: 'CSRF token missing' });
  }

  try {
    const cookieBuf = Buffer.from(csrfCookie);
    const headerBuf = Buffer.from(csrfHeader);

    if (cookieBuf.length !== headerBuf.length || !timingSafeEqual(cookieBuf, headerBuf)) {
      return res.status(403).json({ error: 'CSRF token mismatch' });
    }
  } catch {
    return res.status(403).json({ error: 'invalid CSRF token format' });
  }

  next();
});

// ─── Auth Endpoints ──────────────────────────────────────
app.post('/auth/session', json(), (req, res) => {
  const { access_token, refresh_token, access_expires_in, refresh_expires_in } = req.body ?? {};

  if (!access_token) {
    return res.status(400).json({ error: 'access_token required' });
  }

  return res
    .cookie('bb_access', access_token, {
      ...cookieBase,
      maxAge: Number(access_expires_in ?? 3600) * 1000,
    })
    .cookie('bb_refresh', refresh_token ?? '', {
      ...cookieBase,
      maxAge: Number(refresh_expires_in ?? 2592000) * 1000,
    })
    .status(204)
    .end();
});

app.post('/auth/refresh', async (req, res) => {
  const refresh = req.cookies?.['bb_refresh'];
  if (!refresh) return res.status(401).end();

  if (!process.env['API_REFRESH_URL']) {
    return res.status(501).json({ error: 'refresh not supported' });
  }

  try {
    const r = await fetch(process.env['API_REFRESH_URL'], {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ refresh_token: refresh }),
    }).then((x) => (x.ok ? x.json() : Promise.reject(new Error('refresh failed'))));

    return res
      .cookie('bb_access', r.access_token, {
        ...cookieBase,
        maxAge: Number(r.access_expires_in ?? 3600) * 1000,
      })
      .cookie('bb_refresh', r.refresh_token ?? refresh, {
        ...cookieBase,
        maxAge: Number(r.refresh_expires_in ?? 2592000) * 1000,
      })
      .status(204)
      .end();
  } catch (err) {
    if (!isProd) console.error('[Auth Refresh Error]', err);

    return res
      .clearCookie('bb_access', cookieBase)
      .clearCookie('bb_refresh', cookieBase)
      .status(401)
      .end();
  }
});

app.post('/auth/logout', (_req, res) => {
  res.clearCookie('bb_access', cookieBase).clearCookie('bb_refresh', cookieBase).status(204).end();
});

app.get('/auth/me', async (req, res) => {
  const token = req.cookies?.['bb_access'];
  if (!token) return res.status(401).json({ error: 'unauthenticated' });

  const apiBaseUrl = process.env['APP_API_BASE_URL'];
  const apiKey = process.env['APP_API_KEY'] ?? '';

  try {
    const response = await fetch(`${apiBaseUrl}/account/auth/${token}`, {
      headers: {
        'X-API-Key': apiKey,
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        res.clearCookie('bb_access', cookieBase);
        res.clearCookie('bb_refresh', cookieBase);
      }
      return res.status(response.status).json(data ?? { error: 'authentication failed' });
    }

    return res.json(data);
  } catch (err) {
    if (!isProd) console.error('[Auth Me Error]', err);
    return res.status(502).json({ error: 'upstream fetch failed' });
  }
});

// ─── Health Check ────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Proxy ───────────────────────────────────────────
app.use(
  '/api',
  (req, _res, next) => {
    const token = req.cookies?.['bb_access'];
    if (token && !req.headers['authorization']) {
      req.headers['authorization'] = `Bearer ${token}`;
    }
    next();
  },
  json({ limit: '1mb' }),
  apiRateLimit(),
  createApiProxy(),
);

// ─── Static Files ────────────────────────────────────────
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// ─── Angular SSR ─────────────────────────────────────────
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch((err) => {
      if (!isProd) console.error('[SSR Error]', err);
      res.status(500).send('Internal Server Error');
    });
});

// ─── Start Server ────────────────────────────────────────
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  // ─── Environment Validation (runtime) ───────────────────
  const requiredEnvVars = ['APP_API_BASE_URL', ...(isProd ? ['APP_API_KEY'] : [])];
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      console.error(`❌ Missing required environment variable: ${varName}`);
      process.exit(1);
    }
  }
  const port = process.env['PORT'] || 4000;

  const server = app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}`);
    console.log(`📦 Environment: ${isProd ? 'production' : 'development'}`);
  });

  const shutdown = (signal: string) => {
    console.log(`\n${signal} received, closing server gracefully...`);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('❌ Forcing shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

export const reqHandler = createNodeRequestHandler(app);
