import { createFeature } from '@ngrx/store';

import { authReducer } from './reducer';

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

export const {
  selectAuthState,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectIsInitialized,
  selectIsRefreshingToken,
  selectError,
} = authFeature;
