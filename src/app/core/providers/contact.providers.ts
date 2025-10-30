import type { Provider } from '@angular/core';

import {
  CONTACT_INFO,
  EMAIL,
  MOBILE_NUMBER,
  PHONE_NUMBER,
  TELEGRAM_ACCOUNT,
  WHATSAPP,
} from '@core/tokens';

export const CONTACTS_PROVIDERS: Provider[] = [
  {
    provide: PHONE_NUMBER,
    useValue: '+7 (423) 293 78 79',
  },
  {
    provide: MOBILE_NUMBER,
    useValue: '+7 (953) 21 96 746',
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
    provide: CONTACT_INFO,
    useFactory: (
      phone: string,
      mobile: string,
      telegram: string,
      email: string,
      whatsapp: string,
    ) => ({
      phone,
      mobile,
      telegram,
      email,
      whatsapp,
    }),
    deps: [PHONE_NUMBER, MOBILE_NUMBER, TELEGRAM_ACCOUNT, EMAIL, WHATSAPP],
  },
];
