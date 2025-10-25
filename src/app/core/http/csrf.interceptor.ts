import { isPlatformBrowser } from '@angular/common';
import type { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) return next(req);
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next(req);

  // Allow same-origin requests only
  const isAbsolute = /^(https?:)?\/\//i.test(req.url);
  const isSameOrigin = !isAbsolute || req.url.startsWith(window.location.origin);
  if (!isSameOrigin) return next(req);

  // Skip if header already exists
  if (req.headers.has('X-XSRF-TOKEN')) return next(req);

  const token = document.cookie
    .split('; ')
    .find((row) => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

  if (!token) return next(req);

  return next(
    req.clone({
      setHeaders: { 'X-XSRF-TOKEN': token },
    }),
  );
};
