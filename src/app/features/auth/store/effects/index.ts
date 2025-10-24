import { loginEffects } from './login.effects';
import { logoutEffects } from './logout.effects';
import { passwordEffects } from './password.effects';
import { registerEffects } from './register.effects';

export const AuthEffects = {
  ...loginEffects,
  ...registerEffects,
  ...logoutEffects,
  ...passwordEffects,
};
