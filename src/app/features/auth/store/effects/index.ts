import { initializeEffects } from './initialize.effects';
import { loginEffects } from './login.effects';
import { logoutEffects } from './logout.effects';
import { passwordEffects } from './password.effects';
import { registerEffects } from './register.effects';
import { tokenEffects } from './token.effects';
import { userEffects } from './user.effects';

export const AuthEffects = {
  ...initializeEffects,
  ...loginEffects,
  ...registerEffects,
  ...logoutEffects,
  ...userEffects,
  ...passwordEffects,
  ...tokenEffects,
};
