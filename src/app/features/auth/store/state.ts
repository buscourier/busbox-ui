import type { ApiError } from '@shared/types';

import type { AuthResponse } from '../types';

export interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isRefreshingToken: boolean;
  error: ApiError | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isRefreshingToken: false,
  error: null,
};
