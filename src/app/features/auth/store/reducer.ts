import { createReducer, on } from '@ngrx/store';

import { AuthActions } from './actions';
import { type AuthState, initialState } from './state';

export const authReducer = createReducer(
  initialState,
  on(
    AuthActions.initializeSuccess,
    (state, { user }): AuthState => ({
      ...state,
      isInitialized: true,
      isAuthenticated: true,
      user,
    }),
  ),

  on(
    AuthActions.initializeFailure,
    (state): AuthState => ({
      ...state,
      isInitialized: true,
      isAuthenticated: false,
    }),
  ),
  on(
    AuthActions.login,
    (state): AuthState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),
  on(
    AuthActions.loginSuccess,
    (state, { response }): AuthState => ({
      ...state,
      user: response,
      isLoading: false,
      isAuthenticated: true,
      error: null,
    }),
  ),
  on(
    AuthActions.loginFailure,
    (state, { error }): AuthState => ({
      ...state,
      // user: null,
      isLoading: false,
      isAuthenticated: false,
      error,
    }),
  ),

  on(
    AuthActions.register,
    (state): AuthState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),
  on(
    AuthActions.registerSuccess,
    (state, { response }): AuthState => ({
      ...state,
      user: response,
      isLoading: false,
      isAuthenticated: true,
      error: null,
    }),
  ),
  on(
    AuthActions.registerFailure,
    (state, { error }): AuthState => ({
      ...state,
      isLoading: false,
      isAuthenticated: false,
      error,
    }),
  ),

  on(
    AuthActions.logout,
    (): AuthState => ({
      ...initialState,
      isInitialized: true,
    }),
  ),
  // on(
  //   AuthActions.logoutSuccess,
  //   (): AuthState => ({
  //     ...initialState,
  //   }),
  // ),
  // on(
  //   AuthActions.logoutFailure,
  //   (state, { error }): AuthState => ({
  //     ...state,
  //     isLoading: false,
  //     // isAuthenticated: false,
  //     error,
  //   }),
  // ),

  on(
    AuthActions.forgotPassword,
    (state): AuthState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),
  on(
    AuthActions.forgotPasswordSuccess,
    (state): AuthState => ({
      ...state,
      isLoading: false,
      error: null,
    }),
  ),
  on(
    AuthActions.forgotPasswordFailure,
    (state, { error }): AuthState => ({
      ...state,
      isLoading: false,
      error,
    }),
  ),

  on(
    AuthActions.resetPassword,
    (state): AuthState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),

  on(
    AuthActions.resetPasswordSuccess,
    (state): AuthState => ({
      ...state,
      isLoading: false,
      error: null,
    }),
  ),

  on(
    AuthActions.resetPasswordFailure,
    (state, { error }): AuthState => ({
      ...state,
      isLoading: false,
      error,
    }),
  ),

  on(
    AuthActions.getCurrentUser,
    (state): AuthState => ({
      ...state,
      isLoading: true,
      error: null,
    }),
  ),
  on(
    AuthActions.getCurrentUserSuccess,
    (state, { user }): AuthState => ({
      ...state,
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    }),
  ),
  on(
    AuthActions.getCurrentUserFailure,
    (state, { error }): AuthState => ({
      ...state,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error,
    }),
  ),

  on(
    AuthActions.refreshToken,
    (state): AuthState => ({
      ...state,
      isRefreshingToken: true,
      error: null,
    }),
  ),
  on(
    AuthActions.refreshTokenSuccess,
    (state, { response }): AuthState => ({
      ...state,
      user: response,
      isAuthenticated: true,
      isRefreshingToken: false,
      error: null,
    }),
  ),
  on(
    AuthActions.refreshTokenFailure,
    (state, { error }): AuthState => ({
      ...state,
      user: null,
      isAuthenticated: false,
      isRefreshingToken: false,
      error,
    }),
  ),

  on(
    AuthActions.clearError,
    (state): AuthState => ({
      ...state,
      error: null,
    }),
  ),
);
