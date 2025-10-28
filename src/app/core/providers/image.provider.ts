import { IMAGE_LOADER, type ImageLoaderConfig } from '@angular/common';
import { inject, type Provider } from '@angular/core';

import { APP_IMGPROXY_BASE_URL, APP_MEDIA_BASE_URL } from '@core/tokens';

export function provideImageLoader(): Provider {
  return {
    provide: IMAGE_LOADER,
    useFactory: () => {
      const imgproxyBaseGetter = inject(APP_IMGPROXY_BASE_URL);
      const mediaBaseGetter = inject(APP_MEDIA_BASE_URL);

      return (cfg: ImageLoaderConfig) => {
        const originRaw = mediaBaseGetter();
        const origin = originRaw.trim().replace(/\/+$/, '');
        const base = origin.endsWith('/images') ? origin : `${origin}/images`;
        const src = cfg.src.replace(/^\/+/, '');
        const absolute = `${base}/${src}`;

        const ops: string[] = [];
        if (cfg.width) ops.push(`w:${cfg.width}`);
        const q = cfg.loaderParams?.['q'];
        const dpr = cfg.loaderParams?.['dpr'];
        if (q) ops.push(`q:${q}`);
        if (dpr) ops.push(`dpr:${dpr}`);
        if (cfg.isPlaceholder) ops.push('blur:15', 'q:20');

        const opts = ops.length ? `/${ops.join('/')}` : '';
        // Return absolute IMGProxy URL using injected base
        return `${imgproxyBaseGetter()}/unsafe${opts}/plain/${encodeURI(absolute)}@webp`;
      };
    },
  };
}
