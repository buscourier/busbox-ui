import type { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { NavigationService } from '@core/services/navigation.service';

import { InfoComponent } from './info.component';
import {
  AirportDeliveryComponent,
  CargoRulesComponent,
  DocumentsComponent,
  HowToReceiveComponent,
  HowToSendComponent,
  InfoIndexComponent,
  PackagingComponent,
  StorageComponent,
  TariffsComponent,
  TariffsEffects,
  tariffsFeature,
} from './pages';

const COMPONENT_MAP = {
  'how-to-send': HowToSendComponent,
  'how-to-receive': HowToReceiveComponent,
  'cargo-rules': CargoRulesComponent,
  tariffs: TariffsComponent,
  packaging: PackagingComponent,
  storage: StorageComponent,
  'airport-delivery': AirportDeliveryComponent,
  documents: DocumentsComponent,
};

export function generateInfoRoutes(): Routes {
  const navigationService = new NavigationService();
  const infoDropdown = navigationService.getDropdownItems('info');

  const dynamicRoutes = infoDropdown
    .map((item) => {
      const routePath = item.link.replace('info/', ''); // убираем 'info/' префикс
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
      component: InfoComponent,
      data: { pageKey: 'info' },
      providers: [provideState(tariffsFeature), provideEffects(TariffsEffects)],
      children: [
        {
          path: '',
          component: InfoIndexComponent,
          data: { title: 'Полезная информация', hideBreadcrumb: true },
        },
        ...dynamicRoutes,
      ],
    },
  ];
}

export const infoRoutes: Routes = generateInfoRoutes();

// export const infoRoutes: Routes = [
//   {
//     path: '',
//     component: InfoComponent,
//     data: { pageKey: 'info' },
//     children: [
//       {
//         path: '',
//         component: InfoIndexComponent,
//         data: { title: 'Полезная информация', hideBreadcrumb: true },
//       },
//       {
//         path: 'how-to-send',
//         component: HowToSendComponent,
//         data: { pageKey: 'how-to-send' },
//       },
//       {
//         path: 'how-to-receive',
//         component: HowToReceiveComponent,
//         data: { pageKey: 'how-to-receive' },
//       },
//       {
//         path: 'cargo-rules',
//         component: CargoRulesComponent,
//         data: { pageKey: 'cargo-rules' },
//       },
//       {
//         path: 'tariffs',
//         component: TariffsComponent,
//         data: { pageKey: 'tariffs' },
//         providers: [provideState(tariffsFeature), provideEffects(TariffsEffects)],
//       },
//       {
//         path: 'packaging',
//         component: PackagingComponent,
//         data: { pageKey: 'packaging' },
//       },
//       {
//         path: 'storage',
//         component: StorageComponent,
//         data: { pageKey: 'storage' },
//       },
//       {
//         path: 'airport-delivery',
//         component: AirportDeliveryComponent,
//         data: { pageKey: 'airport-delivery' },
//       },
//       {
//         path: 'documents',
//         component: DocumentsComponent,
//         data: { pageKey: 'documents' },
//       },
//     ],
//   },
// ];
