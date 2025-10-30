import { APP_INITIALIZER, type Provider } from '@angular/core';

import { APP_MEDIA_BASE_URL, APP_IMGPROXY_BASE_URL } from '@core/tokens';

interface RuntimeConfigJson {
  APP_MEDIA_BASE_URL?: string;
  APP_IMGPROXY_BASE_URL?: string;
}

function loadRuntimeConfig(factory: (cfg: RuntimeConfigJson) => void): () => Promise<void> {
  return async () => {
    try {
      const response = await fetch('/runtime-config.json', { cache: 'no-store' });
      if (!response.ok) return;
      const json = (await response.json()) as RuntimeConfigJson;
      factory(json);
    } catch {
      // ignore
    }
  };
}

export function provideRuntimeConfig(): Provider[] {
  let mediaBaseUrl = '';
  let imgproxyBaseUrl = '';

  return [
    { provide: APP_MEDIA_BASE_URL, useValue: () => mediaBaseUrl },
    { provide: APP_IMGPROXY_BASE_URL, useValue: () => imgproxyBaseUrl },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () =>
        loadRuntimeConfig((cfg) => {
          mediaBaseUrl = (cfg.APP_MEDIA_BASE_URL ?? '').replace(/\/+$/, '');
          imgproxyBaseUrl = (cfg.APP_IMGPROXY_BASE_URL ?? '').replace(/\/+$/, '');
        }),
    },
  ];
}
