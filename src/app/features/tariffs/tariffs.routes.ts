import type { Routes } from '@angular/router';

import { TariffsComponent } from './tariffs.component';

export const tariffsRoutes: Routes = [
  {
    path: '',
    component: TariffsComponent,
    data: { title: 'Тарифы на перевозку' },
  },
];
