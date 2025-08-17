import { provideImageKitLoader } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { type ApplicationConfig, importProvidersFrom, signal } from '@angular/core';
import { isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideState, provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import type { TuiStringHandler } from '@taiga-ui/cdk';
import {
  TUI_ICON_RESOLVER,
  tuiButtonOptionsProvider,
  tuiTextfieldOptionsProvider,
} from '@taiga-ui/core';
import { NG_EVENT_PLUGINS } from '@taiga-ui/event-plugins';
import {
  TUI_DATE_RANGE_VALUE_TRANSFORMER,
  TUI_DATE_VALUE_TRANSFORMER,
  tuiCheckboxOptionsProvider,
  tuiInputNumberOptionsProvider,
  tuiRadioOptionsProvider,
} from '@taiga-ui/kit';
import { TUI_TEXTFIELD_LABEL_OUTSIDE, TUI_TEXTFIELD_SIZE } from '@taiga-ui/legacy';
import { AngularYandexMapsModule, type YaConfig } from 'angular8-yandex-maps';

import { DEFAULT_VALIDATION_LIMITS } from '@core/config';
import { PreloadIconsService } from '@core/services';
import {
  DefaultDomProcessor,
  DefaultProgressIndicator,
  DualDocumentRenderer,
  HtmlToImageConverter,
  JsPdfBuilder,
} from '@core/services/pdf';
import {
  CONTACT_INFO,
  DOCUMENT_RENDERER,
  DOM_PROCESSOR,
  EMAIL,
  IMAGE_CONVERTER,
  PDF_BUILDER,
  PHONE_NUMBER,
  PROGRESS_INDICATOR,
  TELEGRAM_ACCOUNT,
  VALIDATION_LIMITS,
  WHATSAPP,
} from '@core/tokens';
import { CustomDateTransformer, CustomDateRangeTransformer } from '@core/transformers';

import { DocumentsEffects, documentsFeature } from '@shared/features/documents';
import { LocationsEffects, locationsFeature } from '@shared/store';

import { environment } from '@env/environment';

import { BalanceEffects, balanceFeature } from '@account/balance';
import { OrdersEffects, ordersFeature } from '@account/orders';
import { ProfileEffects, profileFeature } from '@account/profile';
import { AuthEffects, authFeature } from '@auth';
import { NewsEffects, newsFeature } from '@news/store';

import { BookingEffects, bookingFeature } from '@delivery/booking';
import { DeliveryDetailsEffects, deliveryDetailsFeature } from '@delivery/delivery-details';
import { DeliveryPointEffects, deliveryPointFeature } from '@delivery/delivery-point';
import { DeliverySummaryEffects, deliverySummaryFeature } from '@delivery/delivery-summary';
import { PickupPointEffects, pickupPointFeature } from '@delivery/pickup-point';

import { routes } from './app.routes';
import { TranslocoHttpLoader } from './transloco-loader';

const mapConfig: YaConfig = {
  apikey: environment.mapApiKey,
  lang: 'ru_RU',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore(),
    provideState(locationsFeature),
    provideState(pickupPointFeature),
    provideState(deliveryPointFeature),
    provideState(deliveryDetailsFeature),
    provideState(deliverySummaryFeature),
    provideState(bookingFeature),
    provideState(authFeature),
    provideState(profileFeature),
    provideState(ordersFeature),
    provideState(balanceFeature),
    provideState(documentsFeature),
    provideState(newsFeature),
    provideRouter(
      routes,
      withViewTransitions({
        skipInitialTransition: true,
        onViewTransitionCreated: (transitionInfo) => {
          console.log('transitionInfo', transitionInfo);
        },
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideEffects(
      LocationsEffects,
      PickupPointEffects,
      DeliveryPointEffects,
      DeliveryDetailsEffects,
      DeliverySummaryEffects,
      BookingEffects,
      AuthEffects,
      ProfileEffects,
      OrdersEffects,
      BalanceEffects,
      DocumentsEffects,
      NewsEffects,
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
      provide: TUI_DATE_RANGE_VALUE_TRANSFORMER,
      useClass: CustomDateRangeTransformer,
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
      useValue: 'busbox',
    },
    {
      provide: EMAIL,
      useValue: 'inbox@busbox.guru',
    },
    {
      provide: WHATSAPP,
      useValue: '+7 (904) 623 60 90',
    },
    {
      provide: DOM_PROCESSOR,
      useClass: DefaultDomProcessor,
    },
    {
      provide: IMAGE_CONVERTER,
      useClass: HtmlToImageConverter,
    },
    {
      provide: PDF_BUILDER,
      useClass: JsPdfBuilder,
    },
    {
      provide: PROGRESS_INDICATOR,
      useClass: DefaultProgressIndicator,
    },
    {
      provide: DOCUMENT_RENDERER,
      useClass: DualDocumentRenderer,
    },

    {
      provide: CONTACT_INFO,
      useFactory: (phone: string, telegram: string, email: string, whatsapp: string) => ({
        phone,
        telegram,
        email,
        whatsapp,
      }),
      deps: [PHONE_NUMBER, TELEGRAM_ACCOUNT, EMAIL, WHATSAPP],
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
    importProvidersFrom(AngularYandexMapsModule.forRoot(mapConfig)),
    provideTransloco({
      config: {
        availableLangs: ['ru', 'en'],
        defaultLang: 'ru',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    // {
    //   provide: TUI_ICON_RESOLVER,
    //   useFactory: (): TuiStringHandler<string> => {
    //     return (name: string) => {
    //       if (name.startsWith('@tui.')) {
    //         return `assets/taiga-ui/icons/${name.replace('@tui.', '')}.svg`;
    //       }
    //       return `/assets/icons/${name}.svg`;
    //     };
    //   },
    // },
    {
      provide: TUI_ICON_RESOLVER,
      useFactory: (preloadService: PreloadIconsService): TuiStringHandler<string> => {
        return (name: string) => {
          if (name.startsWith('@tui.')) {
            return `assets/taiga-ui/icons/${name.replace('@tui.', '')}.svg`;
          }

          const cachedIcon = preloadService.getIcon(name);
          if (cachedIcon) {
            return `data:image/svg+xml;base64,${btoa(cachedIcon)}`;
          }

          return `/assets/icons/${name}.svg`;
        };
      },
      deps: [PreloadIconsService],
    },
    provideImageKitLoader(environment.imageProviderUrl),
  ],
};
