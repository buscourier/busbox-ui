import type { Routes } from '@angular/router';

import { ProfileEditComponent } from './components/profile-edit';
import { ProfileViewComponent } from './components/profile-view';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import { ProfileComponent } from './profile.component';

export const profileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: { title: 'Персональные данные' },
    children: [
      {
        path: '',
        component: ProfileViewComponent,
        data: { title: 'Персональные данные', hideBreadcrumb: true },
      },
      {
        path: 'edit',
        component: ProfileEditComponent,
        canDeactivate: [unsavedChangesGuard],
        data: { title: 'Редактирование данных' },
      },
    ],
  },
];
