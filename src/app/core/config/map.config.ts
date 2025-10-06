import type { YConfig } from 'angular-yandex-maps-v3';

import { environment } from '@env/environment';

export function getMapConfig(): YConfig {
  return {
    apikey: environment.mapApiKey,
    lang: 'ru_RU',
  };
}
