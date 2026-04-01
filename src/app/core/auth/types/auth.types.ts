export interface LoginCredentials {
  login: string;
  password: string;
  // rememberMe?: boolean;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  id: string;
  auth_key: string;
  email: string;
  user_name: string;
  user_type: string;
  user_discount: string;
  refresh_token?: string;
  access_expires_in?: number;
  refresh_expires_in?: number;
}
