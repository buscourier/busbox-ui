import { type Provider, signal } from '@angular/core';
import { tuiButtonOptionsProvider, tuiTextfieldOptionsProvider } from '@taiga-ui/core';
import {
  tuiCheckboxOptionsProvider,
  tuiInputNumberOptionsProvider,
  tuiRadioOptionsProvider,
} from '@taiga-ui/kit';

export const UI_PROVIDERS: Provider[] = [
  tuiRadioOptionsProvider({ size: 'm' }),
  tuiButtonOptionsProvider({ size: 'm' }),
  tuiCheckboxOptionsProvider({ size: 'm' }),
  tuiTextfieldOptionsProvider({
    size: signal('m'),
    cleaner: signal(false),
  }),
  tuiInputNumberOptionsProvider({
    min: 0,
    max: 20,
  }),
];
