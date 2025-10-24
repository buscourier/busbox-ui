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

  if (!process.env['API_REFRESH_URL'])
    return res.status(501).json({ error: 'refresh not supported' });

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
  } catch {
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
    if (!response.ok) return res.status(response.status).json(data ?? { error: 'no data found' });
    return res.json(data);
  } catch {
    return res.status(502).json({ error: 'upstream fetch failed' });
  }
});

/**
 * API Proxy с rate limiting
 */
app.use(
  '/api',
  //add Authorization from HttpOnly-cookies
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

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  console.log('POOORT', port);
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build)
 * or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
