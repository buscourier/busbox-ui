import { isPlatformServer } from '@angular/common';
import type { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

/**
 * Interceptor for SSR: convert relative URL to absolute
 * using env var APP_API_BASE_URL
 */
export const ssrAbsoluteUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  // Apply only for server
  if (!isPlatformServer(platformId)) {
    return next(req);
  }

  // Skip absolute URL
  if (req.url.startsWith('http://') || req.url.startsWith('https://')) {
    return next(req);
  }

  // For relative  /api/* queries use APP_API_BASE_URL
  if (req.url.startsWith('/api')) {
    const apiBaseUrl = process.env['APP_API_BASE_URL'];

    if (!apiBaseUrl) {
      console.error('[SSR] APP_API_BASE_URL not configured, API request will fail:', req.url);
      return next(req);
    }

    // Remove /api from start, as it included in APP_API_BASE_URL
    const apiPath = req.url.replace(/^\/api/, '');
    const absoluteUrl = `${apiBaseUrl}${apiPath}`;

    const modifiedReq = req.clone({
      url: absoluteUrl,
      setHeaders: {
        // Add API key for SSR query
        ...(process.env['APP_API_KEY'] && { 'X-API-Key': process.env['APP_API_KEY'] }),
      },
    });

    return next(modifiedReq);
  }

  return next(req);
};
