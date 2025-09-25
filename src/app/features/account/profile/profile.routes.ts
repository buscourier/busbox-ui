import type { Routes } from '@angular/router';

import { ProfileEditComponent } from './components/profile-edit';
import { ProfileViewComponent } from './components/profile-view';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { ProfileComponent } from './profile.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      {
        path: '',
        component: ProfileViewComponent,
        data: { pageKey: 'profile' },
      },
      {
        path: 'edit',
        component: ProfileEditComponent,
        canDeactivate: [unsavedChangesGuard],
        data: { pageKey: 'profile' },
      },
    ],
  },
];
