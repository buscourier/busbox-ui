import { confidantsEffects } from './confidants.effects';
import { fieldsEffects } from './fields.effects';

export const ProfileEffects = {
  ...fieldsEffects,
  ...confidantsEffects,
};
