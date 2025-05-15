import { provideHttpClient } from '@angular/common/http';
import { type ApplicationConfig, signal } from '@angular/core';
import { isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { tuiButtonOptionsProvider, tuiTextfieldOptionsProvider } from '@taiga-ui/core';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import {
  TUI_DATE_VALUE_TRANSFORMER,
  tuiCheckboxOptionsProvider,
  tuiInputNumberOptionsProvider,
  tuiRadioOptionsProvider,
} from '@taiga-ui/kit';
import { TUI_TEXTFIELD_LABEL_OUTSIDE, TUI_TEXTFIELD_SIZE } from '@taiga-ui/legacy';

import { DEFAULT_VALIDATION_LIMITS } from '@core/config';
import {
  CONTACT_INFO,
  EMAIL,
  PHONE_NUMBER,
  TELEGRAM_ACCOUNT,
  VALIDATION_LIMITS,
} from '@core/tokens';
import { CustomDateTransformer } from '@core/transformers';

import { AuthEffects, authFeature } from '@auth';

import { BookingEffects, bookingFeature } from '@delivery/booking';
import { DeliveryDetailsEffects, deliveryDetailsFeature } from '@delivery/delivery-details';
import { DeliveryPointEffects, deliveryPointFeature } from '@delivery/delivery-point';
import { DeliverySummaryEffects, deliverySummaryFeature } from '@delivery/delivery-summary';
import { PickupPointEffects, pickupPointFeature } from '@delivery/pickup-point';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(),
    provideState(pickupPointFeature),
    provideState(deliveryPointFeature),
    provideState(deliveryDetailsFeature),
    provideState(deliverySummaryFeature),
    provideState(bookingFeature),
    provideState(authFeature),
    provideEffects(
      PickupPointEffects,
      DeliveryPointEffects,
      DeliveryDetailsEffects,
      DeliverySummaryEffects,
      BookingEffects,
      AuthEffects,
    ),
    provideRouterStore(),
    provideHttpClient(),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    NG_EVENT_PLUGINS,
    {
      provide: TUI_DATE_VALUE_TRANSFORMER,
      useClass: CustomDateTransformer,
    },
    {
      provide: VALIDATION_LIMITS,
      useValue: DEFAULT_VALIDATION_LIMITS,
    },
    {
      provide: TUI_TEXTFIELD_SIZE,
      useValue: {
        size: 'm',
      },
    },
    {
      provide: TUI_TEXTFIELD_LABEL_OUTSIDE,
      useValue: {
        labelOutside: true,
      },
    },
    {
      provide: PHONE_NUMBER,
      useValue: '+7 (423) 293 78 79',
    },
    {
      provide: TELEGRAM_ACCOUNT,
      useValue: 'https://t.me/busbox',
    },
    {
      provide: EMAIL,
      useValue: 'inbox@busbox.guru',
    },

    {
      provide: CONTACT_INFO,
      useFactory: (phone: string, telegram: string, email: string) => ({
        phone,
        telegram,
        email,
      }),
      deps: [PHONE_NUMBER, TELEGRAM_ACCOUNT, EMAIL],
    },
    tuiRadioOptionsProvider({
      size: 'm',
    }),
    tuiButtonOptionsProvider({
      size: 'm',
    }),
    tuiCheckboxOptionsProvider({
      size: 'm',
    }),
    tuiTextfieldOptionsProvider({
      size: signal('m'),
      cleaner: signal(false),
    }),
    tuiInputNumberOptionsProvider({
      min: 0,
      max: 20,
    }),
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['ru', 'en'],
        defaultLang: 'ru',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
