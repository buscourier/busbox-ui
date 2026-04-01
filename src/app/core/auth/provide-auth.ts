import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { AUTH_BROWSER_PROVIDERS } from './auth-browser';
import { AUTH_SSR_PROVIDERS } from './auth-ssr';
import { AuthEffects, authFeature } from './store';

export function provideAuth() {
  return [
    provideState(authFeature),
    provideEffects(AuthEffects),
    AUTH_SSR_PROVIDERS,
    AUTH_BROWSER_PROVIDERS,
  ];
}
