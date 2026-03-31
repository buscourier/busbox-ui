import type { ApiError } from '@shared/types';

import type { AuthResponse } from '../types';

export interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  error: ApiError | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  isLoading: false,
  error: null,
};
