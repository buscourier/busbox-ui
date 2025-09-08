import type { Routes } from '@angular/router';

import { ContactsComponent } from './contacts.component';

export const contactsRoutes: Routes = [
  {
    path: '',
    component: ContactsComponent,
    data: { pageKey: 'contacts' },
  },
];
