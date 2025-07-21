import { createActionGroup, emptyProps, props } from '@ngrx/store';

import type { ApiError } from '@shared/types';

import type {
  AuthResponse,
  LoginCredentials,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ credentials: LoginCredentials }>(),
    'Login Success': props<{ response: AuthResponse }>(),
    'Login Failure': props<{ error: ApiError }>(),

    Register: props<{ userData: RegisterPayload }>(),
    'Register Success': props<{ response: AuthResponse }>(),
    'Register Failure': props<{ error: ApiError }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Logout Failure': props<{ error: ApiError }>(),

    'Forgot Password': props<{ email: string }>(),
    'Forgot Password Success': props<{ message: string }>(),
    'Forgot Password Failure': props<{ error: ApiError }>(),

    'Reset Password': props<{ payload: ResetPasswordPayload }>(),
    'Reset Password Success': props<{ message: string }>(),
    'Reset Password Failure': props<{ error: ApiError }>(),

    'Get Current User': emptyProps(),
    'Get Current User Success': props<{ user: AuthResponse }>(),
    'Get Current User Failure': props<{ error: ApiError }>(),

    'Refresh Token': emptyProps(),
    'Refresh Token Success': props<{ response: AuthResponse }>(),
    'Refresh Token Failure': props<{ error: ApiError }>(),

    'Clear Error': emptyProps(),
  },
});
