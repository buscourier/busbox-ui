import { HttpClient, type HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

export const authRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  // не трогаем не-API и сам /auth/refresh
  if (!req.url.startsWith('/api')) return next(req);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401) return throwError(() => err);

      // повторно /auth/refresh не дергаем
      if (req.url.startsWith('/auth/refresh')) return throwError(() => err);

      const http = inject(HttpClient);
      return http.post<void>('/auth/refresh', {}).pipe(
        // при успехе повторяем исходный запрос
        switchMap(() => next(req)),
        // если refresh недоступен/не настроен — просто отдаем 401 дальше
        catchError(() => throwError(() => err)),
      );
    }),
  );
};
