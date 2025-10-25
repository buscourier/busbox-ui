import type { ClientRequest } from 'http';

import type { Request, Response, NextFunction } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

export function createApiProxy() {
  const apiBaseUrl = process.env['APP_API_BASE_URL'] || 'https://api.busbox.guru/v1';
  const apiKey = process.env['APP_API_KEY'];

  if (!apiKey && process.env['NODE_ENV'] === 'production') {
    console.warn('⚠️  WARNING: APP_API_KEY is not set in production!');
  }

  return createProxyMiddleware<Request, Response>({
    target: apiBaseUrl,
    changeOrigin: true,
    xfwd: true,
    pathRewrite(path) {
      const accountDetailsMatch = path.match(/^\/account\/details\/([^/?#]+)/);

      if (accountDetailsMatch) {
        const userId = decodeURIComponent(accountDetailsMatch[1]);
        return `/account/details/${apiKey}/${userId}${path.slice(accountDetailsMatch[0].length)}`;
      }

      const confidantsMatch = path.match(/^\/account\/contactperson\/([^/?#]+)/);

      if (confidantsMatch) {
        const userId = decodeURIComponent(confidantsMatch[1]);
        return `/account/contactperson/${apiKey}/${userId}${path.slice(confidantsMatch[0].length)}`;
      }

      const userBalanceMatch = path.match(/^\/account\/balance\/([^/?#]+)/);

      if (userBalanceMatch) {
        const userId = decodeURIComponent(userBalanceMatch[1]);
        return `/account/balance/${apiKey}/${userId}${path.slice(userBalanceMatch[0].length)}`;
      }

      const orderDetailsMatch = path.match(/^\/order\/getdetails\/([^/?#]+)/);

      if (orderDetailsMatch) {
        const orderId = decodeURIComponent(orderDetailsMatch[1]);
        return `/order/getdetails/${apiKey}/${orderId}${path.slice(orderDetailsMatch[0].length)}`;
      }

      const trackingMatch = path.match(/^\/order\/gettracking(?:\/([^/?#]+))?/);
      if (trackingMatch) {
        const orderId = decodeURIComponent(trackingMatch[1]);
        return `/order/gettracking/${apiKey}/${orderId}${path.slice(trackingMatch[0].length)}`;
      }

      const pageMatch = path.match(/^\/site\/page(?:\/([^/?#]+))?/);
      if (pageMatch) {
        const pageId = decodeURIComponent(pageMatch[1]);
        return `/site/page/${apiKey}/${pageId}/${path.slice(pageMatch[0].length)}`;
      }

      return path;
    },

    on: {
      proxyReq(proxyReq: ClientRequest, req: Request) {
        const url = req.url || '';
        const method = req.method as string;

        if (apiKey) {
          proxyReq.setHeader('X-API-Key', apiKey);
        }

        const authHeader = req.headers?.['authorization'];
        if (authHeader) {
          proxyReq.setHeader('Authorization', String(authHeader));
        }

        // ──  API-KEY In BODY POST  ───────────────
        if (
          method === 'POST' &&
          (/^\/account\/login(?:[/?#]|$)/.test(url) ||
            /^\/order\/getorders(?:[/?#]|$)/.test(url) ||
            /^\/order\/ordercancel(?:[/?#]|$)/.test(url) ||
            /^\/order(?:[/?#]|$)/.test(url))
        ) {
          const ct = String(req.headers?.['content-type'] || '');
          // work with json
          if (ct.includes('application/json')) {
            // express.json() уже распарсил тело
            let body = req.body ?? {};
            if (typeof body === 'string') {
              try {
                body = JSON.parse(body || '{}');
              } catch {
                body = {};
              }
            }

            const merged = { ...body, ['api-key']: apiKey };

            const data = JSON.stringify(merged);
            proxyReq.setHeader('content-type', 'application/json');
            proxyReq.setHeader('content-length', Buffer.byteLength(data));
            proxyReq.write(data);
          }
        }
      },

      proxyRes(proxyRes, req) {
        console.log(`[API Proxy] ${req.url} → ${proxyRes.statusCode}`);
      },

      // error(err: Error, req: IncomingMessage, res: Response) {
      //   console.error('[API Proxy Error]', err.message);
      //   if (!res.headersSent) {
      //     res.status(502).json({
      //       error: 'Bad Gateway',
      //       message: 'Failed to connect to API server',
      //     });
      //   }
      // },
    },
  });
}

export function apiRateLimit() {
  const requests = new Map<string, number[]>();
  const WINDOW_MS = 60_000;
  const MAX_REQUESTS = 100;

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || 'unknown';
    const now = Date.now();

    if (!requests.has(ip)) requests.set(ip, []);
    const buf = requests.get(ip)!;

    const recent = buf.filter((t) => now - t < WINDOW_MS);

    if (recent.length >= MAX_REQUESTS) {
      res.status(429).json({ error: 'Too many requests' });
      return;
    }

    recent.push(now);
    requests.set(ip, recent);
    next();
  };
}
