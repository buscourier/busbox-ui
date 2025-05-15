import type { HttpRequest, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

// import { LoadingService } from '../services/loading.service';
import { TokenService } from '../services/token.service';

// Define paths that don't require authentication
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  // const store = inject(Store);
  // const router = inject(Router);
  // const loadingService = inject(LoadingService);

  // Skip adding token for public paths
  if (PUBLIC_PATHS.some((path) => req.url.includes(path))) {
    return next(req);
  }

  const accessToken = tokenService.getAccessToken();

  if (!accessToken) {
    return next(req);
  }

  const authReq = addTokenToRequest(req, accessToken);

  return next(authReq);

  // return next(authReq).pipe(
  //   catchError((error: HttpErrorResponse) => {
  //     // Only handle 401 Unauthorized errors
  //     if (error.status !== 401) {
  //       return throwError(() => error);
  //     }
  //
  //     // Check if we're authenticated according to the store
  //     return store.select(selectIsAuthenticated).pipe(
  //       take(1),
  //       switchMap((isAuthenticated) => {
  //         // If not authenticated, don't try to refresh
  //         if (!isAuthenticated) {
  //           router.navigate(['/auth/login']);
  //           return throwError(() => error);
  //         }
  //
  //         // Show loading indicator
  //         // loadingService.setLoading(true, 'token-refresh');
  //
  //         store.dispatch(AuthActions.refreshToken());
  //
  //         // Wait for refresh operation to complete
  //         return store.select(selectIsRefreshingToken).pipe(
  //           filter((isRefreshing) => !isRefreshing),
  //           take(1),
  //           timeout(10000), // Add a timeout to prevent hanging
  //           switchMap(() => {
  //             // Get the new token
  //             const newToken = tokenService.getAccessToken();
  //
  //             if (newToken) {
  //               // Create a new request with the fresh token
  //               const retryReq = addTokenToRequest(req, newToken);
  //               return next(retryReq);
  //             }
  //
  //             // If no new token, redirect to login
  //             router.navigate(['/auth/login']);
  //             return throwError(() => new Error('Token refresh failed'));
  //           }),
  //           catchError((refreshError) => {
  //             // Handle refresh errors (timeout or other issues)
  //             router.navigate(['/auth/login']);
  //             return throwError(() => refreshError);
  //           }),
  //           finalize(() => {
  //             // Hide loading indicator when done
  //             // loadingService.setLoading(false, 'token-refresh');
  //           }),
  //         );
  //       }),
  //     );
  //   }),
  // );
};

/**
 * Helper function to add the authorization token to a request
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}
