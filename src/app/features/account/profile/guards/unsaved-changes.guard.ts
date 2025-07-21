import type { CanDeactivateFn } from '@angular/router';

import type { ProfileEditComponent } from '../components/profile-edit';

export const unsavedChangesGuard: CanDeactivateFn<ProfileEditComponent> = (component) => {
  return component.canDeactivate();
};
