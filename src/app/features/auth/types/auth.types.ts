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
  id: number;
  auth_key: string;
  user_name: string;
  user_type: string;
}

// export interface UserProfile {
//   id: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   phone?: string;
//   isEmailVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
// }
//
// export interface AuthValidationErrors {
//   email?: string[];
//   password?: string[];
//   confirmPassword?: string[];
//   firstName?: string[];
//   lastName?: string[];
//   phone?: string[];
//   general?: string[];
// }
