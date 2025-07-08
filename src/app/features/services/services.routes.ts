import type { Routes } from '@angular/router';

import { NavigationService } from '@core/services/navigation.service';

import {
  CourierComponent,
  ComplexTasksComponent,
  InsuranceComponent,
  ServicesIndexComponent,
} from './pages';
import { ServicesComponent } from './services.component';

const COMPONENT_MAP = {
  courier: CourierComponent,
  'complex-tasks': ComplexTasksComponent,
  insurance: InsuranceComponent,
};

export function generateServicesRoutes(): Routes {
  const navigationService = new NavigationService();
  const infoDropdown = navigationService.getDropdownItems('services');

  const dynamicRoutes = infoDropdown
    .map((item) => {
      const routePath = item.link.replace('services/', '');
      const component = COMPONENT_MAP[routePath as keyof typeof COMPONENT_MAP];

      if (!component) {
        console.warn(`No component found for route: ${routePath}`);
        return null;
      }

      return {
        path: routePath,
        component: component,
        data: {
          pageKey: routePath,
          // title: item.name,
          // description: item.description,
          // keywords: item.keywords,
        },
      };
    })
    .filter((route): route is NonNullable<typeof route> => route !== null);

  return [
    {
      path: '',
      component: ServicesComponent,
      data: { pageKey: 'services' },
      children: [
        {
          path: '',
          component: ServicesIndexComponent,
          data: { title: 'Наши услуги', hideBreadcrumb: true },
        },
        ...dynamicRoutes,
      ],
    },
  ];
}

export const servicesRoutes: Routes = generateServicesRoutes();
