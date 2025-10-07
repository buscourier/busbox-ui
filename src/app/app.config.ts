import { provideImageKitLoader, registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import localeRu from '@angular/common/locales/ru';
import { type ApplicationConfig } from '@angular/core';
import { isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEventPlugins } from '@taiga-ui/event-plugins';
import { provideYConfig } from 'angular-yandex-maps-v3';

import { getMapConfig, getScrollConfig, getViewTransitionsConfig } from '@core/config';
import {
  CONTACTS_PROVIDERS,
  DATE_PROVIDERS,
  LANGUAGE_PROVIDERS,
  PDF_PROVIDERS,
  provideIconResolver,
  provideValidationLimits,
  UI_PROVIDERS,
} from '@core/providers';

import { DocumentsEffects, documentsFeature } from '@shared/features/documents';
import { LocationsEffects, locationsFeature } from '@shared/store';

import { environment } from '@env/environment';

import { AuthEffects, authFeature } from '@auth';
import { NewsEffects, newsFeature } from '@news/store';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

registerLocaleData(localeRu, 'ru');

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideRouterStore(),
    provideState(locationsFeature),
    provideState(authFeature),
    provideState(documentsFeature),
    provideState(newsFeature),
    provideEffects(LocationsEffects, AuthEffects, DocumentsEffects, NewsEffects),
    provideIconResolver(),
    provideImageKitLoader(environment.imageProviderUrl),
    provideYConfig(getMapConfig()),
    provideEventPlugins(),
    provideValidationLimits(),
    provideRouter(
      routes,
      withViewTransitions(getViewTransitionsConfig()),
      withInMemoryScrolling(getScrollConfig()),
    ),
    provideTransloco({
      config: {
        availableLangs: ['ru', 'en'],
        defaultLang: 'ru',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),

    ...LANGUAGE_PROVIDERS,
    ...DATE_PROVIDERS,
    ...CONTACTS_PROVIDERS,
    ...PDF_PROVIDERS,
    ...UI_PROVIDERS,
  ],
};
