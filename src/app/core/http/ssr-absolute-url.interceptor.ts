import { isPlatformServer } from '@angular/common';
import type { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * Interceptor for SSR: converts relative URLs to absolute
 * so SSR requests go through own Express server (localhost:4000)
 *
 * This provides a single API proxy point for both SSR and browser:
 * - SSR: /api/* → http://localhost:4000/api/* → Express proxy → External API
 * - Browser: /api/* → Express proxy → External API
 */
export const ssrAbsoluteUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Apply only on server (SSR)
  if (!isPlatformServer(platformId)) {
    return next(req);
  }

  // Skip already absolute URLs
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  // Convert relative /api/* and /auth/* to requests to localhost
  // This allows SSR to use the same Express proxy as browser
  if (req.url.startsWith('/api') || req.url.startsWith('/auth')) {
    const baseUrl = process.env['SSR_BASE_URL'];

    // If SSR_BASE_URL is not set (local dev with ng serve), don't transform URLs
    // Angular dev server will handle them natively
    if (!baseUrl) {
      return next(req);
    }

    const absoluteUrl = `${baseUrl}${req.url}`;
    return next(req.clone({ url: absoluteUrl }));
  }

  return next(req);
};
