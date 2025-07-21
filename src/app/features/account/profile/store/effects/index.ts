import { confidantsEffects } from './confidants.effects';
import { errorHandlingEffects } from './error-handling.effects';
import { fieldsEffects } from './fields.effects';

export const ProfileEffects = {
  ...fieldsEffects,
  ...confidantsEffects,
  ...errorHandlingEffects,
};
