import { LOCALE_ID, type Provider } from '@angular/core';
import { TUI_LANGUAGE, TUI_RUSSIAN_LANGUAGE } from '@taiga-ui/i18n';
import { of } from 'rxjs';

export const LANGUAGE_PROVIDERS: Provider[] = [
  { provide: LOCALE_ID, useValue: 'ru' },
  { provide: TUI_LANGUAGE, useValue: of(TUI_RUSSIAN_LANGUAGE) },
];
